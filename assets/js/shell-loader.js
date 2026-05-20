// ══ Shell Loader ══
// 動態載入 sidebar + topbar，保持 shell.html 單一來源

(function() {
  function loadShell() {
    var root = document.body.getAttribute('data-root') || '../';
    var shellUrl = root + 'assets/html/shell.html';

    fetch(shellUrl)
      .then(function(r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      })
      .then(function(shellHtml) {
        // 修正 shell 裡的相對路徑
        // 把 '../app/dash.html' 換成正確的 root + 'app/dash.html'
        shellHtml = shellHtml
          .replace(/\.\.\/app\/dash\.html/g, root + 'app/dash.html')
          .replace(/\.\.\/index\.html/g, root + 'index.html');

        // 建立 shell 結構（補上 .main 和 .shell 的關閉標籤）
        var wrapper = document.createElement('div');
        wrapper.innerHTML = shellHtml + '</div></div>';
        var shellEl = wrapper.firstElementChild; // <div class="shell">
        var mainEl  = shellEl.querySelector('.main');

        // 把 body 下的 .content 移進 .main
        var contentEl = document.body.querySelector('.content');
        if (contentEl && mainEl) {
          mainEl.appendChild(contentEl);
        }

        // inject shell 到 body 最前面
        document.body.insertBefore(shellEl, document.body.firstChild);

        // sidebar active
        var navPage = document.body.getAttribute('data-nav-page');
        if (navPage) {
          shellEl.querySelectorAll('.side-link').forEach(function(el) {
            el.classList.remove('active');
          });
          var activeEl = shellEl.querySelector('.side-link[data-page="' + navPage + '"]');
          if (activeEl) activeEl.classList.add('active');
        }

        // 麵包屑
        var crumbEl = document.getElementById('topbar-crumb');
        if (crumbEl) {
          crumbEl.textContent = document.body.getAttribute('data-crumb') || '';
        }

        // 觸發完成事件（讓各頁面的初始化可以等 shell 完成）
        document.dispatchEvent(new CustomEvent('shell-loaded', {detail:{root:root}}));
      })
      .catch(function(e) {
        console.error('[Shell Loader] 載入失敗:', shellUrl, e);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadShell);
  } else {
    loadShell();
  }
})();
