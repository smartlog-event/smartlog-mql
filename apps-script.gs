/**
 * Smartlog — webhook GỘP cho CẢ 2 trang (MQL lead + Global contact form).
 * CHỈ ĐƯỢC CÓ 1 doPost trong project này. Dán 2 script rời vào cùng project → đè nhau → lead ghi sai tab.
 *
 * Bản 2026-08-03: thêm 8 cột câu trả lời (O..V) + đổi appendRow thành UPSERT.
 *   - Khớp dòng đã có theo cột "Thời gian" (data.date), dự phòng Họ tên + SĐT + Điểm %.
 *   - Chỉ ghi vào ô ĐANG TRỐNG → không bao giờ đè dữ liệu đã có, đẩy lại bao nhiêu lần cũng không sinh dòng trùng.
 *   - Nhờ vậy nút "↑ Đẩy lại lên Sheet" / recover.js dùng được để bơm câu trả lời cho lead cũ.
 * Sau khi dán: Deploy → Manage deployments → Edit → New version (KHÔNG tạo deployment mới, URL phải giữ nguyên).
 */

var SHEET_ID = "1WxJY6AZ0mjpqWU-kfEW743IgjHU3qq6hD3y8JVC8FZk";

var MQL_TAB = "Raw/MQL/SQL";
var MQL_BASE_HEADERS = ["Thời gian","Họ tên","Công ty","SĐT","Email","Chức vụ","Tư vấn 1:1","Book meeting","Điểm %","Sản phẩm quan tâm","Phù hợp nhu cầu","Tags","Phân loại","Người phụ trách (PIC)"];
// Câu 1 = sản phẩm (đã có cột J), Câu 10 = phù hợp nhu cầu (đã có cột K) → chỉ cần thêm câu 2..9.
var MQL_ANSWER_HEADERS = ["Câu 2: Số xe","Câu 3: Diện tích kho","Câu 4: Số đơn hàng/tháng","Câu 5: Hệ thống hiện tại","Câu 6: Mức độ cấp bách","Câu 7: Ngân sách","Câu 8: Đã từng triển khai","Câu 9: Tiêu chí chọn"];
var MQL_ANSWER_IDS = ["2","3","4","5","6","7","8","9"];
var MQL_HEADERS = MQL_BASE_HEADERS.concat(MQL_ANSWER_HEADERS);

var COL_NAME = 2, COL_PHONE = 4, COL_PERCENT = 9, COL_PIC = 14;
var COL_ANSWER_START = MQL_BASE_HEADERS.length + 1; // O

var GLOBAL_TAB = "Global";
var GLOBAL_HEADERS = ["Timestamp","Full name","Email","Phone","Company","Country","Industry","Solutions","Message","Page","User agent"];

function doPost(e){
  try{
    var data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (data.customer !== undefined || data.scores !== undefined || data.classification !== undefined) {
      return upsertMQL_(data);
    }
    if (data.trap) return reply({ ok:true });
    var g = sheet_(GLOBAL_TAB, GLOBAL_HEADERS);
    g.appendRow([
      new Date(),
      data.fullname||"", data.email||"", data.phone||"", data.company||"",
      data.country||"", data.industry||"", (data.solutions||[]).join(", "),
      data.message||"", data.page||"", data.ua||""
    ]);
    return reply({ ok:true, type:"Global" });
  }catch(err){ return reply({ status:"error", ok:false, message:String(err) }); }
}

function upsertMQL_(data){
  // Đọc-rồi-ghi → phải khoá, không thì 2 máy gửi cùng lúc sẽ ghi đè/sinh dòng trùng.
  var lock = LockService.getScriptLock();
  try { lock.waitLock(20000); } catch (e) {}
  try { return upsertMQLLocked_(data); }
  finally { try { lock.releaseLock(); } catch (e) {} }
}

function upsertMQLLocked_(data){
  var sh = sheet_(MQL_TAB, MQL_HEADERS);
  var c = data.customer || {}, s = data.scores || {};
  var answers = data.answersText || {};
  var answerVals = MQL_ANSWER_IDS.map(function(id){ return answers[id] || ""; });

  var row = findMQLRow_(sh, data, c, s);
  if (row) {
    fillEmpty_(sh, row, COL_ANSWER_START, answerVals);
    if (c.pic) fillEmpty_(sh, row, COL_PIC, [c.pic]);
    SpreadsheetApp.flush();
    return reply({ status:"success", type:"MQL", action:"updated", row:row });
  }
  sh.appendRow([
    data.date || new Date().toISOString(),
    c.name||"", c.company||"", c.phone||"", c.email||"", c.jobTitle||"",
    c.consulted1v1?"x":"", c.bookedMeeting?"x":"",
    (s.percent!=null?s.percent:0)+"%",
    data.products ? data.products.join(", ") : "",
    data.fit||"",
    data.tags ? data.tags.join(", ") : "",
    data.classification||"",
    c.pic||""
  ].concat(answerVals));
  SpreadsheetApp.flush();
  return reply({ status:"success", type:"MQL", action:"appended" });
}

