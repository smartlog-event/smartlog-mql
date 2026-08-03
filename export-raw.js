/* Smartlog MQL — XUẤT TOÀN BỘ CÂU TRẢ LỜI THÔ của mọi lead còn lưu trong máy (localStorage).
   Chạy TRÊN CHÍNH TRANG đã dùng để nhập lead (đúng tên miền), bằng Console (PC) hoặc bookmarklet (iPhone).
   Quét mọi key localStorage → gom lead → giải mã rawAnswers thành chữ → CSV tải về + TSV để copy. */
(function () {
  // Bộ câu hỏi MKT bản hiện tại — CHỈ dùng khi trang không có biến QUESTIONS (vd chạy trên trang khác).
  var FALLBACK_QUESTIONS = [
    { id: 1, text: "Sản phẩm/giải pháp quan tâm (nhiều lựa chọn)", options: [
      { text: "Smartlog Transportation Management – STM" }, { text: "Smartlog Warehouse Management – SWM" },
      { text: "Smartlog Order Management – SOM" }, { text: "Container Optimization Solutions – COS" },
      { text: "Smartlog Transport Exchange – STX" }, { text: "Smartlog Supply Chain Planning – SSCP" },
      { text: "Smartlog Global Transportation Management – SGTM (vận tải quốc tế)" },
      { text: "Smartlog Global Partner" }, { text: "Chưa xác định rõ, cần tư vấn thêm" } ] },
    { id: 2, text: "Số xe/phương tiện vận tải (chỉ hỏi khi chọn STM)", options: [
      { text: "Chưa lấy được thông tin" }, { text: "Dưới 50 xe" }, { text: "50 – 100 xe" }, { text: "100 – 200 xe" }, { text: "Trên 200 xe" } ] },
    { id: 3, text: "Quy mô kho bãi (chỉ hỏi khi chọn SWM)", options: [
      { text: "Chưa lấy được thông tin" }, { text: "Dưới 1.000 m²" }, { text: "1.000 – 5.000 m²" }, { text: "5.000 – 10.000 m²" }, { text: "Trên 10.000 m²" } ] },
    { id: 4, text: "Số đơn hàng/tháng (chỉ hỏi khi chọn SOM)", options: [
      { text: "Chưa lấy được thông tin" }, { text: "Dưới 500 đơn/tháng" }, { text: "500 – 2.000 đơn/tháng" }, { text: "2.000 – 10.000 đơn/tháng" }, { text: "Trên 10.000 đơn/tháng" } ] },
    { id: 5, text: "Hệ thống/công cụ đang dùng để quản lý vận hành", options: [
      { text: "Chưa lấy được thông tin" }, { text: "Excel hoặc quản lý thủ công hoàn toàn" }, { text: "Phần mềm nội bộ tự phát triển" },
      { text: "Phần mềm của một đơn vị khác (không phải Smartlog)" }, { text: "Đang dùng một phần giải pháp Smartlog và muốn mở rộng" } ] },
    { id: 6, text: "Mức độ cấp bách triển khai hệ thống mới", options: [
      { text: "Chưa lấy được thông tin" }, { text: "Chỉ đang tìm hiểu, chưa có kế hoạch cụ thể" }, { text: "Đang lên ngân sách/kế hoạch cho năm tới" },
      { text: "Dự kiến triển khai trong thời gian tới" }, { text: "Cần triển khai ngay trong quý này" } ] },
    { id: 7, text: "Giai đoạn ngân sách", options: [
      { text: "Chưa lấy được thông tin" }, { text: "Chưa có ngân sách, chưa đề xuất" }, { text: "Đang trong quá trình đề xuất/xét duyệt nội bộ" },
      { text: "Đã có ngân sách dự kiến, chưa được phê duyệt chính thức" }, { text: "Ngân sách đã được phê duyệt" } ] },
    { id: 8, text: "Đã từng triển khai phần mềm quản lý vận hành chưa", options: [
      { text: "Chưa lấy được thông tin" }, { text: "Chưa bao giờ triển khai" }, { text: "Đã từng thử nhưng thất bại hoặc bỏ ngang" },
      { text: "Đang sử dụng nhưng không đáp ứng đủ nhu cầu hiện tại" }, { text: "Đã triển khai thành công và đang muốn nâng cấp" } ] },
    { id: 9, text: "Tiêu chí quan trọng nhất khi chọn đối tác công nghệ logistics", options: [
      { text: "Chưa lấy được thông tin" }, { text: "Giá cả và chi phí đầu tư" }, { text: "Tốc độ triển khai nhanh" },
      { text: "Khả năng tích hợp với hệ thống hiện có" }, { text: "Năng lực hỗ trợ và dịch vụ sau triển khai" },
      { text: "Khả năng mở rộng theo sự tăng trưởng của doanh nghiệp" } ] },
    { id: 10, text: "CBD đánh giá nhu cầu có phù hợp Smartlog không", options: [
      { text: "Phù hợp — nhu cầu khớp rõ với sản phẩm Smartlog" }, { text: "Chưa rõ — cần tìm hiểu thêm" }, { text: "Không phù hợp" } ] }
  ];

  function getQuestions() {
    try { if (typeof QUESTIONS !== 'undefined' && QUESTIONS && QUESTIONS.length) return QUESTIONS; } catch (e) {}
    return FALLBACK_QUESTIONS;
  }

  // Gom mọi lead trong localStorage, bất kể key nào (smartlog_leads_mkt, smartlog_leads, key cũ...)
  function collectLeads() {
    var out = [];
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i), v;
      try { v = JSON.parse(localStorage.getItem(k)); } catch (e) { continue; }
      if (!Array.isArray(v)) continue;
      for (var j = 0; j < v.length; j++) {
        var r = v[j];
        if (r && typeof r === 'object' && (r.rawAnswers || r.customer || r.scores)) out.push({ key: k, lead: r });
      }
    }
    return out;
  }

  function answerText(q, val) {
    if (val === undefined || val === null || val === '') return '';
    var idxs = Array.isArray(val) ? val : [val];
    return idxs.map(function (i) {
      var o = q.options && q.options[i];
      return o && o.text ? o.text : '(index ' + i + ')';
    }).join(' | ');
  }

  function buildRows() {
    var Q = getQuestions(), items = collectLeads();
    var head = ["Nguồn (key)", "Thời gian", "Họ tên", "Công ty", "SĐT", "Email", "Chức vụ", "Người phụ trách (PIC)",
      "Tư vấn 1:1", "Book meeting", "Điểm", "Phân loại", "Sản phẩm quan tâm", "Phù hợp nhu cầu", "Tags"];
    Q.forEach(function (q) { head.push("Câu " + q.id + ": " + (q.text || '')); });
    head.push("rawAnswers (JSON gốc)");

    var rows = [head];
    items.forEach(function (it) {
      var r = it.lead, c = r.customer || {}, s = r.scores || {}, ra = r.rawAnswers || {};
      var row = [it.key, r.date || '', c.name || '', c.company || '', c.phone || '', c.email || '', c.jobTitle || '', c.pic || '',
        c.consulted1v1 ? 'x' : '', c.bookedMeeting ? 'x' : '',
        s.percent != null ? s.percent + '%' : (s.total != null ? s.total : ''),
        r.classification || r.tier || '', (r.products || []).join(' | '), r.fit || '', (r.tags || []).join(' | ')];
      Q.forEach(function (q) { row.push(answerText(q, ra[q.id])); });
      row.push(JSON.stringify(ra));
      rows.push(row);
    });
    return rows;
  }

  function toCSV(rows) {
    return rows.map(function (row) {
      return row.map(function (v) { return '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"'; }).join(',');
    }).join('\r\n');
  }
  function toTSV(rows) {
    return rows.map(function (row) {
      return row.map(function (v) { return String(v == null ? '' : v).replace(/[\t\r\n]+/g, ' '); }).join('\t');
    }).join('\n');
  }

  function downloadCSV(csv) {
    var blob = new Blob(["﻿" + csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url;
    a.download = 'lead-raw-answers-' + location.hostname + '.csv';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  }

  // Overlay: iPhone không tải file tiện → copy TSV rồi dán thẳng vào Google Sheets.
  function showOverlay(rows, csv, tsv) {
    var wrap = document.createElement('div');
    wrap.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(15,23,42,.96);color:#fff;padding:16px;font:14px system-ui,-apple-system,sans-serif;display:flex;flex-direction:column;gap:10px';
    var title = document.createElement('div');
    title.innerHTML = '<strong>' + (rows.length - 1) + ' lead</strong> trên máy này (' + location.hostname +
      ').<br>Cách nhanh nhất: bấm <em>Copy</em> rồi dán (Paste) vào một tab Google Sheets trống.';
    var ta = document.createElement('textarea');
    ta.value = tsv;
    ta.style.cssText = 'flex:1;width:100%;min-height:40vh;font:12px ui-monospace,monospace;padding:8px;border-radius:8px;border:0;color:#0f172a';
    var bar = document.createElement('div');
    bar.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap';
    function btn(label, fn, bg) {
      var b = document.createElement('button');
      b.textContent = label;
      b.style.cssText = 'padding:10px 14px;border-radius:10px;border:0;font-weight:700;background:' + bg + ';color:#fff';
      b.onclick = fn; bar.appendChild(b); return b;
    }
    btn('📋 Copy (dán vào Sheets)', function () {
      ta.focus(); ta.setSelectionRange(0, ta.value.length);
      var done = false;
      try { done = document.execCommand('copy'); } catch (e) {}
      if (!done && navigator.clipboard) { navigator.clipboard.writeText(ta.value).then(function () { alert('Đã copy.'); }); }
      else { alert(done ? 'Đã copy.' : 'Không copy được tự động — bấm giữ trong khung để copy tay.'); }
    }, '#2563eb');
    btn('⬇ Tải CSV', function () { downloadCSV(csv); }, '#059669');
    btn('✕ Đóng', function () { document.body.removeChild(wrap); }, '#475569');
    wrap.appendChild(title); wrap.appendChild(ta); wrap.appendChild(bar);
    document.body.appendChild(wrap);
  }

  try {
    var rows = buildRows();
    if (rows.length < 2) { alert('Máy/trình duyệt này KHÔNG có lead nào trong localStorage (' + location.hostname + ').'); return; }
    var csv = toCSV(rows), tsv = toTSV(rows);
    if (typeof QUESTIONS === 'undefined') console.warn('[export-raw] Trang không có biến QUESTIONS — dùng bộ câu hỏi MKT mặc định để giải mã. Đối chiếu cột rawAnswers JSON nếu thấy lệch.');
    console.log('[export-raw] ' + (rows.length - 1) + ' lead. CSV:\n' + csv);
    showOverlay(rows, csv, tsv);
  } catch (e) {
    alert('Lỗi xuất câu trả lời thô: ' + e);
  }
})();
