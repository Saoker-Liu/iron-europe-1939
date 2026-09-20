/* =========================================================================
 * 入口加载器：按阶段顺序注入脚本，驱动开局进度条。
 * 阶段：六边形地图 → 地形与河流 → 国家与城市 → 经济与军事部署 → 将领与历史事件
 *       → 数据装配 → 引擎 → 界面。全部就绪后调用 window.BootUI()。
 * ========================================================================= */
(function () {
  'use strict';

  const STAGES = [
    { label: '加载六边形地图',     files: ['js/core/hex.js', 'js/core/geography.js', 'js/data/map.js'] },
    { label: '加载地形与河流',     files: ['js/data/terrain.js'] },
    { label: '加载国家与城市',     files: ['js/data/nations.js'] },
    { label: '加载经济与军事部署', files: ['js/data/economy.js', 'js/data/military.js'] },
    { label: '加载将领与历史事件', files: ['js/data/generals.js', 'js/data/events.js'] },
    { label: '装配地图与数据',     files: ['js/core/assemble.js'] },
    { label: '初始化引擎',         files: ['js/engine/game.js'] },
    { label: '初始化界面',         files: ['js/ui/map-labels.js', 'js/ui/ui.js'] },
  ];
  const TOTAL = STAGES.reduce((n, s) => n + s.files.length, 0);
  let done = 0;

  const fill = document.getElementById('boot-fill');
  const label = document.getElementById('boot-label');
  function setProgress(stageLabel, ratio) {
    if (fill) fill.style.width = Math.round((done / TOTAL) * 100) + '%';
    if (label) label.textContent = stageLabel + (ratio !== undefined ? ' … ' + Math.round(ratio * 100) + '%' : ' …');
  }
  // 阶段间节奏停顿：必须用 setTimeout——后台标签页的 rAF 会被浏览器暂停，
  // 用 rAF 会卡死加载流程（真实事故：切走标签页后加载永远停在第一阶段）
  const nextFrame = () => new Promise(res => setTimeout(res, 90));

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const el = document.createElement('script');
      el.src = src;
      el.onload = () => resolve(src);
      el.onerror = () => reject(new Error('资源加载失败: ' + src));
      document.head.appendChild(el);
    });
  }

  async function run() {
    try {
      window.GameData = window.GameData || { modules: {} };   // 数据命名空间，供各模块注册
      for (const stage of STAGES) {
        setProgress(stage.label);
        for (const f of stage.files) {
          await loadScript(f);
          done += 1;
          if (f.includes('assemble')) window.GameData.assemble();   // 数据装配：暴露引擎全局
        }
        await nextFrame();               // 让进度条渲染出来，节奏可见
      }
      setProgress('完成');
      await new Promise(res => setTimeout(res, 260));
      const overlay = document.getElementById('boot');
      if (overlay) overlay.classList.add('hidden');
      if (typeof window.BootUI === 'function') window.BootUI();
      else throw new Error('BootUI 未定义（ui.js 加载异常）');
    } catch (err) {
      if (label) { label.textContent = '加载失败：' + err.message; label.style.color = '#e05338'; }
      console.error(err);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
