/* Smartlog MQL — cứu lead đã lưu trong máy (localStorage) và đẩy lên Google Sheet.
   Chạy trên trang danhgialead.smartlogvn.com (qua bookmarklet iPhone hoặc Console máy tính). */
(function () {
  try {
    var ENDPOINT = "https://script.google.com/macros/s/AKfycbyK4GfBNuXtDctvHvQqAw0mVYP4Y-4H5vS-HPZuWQNEdfKH97FE9xMPESJM7S-b6vlDLQ/exec";
    var arr = JSON.parse(localStorage.getItem('smartlog_leads_mkt') || '[]');
    if (!arr.length) { alert('Máy này không có lead đã lưu (bộ nhớ trống).'); return; }
    if (!confirm('Tìm thấy ' + arr.length + ' lead trên máy này.\nĐẩy tất cả lên Google Sheet?\n(Lead đã có sẽ được bổ sung câu trả lời, không tạo dòng trùng.)')) return;
    // Giải mã câu trả lời sang chữ (dùng bộ câu hỏi của chính trang này) để Sheet lưu được.
    if (typeof QUESTIONS !== 'undefined' && QUESTIONS && QUESTIONS.length) {
      arr.forEach(function (r) {
        if (!r || r.answersText || !r.rawAnswers) return;
        var out = {};
        QUESTIONS.forEach(function (q) {
          var v = r.rawAnswers[q.id];
          var idxs = (v === undefined || v === null || v === '') ? [] : (Array.isArray(v) ? v : [v]);
          out[q.id] = idxs.map(function (i) { return (q.options[i] || {}).text || ('index ' + i); }).join(' | ');
        });
        r.answersText = out;
      });
    }
    var i = 0, ok = 0;
    (function send() {
      if (i >= arr.length) {
        alert('✅ Xong! Đã đẩy ' + ok + '/' + arr.length + ' lead lên Sheet (tab Raw/MQL/SQL).');
        return;
      }
      fetch(ENDPOINT, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(arr[i])
      }).then(function () { ok++; }).catch(function () {})
        .then(function () { i++; setTimeout(send, 250); });
    })();
  } catch (e) { alert('Lỗi khôi phục: ' + e); }
})();
