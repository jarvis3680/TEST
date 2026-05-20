      let ftreeData = null;
      function loadFtreeData() {
        if (ftreeData) return ftreeData;
        const el = document.getElementById('ftree-data');
        if (!el) return null;
        ftreeData = JSON.parse(el.textContent);
        return ftreeData;
      }
      function renderFtreeNode(node, isL1=false) {
        const lvl = node.l;
        const hasKids = node.c && node.c.length > 0;
        const cls = ['ftn', 'ftn-l'+lvl];
        if (node.cr) cls.push('crit');
        else if (node.hc) cls.push('has-crit');
        if (!hasKids) cls.push('leaf');
        if (isL1) cls.push('open');

        const div = document.createElement('div');
        div.className = cls.join(' ');

        const row = document.createElement('div');
        row.className = 'ftn-row';

        const arr = document.createElement('span');
        arr.className = 'ftn-arr';
        arr.textContent = hasKids ? '▶' : '·';
        if (hasKids) {
          arr.addEventListener('click', e => {
            e.stopPropagation();
            div.classList.toggle('open');
          });
        }
        row.appendChild(arr);

        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.className = 'ftn-cb';
        cb.dataset.sn = node.sn;
        cb.dataset.level = lvl;
        cb.dataset.name = node.n;
        cb.addEventListener('click', e => e.stopPropagation());
        cb.addEventListener('change', e => onFtreeCheck(e, div, node));
        row.appendChild(cb);

        const tag = document.createElement('span');
        tag.className = 'ftn-tag';
        tag.textContent = lvl;
        row.appendChild(tag);

        const name = document.createElement('span');
        name.className = 'ftn-name';
        name.textContent = node.n;
        if (node.cr) name.textContent += ' ⚠';
        row.appendChild(name);

        if (typeof node.cm === 'number' && node.cm > 0) {
          const cnt = document.createElement('span');
          cnt.className = 'ftn-cnt has';
          cnt.textContent = node.cm;
          row.appendChild(cnt);
        }
        if (typeof node.cc === 'number' && node.cc > 0) {
          const cc = document.createElement('span');
          cc.className = 'ftn-cnt-c';
          cc.textContent = '⚠'+node.cc;
          row.appendChild(cc);
        }

        // Click on row also toggles
        row.addEventListener('click', e => {
          if (e.target.closest('.ftn-cb') || e.target.closest('.ftn-arr')) return;
          if (hasKids) div.classList.toggle('open');
        });

        div.appendChild(row);

        if (hasKids) {
          const ck = document.createElement('div');
          ck.className = 'ftn-children';
          for (const c of node.c) {
            ck.appendChild(renderFtreeNode(c, false));
          }
          div.appendChild(ck);
        }
        return div;
      }
      function renderFtree() {
        const data = loadFtreeData();
        const container = document.getElementById('ftree-container');
        if (!container || !data) return;
        container.innerHTML = '';
        for (const l1 of data) {
          container.appendChild(renderFtreeNode(l1, true));
        }
      }
      function ftreeExpandTo(targetLvl) {
        const c = document.getElementById('ftree-container');
        if (!c) return;
        c.querySelectorAll('.ftn').forEach(n => {
          const lvl = parseInt(n.className.match(/ftn-l(\d)/)?.[1] || 0);
          if (lvl < targetLvl) n.classList.add('open');
          else n.classList.remove('open');
        });
        showToast(`已展開至 L${targetLvl}`);
      }
      function ftreeCollapseAll() {
        document.querySelectorAll('#ftree-container .ftn').forEach(n => {
          if (!n.classList.contains('ftn-l1')) n.classList.remove('open');
          else n.classList.remove('open');
        });
        showToast('已收合');
      }
      // Cascade check to children + bubble to parent (simplified)
      function onFtreeCheck(e, nodeDiv, nodeData) {
        const checked = e.target.checked;
        // Set children
        nodeDiv.querySelectorAll('.ftn-cb').forEach(cb => cb.checked = checked);
        // Update active filter pills (calls existing function if available)
        if (typeof updateActiveFilters === 'function') updateActiveFilters();
      }

      // Initial render after page-query is shown
      window.addEventListener('DOMContentLoaded', () => {
        renderFtree();
      });