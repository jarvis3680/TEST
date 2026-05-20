      // 計算各分支總葉節點數，輔助顯示
      function countLeaves(node) {
        if (!node.c || node.c.length === 0) return 1;
        return node.c.reduce((s, c) => s + countLeaves(c), 0);
      }
      function countByLevel(node, target) {
        let n = (node.level === target) ? 1 : 0;
        if (node.c) for (const c of node.c) n += countByLevel(c, target);
        return n;
      }
      // 渲染單一節點
      function renderNode(node, isRoot=false) {
        const lvl = node.level;
        const hasKids = node.c && node.c.length > 0;
        const isCrit = node.crit;
        const hasCrit = node.hasCrit;
        const cls = ['tn', 'tn-l'+lvl];
        if (isCrit) cls.push('crit');
        else if (hasCrit) cls.push('has-crit');
        if (!hasKids) cls.push('leaf');
        if (lvl <= 2 && isRoot) cls.push('open');  // L2 default open

        const div = document.createElement('div');
        div.className = cls.join(' ');

        // Row
        const row = document.createElement('div');
        row.className = 'tn-row';

        const chev = document.createElement('span');
        chev.className = 'tn-chev';
        chev.textContent = hasKids ? '▶' : '·';
        row.appendChild(chev);

        const tag = document.createElement('span');
        tag.className = 'tn-tag';
        tag.textContent = 'L' + lvl;
        row.appendChild(tag);

        const name = document.createElement('span');
        name.className = 'tn-name';
        name.textContent = node.name;
        if (isCrit) {
          const m = document.createElement('span');
          m.className = 'tn-crit-mark';
          m.textContent = ' ⚠';
          name.appendChild(m);
        }
        row.appendChild(name);

        // ★ v3.1 新增：節點編號 (node_sn) 顯示
        const snChip = document.createElement('span');
        snChip.className = 'tn-sn';
        snChip.textContent = '#' + node.sn;
        snChip.title = '節點編號 node_sn = ' + node.sn + ' (產業地圖 2024)';
        row.appendChild(snChip);

        // Counts on right
        if (hasKids) {
          const cnt = document.createElement('span');
          cnt.className = 'tn-cnt';
          const sub = node.c.length;
          const leaves = countLeaves(node);
          cnt.textContent = `${sub} 子項 · ${leaves} 葉`;
          row.appendChild(cnt);
        }

        if (hasKids) {
          row.addEventListener('click', () => div.classList.toggle('open'));
        }

        div.appendChild(row);

        // Children
        if (hasKids) {
          const ck = document.createElement('div');
          ck.className = 'tn-children';
          for (const child of node.c) {
            ck.appendChild(renderNode(child, false));
          }
          div.appendChild(ck);
        }
        return div;
      }
      function renderTree(rootSn) {
        const dataEl = document.getElementById('tree-data-' + rootSn);
        const container = document.getElementById('tree-' + rootSn);
        if (!dataEl || !container) return;
        const tree = JSON.parse(dataEl.textContent);
        container.innerHTML = '';
        // Render only the L2+ children of L1 (skip the L1 wrapper itself)
        if (tree.c) {
          for (const l2 of tree.c) {
            container.appendChild(renderNode(l2, true));
          }
        }
      }
      function indExpandAll() {
        document.querySelectorAll('.tree-container .tn').forEach(n => n.classList.add('open'));
        showToast('已展開所有層級');
      }
      function indCollapseAll() {
        document.querySelectorAll('.tree-container .tn').forEach(n => {
          // keep L2 open by default for navigation
          if (!n.classList.contains('tn-l2')) n.classList.remove('open');
        });
        showToast('已收合至 L2 層級');
      }
      // Render trees on page load
      window.addEventListener('DOMContentLoaded', () => {
        renderTree('8042');
        renderTree('8041');
      });