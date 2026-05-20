      // 頁面標題對應（同時更新 topbar 麵包屑）
      const PAGE_TITLES = {
        dash:'首頁總覽', query2:'廠商查詢', detail:'廠商詳細',
        cases:'歷史鑑定案件', industry:'產業地圖', tech:'關鍵技術',
        orgmgr:'集團架構管理', audit:'系統稽核日誌', settings:'系統設定',
        'adm-firm':'廠商資料管理', 'adm-industry':'產業地圖資料管理',
        'adm-tech':'關鍵技術管理', 'adm-case':'歷史鑑定資料管理',
        'adm-users':'帳號管理'
      };

      function goView(target) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById('v-app').classList.add('active');
        showPage(target || 'dash');
        showToast('登入成功 · 歡迎回來王玉姍');
        // 儲存當前帳號到 localStorage
        try { localStorage.setItem('ua_current_id', UA_CURRENT_ID); } catch(e) {}
        // 套用當前帳號權限到側邊欄
        setTimeout(() => uaApplyPerms(), 50);
      }
      function doLogin(e) {
        if (e) e.preventDefault();
        goView('dash');
        return false;
      }
      function doLogout() {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById('v-login').classList.add('active');
      }

      function showPage(id, btn, state) {
        // 隱藏所有頁面
        document.querySelectorAll('.page').forEach(p => p.style.display='none');
        const target = document.getElementById('page-'+id);
        if (target) target.style.display='block';

        // side-link active 狀態
        document.querySelectorAll('.side-link').forEach(n => n.classList.remove('active'));
        // 廠商詳細頁時，廠商查詢保持 active
        const navTarget = (id === 'detail') ? 'query2' : id;
        const navEl = document.querySelector(`.side-link[data-page="${navTarget}"]`);
        if (navEl) navEl.classList.add('active');

        // 更新 topbar 麵包屑
        const crumb = document.getElementById('topbar-crumb');
        if (crumb && PAGE_TITLES[id]) crumb.textContent = PAGE_TITLES[id];

        // v6:廠商詳細頁支援動態填值
        if (id === 'detail' && state && state.firmId && typeof renderFirmDetail === 'function') {
          renderFirmDetail(state.firmId);
        }
        // v6:廠商查詢頁支援帶 filter 觸發快捷
        if (id === 'query2' && state && state.filter && typeof q2RunShortcut === 'function') {
          // 從首頁「查看 56 家命中清單」過來時跑「命中關鍵技術」快捷
          if (state.filter === 'has-crit') {
            q2RunShortcut('hit-critical');
          }
        }

        // 帳號管理頁面初始化
        if (id === 'adm-users') {
          setTimeout(() => uaRenderTable(), 30);
        }

        // 系統設定頁面：動態渲染當前帳號權限
        if (id === 'settings') {
          setTimeout(() => settingsRenderPerms(), 30);
        }

        window.scrollTo(0,0);
      }

      // ════════════════════════════════════════════════════════
      // v6:廠商詳細頁 — 4 家 demo 廠商完整資料
      // ════════════════════════════════════════════════════════
      const FIRM_DETAIL_DATA = {
        '76027628': {
          // 日月光半導體製造（沿用原頁面寫死資料 — 此筆切換時等同還原預設）
          name: '日月光半導體製造股份有限公司',
          enName: 'ASE Semiconductor (Kaohsiung) Inc.',
          uid: '76027628',
          rep: '張虔生',
          capital: '950 億',
          capitalTotal: '95,000,000,000 元',
          capitalPaid: '59,941,437,640 元',
          emp: '32,465',
          empFull: '32,465 人',
          estYear: '1984',
          estDate: '民國 73 年 03 月 23 日',
          addr: '高雄市楠梓區經三路 26 號',
          listed: 'TSE 上市（2311）<span style="font-size:10px;color:#94a3b8;margin-left:6px">資料源：公開資訊觀測站（外部）</span>',
          logo: '日',
          logoCls: 'crit',
          riskCls: 'critical',
          riskLevel: '嚴重',
          riskBarPct: 96,
          riskFoot: '涉及 5 項 · 嚴審類別',
          hitCount: 5,
          warnSub: '建議採取 <b>嚴審</b> 程序 · 涉及《國家安全法》第三條所列關鍵技術項目 · 落入 <b>8 個</b>產業地圖節點',
          indPathTop: '電子資訊 › 半導體 › IC 封測 › IC 封裝',
          nodeCnt: '8 個',
          crossInd: '3 個一級',
          tabTechCnt: 5,
          tabCasesCnt: 7,
          // Tab 1 產業樹
          indTree: [
            {lv:'L1', name:'電子資訊產業', node:'8042'},
            {lv:'L2', name:'半導體產業',   node:'9486'},
            {lv:'L3', name:'IC 封測產業',  node:'9493'},
            {lv:'L4', name:'IC 封測',      node:'9571'},
            {lv:'L5', name:'IC 封裝',      node:'9582', cur:true},
          ],
          indSummary: { fall:'8 個', sameInd:'14 家', sameIndHit:'8 家' }
        },
        '84149961': {
          // 聯發科技
          name: '聯發科技股份有限公司',
          enName: 'MediaTek Inc.',
          uid: '84149961',
          rep: '蔡明介',
          capital: '200 億',
          capitalTotal: '20,000,000,000 元',
          capitalPaid: '15,989,250,560 元',
          emp: '12,293',
          empFull: '12,293 人',
          estYear: '1997',
          estDate: '民國 86 年 05 月 28 日',
          addr: '新竹科學園區篤行一路 1 號',
          listed: 'TSE 上市（2454）<span style="font-size:10px;color:#94a3b8;margin-left:6px">資料源：公開資訊觀測站（外部）</span>',
          logo: '聯發',
          logoCls: 'crit',
          riskCls: 'critical',
          riskLevel: '嚴重',
          riskBarPct: 88,
          riskFoot: '涉及 2 項 · 嚴審類別',
          hitCount: 2,
          warnSub: '建議採取 <b>嚴審</b> 程序 · 涉及《國家核心關鍵技術發展與保護條例》第 6 條所列關鍵技術項目 · 落入 <b>4 個</b>產業地圖節點',
          indPathTop: '新興科技應用產業 › 人工智慧產業 › 生成式 AI 核心技術平台',
          nodeCnt: '4 個',
          crossInd: '2 個一級',
          tabTechCnt: 2,
          tabCasesCnt: 3,
          indTree: [
            {lv:'L1', name:'新興科技應用產業',     node:'8041'},
            {lv:'L2', name:'人工智慧產業',         node:'8051'},
            {lv:'L3', name:'人工智慧產業',         node:'8131'},
            {lv:'L4', name:'生成式AI核心技術平台', node:'8133', cur:true},
          ],
          indSummary: { fall:'4 個', sameInd:'18 家', sameIndHit:'5 家' }
        },
        '22099131': {
          // 台積電
          name: '台灣積體電路製造股份有限公司',
          enName: 'Taiwan Semiconductor Manufacturing Company Limited',
          uid: '22099131',
          rep: '魏哲家',
          capital: '2,593 億',
          capitalTotal: '280,500,000,000 元',
          capitalPaid: '259,335,233,650 元',
          emp: '76,478',
          empFull: '76,478 人',
          estYear: '1987',
          estDate: '民國 76 年 02 月 21 日',
          addr: '新竹科學園區力行六路 8 號',
          listed: 'TSE 上市（2330）<span style="font-size:10px;color:#94a3b8;margin-left:6px">資料源：公開資訊觀測站（外部）</span>',
          logo: '台積',
          logoCls: 'crit',
          riskCls: 'critical',
          riskLevel: '嚴重',
          riskBarPct: 94,
          riskFoot: '涉及 4 項 · 嚴審類別',
          hitCount: 4,
          warnSub: '建議採取 <b>嚴審</b> 程序 · 涉及《國家核心關鍵技術發展與保護條例》第 6 條所列關鍵技術項目 · 落入 <b>6 個</b>產業地圖節點',
          indPathTop: '電子資訊 › 半導體 › IC 製造 › 晶圓代工',
          nodeCnt: '6 個',
          crossInd: '2 個一級',
          tabTechCnt: 4,
          tabCasesCnt: 12,
          indTree: [
            {lv:'L1', name:'電子資訊產業', node:'8042'},
            {lv:'L2', name:'半導體產業',   node:'9486'},
            {lv:'L3', name:'IC 製造產業',  node:'9492'},
            {lv:'L4', name:'IC 製造',      node:'9554'},
            {lv:'L5', name:'晶圓代工',     node:'9560', cur:true},
          ],
          indSummary: { fall:'6 個', sameInd:'8 家', sameIndHit:'5 家' }
        },
        '97162640': {
          // 群創光電
          name: '群創光電股份有限公司',
          enName: 'Innolux Corporation',
          uid: '97162640',
          rep: '洪進揚',
          capital: '953 億',
          capitalTotal: '110,000,000,000 元',
          capitalPaid: '95,329,810,160 元',
          emp: '36,524',
          empFull: '36,524 人',
          estYear: '2003',
          estDate: '民國 92 年 01 月 27 日',
          addr: '苗栗縣竹南鎮科學園區科東二路 160 號',
          listed: 'TSE 上市（3481）<span style="font-size:10px;color:#94a3b8;margin-left:6px">資料源：公開資訊觀測站（外部）</span>',
          logo: '群創',
          logoCls: 'mid',
          riskCls: 'high',
          riskLevel: '中高',
          riskBarPct: 72,
          riskFoot: '涉及 2 項 · 一般審類別',
          hitCount: 2,
          warnSub: '建議採取 <b>一般審查</b> 程序 · 涉及《國家核心關鍵技術發展與保護條例》第 6 條所列關鍵技術項目 · 落入 <b>3 個</b>產業地圖節點',
          indPathTop: '電子資訊 › 顯示器暨電子零組件 › TFT LCD 產業 › 模組組裝廠',
          nodeCnt: '3 個',
          crossInd: '1 個一級',
          tabTechCnt: 2,
          tabCasesCnt: 2,
          indTree: [
            {lv:'L1', name:'電子資訊產業',           node:'8042'},
            {lv:'L2', name:'顯示器暨電子零組件產業', node:'9488'},
            {lv:'L3', name:'TFT LCD 產業',          node:'9500'},
            {lv:'L4', name:'模組組裝廠',             node:'9771', cur:true},
          ],
          indSummary: { fall:'3 個', sameInd:'12 家', sameIndHit:'3 家' }
        }
      };

      function renderFirmDetail(firmId) {
        // v6:先看 FIRM_DETAIL_DATA(精緻 demo 4 家),否則從 FIRMS_DB 動態構建
        let d = FIRM_DETAIL_DATA[firmId];
        if (!d) {
          d = buildFirmDetailFromDB(firmId);
        }
        if (!d) return;

        // 安全 setter（找不到 element 時不報錯）
        const set = (id, val, isHTML) => {
          const el = document.getElementById(id);
          if (!el) return;
          if (isHTML) el.innerHTML = val;
          else el.textContent = val;
        };

        // 麵包屑
        set('fd-breadcrumb', d.name);
        // 警示橫幅
        set('fd-hit-count', d.hitCount);
        set('fd-warn-sub', d.warnSub, true);
        const banner = document.getElementById('fd-warn-banner');
        if (banner) {
          banner.classList.remove('critical','high','mid');
          banner.classList.add(d.riskCls);
        }
        // 公司頭
        const logo = document.getElementById('fd-logo');
        if (logo) {
          // 有自訂圖片的公司（統編 → 圖片路徑）
          const FIRM_LOGO_MAP = {
            '22099131': '../assets/img/logos/22099131.png',
            '76027628': '../assets/img/logos/76027628.jpg',
            '12800225': '../assets/img/logos/12800225.jpg',
            '84149961': '../assets/img/logos/84149961.gif',
          };
          const imgSrc = FIRM_LOGO_MAP[d.uid];
          if (imgSrc) {
            logo.innerHTML = `<img src="${imgSrc}" alt="${d.logo}" style="width:100%;height:100%;object-fit:contain;border-radius:12px;">`;
            logo.style.background = '#fff';
          } else {
            // 每個字用 logo-char span 包，flex-column 各占一行
            logo.innerHTML = [...(d.logo || '')].map(c => `<span class="logo-char">${c}</span>`).join('');
          }
          logo.classList.remove('crit','mid','high');
          logo.classList.add(d.logoCls);
        }
        set('fd-name', d.name);
        set('fd-en-name', d.enName);
        set('fd-uid', d.uid);
        set('fd-rep', d.rep);
        set('fd-capital', d.capital);
        set('fd-emp', d.emp);
        set('fd-est-year', d.estYear);
        set('fd-addr', d.addr);
        set('fd-ind-path-top', d.indPathTop, true);
        set('fd-node-cnt', d.nodeCnt);
        set('fd-cross-ind', d.crossInd);
        // 風險計
        const rmEl = document.getElementById('fd-risk-meter');
        if (rmEl) {
          rmEl.classList.remove('critical','high','mid');
          rmEl.classList.add(d.riskCls);
        }
        set('fd-risk-value', d.riskLevel);
        const bar = document.getElementById('fd-risk-bar');
        if (bar) bar.style.width = d.riskBarPct + '%';
        set('fd-risk-foot', d.riskFoot);
        set('fd-hit-count', d.hitCount);
        set('fd-node-cnt-rm', d.nodeCnt);
        // Tab 列徽章
        set('fd-tab-tech-cnt', d.tabTechCnt);
        set('fd-tab-cases-cnt', d.tabCasesCnt);
        // Tab 1 公司登記
        set('fd-reg-uid', d.uid);
        set('fd-reg-name', d.name);
        set('fd-reg-en', d.enName);
        set('fd-reg-rep', d.rep);
        set('fd-reg-est', d.estDate);
        set('fd-reg-cap-total', d.capitalTotal);
        set('fd-reg-cap-paid', d.capitalPaid);
        set('fd-reg-emp', d.empFull);
        set('fd-reg-addr', d.addr);
        set('fd-reg-listed', d.listed, true);
        // Tab 1 產業樹(v6:廠商所有產業路徑,改呼叫 renderFirmIndPaths)
        if (typeof renderFirmIndPaths === 'function') {
          try { renderFirmIndPaths(d.uid); } catch(e) { console.error('renderFirmIndPaths err:', e); }
        }
        // Tab 2 產業架構↔技術(v6:呼叫 renderFirmPathTech)
        if (typeof renderFirmPathTech === 'function') {
          try { renderFirmPathTech(d.uid); } catch(e) { console.error('renderFirmPathTech err:', e); }
        }
        // Tab 2 命中之核心關鍵技術(v6 任務 5:呼叫 renderFirmTechHits)
        if (typeof renderFirmTechHits === 'function') {
          try { renderFirmTechHits(d.uid); } catch(e) { console.error('renderFirmTechHits err:', e); }
        }
        // 紀錄目前廠商 ID 至全域,讓 tab 切換或其他 hook 可重渲染
        try { window.__FIRM_DETAIL_CURRENT_UID = d.uid; } catch(e) {}
      }

      // ════════════════════════════════════════════════════════════════
      // v6 任務 3:廠商所有產業路徑 — 動態渲染
      // ════════════════════════════════════════════════════════════════
      // L1 名稱 → CSS class 對映(用部分字串 match,避免全形/半形差異)
      function _ipbL1Class(l1Name) {
        if (!l1Name) return 'l1-svc';
        const s = String(l1Name);
        if (s.indexOf('電子') >= 0 || s.indexOf('資訊') >= 0) return 'l1-elec';
        if (s.indexOf('機械') >= 0 || s.indexOf('車輛') >= 0) return 'l1-mech';
        if (s.indexOf('材料') >= 0 || s.indexOf('化工') >= 0 || s.indexOf('半導體')===0) return 'l1-mat';
        if (s.indexOf('生醫') >= 0 || s.indexOf('生技') >= 0 || s.indexOf('醫療') >= 0) return 'l1-bio';
        if (s.indexOf('新興') >= 0 || s.indexOf('應用') >= 0) return 'l1-emerg';
        return 'l1-svc';
      }

      // 從 nid 往上回溯 IM_TREE 取得完整路徑 [{l, n, sn}, ...] (L1 → leaf)
      function _ipbBuildPath(nid) {
        if (typeof IM_TREE === 'undefined' || !IM_TREE[nid]) return null;
        const path = [];
        let cur = String(nid);
        let safe = 0;
        while (cur && IM_TREE[cur] && safe < 20) {
          const node = IM_TREE[cur];
          path.unshift({ l: node.l, n: node.n, sn: cur });
          cur = node.p;
          safe++;
        }
        return path.length ? path : null;
      }

      // 主渲染函式
      function renderFirmIndPaths(firmId) {
        const el = document.getElementById('fd-ind-paths');
        if (!el) return;
        const f = (typeof FIRMS_DB !== 'undefined') ? FIRMS_DB[firmId] : null;
        if (!f || !Array.isArray(f.nodes) || !f.nodes.length) {
          el.innerHTML = '<div class="ipb-empty">— 此廠商未登錄任何產業節點 —</div>';
          return;
        }

        // 為每個節點建路徑,過濾無效
        const allPaths = [];
        f.nodes.forEach(nid => {
          if (nid === '?' || !nid) return;
          const p = _ipbBuildPath(nid);
          if (p) allPaths.push(p);
        });
        if (!allPaths.length) {
          el.innerHTML = '<div class="ipb-empty">— 節點資料對應不到產業地圖 —</div>';
          return;
        }

        // 依 L1 名稱分組
        const groups = {};
        const l1Order = [];
        allPaths.forEach(p => {
          const l1 = p[0]; // L1 為第一個
          const key = l1.sn;
          if (!groups[key]) {
            groups[key] = { name: l1.n, sn: l1.sn, paths: [] };
            l1Order.push(key);
          }
          groups[key].paths.push(p);
        });

        // 渲染:預設前 3 個 L1 群組展開,其餘收合;群組內 >5 條時隱藏多餘
        const html = l1Order.map((key, gi) => {
          const g = groups[key];
          const cls = _ipbL1Class(g.name);
          const collapsed = gi >= 3;
          const pathsHtml = g.paths.map((p, pi) => {
            const hidden = (pi >= 5);
            const chips = p.map(node => {
              const lvCls = 'lv' + Math.min(node.l, 7);
              return `<span class="ipb-chip ${lvCls}">${node.n}</span>`;
            }).join('<span class="ipb-arr">›</span>');
            return `<div class="ipb-path${hidden ? ' ipb-hidden' : ''}">${chips}</div>`;
          }).join('');
          const moreBtn = (g.paths.length > 5)
            ? `<button class="ipb-more-btn" type="button" onclick="ipbToggleMore(this)">展開其餘 ${g.paths.length - 5} 條 ▼</button>`
            : '';
          return `<div class="ipb-group ${cls}${collapsed ? ' collapsed' : ''}" data-l1="${g.sn}">
            <div class="ipb-group-head" onclick="ipbToggleGroup(this)">
              <span class="ipb-caret">▼</span>
              <span class="ipb-l1-name">${g.name}</span>
              <span class="ipb-l1-cnt">${g.paths.length} 條路徑</span>
            </div>
            <div class="ipb-group-body">${pathsHtml}${moreBtn}</div>
          </div>`;
        }).join('');

        el.innerHTML = html;
      }

      // 群組摺疊/展開
      function ipbToggleGroup(headEl) {
        const g = headEl.closest('.ipb-group');
        if (g) g.classList.toggle('collapsed');
      }

      // 「展開其餘 X 條」按鈕
      function ipbToggleMore(btnEl) {
        const body = btnEl.parentElement;
        if (!body) return;
        const hidden = body.querySelectorAll('.ipb-path.ipb-hidden');
        if (hidden.length) {
          // 展開
          hidden.forEach(p => p.classList.remove('ipb-hidden'));
          btnEl.textContent = '收合 ▲';
          btnEl.dataset.expanded = '1';
        } else if (btnEl.dataset.expanded === '1') {
          // 收合(對所有第 6 條以後的 ipb-path 重新加 hidden)
          const all = body.querySelectorAll('.ipb-path');
          all.forEach((p, i) => { if (i >= 5) p.classList.add('ipb-hidden'); });
          btnEl.textContent = '展開其餘 ' + (all.length - 5) + ' 條 ▼';
          btnEl.dataset.expanded = '0';
        }
      }


      // ════════════════════════════════════════════════════════════════
      // v6 任務 4:廠商頁 Tab 2「產業架構↔技術」表格動態渲染
      // 資料源:Excel sheet 4「產業地圖-節點-廠商列表-國家核心關鍵技術標註」
      // 4 家 demo 廠商之真實節點 × 國家核心關鍵技術項目對應
      // ════════════════════════════════════════════════════════════════
      const FIRM_PATH_TECH = {
        "76027628": [
          {nid:"9582", techs:[{"code": 28, "name": "低溫半導體晶片電路設計與製程"}, {"code": 29, "name": "14 奈米以下製程之 IC 製造技術及其關鍵氣體、化學品及設備技術"}, {"code": 30, "name": "異質整合封裝技術-晶圓級封裝技術、矽光子整合封裝技術及其特殊必要材料與設備技術"}, {"code": 31, "name": "毫米波氮化鎵(GaN)功率放大器單晶微波積體電路之晶片設計技術"}, {"code": 32, "name": "高頻功率放大器之氮化鎵(GaN)半導體製造技術"}, {"code": 33, "name": "高電壓功率元件之碳化矽(SiC)半導體製造技術"}, {"code": 34, "name": "人工智慧運算之高效能晶片設計技術"}, {"code": 35, "name": "高頻寬密度小晶片互聯電路設計技術"}]},
          {nid:"9583", techs:[{"code": 28, "name": "低溫半導體晶片電路設計與製程"}, {"code": 29, "name": "14 奈米以下製程之 IC 製造技術及其關鍵氣體、化學品及設備技術"}, {"code": 30, "name": "異質整合封裝技術-晶圓級封裝技術、矽光子整合封裝技術及其特殊必要材料與設備技術"}, {"code": 31, "name": "毫米波氮化鎵(GaN)功率放大器單晶微波積體電路之晶片設計技術"}, {"code": 32, "name": "高頻功率放大器之氮化鎵(GaN)半導體製造技術"}, {"code": 33, "name": "高電壓功率元件之碳化矽(SiC)半導體製造技術"}, {"code": 34, "name": "人工智慧運算之高效能晶片設計技術"}, {"code": 35, "name": "高頻寬密度小晶片互聯電路設計技術"}]},
          {nid:"9194", techs:[{"code": 28, "name": "低溫半導體晶片電路設計與製程"}, {"code": 29, "name": "14 奈米以下製程之 IC 製造技術及其關鍵氣體、化學品及設備技術"}, {"code": 30, "name": "異質整合封裝技術-晶圓級封裝技術、矽光子整合封裝技術及其特殊必要材料與設備技術"}, {"code": 31, "name": "毫米波氮化鎵(GaN)功率放大器單晶微波積體電路之晶片設計技術"}, {"code": 32, "name": "高頻功率放大器之氮化鎵(GaN)半導體製造技術"}, {"code": 33, "name": "高電壓功率元件之碳化矽(SiC)半導體製造技術"}, {"code": 34, "name": "人工智慧運算之高效能晶片設計技術"}, {"code": 35, "name": "高頻寬密度小晶片互聯電路設計技術"}]},
          {nid:"9828", techs:[{"code": 30, "name": "異質整合封裝技術-晶圓級封裝技術、矽光子整合封裝技術及其特殊必要材料與設備技術"}]},
          {nid:"9439", techs:[{"code": 30, "name": "異質整合封裝技術-晶圓級封裝技術、矽光子整合封裝技術及其特殊必要材料與設備技術"}, {"code": 31, "name": "毫米波氮化鎵(GaN)功率放大器單晶微波積體電路之晶片設計技術"}, {"code": 32, "name": "高頻功率放大器之氮化鎵(GaN)半導體製造技術"}, {"code": 33, "name": "高電壓功率元件之碳化矽(SiC)半導體製造技術"}, {"code": 34, "name": "人工智慧運算之高效能晶片設計技術"}, {"code": 35, "name": "高頻寬密度小晶片互聯電路設計技術"}]},
          {nid:"10032", techs:[{"code": 28, "name": "低溫半導體晶片電路設計與製程"}, {"code": 29, "name": "14 奈米以下製程之 IC 製造技術及其關鍵氣體、化學品及設備技術"}, {"code": 30, "name": "異質整合封裝技術-晶圓級封裝技術、矽光子整合封裝技術及其特殊必要材料與設備技術"}, {"code": 31, "name": "毫米波氮化鎵(GaN)功率放大器單晶微波積體電路之晶片設計技術"}, {"code": 32, "name": "高頻功率放大器之氮化鎵(GaN)半導體製造技術"}, {"code": 33, "name": "高電壓功率元件之碳化矽(SiC)半導體製造技術"}, {"code": 34, "name": "人工智慧運算之高效能晶片設計技術"}, {"code": 35, "name": "高頻寬密度小晶片互聯電路設計技術"}]},
          {nid:"10261", techs:[{"code": 28, "name": "低溫半導體晶片電路設計與製程"}, {"code": 29, "name": "14 奈米以下製程之 IC 製造技術及其關鍵氣體、化學品及設備技術"}, {"code": 30, "name": "異質整合封裝技術-晶圓級封裝技術、矽光子整合封裝技術及其特殊必要材料與設備技術"}, {"code": 31, "name": "毫米波氮化鎵(GaN)功率放大器單晶微波積體電路之晶片設計技術"}, {"code": 32, "name": "高頻功率放大器之氮化鎵(GaN)半導體製造技術"}, {"code": 33, "name": "高電壓功率元件之碳化矽(SiC)半導體製造技術"}, {"code": 34, "name": "人工智慧運算之高效能晶片設計技術"}, {"code": 35, "name": "高頻寬密度小晶片互聯電路設計技術"}]},
          {nid:"10262", techs:[{"code": 28, "name": "低溫半導體晶片電路設計與製程"}, {"code": 29, "name": "14 奈米以下製程之 IC 製造技術及其關鍵氣體、化學品及設備技術"}, {"code": 30, "name": "異質整合封裝技術-晶圓級封裝技術、矽光子整合封裝技術及其特殊必要材料與設備技術"}, {"code": 31, "name": "毫米波氮化鎵(GaN)功率放大器單晶微波積體電路之晶片設計技術"}, {"code": 32, "name": "高頻功率放大器之氮化鎵(GaN)半導體製造技術"}, {"code": 33, "name": "高電壓功率元件之碳化矽(SiC)半導體製造技術"}, {"code": 34, "name": "人工智慧運算之高效能晶片設計技術"}, {"code": 35, "name": "高頻寬密度小晶片互聯電路設計技術"}]},
        ],
        "22099131": [
          {nid:"8903", techs:[{"code": 30, "name": "異質整合封裝技術-晶圓級封裝技術、矽光子整合封裝技術及其特殊必要材料與設備技術"}, {"code": 34, "name": "人工智慧運算之高效能晶片設計技術"}, {"code": 35, "name": "高頻寬密度小晶片互聯電路設計技術"}]},
          {nid:"8503", techs:[]},
          {nid:"8914", techs:[{"code": 30, "name": "異質整合封裝技術-晶圓級封裝技術、矽光子整合封裝技術及其特殊必要材料與設備技術"}, {"code": 34, "name": "人工智慧運算之高效能晶片設計技術"}, {"code": 35, "name": "高頻寬密度小晶片互聯電路設計技術"}]},
          {nid:"9560", techs:[{"code": 29, "name": "14 奈米以下製程之 IC 製造技術及其關鍵氣體、化學品及設備技術"}, {"code": 30, "name": "異質整合封裝技術-晶圓級封裝技術、矽光子整合封裝技術及其特殊必要材料與設備技術"}, {"code": 34, "name": "人工智慧運算之高效能晶片設計技術"}, {"code": 35, "name": "高頻寬密度小晶片互聯電路設計技術"}]},
          {nid:"9612", techs:[{"code": 31, "name": "毫米波氮化鎵(GaN)功率放大器單晶微波積體電路之晶片設計技術"}, {"code": 32, "name": "高頻功率放大器之氮化鎵(GaN)半導體製造技術"}]},
          {nid:"9614", techs:[{"code": 33, "name": "高電壓功率元件之碳化矽(SiC)半導體製造技術"}]},
          {nid:"9610", techs:[{"code": 31, "name": "毫米波氮化鎵(GaN)功率放大器單晶微波積體電路之晶片設計技術"}, {"code": 32, "name": "高頻功率放大器之氮化鎵(GaN)半導體製造技術"}]},
          {nid:"9627", techs:[{"code": 31, "name": "毫米波氮化鎵(GaN)功率放大器單晶微波積體電路之晶片設計技術"}, {"code": 32, "name": "高頻功率放大器之氮化鎵(GaN)半導體製造技術"}]},
          {nid:"9628", techs:[{"code": 33, "name": "高電壓功率元件之碳化矽(SiC)半導體製造技術"}]},
          {nid:"9630", techs:[{"code": 33, "name": "高電壓功率元件之碳化矽(SiC)半導體製造技術"}]},
          {nid:"9193", techs:[]},
          {nid:"9439", techs:[{"code": 29, "name": "14 奈米以下製程之 IC 製造技術及其關鍵氣體、化學品及設備技術"}, {"code": 30, "name": "異質整合封裝技術-晶圓級封裝技術、矽光子整合封裝技術及其特殊必要材料與設備技術"}, {"code": 34, "name": "人工智慧運算之高效能晶片設計技術"}, {"code": 35, "name": "高頻寬密度小晶片互聯電路設計技術"}]},
          {nid:"9995", techs:[{"code": 29, "name": "14 奈米以下製程之 IC 製造技術及其關鍵氣體、化學品及設備技術"}]},
          {nid:"10008", techs:[{"code": 29, "name": "14 奈米以下製程之 IC 製造技術及其關鍵氣體、化學品及設備技術"}, {"code": 30, "name": "異質整合封裝技術-晶圓級封裝技術、矽光子整合封裝技術及其特殊必要材料與設備技術"}, {"code": 34, "name": "人工智慧運算之高效能晶片設計技術"}, {"code": 35, "name": "高頻寬密度小晶片互聯電路設計技術"}]},
          {nid:"10259", techs:[{"code": 29, "name": "14 奈米以下製程之 IC 製造技術及其關鍵氣體、化學品及設備技術"}, {"code": 30, "name": "異質整合封裝技術-晶圓級封裝技術、矽光子整合封裝技術及其特殊必要材料與設備技術"}, {"code": 34, "name": "人工智慧運算之高效能晶片設計技術"}, {"code": 35, "name": "高頻寬密度小晶片互聯電路設計技術"}]},
        ],
        "84149961": [
          {nid:"8149", techs:[{"code": 34, "name": "人工智慧運算之高效能晶片設計技術"}, {"code": 35, "name": "高頻寬密度小晶片互聯電路設計技術"}]},
          {nid:"8128", techs:[]},
          {nid:"8153", techs:[{"code": 34, "name": "人工智慧運算之高效能晶片設計技術"}, {"code": 35, "name": "高頻寬密度小晶片互聯電路設計技術"}]},
          {nid:"8903", techs:[{"code": 34, "name": "人工智慧運算之高效能晶片設計技術"}, {"code": 35, "name": "高頻寬密度小晶片互聯電路設計技術"}]},
          {nid:"9545", techs:[{"code": 34, "name": "人工智慧運算之高效能晶片設計技術"}, {"code": 35, "name": "高頻寬密度小晶片互聯電路設計技術"}]},
          {nid:"9683", techs:[]},
          {nid:"9684", techs:[]},
          {nid:"8630", techs:[]},
          {nid:"8913", techs:[{"code": 34, "name": "人工智慧運算之高效能晶片設計技術"}, {"code": 35, "name": "高頻寬密度小晶片互聯電路設計技術"}]},
          {nid:"9423", techs:[]},
          {nid:"9424", techs:[]},
          {nid:"9642", techs:[{"code": 34, "name": "人工智慧運算之高效能晶片設計技術"}]},
          {nid:"9644", techs:[]},
          {nid:"9645", techs:[]},
          {nid:"9646", techs:[]},
          {nid:"9654", techs:[]},
          {nid:"9706", techs:[]},
          {nid:"9707", techs:[]},
          {nid:"9708", techs:[{"code": 34, "name": "人工智慧運算之高效能晶片設計技術"}]},
          {nid:"9709", techs:[]},
          {nid:"9760", techs:[]},
          {nid:"9439", techs:[{"code": 34, "name": "人工智慧運算之高效能晶片設計技術"}, {"code": 35, "name": "高頻寬密度小晶片互聯電路設計技術"}]},
          {nid:"9933", techs:[{"code": 34, "name": "人工智慧運算之高效能晶片設計技術"}]},
          {nid:"9914", techs:[]},
          {nid:"9960", techs:[]},
          {nid:"9930", techs:[]},
          {nid:"10256", techs:[{"code": 34, "name": "人工智慧運算之高效能晶片設計技術"}, {"code": 35, "name": "高頻寬密度小晶片互聯電路設計技術"}]},
        ],
        "97162640": [
          {nid:"9077", techs:[]},
          {nid:"9081", techs:[]},
        ],
      };

      // 用 IM_TREE 把 nid 推導成 path 物件陣列(L1 → leaf)
      function _fptBuildPath(nid) {
        if (typeof IM_TREE === 'undefined' || !IM_TREE[nid]) return null;
        const path = [];
        let cur = String(nid);
        let safe = 0;
        while (cur && IM_TREE[cur] && safe < 20) {
          const node = IM_TREE[cur];
          path.unshift({ l: node.l, n: node.n, sn: cur });
          cur = node.p;
          safe++;
        }
        return path.length ? path : null;
      }

      // 主渲染函式:在 #firmPathTechBody 動態長出 <tr> rows
      function renderFirmPathTech(firmId) {
        const tbody = document.getElementById('firmPathTechBody');
        if (!tbody) return;
        const records = (typeof FIRM_PATH_TECH !== 'undefined') ? FIRM_PATH_TECH[firmId] : null;
        if (!records || !records.length) {
          tbody.innerHTML = '<tr><td colspan="2" style="text-align:center;color:#94a3b8;font-style:italic;padding:24px">— 此廠商無 Excel 真實對應資料(目前僅 4 家 demo 廠商有完整標註) —</td></tr>';
          return;
        }
        const html = records.map(rec => {
          const path = _fptBuildPath(rec.nid);
          let pathHtml;
          if (path && path.length) {
            const parts = path.map((n, i) => {
              const isLeaf = (i === path.length - 1);
              return isLeaf
                ? `<span class="leaf">${n.n}</span>`
                : `${n.n}`;
            });
            pathHtml = `<span class="pt-path">${parts.join('<span class="arr">›</span>')}</span>`;
          } else {
            pathHtml = `<span class="pt-path" style="color:#94a3b8">節點 ${rec.nid} 對應不到產業地圖</span>`;
          }
          let techHtml;
          const isHit = rec.techs && rec.techs.length > 0;
          if (isHit) {
            const lines = rec.techs.map(t =>
              `<span class="pt-tech" title="${t.name}"><span class="num">${t.code}</span>${t.name}</span>`
            ).join('');
            techHtml = `<div class="pt-tech-lines">${lines}</div>`;
          } else {
            techHtml = '<span class="pt-na">N.A.</span>';
          }
          const trCls = isHit ? 'hit' : '';
          return `<tr class="${trCls}"><td>${pathHtml}</td><td>${techHtml}</td></tr>`;
        }).join('');
        tbody.innerHTML = html;
      }

      // ════════════════════════════════════════════════════════════════
      // v6 任務 5:廠商頁 Tab 2「命中之國家核心關鍵技術(含技術架構)」動態渲染
      // 邏輯:
      //  1. 從 FIRM_PATH_TECH[uid] 撈出 unique 命中技術代碼
      //  2. 對每個 code,查 TECH42_DATA[code] 拿完整 archs[]
      //  3. 用「廠商比對函式」判斷每個 sub-arch 是否該廠商被盤點為代表
      //     (firms[].name 含廠商簡稱即視為命中)
      //  4. 命中 → arch-h 紅底線;未命中 → arch-m 灰字
      //  5. 主標項判定:該技術下任一 arch 廠商命中,且非單一 arch 才標 ★主標項
      //     (依原樣 30、34 為主標項;邏輯上 architect 中該廠商命中 ≥ 2 個 arch 即主標)
      // ════════════════════════════════════════════════════════════════
      // 廠商統編 → 用於 TECH42 比對的「短名」對映
      const _FTH_FIRM_SHORT = {
        '76027628': ['日月光投控','日月光半導體','日月光'],
        '22099131': ['台積電','TSMC'],
        '84149961': ['聯發科','MediaTek'],
        '97162640': ['群創','關貿'],
      };
      function _fthMatchesFirm(uid, archFirms) {
        const aliases = _FTH_FIRM_SHORT[uid] || [];
        if (!aliases.length || !Array.isArray(archFirms)) return false;
        for (const f of archFirms) {
          const fname = String(f.name || '');
          for (const alias of aliases) {
            if (fname.indexOf(alias) >= 0) return true;
          }
        }
        return false;
      }
      // 把 archs 的 note 串(含「註1. AAA: ...」)轉為去重後的 {num,text} 陣列,
      // 並重新編號從 1 開始。
      function _fthCollectNotes(archs) {
        const seen = new Set();
        const out = [];
        let n = 1;
        for (const a of archs) {
          const noteText = a.note || '';
          if (!noteText) continue;
          // 用「註X.」分割
          const parts = noteText.split(/註\s*\d+[.\.]\s*/);
          for (const p of parts) {
            const t = p.trim();
            if (!t) continue;
            if (seen.has(t)) continue;
            seen.add(t);
            out.push({ num: n++, text: t });
          }
        }
        return out;
      }

      function renderFirmTechHits(firmId) {
        const container = document.getElementById('firmTechHitContainer');
        const sumEl = document.getElementById('firmTechHitSummary');
        const mainEl = document.getElementById('firmTechHitMain');
        if (!container) return;

        // 蒐集 unique 命中技術代碼
        const records = (typeof FIRM_PATH_TECH !== 'undefined') ? FIRM_PATH_TECH[firmId] : null;
        const codeSet = new Set();
        if (records && records.length) {
          for (const r of records) {
            if (Array.isArray(r.techs)) {
              for (const t of r.techs) if (t && t.code) codeSet.add(t.code);
            }
          }
        }
        const codes = Array.from(codeSet).sort((a,b) => a-b);

        // 簡介列:更新命中項數
        if (sumEl) sumEl.textContent = `本廠商涉及 ${codes.length} 項國家核心關鍵技術`;
        if (mainEl) mainEl.textContent = '';

        // 若 0 項
        if (!codes.length) {
          container.innerHTML = '<div style="padding:24px;text-align:center;color:#94a3b8;font-style:italic;font-size:13px">— 本廠商未涉及任何國家核心關鍵技術 —</div>';
          return;
        }

        // 對每個命中代碼渲染一個 tech-row(不再有「主標項」概念)
        const html = codes.map((code, idx) => {
          const t = (typeof TECH42_DATA !== 'undefined') ? TECH42_DATA[String(code)] : null;
          if (!t) {
            return `<div class="tech-row">
              <div class="tr-title"><span class="tr-seq">${idx+1}</span><span class="tr-num">${code}</span>(技術資料尚未建檔)</div>
            </div>`;
          }
          // archs 串接
          const archParts = t.archs.map(a => {
            const hit = _fthMatchesFirm(firmId, a.firms);
            const cls = hit ? 'arch-h' : 'arch-m';
            const cleanName = String(a.name || '').replace(/\s+/g, ' ').trim();
            return `<span class="${cls}">${cleanName}</span>`;
          }).join('<span class="arch-dash">－</span>');

          // 註解去重 + 重新編號
          const notes = _fthCollectNotes(t.archs);
          const notesHtml = notes.length
            ? `<div class="tr-notes">${notes.map(n => `<b>註${n.num}.</b>${n.text}`).join('')}</div>`
            : '';

          return `<div class="tech-row">
            <div class="tr-title">
              <span class="tr-seq">${idx+1}</span><span class="tr-num">${code}</span>${t.name}
            </div>
            <div class="tr-arch-line">
              <span class="tr-arch-prefix">技術架構:</span>
              ${archParts}。
            </div>
            ${notesHtml}
          </div>`;
        }).join('');

        container.innerHTML = html;
      }


      // v6:從 FIRMS_DB 任一家廠商建構 detail 頁所需資料物件
      function buildFirmDetailFromDB(firmId) {
        const f = FIRMS_DB[firmId];
        if (!f) return null;

        // 民國年月日 → 民國 X 年 MM 月 DD 日
        const fmtRegDate = (d) => {
          if (!d) return '— 未填報 —';
          const s = String(d).trim();
          if (s.length === 7) {
            const y = parseInt(s.slice(0,3),10);
            const m = s.slice(3,5);
            const dd = s.slice(5,7);
            return `民國 ${y} 年 ${m} 月 ${dd} 日`;
          } else if (s.length === 6) {
            const y = parseInt(s.slice(0,2),10);
            const m = s.slice(2,4);
            const dd = s.slice(4,6);
            return `民國 ${y} 年 ${m} 月 ${dd} 日`;
          }
          return s;
        };
        // 西元年(粗估民國 + 1911)
        const estYear = (() => {
          if (!f.regDate) return '—';
          const s = String(f.regDate).trim();
          if (s.length >= 6) {
            const y = parseInt(s.slice(0,3),10) || parseInt(s.slice(0,2),10);
            return y > 0 ? (y + 1911) : '—';
          }
          return '—';
        })();
        // 資本額顯示
        const capStr = f.capital >= 100000000
          ? Math.round(f.capital/100000000).toLocaleString() + ' 億'
          : (f.capital >= 10000 ? Math.round(f.capital/10000).toLocaleString() + ' 萬' : (f.capital||0).toLocaleString());
        const capTotalStr = (f.capital||0).toLocaleString() + ' 元';
        // 員工
        const empStr = f.emp > 0 ? f.emp.toLocaleString() : '—';
        const empFullStr = f.emp > 0 ? f.emp.toLocaleString() + ' 人' : '— 未填報 —';
        // 地址(縣市區簡寫)
        const addrShort = (f.addr || '').replace(/[臺台]/g,'臺').replace(/^(.{2,3}[市縣].{2,3}[區市鄉鎮]).*/, '$1') || (f.addr || '—');
        // 計算產業路徑(取第一個節點)
        const path = getFirmIndPath(f);
        const indTree = path.map((p,i) => ({lv:p.lvl, name:p.name, node:p.sn, cur: i===path.length-1}));
        // 頂部產業路徑列(短版)
        const topPathStr = path.length > 0
          ? path.map(p => p.name.replace(/產業$/,'')).join(' › ')
            + (path.length > 0 ? ` <span style="font-family:'JetBrains Mono',monospace;background:rgba(255,255,255,0.15);padding:1px 6px;border-radius:3px;margin-left:6px;font-size:10px">node:${path[path.length-1].sn}</span>` : '')
          : '<span style="opacity:.6">— 無對應產業節點 —</span>';
        
        // 風險等級(用統編 hash 模擬)
        const hashVal = parseInt(firmId.slice(-2), 10) || 0;
        const isCritical = hashVal % 7 < 2;
        const isHigh = !isCritical && hashVal % 7 < 3;
        const hitCount = isCritical ? (3 + hashVal % 3) : (isHigh ? (1 + hashVal % 2) : 0);
        const riskCls = isCritical ? 'critical' : (isHigh ? 'high' : 'mid');
        const riskLevel = isCritical ? '嚴重' : (isHigh ? '中高' : '中度');
        const riskBarPct = isCritical ? 92 : (isHigh ? 72 : 50);
        const riskFoot = hitCount > 0 ? `命中 ${hitCount} 項 · ${isCritical?'嚴':'一般'}審類別` : '無命中關鍵技術';
        const warnSub = hitCount > 0
          ? `建議採取 <b>${isCritical?'嚴審':'一般審查'}</b> 程序 · 涉及《國家核心關鍵技術發展與保護條例》第 6 條所列關鍵技術項目 · 落入 <b>${f.nodes.length} 個</b>產業地圖節點`
          : `本廠商未涉及國家核心關鍵技術 · 落入 <b>${f.nodes.length} 個</b>產業地圖節點`;
        
        // logo 顯示文字
        const logoText = (f.name || '').slice(0, 2);
        
        // L1 數(統計落入幾個 L1)
        const l1Set = new Set();
        for (const nid of f.nodes) {
          let cur = nid;
          while (cur && IM_TREE[cur]) {
            if (IM_TREE[cur].l === 1) { l1Set.add(cur); break; }
            cur = IM_TREE[cur].p;
          }
        }
        // 同產業 L? 廠商統計
        const lastNode = path.length > 0 ? path[path.length-1].sn : null;
        const sameIndCount = lastNode && NODE_FIRMS[lastNode] ? NODE_FIRMS[lastNode].length : 1;
        
        return {
          name: f.name,
          enName: '— 未提供英文名稱 —',
          uid: f.uid,
          rep: f.rep || '— 未填報 —',
          capital: capStr,
          capitalTotal: capTotalStr,
          capitalPaid: capTotalStr,
          emp: empStr,
          empFull: empFullStr,
          estYear: estYear,
          estDate: fmtRegDate(f.regDate),
          addr: f.addr || '— 未填報 —',
          listed: '<span style="color:#94a3b8">— 上市櫃資料未連結 —</span>',
          logo: logoText,
          logoCls: isCritical ? 'crit' : (isHigh ? 'mid' : 'mid'),
          riskCls: riskCls,
          riskLevel: riskLevel,
          riskBarPct: riskBarPct,
          riskFoot: riskFoot,
          hitCount: hitCount,
          warnSub: warnSub,
          indPathTop: topPathStr,
          nodeCnt: `${f.nodes.length} 個`,
          crossInd: `${l1Set.size} 個一級`,
          tabTechCnt: hitCount,
          tabCasesCnt: hitCount > 0 ? (hashVal % 5) : 0,
          indTree: indTree.length > 0 ? indTree : [{lv:'L?', name:'— 無對應產業節點 —', node:'-'}],
          indSummary: {
            fall: `${f.nodes.length} 個`,
            sameInd: `${sameIndCount} 家`,
            sameIndHit: `${Math.max(0, Math.floor(sameIndCount * 0.3))} 家`,
          }
        };
      }


      function switchTab(e, paneId) {
        const tabs = e.currentTarget.parentNode.querySelectorAll('.tab');
        tabs.forEach(t => t.classList.remove('on'));
        e.currentTarget.classList.add('on');
        const wrap = e.currentTarget.parentNode.parentNode;
        wrap.querySelectorAll('.tab-pane').forEach(p => { p.style.display='none'; p.classList.remove('on'); });
        const target = document.getElementById(paneId);
        if (target) { target.style.display='block'; target.classList.add('on'); }
        // v6 多重保險:切 tab 時補一次渲染(若空殼則填充)
        try {
          const uid = window.__FIRM_DETAIL_CURRENT_UID;
          if (!uid) return;
          if (paneId === 'tab-basic') {
            const el = document.getElementById('fd-ind-paths');
            if (el && el.children.length === 0 && typeof renderFirmIndPaths === 'function') {
              renderFirmIndPaths(uid);
            }
          } else if (paneId === 'tab-tech') {
            const tb = document.getElementById('firmPathTechBody');
            if (tb && tb.children.length === 0 && typeof renderFirmPathTech === 'function') {
              renderFirmPathTech(uid);
            }
            const cn = document.getElementById('firmTechHitContainer');
            if (cn && cn.children.length === 0 && typeof renderFirmTechHits === 'function') {
              renderFirmTechHits(uid);
            }
          }
        } catch(err) { /* 安靜失敗 */ }
      }
      // ★ v3 新增：年報摘要分頁切換
      function switchAnnual(e, paneId) {
        const tabs = e.currentTarget.parentNode.querySelectorAll('.annual-tab');
        tabs.forEach(t => t.classList.remove('on'));
        e.currentTarget.classList.add('on');
        const card = e.currentTarget.closest('.annual-card');
        card.querySelectorAll('.annual-content').forEach(p => p.style.display = 'none');
        const target = document.getElementById(paneId);
        if (target) target.style.display = 'block';
      }
      // ★ v3 新增：變更說明面板開合
      function toggleV3Changelog() {
        const p = document.getElementById('v3ChangelogPanel');
        if (p) p.classList.toggle('show');
      }
      function toggleTree(el) {
        const li = el.closest('.tree-item');
        if (li) li.classList.toggle('open');
      }
      // ★ v3.3 新增：歷史鑑定卡片之長文展開/收合
      function toggleLong(btn) {
        const wrap = btn.closest('.cv33-long');
        const body = wrap.querySelector('.cv33-long-body');
        const lbl  = btn.querySelector('.lbl');
        wrap.classList.toggle('expanded');
        body.classList.toggle('collapsed');
        if (lbl) lbl.textContent = wrap.classList.contains('expanded') ? '收合' : '展開全文';
      }
      // ★ v3.3 新增：42 項關鍵技術手風琴展開/收合（多開模式）
      function toggle42(panelId) {
        const panel = document.getElementById(panelId);
        if (!panel) return;
        // 找到緊鄰前面的卡片以同步切換箭頭
        let prev = panel.previousElementSibling;
        while (prev && !prev.classList.contains('tg-card')) {
          prev = prev.previousElementSibling;
        }
        panel.classList.toggle('expanded');
        if (prev) prev.classList.toggle('expanded');
      }
      // ★ v3.3 新增：歷史鑑定進階搜尋區收合
      function toggleAdvSearch() {
        const adv = document.getElementById('advSearch');
        if (adv) adv.classList.toggle('collapsed');
      }

      // ════════════════════════════════════════════════════════════════
      // v5 新增：歷史鑑定附件模擬上傳/替換
      // ════════════════════════════════════════════════════════════════
      function cdMockReplace(btn, slotName) {
        // 模擬替換流程：呼叫檔案選取後，跳出成功提示
        const slot = btn.closest('.cd-file-slot');
        if (!slot) return;
        // 觸發隱藏 file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,.docx,.doc,.png,.jpg,.jpeg';
        input.onchange = (e) => {
          const file = e.target.files && e.target.files[0];
          if (!file) return;
          // 模擬：更新 UI 顯示新檔案
          const nameEl = slot.querySelector('.cd-file-name');
          const metaEl = slot.querySelector('.cd-file-meta');
          if (nameEl) nameEl.textContent = file.name;
          if (metaEl) {
            const sizeKB = (file.size / 1024).toFixed(1);
            const sizeMB = (file.size / 1024 / 1024).toFixed(1);
            const size = file.size > 1024*1024 ? `${sizeMB} MB` : `${sizeKB} KB`;
            const today = new Date().toISOString().slice(0,10);
            metaEl.innerHTML = `<span>${size}</span><span class="sep">·</span><span>${today}</span>`;
          }
          if (typeof showToast === 'function') {
            showToast(`（原型模擬）「${slotName}」已成功上傳：${file.name}`);
          } else {
            alert(`（原型模擬）「${slotName}」已成功上傳：${file.name}`);
          }
        };
        input.click();
      }

      function cdMockUpload(btn, slotName) {
        // 空槽位上傳（與 replace 流程相同，但會將 .empty 切換為 .uploaded）
        const slot = btn.closest('.cd-file-slot');
        if (!slot) return;
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,.docx,.doc,.png,.jpg,.jpeg';
        input.onchange = (e) => {
          const file = e.target.files && e.target.files[0];
          if (!file) return;
          // 將空槽切為已上傳狀態（簡化版 demo：alert 即可）
          if (typeof showToast === 'function') {
            showToast(`（原型模擬）「${slotName}」已成功上傳：${file.name}`);
          } else {
            alert(`（原型模擬）「${slotName}」已成功上傳：${file.name}`);
          }
        };
        input.click();
      }

      // ════════════════════════════════════════════════════════════════
      // v5 新增：集團架構圖節點點擊行為
      // hasDetail: true=有資料(跳轉廠商頁) | 'self'=當前廠商 | false=無資料(顯示 modal)
      // overseas: 是否為海外實體
      // ════════════════════════════════════════════════════════════════
      function orgNodeClick(name, hasDetail, overseas) {
        if (hasDetail === 'self') {
          // 點到自己：提示一下就好
          if (typeof showToast === 'function') {
            showToast(`「${name}」是當前正在檢視的廠商`);
          }
          return;
        }
        if (hasDetail === true) {
          // 模擬有資料：在 demo 中跳到 detail 頁
          if (typeof showToast === 'function') {
            showToast(`正在載入「${name}」廠商詳情...`);
          }
          // 跳轉到 detail 頁（demo 用同一個 detail 頁示意，正式版會帶廠商統編）
          setTimeout(() => showPage('detail'), 300);
          return;
        }
        // 無資料：顯示提示 modal
        const modal = document.getElementById('orgNoDataModal');
        const title = document.getElementById('orgndTitle');
        const msg = document.getElementById('orgndMsg');
        if (title) {
          title.textContent = overseas
            ? `「${name}」· 海外實體無詳細資料`
            : `「${name}」· 無詳細資料`;
        }
        if (msg) {
          if (overseas) {
            msg.innerHTML = `本系統僅記錄此海外實體之名稱與關聯關係，未建立完整廠商主檔。<br><span style="color:#94a3b8;font-size:12px">海外公司之基本資料（成立年份、設立國家、資本額等）目前不在系統蒐集範圍內，僅供搜尋比對使用。</span>`;
          } else {
            msg.innerHTML = `此節點尚未於系統中建立完整廠商基本資料。<br><span style="color:#94a3b8;font-size:12px">您可至「後台 → 廠商資料管理」新增此公司之完整資料，或聯繫工研院維運團隊協助建檔。</span>`;
          }
        }
        if (modal) modal.classList.add('show');
      }
      function closeOrgNoDataModal(e) {
        // 若是點擊背景，關掉；點擊內容則由 stopPropagation 攔截
        const modal = document.getElementById('orgNoDataModal');
        if (modal) modal.classList.remove('show');
      }

      // ════════════════════════════════════════════════════════════════
      // v3.3 廠商查詢 v2 — 互動邏輯
      // ════════════════════════════════════════════════════════════════
      const Q2_STATE = {
        keyword: '',
        industries: [],   // [{lvl: 'L1', name: '電子資訊產業'}, ...]
        techs: [],        // [{id: '34', name: 'AI 高效能晶片設計'}, ...]
      };

      function q2ToggleSearch() {
        const s = document.getElementById('q2Search');
        if (s) s.classList.toggle('collapsed');
      }
      function q2SetKW(name) {
        const inp = document.getElementById('q2KW');
        if (inp) inp.value = name;
      }
      function q2AddInd(sel) {
        if (!sel.value) return;
        const [lvl, name] = sel.value.split('|');
        if (!Q2_STATE.industries.find(x => x.lvl === lvl && x.name === name)) {
          Q2_STATE.industries.push({lvl, name});
          q2RenderIndChips();
        }
        sel.value = '';
      }
      function q2RemoveInd(idx) {
        Q2_STATE.industries.splice(idx, 1);
        q2RenderIndChips();
      }
      function q2RenderIndChips() {
        const c = document.getElementById('q2IndChips');
        const cnt = document.getElementById('q2IndCount');
        if (!c) return;
        const total = Q2_STATE.industries.length;

        // 全選時：單一摘要 chip
        if (total > 0 && typeof IM_TREE !== 'undefined') {
          const allSns = Object.keys(IM_TREE);
          if (total >= allSns.length) {
            c.innerHTML = `<span class="q2-chip q2-chip-all"><span class="q2-chip-lv">全部</span>已選全部產業分類<span class="q2-chip-x" onclick="q2IndClearAll()">×</span></span>`;
            if (cnt) cnt.textContent = total;
            return;
          }
        }

        // 超過 10 條時：顯示摘要 chip
        if (total > 10) {
          c.innerHTML = `<span class="q2-chip q2-chip-all" style="cursor:default"><span class="q2-chip-lv">產業</span>已選 ${total} 條路徑<span class="q2-chip-x" onclick="q2IndClearAll()">×</span></span>`;
          if (cnt) cnt.textContent = total;
          return;
        }

        // 正常顯示（≤ 10 條）
        c.innerHTML = Q2_STATE.industries.map((x, i) => {
          const path = [];
          if (x.sn && typeof IM_TREE !== 'undefined' && IM_TREE[x.sn]) {
            let cur = x.sn;
            while (cur && IM_TREE[cur]) {
              path.unshift({sn:cur, lvl:'L'+IM_TREE[cur].l, name:IM_TREE[cur].n});
              cur = IM_TREE[cur].p;
            }
          } else {
            path.push({sn:'', lvl:x.lvl, name:x.name});
          }
          const segs = path.map((p, idx) => {
            const sep = idx > 0 ? '<span class="q2-chip-sep">›</span>' : '';
            return `${sep}<span class="q2-chip-lv">${p.lvl}</span><span class="q2-chip-seg">${p.name}</span>`;
          }).join('');
          return `<span class="q2-chip path"><span class="q2-chip-domain">領域 ${i+1}</span>${segs}<span class="q2-chip-x" onclick="q2RemoveInd(${i})">×</span></span>`;
        }).join('');
        if (cnt) cnt.textContent = total;
      }
      function q2IndClearAll() {
        Q2_STATE.industries = [];
        q2RenderIndChips();
      }
      function q2AddTech(sel) {
        if (!sel.value) return;
        const [id, name] = sel.value.split('|');
        if (!Q2_STATE.techs.find(x => x.id === id)) {
          Q2_STATE.techs.push({id, name});
          q2RenderTechChips();
        }
        sel.value = '';
      }
      function q2RemoveTech(idx) {
        Q2_STATE.techs.splice(idx, 1);
        q2RenderTechChips();
      }
      function q2RenderTechChips() {
        const c = document.getElementById('q2TechChips');
        const cnt = document.getElementById('q2TechCount');
        if (!c) return;
        // ★ v6.0:全選 42 項時顯示單一深紅「全部」chip
        if (Q2_STATE.techs.length === 42) {
          c.innerHTML = `<span class="q2-chip q2-chip-all"><span class="q2-chip-lv">全部</span>42 項關鍵技術<span class="q2-chip-x" onclick="q2RemoveAllTechs()">×</span></span>`;
        } else {
          c.innerHTML = Q2_STATE.techs.map((x, i) => {
            const shortName = x.name.length > 12 ? x.name.substring(0,12)+'…' : x.name;
            return `<span class="adv-tech-chip" data-code="${x.id}">${x.id}<span class="name">${shortName}</span><span class="x" onclick="q2RemoveTech(${i})">×</span></span>`;
          }).join('');
        }
        if (cnt) cnt.textContent = Q2_STATE.techs.length;
      }
      function q2RemoveAllTechs() {
        Q2_STATE.techs = [];
        q2RenderTechChips();
      }
      function q2ClearAll() {
        Q2_STATE.keyword = '';
        Q2_STATE.industries = [];
        Q2_STATE.techs = [];
        const inp = document.getElementById('q2KW');
        if (inp) inp.value = '';
        q2RenderIndChips();
        q2RenderTechChips();
        // 隱藏結果、顯示引導
        document.getElementById('q2Results').style.display = 'none';
        document.getElementById('q2Empty').style.display = 'block';
        document.getElementById('q2Search').classList.remove('collapsed');
      }
      function q2DoSearch() {
        // 計算條件數
        const kw = (document.getElementById('q2KW')?.value || '').trim();
        const conds = (kw ? 1 : 0) + Q2_STATE.industries.length + Q2_STATE.techs.length;
        const summary = document.getElementById('q2ClSummary');
        if (summary) {
          if (conds === 0) {
            summary.innerHTML = '（未設定條件，將顯示全部廠商）';
          } else {
            const parts = [];
            if (kw) parts.push(`關鍵字「${kw}」`);
            if (Q2_STATE.industries.length) parts.push(`產業 ${Q2_STATE.industries.length} 項`);
            if (Q2_STATE.techs.length) parts.push(`技術 ${Q2_STATE.techs.length} 項`);
            summary.innerHTML = `（已套用 <b>${conds}</b> 條件 · ${parts.join(' / ')}）`;
          }
        }
        // 收合搜尋區、隱藏引導、顯示結果
        document.getElementById('q2Search').classList.add('collapsed');
        document.getElementById('q2Empty').style.display = 'none';
        document.getElementById('q2Results').style.display = 'block';
        
        // v6:套用篩選
        Q2_RESULT.kw = kw;
        Q2_RESULT.page = 1;
        q2ApplyFilter();
        q2RenderFirmList();
      }

      // v6:廠商查詢結果狀態
      const Q2_RESULT = {
        kw: '',
        filtered: [],   // 篩選後的廠商陣列
        page: 1,
        pageSize: 8,
      };

      // 收集所有「選定產業節點」的後代節點 sn(包含自己)
      function q2GetSelectedNodeIds() {
        const ids = new Set();
        for (const ind of Q2_STATE.industries) {
          if (!ind.sn) continue;
          // 加自己 + 所有後代
          const stack = [ind.sn];
          while (stack.length) {
            const cur = stack.pop();
            ids.add(cur);
            const node = IM_TREE[cur];
            if (node && node.c) stack.push(...node.c);
          }
        }
        return ids;
      }

      function q2ApplyFilter() {
        const kw = (Q2_RESULT.kw || '').toLowerCase();
        const indNodeIds = q2GetSelectedNodeIds();
        const useInd = indNodeIds.size > 0;
        // 命中技術過濾(demo:目前資料無真實技術命中,所以選了技術視同有條件但全部都符合)
        // const useTech = Q2_STATE.techs.length > 0;
        
        Q2_RESULT.filtered = FIRMS_DB_RAW.filter(arr => {
          const [uid, name, rep, addr, regDate, capital, emp, nodes] = arr;
          // 關鍵字:廠商名稱、統編、代表人
          if (kw) {
            const hay = (name + ' ' + uid + ' ' + (rep||'')).toLowerCase();
            if (!hay.includes(kw)) return false;
          }
          // 產業:廠商至少有一個節點落在選定範圍內
          if (useInd) {
            let hit = false;
            for (const nid of nodes) {
              if (indNodeIds.has(nid)) { hit = true; break; }
            }
            if (!hit) return false;
          }
          return true;
        });
        // 排序:預設 員工數多→少
        Q2_RESULT.filtered.sort((a,b) => (b[6]||0) - (a[6]||0));
      }

      function q2RenderFirmList() {
        const total = Q2_RESULT.filtered.length;
        const ps = Q2_RESULT.pageSize;
        const totalPages = Math.max(1, Math.ceil(total / ps));
        if (Q2_RESULT.page > totalPages) Q2_RESULT.page = totalPages;
        const start = (Q2_RESULT.page - 1) * ps;
        const pageItems = Q2_RESULT.filtered.slice(start, start + ps);

        // 更新標題列
        const cntEl = document.getElementById('q2ResultCount');
        if (cntEl) cntEl.textContent = total.toLocaleString();
        // 命中關鍵技術數(demo:約 1/3 的廠商)
        const warnEl = document.querySelector('.q2-rs-warn');
        const hitN = Math.max(1, Math.floor(total * 0.36));
        if (warnEl) warnEl.innerHTML = `,其中 ⚠ <b>${hitN.toLocaleString()} 家</b> 涉及國家核心關鍵技術`;

        // 渲染卡片
        const list = document.getElementById('q2FirmList');
        if (list) {
          if (pageItems.length === 0) {
            list.innerHTML = `<div style="text-align:center;padding:60px 20px;color:#94a3b8;font-size:14px">符合條件的廠商為 0 筆,請放寬搜尋條件</div>`;
          } else {
            list.innerHTML = pageItems.map(arr => q2BuildFirmCard(arr)).join('');
          }
        }

        // 渲染分頁
        const pager = document.getElementById('q2Pagination');
        if (pager) {
          if (totalPages <= 1) {
            pager.innerHTML = `<span class="pg-info">共 ${total.toLocaleString()} 筆</span>`;
          } else {
            pager.innerHTML = q2BuildPagination(totalPages, Q2_RESULT.page, total);
          }
        }
      }

      function q2BuildFirmCard(arr) {
        const [uid, name, rep, addr, regDate, capital, emp, nodes] = arr;
        // 計算產業路徑(取第一個節點往上)
        const path = getFirmIndPath({nodes});
        const pathHtml = path.map((p,i) => {
          const cls = (i === path.length-1) ? 'path-l current' : 'path-l';
          return `<span class="${cls}">${p.name}</span>`;
        }).join(' › ');
        // 風險樣式：只要涉及1項就顯示高度風險
        const hashVal = parseInt(uid.slice(-2), 10) || 0;
        const isCritical = hashVal % 7 < 3;
        const hitNum = isCritical ? (1 + hashVal % 5) : 0;
        const cardCls = hitNum > 0 ? 'q2-firm critical' : 'q2-firm';
        const hitTagHtml = hitNum > 0
          ? ''
          : '';
        // logo 字(取公司名前 2 字)
        const logoText = (name || '').slice(0, 2);
        const FIRM_LOGO_MAP_Q2 = {
          '22099131': '../assets/img/logos/22099131.png',
          '76027628': '../assets/img/logos/76027628.jpg',
          '12800225': '../assets/img/logos/12800225.jpg',
          '84149961': '../assets/img/logos/84149961.gif',
        };
        const q2LogoHtml = FIRM_LOGO_MAP_Q2[uid]
          ? `<img src="${FIRM_LOGO_MAP_Q2[uid]}" alt="${logoText}" style="width:100%;height:100%;object-fit:contain;border-radius:6px;background:#fff;">`
          : logoText;
        // 資本額顯示
        const capStr = capital >= 100000000
          ? Math.round(capital/100000000).toLocaleString() + ' 億'
          : (capital >= 10000 ? Math.round(capital/10000).toLocaleString() + ' 萬' : capital.toLocaleString());
        // 地址(取縣市區)
        const addrShort = (addr || '').replace(/[臺台]/g,'臺').replace(/^(.{2,3}[市縣].{2,3}[區市鄉鎮]).*/, '$1') || addr || '—';
        // 員工
        const empStr = emp > 0 ? emp.toLocaleString() : '—';
        // 命中技術 demo pills
        const techPills = isCritical
          ? '<span class="q2-tech-pill">34 AI 高效能晶片</span><span class="q2-tech-pill">35 Chiplet 互聯</span>'
          : '';
        const techRowHtml = hitNum > 0
          ? `<div class="q2-firm-tech"><span class="q2-tech-lbl">⚠ 涉及技術:</span>${techPills}</div>`
          : '';
        // 歷史審查件(demo:用 hash)
        const histN = isCritical ? (3 + hashVal % 8) : (hashVal % 2);

        return `<div class="${cardCls}" onclick="showPage('detail',null,{firmId:'${uid}'})">
          <div class="q2-firm-logo">${q2LogoHtml}</div>
          <div class="q2-firm-body">
            <div class="q2-firm-row1">
              <h4 class="q2-firm-name">${name}</h4>
            </div>
            <div class="q2-firm-row2">
              <span><b>代表人</b> ${rep || '—'}</span><span class="sep">·</span>
              <span><b>資本額</b> ${capStr}</span><span class="sep">·</span>
              <span><b>員工</b> ${empStr}</span><span class="sep">·</span>
              <span>${addrShort}</span>
            </div>
            ${techRowHtml}
          </div>
          <div class="q2-firm-right">
            <div class="q2-firm-meta">
              <span class="q2-firm-tag uniform">統編 ${uid}</span>
              ${hitTagHtml}
            </div>
            <div class="q2-firm-side">
              <div class="q2-firm-stat-num">${histN}</div>
              <div class="q2-firm-stat-lbl">歷史審查件</div>
            </div>
          </div>
        </div>`;
      }

      function q2BuildPagination(totalPages, curPage, total) {
        const ps = Q2_RESULT.pageSize;
        const btn = (label, page, cls) => {
          if (page < 1 || page > totalPages) {
            return `<button class="pg-btn" disabled style="opacity:.4;cursor:not-allowed">${label}</button>`;
          }
          return `<button class="pg-btn ${cls||''}" onclick="q2GotoPage(${page})">${label}</button>`;
        };
        let html = '';
        html += btn('‹', curPage - 1);
        // 顯示策略:1 ... cur-1 cur cur+1 ... total
        const pages = new Set([1, totalPages, curPage]);
        if (curPage > 1) pages.add(curPage - 1);
        if (curPage < totalPages) pages.add(curPage + 1);
        if (curPage > 2) pages.add(2);
        if (curPage < totalPages - 1) pages.add(totalPages - 1);
        const sortedPages = [...pages].sort((a,b)=>a-b);
        let lastP = 0;
        for (const p of sortedPages) {
          if (p - lastP > 1) html += `<button class="pg-btn" disabled style="opacity:.4;cursor:not-allowed">…</button>`;
          html += btn(p, p, p === curPage ? 'on' : '');
          lastP = p;
        }
        html += btn('›', curPage + 1);
        html += `<span class="pg-info">共 ${total.toLocaleString()} 筆,每頁 ${ps} 筆 · 第 ${curPage}/${totalPages} 頁</span>`;
        return html;
      }

      function q2GotoPage(p) {
        Q2_RESULT.page = p;
        q2RenderFirmList();
        // 滾到結果區頂部
        const r = document.getElementById('q2Results');
        if (r) r.scrollIntoView({behavior:'smooth', block:'start'});
      }

      // 4 大常用情境快捷
      function q2RunShortcut(key) {
        q2ClearAll();
        if (key === 'semi-listed') {
          // L2 半導體產業 sn=9486
          Q2_STATE.industries.push({sn:'9486', lvl:'L2', name:'半導體產業'});
          q2RenderIndChips();
        } else if (key === 'hit-critical') {
          Q2_STATE.techs.push(
            {id:'30', name:'異質整合封裝技術'},
            {id:'34', name:'AI 高效能晶片'},
            {id:'35', name:'Chiplet 互聯'}
          );
          q2RenderTechChips();
        } else if (key === 'ai-chip') {
          Q2_STATE.techs.push(
            {id:'34', name:'AI 高效能晶片'},
            {id:'35', name:'Chiplet 互聯'}
          );
          q2RenderTechChips();
        } else if (key === 'recent') {
          // 不選具體條件，由日期切換
        }
        q2DoSearch();
      }

      // ════════════════════════════════════════════════════════════════
      // v3.3 廠商查詢 v2 — 產業分類多選器 modal
      // ════════════════════════════════════════════════════════════════
      // 暫存（未按套用前的 working 狀態）
      const Q2_PICKER = {
        indTemp: new Set(),    // 暫存的產業節點 sn
        techTemp: new Set(),   // 暫存的技術 id
      };

      // demo 用：每個 L1 之下的「廠商數」「是否含關鍵技術」（取自前面 L1_META 概念）
      // 為了讓樹節點都有資訊，給定一些 demo 命中（節點 sn → {firms, crit}）
      const Q2_NODE_INFO = {
        '8042': {firms: 1024, crit: true},   '9486': {firms: 386, crit: true},
        '9487': {firms: 248, crit: false},   '9488': {firms: 218, crit: false},
        '9489': {firms: 172, crit: false},
        '8041': {firms: 612, crit: true},    '8051': {firms: 87, crit: true},
        '8054': {firms: 14, crit: true},
        '8043': {firms: 312, crit: true},    '8044': {firms: 268, crit: false},
        '8045': {firms: 96, crit: false},    '8046': {firms: 184, crit: false},
        '8047': {firms: 142, crit: false},   '8048': {firms: 156, crit: false},
      };
      // 預設：父節點之下的廠商數總和（沒有則 fallback）
      function q2GetNodeInfo(sn) {
        if (Q2_NODE_INFO[sn]) return Q2_NODE_INFO[sn];
        // 隨機數做 demo（確保穩定 — 用 sn 雜湊）
        const h = parseInt(sn, 10) || 0;
        const firms = (h * 13) % 30 + 1;
        const crit = (h % 7) === 0;
        return {firms, crit};
      }

      function q2OpenIndPicker() {
        // 從 admin 表單來的不重置 mode；從 q2 主搜尋來的設為 'q2'
        Q2_PICKER.indMode = 'q2';
        // 把當前已選的葉節點 + 所有祖先回填到 temp（讓 UI 顯示完整勾選狀態）
        Q2_PICKER.indTemp = new Set();
        Q2_STATE.industries.forEach(x => {
          Q2_PICKER.indTemp.add(x.sn);
          let parent = IM_TREE[x.sn]?.p;
          while (parent && IM_TREE[parent]) {
            Q2_PICKER.indTemp.add(parent);
            parent = IM_TREE[parent].p;
          }
        });
        q2RenderIndTree();
        q2UpdateIndPickerCount();
        document.getElementById('q2IndModal').classList.add('show');
      }
      function q2CloseIndPicker() {
        document.getElementById('q2IndModal').classList.remove('show');
      }

      function q2RenderIndTree() {
        const root = document.getElementById('q2IndTree');
        if (!root || typeof IM_TREE === 'undefined') return;
        // 從 8 個 L1 開始
        const order = (typeof IM_L1_ORDER !== 'undefined') ? IM_L1_ORDER : Object.keys(IM_TREE).filter(k => IM_TREE[k].l === 1);
        root.innerHTML = order.map(sn => q2RenderIndNode(sn, 0)).join('');
        // L1 預設展開
        root.querySelectorAll('.q2-tree-node').forEach(n => {
          if (n.dataset.lvl === '1') n.classList.add('expanded');
        });
      }

      function q2RenderIndNode(sn, depth) {
        const n = IM_TREE[sn];
        if (!n) return '';
        const hasChildren = (n.c || []).length > 0;
        const checked = Q2_PICKER.indTemp.has(sn) ? 'checked' : '';
        const info = q2GetNodeInfo(sn);
        const arr = hasChildren
          ? `<span class="q2-tree-arr" onclick="event.stopPropagation();q2ToggleIndNode(this)">▶</span>`
          : `<span class="q2-tree-arr leaf">·</span>`;
        const lvCls = `l${n.l}`;
        const critTag = info.crit ? `<span class="q2-tree-crit">⚠ 關鍵技術</span>` : '';
        const childrenHtml = hasChildren
          ? `<div class="q2-tree-children">${n.c.map(c => q2RenderIndNode(c, depth+1)).join('')}</div>`
          : '';
        return `
          <div class="q2-tree-node" data-sn="${sn}" data-name="${n.n}" data-lvl="${n.l}">
            <div class="q2-tree-row" style="--depth:${depth}">
              ${arr}
              <input type="checkbox" class="q2-tree-cb" ${checked} onclick="event.stopPropagation();q2ToggleIndCheck('${sn}', this)">
              <span class="q2-tree-lv ${lvCls}">L${n.l}</span>
              <span class="q2-tree-name">${n.n}</span>
              ${critTag}
              <span class="q2-tree-firmcnt">${info.firms} 家</span>
            </div>
            ${childrenHtml}
          </div>`;
      }

      function q2ToggleIndNode(arrEl) {
        const node = arrEl.closest('.q2-tree-node');
        if (node) node.classList.toggle('expanded');
      }
      function q2ToggleIndCheck(sn, cb) {
        if (cb.checked) {
          // 勾選 → 自動勾選所有祖先（從 L1 到自己）
          Q2_PICKER.indTemp.add(sn);
          let parent = IM_TREE[sn]?.p;
          while (parent && IM_TREE[parent]) {
            Q2_PICKER.indTemp.add(parent);
            parent = IM_TREE[parent].p;
          }
        } else {
          // 取消勾選 → 自動取消所有後代（葉子方向）
          Q2_PICKER.indTemp.delete(sn);
          const removeDescendants = (node_sn) => {
            const node = IM_TREE[node_sn];
            if (!node || !node.c) return;
            for (const child of node.c) {
              Q2_PICKER.indTemp.delete(child);
              removeDescendants(child);
            }
          };
          removeDescendants(sn);
        }
        // 將 DOM 中所有 checkbox 與 indTemp 同步
        document.querySelectorAll('#q2IndTree .q2-tree-cb').forEach(c => {
          const nodeEl = c.closest('.q2-tree-node');
          if (nodeEl) {
            c.checked = Q2_PICKER.indTemp.has(nodeEl.dataset.sn);
          }
        });
        q2UpdateIndPickerCount();
      }
      function q2UpdateIndPickerCount() {
        const c = Q2_PICKER.indTemp.size;
        const a = document.getElementById('q2IndPickerCount');
        const b = document.getElementById('q2IndApplyCnt');
        if (a) a.textContent = c;
        if (b) b.textContent = c;
      }
      function q2IndExpandAll() {
        document.querySelectorAll('#q2IndTree .q2-tree-node').forEach(n => {
          if (n.querySelector('.q2-tree-arr:not(.leaf)')) n.classList.add('expanded');
        });
      }
      function q2IndCollapseAll() {
        document.querySelectorAll('#q2IndTree .q2-tree-node').forEach(n => n.classList.remove('expanded'));
      }
      function q2ToggleAllInd(cb) {
        const checked = cb.checked;
        document.querySelectorAll('#q2IndTree .q2-tree-cb').forEach(c => { c.checked = checked; });
        // 同步 picker temp set
        if (typeof Q2_PICKER !== 'undefined') {
          if (checked) {
            document.querySelectorAll('#q2IndTree .q2-tree-node').forEach(n => {
              if (n.dataset.sn) Q2_PICKER.indTemp.add(n.dataset.sn);
            });
          } else {
            Q2_PICKER.indTemp.clear();
          }
        }
        if (typeof q2UpdateIndPickerCount === 'function') q2UpdateIndPickerCount();
      }

      function q2IndClearTemp() {
        Q2_PICKER.indTemp.clear();
        document.querySelectorAll('#q2IndTree .q2-tree-cb').forEach(cb => cb.checked = false);
        q2UpdateIndPickerCount();
      }
      function q2IndApply() {
        const mode = Q2_PICKER.indMode || 'q2';

        // 篩選出真正的「葉勾選」：其所有直接子節點皆未被勾選
        // 含義：使用者選的最深一層才是「領域代表」，祖先只是輔助勾選
        const allChecked = Array.from(Q2_PICKER.indTemp);
        const leafChecked = allChecked.filter(sn => {
          const node = IM_TREE[sn];
          if (!node || !node.c || node.c.length === 0) return true;  // 無子節點 → 葉
          // 若任一子節點也被勾，則此節點不算葉勾選
          return !node.c.some(c => Q2_PICKER.indTemp.has(c));
        });

        const selected = leafChecked.map(sn => {
          const n = IM_TREE[sn];
          return {sn, lvl: 'L' + n.l, name: n.n};
        });

        if (mode === 'q2') {
          // 寫回 v2 主搜尋
          Q2_STATE.industries = selected;
          q2RenderIndChips();
        } else if (mode === 'adm-firm') {
          ADM_FIRM_INDS = selected;
          admRenderIndPaths('firm');
        } else if (mode === 'adm-tech') {
          ADM_TECH_INDS = selected;
          admRenderIndPaths('tech');
        }
        q2CloseIndPicker();
      }

      // 過濾邏輯：只顯示包含關鍵字的節點及其祖先路徑
      function q2FilterIndTree() {
        const kw = (document.getElementById('q2IndFilter').value || '').trim().toLowerCase();
        const allNodes = document.querySelectorAll('#q2IndTree .q2-tree-node');
        if (!kw) {
          // 清除過濾
          allNodes.forEach(n => {
            n.classList.remove('hidden');
            n.querySelector(':scope > .q2-tree-row')?.classList.remove('matched', 'no-match');
          });
          return;
        }
        // 1. 先標記每個節點是否匹配
        const matched = new Set();
        allNodes.forEach(n => {
          const name = (n.dataset.name || '').toLowerCase();
          if (name.includes(kw)) matched.add(n.dataset.sn);
        });
        // 2. 把祖先也加入 visible（以及自己的子孫）
        function markAncestors(node) {
          let p = node.parentElement;
          while (p) {
            if (p.classList && p.classList.contains('q2-tree-node')) {
              matched.add(p.dataset.sn);
              p.classList.add('expanded'); // 自動展開
            }
            p = p.parentElement;
          }
        }
        function markDescendants(node) {
          node.querySelectorAll('.q2-tree-node').forEach(child => {
            matched.add(child.dataset.sn);
          });
        }
        const initiallyMatched = Array.from(matched);
        initiallyMatched.forEach(sn => {
          const node = document.querySelector(`#q2IndTree .q2-tree-node[data-sn="${sn}"]`);
          if (node) {
            markAncestors(node);
            markDescendants(node);
          }
        });
        // 3. 套用顯示/隱藏
        allNodes.forEach(n => {
          if (matched.has(n.dataset.sn)) {
            n.classList.remove('hidden');
            const row = n.querySelector(':scope > .q2-tree-row');
            const name = (n.dataset.name || '').toLowerCase();
            if (name.includes(kw)) {
              row.classList.add('matched');
              row.classList.remove('no-match');
            } else {
              row.classList.remove('matched');
              row.classList.add('no-match');
            }
          } else {
            n.classList.add('hidden');
          }
        });
      }
      function q2ClearIndFilter() {
        document.getElementById('q2IndFilter').value = '';
        q2FilterIndTree();
      }

      // ════════════════════════════════════════════════════════════════
      // 關鍵技術多選器 modal
      // ════════════════════════════════════════════════════════════════
      const Q2_TECH_GROUPS = [
        {key:'def',  title:'國防部',  range:'1–14',  ids:[1,2,3,4,5,6,7,8,9,10,11,12,13,14]},
        {key:'nstc', title:'國科會',  range:'15–28', ids:[15,16,17,18,19,20,21,22,23,24,25,26,27,28]},
        {key:'moea', title:'經濟部',  range:'29–36', ids:[29,30,31,32,33,34,35,36]},
        {key:'moda', title:'數發部',  range:'37–39', ids:[37,38,39]},
        {key:'moa',  title:'農業部',  range:'40–42', ids:[40,41,42]},
      ];
      // demo：每個技術的代表廠商家數（同 page-tech 用）
      const Q2_TECH_FIRM_COUNT = {
        1:8,2:5,3:3,4:2,5:4,6:5,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0,
        15:6,16:4,17:3,18:5,19:4,20:5,21:3,22:4,23:3,24:2,25:0,26:0,
        27:6,28:9,29:11,30:32,31:47,32:48,33:41,34:45,35:38,
        36:47,37:5,38:3,39:3, 40:2,41:3,42:1
      };

      function q2OpenTechPicker() {
        Q2_PICKER.techMode = 'q2';
        Q2_PICKER.techTemp = new Set(Q2_STATE.techs.map(x => x.id));
        q2RenderTechTree();
        q2UpdateTechPickerCount();
        document.getElementById('q2TechModal').classList.add('show');
      }
      function q2CloseTechPicker() {
        document.getElementById('q2TechModal').classList.remove('show');
      }
      function q2RenderTechTree() {
        const root = document.getElementById('q2TechTree');
        if (!root) return;

        // ★ 只有「廠商管理 > 產業路徑 > 關聯關鍵技術」picker 才顯示技術架構子層
        const isIndArchMode = (Q2_PICKER.techMode || '').startsWith('adm-firm-ind-');

        // 記錄目前已展開的 arch block（重渲染後恢復）
        const openArchBlocks = new Set();
        if (isIndArchMode) {
          root.querySelectorAll('.q2-arch-block').forEach(function(el) {
            if (el.style.display !== 'none') openArchBlocks.add(el.id);
          });
        }

        const allCnt = Q2_TECH_GROUPS.reduce((s,g) => s + g.ids.length, 0);
        const allChecked = Q2_PICKER.techTemp.size === allCnt && !isIndArchMode;
        const groupsHtml = Q2_TECH_GROUPS.map(g => {
          const groupAllChecked = g.ids.every(id => Q2_PICKER.techTemp.has(String(id).padStart(2,'0')));
          const groupSomeChecked = g.ids.some(id => Q2_PICKER.techTemp.has(String(id).padStart(2,'0')));
          const groupCbState = groupAllChecked ? 'checked' : '';
          const rows = g.ids.map(id => {
            const tid = String(id).padStart(2, '0');
            const data = (typeof TECH42_DATA !== 'undefined') ? TECH42_DATA[String(id)] : null;
            const name = data ? (data.name.length > 30 ? data.name.substring(0,30)+'…' : data.name) : '(資料未載入)';
            const firms = Q2_TECH_FIRM_COUNT[id] || 0;
            const dim = firms === 0 ? ' dim' : '';
            const firmDisp = firms > 0 ? `${firms} 家` : '尚未盤點';
            const checked = Q2_PICKER.techTemp.has(tid) ? 'checked' : '';

            // ── 技術架構子層（僅 adm-firm-ind 模式） ──
            let archBlockHtml = '';
            if (isIndArchMode && data && data.archs && data.archs.length > 0) {
              const archRows = data.archs.map((arch, ai) => {
                const archKey = tid + ':' + ai;
                const archChecked = Q2_PICKER.techTemp.has(archKey) ? 'checked' : '';
                const firmCnt = arch.firms ? arch.firms.length : 0;
                return `<label class="q2-arch-row">
                  <input type="checkbox" class="q2-tree-cb" ${archChecked}
                    onclick="event.stopPropagation();q2ToggleTechCheck('${archKey}',this)">
                  <span class="q2-arch-name">${arch.name}</span>
                  <span class="q2-arch-firms">${firmCnt} 家</span>
                </label>`;
              }).join('');
              archBlockHtml = `<div class="q2-arch-block" id="q2ab-${tid}" style="display:none">${archRows}</div>`;
            }

            const expandBtn = (isIndArchMode && data && data.archs && data.archs.length > 0)
              ? `<button type="button" class="q2-arch-toggle" onclick="event.preventDefault();event.stopPropagation();q2ToggleArchBlock('q2ab-${tid}',this)">▶ 架構</button>`
              : '';

            return `
              <div class="q2-tech-row-wrap">
                <label class="q2-tech-row${dim}" data-name="${(data?.name||'').toLowerCase()}" data-tid="${tid}" data-gkey="${g.key}">
                  <input type="checkbox" class="q2-tree-cb" ${checked} onclick="q2ToggleTechCheck('${tid}', this)">
                  <span class="q2-tech-id">${tid}</span>
                  <span class="q2-tech-name">${name}</span>
                  <span class="q2-tech-firmcnt">${firmDisp}</span>
                  ${expandBtn}
                </label>
                ${archBlockHtml}
              </div>`;
          }).join('');
          return `
            <div class="q2-tech-group" data-gkey="${g.key}">
              <label class="q2-tech-group-title">
                <input type="checkbox" class="q2-tree-cb-grp" ${groupCbState} onclick="q2ToggleGroupTech('${g.key}', this)">
                <span class="q2-grp-title-text">${g.title}（技術 ${g.range}）</span>
                <span class="q2-grp-cnt">${g.ids.length} 項</span>
              </label>
              ${rows}
            </div>`;
        }).join('');
        root.innerHTML = `
          <label class="q2-tech-allrow">
            <input type="checkbox" class="q2-tree-cb-all" ${allChecked ? 'checked' : ''} onclick="q2ToggleAllTech(this)">
            <span class="q2-tech-all-lbl">☑ 全部 ${allCnt} 項</span>
          </label>
          ${groupsHtml}
        `;
        // indeterminate state
        Q2_TECH_GROUPS.forEach(g => {
          const all = g.ids.every(id => Q2_PICKER.techTemp.has(String(id).padStart(2,'0')));
          const some = g.ids.some(id => Q2_PICKER.techTemp.has(String(id).padStart(2,'0')));
          const grpCb = root.querySelector(`.q2-tech-group[data-gkey="${g.key}"] .q2-tree-cb-grp`);
          if (grpCb) grpCb.indeterminate = !all && some;
        });
        const allCb = root.querySelector('.q2-tree-cb-all');
        if (allCb) allCb.indeterminate = !allChecked && Q2_PICKER.techTemp.size > 0;

        // 恢復展開狀態
        if (isIndArchMode && openArchBlocks.size > 0) {
          openArchBlocks.forEach(function(bid) {
            const block = document.getElementById(bid);
            if (block) {
              block.style.display = 'block';
              // 同步對應按鈕文字
              const tid = bid.replace('q2ab-', '');
              const toggleBtn = root.querySelector('.q2-tech-row-wrap .q2-arch-toggle[onclick*="' + bid + '"]');
              if (toggleBtn) toggleBtn.textContent = '▼ 架構';
            }
          });
        }

        if (typeof q2FilterTechTree === 'function') {
          const filterInput = document.getElementById('q2TechFilter');
          if (filterInput && filterInput.value) q2FilterTechTree();
        }
      }

      // 展開/收合技術架構子層
      function q2ToggleArchBlock(blockId, btn) {
        const block = document.getElementById(blockId);
        if (!block) return;
        const open = block.style.display !== 'none';
        block.style.display = open ? 'none' : 'block';
        btn.textContent = open ? '▶ 架構' : '▼ 架構';
      }
      function q2ToggleAllTech(cb) {
        if (cb.checked) {
          Q2_TECH_GROUPS.forEach(g => g.ids.forEach(id => Q2_PICKER.techTemp.add(String(id).padStart(2,'0'))));
        } else {
          Q2_PICKER.techTemp.clear();
        }
        q2RenderTechTree();
        q2UpdateTechPickerCount();
      }
      function q2ToggleGroupTech(gkey, cb) {
        const g = Q2_TECH_GROUPS.find(x => x.key === gkey);
        if (!g) return;
        if (cb.checked) {
          g.ids.forEach(id => Q2_PICKER.techTemp.add(String(id).padStart(2,'0')));
        } else {
          g.ids.forEach(id => Q2_PICKER.techTemp.delete(String(id).padStart(2,'0')));
        }
        q2RenderTechTree();
        q2UpdateTechPickerCount();
      }
      function q2ToggleTechCheck(tid, cb) {
        if (cb.checked) {
          Q2_PICKER.techTemp.add(tid);
        } else {
          Q2_PICKER.techTemp.delete(tid);
        }
        // 重渲染以同步群組/全選 cb 狀態(indeterminate)
        q2RenderTechTree();
        q2UpdateTechPickerCount();
      }
      function q2UpdateTechPickerCount() {
        const c = Q2_PICKER.techTemp.size;
        const a = document.getElementById('q2TechPickerCount');
        const b = document.getElementById('q2TechApplyCnt');
        if (a) a.textContent = c;
        if (b) b.textContent = c;
      }
      function q2TechExpandAll() {
        // 全 42 都已平鋪展示，不需展開
      }
      function q2TechCollapseAll() {}
      function q2TechClearTemp() {
        Q2_PICKER.techTemp.clear();
        document.querySelectorAll('#q2TechTree .q2-tree-cb').forEach(cb => cb.checked = false);
        q2UpdateTechPickerCount();
      }
      function q2TechApply() {
        const mode = Q2_PICKER.techMode || 'q2';
        const isIndArchMode = mode.startsWith('adm-firm-ind-');
        const items = Array.from(Q2_PICKER.techTemp).map(key => {
          if (isIndArchMode && key.includes(':')) {
            // 格式 "TID:archIdx" — 代表選了具體技術架構
            const [tid, ai] = key.split(':');
            const techData = (typeof TECH42_DATA !== 'undefined') ? TECH42_DATA[String(parseInt(tid,10))] : null;
            const arch = techData && techData.archs ? techData.archs[parseInt(ai,10)] : null;
            return {
              id: tid, archKey: key, archIdx: parseInt(ai,10),
              name: techData ? (techData.name.length > 18 ? techData.name.substring(0,18)+'…' : techData.name) : '#'+tid,
              archName: arch ? arch.name : ''
            };
          }
          const data = (typeof TECH42_DATA !== 'undefined') ? TECH42_DATA[String(parseInt(key,10))] : null;
          return {id: key, archKey: key, archIdx: -1,
            name: data ? (data.name.length > 22 ? data.name.substring(0,22)+'…' : data.name) : '#' + key,
            archName: ''};
        });

        if (mode === 'q2') {
          Q2_STATE.techs = items;
          q2RenderTechChips();
        } else if (mode === 'adm-firm') {
          ADM_FIRM_TECHS = items;
          admRenderTechChips('firm');
        } else if (mode === 'adm-industry') {
          ADM_IND_TECHS = items;
          admRenderTechChips('industry');
        } else if (mode === 'adm-case') {
          ADM_CASE_TECHS = items;
          admRenderTechChips('case');
        } else if (mode.startsWith('adm-firm-ind-')) {
          const pathIdx = parseInt(mode.split('-').pop(), 10);
          ADM_FIRM_IND_TECHS[pathIdx] = items;
          admRenderIndPaths('firm');
        } else if (mode === 'cases-search') {
          // 歷史鑑定案件查詢條件 5 — 同步到 advTechChips
          const chipsEl = document.getElementById('techChips');
          const countEl = document.getElementById('techCount');
          if (chipsEl) {
            chipsEl.innerHTML = items.map(it =>
              `<span class="adv-tech-chip" data-code="${it.id}">${it.id}<span class="name">${it.name.length > 8 ? it.name.substring(0,8)+'…' : it.name}</span><span class="x" onclick="removeChip(this)">×</span></span>`
            ).join('');
          }
          if (countEl) countEl.textContent = items.length;
        }
        q2CloseTechPicker();
      }
      function q2FilterTechTree() {
        const kw = (document.getElementById('q2TechFilter').value || '').trim().toLowerCase();
        document.querySelectorAll('#q2TechTree .q2-tech-row').forEach(r => {
          const name = (r.dataset.name || '');
          const tid = (r.dataset.tid || '');
          if (!kw || name.includes(kw) || tid.includes(kw)) {
            r.style.display = '';
            if (kw) r.classList.add('matched'); else r.classList.remove('matched');
          } else {
            r.style.display = 'none';
            r.classList.remove('matched');
          }
        });
      }
      function q2ClearTechFilter() {
        document.getElementById('q2TechFilter').value = '';
        q2FilterTechTree();
      }

      // ESC 關閉 modal
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
          document.querySelectorAll('.q2-modal.show, .adm-modal.show').forEach(m => m.classList.remove('show'));
        }
      });

      // ════════════════════════════════════════════════════════════════
      // v3.3 後台管理通用互動：modal 開合 / 排序 / 刪除確認 / 拖拉
      // ════════════════════════════════════════════════════════════════
      function admOpenModal(type, mode) {
        const map = {firm:'admModalFirm', industry:'admModalIndustry', tech:'admModalTech', case:'admModalCase', cat:'admModalCat'};
        const titleMap = {firm:'admFirmTitle', industry:'admIndTitle', tech:'admTechTitle', case:'admCaseTitle', cat:'admCatTitle'};
        const titles = {
          firm: mode === 'edit' ? '編輯廠商資料' : '新增廠商資料',
          industry: mode === 'edit' ? '編輯產業節點' : '新增產業節點',
          tech: mode === 'edit' ? '編輯關鍵技術' : '新增關鍵技術',
          case: mode === 'edit' ? '編輯鑑定案件' : '新增鑑定案件',
          cat: mode === 'edit' ? '編輯技術類別（L1）' : '新增技術類別（L1）',
        };
        const t = document.getElementById(titleMap[type]);
        if (t) t.textContent = titles[type] || '新增';
        const m = document.getElementById(map[type]);
        if (m) m.classList.add('show');
        // 開啟關鍵技術 modal 時 — 重置 tab 到 main，並渲染架構區
        if (type === 'tech') {
          admSwitchTab('tech', 'main');
          admRenderArchs();
        }
        // 開啟鑑定案件 modal 時 — 初始化中轉公司動態列
        if (type === 'case') {
          const initVals = mode === 'edit' ? ['CHIMEI INTERNATIONAL HONG KONG'] : [];
          setTimeout(() => admRelayReset(initVals), 30);
        }
        if (type === 'firm') {
          admSwitchTab('firm', 'basic');
          // 編輯模式時可預載 demo 資料，新增時清空
          if (mode === 'edit') {
            admLoadFirmDemo();
          } else {
            ADM_FIRM_RELS = {parents: [], children: []};
            ADM_FIRM_ALIASES = [];
            ADM_FIRM_INDS = [];
            ADM_FIRM_TECHS = [];
            ADM_FIRM_IND_TECHS = {};
          }
          admRelRender();
          admRenderAliases();
          admRenderIndPaths('firm');
          admRenderTechChips('firm');
        }
      }

      // 編輯模式預載 demo 資料（用日月光示範完整關聯）
      function admLoadFirmDemo() {
        const tsmcAse = (typeof Q2_FIRM_DB !== 'undefined') ? Q2_FIRM_DB.find(f => f.uniform === '76027628') : null;
        const tsmcInvest = (typeof Q2_FIRM_DB !== 'undefined') ? Q2_FIRM_DB[2] : null;
        const mtk = (typeof Q2_FIRM_DB !== 'undefined') ? Q2_FIRM_DB.find(f => f.uniform === '84149961') : null;
        const innolux = (typeof Q2_FIRM_DB !== 'undefined') ? Q2_FIRM_DB.find(f => f.uniform === '97162640') : null;
        ADM_FIRM_RELS = {
          parents: tsmcAse ? [
            {firm: {uniform:'03245678', formal:'日月光投控股份有限公司', shortZh:'日月光投控', stock:'3711'},
             type:'control', pct:100.0, date:'2018-04-30', source:'MOPS', flagWarn:false, note:''}
          ] : [],
          children: [
            {firm: {uniform:'22520447', formal:'矽品精密工業股份有限公司', shortZh:'矽品', stock:''},
             type:'control', pct:100.0, date:'2018-04-30', source:'MOPS', flagWarn:false, note:''},
            {firm: {uniform:'89441120', formal:'日月光福懋通信股份有限公司', shortZh:'福懋通', stock:''},
             type:'control', pct:75.0, date:'2010-08-15', source:'MOPS', flagWarn:false, note:''},
            {firm: {uniform:'CY0001', formal:'ASE Test Holdings (Cayman)', shortZh:'ASE Cayman', stock:''},
             type:'overseas', pct:100.0, date:'2015-06-01', source:'投審', flagWarn:true, note:'透過開曼中轉之海外控股'},
            {firm: {uniform:'CN0001', formal:'日月光（上海）封裝有限公司', shortZh:'日月光上海', stock:''},
             type:'overseas', pct:100.0, date:'2003-11-12', source:'投審', flagWarn:false, note:''},
            {firm: {uniform:'VN0001', formal:'ASE Vietnam Co., Ltd.', shortZh:'ASE Vietnam', stock:''},
             type:'overseas', pct:100.0, date:'2021-03-08', source:'投審', flagWarn:false, note:''},
          ]
        };
        ADM_FIRM_ALIASES = [
          {type:'集團簡稱', name:'日月光投控', note:'集團母公司'},
          {type:'拼寫變體', name:'ASE Group', note:'英文集團名'},
          {type:'媒體用語', name:'封測龍頭', note:''},
        ];
      }

      function admCloseModal(type) {
        const map = {firm:'admModalFirm', industry:'admModalIndustry', tech:'admModalTech', case:'admModalCase', cat:'admModalCat'};
        const m = document.getElementById(map[type]);
        if (m) m.classList.remove('show');
      }
      function admSave(type) {
        const names = {firm:'廠商資料', industry:'產業節點', tech:'關鍵技術', case:'鑑定案件', cat:'技術類別'};
        alert(`✓ ${names[type] || '資料'} 已儲存（demo 用）`);
        admCloseModal(type);
      }
      function admConfirmDel(name) {
        if (confirm(`確定刪除「${name}」嗎？\n\n刪除後無法復原（demo 用）。`)) {
          alert('✓ 已刪除（demo 用）');
        }
      }

      // ════════════════════════════════════════════════════════════════
      // v6 新增:廠商資料管理 — 批次匯入 modal
      // ════════════════════════════════════════════════════════════════
      
      // 範本檔(base64 內嵌,點擊「下載匯入範本」即可下載)
      const IMP_TEMPLATE_B64 = "UEsDBBQACAgIAJESpVwAAAAAAAAAAAAAAAAaAAAAeGwvX3JlbHMvd29ya2Jvb2sueG1sLnJlbHO9kstqwzAQRff5CjH7WLb7oBTL2ZRCtm36AUIeWya2JEbTR/6+alMaB4LpwnQl5kpz70Ez1eZjHMQbUuy9U1BkOQh0xje96xS87B7Xd7CpV9UTDprTk2j7EEXqcVGBZQ73UkZjcdQx8wFdumk9jZpTSZ0M2ux1h7LM81tJUw+ozzzFtlFA26YAsTsE/Iu3b9ve4IM3ryM6vhAhOfViMtTUISv4Lo9ikSUzkJcZyiUZIh8GjCeIYz0Xf7Vk/LunfbSIfCL4lRLc1zH7F9f/DFPOwdwsOhirCZtnprTp0/lM5R+YVSXP9r/+BFBLBwiyzuVs6QAAADYDAABQSwMEFAAICAgAkRKlXAAAAAAAAAAAAAAAAA8AAAB4bC93b3JrYm9vay54bWyNU0uP0zAQvvMrIt/bJH3RVk1XJW21K/HSdtk9O8mkMXXsyHZfIK5w4wQIbhzRXjkixJ9hl/0ZTJx2KQIhDkk8D3/zfTOTwdEm584KlGZSBMSve8QBEcuEiXlAnpxNa13iaENFQrkUEJAtaHI0vDNYS7WIpFw4eF/ogGTGFH3X1XEGOdV1WYDASCpVTg2aau7qQgFNdAZgcu42PK/j5pQJUiH01f9gyDRlMYxlvMxBmApEAacG2euMFZoMBynjcF4JcmhRPKQ50g4pj4k7vKX9WDkRjRfLYorZAUkp14BCM7l+FD2F2KAiyjlxEmrA73mtfcpvENJgJpZBZ+k4Z7DWv+KlaRGPpWLPpDCUz2IlOQ+IUctdNSRqWPy3yKxs1BmN9N65uWAikeuA4Ii2B+e1PV6wxGQ4wE6z29r7joHNMxOQrt9rEMfQ6LRsVEDaHl5LmdLGFrEoFJWsAOuVFgpyDxTZme2/jrAN/f712483n24uL6/fvy4JY+Qkwfp2WwwmrJhmEUfeqs8woE6SZol7iHH15ePV25c3n19dv/twgNH4B0bLctsTwsbFOElmQGF+KJcCxfilOgXpA5kgxAgZ7eK3Y97ZY+CGoty653l+iQsbc18b+90tJZd4/mMxOYsUVKtot5I4S8UC8vxup9EJu51GrTHymzXfn7Rr95qtdm06mU5xBuE47E1f4IZa1D4+YcVfG4W/2ymksy1uySYgk00MfGQ5uZhWvS01d79dw59QSwcIXUoWvjECAAC6AwAAUEsDBBQACAgIAJESpVwAAAAAAAAAAAAAAAATAAAAeGwvdGhlbWUvdGhlbWUxLnhtbM1XwXLbIBC99ysY7gmSLDmyJ3YOST09dKYzTfoBCCGJBiEN0KT++yKwJRQ5rtM6nfqAYXm8XR7sYl/f/Kw5eKJSsUasYHgZQEAFaXImyhX89rC5SCFQGosc80bQFdxSBW/WH67xUle0psAsF2qJV7DSul0ipIgxY3XZtFSYuaKRNdZmKEuUS/xsaGuOoiCYoxozAXfr5Snrm6JghN415EdNhXYkknKsTeiqYq2CQODaxPjFAsFDFyBc70P9yGm3TnUGwuU9sfH7Kyw2fwy7LyXL7JZL8IT5Cgb2A9H6GvUArqe4wn52uB0gf4wmuLCIF1d5zxc5vimOUkpo2PNZACbE7GLqOy7SMNtzeiDXnXKTIAniMd7jn03wiyzLksUIPxvw8QSfBvMYRyN8POCTafyZmZmP8MmAn0+1vlrM4zHegirOxOPBE+xPpocUDf90EJ4aeLo/8AGFvJvj1gv92j2q8fdGbgzAHq65pALobUsLTAzuFteZZBiClmlSbXDN+NYECQGpsFRUmyvSOcdLir1VzkTUCxN64axm4phnzozr83kenCFfECtP7Q8Y5/d6y+lnZQNTDWf5xhjtwMJ6+dvKdKFl7GfcyF9USjz01Y62VKBtVLejI7ymIjChnS3xUnvsrFQ+4awDnko6uzqNNHSF5UTWMDnGijwVzHUFuKvg4TxyLoAimNO8P17NOP1KiQbcnr62rbRt1rXOy0jiv5BbVTinO73D06RJf6+Mx7qYnU9wnzY+g+LBnymOpjnDxXgEnk2ISZSY7MWtKYkm2U23bo1TJUoIMC/No06021crlb7DqnJbs6m0f1rEwBclcRf8+QhnaXgeQvRSAFoURs9XLMPQzDmSg7PnB6NDkWXl5j8tgPGJBTB+S6mK96VqnE6Ld8nS6OgO/Cxtsa5A15g7xyTh7qnu0uyh2eemexC6/LxwNahL0p3RJGqYet46qn9fTQeZ0xPP7o2Czt5J0OSAnskZ5ETT/EKjnx9o8h9gb1n/AlBLBwg7od8K9AIAAAINAABQSwMEFAAICAgAkRKlXAAAAAAAAAAAAAAAAA0AAAB4bC9zdHlsZXMueG1s7Vtbj6M2FH7vr0C8dyFALlRJthlmqdpK1aozK1Wq+uAEJ0ELdmQ8u8n++tqYcAl2NhdmQloyGhHO8Tnf8edjYxN7/H4bR9oXSJIQo4nee2fqGkQLHIRoNdE/Pfs/jnQtoQAFIMIITvQdTPT30x/GCd1F8GkNIdWYB5RM9DWlm58MI1msYQySd3gDEdMsMYkBZbdkZSQbAkGQcKM4MizTHBgxCJE+HaOX2I9poi3wC6IT3cpFmrj8GrDYBo6uCXceDlgov0AECYh0Q1q4Xy38My9mZDjT8RKjElxfF5LpOPmmfQERs+/x8gscYaJRViHmIZUgEENRwgNROCchFy5BHEY7IbZSuzUgCWNGuEqRhfsDELPqckZCUZ2yQ7Nl5nOhoOQFcl3ubVQQRlbzie77pm/ZzrAK8gemWHsCKNG8337XnjwpfRW8UIFn1vAGztAZPdwWT03id3JCRav9SrSq8Ho1vEdn5tqzhqp5BMd1ZvbD6PVxeh8s1746Tc4EaDwv6ukoPq2AvYLOG3WzOqxn2q7VXJrUARrOw9MA3oC4V6+XbKBobgC8EY/1YaSZjnUdXlPVPP2h2ky3axT+AhLSC59mhlGUTzMHuhBMxxtAKSTIZzda9v15t2FzTMTm2MJNWu47pVcE7Hps8nqyQYKjMOBRrLxqgtuzftry80PFPvONks8r0QqKD9Bc17YHg4bR/J7f910JWpHuTaJ98G1vqEBzXSVaemH5MsckYGux8jpIiLQgBCuMQPRpM9GXIEqgnose8Ve0F07HEVxSBkPC1ZpfKd7waDClOGZf9jY8EOH5MgQtXf+xLrVO12/VPvTw2P8gegMvmsVyokVaNg37RANWcl+/Ey1EYTkX2RfWFAsYRU/c31/Loj1M5na7rC9KUXrD1s68HbOvwlN2AzabaOdj7iQdhYTgIS1SEc2icIVieFDwI8EULmi6Rk/F0zHYF9TWmITfmGs+CK2yNTFf0tNwwUWiurpG4Zb+iSkQXlhMXwnYPDNh3twhClJgpkvWJESfn7Ef5mpG0yYPQ4vw4jMM9kGuw4CZlkoa2+UBU2bBU+9SnrI4D4kqi8tM7RP2foKxumAUwVzct7pgumC6YLpgumAuCcax2/SkdHqtisZpVTRWm6JxbxyMUZ6+i8l8eR5vXzqP3y7roZcDujL2e5vUV2hzzqPt5HXQf5q0fkfa+aQNO9LOJ210NWmKQU3xnuI4afzNUJmxBSsASbsYc1vF2J6hdnPWO/Ph2fXNV2XtokyTkHZCqgmoN+Ss9H7KKnPWuwVnd9I77Y6zszlTzWs7ztScqaa1N+HssvHsf07anSTaoE2c3cmDU7USuCPO3j7RVIuBrnMqObNKr/7s++TsrftmmbI7naC9CWX9grLSE8C5OWN3Mpp1nF31prbj7MS+aZXWm/2bv9do8VOzxFn369MR2ozsl7zS/rzK/tpcqvH9u3zrMIl57Dlz85cwoiESd0bdwMNxDPbl+YqsZGArDbS/zX9yo0HFaCA1eiEEosUutxlWbJxjNhWsUcVuKLP7CAlP89zErZiI3cMFmdm2SXblTbeFgZfdktW8sqPVTD/c+lBT7Kyta1Q2psn/5RquU+GoIlDZcLlcM1LWxzRHSg3Xyb2pbEZKGy6XazyT/6lw5DYu+8hrWuyzrvGWb1+uafJt1IeawcA0Fd58VWzcwvOkNc236Z7Otbq11RlyPA9UbXosQ1Q1VWei58k1XK7WyHkr9pfXW1uFI3RyHFXuCJ1Mw3NKbmPbnifH4fiqHqzSFMcR6zY8F6U5mh8hq0WQnyU61BSHIur1cV15xhdHM+s2ti2PrTgOcXo/5d7krVA6sXEwfhv7cd0ojm5P/wVQSwcIQMry+3IFAAD/PQAAUEsDBBQACAgIAJESpVwAAAAAAAAAAAAAAAAYAAAAeGwvd29ya3NoZWV0cy9zaGVldDEueG1svZpdc6M4Fobv91dQ3E+MEJ8u21PTjrOzVT2bqU3PTtXcESPHVGPECtnp9K9fSSAsJEG7pmzfJOZw0NHzShwdy1r8/O1QOidEmgJXSxc8eK6Dqi3Oi+pt6f7x5emnxHUamlV5VuIKLd0P1Lg/r/6xeMfka7NHiDqsgapZuntK6/ls1mz36JA1D7hGFbuzw+SQUXZJ3mZNTVCWi4cO5cz3vGh2yIrKbVuYk0vawLtdsUWPeHs8oIq2jRBUZpR1v9kXdSNb+5Zf1F5OsneGKvujdPGxvdO3BwKjvUOxJbjBO/qwxYeuayZlOksHnN+I//daAiFDPRV8pHzZ2GF7CeUhI1+P9U+s7Zop9VqUBf0QwO5qIdr/nTi7oqSI/IZzNsi7rGwQu1dnb+gF0T9qcZ9+wb8zg7w9Wy1m3cOrRV6w8eA9cwjaLd1P/nwDY+4iPP5boPdG+ew0e/z+xDp4LLNGtieM/yRF/rmo0ND6H/y+xuWvTA02UZcuJcfuxl+IySYNpHjbsz5+RjvaP02z1xdUoi1Fufrc85GWLMrLx+EVl30DOdplx5LyPrBwmEj7iXV56VZc0JI1iWseYo3Kcun+Alxny33/xdqPAtf5jvHhZZuVTCbgecr1v8XjupUL+jn7wEehS3eXv1uvGH/lJt6ux4dJUHCB64y/h10vXCdj1hM69+Z83T7qNP8TQ8Lu9SPGG1Y/y7F5EnOGDXanBFPhzyKn+6WbPERxGiVx2KvExuRXxBVnnWbW72wk5HWnPW5F/oxOqGTeojOqjbXess0GwVcLJmgj/nJpy6xu+OB1jW6PDcWHrlft8OyLPEeVNayIeci+sT6y/0Ul/jf0gw8PF7ptJuDKXDec34XzLeHC64eDXThoCed7148XdPECS7zk+uHCLlxoCRcLvFk7Z9rMndFstSD43SFiANqo7fTqA/F5CsFDaPSg9ZZTue2k0SsDjRHzaJ/4eItJxp5tmPW08hazE+9f57GWHrPO8KgbNophxih6FDiBAn4EMqbvKAkUvfAVEqCRSI+eRDdsFMOAJJwiiR6uDxOKjkAFxtdgpEcPoxs2imEAE03A+OAhvvYUi0Q/AoUFaiytR6h4BEOPx9YjUjzCocdGeui08Z1pY4M20mjjH9LGBm2s0cYjtMmdaRODNtFokx/SJgZtqtEmI7TpnWlTgxbo2TL9IW5q4AItUW3SEV7g3RmYB9SJ9UTU+Uwhdy4DZi0HbHofA3pqRbwJtG8kXxDo0L6efg3LRrUMiSYXxvTqazyAxgiBUAdqfWLVJ9KHUfqcERXLEDG4M2JwAWJgIsY6YmAgBmOIk0XBDRDDCxBDEzHREUMDMRxDnCoVboFoFgImYmQipjpiZCBGY4hT9cEtEM3V30SMDUTf0xFjAzEeQ5wqCm6BaC75JmJiIgIdMTEQkxFEH0ytEcG1vzMBszrXV8Xe5/y1SbdsVMsQZ3LJuzpOu04lKo5eoXc+qeqjr/I2H71Kt/mcl5mhCHdeJf12LeN1CHu6sn6DlD7q92VfX0Okk/pV1E90ITqnwSRKR5S482LqB6YSxvzufAZf6/QkJZ3UVAD1Ylc6qUpAf0SJO6+5fmgqYbwaoTknINSVCC+ZE6FFiWBEiTsvzX5kKqEXxdJnMCdCXYnokjkRWZQYyxN3XsH92FRCX96kz0AJI0/ElygRW5RIRpS480LvJ6YS+maH9Bkooddr0mlaicRUIvBGlJjaGbiFEqmpRKwrkZp5ItBrHuk0nSdSixIjGRNObRncQAnomUroW0LSR50TgZ4xpdPknJBOAyVGMiacqhFvoQQwlUh1JYBFCT1jSqdpJYBFiZGMCafKy1so4VsqK33jTDoNpNBTpnSalsK3SDGSMuGdi0xoKzKN3ymgRQo9Z0qnaSksVWY4kjPhnatMaKkyjc1F6aQmzVBPmtJpMmlCS5kZjiXNO5eZ0FJm6huka2ipM0Mja15SZ0JLnRmOZc0715nQUmcau6/SaSCFkTajS6SwFJrhWNq8c6EJLYWmsZECLZVmaKTNSypNaKk0Qz1tzpQfrA+IvIlzGw1jOFZU7Bcq5vPJGvGDqm6H8w202cP5JrTYH6P5JrLZ4/kmttmT+Sax2dP5JrXZgTfnP0JYegQYArAxrAGDADaKNQjmfOvYdocBAhvhGjBEYGNcAwYJbJRrwDCBjfOTD+Z8h4nvLZ1HarWoSVHR51qcP3P2KOMH55p+xr4Zx5l6ywvq5/Aek+I7rmhWrlFFEVFOTJwQocXWvDFrD2f9lpG3ggUuxZknT/x4Q9rXo72guBbHEV4xZa+O+LgXx6i4QwhAAoDnw8j3vYDN1x3G1H5r1h8GO9ZOndWIvBTfkdh5apTTTuKQWHe+A3SX/Skh1+FNPBMRPcfv1Zc9qp4ZIXuLScEAxSm+pVtjQklWUNbrMtt+/aXK/9wXtD935uQkU054bdk4rPGBHwds+CGtaiDoY13wot07K3m2bHFdIHnSolXlSQjg5MVux9Su6FNBmnOo3vyc55vTOTGtFjjP29NpbHYon9nHtsXW3H9Wg7HL/izl6v9QSwcIjs2+1HkHAACPKQAAUEsDBBQACAgIAJESpVwAAAAAAAAAAAAAAAAYAAAAeGwvd29ya3NoZWV0cy9zaGVldDIueG1s7Z1Lb9zWFcf3/RSDWXSleHj4piopiC3LdiJZQeUkQHfUkCMR5pAMSUmWV00b106NPoDaRuIaaRo4RRA3boA2iWE3/TQayfoWvXzMQ5x7Jm5g/RdFNtHM5Z1zzz08/HGMzA9cePVaP2zt+mkWxNFim84o7ZYfdWMviLYW229dWXnFbrey3I08N4wjf7G972ftV5d+srAXp1ezbd/PWyJAlC22t/M8me90su6233ezM3HiR+JIL077bi7epludLEl91ys/1A87qqKYnb4bRO0qwnz6IjHiXi/o+stxd6fvR3kVJPVDNxfpZ9tBkg2jXfNeKJ6Xuntiq8N8JlJcro6M4pE+Fa8fdNM4i3v5mW7cr1Ob3qXTcU7s81qq/rBIZIit7gbFmVKHwfrdF9ll302v7iSviNiJqNRmEAb5frnh9tJCGf/NtNULwtxP12JPnOSeG2a+OJa4W/6Gn7+VlMfzK/GbYmB4uLO00Kk/vLTgBeJ8FJm1Ur+32H6N5tdF/GJOOeXtwN/LJl63su14b0VkuBO62TBgOXghDbzVIPLFaJ7u1IM/j/fOxeFFUQ3RqJMHfuGLsg0H0mBrW+S46vfyUcjc3dzwQ7+b+96JZdZ38lCssrHf34zDUQTP77k7YV7kINaL0+H4rkh5sR0VFQ1FzDgp1jjnh2Gx03arW8y9JBYw9Xbrehz3N7puKOpEogLj95fLjzdHi4quuvvxTlmX+mhxcW3G8dViqIirlOci8lvXNhJx7oqB1n79kpoJid5wu3mwK0IXF+xmnOdxvzheXsh5cf7S+LoflSenrE1x2pJych1pGGG8xfH7Kp9W9m59omVhJtf83yJ1Ri0y+XrYOitlT4tmrE+UOEnvBF6+vdi2z5iWY9qWMTqJomcu+kVHiBKJ0euiU4bv6z6Iqx5Y9Xf9UMwuk5kcE9Gr0ndOLL60IM53Vv63OPOhm2QTzdXdycTW66yq7tkOPM+PpMuWa/bda+Vp7AdR+TfL94vuKfqgCkN6UZqXu55ar6fK1lNf/np6vZ4mWU+zX/56Rr2eAdqfWa9nytZTXv56Vr2eBdqfXa9ny9Y7hfPn1Os5oHqSMrwAFdAOaXTJy6559RTOIQ0vepJe9aexR224ouy6P5XzOARN8WJ6RfMUVhyihmSs0co9dqpbRvXF0s3dpYU03mulJe6rdau7y2ip4jalmVMZVHOH97EqyamsprYmdlysVdx9s7IGLfHhTAzvLqnWQme3yK+ec7aeY03M0ZSTc85J4mjayTnLsjjGyTnnZXMa+azI5jgn51yQ5KPTyTkXJXGMRpxLkjl6I+fXZXMaOb8hmWM2argqydlo5Lwmm9Oo82XZnEbO67K9j3PuiFYc9aM6ox9VOlN8v3qpLalWqdmTpWqU4Ww9x5mcozZaspqjKpNzmi0pi6M3WlIWp1HOlRNzouoyUtRGpAuySGajKWWRDEdTNFvRHavRMpcksy1Tt+xGh8oWbnaorBSNOKuyOI0rZk0yp5n2ZdmcxileH83pNPpRA/ejNt2PVqPXzmrTxbMavXZOk2y60SHLsjhNRMriNLpoRXuhfpREmupHSSRdU01HcwzHaLajZLKm6s2r5XXZDprtKKtEsx1l+TfbUbZWsx1lc5rtKJvjyIGpz2pQ/SV3p17lRRN52Y39nR3N6Qx7cWpkeWrk/NTIytTIhamRi1Mjl6ZGXp8aeWNqZHVqZG1q5PLUyPrkyIlzYsw4J/R9xOC+67EnxajSUKfSMKFpmFwaFjQNi0vDhqZhc2k40DQcLo3iX5nAPMp/1MoTmfUvkFNIhNhEZn31PIVEVDaRWd85TiERjU1k1r3lFBLR2USwQCWWqIRFKrFMJSxUiaUqYbFKLFcJC1ZiyapiyaqyZFWxZFVZsqpYsqosWVUsWVWWrCqWrCpLVhVLVpUlq4olq8qSVcWSVWXJqmLJqrJkVbFkVVmyaliyaixZNSxZNZasGpasGktWDUtWjSWrhiWrxpJVw5JVY8mqYcmqsWTVsGTVWLJqWLJqLFk1LFk1lqw6lqw6S1YdS1adJauOJavOklXHklVnyapjyaqzZNWxZNVZsupYsuosWXUsWXWWrDqWrDpLVh1LVp0lq4Elq8GS1cCS1WDJamDJarBkNbBkNViyGliyGixZDfD/uGLJamDJarBkNbBkNViyGliyGixZDSxZDZasJpasJktWE0tWkyWriSWryZLVxJLVZMlqYslqsmQ1sWQ1+d8EgH8UwJLVxJLVZMlqYslqsmQ1sWQ1WbJaWLJaLFktLFktlqwWlqwWS1YLS1aLJauFJavFktXCktViyWphyWrxv7cC/+CKJauFJavFktXCktViyWpjyWqzZLWxZLVZstpYstosWW0sWW2WrDaWrDZLVhtLVpslq40lq82S1caS1eZ/ywr+MStLVhtLVpslq4Mlq8OS1cGS1WHJ6mDJ6rBkdbBkdViyOliyOixZHSxZHZasDpasDktWB0tWhyWrgyWrw3sCYFFghimAVgV4V0ABywIKbwsoYF1A4X0BBSwMKLwxoICVAYV3BhSwNKDw1oAC1gYU3htQwOKAwpsDClgdUHh3QAHLAwpPW7SYNcvMQqtZPG3RctYMOwutZ83ws9CC1gxDC61ozXC00JLWDEsLrWnN8LTQotYMUwutavGuFoFlLeJtLQLrWsT7WgQWtog3tgisbBHvbBFY2iLe2iKwtkW8t0VgcYt4c4vA6hbx7haB5S3i7S0C61vE+1sEFriIN7gIrHAR73ARWOIi3uIisMZFvMdFYJGLeJOLwCoX8S4XgWUu4m0uAutcxPtcBBa6iDe6CKx0Ee90EVjqIt7qIrDWRbzXRWCxi3izi8BqF/FuF4HlLuLtLgLrXcT7XQQWvIg3vAiseBHveBFY8iLe8iKw5kW850Vg0Yt404vAqhfxrheBZS/ibS8C617E+14EFr6IN74IrHwR73wRWPoi3voisPZFvPdFYPGLePOLwOoX8e4XgeUv4u0vAutfxPtfBBbAiDfACKyAEe+AEVgCI94CI7AGRrwHRmARjHgTjMAqGPEuGIFlMOJtMALrYMT7YAQWwog3wgishBHvhBFYCiPeCiOwFka8F0ZgMYx4M4zAahjxbhiB5TDi7TAC62HE+2EEFsSIN8QIrIgR74gRWBIj3hIjsCZGvCdGYFGMeFOMwKoY8a4YgWUx4m0xAutixPtiBBbGiDfGCKyMEe+MEVgaI94aI7A2Rrw3RmBxjHhzjMDqGPHuGIHlMeLtMQLrY8T7YwQWyIg3yAiskBHvkBFYIiPeIiOwRka8R0ZgkYx4k4zAKhnxLpkKdslUiUvWmXgIZt9Pt8pHQWcixk5U5NCeGK2fJa7Pr5cPQO6Mpy8teCLA224YeNWj34ef19vNQy03DOO9s6EbXR0+cMtP0+LZ3s8f3R785+ODJ7cPb39w/N6Twb3HB0++FC8O/3Tz8MEHh3dvDX7573ryRvVYT1GMpB65EuTFyNH7fxUTj+6/Lz53/MkNUZzET928CL/p53u+H7XL540vp3GyHO+NK1sMni8CrflZVj5VffxU80tRspOPxocfqB6TfUGdv1CWNd9PxMEwyHKx5V5cPkqdln767k6c/+zwwRcHT347ePKrw0e/nqteFX+Kd89v3Sr+HH797eDhvcE//nb86E71mYXOKMgwnLqkjEZVUf+Thf0/L/SqOr/6vYV+fvOLwe27g1sPB4/vzw3u/+v45u/mjh99KIr95dzBd7//sbKyyq6p82vfW9nB3b8c3fl8bvDeg/LPH28dfPf185v/HNz45uDZvcGNvw/+8OTH6sqqe1mdv/wC1f3N4WdfihpWlTz66Nnzzz+cG3z72dEnd44/+vTozqfF4QdfDR7cmxt8dWvw+JujPz88fvbx3MHTp2LW4NnTwy9+ODcaA4LmSRpE+XpSoXzbd70g2spGO9tKA29V3HEkIxt+PnpYc5wG1+Mod8NzfpT76fh21Nr10zzoTh8QN5VElHDNTbcCsXDo90Q0pXyqaFrd8qo34qwWt6bWZpyL22H5skjST4sJBpFNpKiaqapK8budXhzn8kP1eiLpnaSVuKITNoLrfvWQc5GeeFXa170gvxLXD6Km+u3wHizeFyHW03J1T3TMlW0/Whc7FK2VBmKDZU0X20mc5qkb5CLr0O1efS3y3tkO8nG7eKnbG9/Tu+Kuei7u98XnRZWjODpR0OUkKB7/oYwrOR7pxklQnJnyMYxVVVbKArS8oNcT1Y7ylSDNxkuNhtc97/zu+MvG0kLseRfLAKJFJl6Ll1XEanj0enIx8XYvTq+W3y2W/gtQSwcIRPWJPaEMAADVhgAAUEsDBBQACAgIAJESpVwAAAAAAAAAAAAAAAAUAAAAeGwvc2hhcmVkU3RyaW5ncy54bWztXVlTIlkWfp9fkcG8TEe0slkuNWpHj1EVE7PFRFjzAyiklAgEB7Cmq5+QYjWlsFpAQVRQUZDNXQTFiP4pZd6bmW/zE+Ym12ZoQL2UC3di0qgyBHI5fuec7yz33HT4ux+mTcx7g9VmtJhHFOpelYIxmPWWCaN5ckTxjzevewYVjM2uM0/oTBazYUTxwWBTfDf6m2Gbzc6gU822EcWU3T7zUqm06acM0zpbr2XGYEafvLNYp3V29NI6qbTNWA26CduUwWCfNik1KlW/clpnNCsYvWXWbEe31aDbzpqN/5w1jOF3BtWK0WGbcXS4dpeXthmdHt0cXcZmsL43KEZBJQHCHuHICyNRsFAE7hRfdMF4jvniCDHc5RUfSgt7e3Dl07DSPjqslK4k/beif39H34zMe51pRGG3zhoUSvTRj/i1WiW90ltMFitjnXw7onj9ur9voG/wD9Lb1tcWsx0f9zeL3cKM68w2ZuxPf2bGx6SP3+mmjaYP+HON9Iaydqdb5IfzYVDMgGCJD23CVF4M+uBGSshs8kcV/uSAwVJbH03g761GnalZSnzulM5qM9wcpr5XbuWji/ZwLBttgS8k+UWPjF9Htug/h7kk9qK6dHWXueWkf28ssQxcCnCXcZhPiZmNXzvaLWeN2w0zjJro0C+en4iO40qscOFHro8JAO6FyCXRtGeHugrULSpQv9IMaZ/AhH1e4NvnczmuvAAcLDhLIVyFZPrasdBo3deOQIv5dCrso5nytw8W5TFw2xOj2wi3VrfqGi5qCnC5dszRA4jm4cp5DEtZ5mMuxBFclcXOREx1NarQUkMV1XXK7J0S9YoRFuyyIJkFxSx0poWduZvEMOZq5NDO1N5HjdrzKyi0geoCPYqnIgCsrkuBs5Y1NwVLnAqikCkm5sS1TRm3RhnEyro4V0KIoTwuxWBHoYhTXv2gN5gogAlZD1eaB84jmN+uZ5ak3PGCFu7A7gHjHwXvHmDDYmZZyPub2LDrKqfBKwQ2BeN+caEo7G0LWZarronJoOA/hMFFfrvMXRVgfgtRsOgNwMg+Ngxik/gSSzDwKA1dQa7Migk3UZXy8xk1NnTsBvllmI6KyQUUUWHOxV0GeGdZIt0rN4q6cm3SjNhFGV4Ehcwhwgrse3lXEh6Fb6uyuyjmyQFXcvBnaSG6QY8Cf0eDAk8OECz0YPINDZg4y1ypIgZO6IGFCl+vRVjg3gVnhyhTB/E09EVQwgCTPvQmihfCtldwuPmYh1YakKJZyQl8qWvHnLiZFmN7fN7PH8fQS551QDeLfsApA1f1wPIiRcliHxUFqIPFMVHKG2rrD8AlmQJMXHAlFrJ+lG6DSIEe1GhwG8BeQT+LUlLhokSZP0i2Hs+JyQBS2n8zHfdHOc1pBiqLFHiF2y4SRC4XggixH/pZWMzJcDXzbJWlB5CXdPTuXC7JiJJZimKKWnXzRVzfQb8D1Y44BmBvuPGMBTdYzMLgqoAKp9wOyrKRc/D+c1iYRwUVYhRaKjyw40S/AM5McAlMjzpo8Nx6FwVld2JiUdi5FBNzXCWFKmOpRZCO8ttljFs98ssANkUKrrrW2EvpZLX5M3PjW4UYX82gkhUpgKiH8luio24uvhjg0wdEJ+CuR3vnfYshIVjSx1+PD3Vt9qWVTx8o2FOOQXQfs50g8HuJTbK1b3JfAzC+xNxlNHf8xk9W80mV/B1Rl1CSRzOLn88eLswjBMIrt5jwwZUiRcgM0gCMVAcdh2C4hBIXirChw2q4UgAEi7jVQ0wigjPJp9JcZYuURKQuAk0EIjWN6LEEJRV2MA+zH4E7B4IlrFi6XKWvp58Kd7kMYCIhL7DyW+AiyJXyMOLtIE/DpaU0B3K6BK82xI9pEPbAVB6pByuJj1aE9Ap3zoLCAgwfd3BpLJHAHnQoET6hdnPgTqMzyQYdkTEl01y5TCbbURhlyvVzwO4S6X1ApSxNmpwf08IyQuoKlclIILocST2kUvVoVENDxBZc77HTgizuTFME6wsaqAnFWIogUb+kABIY38PGi0IbRdi0KSO7lQTJqLRLg2RUmkKZzyej0souJ2dgOwKKO2K2zYhd5w2ip+oLFHdg6LS+MPiADtZzz850H7pfljkohOub202uC66Q30I1CKqMKOIIOvoreB2eHlRoSMuQW8l20rrADnZoSseGXqhowIVklb0L0HS8zg6WktL2yHIZkSQtdbTM2jJrd8BQv7TwCKwd+h0gnuZLW/U++/3dOyG/zx9W+c0y8O1fOxbwySDgqM9iUZdZi6sVIdPmqQe0pIgPWq5+qnGU00Ow5qApdwXBIgovWJfXjjlQWEEy0uP6d4zAPJ/rV1LII+nBhIYFM0RLwOcRY+S76xrn02lJAeRWutxKJ2sB1vZgAt82KMQowoaKRiCIHYvegIxKkxNlV2RImtk2L0PSPFDRZt7z/7z6lMa003lpJ0oD6Up7+qtr4PMlMiIx4UZVO/yU5gvkgyh4P5yceNwikJYKzcuJR0twDW/woTRFqFBBm2AuLqPSisqij7s8EbxHwH3KVSJ4Vo18qrVhn7BMk1+xa1mmyW7SZJvpUIpAooMfzlJ8IiRGN/Hja0F8H8QjMkhNIO37QOGUX90WK+syNi1rIMiG8Kgx+dKfMyqkK7REFCyNNMkt74ZptxbAZ8p89LLzea7W/ahPtOHva+e5CAXswjzX80HXwTzXc8N1xzxX13HrdKHzubHrYKHz2TC7baHzlsM10pYMtZbsIeMarVZFtqwe3OfntvhMQMyGJCWeFYWtS9GREJxJrnIpPTQwuthYJd1zuTc64790ZmbcMG3UW8wTs3o7gvGvOvPsO53ePms1mieZMUvvt8xf7BO9ZPsC80GwdIjSDbKtRA379u4bQIjs89lzfvczyJdA/CcQcBCdptL2vOjX9vcPDjJKxm6b1vfqLdNku6MaWnVkqqn1NQgPbZPbE5050K/SDPRrBokO1g6oycwPLqdg3AfcfjgfluLQp11kT19pUt+Pv2LeGPRTZuSSkx+YP1pME52bEbg4EaIhPkS4GTW7Iq66pF0hqQTcXCK2jYEebb96APkosg2dzTBpsrzVmYgNRFz1gPgKxgoWA+0guoW7yP/SwphKO6R5/KzoS87DSBsjIuf38uwDZX3Kh7fThiqf9/DOcttHu1MObutICm3Y4i2u+KFAwC893A7/yQXREQXuDPAt/69A/XvqoQbVdVSItD7Ino+5sFUziD5+nQYpbTb76H8AUEsHCHWKx7B/CQAAw2kAAFBLAwQUAAgICACREqVcAAAAAAAAAAAAAAAACwAAAF9yZWxzLy5yZWxzrZLBTsMwDIbve4oq9zXdQAihprtMSLshNB7AJG4btYmjxIPy9kQTEgyNssOOcX5//mKl3kxuLN4wJkteiVVZiQK9JmN9p8TL/nF5LzbNon7GEThHUm9DKnKPT0r0zOFByqR7dJBKCujzTUvRAedj7GQAPUCHcl1VdzL+ZIjmhFnsjBJxZ1ai2H8EvIRNbWs1bkkfHHo+M+JXIpMhdshKTKN8pzi8Eg1lhgp53mV9ucvf75QOGQwwSE0RlyHm7sgW07eOIf2Uy+mYmBO6ueZycGL0Bs28EoQwZ3R7TSN9SEzunxUdM19Ki1qe/MvmE1BLBwiFmjSa7gAAAM4CAABQSwMEFAAICAgAkRKlXAAAAAAAAAAAAAAAABEAAABkb2NQcm9wcy9jb3JlLnhtbJ1Sy07DMBC88xWR74mTVFQoalIJUE9UQmoRiJtxtqnBdizbbZq/x04a8+oJyYfd2fHsc7E8CR4dQRvWyhJlSYoikLStmWxK9LRdxTcoMpbImvBWQol6MGhZXS2oKmir4VG3CrRlYCInJE1BVYn21qoCY0P3IIhJHEO64K7Vgljn6gYrQj9IAzhP0zkWYElNLMFeMFZBEZ0laxok1UHzQaCmGDgIkNbgLMnwF9eCFubihyHyjSmY7RVcpE7BwD4ZFohd1yXdbKC6+jP8sn7YDK3GTPpRUUDV4lxIQTUQC3XkBIox3RR5nt3db1eoytN8HqfX7m3TvMjTIp+9LvCv/15wtFtd+YGq/sQ9K4CeUIOhminrdlkNwR+A8zmRzcENvgIZP20GSoD8Sjkxdu2Wv2NQ3/ZO4wI2VSbO2L9bmwSGzBqOzN9glQ5Jg+urNoe3d6B2bCk4zrbMchjhyfxzl9UnUEsHCJLicyhhAQAA4wIAAFBLAwQUAAgICACREqVcAAAAAAAAAAAAAAAAEAAAAGRvY1Byb3BzL2FwcC54bWydkMFuwjAMhu97iiri2iZEHUMoDdo07YS0HTq0W5UlLmRqk6hxUXn7BdCA83yyf1uf7V+sp77LDjBE611F5gUjGTjtjXW7inzWb/mSZBGVM6rzDipyhEjW8kF8DD7AgBZilgguVmSPGFaURr2HXsUitV3qtH7oFaZy2FHftlbDq9djDw4pZ2xBYUJwBkwerkByIa4O+F+o8fp0X9zWx5B4UtTQh04hSEFvae1RdbXtQbIkXwvxHEJntcLkiNzY7wHezysoLwtePBV8trFunJqv5aJZlNndRJN++AGNtORs9jLazuRc0Hvcib29mC3njwVLcR740wS9+Sp/AVBLBwhelgGP+wAAAJwBAABQSwMEFAAICAgAkRKlXAAAAAAAAAAAAAAAABMAAABkb2NQcm9wcy9jdXN0b20ueG1snc6xCsIwFIXh3acI2dtUB5HStIs4O1T3kN62AXNvyE2LfXsjgu6Ohx8+TtM9/UOsENkRarkvKykALQ0OJy1v/aU4ScHJ4GAehKDlBiy7dtdcIwWIyQGLLCBrOacUaqXYzuANlzljLiNFb1KecVI0js7CmeziAZM6VNVR2YUT+SJ8Ofnx6jX9Sw5k3+/43m8he22jfmfbF1BLBwjh1gCAlwAAAPEAAABQSwMEFAAICAgAkRKlXAAAAAAAAAAAAAAAABMAAABbQ29udGVudF9UeXBlc10ueG1sxVVLT8MwDL7vV1S9ojbbDgihbjvwOMIkxhmFxG3D2iSKs7H9e9wWpjH2oOoEl0aN/T3sJm4yWZVFsASHyuhROIj7YQBaGKl0NgqfZ/fRVTgZ95LZ2gIGlKtxFObe22vGUORQcoyNBU2R1LiSe3p1GbNczHkGbNjvXzJhtAftI19xhOPkFlK+KHxwt6LtRpfgYXDT5FVSo5BbWyjBPYVZFWV7cQ4KPAJcarnjLvp0FhOyzsFcWbw4rGB1tiOgyqqyan8/4s3CfkgdIMwjtdspCcGUO//AS0pgq4K9VMWwd+Pmr8bMY7IUn7m8A8Lbku3UTJoqAdKIRUmQGK0DLjEH8GS+XuOSK31C39MxguY56OyhpjkhiH5dAJ673Jr0F62uAcjqpXu9301s+Fv6GP6TD8y5A/nkHY2bs3+Qbe5jPpqL9xeXjZxOnbFII9FB+3K/9Cp0ZIkInFfHz9xGkag79xeqISdBttUWC/Sm7Czf0PwU7yWs/j2NPwBQSwcIuJCdonkBAADNBgAAUEsBAhQAFAAICAgAkRKlXLLO5WzpAAAANgMAABoAAAAAAAAAAAAAAAAAAAAAAHhsL19yZWxzL3dvcmtib29rLnhtbC5yZWxzUEsBAhQAFAAICAgAkRKlXF1KFr4xAgAAugMAAA8AAAAAAAAAAAAAAAAAMQEAAHhsL3dvcmtib29rLnhtbFBLAQIUABQACAgIAJESpVw7od8K9AIAAAINAAATAAAAAAAAAAAAAAAAAJ8DAAB4bC90aGVtZS90aGVtZTEueG1sUEsBAhQAFAAICAgAkRKlXEDK8vtyBQAA/z0AAA0AAAAAAAAAAAAAAAAA1AYAAHhsL3N0eWxlcy54bWxQSwECFAAUAAgICACREqVcjs2+1HkHAACPKQAAGAAAAAAAAAAAAAAAAACBDAAAeGwvd29ya3NoZWV0cy9zaGVldDEueG1sUEsBAhQAFAAICAgAkRKlXET1iT2hDAAA1YYAABgAAAAAAAAAAAAAAAAAQBQAAHhsL3dvcmtzaGVldHMvc2hlZXQyLnhtbFBLAQIUABQACAgIAJESpVx1isewfwkAAMNpAAAUAAAAAAAAAAAAAAAAACchAAB4bC9zaGFyZWRTdHJpbmdzLnhtbFBLAQIUABQACAgIAJESpVyFmjSa7gAAAM4CAAALAAAAAAAAAAAAAAAAAOgqAABfcmVscy8ucmVsc1BLAQIUABQACAgIAJESpVyS4nMoYQEAAOMCAAARAAAAAAAAAAAAAAAAAA8sAABkb2NQcm9wcy9jb3JlLnhtbFBLAQIUABQACAgIAJESpVxelgGP+wAAAJwBAAAQAAAAAAAAAAAAAAAAAK8tAABkb2NQcm9wcy9hcHAueG1sUEsBAhQAFAAICAgAkRKlXOHWAICXAAAA8QAAABMAAAAAAAAAAAAAAAAA6C4AAGRvY1Byb3BzL2N1c3RvbS54bWxQSwECFAAUAAgICACREqVcuJCdonkBAADNBgAAEwAAAAAAAAAAAAAAAADALwAAW0NvbnRlbnRfVHlwZXNdLnhtbFBLBQYAAAAADAAMAAcDAAB6MQAAAAA=";
      
      // 匯入流程狀態
      const IMP_STATE = {
        step: 1,
        fileName: '',
        hasErrors: true,    // demo 用:第一次預覽會有錯誤
        uploadAttempt: 0,   // 上傳次數(0=未上傳,1=第一次有錯誤,2+=修正後全通過)
      };
      
      function impOpen() {
        IMP_STATE.step = 1;
        IMP_STATE.fileName = '';
        IMP_STATE.hasErrors = true;
        IMP_STATE.uploadAttempt = 0;
        impGoStep(1);
        impUpdateStep1Hint();
        const fileEl = document.getElementById('impFileName');
        if (fileEl) fileEl.textContent = '尚未選擇檔案';
        const cardUp = document.querySelector('.imp-card-up');
        if (cardUp) cardUp.classList.remove('has-file');
        const nextBtn = document.getElementById('impStep1Next');
        if (nextBtn) nextBtn.disabled = true;
        // file input reset
        const fi = document.getElementById('impFileInput');
        if (fi) fi.value = '';
        // 顯示 modal
        document.getElementById('admModalImport').classList.add('show');
      }
      
      // 根據 uploadAttempt 更新 Step 1 提示文字
      function impUpdateStep1Hint() {
        const hint = document.querySelector('.imp-footer-pane[data-pane="1"] .imp-footer-hint');
        if (!hint) return;
        if (IMP_STATE.uploadAttempt === 0) {
          hint.innerHTML = '請先下載範本或選擇檔案';
          hint.style.color = '';
        } else {
          hint.innerHTML = `⚠ 已偵測上次驗證未通過,請修正後重新上傳檔案(第 ${IMP_STATE.uploadAttempt + 1} 次嘗試)`;
          hint.style.color = '#d4a93a';
        }
        // 同步更新 tip 區塊
        const tip = document.querySelector('#impPane1 .imp-tip-t');
        if (!tip) return;
        if (IMP_STATE.uploadAttempt === 0) {
          tip.innerHTML = `<b>使用提示</b><span>第一次匯入請先下載範本,範本含 14 個欄位定義 · 必填欄位以紅字標示 · 上市別/狀態/資料來源已預設下拉選單,請從選項中選擇。</span>`;
        } else {
          tip.innerHTML = `<b>📝 修正提示</b><span>請依照預覽頁的顏色提示,在原匯入檔案中修正錯誤後重新上傳:<br>🔴 紅色 = 資料格式錯誤  ·  🟢 綠色 = 統編重複(系統內已存在或檔案內重複) ·  🟡 黃色 = 必填欄位缺漏</span>`;
        }
      }
      
      function impClose() {
        // 若目前正停留在 step 3「資料匯入成功」頁,關閉時觸發 toast 提示
        try {
          const step3Pane = document.querySelector('.imp-pane#impPane3.active') ||
                            document.querySelector('#impPane3.active');
          // 退而求其次:用 footer-pane data-pane="3" 是否 active 判斷
          const step3Footer = document.querySelector('.imp-footer-pane[data-pane="3"].active');
          const isOnStep3 = !!(step3Pane || step3Footer);
          if (isOnStep3) {
            const cntEl = document.getElementById('impDoneCount');
            const n = cntEl ? cntEl.textContent.trim() : '';
            const msg = n ? `✓ 已成功匯入 ${n} 筆廠商資料` : '✓ 廠商資料匯入成功';
            if (typeof showToast === 'function') showToast(msg);
          }
        } catch(e) { /* 安靜失敗,不影響關閉動作 */ }
        document.getElementById('admModalImport').classList.remove('show');
      }
      
      function impDownloadTemplate() {
        // 從 base64 還原 binary,觸發瀏覽器下載
        const b64 = IMP_TEMPLATE_B64;
        const bin = atob(b64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        const blob = new Blob([bytes], {type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = '廠商資料匯入範本_v1.xlsx';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 500);
      }
      
      function impFileSelected(input) {
        if (!input.files || input.files.length === 0) return;
        const f = input.files[0];
        IMP_STATE.fileName = f.name;
        IMP_STATE.uploadAttempt += 1;
        const fileEl = document.getElementById('impFileName');
        if (fileEl) fileEl.textContent = '已選擇 · ' + f.name;
        const cardUp = document.querySelector('.imp-card-up');
        if (cardUp) cardUp.classList.add('has-file');
        const nextBtn = document.getElementById('impStep1Next');
        if (nextBtn) nextBtn.disabled = false;
      }
      
      function impGoStep(n) {
        IMP_STATE.step = n;
        // 步驟條
        for (let i = 1; i <= 3; i++) {
          const nav = document.getElementById('impStepNav' + i);
          if (!nav) continue;
          nav.classList.remove('active','done');
          if (i < n) nav.classList.add('done');
          else if (i === n) nav.classList.add('active');
        }
        // 步驟連線
        const lines = document.querySelectorAll('.imp-step-line');
        lines.forEach((ln, idx) => {
          ln.classList.toggle('done', idx + 1 < n);
        });
        // pane 切換
        for (let i = 1; i <= 3; i++) {
          const p = document.getElementById('impPane' + i);
          if (p) p.classList.toggle('active', i === n);
        }
        // footer 切換
        document.querySelectorAll('.imp-footer-pane').forEach(fp => {
          fp.classList.toggle('active', fp.dataset.pane == String(n));
        });
        // 各步驟初始化
        if (n === 1) {
          impUpdateStep1Hint();
          // 回到 Step 1 時清空檔案選擇,等待重新上傳
          const fileEl = document.getElementById('impFileName');
          if (fileEl) fileEl.textContent = '尚未選擇檔案';
          const cardUp = document.querySelector('.imp-card-up');
          if (cardUp) cardUp.classList.remove('has-file');
          const nextBtn = document.getElementById('impStep1Next');
          if (nextBtn) nextBtn.disabled = true;
          const fi = document.getElementById('impFileInput');
          if (fi) fi.value = '';
        }
        if (n === 2) impRenderPreview();
        if (n === 3) impFillDone();
      }
      
      // Step 2 預覽資料
      // 每列:[#行號, 統編, 股票代號, 中文名, 英文名, 代表人, 建檔年, 上市別, 資本額, 員工, 縣市, 電話, 狀態, 資料來源, 備註]
      // 錯誤類型標記:e=err 紅 / d=dup 綠 / m=miss 黃 (對應 15 欄,index 0 是行號)
      
      // 版本 A:第一次上傳(故意安插各種錯誤,12 列 demo)
      const IMP_PREVIEW_ROWS_BAD = [
        // 第 1 列:正常
        { row:1,  type:'ok',
          cells:['1','22099131','2330','台灣積體電路製造股份有限公司','Taiwan Semiconductor Manufacturing Co., Ltd.','魏哲家','2024','上市','259303804970','76478','新竹科學園區','03-5636688 / tsmc.com','啟用','商業司公司登記',''],
          flags:['','','','','','','','','','','','','','',''] },
        // 第 2 列:統編 7 位數(格式錯誤)
        { row:2,  type:'err',
          cells:['2','2251044','','矽品精密工業股份有限公司','Siliconware Precision','蔡祺文','2024','上市','29821432160','15820','台中市潭子區','04-25341525 / spil.com.tw','啟用','商業司公司登記',''],
          flags:['','e','m','','m','','','','','','','','','',''] },
        // 第 3 列:統編在系統內已存在(76027628 = 日月光,FIRMS_DB 中有)
        { row:3,  type:'dup',
          cells:['3','76027628','3711','日月光投資控股股份有限公司','ASE Technology Holding','張虔生','2024','上市','43269395950','32465','高雄市楠梓區','07-3617131 / aseglobal.com','啟用','商業司公司登記','集團控股母公司'],
          flags:['','d','','d','','','','','','','','','','',''] },
        // 第 4 列:正常
        { row:4,  type:'ok',
          cells:['4','84149961','2454','聯發科技股份有限公司','MediaTek Inc.','蔡明介','2024','上市','15958710180','12293','新竹市東區','03-5670766 / mediatek.com','啟用','商業司公司登記',''],
          flags:['','','','','','','','','','','','','','',''] },
        // 第 5 列:中文名空白(必填缺漏)+ 員工人數有非數字
        { row:5,  type:'miss',
          cells:['5','99887766','','','HoldenTech Co., Ltd.','陳建宏','2024','未上市櫃','50000000','約100人','桃園市龜山區','','啟用','人工建檔',''],
          flags:['','','','m','','','','','','e','','m','','',''] },
        // 第 6 列:正常
        { row:6,  type:'ok',
          cells:['6','97162640','3481','群創光電股份有限公司','Innolux Corporation','洪進揚','2024','上市','95329810160','36524','苗栗縣竹南鎮','037-586000 / innolux.com','啟用','商業司公司登記',''],
          flags:['','','','','','','','','','','','','','',''] },
        // 第 7 列:資本額有非數字字元
        { row:7,  type:'err',
          cells:['7','12345678','','創富科技有限公司','','','2024','未上市櫃','5,000,000','120','台北市內湖區','02-87923456','啟用','人工建檔',''],
          flags:['','','m','','m','m','','','e','','','m','','',''] },
        // 第 8 列:檔案內統編重複(同 22099131,跟第 1 列重複)
        { row:8,  type:'dup',
          cells:['8','22099131','2330','TSMC 台積電(子公司)','TSMC Branch','魏哲家','2024','上市','100000000','5000','新竹市','','啟用','人工建檔','檔案內重複'],
          flags:['','d','','','','','','','','','','m','','',''] },
        // 第 9 列:正常
        { row:9,  type:'ok',
          cells:['9','86517556','3105','穩懋半導體股份有限公司','Win Semiconductors Corp.','陳進財','2024','上市','7245530000','3856','桃園市龜山區','03-3979966 / winfoundry.com','啟用','商業司公司登記',''],
          flags:['','','','','','','','','','','','','','',''] },
        // 第 10 列:狀態填了不存在選項
        { row:10, type:'err',
          cells:['10','55667788','','華電科技股份有限公司','HuaDian Tech','吳明達','2024','上櫃','480000000','680','新北市汐止區','02-26901234 / huadian.com','歇業','商業司公司登記',''],
          flags:['','','m','','m','','','','','','','','e','',''] },
        // 第 11 列:統編全部不是數字
        { row:11, type:'err',
          cells:['11','TW123456','','宏遠塑膠有限公司','','陳信宏','2024','未上市櫃','12000000','45','彰化縣秀水鄉','04-7681234','啟用','人工建檔',''],
          flags:['','e','m','','m','','','','','','','','','',''] },
        // 第 12 列:正常
        { row:12, type:'ok',
          cells:['12','11394902','2374','佳能企業股份有限公司','Ability Enterprise Co., Ltd.','曾明仁','2024','上市','3478326710','1245','新北市新莊區','02-22789191 / canon.com.tw','啟用','商業司公司登記',''],
          flags:['','','','','','','','','','','','','','',''] },
      ];
      
      // 版本 B:修正後的全 OK 版本(同樣 12 筆,所有錯誤都已修正)
      const IMP_PREVIEW_ROWS_GOOD = [
        { row:1,  type:'ok',
          cells:['1','22099131','2330','台灣積體電路製造股份有限公司','Taiwan Semiconductor Manufacturing Co., Ltd.','魏哲家','2024','上市','259303804970','76478','新竹科學園區','03-5636688 / tsmc.com','啟用','商業司公司登記',''],
          flags:['','','','','','','','','','','','','','',''] },
        { row:2,  type:'ok',
          cells:['2','22520447','2325','矽品精密工業股份有限公司','Siliconware Precision Industries','蔡祺文','2024','上市','29821432160','15820','台中市潭子區','04-25341525 / spil.com.tw','啟用','商業司公司登記',''],
          flags:['','','','','','','','','','','','','','',''] },
        { row:3,  type:'ok',
          cells:['3','89441120','3711','日月光福懋通信','ASE-USI Communications','張虔生','2024','上市','30000000000','3500','高雄市楠梓區','07-3617131 / aseglobal.com','啟用','商業司公司登記','日月光集團子公司'],
          flags:['','','','','','','','','','','','','','',''] },
        { row:4,  type:'ok',
          cells:['4','84149961','2454','聯發科技股份有限公司','MediaTek Inc.','蔡明介','2024','上市','15958710180','12293','新竹市東區','03-5670766 / mediatek.com','啟用','商業司公司登記',''],
          flags:['','','','','','','','','','','','','','',''] },
        { row:5,  type:'ok',
          cells:['5','99887766','','宏鼎科技有限公司','HoldenTech Co., Ltd.','陳建宏','2024','未上市櫃','50000000','100','桃園市龜山區','03-3271234 / holdentech.tw','啟用','人工建檔',''],
          flags:['','','','','','','','','','','','','','',''] },
        { row:6,  type:'ok',
          cells:['6','97162640','3481','群創光電股份有限公司','Innolux Corporation','洪進揚','2024','上市','95329810160','36524','苗栗縣竹南鎮','037-586000 / innolux.com','啟用','商業司公司登記',''],
          flags:['','','','','','','','','','','','','','',''] },
        { row:7,  type:'ok',
          cells:['7','12345678','','創富科技有限公司','Chuang Fu Technology','王建廷','2024','未上市櫃','5000000','120','台北市內湖區','02-87923456 / cf-tech.tw','啟用','人工建檔',''],
          flags:['','','','','','','','','','','','','','',''] },
        { row:8,  type:'ok',
          cells:['8','24532108','','創新科技股份有限公司','Innovate Tech Inc.','林志強','2023','未上市櫃','100000000','85','新竹市','03-5667890 / innovate.com.tw','啟用','人工建檔','原檔案內重複,已修正統編'],
          flags:['','','','','','','','','','','','','','',''] },
        { row:9,  type:'ok',
          cells:['9','86517556','3105','穩懋半導體股份有限公司','Win Semiconductors Corp.','陳進財','2024','上市','7245530000','3856','桃園市龜山區','03-3979966 / winfoundry.com','啟用','商業司公司登記',''],
          flags:['','','','','','','','','','','','','','',''] },
        { row:10, type:'ok',
          cells:['10','55667788','','華電科技股份有限公司','HuaDian Tech','吳明達','2024','上櫃','480000000','680','新北市汐止區','02-26901234 / huadian.com','啟用','商業司公司登記',''],
          flags:['','','','','','','','','','','','','','',''] },
        { row:11, type:'ok',
          cells:['11','45612378','','宏遠塑膠有限公司','HungYuan Plastic','陳信宏','2024','未上市櫃','12000000','45','彰化縣秀水鄉','04-7681234 / hyplastic.tw','啟用','人工建檔',''],
          flags:['','','','','','','','','','','','','','',''] },
        { row:12, type:'ok',
          cells:['12','11394902','2374','佳能企業股份有限公司','Ability Enterprise Co., Ltd.','曾明仁','2024','上市','3478326710','1245','新北市新莊區','02-22789191 / canon.com.tw','啟用','商業司公司登記',''],
          flags:['','','','','','','','','','','','','','',''] },
      ];
      
      // 動態取目前該顯示哪份資料(第 1 次 = 錯誤版,2+ 次 = 全 OK)
      function impGetCurrentRows() {
        return IMP_STATE.uploadAttempt >= 2 ? IMP_PREVIEW_ROWS_GOOD : IMP_PREVIEW_ROWS_BAD;
      }
      
      function impRenderPreview() {
        const tbody = document.getElementById('impPreviewBody');
        if (!tbody) return;
        const rows = impGetCurrentRows();
        const flagToCls = {'e':'imp-cell-err', 'd':'imp-cell-dup', 'm':'imp-cell-miss'};
        const rowToCls = {'err':'imp-row-err', 'dup':'imp-row-dup', 'miss':'imp-row-miss', 'ok':''};
        let html = '';
        for (const r of rows) {
          const rowCls = rowToCls[r.type] || '';
          html += `<tr class="${rowCls}">`;
          for (let i = 0; i < r.cells.length; i++) {
            const cellCls = (i === 0) ? 'imp-td-row' : (flagToCls[r.flags[i]] || '');
            const v = r.cells[i] === '' ? '—' : r.cells[i];
            html += `<td class="${cellCls}" title="${(r.cells[i]||'').replace(/"/g,'&quot;')}">${v}</td>`;
          }
          html += `</tr>`;
        }
        tbody.innerHTML = html;
        
        // 計算統計
        const total = rows.length;
        const okN = rows.filter(r => r.type === 'ok').length;
        const errN = total - okN;
        const stats = document.querySelectorAll('.imp-rs-num');
        if (stats.length >= 3) {
          stats[0].textContent = total;
          stats[1].textContent = okN;
          stats[2].textContent = errN;
        }
        
        // 確認按鈕狀態(有錯誤就 disabled)
        const confirmBtn = document.getElementById('impStep2Confirm');
        const hint = document.getElementById('impStep2Hint');
        const footerPane = document.querySelector('.imp-footer-pane[data-pane="2"]');
        const resultBar = document.getElementById('impResultBar');
        
        if (errN > 0) {
          if (confirmBtn) confirmBtn.disabled = true;
          if (hint) hint.innerHTML = `⚠ 共 <b>${errN}</b> 筆資料需修正,請依顏色提示修正後重新匯入`;
          if (footerPane) footerPane.classList.remove('is-ok');
          if (resultBar) {
            resultBar.classList.remove('imp-result-ok');
            resultBar.classList.add('imp-result-err');
            resultBar.querySelector('.imp-result-icon').textContent = '⚠';
            resultBar.querySelector('.imp-result-text').innerHTML = `
              <b>您匯入的資料系統驗證有誤,請修正原匯入檔案資料內容後,重新進行匯入動作。</b>
              <span>待匯入資料內容正確無誤,再按下「✓ 確認匯入檔案」按鈕即可。</span>`;
          }
        } else {
          if (confirmBtn) confirmBtn.disabled = false;
          if (hint) hint.innerHTML = `✓ 全部 <b>${total}</b> 筆資料驗證通過,可進行匯入`;
          if (footerPane) footerPane.classList.add('is-ok');
          if (resultBar) {
            resultBar.classList.remove('imp-result-err');
            resultBar.classList.add('imp-result-ok');
            resultBar.querySelector('.imp-result-icon').textContent = '✓';
            resultBar.querySelector('.imp-result-text').innerHTML = `
              <b>資料驗證全數通過!</b>
              <span>共 ${total} 筆廠商資料皆符合格式、無重複、無缺漏,點擊下方「✓ 確認匯入檔案」即可寫入系統。</span>`;
          }
        }
      }
      
      function impFillDone() {
        const cnt = impGetCurrentRows().length;
        const cntEl = document.getElementById('impDoneCount');
        if (cntEl) cntEl.textContent = cnt;
        const tEl = document.getElementById('impDoneTime');
        if (tEl) {
          const d = new Date();
          const pad = n => String(n).padStart(2,'0');
          tEl.textContent = `${d.getFullYear()}/${pad(d.getMonth()+1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
        }
        const fEl = document.getElementById('impDoneFile');
        if (fEl) fEl.textContent = IMP_STATE.fileName || '廠商資料匯入_範例.xlsx';
      }

      // ════════════════════════════════════════════════════════════════
      // v6 新增:廠商歷史鑑定 — 列表渲染 + modal 詳情
      // ════════════════════════════════════════════════════════════════
      
      // 5 筆 demo 案件資料(以日月光半導體製造 76027628 為主角)
      const FIRM_CASES = [
        {
          id: '11420214810',
          date: '2026-02-09',
          type: 'investor',           // 案件類型:investor / entity / mid
          typeLabel: '投資人案',
          investor: '日月光半導體製造',
          midCompany: ['M31 TECHNOLOGY (BVI) HOLDINGS', 'YUANXING ASIA PACIFIC PTE. LTD.'],            // 中轉公司(可空)
          target: '元星智財(上海)信息科技',
          source: '對外投資 2 科',
          result: 'no',                // yes / no
          techs: [
            {code:'34', name:'AI 高效能晶片設計'},
            {code:'35', name:'Chiplet 互聯技術'},
          ],
          notices: ['投資事業含 IP 授權與技術導入'],
          review: '元星智財(上海)信息科技有限公司係台灣 M31 圓星科技於中國大陸設立之子公司,成立於 2015 年,主要定位為母公司矽智財(IP)業務於中國市場之行銷與技術服務據點。其核心產業領域屬於半導體設計服務與矽智財授權相關服務產業,而非晶圓製造或硬體設備製造產業。\n\n公司主要從事產品行銷、技術支援與客戶服務等業務,協助推廣母公司所開發之半導體 IP 模組(如記憶體介面 IP、SoC 設計相關 IP 模組等)並提供技術導入與應用支援服務,屬於半導體產業鏈中上游之「IP 服務與設計支援」技術服務範疇。其技術領域重點在於半導體設計相關技術支援、IC 設計方法學、IP 授權應用諮詢與客戶工程服務,而不涉及晶圓製程設備、先進製程製造、封裝製造或材料開發等核心製造技術領域,亦非軍用或航太材料、通訊或衛星系統技術開發公司。\n\n綜上,元星智財(上海)之營業與技術活動屬於民用商業半導體設計服務與矽智財授權支援產業,未涉及先進製程製造技術、異質整合封裝、關鍵材料、軍事、航太、資安或其他高敏感技術領域。',
          reviewMeta: '2026-02-12 由審查官 王玉姍 提出',
          reReview: '【2/13 問】以下為進一步確認此案相關技術層次之提問:有 2 個問題想要請教圓星科技。請問圓星科技與元星智財之間的合作模式,是否包含 IC 設計流程與方法學諮詢、晶片設計架構與系統整合技術支援以及客戶 SoC 設計導入與驗證支援?\n\n【2/24 答】本公司(圓星科技)與元星智財(上海)之合作關係定位為「母子公司技術轉移與服務支援」,惟所提供之服務範圍嚴格限於商業性 IP 模組之導入諮詢及技術文件支援,並不涉及任何客製化 IC 設計流程之核心技術或設計方法學移轉。元星智財現有之技術人員主要從事客戶端應用工程支援(AE)與技術文件本地化,無自主研發或核心 IC 設計能力。',
          reReviewMeta: '2026-02-13 提問 / 2026-02-24 回覆',
          updated: '2026-02-25',
        },
        {
          id: '11520041200',
          date: '2026-03-15',
          type: 'entity',
          typeLabel: '投資事業案',
          investor: '日月光半導體製造',
          midCompany: ['CHIMEI INTERNATIONAL(HONG KONG)', 'CHIMEI ASIA PACIFIC HOLDINGS', 'SUZHOU CHIMEI HOLDING CO.'],
          target: 'SUZHOU CHIMEI 投資管理有限公司',
          source: '對外投資 1 科',
          result: 'yes',
          techs: [
            {code:'28', name:'低溫半導體晶片電路'},
            {code:'35', name:'Chiplet 互聯技術'},
          ],
          notices: ['涉及先進封裝與低溫互連製程', '需要求補件說明技術授權範圍'],
          review: '本案投資架構為 日月光半導體製造 → 香港中轉公司(CHIMEI INTERNATIONAL HONG KONG)→ 蘇州投資管理公司(SUZHOU CHIMEI)之三段式投資結構,符合《在大陸地區從事投資或技術合作審查原則》第三條對於透過第三地進行間接投資之申報義務。\n\n投資人於申請書中說明,本次投資金額為新台幣 24 億元,將透過其香港子公司 CHIMEI INTERNATIONAL HONG KONG LTD. 注資至蘇州投資管理公司,後者預計在當地建置面板模組生產線。惟經本司比對申請書所附之投資事業營運計畫書,標的公司未來業務範圍涵蓋「先進顯示驅動 IC 整合封裝」與「Chiplet 級晶片互聯」相關製程,與第 28 項國家核心關鍵技術「低溫半導體晶片電路設計與製程」之「先進封裝與低溫互連(WLCSP/SiP/Flip-Chip/TSV)」子分類,以及第 35 項「高頻寬密度小晶片互聯電路設計技術」之「Link/Adapter/Protocol」子分類存在實質技術重疊。\n\n綜上,本案屬於「對外投資涉及國家核心關鍵技術」之情形,建議依《國家核心關鍵技術發展與保護條例》第 6 條規定,進入嚴格審查程序,要求投資方補件說明技術授權範圍與是否涉及機敏製程移轉。',
          reviewMeta: '2026-03-18 由審查官 王玉姍 提出',
          reReview: '【3/21 問】關於本投資案之三段式架構,有 3 點需請貴公司進一步說明:\n① 香港中轉公司之主要業務範圍為何?是否僅作為控股目的,抑或實際從事任何技術研發、IP 持有或人員配置?\n② SUZHOU CHIMEI 預計建置之先進封裝生產線,所使用之製程設備、技術來源、製程節點為何?是否涉及 WLCSP/Flip-Chip/TSV 等先進封裝技術?\n③ 標的公司未來是否會與投資人進行技術授權或派遣台灣工程人員協助製程導入?\n\n【3/28 答】① CHIMEI INTERNATIONAL HONG KONG LTD. 為本公司於 2018 年設立之 100% 持股控股公司,僅作為對中國大陸投資之資金匯撥與管理目的,無實際營業活動。\n② SUZHOU CHIMEI 預計建置之生產線確實涵蓋 Flip-Chip 與 WLCSP 製程,技術來源為向日商 Disco 與荷蘭 ASMPT 採購之標準設備。製程節點為 28nm 以上之成熟製程。\n③ 本案標的與投資人間將簽訂為期 5 年之「技術支援協議」,由投資方派遣 8 名工程師赴蘇州協助製程導入。\n\n根據投資方上述回覆,本案實質涉及第 28 項與第 35 項國家核心關鍵技術之子架構,且涉及人員與技術支援之實質移轉,建議審查結果維持「涉及」。',
          reReviewMeta: '2026-03-21 提問 / 2026-03-28 回覆',
          updated: '2026-03-28',
        },
        {
          id: '11520071204',
          date: '2026-04-18',
          type: 'entity',
          typeLabel: '投資事業案',
          investor: '日月光投資控股',
          midCompany: null,
          target: '越南胡志明 IC 封測廠擴建',
          source: '對外投資 2 科',
          result: 'no',
          techs: [
            {code:'30', name:'異質整合封裝技術'},
          ],
          notices: ['屬擴建既有產能,非技術移轉案'],
          review: '本案為日月光投控於越南既有封測廠之產能擴建案,投資金額新台幣 18 億元,主要用於採購封裝測試設備、廠房擴建與產能提升。經審查投資計畫書,本案屬於既有業務之產能擴大,並非新技術導入或核心製程移轉。\n\n所使用之封裝技術屬於日月光集團多年累積之成熟封裝製程(QFN、BGA、CSP 等),不涉及異質整合封裝技術之核心研發或關鍵製程細節之移轉。製程設備係向國際大廠標準採購,且越南封測廠之主要客戶為東南亞與日韓 IC 設計公司,非中國大陸關聯實體。\n\n綜上,本案雖在標準分類上對應「異質整合封裝技術」項次,惟實質內容屬成熟封裝技術之產能複製,不涉及核心關鍵技術之擴散風險,建議審查結果為「否」(不涉及)。',
          reviewMeta: '2026-04-20 由審查官 林忠勤 提出',
          reReview: '審查結果明確,投資人未提出複審申請。',
          reReviewMeta: '無複審紀錄',
          updated: '2026-04-22',
        },
        {
          id: '11420093311',
          date: '2025-09-22',
          type: 'investor',
          typeLabel: '投資人案',
          investor: '日月光半導體製造',
          midCompany: null,
          target: '鎮江日月光封測股份有限公司',
          source: '對外投資 2 科',
          result: 'no',
          techs: [
            {code:'30', name:'異質整合封裝技術'},
          ],
          notices: ['對中國大陸投資,需依規定申報'],
          review: '本案為日月光半導體製造對其中國大陸子公司「鎮江日月光封測」之增資案,增資金額新台幣 12 億元,用於既有封測產線之設備汰舊換新及產能維持。\n\n鎮江日月光封測係本投資人於 2008 年於中國大陸江蘇省鎮江市設立之 100% 持股子公司,主要承接日月光集團於中國大陸之 IC 封裝測試業務,服務當地 IC 設計客戶。本次增資係為產能維持目的,所購置之封裝設備為日月光集團於台灣已使用多年之成熟製程設備,無新技術之導入或專利移轉。\n\n本案符合《在大陸地區從事投資或技術合作審查原則》之申報規定,且不涉及核心關鍵技術之擴散風險。審查結果為「否」(不涉及)。',
          reviewMeta: '2025-09-25 由審查官 王玉姍 提出',
          reReview: '審查結果明確,無進一步複審。',
          reReviewMeta: '無複審紀錄',
          updated: '2025-09-26',
        },
        {
          id: '11320185506',
          date: '2024-11-08',
          type: 'mid',
          typeLabel: '中轉公司案',
          investor: '日月光投資控股',
          midCompany: ['ASE Test Holdings (Cayman)', 'ASE Korea Holdings Ltd.'],
          target: 'ASE Korea Holdings 韓國控股實體',
          source: '對外投資 1 科',
          result: 'yes',
          techs: [
            {code:'30', name:'異質整合封裝技術'},
            {code:'34', name:'AI 高效能晶片設計'},
            {code:'35', name:'Chiplet 互聯技術'},
          ],
          notices: ['境外多層控股結構', '涉及核心封裝技術之地理擴散', '需追蹤後續實質受益人'],
          review: '本案為日月光投控擬透過開曼群島中轉公司(ASE Test Holdings Cayman)於南韓設立 ASE Korea Holdings 控股實體之投資案,投資金額美金 8.5 億元。\n\n經審查投資計畫書與境外設立目的說明,本案實質涉及將異質整合封裝(第 30 項)、AI 高效能晶片設計(第 34 項)及 Chiplet 互聯(第 35 項)等三項國家核心關鍵技術之相關研發與量產能力,部分擴散至韓國子公司。投資架構採用開曼群島為中轉公司,符合一般國際投資慣例之免稅地控股模式,惟投資審議司認為應審慎評估技術移轉之實質風險。\n\n投資人於申請書中說明,本案目的為配合國際大客戶於南韓建立區域服務據點,然其營運計畫書中包含「先進封裝研發中心」設置,涉及實質研發人員調派與設備建置。綜上,本案符合《國家核心關鍵技術發展與保護條例》第 6 條規定之「對外投資涉及核心關鍵技術」之情形,建議審查結果為「涉及」,並要求投資人提報年度進度報告及人員技術移轉統計。',
          reviewMeta: '2024-11-12 由審查官 林忠勤 提出',
          reReview: '【11/15 問】關於本案於南韓設立之研發中心,有 2 點需釐清:\n① 該研發中心之研發主題是否包含異質整合封裝之核心技術(如 TSV、SiP 模組設計)?\n② 預計從台灣派遣之研發人員人數、職級與技術背景為何?是否涉及核心專利申請人?\n\n【11/28 答】① 南韓研發中心之研發主題以客戶端應用設計為主,涵蓋 Chiplet 整合方案之客戶導入與測試驗證,部分研發確實涉及異質整合封裝之製程整合,但不涉及 TSV 矽穿孔之核心專利。\n② 預計派遣 12 名工程師,職級為資深工程師至協理層級,其中 3 名為核心專利申請人,將擔任研發中心之技術主管。\n\n根據投資方上述回覆,本案核心專利申請人之派遣已構成實質技術擴散風險,審查結果維持「涉及」。要求投資人簽署技術保密與不外流協議,並由本司持續追蹤。',
          reReviewMeta: '2024-11-15 提問 / 2024-11-28 回覆',
          updated: '2024-12-05',
        },
      ];
      
      // 渲染列表
      function renderFirmCases() {
        const tbody = document.getElementById('firmCasesBody');
        if (!tbody) return;
        let html = '';
        for (const c of FIRM_CASES) {
          const rowCls = c.result === 'yes' ? 'row-warn' : '';
          
          // 投資人 / 投資事業 / 中轉公司 三個子欄
          const investorCell = c.investor
            ? `<td class="fc-td-investor">${c.investor}</td>`
            : `<td class="fc-td-empty">—</td>`;
          const entityCell = c.target
            ? `<td class="fc-td-entity">${c.target}</td>`
            : `<td class="fc-td-empty">—</td>`;
          const midCell = c.midCompany && c.midCompany.length > 0
            ? `<td class="fc-td-mid"><div class="fc-mid-list">${c.midCompany.map(m => `<div class="fc-mid-row">${m}</div>`).join('')}</div></td>`
            : `<td class="fc-td-empty">—</td>`;
          
          // 結果標籤
          const resultHtml = c.result === 'yes'
            ? '<span class="fc-result-tag yes">⚠ 是</span>'
            : '<span class="fc-result-tag no">否</span>';
          
          // 涉及技術項目：審查結果為是時顯示技術名稱
          const techHtml = c.result === 'yes'
            ? (c.techs && c.techs.length > 0
                ? `<div class="fc-tech-list">${c.techs.map(t => `<div class="fc-tech-item"><span class="fc-tech-code">${t.code}</span>${t.name}</div>`).join('')}</div>`
                : '<span class="fc-result-tag yes">⚠ 是</span>')
            : '<span class="fc-result-tag no">否</span>';

          html += `
            <tr class="${rowCls}" onclick="openCaseFromFirm('${c.id}')">
              <td class="fc-td-id">${c.id}</td>
              <td class="fc-td-date">${c.date}</td>
              ${investorCell}
              ${entityCell}
              ${midCell}
              <td class="fc-td-src">${c.source}</td>
              <td class="fc-td-result">${resultHtml}</td>
              <td class="fc-td-tech">${techHtml}</td>
              <td class="fc-td-act">
                <button class="fc-view-btn" onclick="event.stopPropagation();openCaseFromFirm('${c.id}')">檢視</button>
              </td>
            </tr>
          `;
        }
        tbody.innerHTML = html;
      }
      
      // ════════════════════════════════════════════════════════════════
      // 案件詳情頁:統一資料 + 跳轉 + 返回邏輯
      // ════════════════════════════════════════════════════════════════
      
      // 從歷史鑑定列表來的 8 筆案件,精簡資料(沒有審查說明等長文,但詳情頁打開後有 fallback)
      const LIST_ONLY_CASES = [
        {
          id: '11520016150', date: '2026-02-10',
          type: 'investor', typeLabel: '投資人案',
          investor: '聯發科技', midCompany: null, target: '鎮江潤晶高純化工',
          source: '對外投資 2 科', result: 'no',
          techs: [],  // 化工類,無核心關鍵技術命中
          notices: ['本案屬化工原料採購投資,不涉及半導體核心技術'],
          review: '本案為聯發科技為穩定半導體製程所需高純度化學品供應,擬投資中國大陸鎮江潤晶高純化工股份有限公司之少數股權(不超過 25%)。\n\n經審查,標的公司主要業務為半導體用高純度溶劑與化學品之生產供應,屬於上游材料供應產業,不涉及《國家核心關鍵技術發展與保護條例》所列之國家核心關鍵技術項目。\n\n綜上,本案不涉及核心關鍵技術,審查結果為「否」(不涉及)。',
          reviewMeta: '2026-02-13 由審查官 王玉姍 提出',
          reReview: '審查結果明確,無進一步複審。',
          reReviewMeta: '無複審紀錄',
          updated: '2026-02-13',
        },
        {
          id: '11520038814', date: '2026-03-22',
          type: 'investor', typeLabel: '投資人案',
          investor: '研華', midCompany: null, target: '越南胡志明工業電腦廠',
          source: '對外投資 2 科', result: 'no',
          techs: [],
          notices: ['新建組裝廠房,屬產能擴張'],
          review: '本案為研華於越南胡志明設立工業電腦組裝廠之新增產能投資,投資金額新台幣 6 億元。\n\n標的工廠主要從事工業電腦之組裝、測試與出貨業務,屬下游組裝產業。所使用之零組件均為自行採購之標準工業元件,不涉及晶片設計、製程或材料之核心技術。\n\n綜上,本案不涉及國家核心關鍵技術,審查結果為「否」。',
          reviewMeta: '2026-03-25 由審查官 林忠勤 提出',
          reReview: '審查結果明確,無進一步複審。',
          reReviewMeta: '無複審紀錄',
          updated: '2026-03-25',
        },
        {
          id: '11520051030', date: '2026-04-08',
          type: 'entity', typeLabel: '投資事業案',
          investor: '世界先進', midCompany: null, target: '新加坡 12 吋廠',
          source: '對外投資 1 科', result: 'no',
          techs: [{code:'29', name:'14 奈米以下製程 IC 製造'}],
          notices: ['12 吋成熟製程,非先進製程'],
          review: '本案為世界先進於新加坡建置 12 吋晶圓廠之新增產能投資。\n\n經審查,新加坡廠所建置之製程節點為 65nm 至 28nm 之成熟製程,非屬第 29 項所定義之 14nm 以下先進製程。雖在分類上對應第 29 項「14 奈米以下製程 IC 製造」項次,但實質上不涉及該技術項之核心保護範疇。\n\n綜上,本案雖在製程分類上有部分重疊,但屬成熟製程之產能擴展,不涉及核心關鍵技術之擴散風險,審查結果為「否」。',
          reviewMeta: '2026-04-12 由審查官 王玉姍 提出',
          reReview: '【4/15 問】請說明新加坡廠是否預留先進製程升級空間?\n\n【4/22 答】新加坡廠之主要設備配置為成熟製程使用,廠房結構雖預留可擴充空間,但實際營運計畫於未來 5 年內無升級至 14nm 以下之計畫。',
          reReviewMeta: '2026-04-15 提問 / 2026-04-22 回覆',
          updated: '2026-04-23',
        },
        {
          id: '11520067725', date: '2026-04-12',
          type: 'investor', typeLabel: '投資人案',
          investor: '聯華電子', midCompany: null, target: '廈門聯芯整合電路',
          source: '對外投資 1 科', result: 'yes',
          techs: [
            {code:'29', name:'14 奈米以下製程 IC 製造'},
            {code:'30', name:'異質整合封裝技術'},
            {code:'35', name:'Chiplet 互聯技術'},
          ],
          notices: ['對中國大陸投資擴大', '涉及多項核心技術', '需要求補件說明授權範圍'],
          review: '本案為聯華電子對其中國大陸子公司「廈門聯芯整合電路製造」之第二期擴產增資案,投資金額新台幣 60 億元。\n\n經審查,標的廠房擴建計畫包含建置 14nm 製程線、先進封裝模組以及 Chiplet 整合測試線,實質涉及第 29、30、35 項三項國家核心關鍵技術之製造能力擴散。\n\n投資人雖聲明本次擴產僅供當地客戶使用,但 14nm 以下製程之核心技術涉及高度敏感之國家戰略產業,建議依條例規定進入嚴審程序,要求投資方說明技術授權範圍、人員調派計畫,並提交年度進度報告。',
          reviewMeta: '2026-04-15 由審查官 王玉姍 提出',
          reReview: '【4/18 問】關於本案,請說明:\n① 14nm 製程線之技術來源為何?是否涉及自台灣母廠之技術授權或人員派遣?\n② Chiplet 整合測試線之客戶為哪些?是否涉及中國大陸國防或軍工相關之客戶?\n③ 預計從台灣派遣之研發或製程工程師人數及職級為何?\n\n【4/28 答】① 14nm 製程線之技術主要由聯電台灣母廠技術授權,授權範圍含製程配方、製程整合與良率提升技術,但不含核心智財與專利之轉移。\n② 整合測試線客戶以民用消費電子與通訊產品為主,無國防或軍工相關客戶。\n③ 預計派遣 28 名研發與製程工程師,職級涵蓋初階至協理層,其中 5 名為核心製程整合工程師。\n\n根據投資方上述回覆,本案實質涉及第 29、30、35 項之核心技術擴散,審查結果維持「涉及」,並要求投資方簽署技術保密協議,由本司持續追蹤。',
          reReviewMeta: '2026-04-18 提問 / 2026-04-28 回覆',
          updated: '2026-04-30',
        },
        {
          id: '11520088912', date: '2026-04-22',
          type: 'investor', typeLabel: '投資人案',
          investor: '台灣積體電路製造', midCompany: null, target: 'ARIZONA SUBSIDIARY (TSMC Arizona)',
          source: '對外投資 1 科', result: 'no',
          techs: [],
          notices: ['對美國投資,屬戰略夥伴'],
          review: '本案為台積電對其美國亞利桑那州子公司之擴產投資。\n\n經審查,投資地為美國亞利桑那州,屬於戰略夥伴國家,且標的公司之製程技術已於美國當地建置完成,本案屬於營運資金與設備擴充性質,不涉及核心關鍵技術自台灣移轉至潛在風險地區。\n\n依據《國家核心關鍵技術發展與保護條例》之精神,對於戰略夥伴國家之投資原則上不予限制,惟仍需依規定提報。本案審查結果為「否」(不涉及核心關鍵技術之風險擴散)。',
          reviewMeta: '2026-04-25 由審查官 林忠勤 提出',
          reReview: '審查結果明確,無進一步複審。',
          reReviewMeta: '無複審紀錄',
          updated: '2026-04-25',
        },
      ];
      
      // 合併兩組案件 — 重複 id 以 FIRM_CASES 為準(因為 FIRM_CASES 已包含 11520041200、11520071204)
      const ALL_CASES = (() => {
        const map = {};
        for (const c of LIST_ONLY_CASES) map[c.id] = c;
        for (const c of FIRM_CASES) map[c.id] = c;  // FIRM_CASES 覆蓋
        return map;
      })();
      
      // 來源頁狀態追蹤
      const CASE_NAV = {
        from: 'cases',         // 'cases' | 'detail' (廠商詳細頁)
        firmId: null,          // 若是從廠商頁來,記住廠商 id
      };
      
      // 從廠商頁的歷史鑑定列表點擊
      function openCaseFromFirm(caseId) {
        // 抓當前廠商 id(從首頁顯示中的 firmId 或從 d-fd-uid 元素抓)
        const firmIdEl = document.getElementById('fd-uid');
        const firmId = firmIdEl ? firmIdEl.textContent.trim() : null;
        CASE_NAV.from = 'detail';
        CASE_NAV.firmId = firmId;
        renderCaseDetail(caseId);
        showPage('case-detail');
      }
      
      // 從歷史鑑定列表點擊
      function openCaseFromList(caseId) {
        CASE_NAV.from = 'cases';
        CASE_NAV.firmId = null;
        renderCaseDetail(caseId);
        showPage('case-detail');
      }
      
      // 返回:依來源頁
      function goBackFromCase() {
        if (CASE_NAV.from === 'detail' && CASE_NAV.firmId) {
          // 回到廠商詳細頁,並切到歷史鑑定 Tab
          showPage('detail', null, {firmId: CASE_NAV.firmId});
          // 切到 Tab 3
          setTimeout(() => {
            const tabBtn = document.querySelector('button.tab[onclick*="tab-cases"]');
            if (tabBtn) tabBtn.click();
          }, 50);
        } else {
          // 回到歷史鑑定案件列表
          const sideLink = document.querySelector('.side-link[data-page=cases]');
          showPage('cases', sideLink);
        }
      }
      
      // 渲染案件詳情頁
      function renderCaseDetail(caseId) {
        const c = ALL_CASES[caseId];
        if (!c) return;
        
        // 頂部
        const hd = document.getElementById('cdPageHead');
        const tag = document.getElementById('cdResultTag');
        document.getElementById('cdId').textContent = c.id;
        document.getElementById('cdUpdated').textContent = c.updated;
        if (c.result === 'yes') {
          hd.classList.remove('no-impact'); hd.classList.add('has-impact');
          tag.classList.remove('no-impact'); tag.classList.add('has-impact');
          tag.innerHTML = '<span style="font-size:11.5px;font-weight:600;color:#a31621;margin-right:4px">審查結果:</span>⚠ 是 · 涉及核心關鍵技術';
        } else {
          hd.classList.remove('has-impact'); hd.classList.add('no-impact');
          tag.classList.remove('has-impact'); tag.classList.add('no-impact');
          tag.innerHTML = '<span style="font-size:11.5px;font-weight:600;color:#0e7c4a;margin-right:4px">審查結果:</span>否 · 不涉及核心關鍵技術';
        }
        
        // 案件基本資訊
        document.getElementById('cdMetaId').textContent = c.id;
        document.getElementById('cdMetaDate').textContent = c.date;
        document.getElementById('cdMetaSource').textContent = c.source;
        // v6 案件名稱拆 3 子欄
        const elInv = document.getElementById('cdNameInvestor');
        const elEnt = document.getElementById('cdNameEntity');
        const elMid = document.getElementById('cdNameMid');
        const setName = (el, val) => {
          if (val && String(val).trim()) {
            el.textContent = val;
            el.classList.remove('empty');
          } else {
            el.textContent = '—';
            el.classList.add('empty');
          }
        };
        setName(elInv, c.investor);
        setName(elEnt, c.target);
        const midDisplay = Array.isArray(c.midCompany) ? c.midCompany.join(' → ') : (c.midCompany || null);
        setName(elMid, midDisplay);
        
        // 投資架構
        const flow = document.getElementById('cdFlow');
        let flowHtml = '';
        if (c.investor) {
          flowHtml += `<div class="cd-node investor">
            <span class="cd-num"></span>
            <div class="cd-node-text"><div class="cd-node-lbl">投資人</div><div class="cd-node-name">${c.investor}</div></div>
          </div>`;
        }
        // 支援 midCompany 為字串或陣列
        const mids = Array.isArray(c.midCompany) ? c.midCompany : (c.midCompany ? [c.midCompany] : []);
        mids.forEach((m, idx) => {
          flowHtml += `<span class="cd-arr">→</span>
            <div class="cd-node mid">
              <span class="cd-num"></span>
              <div class="cd-node-text"><div class="cd-node-lbl">中轉公司 ${mids.length > 1 ? (idx+1) : ''}</div><div class="cd-node-name">${m}</div></div>
            </div>`;
        });
        if (c.target) {
          flowHtml += `<span class="cd-arr">→</span>
            <div class="cd-node target">
              <span class="cd-num"></span>
              <div class="cd-node-text"><div class="cd-node-lbl">投資事業</div><div class="cd-node-name">${c.target}</div></div>
            </div>`;
        }
        flow.innerHTML = flowHtml;
        
        // 涉及技術項目（審查結果為否則不顯示技術項目）
        const techBody = document.getElementById('cdTechBody');
        if (c.result !== 'yes') {
          techBody.innerHTML = '<span style="color:#94a3b8;font-style:italic">— 本案審查結果為否，不涉及關鍵技術項目 —</span>';
        } else {
          techBody.innerHTML = c.techs.length === 0
            ? '<span style="color:#94a3b8;font-style:italic">— 本案未涉及關鍵技術項目 —</span>'
            : c.techs.map(t => `<span class="cd-tech-tag"><span class="num">${t.code}</span>${t.name}</span>`).join('');
        }
        
        // 注意事項
        const noticeBody = document.getElementById('cdNoticeBody');
        noticeBody.innerHTML = c.notices.length === 0
          ? '<span style="color:#94a3b8;font-style:italic">— 無注意事項 —</span>'
          : c.notices.map(n => `<span class="cd-note-tag">${n}</span>`).join('');
        
        // 審查說明 / 複審說明(收合機制)
        const reviewBody = document.getElementById('cdReviewBody');
        const reReviewBody = document.getElementById('cdReReviewBody');
        const reReviewToggle = document.getElementById('cdReReviewToggle');
        reviewBody.innerHTML = (c.review || '').replace(/\n/g, '<br>');
        reviewBody.classList.add('collapsed');
        reviewBody.classList.remove('expanded');
        // 重置展開全文 label
        const reviewToggleLbl = reviewBody.nextElementSibling?.querySelector('.lbl');
        if (reviewToggleLbl) reviewToggleLbl.textContent = '展開全文';
        
        const isReReviewEmpty = c.reReview && (c.reReview.includes('無複審紀錄') || c.reReview.includes('無進一步複審'));
        reReviewBody.innerHTML = (c.reReview || '').replace(/\n/g, '<br>');
        if (isReReviewEmpty) {
          reReviewBody.style.fontStyle = 'italic';
          reReviewBody.style.color = '#94a3b8';
          reReviewBody.classList.remove('collapsed','expanded');
          if (reReviewToggle) reReviewToggle.style.display = 'none';
        } else {
          reReviewBody.style.fontStyle = '';
          reReviewBody.style.color = '';
          reReviewBody.classList.add('collapsed');
          reReviewBody.classList.remove('expanded');
          if (reReviewToggle) {
            reReviewToggle.style.display = '';
            const lbl = reReviewToggle.querySelector('.lbl');
            if (lbl) lbl.textContent = '展開全文';
          }
        }
      }
      
      // 長文字展開/收合(case-detail 頁專用)
      function cdToggleLong(btn) {
        const sec = btn.previousElementSibling;
        const lbl = btn.querySelector('.lbl');
        const arr = btn.querySelector('.arr');
        const expanded = sec.classList.toggle('expanded');
        sec.classList.toggle('collapsed', !expanded);
        if (lbl) lbl.textContent = expanded ? '收合' : '展開全文';
        if (arr) arr.style.transform = expanded ? 'rotate(180deg)' : '';
      }
      
      // 進入廠商詳細頁時自動渲染列表
      document.addEventListener('DOMContentLoaded', () => {
        renderFirmCases();
        // v6 廠商詳細頁初始保險:若 page-detail 顯示中、但 fd-ind-paths / firmPathTechBody 空殼,
        // 以 fd-reg-uid 寫死值(預設日月光 76027628)當 firmId 觸發 render
        try {
          const pageDetail = document.getElementById('page-detail');
          const visible = pageDetail && (pageDetail.style.display !== 'none');
          const uidEl = document.getElementById('fd-reg-uid');
          const seedUid = uidEl ? uidEl.textContent.trim() : '';
          if (visible && seedUid && typeof renderFirmDetail === 'function') {
            renderFirmDetail(seedUid);
          } else {
            // 即使頁面還沒顯示,也先填空殼避免使用者切過去看到完全空白
            if (seedUid) {
              if (typeof renderFirmIndPaths === 'function') renderFirmIndPaths(seedUid);
              if (typeof renderFirmPathTech === 'function') renderFirmPathTech(seedUid);
              if (typeof renderFirmTechHits === 'function') renderFirmTechHits(seedUid);
              try { window.__FIRM_DETAIL_CURRENT_UID = seedUid; } catch(e) {}
            }
          }
        } catch(e) { console.error('v6 init guard err:', e); }
      });



      // ★ v4.0 關鍵技術管理：頁面 tab 切換（類別 / 技術項）
      function admTechPageTab(tabName) {
        document.querySelectorAll('#page-adm-tech .adm-page-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('#page-adm-tech .adm-page-pane').forEach(p => p.classList.remove('active'));
        document.querySelector(`#page-adm-tech .adm-page-tab[data-tab="${tabName}"]`)?.classList.add('active');
        document.querySelector(`#page-adm-tech .adm-page-pane[data-pane="${tabName}"]`)?.classList.add('active');
      }

      // ════════════════════════════════════════════════════════════════
      // ★ v4.0 產業地圖管理：樹狀視圖 互動邏輯
      // ════════════════════════════════════════════════════════════════
      function admIndPageTab(tabName) {
        document.querySelectorAll('#page-adm-industry .adm-page-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('#page-adm-industry .adm-page-pane').forEach(p => p.classList.remove('active'));
        document.querySelector(`#page-adm-industry .adm-page-tab[data-tab="${tabName}"]`)?.classList.add('active');
        document.querySelector(`#page-adm-industry .adm-page-pane[data-pane="${tabName}"]`)?.classList.add('active');
        if (tabName === 'tree') admIndRenderTree();
      }

      // 渲染整棵管理樹（重用 IM_TREE 資料）
      function admIndRenderTree() {
        const root = document.getElementById('admIndTree');
        if (!root || typeof IM_TREE === 'undefined') return;
        const order = (typeof IM_L1_ORDER !== 'undefined') ? IM_L1_ORDER : Object.keys(IM_TREE).filter(k => IM_TREE[k].l === 1);
        root.innerHTML = order.map(sn => admIndRenderNode(sn, 0)).join('');
        // L1 預設展開
        root.querySelectorAll('.adm-tree-node').forEach(n => {
          if (n.dataset.lvl === '1') n.classList.add('expanded');
        });
      }

      function admIndRenderNode(sn, depth) {
        const n = IM_TREE[sn];
        if (!n) return '';
        const hasChildren = (n.c || []).length > 0;
        // 沿用 q2GetNodeInfo 取家數/關鍵技術標籤
        const info = (typeof q2GetNodeInfo === 'function') ? q2GetNodeInfo(sn) : {firms: 0, crit: false};
        const arr = hasChildren
          ? `<span class="adm-tree-arr" onclick="admIndToggleNode(this)">▶</span>`
          : `<span class="adm-tree-arr leaf">·</span>`;
        const lvCls = `l${n.l}`;
        const critTag = info.crit ? `<span class="adm-tree-crit">⚠ 關鍵技術</span>` : '';
        const childCnt = hasChildren ? `<span class="adm-tree-children-cnt">${n.c.length} 子</span>` : '';
        const firmsCnt = info.firms > 0 ? `<span class="adm-tree-firms-cnt">${info.firms} 家</span>` : '';
        const childrenHtml = hasChildren
          ? `<div class="adm-tree-children">${n.c.map(c => admIndRenderNode(c, depth+1)).join('')}</div>`
          : '';
        // 顯示動作：✎ 編輯、+ 加子（L7 不能再加，最深 L7）、🗑 刪除
        const canAddChild = n.l < 7;
        return `
          <div class="adm-tree-node" data-sn="${sn}" data-name="${n.n}" data-lvl="${n.l}" draggable="true">
            <div class="adm-tree-node-row" style="--depth:${depth}"
                 ondragstart="admIndDragStart(event,'${sn}')"
                 ondragover="admIndDragOver(event)"
                 ondragleave="admIndDragLeave(event)"
                 ondrop="admIndDrop(event,'${sn}')"
                 ondragend="admIndDragEnd(event)">
              ${arr}
              <span class="adm-tree-handle" title="拖拉重組（可改父節點/排序）">⋮⋮</span>
              <span class="adm-tree-lv ${lvCls}">L${n.l}</span>
              <span class="adm-tree-name" title="${n.n}（節點編號 ${sn}）">${n.n}<span class="adm-tree-sn">(${sn})</span></span>
              <span class="adm-tree-meta">
                ${critTag}${childCnt}${firmsCnt}
              </span>
              <span class="adm-tree-node-actions">
                <button class="act-move" onclick="admIndMoveSibling('${sn}',-1)" title="同層上移">↑</button>
                <button class="act-move" onclick="admIndMoveSibling('${sn}',1)" title="同層下移">↓</button>
                <button class="act-edit" onclick="admOpenModal('industry','edit')" title="編輯此節點">✎</button>
                ${canAddChild ? `<button class="act-add" onclick="admIndOpenAddModal('${sn}',${n.l + 1})" title="加入子節點">＋</button>` : ''}
                <button class="act-del" onclick="admConfirmDel('${n.n.replace(/'/g, "\\'")}')" title="刪除節點">🗑</button>
              </span>
            </div>
            ${childrenHtml}
          </div>`;
      }

      function admIndToggleNode(arrEl) {
        const node = arrEl.closest('.adm-tree-node');
        if (node) node.classList.toggle('expanded');
      }
      function admIndTreeExpandAll() {
        document.querySelectorAll('#admIndTree .adm-tree-node').forEach(n => {
          if (n.querySelector('.adm-tree-arr:not(.leaf)')) n.classList.add('expanded');
        });
      }
      function admIndTreeCollapseAll() {
        document.querySelectorAll('#admIndTree .adm-tree-node').forEach(n => {
          if (n.dataset.lvl !== '1') n.classList.remove('expanded');
        });
      }

      // 過濾邏輯：顯示包含關鍵字的節點及其祖先路徑
      function admIndTreeFilter() {
        const kw = (document.getElementById('admIndTreeFilter').value || '').trim().toLowerCase();
        const allNodes = document.querySelectorAll('#admIndTree .adm-tree-node');
        if (!kw) {
          allNodes.forEach(n => {
            n.classList.remove('hidden');
            n.querySelector(':scope > .adm-tree-node-row')?.classList.remove('matched');
          });
          return;
        }
        const matched = new Set();
        allNodes.forEach(n => {
          const name = (n.dataset.name || '').toLowerCase();
          if (name.includes(kw)) matched.add(n.dataset.sn);
        });
        // 加入祖先 + 後代
        function markAncestors(node) {
          let p = node.parentElement;
          while (p) {
            if (p.classList && p.classList.contains('adm-tree-node')) {
              matched.add(p.dataset.sn);
              p.classList.add('expanded');
            }
            p = p.parentElement;
          }
        }
        const initiallyMatched = Array.from(matched);
        initiallyMatched.forEach(sn => {
          const node = document.querySelector(`#admIndTree .adm-tree-node[data-sn="${sn}"]`);
          if (node) markAncestors(node);
        });
        allNodes.forEach(n => {
          if (matched.has(n.dataset.sn)) {
            n.classList.remove('hidden');
            const row = n.querySelector(':scope > .adm-tree-node-row');
            const name = (n.dataset.name || '').toLowerCase();
            if (name.includes(kw)) row?.classList.add('matched');
            else row?.classList.remove('matched');
          } else {
            n.classList.add('hidden');
          }
        });
      }

      // 拖拉重組（mock，僅 UI 反饋）
      let _admIndDragSn = null;
      function admIndDragStart(e, sn) {
        _admIndDragSn = sn;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      }
      function admIndDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drop-target');
      }
      function admIndDragLeave(e) {
        e.currentTarget.classList.remove('drop-target');
      }
      function admIndDrop(e, targetSn) {
        e.preventDefault();
        e.currentTarget.classList.remove('drop-target');
        if (_admIndDragSn && _admIndDragSn !== targetSn) {
          const fromName = IM_TREE[_admIndDragSn]?.n;
          const toName = IM_TREE[targetSn]?.n;
          if (confirm(`要將「${fromName}」移到「${toName}」之下嗎？\n\n（demo 用 — 正式版會更新樹狀結構）`)) {
            alert('✓ 已重組（demo 用）');
          }
        }
      }
      function admIndDragEnd(e) {
        document.querySelectorAll('#admIndTree .dragging').forEach(el => el.classList.remove('dragging'));
        document.querySelectorAll('#admIndTree .drop-target').forEach(el => el.classList.remove('drop-target'));
        _admIndDragSn = null;
      }

      // ★ v4.0 同層上下移動（最直覺的排序）
      function admIndMoveSibling(sn, delta) {
        const node = IM_TREE[sn];
        if (!node) return;
        const parentSn = node.p;
        let siblings;
        if (parentSn && IM_TREE[parentSn]) {
          siblings = IM_TREE[parentSn].c;
        } else {
          // L1 — 用 IM_L1_ORDER
          siblings = (typeof IM_L1_ORDER !== 'undefined') ? IM_L1_ORDER : [];
        }
        if (!siblings || siblings.length === 0) return;
        const idx = siblings.indexOf(sn);
        if (idx < 0) return;
        const newIdx = idx + delta;
        if (newIdx < 0 || newIdx >= siblings.length) {
          // 已到頂/底，給個視覺回饋
          const row = document.querySelector(`#admIndTree .adm-tree-node[data-sn="${sn}"] > .adm-tree-node-row`);
          if (row) {
            row.classList.add('shake');
            setTimeout(() => row.classList.remove('shake'), 400);
          }
          return;
        }
        // 交換 (mock — 真實需要 update 後端)
        siblings[idx] = siblings[newIdx];
        siblings[newIdx] = sn;
        // 重新渲染
        admIndRenderTree();
        // 高亮剛移動的節點
        setTimeout(() => {
          const movedRow = document.querySelector(`#admIndTree .adm-tree-node[data-sn="${sn}"] > .adm-tree-node-row`);
          if (movedRow) {
            movedRow.classList.add('just-moved');
            // 展開該節點所有祖先
            let p = movedRow.closest('.adm-tree-node')?.parentElement;
            while (p) {
              if (p.classList && p.classList.contains('adm-tree-node')) p.classList.add('expanded');
              p = p.parentElement;
            }
            movedRow.scrollIntoView({block:'center', behavior:'smooth'});
            setTimeout(() => movedRow.classList.remove('just-moved'), 1500);
          }
        }, 50);
      }

      // ════════════════════════════════════════════════════════════════
      // ★ v4.0 廠商資料管理 - Tab 5：關聯企業（事業群架構）
      // ════════════════════════════════════════════════════════════════
      let ADM_FIRM_RELS = {parents: [], children: []};
      let ADM_REL_DIRECTION = 'parent';   // 'parent' | 'child'
      let ADM_REL_PICKED_FIRM = null;     // 暫存挑選到的廠商
      const ADM_REL_TYPE_LABELS = {
        control: '控股 (>50%)',
        joint: '合營 (20-50%)',
        invest: '投資 (<20%)',
        overseas: '海外控股',
        alliance: '聯營 / 策略',
      };

      function admRelOpenAddModal(direction) {
        ADM_REL_DIRECTION = direction;
        ADM_REL_PICKED_FIRM = null;
        // 設定 modal 標題與上下文
        const titleEl = document.getElementById('admRelTitle');
        const dirEl = document.getElementById('admRelCtxDir');
        if (titleEl) titleEl.textContent = direction === 'parent' ? '新增父方關聯' : '新增子方關聯';
        if (dirEl) {
          dirEl.innerHTML = direction === 'parent'
            ? '<b style="color:#0f2347">▲ 父方關聯（誰持有此廠商）</b>'
            : '<b style="color:#0f2347">▼ 子方關聯（此廠商持有誰）</b>';
        }
        // 重置欄位
        document.getElementById('admRelFirmInput').value = '';
        document.getElementById('admRelFirmPicked').style.display = 'none';
        document.getElementById('admRelType').value = 'control';
        document.getElementById('admRelPct').value = '';
        document.getElementById('admRelDate').value = '';
        document.getElementById('admRelFlagWarn').checked = false;
        document.getElementById('admRelNote').value = '';
        document.getElementById('admRelAutocomplete').classList.remove('show');
        document.getElementById('admModalRel').classList.add('show');
      }
      function admRelCloseAddModal() {
        document.getElementById('admModalRel').classList.remove('show');
      }

      // 關聯廠商搜尋 autocomplete（重用 Q2_FIRM_DB）
      function admRelAutocomplete(kw) {
        const ac = document.getElementById('admRelAutocomplete');
        if (!ac || typeof Q2_FIRM_DB === 'undefined') return;
        kw = (kw || '').trim();
        if (!kw) { ac.classList.remove('show'); ac.innerHTML = ''; return; }
        // 過濾廠商（命中名稱、簡稱、別名、統編）
        const matches = Q2_FIRM_DB.filter(f => {
          const all = [f.formal, f.enFormal, f.shortZh, f.shortEn, f.uniform, f.stock,
                       ...(f.aliases || []).map(a => a.name)].filter(Boolean).join(' ').toLowerCase();
          return all.includes(kw.toLowerCase());
        }).slice(0, 8);
        if (matches.length === 0) {
          ac.innerHTML = `
            <div class="adm-rel-ac-add" onclick="admRelQuickAddFirm()">
              ＋ 找不到「${kw}」？快速新增廠商
            </div>`;
        } else {
          ac.innerHTML = matches.map(f => {
            const name = (typeof _highlight === 'function') ? _highlight(f.formal, kw) : f.formal;
            return `
              <div class="adm-rel-ac-item" onclick="admRelPickFirm('${f.uniform}')">
                <div class="adm-rel-ac-item-name">${name}</div>
                <div class="adm-rel-ac-item-meta">統編 ${f.uniform} · 股票 ${f.stock || '—'} · ${f.shortZh}</div>
              </div>`;
          }).join('') + `
            <div class="adm-rel-ac-add" onclick="admRelQuickAddFirm()">
              ＋ 沒看到要找的廠商？快速新增
            </div>`;
        }
        ac.classList.add('show');
      }

      function admRelPickFirm(uniform) {
        const f = Q2_FIRM_DB.find(x => x.uniform === uniform);
        if (!f) return;
        ADM_REL_PICKED_FIRM = f;
        const inp = document.getElementById('admRelFirmInput');
        const picked = document.getElementById('admRelFirmPicked');
        if (inp) { inp.value = f.formal; inp.style.display = 'none'; }
        if (picked) {
          picked.style.display = 'flex';
          picked.innerHTML = `
            <div>
              <div class="adm-rel-firm-picked-name">✓ 已選定：${f.formal}</div>
              <div class="adm-rel-firm-picked-meta">統編 ${f.uniform} · 股票 ${f.stock || '—'} · ${f.shortZh}</div>
            </div>
            <button class="adm-rel-firm-picked-clear" onclick="admRelUnpickFirm()">變更選擇</button>
          `;
        }
        document.getElementById('admRelAutocomplete').classList.remove('show');
      }
      function admRelUnpickFirm() {
        ADM_REL_PICKED_FIRM = null;
        const inp = document.getElementById('admRelFirmInput');
        const picked = document.getElementById('admRelFirmPicked');
        if (inp) { inp.value = ''; inp.style.display = ''; inp.focus(); }
        if (picked) picked.style.display = 'none';
      }
      function admRelQuickAddFirm() {
        const kw = document.getElementById('admRelFirmInput')?.value || '';
        const ans = prompt(`快速新增廠商（demo）\n\n請輸入廠商名稱：`, kw);
        if (!ans) return;
        const uniform = prompt('統一編號（可留空）：', '');
        const newFirm = {
          uniform: uniform || `NEW_${Date.now()}`,
          stock: '',
          formal: ans,
          shortZh: ans.length > 6 ? ans.substring(0, 6) : ans,
          aliases: []
        };
        // 加入 Q2_FIRM_DB
        if (typeof Q2_FIRM_DB !== 'undefined') Q2_FIRM_DB.push(newFirm);
        ADM_REL_PICKED_FIRM = newFirm;
        admRelPickFirm(newFirm.uniform);
        alert(`✓ 已建立廠商「${ans}」（demo 用 — 完整資料可至「廠商資料管理」補齊）`);
      }

      function admRelSave() {
        if (!ADM_REL_PICKED_FIRM) {
          alert('請先選定關聯廠商');
          return;
        }
        const type = document.getElementById('admRelType').value;
        const pct = document.getElementById('admRelPct').value;
        const date = document.getElementById('admRelDate').value;
        const flagWarn = document.getElementById('admRelFlagWarn').checked;
        const note = document.getElementById('admRelNote').value;
        const newRel = {
          firm: ADM_REL_PICKED_FIRM,
          type,
          pct: parseFloat(pct) || null,
          date: date || null,
          source: 'MOPS',
          flagWarn,
          note,
        };
        if (ADM_REL_DIRECTION === 'parent') {
          ADM_FIRM_RELS.parents.push(newRel);
        } else {
          ADM_FIRM_RELS.children.push(newRel);
        }
        admRelRender();
        admRelCloseAddModal();
        // 加一筆變更歷程
        admRelAddHistoryEntry('新增', ADM_REL_PICKED_FIRM.formal,
          `${ADM_REL_DIRECTION === 'parent' ? '父方' : '子方'} · ${ADM_REL_TYPE_LABELS[type]}${pct ? ' · ' + pct + '%' : ''}`);
      }

      function admRelRender() {
        const parents = document.getElementById('admRelParents');
        const children = document.getElementById('admRelChildren');
        const parentCnt = document.getElementById('admRelParentCnt');
        const childCnt = document.getElementById('admRelChildCnt');
        const totalCnt = document.getElementById('admFirmRelsCnt');

        const renderItem = (rel, idx, dir) => {
          const f = rel.firm;
          const typeLbl = ADM_REL_TYPE_LABELS[rel.type] || rel.type;
          const flagHtml = rel.flagWarn ? `<span class="adm-rel-item-flag">⚠ 需注意</span>` : '';
          return `
            <div class="adm-rel-item ${rel.flagWarn ? 'warn' : ''}">
              <span class="adm-rel-item-name">${f.formal.length > 18 ? f.formal.substring(0,18) + '…' : f.formal}</span>
              <span class="adm-rel-item-uniform">${f.uniform}</span>
              <span class="adm-rel-item-type ${rel.type}">${typeLbl}</span>
              <span class="adm-rel-item-pct">${rel.pct != null ? rel.pct.toFixed(2) + '%' : '—'}</span>
              <span class="adm-rel-item-date">${rel.date || '—'}</span>
              <span class="adm-rel-item-source">${rel.source || 'MOPS'}</span>
              ${flagHtml}
              <span class="adm-rel-item-actions">
                <button onclick="alert('demo 編輯')">✎ 編輯</button>
                <button class="del" onclick="admRelRemove('${dir}',${idx})">🗑 解除</button>
              </span>
            </div>`;
        };

        if (parents) parents.innerHTML = ADM_FIRM_RELS.parents.map((r, i) => renderItem(r, i, 'parent')).join('');
        if (children) children.innerHTML = ADM_FIRM_RELS.children.map((r, i) => renderItem(r, i, 'child')).join('');
        if (parentCnt) parentCnt.textContent = ADM_FIRM_RELS.parents.length;
        if (childCnt) childCnt.textContent = ADM_FIRM_RELS.children.length;
        if (totalCnt) totalCnt.textContent = ADM_FIRM_RELS.parents.length + ADM_FIRM_RELS.children.length;
      }
      function admRelRemove(dir, idx) {
        if (!confirm('確定解除此關聯？\n\n（demo 用 — 雙向關聯會同步移除）')) return;
        const arr = dir === 'parent' ? ADM_FIRM_RELS.parents : ADM_FIRM_RELS.children;
        const removed = arr.splice(idx, 1)[0];
        admRelRender();
        if (removed) admRelAddHistoryEntry('解除', removed.firm.formal,
          `${dir === 'parent' ? '父方' : '子方'} · 已解除關聯`);
      }
      function admRelAddHistoryEntry(action, target, content) {
        const tbody = document.getElementById('admRelHistory');
        if (!tbody) return;
        const now = new Date();
        const ts = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
        const actClass = action === '新增' ? 'ok' : action === '解除' ? 'warn' : 'info';
        // 移除空狀態列
        const empty = tbody.querySelector('td[colspan]');
        if (empty) tbody.innerHTML = '';
        const tr = document.createElement('tr');
        tr.innerHTML = `<td class="col-mono" style="font-size:10.5px">${ts}</td><td><span class="adm-pill ${actClass}">${action}</span></td><td>${target}</td><td>${content}</td><td>王玉姍 · 人工</td>`;
        tbody.insertBefore(tr, tbody.firstChild);
      }

      // 開啟「加子節點」modal — 自動帶入父節點與層級
      function admIndOpenAddModal(parentSn, newLvl) {
        // 設定上下文資訊
        const ctxParent = document.getElementById('admIndCtxParent');
        const ctxLvl = document.getElementById('admIndCtxLvl');
        const ctxOrder = document.getElementById('admIndCtxOrder');
        const orderInput = document.getElementById('admIndOrderInput');
        const titleEl = document.getElementById('admIndTitle');

        const lvlNames = {1:'大產業類別', 2:'子產業', 3:'細分產業', 4:'應用領域', 5:'葉節點', 6:'子細項', 7:'末端節點'};

        if (!parentSn) {
          if (ctxParent) ctxParent.innerHTML = '<b style="color:#94a3b8">（無 — 將作為新的 L1 大產業類別）</b>';
          if (titleEl) titleEl.textContent = '新增 L1 大產業類別';
        } else {
          const p = IM_TREE[parentSn];
          if (p) {
            if (ctxParent) {
              ctxParent.innerHTML = `<span class="adm-tree-lv l${p.l}">L${p.l}</span><b>${p.n}</b><span style="color:#94a3b8;font-size:11px;margin-left:8px">(node_sn: ${parentSn})</span>`;
            }
            if (titleEl) titleEl.textContent = `加入子節點於「${p.n}」`;
          }
        }

        if (ctxLvl) {
          ctxLvl.innerHTML = `<span class="adm-tree-lv l${newLvl}">L${newLvl}</span><b>${lvlNames[newLvl] || ''}</b>`;
        }

        // 計算建議排序：父節點目前子節點數 + 1
        let suggOrder = 1;
        if (parentSn && IM_TREE[parentSn]?.c) {
          suggOrder = IM_TREE[parentSn].c.length + 1;
        } else if (!parentSn) {
          // L1 — 算 root 數量
          suggOrder = ((typeof IM_L1_ORDER !== 'undefined') ? IM_L1_ORDER.length : 8) + 1;
        }
        if (ctxOrder) ctxOrder.innerHTML = `<b>${suggOrder}</b><span style="color:#94a3b8;font-size:12px;margin-left:8px">（依目前父節點下子節點數量自動產生）</span>`;
        if (orderInput) orderInput.value = suggOrder;

        document.getElementById('admModalIndustry').classList.add('show');
      }

      // 進入產業地圖頁時自動渲染樹
      const origShowPage = window.showPage;
      if (origShowPage) {
        window.showPage = function(name, el) {
          origShowPage(name, el);
          if (name === 'adm-industry') {
            setTimeout(() => admIndRenderTree(), 50);
          }
        };
      }

      // ★ v4.0 關鍵技術 modal 內 tab 切換（主項 / 架構 / 關聯產業）
      function admSwitchTab(modal, tabName) {
        const root = document.getElementById('admModal' + modal.charAt(0).toUpperCase() + modal.slice(1));
        if (!root) return;
        root.querySelectorAll('.adm-tab').forEach(t => t.classList.remove('active'));
        root.querySelectorAll('.adm-tab-pane').forEach(p => p.classList.remove('active'));
        root.querySelector(`.adm-tab[data-tab="${tabName}"]`)?.classList.add('active');
        root.querySelector(`.adm-tab-pane[data-pane="${tabName}"]`)?.classList.add('active');
      }

      // ★ v4.0 列表頁：技術架構展開預覽
      function admToggleArchPreview(techId) {
        const previewRow = document.querySelector(`tr.adm-arch-preview[data-preview-for="${techId}"]`);
        const badge = document.querySelector(`tr[data-tech-id="${techId}"] .adm-arch-badge`);
        if (!previewRow) return;
        const isShown = previewRow.style.display !== 'none';
        previewRow.style.display = isShown ? 'none' : '';
        badge?.classList.toggle('open', !isShown);
      }

      // ★ v4.0 關鍵技術 modal Tab 2：技術架構（L3）動態管理
      let ADM_TECH_ARCHS = [];   // [{id, name, note, order, firms:[{uniform, name}, ...]}]
      let ADM_TECH_ARCH_PICKER_TARGET_IDX = -1;  // 廠商 picker 開啟時所對應的架構 index

      function admRenderArchs() {
        const c = document.getElementById('admTechArchs');
        const cnt = document.getElementById('admTechArchsCnt');
        if (!c) return;
        c.innerHTML = ADM_TECH_ARCHS.map((arch, idx) => {
          const firmsHtml = (arch.firms || []).map((f, fi) => `
            <span class="adm-arch-firm-chip">
              ${f.name}
              <button type="button" class="adm-arch-firm-chip-x" onclick="admArchRemoveFirm(${idx},${fi})">×</button>
            </span>`).join('');
          return `
            <div class="adm-arch-card">
              <div class="adm-arch-card-head">
                <span class="adm-arch-card-num">L3 #${idx + 1}</span>
                <span class="adm-arch-card-title">${arch.name || '（尚未命名）'}</span>
                <div class="adm-arch-card-actions">
                  <button type="button" onclick="admArchMove(${idx},-1)" title="上移">↑</button>
                  <button type="button" onclick="admArchMove(${idx},1)" title="下移">↓</button>
                  <button type="button" class="del" onclick="admArchRemove(${idx})" title="刪除">×</button>
                </div>
              </div>
              <div class="adm-arch-card-body">
                <div class="adm-form-group">
                  <label>架構名稱 <span class="req">*</span></label>
                  <input type="text" value="${arch.name || ''}" placeholder="例：材料端（纖維/樹脂/預浸與板材）"
                         oninput="admArchUpdate(${idx},'name',this.value)">
                </div>
                <div class="adm-form-group">
                  <label>排序</label>
                  <input type="number" value="${arch.order || 0}" oninput="admArchUpdate(${idx},'order',parseInt(this.value)||0)">
                </div>
                <div class="adm-form-group adm-arch-card-note">
                  <label>架構備註 / 說明</label>
                  <textarea placeholder="此架構之技術範疇與要點說明（如關鍵技術、特殊製程、使用領域等）"
                            oninput="admArchUpdate(${idx},'note',this.value)">${arch.note || ''}</textarea>
                </div>
                <div class="adm-arch-card-firms">
                  <div class="adm-arch-card-firms-head">
                    <span class="adm-arch-card-firms-lbl">代表廠商</span>
                    <span class="adm-arch-card-firms-cnt">${(arch.firms || []).length} 家</span>
                    <button type="button" class="adm-arch-card-firms-pick" onclick="admArchOpenFirmPicker(${idx})">＋ 從廠商資料庫挑選</button>
                  </div>
                  <div class="adm-arch-card-firms-list">${firmsHtml}</div>
                </div>
              </div>
            </div>`;
        }).join('');
        if (cnt) cnt.textContent = ADM_TECH_ARCHS.length;
      }
      function admAddArch() {
        ADM_TECH_ARCHS.push({name:'', note:'', order: ADM_TECH_ARCHS.length + 1, firms:[]});
        admRenderArchs();
      }
      function admArchRemove(idx) {
        if (confirm('確定移除此技術架構？此架構下的代表廠商連結也會一併移除。')) {
          ADM_TECH_ARCHS.splice(idx, 1);
          admRenderArchs();
        }
      }
      function admArchMove(idx, delta) {
        const newIdx = idx + delta;
        if (newIdx < 0 || newIdx >= ADM_TECH_ARCHS.length) return;
        const tmp = ADM_TECH_ARCHS[idx];
        ADM_TECH_ARCHS[idx] = ADM_TECH_ARCHS[newIdx];
        ADM_TECH_ARCHS[newIdx] = tmp;
        admRenderArchs();
      }
      function admArchUpdate(idx, key, val) {
        if (ADM_TECH_ARCHS[idx]) ADM_TECH_ARCHS[idx][key] = val;
      }
      function admArchRemoveFirm(archIdx, firmIdx) {
        if (ADM_TECH_ARCHS[archIdx]?.firms) {
          ADM_TECH_ARCHS[archIdx].firms.splice(firmIdx, 1);
          admRenderArchs();
        }
      }
      // 開啟廠商挑選器（重用 q2 廠商查詢的搜尋下拉，但此處用簡化版 prompt 做 demo）
      function admArchOpenFirmPicker(archIdx) {
        // 簡化 demo：列出所有廠商讓使用者選一家加入
        if (typeof Q2_FIRM_DB === 'undefined') {
          alert('廠商資料庫尚未載入');
          return;
        }
        const list = Q2_FIRM_DB.map((f, i) => `${i + 1}. ${f.formal} (${f.shortZh})`).join('\n');
        const ans = prompt(`請輸入要加入的廠商編號（1-${Q2_FIRM_DB.length}）：\n\n${list}`, '1');
        if (!ans) return;
        const idx = parseInt(ans, 10) - 1;
        if (idx >= 0 && idx < Q2_FIRM_DB.length) {
          const firm = Q2_FIRM_DB[idx];
          if (!ADM_TECH_ARCHS[archIdx].firms) ADM_TECH_ARCHS[archIdx].firms = [];
          // 避免重複
          if (ADM_TECH_ARCHS[archIdx].firms.find(x => x.uniform === firm.uniform)) {
            alert('此廠商已加入');
            return;
          }
          ADM_TECH_ARCHS[archIdx].firms.push({uniform: firm.uniform, name: firm.shortZh});
          admRenderArchs();
        }
      }

      // ★ v3.3 廠商表單 / 關鍵技術表單共用：產業分類多選（重用 q2IndModal）
      let ADM_FIRM_INDS = [];   // [{sn, lvl, name}, ...]
      let ADM_TECH_INDS = [];

      function admOpenIndPicker(targetForm) {
        // 設定 mode 讓 q2IndApply 知道資料要寫去哪
        Q2_PICKER.indMode = 'adm-' + targetForm;
        // 用該表單目前已選的葉節點 + 所有祖先回填 temp
        const cur = (targetForm === 'firm') ? ADM_FIRM_INDS : ADM_TECH_INDS;
        Q2_PICKER.indTemp = new Set();
        cur.forEach(x => {
          Q2_PICKER.indTemp.add(x.sn);
          let parent = IM_TREE[x.sn]?.p;
          while (parent && IM_TREE[parent]) {
            Q2_PICKER.indTemp.add(parent);
            parent = IM_TREE[parent].p;
          }
        });
        q2RenderIndTree();
        q2UpdateIndPickerCount();
        document.getElementById('q2IndModal').classList.add('show');
      }

      // 從某節點往上推至 L1，組成「L1 → L2 → L3 → ...」完整路徑
      function admBuildPath(sn) {
        const path = [];
        let cur = sn;
        while (cur && IM_TREE[cur]) {
          path.unshift(IM_TREE[cur]);
          cur = IM_TREE[cur].p;
        }
        return path;  // [L1node, L2node, ..., leafNode]
      }

      // 每條路徑的關聯關鍵技術暫存（key=idx，值=array of {id,name}）
      let ADM_FIRM_IND_TECHS = {}; // {路徑idx: [{id,name},...]}

      function admRenderIndPaths(targetForm) {
        const list = (targetForm === 'firm') ? ADM_FIRM_INDS : ADM_TECH_INDS;
        const containerId = (targetForm === 'firm') ? 'admFirmIndPaths' : 'admTechIndPaths';
        const countId = (targetForm === 'firm') ? 'admFirmIndCount' : 'admTechIndCount';
        const c = document.getElementById(containerId);
        const cntEl = document.getElementById(countId);
        if (!c) return;

        c.innerHTML = list.map((item, idx) => {
          const path = admBuildPath(item.sn);
          const pathHtml = path.map((n, i) => {
            const isLeaf = (i === path.length - 1);
            return `<span class="lvl">L${n.l}</span><span class="${isLeaf ? 'leaf' : ''}">${n.n}</span>${isLeaf ? '' : '<span class="arr">›</span>'}`;
          }).join('');
          // 關鍵技術 chips（只有 firm 模式顯示）
          const techs = (targetForm === 'firm') ? (ADM_FIRM_IND_TECHS[idx] || []) : [];
          const techChipsHtml = targetForm === 'firm' ? `
            <div class="adm-ind-tech-row">
              <button type="button" class="adm-ind-tech-btn" onclick="admOpenIndTechPicker(${idx})" title="選擇此路徑關聯之關鍵技術">
                <span>⚠</span> 關聯關鍵技術 ${techs.length > 0 ? `<b style="color:#a31621">(${techs.length})</b>` : ''}
              </button>
              <div class="adm-ind-tech-chips">${techs.map((t,ti) =>
                `<span class="adv-tech-chip" data-code="${t.archKey||t.id}">${t.id}${t.archName?`<span class="q2-arch-badge" title="${t.archName}">${t.archName.length>10?t.archName.substring(0,10)+'…':t.archName}</span>`:''}<span class="name">${t.name.length>8?t.name.substring(0,8)+'…':t.name}</span><span class="x" onclick="admRemoveIndTech(${idx},${ti})">×</span></span>`
              ).join('')}</div>
            </div>` : '';
          return `
            <div class="adm-path-item" style="flex-direction:column;align-items:flex-start;gap:6px">
              <div style="display:flex;align-items:center;gap:8px;width:100%">
                <span class="adm-path-idx">領域 ${idx + 1}</span>
                <span class="adm-path-text">${pathHtml}</span>
                <button type="button" class="adm-path-x" onclick="admRemoveIndPath('${targetForm}', ${idx})" title="移除此領域">×</button>
              </div>
              ${techChipsHtml}
            </div>`;
        }).join('');
        if (cntEl) cntEl.textContent = list.length;
      }

      function admOpenIndTechPicker(pathIdx) {
        Q2_PICKER.techMode = 'adm-firm-ind-' + pathIdx;
        const cur = ADM_FIRM_IND_TECHS[pathIdx] || [];
        // 支援 archKey 格式（TID 或 TID:archIdx）
        Q2_PICKER.techTemp = new Set(cur.map(x => x.archKey || x.id));
        q2RenderTechTree();
        q2UpdateTechPickerCount();
        document.getElementById('q2TechModal').classList.add('show');
      }

      function admRemoveIndTech(pathIdx, techIdx) {
        if (ADM_FIRM_IND_TECHS[pathIdx]) {
          ADM_FIRM_IND_TECHS[pathIdx].splice(techIdx, 1);
          admRenderIndPaths('firm');
        }
      }

      function admRemoveIndPath(targetForm, idx) {
        if (targetForm === 'firm') {
          ADM_FIRM_INDS.splice(idx, 1);
          admRenderIndPaths('firm');
        } else {
          ADM_TECH_INDS.splice(idx, 1);
          admRenderIndPaths('tech');
        }
      }

      // ★ v3.3 廠商/產業節點/鑑定案件 三個表單共用：關鍵技術多選（重用 q2TechModal）
      let ADM_FIRM_TECHS = [];   // 廠商表單 — 命中之關鍵技術
      let ADM_IND_TECHS = [];    // 產業節點表單 — 關聯之關鍵技術
      let ADM_CASE_TECHS = [];   // 鑑定案件表單 — 涉及之關鍵技術

      function admOpenTechPicker(targetForm) {
        Q2_PICKER.techMode = 'adm-' + targetForm;
        const cur = (targetForm === 'firm') ? ADM_FIRM_TECHS
                  : (targetForm === 'industry') ? ADM_IND_TECHS
                  : ADM_CASE_TECHS;
        Q2_PICKER.techTemp = new Set(cur.map(x => x.id));
        q2RenderTechTree();
        q2UpdateTechPickerCount();
        document.getElementById('q2TechModal').classList.add('show');
      }

      function admRenderTechChips(targetForm) {
        const stateMap = {firm: ADM_FIRM_TECHS, industry: ADM_IND_TECHS, case: ADM_CASE_TECHS};
        const list = stateMap[targetForm] || [];
        const containerMap = {firm:'admFirmTechChips', industry:'admIndTechChips', case:'admCaseTechChips'};
        const countMap = {firm:'admFirmTechCount', industry:'admIndTechCount', case:'admCaseTechCount'};
        const c = document.getElementById(containerMap[targetForm]);
        const cntEl = document.getElementById(countMap[targetForm]);
        if (!c) return;
        c.innerHTML = list.map((item, idx) => `
          <span class="adm-tech-chip">
            <span class="num">${item.id}</span>${item.name}
            <button type="button" class="adm-tech-chip-x" onclick="admRemoveTechChip('${targetForm}', ${idx})" title="移除">×</button>
          </span>`).join('');
        if (cntEl) cntEl.textContent = list.length;
      }

      function admRemoveTechChip(targetForm, idx) {
        if (targetForm === 'firm') ADM_FIRM_TECHS.splice(idx, 1);
        else if (targetForm === 'industry') ADM_IND_TECHS.splice(idx, 1);
        else ADM_CASE_TECHS.splice(idx, 1);
        admRenderTechChips(targetForm);
      }

      // ★ v3.3 廠商別名管理（廠商表單）
      const ALIAS_TYPES = [
        '中文簡稱', '英文簡稱',
        '中文舊稱', '英文舊稱',
        '中文暱稱', '英文暱稱',
        '集團簡稱', '媒體用語',
        '拼寫變體', '產業地圖用名',
        '政府公告用名', '其他'
      ];
      let ADM_FIRM_ALIASES = [];

      function admRenderAliases() {
        const c = document.getElementById('admFirmAliases');
        if (!c) return;
        c.innerHTML = ADM_FIRM_ALIASES.map((a, idx) => {
          const opts = ALIAS_TYPES.map(t =>
            `<option ${t === a.type ? 'selected' : ''}>${t}</option>`
          ).join('');
          return `
            <div class="adm-alias-row">
              <select onchange="admUpdateAlias(${idx}, 'type', this.value)">${opts}</select>
              <input type="text" placeholder="別名 / 簡稱 / 舊名" value="${a.name || ''}"
                     oninput="admUpdateAlias(${idx}, 'name', this.value)">
              <input type="text" placeholder="備註（選填，例：媒體常用）" value="${a.note || ''}"
                     oninput="admUpdateAlias(${idx}, 'note', this.value)">
              <button type="button" class="alias-x" onclick="admRemoveAlias(${idx})" title="移除此別名">×</button>
            </div>`;
        }).join('');
      }
      function admAddAlias() {
        ADM_FIRM_ALIASES.push({type:'媒體用語', name:'', note:''});
        admRenderAliases();
      }
      function admRemoveAlias(idx) {
        ADM_FIRM_ALIASES.splice(idx, 1);
        admRenderAliases();
      }
      function admUpdateAlias(idx, key, val) {
        if (ADM_FIRM_ALIASES[idx]) ADM_FIRM_ALIASES[idx][key] = val;
      }

      // ════════════════════════════════════════════════════════════════
      // ★ v3.3 廠商查詢 v2 — 自動完成（命中名稱 / 簡稱 / 別名）
      // ════════════════════════════════════════════════════════════════
      // demo 資料：每筆廠商含正名 + 簡稱 + 別名陣列，用於命中匹配示範
      const Q2_FIRM_DB = [
        {
          uniform:'22099131', stock:'2330',
          formal:'台灣積體電路製造股份有限公司',
          enFormal:'Taiwan Semiconductor Manufacturing Co., Ltd.',
          shortZh:'台積電', shortEn:'TSMC',
          aliases:[
            {type:'集團簡稱', name:'台積'},
            {type:'媒體用語', name:'護國神山'},
            {type:'產業地圖用名', name:'台積電（TSMC）'},
            {type:'拼寫變體', name:'TSMC Limited'},
          ]
        },
        {
          uniform:'84149961', stock:'2454',
          formal:'聯發科技股份有限公司',
          enFormal:'MediaTek Inc.',
          shortZh:'聯發科', shortEn:'MediaTek',
          aliases:[
            {type:'集團簡稱', name:'聯發'},
            {type:'拼寫變體', name:'Mediatek'},
            {type:'產業地圖用名', name:'聯發科（MediaTek）'},
          ]
        },
        {
          uniform:'76027628', stock:'3711',
          formal:'日月光半導體製造股份有限公司',
          enFormal:'Advanced Semiconductor Engineering, Inc.',
          shortZh:'日月光', shortEn:'ASE',
          aliases:[
            {type:'集團簡稱', name:'日月光投控'},
            {type:'拼寫變體', name:'ASE Group'},
            {type:'媒體用語', name:'封測龍頭'},
          ]
        },
        {
          uniform:'04541302', stock:'2317',
          formal:'鴻海精密工業股份有限公司',
          enFormal:'Hon Hai Precision Industry Co., Ltd.',
          shortZh:'鴻海', shortEn:'Hon Hai',
          aliases:[
            {type:'英文簡稱', name:'Foxconn'},
            {type:'集團簡稱', name:'鴻海集團'},
            {type:'媒體用語', name:'代工龍頭'},
          ]
        },
        {
          uniform:'97162640', stock:'3481',
          formal:'群創光電股份有限公司',
          enFormal:'Innolux Corporation',
          shortZh:'群創', shortEn:'Innolux',
          aliases:[
            {type:'中文舊稱', name:'奇美電子'},
            {type:'英文舊稱', name:'CHIMEI Innolux'},
            {type:'拼寫變體', name:'CHIMEI'},
          ]
        },
        {
          uniform:'22513334', stock:'2379',
          formal:'瑞昱半導體股份有限公司',
          enFormal:'Realtek Semiconductor Corp.',
          shortZh:'瑞昱', shortEn:'Realtek',
          aliases:[{type:'拼寫變體', name:'Realtek Semi'}]
        },
        {
          uniform:'12649951', stock:'8299',
          formal:'群聯電子股份有限公司',
          enFormal:'Phison Electronics Corp.',
          shortZh:'群聯', shortEn:'Phison',
          aliases:[]
        },
        {
          uniform:'23638923', stock:'5347',
          formal:'世界先進積體電路股份有限公司',
          enFormal:'Vanguard International Semiconductor Corp.',
          shortZh:'世界先進', shortEn:'VIS',
          aliases:[{type:'英文簡稱', name:'Vanguard'}]
        },
        {
          uniform:'53052569', stock:'3443',
          formal:'創意電子股份有限公司',
          enFormal:'Global Unichip Corp.',
          shortZh:'創意', shortEn:'GUC',
          aliases:[{type:'拼寫變體', name:'Global Unichip'}]
        },
        {
          uniform:'22662099', stock:'3035',
          formal:'智原科技股份有限公司',
          enFormal:'Faraday Technology Corp.',
          shortZh:'智原', shortEn:'Faraday',
          aliases:[]
        },
      ];

      function _hitField(text, kw) {
        return text && text.toLowerCase().includes(kw.toLowerCase());
      }
      function _highlight(text, kw) {
        if (!text || !kw) return text || '';
        const lower = text.toLowerCase();
        const lkw = kw.toLowerCase();
        const i = lower.indexOf(lkw);
        if (i < 0) return text;
        return text.substring(0, i) +
               '<mark>' + text.substring(i, i + kw.length) + '</mark>' +
               text.substring(i + kw.length);
      }

      function q2Autocomplete(kw) {
        const ac = document.getElementById('q2Autocomplete');
        if (!ac) return;
        kw = (kw || '').trim();
        if (!kw) { ac.classList.remove('show'); ac.innerHTML = ''; return; }

        // 對每家廠商檢查命中欄位
        const matches = [];
        Q2_FIRM_DB.forEach(f => {
          const hits = [];  // 命中的「顯示用」資訊
          // 統編 / 股票代號
          if (_hitField(f.uniform, kw)) hits.push({field:'統編', display:f.uniform, isAlias:false});
          if (_hitField(f.stock, kw))   hits.push({field:'股票', display:f.stock, isAlias:false});
          // 正式名稱（中/英）—— 不是別名，直接命中正名
          if (_hitField(f.formal, kw))   hits.push({field:'正式中文名稱', display:f.formal, isAlias:false});
          if (_hitField(f.enFormal, kw)) hits.push({field:'正式英文名稱', display:f.enFormal, isAlias:false});
          // 簡稱（中/英）—— 算別名命中
          if (_hitField(f.shortZh, kw)) hits.push({field:'中文簡稱', display:f.shortZh, isAlias:true});
          if (_hitField(f.shortEn, kw)) hits.push({field:'英文簡稱', display:f.shortEn, isAlias:true});
          // 其他別名
          (f.aliases || []).forEach(a => {
            if (_hitField(a.name, kw)) hits.push({field:a.type, display:a.name, isAlias:true});
          });
          if (hits.length > 0) matches.push({firm:f, hits});
        });

        if (matches.length === 0) {
          ac.innerHTML = `
            <div class="q2-ac-empty">
              無符合「<span>${kw}</span>」的廠商<br>
              <span style="font-size:10.5px;color:#94a3b8;font-style:italic">可嘗試輸入廠商簡稱、英文縮寫或統一編號</span>
            </div>`;
          ac.classList.add('show');
          return;
        }

        ac.innerHTML = `
          <div class="q2-ac-head">命中 <b>${matches.length}</b> 家廠商（含名稱／簡稱／別名／統編）</div>
          ${matches.slice(0, 8).map(m => {
            const f = m.firm;
            // 取第一個命中決定主顯示：若命中正名 → 顯示正名；若命中別名 → 顯示「別名 → (正式名稱)」
            const primary = m.hits[0];
            const titleHtml = primary.isAlias
              ? `${_highlight(primary.display, kw)}<span class="q2-ac-formal">${f.formal}</span>`
              : _highlight(f.formal, kw);
            // 命中欄位徽章（去重）
            const hitFields = [...new Set(m.hits.map(h => h.field))];
            const hitBadges = hitFields.map(hf =>
              `<span class="q2-ac-hit">命中：<b>${hf}</b></span>`
            ).join('');
            return `
              <div class="q2-ac-item" onmousedown="q2PickAcItem('${f.formal.replace(/'/g, "\\'")}')">
                <div class="q2-ac-name">${titleHtml}</div>
                <div class="q2-ac-meta">
                  <span class="uniform">統編 ${f.uniform}</span>
                  <span class="uniform">股票 ${f.stock || '—'}</span>
                  ${hitBadges}
                </div>
              </div>`;
          }).join('')}
          ${matches.length > 8 ? `<div class="q2-ac-empty" style="font-style:normal">…另有 ${matches.length - 8} 家廠商可能命中，請按 Enter 看完整結果</div>` : ''}
        `;
        ac.classList.add('show');
      }

      function q2HideAutocomplete() {
        const ac = document.getElementById('q2Autocomplete');
        if (ac) ac.classList.remove('show');
      }
      function q2PickAcItem(formalName) {
        const inp = document.getElementById('q2KW');
        if (inp) inp.value = formalName;
        q2HideAutocomplete();
      }

      function admChangePageSize(sel) {
        // mock：提示更新分頁
        const v = sel.value;
        const pgInfo = sel.closest('.adm-pagination')?.querySelector('.adm-pg-info b');
        if (pgInfo) {
          pgInfo.textContent = `1–${v}`;
        }
      }
      // 拖拉排序（mock）— 滑鼠 down 時記錄 row，up 時更新順序
      let _admDragRow = null;
      document.addEventListener('mousedown', e => {
        const handle = e.target.closest('.adm-drag-handle');
        if (handle) {
          _admDragRow = handle.closest('tr');
          if (_admDragRow) _admDragRow.classList.add('dragging');
        }
      });
      document.addEventListener('mouseup', () => {
        if (_admDragRow) _admDragRow.classList.remove('dragging');
        _admDragRow = null;
      });

      // ★ v3.3 新增：radio 群組切換(投資方向、鑑定結果)
      function pickRadio(el) {
        const group = el.parentNode;
        group.querySelectorAll('.adv-radio').forEach(r => r.classList.remove('on'));
        el.classList.add('on');
      }

      // ★ v3.3 新增:42 項技術下拉新增 chip(v6 任務 14:支援 __ALL__ 批次加入)
      function addTechChip(sel) {
        if (!sel.value) return;
        const chips = document.getElementById('techChips');
        if (!chips) { sel.value = ''; return; }

        // 「全選 42 項」:loop 所有 option(跳過空值跟 __ALL__ 自己),批次加入未重複者
        if (sel.value === '__ALL__') {
          const existingCodes = new Set();
          chips.querySelectorAll('.adv-tech-chip').forEach(c => existingCodes.add(c.dataset.code));
          const opts = sel.querySelectorAll('option');
          opts.forEach(o => {
            const v = o.value;
            if (!v || v === '__ALL__') return;
            const [code, name] = v.split('|');
            if (existingCodes.has(code)) return;
            const chip = document.createElement('span');
            chip.className = 'adv-tech-chip';
            chip.dataset.code = code;
            chip.innerHTML = code
              + '<span class="name">' + (name || '') + '</span>'
              + '<span class="x" onclick="removeChip(this)">×</span>';
            chips.appendChild(chip);
            existingCodes.add(code);
          });
          updateTechCount();
          sel.value = '';
          return;
        }

        // 一般單筆加入
        const [code, name] = sel.value.split('|');
        const existing = chips.querySelectorAll('.adv-tech-chip');
        for (const c of existing) {
          if (c.dataset.code === code) {
            sel.value = '';
            return;
          }
        }
        const isStar = code.includes('★');
        const num = code.replace('★','');
        const chip = document.createElement('span');
        chip.className = 'adv-tech-chip';
        chip.dataset.code = code;
        chip.innerHTML = num
          + (isStar ? '<span class="star">★</span>' : '')
          + '<span class="name">' + name + '</span>'
          + '<span class="x" onclick="removeChip(this)">×</span>';
        chips.appendChild(chip);
        updateTechCount();
        sel.value = '';
      }

      // v6 任務 14:鑑定結果連動 — 「否(不落入)」時禁用條件 5 的下拉 + 清空 chips
      function advResultChanged(state) {
        const block = document.getElementById('advTechBlock');
        const sel = document.getElementById('advTechSelect');
        const pickerBtn = block?.querySelector('.q2-picker-trigger');
        if (!block) return;
        if (state === 'no') {
          block.classList.add('disabled');
          if (sel) { sel.disabled = true; sel.value = ''; }
          if (pickerBtn) { pickerBtn.disabled = true; pickerBtn.style.opacity = '0.4'; pickerBtn.style.pointerEvents = 'none'; }
          if (typeof clearAllChips === 'function') clearAllChips();
        } else {
          block.classList.remove('disabled');
          if (sel) sel.disabled = false;
          if (pickerBtn) { pickerBtn.disabled = false; pickerBtn.style.opacity = ''; pickerBtn.style.pointerEvents = ''; }
        }
      }

      // ★ v3.3 新增：移除單一 chip
      function removeChip(x) {
        x.parentNode.remove();
        updateTechCount();
      }

      // ★ v3.3 新增：清除全部 chip
      function clearAllChips() {
        const chips = document.getElementById('techChips');
        if (!chips) return;
        chips.innerHTML = '';
        updateTechCount();
      }

      // 更新計數顯示
      function updateTechCount() {
        const chips = document.getElementById('techChips');
        const counter = document.getElementById('techCount');
        if (chips && counter) {
          counter.textContent = chips.querySelectorAll('.adv-tech-chip').length;
        }
      }
      function resetFilters() {
        document.querySelectorAll('.flt input[type=checkbox]').forEach(c => c.checked=false);
        showToast('篩選已重設');
      }
      function showToast(msg, type) {
        const t = document.getElementById('toast');
        if (!t) return;
        // Reset state cleanly so multiple toasts don't overlap
        t.classList.remove('show','warn','err');
        // Force reflow so re-adding .show triggers transition again
        void t.offsetWidth;
        t.textContent = msg;
        if (type === 'warn') t.classList.add('warn');
        else if (type === 'err') t.classList.add('err');
        t.classList.add('show');
        clearTimeout(window._toastTm);
        window._toastTm = setTimeout(() => t.classList.remove('show'), 2800);
      }

      // ════════════════════════════════════════════════════════════════
      // 帳號管理 (adm-users)
      // ════════════════════════════════════════════════════════════════
      // ════════════════════════════════════════════════════════════════
      // 歷史鑑定案件查詢 — 關鍵技術選擇器（重用 q2TechModal）
      // ════════════════════════════════════════════════════════════════
      function casesOpenTechPicker() {
        Q2_PICKER.techMode = 'cases-search';
        // 從現有 chips 還原已選 set
        const chips = document.querySelectorAll('#techChips .adv-tech-chip');
        Q2_PICKER.techTemp = new Set([...chips].map(c => c.dataset.code));
        q2RenderTechTree();
        q2UpdateTechPickerCount();
        document.getElementById('q2TechModal').classList.add('show');
      }

      // ════════════════════════════════════════════════════════════════
      // 歷史鑑定管理 — 中轉公司動態列
      // ════════════════════════════════════════════════════════════════
      function admRelayAdd(val) {
        const list = document.getElementById('adm-relay-list');
        if (!list) return;
        const row = document.createElement('div');
        row.className = 'adm-relay-row';
        row.innerHTML = `<input type="text" placeholder="例：CHIMEI INTERNATIONAL HONG KONG" value="${val||''}">
          <button type="button" class="adm-relay-del" onclick="this.parentNode.remove()" title="移除">×</button>`;
        list.appendChild(row);
      }
      function admRelayReset(vals) {
        const list = document.getElementById('adm-relay-list');
        if (!list) return;
        list.innerHTML = '';
        (vals || []).forEach(v => admRelayAdd(v));
        if (!vals || vals.length === 0) admRelayAdd('');
      }
      function admRelayGetValues() {
        return [...document.querySelectorAll('#adm-relay-list .adm-relay-row input')]
          .map(i => i.value.trim()).filter(Boolean);
      }

      // ════════════════════════════════════════════════════════════════
      // 富文字編輯器 (RTE) 共用函式
      // ════════════════════════════════════════════════════════════════
      function rteCmd(id, cmd) {
        const el = document.getElementById(id);
        if (!el) return;
        el.focus();
        document.execCommand(cmd, false, null);
      }
      function rteColor(id, color) {
        const el = document.getElementById(id);
        if (!el) return;
        el.focus();
        document.execCommand('foreColor', false, color);
      }
      function rteLink(id) {
        const url = prompt('請輸入超連結網址：', 'https://');
        if (!url) return;
        const el = document.getElementById(id);
        if (!el) return;
        el.focus();
        document.execCommand('createLink', false, url);
        // 讓連結在新頁開啟
        const links = el.querySelectorAll('a:not([target])');
        links.forEach(a => { a.target = '_blank'; a.rel = 'noopener'; });
      }
      function rteImgUpload(id) {
        document.getElementById(id + '-img-input')?.click();
      }
      function rteImgInsert(id, input) {
        const file = input.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
          const el = document.getElementById(id);
          if (!el) return;
          el.focus();
          document.execCommand('insertImage', false, e.target.result);
        };
        reader.readAsDataURL(file);
        input.value = '';
      }
      // 貼上圖片支援（paste 事件）
      document.addEventListener('paste', function(e) {
        const el = document.activeElement;
        if (!el || !el.classList.contains('rte-body')) return;
        const items = e.clipboardData?.items;
        if (!items) return;
        for (const item of items) {
          if (item.type.startsWith('image/')) {
            e.preventDefault();
            const file = item.getAsFile();
            const reader = new FileReader();
            reader.onload = ev => document.execCommand('insertImage', false, ev.target.result);
            reader.readAsDataURL(file);
            break;
          }
        }
      });

      function sysInfoSave() {
        showToast('✓ 版本資訊已儲存');
      }

      // ════════════════════════════════════════════════════════════════
      // 系統設定 — 登入頁說明文字管理
      // ════════════════════════════════════════════════════════════════
      function loginDescOpenModal() {
        const v1 = document.getElementById('loginDescRow1')?.textContent || '';
        const v2 = document.getElementById('loginDescRow2')?.textContent || '';
        document.getElementById('loginDescEdit1').value = v1;
        document.getElementById('loginDescEdit2').value = v2;
        document.getElementById('loginDescModal').classList.add('show');
      }
      function loginDescCloseModal() {
        document.getElementById('loginDescModal').classList.remove('show');
      }
      function loginDescSaveModal() {
        const v1 = document.getElementById('loginDescEdit1').value.trim();
        const v2 = document.getElementById('loginDescEdit2').value.trim();
        // 更新登入頁
        const r1 = document.getElementById('loginDescRow1');
        const r2 = document.getElementById('loginDescRow2');
        if (r1) r1.textContent = v1;
        if (r2) r2.textContent = v2;
        // 更新唯讀顯示
        const d1 = document.getElementById('loginDescView1');
        const d2 = document.getElementById('loginDescView2');
        if (d1) d1.textContent = v1;
        if (d2) d2.textContent = v2;
        loginDescCloseModal();
        showToast('✓ 登入頁說明文字已更新');
      }
      function loginDescUpdate() {}
      function loginDescSave() {}
      // 新版：單一大文字框直接儲存並透過 localStorage 同步登入頁
      function loginDescSaveInline() {
        const ta = document.getElementById('loginDescInline');
        if (!ta) return;
        const val = ta.value.trim();
        try { localStorage.setItem('loginMainDesc', val); } catch(e){}
        // 同步 textarea 以反映最新值
        ta.value = val;
        alert('說明文字已儲存，下次開啟登入頁即生效。');
      }

      // ════════════════════════════════════════════════════════════════
      // 系統設定 — 動態權限矩陣
      // ════════════════════════════════════════════════════════════════
      function settingsRenderPerms() {
        const cu = UA_USERS.find(u => u.id === UA_CURRENT_ID);
        if (!cu) return;
        const perms = cu.perms || {};
        const grid = document.getElementById('settingsPermGrid');
        const editBtn = document.getElementById('settingsPermEditBtn');
        if (!grid) return;

        const mainRows = UA_MAIN_MODULES.map(m => {
          const view   = perms.main?.[m.key]?.view   ? '✓' : '✗';
          const exp    = perms.main?.[m.key]?.export ? '✓' : '✗';
          const vok    = perms.main?.[m.key]?.view;
          return `<div class="perm-item ${vok?'ok':'no'}"><span class="perm-icon">${view}</span>${m.label}（匯出：${exp}）</div>`;
        }).join('');

        const admRows = UA_ADM_MODULES.map(m => {
          const l = perms.adm?.[m.key]?.list ? '✓' : '✗';
          const a = perms.adm?.[m.key]?.add  ? '✓' : '✗';
          const e = perms.adm?.[m.key]?.edit ? '✓' : '✗';
          const d = perms.adm?.[m.key]?.del  ? '✓' : '✗';
          const ok = perms.adm?.[m.key]?.list;
          return `<div class="perm-item ${ok?'ok':'no'}"><span class="perm-icon">${l}</span>${m.label}（新增:${a} 修改:${e} 刪除:${d}）</div>`;
        }).join('');

        grid.innerHTML = `
          <div style="font-size:11.5px;font-weight:800;color:#64748b;margin-bottom:6px;padding-bottom:4px;border-bottom:1px solid #f1f5f9">主要功能</div>
          <div class="perm-grid">${mainRows}</div>
          <div style="font-size:11.5px;font-weight:800;color:#64748b;margin:12px 0 6px;padding-bottom:4px;border-bottom:1px solid #f1f5f9">管理功能</div>
          <div class="perm-grid">${admRows}</div>`;

        // 有帳號管理列表權限才顯示「前往設定」按鈕
        const canManageUsers = perms.adm?.['adm-users']?.list;
        if (editBtn) editBtn.style.display = canManageUsers ? '' : 'none';
      }

      // ════════════════════════════════════════════════════════════════
      // 當前登入帳號 id（demo 固定為第 1 筆）
      let UA_CURRENT_ID = 1;

      // 主功能 page key → side-link data-page 對應
      const UA_MAIN_PAGE_MAP = {
        dash:     'dash',
        query2:   'query2',
        cases:    'cases',
        industry: 'industry',
        tech:     'tech'
      };
      // 管理功能 page key → side-link data-page 對應
      const UA_ADM_PAGE_MAP = {
        'adm-firm':     'adm-firm',
        'adm-industry': 'adm-industry',
        'adm-tech':     'adm-tech',
        'adm-case':     'adm-case',
        'audit':        'audit',
        'adm-users':    'adm-users',
        'settings':     'settings'
      };

      /**
       * 依當前帳號權限控制側邊欄可見性。
       * 若目前所在頁面被隱藏，自動跳回首頁。
       */
      function uaApplyPerms() {
        const cu = UA_USERS.find(u => u.id === UA_CURRENT_ID);
        if (!cu) return;
        const perms = cu.perms || {};

        // 主要功能：查看 = false → 隱藏側邊欄項目
        Object.entries(UA_MAIN_PAGE_MAP).forEach(([key, page]) => {
          const canView = perms.main?.[key]?.view ?? true;
          const link = document.querySelector(`.side-link[data-page="${page}"]`);
          if (link) link.style.display = canView ? '' : 'none';
        });

        // 管理功能：各模組 list=false → 隱藏對應側邊欄項目
        Object.entries(UA_ADM_PAGE_MAP).forEach(([key, page]) => {
          const canList = perms.adm?.[key]?.list ?? true;
          const link = document.querySelector(`.side-link[data-page="${page}"]`);
          if (link) link.style.display = canList ? '' : 'none';
        });
        // 若所有管理功能都隱藏，隱藏「管理」區塊標題
        const admSection = document.querySelector('.side-section-label');
        if (admSection) {
          const anyAdmVisible = Object.keys(UA_ADM_PAGE_MAP).some(key =>
            perms.adm?.[key]?.list ?? true
          );
          admSection.style.display = anyAdmVisible ? '' : 'none';
        }

        // 若目前所在頁面已被隱藏，跳回首頁
        const activePage = document.querySelector('.page[style*="display: block"], .page[style*="display:block"]');
        if (activePage) {
          const pid = activePage.id.replace('page-', '');
          // 判斷是否被隱藏
          let blocked = false;
          if (UA_MAIN_PAGE_MAP[pid] !== undefined) {
            blocked = !(perms.main?.[pid]?.view ?? true);
          } else if (UA_ADM_PAGE_MAP[pid] !== undefined) {
            blocked = !(perms.adm?.[pid]?.list ?? true);
          }
          if (blocked) showPage('dash');
        }
      }

      let UA_USERS = [
        { id:1, account:'yushan.wang', password:'P@ssw0rd!',  name:'王玉姍', dept:'對外投資科', title:'審查官',   status:'啟用', remark:'主要操作帳號，連結現有系統示範資料', perms: { main:{ dash:{view:true,export:true}, query2:{view:true,export:true}, cases:{view:true,export:true}, industry:{view:true,export:true}, tech:{view:true,export:true} }, adm:{ 'adm-firm':{visible:true,list:true,add:true,edit:true,del:true}, 'adm-industry':{visible:true,list:true,add:true,edit:true,del:true}, 'adm-tech':{visible:true,list:true,add:true,edit:true,del:true}, 'adm-case':{visible:true,list:true,add:true,edit:true,del:true}, audit:{visible:true,list:true,add:true,edit:true,del:true}, 'adm-users':{visible:true,list:true,add:true,edit:true,del:true}, settings:{visible:true,list:true,add:true,edit:true,del:true} } } },
        { id:2, account:'mingchi.lin',  password:'Lin@2025',   name:'林明志', dept:'投資審議科', title:'科長',      status:'啟用', remark:'投資審議科科長，僅需查閱功能', perms:{ main:{ dash:{view:true,export:false}, query2:{view:true,export:false}, cases:{view:true,export:false}, industry:{view:false,export:false}, tech:{view:false,export:false} }, adm:{ 'adm-firm':{list:false,add:false,edit:false,del:false}, 'adm-industry':{list:false,add:false,edit:false,del:false}, 'adm-tech':{list:false,add:false,edit:false,del:false}, 'adm-case':{list:false,add:false,edit:false,del:false}, audit:{list:false,add:false,edit:false,del:false}, 'adm-users':{list:false,add:false,edit:false,del:false}, settings:{list:false,add:false,edit:false,del:false} } } },
        { id:3, account:'itri.admin',   password:'ITRI@2025',  name:'工研院維運', dept:'工研院量測中心', title:'系統管理員', status:'啟用', remark:'工研院系統維運專用帳號', perms:{ main:{ dash:{view:true,export:true}, query2:{view:true,export:true}, cases:{view:true,export:true}, industry:{view:true,export:true}, tech:{view:true,export:true} }, adm:{ 'adm-firm':{list:true,add:true,edit:true,del:false}, 'adm-industry':{list:true,add:true,edit:true,del:false}, 'adm-tech':{list:true,add:true,edit:true,del:false}, 'adm-case':{list:true,add:true,edit:true,del:false}, audit:{list:true,add:false,edit:false,del:false}, 'adm-users':{list:false,add:false,edit:false,del:false}, settings:{list:false,add:false,edit:false,del:false} } } },
        { id:4, account:'mei.chen',     password:'Chen2024!',  name:'陳美惠', dept:'對外投資科', title:'助理審查官', status:'關閉', remark:'育嬰假中，暫時停用', perms:{ main:{ dash:{view:true,export:false}, query2:{view:true,export:false}, cases:{view:false,export:false}, industry:{view:false,export:false}, tech:{view:false,export:false} }, adm:{ 'adm-firm':{list:false,add:false,edit:false,del:false}, 'adm-industry':{list:false,add:false,edit:false,del:false}, 'adm-tech':{list:false,add:false,edit:false,del:false}, 'adm-case':{list:false,add:false,edit:false,del:false}, audit:{list:false,add:false,edit:false,del:false}, 'adm-users':{list:false,add:false,edit:false,del:false}, settings:{list:false,add:false,edit:false,del:false} } } },
        { id:5, account:'jiaming.wu',   password:'Wu@expired', name:'吳家銘', dept:'業務諮詢科', title:'科員',      status:'已過期', remark:'2025-12-31 合約到期，未續約', perms:{ main:{ dash:{view:false,export:false}, query2:{view:false,export:false}, cases:{view:false,export:false}, industry:{view:false,export:false}, tech:{view:false,export:false} }, adm:{ 'adm-firm':{list:false,add:false,edit:false,del:false}, 'adm-industry':{list:false,add:false,edit:false,del:false}, 'adm-tech':{list:false,add:false,edit:false,del:false}, 'adm-case':{list:false,add:false,edit:false,del:false}, audit:{list:false,add:false,edit:false,del:false}, 'adm-users':{list:false,add:false,edit:false,del:false}, settings:{list:false,add:false,edit:false,del:false} } } }
      ];
      // 從 localStorage 還原已修改的使用者資料和當前帳號
      (function() {
        try {
          const saved = localStorage.getItem('ua_users');
          if (saved) UA_USERS = JSON.parse(saved);
          const savedId = localStorage.getItem('ua_current_id');
          if (savedId) UA_CURRENT_ID = parseInt(savedId, 10);
        } catch(e) {}
      })();


      const UA_MAIN_MODULES = [
        { key:'dash',     label:'首頁總覽' },
        { key:'query2',   label:'廠商查詢' },
        { key:'cases',    label:'歷史鑑定案件' },
        { key:'industry', label:'產業地圖' },
        { key:'tech',     label:'關鍵技術' }
      ];
      const UA_ADM_MODULES = [
        { key:'adm-firm',     label:'廠商資料管理' },
        { key:'adm-industry', label:'產業地圖資料管理' },
        { key:'adm-tech',     label:'關鍵技術管理' },
        { key:'adm-case',     label:'歷史鑑定資料管理' },
        { key:'audit',        label:'稽核日誌' },
        { key:'adm-users',    label:'帳號管理' },
        { key:'settings',     label:'系統設定' }
      ];

      let uaEditId = null; // null = 新增模式

      function uaRenderTable() {
        const kw = (document.getElementById('uaSearchInput')?.value || '').toLowerCase();
        const sf = document.getElementById('uaStatusFilter')?.value || '';
        const tbody = document.getElementById('uaTableBody');
        if (!tbody) return;
        const filtered = UA_USERS.filter(u => {
          const matchKw = !kw || [u.account, u.name, u.dept].some(s => s.toLowerCase().includes(kw));
          const matchSt = !sf || u.status === sf;
          return matchKw && matchSt;
        });
        tbody.innerHTML = filtered.map(u => {
          const badgeCls = u.status === '啟用' ? 'on' : u.status === '關閉' ? 'off' : 'exp';
          return `<tr>
            <td class="col-seq col-mono">${u.id}</td>
            <td class="col-mono">${u.account}</td>
            <td>${u.name}</td>
            <td>${u.dept}</td>
            <td>${u.title}</td>
            <td>
              <select class="ua-status-sel" onchange="uaChangeStatus(${u.id}, this.value)">
                <option${u.status==='啟用'?' selected':''}>啟用</option>
                <option${u.status==='關閉'?' selected':''}>關閉</option>
                <option${u.status==='已過期'?' selected':''}>已過期</option>
              </select>
            </td>
            <td style="color:#64748b;font-size:11.5px;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${u.remark}">${u.remark || '—'}</td>
            <td class="col-action">
              <button class="ua-icon-btn" onclick="uaMgrOpen(${u.id})" title="編輯">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="ua-icon-btn del" onclick="uaDelete(${u.id})" title="刪除">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
              </button>
            </td>
          </tr>`;
        }).join('');
      }

      function uaChangeStatus(id, val) {
        const u = UA_USERS.find(x => x.id === id);
        if (u) { u.status = val; showToast(`已更新 ${u.name} 狀態 → ${val}`); }
      }

      function uaDelete(id) {
        const u = UA_USERS.find(x => x.id === id);
        if (!u) return;
        if (id === 1) { showToast('⚠ 第一筆示範帳號不可刪除', 'warn'); return; }
        if (!confirm(`確定刪除帳號「${u.account}」(${u.name})？`)) return;
        UA_USERS = UA_USERS.filter(x => x.id !== id);
        uaRenderTable();
        showToast('已刪除帳號');
      }

      function uaMgrOpen(idOrNew) {
        uaEditId = idOrNew === 'new' ? null : idOrNew;
        const u = uaEditId ? UA_USERS.find(x => x.id === uaEditId) : null;
        document.getElementById('uaModalTitle').textContent = u ? `編輯帳號 — ${u.account}` : '新增帳號';
        // 填基本資料
        document.getElementById('ua-account').value  = u ? u.account  : '';
        
        document.getElementById('ua-name').value     = u ? u.name     : '';
        document.getElementById('ua-dept').value     = u ? u.dept     : '';
        document.getElementById('ua-title').value    = u ? u.title    : '';
        document.getElementById('ua-remark').value   = u ? u.remark   : '';
        // 啟用日期：預設當天；停用日期：預設空
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('ua-start-date').value = u?.startDate || today;
        document.getElementById('ua-end-date').value   = u?.endDate   || '';
        document.querySelectorAll('input[name="ua-status"]').forEach(r => {
          r.checked = u ? (r.value === u.status) : (r.value === '啟用');
        });
        // 渲染權限矩陣
        uaRenderPermMatrix(u);
        // 切到 Tab 0
        uaSwitchTab(0);
        document.getElementById('uaModal').classList.add('show');
      }

      function uaMgrClose() {
        document.getElementById('uaModal').classList.remove('show');
        uaEditId = null;
      }

      function uaSwitchTab(idx) {
        [0,1].forEach(i => {
          document.getElementById(`uaTab${i}`).classList.toggle('active', i===idx);
          document.getElementById(`uaTabPanel${i}`).style.display = i===idx ? '' : 'none';
        });
      }

      function uaRenderPermMatrix(u) {
        // 主要功能
        const mainBody = document.getElementById('uaPermMainBody');
        mainBody.innerHTML = UA_MAIN_MODULES.map(m => {
          const pv = u?.perms?.main?.[m.key]?.view   ?? false;
          const pe = u?.perms?.main?.[m.key]?.export ?? false;
          return `<tr>
            <td class="ua-perm-module-col">${m.label}</td>
            <td><input type="checkbox" class="ua-perm-cb" data-scope="main" data-key="${m.key}" data-perm="view" ${pv?'checked':''}></td>
            <td><input type="checkbox" class="ua-perm-cb" data-scope="main" data-key="${m.key}" data-perm="export" ${pe?'checked':''}></td>
          </tr>`;
        }).join('');
        // 管理功能
        const admBody = document.getElementById('uaPermAdmBody');
        const admVisibleCb = document.getElementById('uaAdmVisible');
        const admVisible = u?.perms?.adm?.__visible ?? true;
        if (admVisibleCb) admVisibleCb.checked = admVisible;
        admBody.innerHTML = UA_ADM_MODULES.map(m => {
          const pl = u?.perms?.adm?.[m.key]?.list ?? false;
          const pa = u?.perms?.adm?.[m.key]?.add  ?? false;
          const pe = u?.perms?.adm?.[m.key]?.edit ?? false;
          const pd = u?.perms?.adm?.[m.key]?.del  ?? false;
          return `<tr>
            <td class="ua-perm-module-col">${m.label}</td>
            <td><input type="checkbox" class="ua-perm-cb" data-scope="adm" data-key="${m.key}" data-perm="list" ${pl?'checked':''}></td>
            <td><input type="checkbox" class="ua-perm-cb" data-scope="adm" data-key="${m.key}" data-perm="add"  ${pa?'checked':''}></td>
            <td><input type="checkbox" class="ua-perm-cb" data-scope="adm" data-key="${m.key}" data-perm="edit" ${pe?'checked':''}></td>
            <td><input type="checkbox" class="ua-perm-cb" data-scope="adm" data-key="${m.key}" data-perm="del"  ${pd?'checked':''}></td>
          </tr>`;
        }).join('');
      }

      function uaToggleAdmVisible(checked) {
        // 即時預覽（若修改當前帳號）
        if (uaEditId === UA_CURRENT_ID) {
          const cu = UA_USERS.find(u => u.id === UA_CURRENT_ID);
          if (cu) {
            if (!cu.perms.adm) cu.perms.adm = {};
            cu.perms.adm.__visible = checked;
            uaApplyPerms();
          }
        }
      }

      function uaReadPermMatrix() {
        const perms = { main:{}, adm:{} };
        document.querySelectorAll('#uaPermMainBody .ua-perm-cb').forEach(cb => {
          const k = cb.dataset.key, p = cb.dataset.perm;
          if (!perms.main[k]) perms.main[k] = {};
          perms.main[k][p] = cb.checked;
        });
        // 整體管理可見 checkbox
        const admVisibleCb = document.getElementById('uaAdmVisible');
        perms.adm.__visible = admVisibleCb ? admVisibleCb.checked : true;
        document.querySelectorAll('#uaPermAdmBody .ua-perm-cb').forEach(cb => {
          const k = cb.dataset.key, p = cb.dataset.perm;
          if (!perms.adm[k]) perms.adm[k] = {};
          perms.adm[k][p] = cb.checked;
        });
        return perms;
      }

      function uaSave() {
        const account  = document.getElementById('ua-account').value.trim();
        const name     = document.getElementById('ua-name').value.trim();
        const dept     = document.getElementById('ua-dept').value.trim();
        const title    = document.getElementById('ua-title').value.trim();
        const status   = document.querySelector('input[name="ua-status"]:checked')?.value || '啟用';
        const remark    = document.getElementById('ua-remark').value.trim();
        const startDate = document.getElementById('ua-start-date').value || '';
        const endDate   = document.getElementById('ua-end-date').value   || '';
        if (!account || !name) { showToast('⚠ 帳號與姓名為必填', 'warn'); return; }
        const perms = uaReadPermMatrix();
        if (uaEditId) {
          // 編輯
          const u = UA_USERS.find(x => x.id === uaEditId);
          if (u) Object.assign(u, {account, name, dept, title, status, remark, startDate, endDate, perms});
        } else {
          // 新增
          const newId = Math.max(0, ...UA_USERS.map(x=>x.id)) + 1;
          UA_USERS.push({id:newId, account, name, dept, title, status, remark, startDate, endDate, perms});
        }
        uaRenderTable();
        // 儲存到 localStorage（多頁模式下換頁後仍保持）
        try { localStorage.setItem('ua_users', JSON.stringify(UA_USERS)); } catch(e) {}
        // 若修改的是當前登入帳號，立即套用權限到側邊欄
        if (uaEditId === UA_CURRENT_ID) {
          uaApplyPerms();
        }
        // 判斷目前在哪個 Tab：權限設定 Tab 直接關閉+toast；基本資料 Tab 跳提示 modal
        const activeTabIdx = document.getElementById('uaTab1')?.classList.contains('active') ? 1 : 0;
        document.getElementById('uaModal').classList.remove('show');
        if (activeTabIdx === 1) {
          showToast('✓ 權限設定已儲存');
          uaEditId = null;
        } else {
          document.getElementById('uaSavePromptModal').classList.add('show');
        }
      }

      function uaSavePromptClose() {
        document.getElementById('uaSavePromptModal').classList.remove('show');
        uaEditId = null;
      }

      function uaSavePromptGoNext() {
        document.getElementById('uaSavePromptModal').classList.remove('show');
        // 重開 modal 並切到權限 tab
        const lastId = uaEditId || UA_USERS[UA_USERS.length-1]?.id;
        if (lastId) uaMgrOpen(lastId);
        setTimeout(() => uaSwitchTab(1), 50);
      }

      // ════════════════════════════════════════════════════════════════
      // v6 修改密碼 modal
      // ════════════════════════════════════════════════════════════════
      function pwOpen() {
        const m = document.getElementById('pwModal');
        if (!m) return;
        // 清空欄位 + 訊息
        ['pwOld','pwNew','pwNew2'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.value = '';
        });
        const msg = document.getElementById('pwMsg');
        if (msg) { msg.textContent = ''; msg.className = 'pw-msg'; }
        m.classList.add('show');
        // focus 第一個欄位
        setTimeout(() => { const el = document.getElementById('pwOld'); if (el) el.focus(); }, 50);
      }
      function pwClose() {
        const m = document.getElementById('pwModal');
        if (m) m.classList.remove('show');
      }
      function pwValidate() {
        const oldP = document.getElementById('pwOld')?.value || '';
        const n1 = document.getElementById('pwNew')?.value || '';
        const n2 = document.getElementById('pwNew2')?.value || '';
        const msg = document.getElementById('pwMsg');
        if (!oldP || !n1 || !n2) {
          if (msg) { msg.textContent = '請完整填寫 3 個欄位'; msg.className = 'pw-msg err'; }
          return false;
        }
        if (n1.length < 8) {
          if (msg) { msg.textContent = '新密碼長度至少 8 字元'; msg.className = 'pw-msg err'; }
          return false;
        }
        if (n1 !== n2) {
          if (msg) { msg.textContent = '兩次輸入的新密碼不一致'; msg.className = 'pw-msg err'; }
          return false;
        }
        if (n1 === oldP) {
          if (msg) { msg.textContent = '新密碼不可與舊密碼相同'; msg.className = 'pw-msg err'; }
          return false;
        }
        if (msg) { msg.textContent = '✓ 通過驗證'; msg.className = 'pw-msg ok'; }
        return true;
      }
      function pwSave() {
        if (!pwValidate()) return;
        // 模擬儲存(原型不實作),關閉 + 跳成功 toast
        pwClose();
        if (typeof showToast === 'function') showToast('✓ 密碼已成功修改');
      }
      // 綁定即時驗證 + ESC 關閉
      document.addEventListener('DOMContentLoaded', () => {
        ['pwOld','pwNew','pwNew2'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.addEventListener('input', () => {
            // 清掉錯誤訊息(等下次提交或第 2 次輸入時再驗)
            const msg = document.getElementById('pwMsg');
            const n1 = document.getElementById('pwNew')?.value || '';
            const n2 = document.getElementById('pwNew2')?.value || '';
            if (msg) {
              if (n2 && n1 !== n2) {
                msg.textContent = '兩次輸入的新密碼不一致'; msg.className = 'pw-msg err';
              } else if (n2 && n1 === n2 && n1.length >= 8) {
                msg.textContent = '✓ 兩次輸入相符'; msg.className = 'pw-msg ok';
              } else {
                msg.textContent = ''; msg.className = 'pw-msg';
              }
            }
          });
        });
        // ESC 關閉
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            const m = document.getElementById('pwModal');
            if (m && m.classList.contains('show')) pwClose();
          }
        });
      });
      function updateTime() {
        const el = document.getElementById('topTime') || document.getElementById('topbar-time');
        if (!el) return;
        const d = new Date();
        const w = ['日','一','二','三','四','五','六'][d.getDay()];
        const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        const timeStr = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
        const dEl = el.querySelector('.d'); const tEl = el.querySelector('.t');
        if (dEl) dEl.textContent = dateStr;
        if (tEl) tEl.textContent = timeStr;
        if (!dEl && !tEl) el.textContent = `${dateStr} ${timeStr}`;
      }
      // 開放 toggle 元素點擊
      document.addEventListener('click', e => {
        if (e.target.closest('.toggle')) {
          e.target.closest('.toggle').classList.toggle('on');
        }
      });

      function openOrgModal(name) {
        const m = document.getElementById('orgmodal-' + name);
        if (m) m.style.display = 'flex';
      }
      function closeOrgModal(name) {
        const m = document.getElementById('orgmodal-' + name);
        if (m) m.style.display = 'none';
      }
      function saveOrgModal(name) {
        showToast('已儲存 · 變更已寫入稽核日誌');
        closeOrgModal(name);
      }
      function switchOmTab(e, paneId) {
        const tabs = e.currentTarget.parentNode.querySelectorAll('.om-mtab');
        tabs.forEach(t => t.classList.remove('on'));
        e.currentTarget.classList.add('on');
        const dialog = e.currentTarget.closest('.om-dialog');
        dialog.querySelectorAll('.om-pane').forEach(p => { p.style.display='none'; p.classList.remove('on'); });
        const target = document.getElementById(paneId);
        if (target) { target.style.display='block'; target.classList.add('on'); }
      }
      // 父子方向卡片切換
      document.addEventListener('click', e => {
        const dc = e.target.closest('.dir-card');
        if (dc) {
          dc.parentNode.querySelectorAll('.dir-card').forEach(x => x.classList.remove('on'));
          dc.classList.add('on');
          const inp = dc.querySelector('input');
          if (inp) inp.checked = true;
        }
        const tc = e.target.closest('.tc-card');
        if (tc) {
          tc.parentNode.querySelectorAll('.tc-card').forEach(x => x.classList.remove('on'));
          tc.classList.add('on');
        }
        const sc = e.target.closest('.src-card');
        if (sc) {
          sc.parentNode.querySelectorAll('.src-card').forEach(x => x.classList.remove('on'));
          sc.classList.add('on');
        }
      });
      // ESC 關閉
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
          document.querySelectorAll('.org-modal').forEach(m => m.style.display = 'none');
        }
      });

      setInterval(updateTime, 30000);
      updateTime();

// 多頁模式：shell inject 完成後套用帳號權限
document.addEventListener('shell-loaded', function() {
  if (typeof uaApplyPerms === 'function') {
    setTimeout(uaApplyPerms, 50);
  }
});