/** Tìm dòng của lead đã có. 0 = chưa có. */
function findMQLRow_(sh, data, c, s){
  var last = sh.getLastRow();
  if (last < 2) return 0;
  var vals = sh.getRange(2, 1, last - 1, MQL_BASE_HEADERS.length).getValues();
  var i;

  var dkey = normDate_(data.date);
  if (dkey) {
    for (i = 0; i < vals.length; i++) if (normDate_(vals[i][0]) === dkey) return i + 2;
  }
  // Dự phòng: lead cũ có thể bị Sheets đổi định dạng cột Thời gian → khớp theo Họ tên + SĐT + Điểm.
  var name = String(c.name||"").trim().toLowerCase();
  var phone = normPhone_(c.phone);
  if (!name && !phone) return 0;
  var pct = normPct_(s.percent!=null ? s.percent : "");
  for (i = 0; i < vals.length; i++) {
    var r = vals[i];
    if (String(r[COL_NAME-1]||"").trim().toLowerCase() !== name) continue;
    if (normPhone_(r[COL_PHONE-1]) !== phone) continue;
    if (pct !== "" && normPct_(r[COL_PERCENT-1]) !== pct) continue;
    return i + 2;
  }
  return 0;
}

/** Ghi vals vào dải ô, chỉ những ô đang trống. */
function fillEmpty_(sh, row, startCol, vals){
  var rng = sh.getRange(row, startCol, 1, vals.length);
  var cur = rng.getValues()[0];
  var out = [], changed = false;
  for (var i = 0; i < vals.length; i++) {
    if ((cur[i] === "" || cur[i] === null) && vals[i] !== "" && vals[i] != null) { out.push(vals[i]); changed = true; }
    else out.push(cur[i]);
  }
  if (changed) rng.setValues([out]);
  return changed;
}

function normDate_(v){
  if (v == null || v === "") return "";
  if (Object.prototype.toString.call(v) === "[object Date]") return Utilities.formatDate(v, "UTC", "yyyy-MM-dd'T'HH:mm:ss");
  return String(v).trim().replace(/\.\d+/, "").replace(/Z$/, "").replace(/\s+/, "T");
}
function normPhone_(v){ return String(v == null ? "" : v).replace(/[^0-9]/g, ""); }
function normPct_(v){
  if (v === "" || v == null) return "";
  if (typeof v === "number") return String(Math.round(v <= 1 ? v * 100 : v));
  var n = parseFloat(String(v).replace(/[^0-9.]/g, ""));
  if (isNaN(n)) return "";
  return String(Math.round(n <= 1 ? n * 100 : n));
}

function doGet(){ return reply({ status:"live", msg:"Smartlog endpoint OK" }); }
function setup(){ sheet_(MQL_TAB, MQL_HEADERS); sheet_(GLOBAL_TAB, GLOBAL_HEADERS); return "setup ok"; }

function sheet_(name, headers){
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sh = ss.getSheetByName(name) || ss.insertSheet(name);
  var w = headers.length;
  if (sh.getMaxColumns() < w) sh.insertColumnsAfter(sh.getMaxColumns(), w - sh.getMaxColumns());
  var rng = sh.getRange(1, 1, 1, w);
  var first = rng.getValues()[0];
  // Bổ sung tiêu đề cho cột mới; chỉ ghi vào ô tiêu đề ĐANG TRỐNG (không đè tiêu đề bạn đã gõ).
  var out = [], changed = false;
  for (var i = 0; i < w; i++) {
    if (first[i] === "" || first[i] === null) { out.push(headers[i]); changed = true; }
    else out.push(first[i]);
  }
  if (changed) {
    rng.setValues([out]).setFontWeight("bold").setBackground("#2933D9").setFontColor("#FFFFFF");
    sh.setFrozenRows(1);
  }
  return sh;
}

function reply(o){ return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
