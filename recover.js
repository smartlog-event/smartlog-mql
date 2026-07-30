/* Smartlog MQL — cứu lead đã lưu trong máy (localStorage) và đẩy lên Google Sheet.
   Chạy trên trang danhgialead.smartlogvn.com (qua bookmarklet iPhone hoặc Console máy tính). */
(function () {
  try {
    var ENDPOINT = "https://script.google.com/macros/s/AKfycbyK4GfBNuXtDctvHvQqAw0mVYP4Y-4H5vS-HPZuWQNEdfKH97FE9xMPESJM7S-b6vlDLQ/exec";
    var arr = JSON.parse(localStorage.getItem('smartlog_leads_mkt') || '[]');
    if (!arr.length) { alert('Máy này không có lead đã lưu (bộ nhớ trống).'); return; }
    if (!confirm('Tìm thấy ' + arr.length + ' lead trên máy này.\nĐẩy tất cả lên Google Sheet?')) return;
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
