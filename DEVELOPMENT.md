# 《钢铁欧陆 1939》开发文档（协作必读）

> 本文面向**后续开发者**，记录项目的架构、核心机制、开发工作流、已踩过的坑与待办方向。
> 用户向的玩法说明见 [README.md](README.md)。在线试玩：<https://saoker-liu.github.io/iron-europe-1939/>

---

## 1. 项目现状速览

| 项 | 状态 |
|---|---|
| 版本 | v1.0.0（已发布 Release，附离线 zip） |
| 技术 | 纯原生 HTML5 + Canvas + JavaScript，**零依赖、零构建** |
| 规模 | 约 2730 行代码（6 个源文件）；地图 114×65（0.5°/格）；77 城；125 初始单位 |
| 质量 | 无头测试套件全部通过；线上版本 0 报错；满帧运行 |
| 部署 | 推送 main 自动部署 GitHub Pages；推送 `v*` 标签自动创建 Release |

**能玩的完整闭环**：三阵营战役（轴心/同盟/苏联）、四季与冬季消耗、10 个历史事件、
兵种克制与反击、将领技能与晋升、中立国倒戈、首都崩溃机制、AI 三阵营互殴、
存档续玩、GitHub Pages 在线试玩、Release 自动打包。

---

## 2. 文件结构与职责（解耦架构 v2）

入口 `index.html` **只含页面骨架 + 启动进度层 + 一个 script 标签**（js/loader.js）。
数据按阶段解耦为独立文件，由 loader 顺序注入并驱动进度条：

```
iron-europe-1939/
├── index.html          入口骨架 + CSS + 启动进度条（不引用任何游戏逻辑）
├── js/
│   ├── loader.js       分阶段加载器：按序注入脚本并更新进度条，装配后调 window.BootUI()
│   ├── core/
│   │   ├── hex.js          六边形数学（环境无关）：HexMath.{SQ3,key,cubeOf,hexDist}
│   │   └── assemble.js     装配器：GameData.modules.* → 引擎所需扁平全局
│   ├── data/               ⑥ 个数据模块，各自独立、可单独替换/扩展：
│   │   ├── map.js          ① 陆海骨架 + 浅滩（**由 build_map.js --write 生成，勿手改**）
│   │   ├── terrain.js      ② 地形类型定义 + 主要河流 + 地形细节（GENERATED 区段自动更新）
│   │   ├── nations.js      ③ 26 国 + 77 城（坐标=真实经纬度）
│   │   ├── economy.js      ④a 城市收入表 + 开局资金 + 事件收入修正
│   │   ├── military.js     ④b 兵种/克制表/装备树/125 单位初始部署
│   │   ├── generals.js     ⑤ 16 将领（技能+生平）
│   │   ├── events.js       ⑥ 10 个历史事件脚本
│   │   └── load-node.js    Node 侧一次性装配（require 全部模块后调用 assemble）
│   ├── engine/
│   │   └── game.js         纯逻辑引擎（无 DOM）：移动/战斗/经济/AI/事件/胜负/存档
│   └── ui/
│       ├── unit-icons.js   兵种图标（矢量侧影，零外部资源）：步兵·炮兵·装甲·空军。
│       │                   同一份 SVG path 同时供 Canvas(Path2D) 与 DOM(<svg>) 使用。
│       │                   改图形前务必读该文件头部注释（环绕方向/描边方式两个坑）
│       └── ui.js           渲染与交互（地形缓存层/动态层/输入/面板/音效），
│                           导出 window.BootUI()，由 loader 在就绪后调用
├── tools/
│   └── icon-preview.html   兵种图标预览页（改完 unit-icons.js 双击自检：尺寸梯度/
│                           国家色对比度/放大破形）
├── build_map.js        地图生成器：`node build_map.js` 输出 MAP_ROWS（旧用途）；
│                       `node build_map.js --write` 直接更新 js/data/map.js + terrain.js 细节
├── test_logic.js       无头测试（经 js/data/load-node.js 装配数据）
└── .github/workflows/  Pages 自动部署 + Release 自动打包
```

**加载流水线**（loader.js 的 STAGES，也是进度条的阶段）：
六边形地图 → 地形与河流 → 国家与城市 → 经济与军事部署 → 将领与历史事件 → 装配 → 引擎 → 界面。

**数据注册约定**：每个 `js/data/*.js` 都以 IIFE 向 `GameData.modules.<名>` 挂载，
自身不依赖其它数据文件；跨模块引用（如城市收入合并）统一在 `core/assemble.js` 完成。
Node 侧通过 `require('js/data/load-node.js')` 得到同样的装配结果——**浏览器与 Node 走同一套 assemble**，
引擎代码零分支。改数据 = 改对应模块文件；改地图 = `node build_map.js --write`；
新增数据类别 = 新建 js/data/*.js + 在 loader STAGES 与 load-node.js 各加一行 + 在 assemble.js 定义如何合并。

**逻辑与表现严格分离**：`engine/game.js` 不引用任何 DOM，这是 `test_logic.js` 能在 Node 下跑完整战役的前提。改代码时请保持这一边界。

---

## 3. 地图与坐标系（最容易踩坑的部分）

### 3.1 坐标系与换算

- odd-r 偏移坐标的**尖顶六边形**：列 `0..113`，行 `0..64`
- 地理换算（0.5°/格）：`col = round(lon*2) + 24`（西经 12°→0，东经 44.5°→113）；`row = round((66.5-lat)*2)`（北纬 66.5°→0，北纬 34.5°→64）
- 像素：`hexToPix(c,r) = [S*√3*(c + 0.5*(r&1)) + cam.x, S*1.5*r + cam.y]`，其中 `S = 36 * cam.z`
- `pixToHex` 用标准立方坐标取整，与 `hexToPix`/`cubeOf` 严格互逆——**任何改动必须保持互逆**，否则点击/悬停全部错位

### 3.2 改地图的正确姿势

**不要手改 `data.js` 里的 `MAP_ROWS` 字符串**（114×65 手写必然出错）。流程：

1. 编辑 `build_map.js` 里的行规格 `R[]`（`s`=海岸线分段，`p`=地形补丁，列号为闭区间）
2. `node build_map.js > _m.txt`，用仓库历史里的内联脚本把生成的数组替换进 `data.js`
3. 跑 `node test_logic.js`

生成器内置断言（违反直接报错）：
- 每行必须 114 字符、字符合法
- **col 0–1（西经 12°~11°）必须是海**——历史上曾出现"幽灵大西洋陆地"导致布列塔尼/爱尔兰以西出现条状延伸（详见 §8）

城市放在 `data.js` 的 `CITIES`，坐标必须用上面的换算公式算（都按真实经纬度标注），城市格自动覆盖为 `'c'` 地形。

### 3.3 特殊格

`=` 是可通行海峡浅滩（多佛尔 / 博斯普鲁斯 / 墨西拿），让步兵可以徒步渡海。
它是"海岛与大陆的唯一连接"，删改前先想清楚：英国能否被进攻、瑞典是否孤立，全靠这几个格子。

---

## 4. 数据层（data.js）

| 表 | 内容 | 备注 |
|---|---|---|
| `TERRAIN`（terrain.js） | 地形：通行花费（按兵种）+ 防御加成 | `'c'` 城市格由 CITIES 自动覆盖 |
| `ATK_MOD` | 兵种克制表 `ATK_MOD[攻][守]` | 步 0.65×坦、坦 1.4×炮、炮/空打人无反击… |
| `COUNTRIES`（nations.js） | 26 国：颜色 + 阵营（axis/west/sov/neutral，其中中立国 19 个） | 匈牙利/罗马尼亚/意大利开局 neutral，由事件翻转 |
| `CITIES`（nations.js） | 77 城：坐标=真实经纬度，`cap` 首都；收入在 economy.js 按 key 合并 | **占领首都→全国易手**是核心战略机制 |
| `EQUIP`（military.js） | 装备树，`yr` 字段控制解锁年份 | `us:` 美国装备 1942 起仅在伦敦可招 |
| `GENERALS`（generals.js） | 16 将领：`skills[]` + 生平 | 技能类型见 `ui.js skillText` 的映射表 |
| `EVENTS`（events.js） | 历史事件：`t=触发回合` + `kind`（log/italy/axismin/barbarossa/usa/dday） | `turnOf(年,月)` 换算回合 |
| `INITIAL_UNITS`（military.js） | 初始部署 125 单位 | **勿占己方招募城市的格**（占格会锁招募） |

加新国家/城市/装备的惯例：`COUNTRIES` 加色 → `CITIES` 加城（坐标换算）→ 如需初始驻军加 `INITIAL_UNITS`。

---

## 5. 引擎核心（game.js）

### 5.1 关键函数速查

| 函数 | 职责 |
|---|---|
| `hexToPix / pixToHex / hexDist / cubeOf` | 六边形数学（见 §3.1） |
| `moveRange(u)` | Dijkstra 移动范围，含 ZOC（进入敌邻格即止；古德里安/巴顿/空军豁免）。返回 `{cost: Map, prev: Map}` |
| `targetsOf(u)` / `computeDamage(att,def,{preview})` | 可攻击目标 / 伤害结算。伤害 = `42×攻/(攻+防)`，攻方有兵力衰减 `0.55+0.45×HP%`，防守方吃地形/驻城加成 |
| `attack(att,def)` | 结算伤害+反击（近战且守方为步/装才反击；炮/空打人不受反击） |
| `captureCity` | 占城；**首都陷落→全国易手**；置 `terrDirty=true` |
| `moveUnit` | 移动+占城+**开进中立国领土即触发 `neutralDefect`**（倒向敌方） |
| `startTurnFor(f)` / `endTurn()` | 收入/医疗/行动权重置 → AI 回合 → 冬季消耗 → 事件 → 玩家回合开始 |
| `territoryOwner / homeCountryOf` | 领土查询，基于**多源 BFS 距离场**（`_terrField`，Int16Array），`terrDirty` 时 O(格数) 重建 |
| `distMapTo(cities)` | 多源 Dijkstra（二叉堆），AI 战略导航用 |
| `aiTurn(f)` / `bestTile` / `aiTryAttack` / `aiRecruit` | AI 分层：距离场导航 → 残血回城/占空城/驻防评分 → 期望伤害-反击代价选目标 → 按构成权重招募 |
| `serialize / deserialize` | JSON 存档（localStorage 单槽位，key `iron-europe-1939-save`） |

### 5.2 数值基线（改动请三思）

- 单位 HP 100；伤害 `42×A/(A+D)`——软杀伤曲线，攻击收益递减
- 老练度：XP 100/250/450 → 3 级，每级攻防 +8%；将领击杀 3 人升 1 星（≤5 星），每星 +4%
- 医疗：己方城市 +25/回合，己方领土 +12；驻防 +30% 防御（移动/攻击后解除）
- 冬季（12–2 月）：轴心国在苏联境内每月 -12 兵力
- 收入 = Σ城市 inc；同盟国 1941-12 后 +40（美国参战）

### 5.3 事件系统

`processEvents()` 按 `turn` 精确匹配触发。`kind` 决定效果：
`log` 纯叙事 / `italy` 意大利入轴 / `axismin` 匈罗入轴 / `barbarossa` 对苏宣战+动员10师 /
`usa` 美国参战（收入+40、伦敦出美军） / `dday` 诺曼底登陆（坐标在 `spawnSpots([],0,0,[...])` 硬编码）。
加新事件 = 在 `EVENTS` 加条目 + 在 `processEvents` 加 `kind` 分支（记得 `pendingEvents.push` 以弹窗）。

---

## 6. 渲染架构（ui.js）——性能的关键

### 6.1 分层

```
每帧：
  1. blitTerrain()            ← 地形缓存层，整帧只有这 1 次 drawImage
  2. 移动范围/攻击高亮          ← 批量单 Path2D
  3. 单位（视口剔除 + 低倍简化） ← 只有可见单位绘制
  4. 悬停框 / drawAnims
```

**terrainCache**（世界坐标离屏画布）：
- 内容：地形色 + 网格描边 + 领土染色 + 浅滩波纹 + 城市建筑/旗帜/名称
- 失效条件：`terrainKey(g)`（季节 + 全部城市属主拼接）变化 → **立即重建**（占领城市后旗帜立刻翻转）；仅缩放变化 → **防抖 140ms** 重建（缩放过程中用旧缓存拉伸，无闪动）
- 缓存分辨率上限 `cs = min(z, 0.69)`（约 12M 像素显存预算），z>0.69 时放大显示（平色地形几乎无损）

### 6.2 高 DPI（必须保持）

`resize()` 里 `cv.width = innerWidth * dpr`，`render()` 开头 `cx.setTransform(dpr,0,0,dpr,0,0)`。
**逻辑坐标一律用 CSS 像素（innerWidth/clientX）**。曾在 125%/150% 缩放屏上因漏乘 dpr 导致模糊+错位。

### 6.3 性能红线（回归事故记录，勿重蹈）

优化前单帧 29.7ms（4FPS），优化后 **0.65ms**。三条铁律：

1. **禁止每帧重建地形几何**——曾每帧为可见格重建 Path2D（全图构建 332ms），是 4FPS 卡顿的根源。任何新增的"画地图上的东西"都应进 `rebuildTerrain` 的缓存层，而不是 render 主循环
2. **主画布文本是贵操作**——CJK `strokeText/fillText` 很贵；低倍速（`simple = s < 11`）已自动省略单位小字，新增文字标记请放进同一分支。单位兵种现已改为**矢量图标**（`js/ui/unit-icons.js`），不再逐帧绘制中文，所以图标在低倍速下照常绘制（这正是替换的收益）。但图标描边必须用「`stroke` → `fill` 共用同一 transform」：**禁止把同一个 `Path2D` 换个 transform 再填一遍**来描边——实测会让 Chrome 无法复用光栅化缓存，从 6.6µs 暴涨到 62µs/单位。另：`lineJoin='round'` 下先 stroke 后 fill，线宽内半会被白色主体盖住，接缝也一并盖住，因此不会出现脏线。
3. **动态层做视口剔除**——单位/文字循环必须有 `hexToPix` 后的屏内判断

控制台 `window.__fps` 可看实时帧率。

---

## 7. UI 交互约定

- 左键：选部队 / 攻红框敌军（自动接敌）/ 点空城招募；拖拽平移；滚轮缩放（0.18–2.2）
- 快捷键：`N` 下一部队 · `E/回车` 结束回合 · `G` 将领 · `H` 帮助 · `M` 静音 · `Esc/右键` 取消
- 面板均为 `#panel`/`#modal-root` 的 DOM，`updatePanel()` 按选中状态重写 innerHTML
- 音效是 WebAudio 合成（`SFX` 模块），无音频文件；`M` 键切换不持久化（已知待办）

---

## 8. 已修复的重要 bug（历史档案，防止复发）

| # | 症状 | 根源 | 修复/守护 |
|---|---|---|---|
| 1 | 4FPS 严重卡顿 | 每帧重建地形 Path2D + 每帧城市/单位 CJK 描边文本 | 离屏缓存分层（§6.1），29.7ms → 0.65ms/帧 |
| 2 | 城市建筑/网格相对单位整体错位 (+18,+22)px | `blitTerrain` 把缓存原点（缓存px单位）误乘 z（世界px单位），偏移 = 72×z×(1-cs) | `wx/wy` 恒存世界坐标 `-72`；setTransform 平移用 `2*s2` |
| 3 | 单位兵种字偏右半个字宽 (+6px) | Canvas `textAlign` 默认 `'start'`；旧代码靠城市循环**泄漏**的 `'center'` 碰巧居中，重构后失效 | 单位文字显式 `cx.textAlign = 'center'`，不依赖隐式状态 |
| 4 | 布列塔尼/爱尔兰以西出现条状陆地延伸 | build_map 规格里 r16-r30、r37、r41 的首段把大西洋写成陆地 | 逐行修正 + 生成器断言"col 0-1 必须是海" |
| 5 | 高分屏模糊/比例错 | canvas 未乘 devicePixelRatio | resize 用 dpr，render 用 setTransform，逻辑坐标保持 CSS px |
| 6 | AI 第二回合起全体挂机 | 回合切换未重置 `moved/attacked` 标记 | `startTurnFor` 里重置（第一版事故） |
| 7 | 单位落海/叠格 | 手写初始部署坐标 | test_logic 断言：单位必须在陆上、同格唯一 |
| 8 | 发布 401/Bad credentials | 机器里存的是他人/过期凭据 | 见 §9：本机 SSH 公钥已注册到 GitHub（Huan18-windows） |
| 9 | 步兵躯干上出现一条透明裂口（图标"破形"） | 非零填充规则下，手写子路径的顺逆时针方向不一致，重叠处互相抵消（挖洞） | `unit-icons.js` 的 `normalizeWinding()` 统一方向；`tools/icon-preview.html` 的「纯色填充」视图专门用于自查破形 |
| 10 | 图标描边导致帧耗时暴涨（实测 62µs/单位） | 同一个 `Path2D` 先用 scale(1.12) 填一层做描边 → 换了 transform，光栅化缓存失效 | 改为 `stroke` + `fill` 共用同一 transform（6.6µs/单位），见 §6.3 铁律 2 |

---

## 9. 开发与部署工作流

### 9.1 本地开发

```bash
cd iron-europe-1939
node -e "...静态服务器..."   # 或 python -m http.server 8631；浏览器开 http://127.0.0.1:8631
node test_logic.js          # 提交前必跑（约 5-10 秒）
```

注意：**双击 index.html（file://）也能玩**，但自动化测试工具无法访问 file:，开发时建议起本地服务器。
`localStorage` 存档与域名绑定，换端口/域名存档不互通。

### 9.2 测试覆盖点（test_logic.js）

- 数据：MAP_ROWS 行宽、城市/初始单位在陆上且不叠格、大陆连通（白名单：都柏林、贝尔法斯特为真实孤岛）、大西洋西缘无陆地
- 机制：移动范围与 ZOC、将领加成、攻击结算、招募扣费、存档往返一致
- 模拟：3 阵营各 80 回合——单位不出海、不叠格、金币非负、事件按月触发

### 9.3 部署与发布（全自动）

| 操作 | 命令 | 效果 |
|---|---|---|
| 上线新版本 | `git push`（main） | Actions 自动部署 Pages，约 1-2 分钟后生效 |
| 发新版本 | `git tag v1.x.0 && git push origin v1.x.0` | Actions 自动打 zip 并创建 Release |

Pages 的一次性启用（Source = GitHub Actions）**已由人工完成**；若新建仓库，需在
`Settings → Pages → Source` 切换一次，否则 `configure-pages` 步骤会因 GITHUB_TOKEN 无权首次启用而失败（Known limitation）。

### 9.4 调试技巧

- 控制台：`window.__fps` 帧率；`UI.game` 引擎实例可完全操控；`UI.cam` 相机；`render(performance.now())` 手动渲染一帧
- 画布像素回读（`getImageData`）是对齐/渲染问题的最终裁判——本项目的错位与字形偏移都是靠它定位的
- 测量帧耗时请用同步循环调用 `render()`（IAB/后台页 rAF 会被节流，rAF 计数不可信）
- **改兵种图标**：双击 `tools/icon-preview.html` 自检——①尺寸梯度看是否耐缩 ②最亮国家色上看对比度 ③「纯色填充」视图看是否破形
- **微基准的坑**：把多个绘制变体塞进同一页顺序跑，测出来的数会被"实现切换导致的光栅化缓存失效"污染（同一份代码同页测到 111µs、单独进程测到 7.7µs）。比较两种实现时要**每个变体跑一个全新的浏览器进程**，并在同一进程内取多轮最优值——同一进程内的"旧 vs 新"比值才可信
- 本地联调服务器：后台进程可能随会话结束被回收，端口 8631 探活失败就重启（脚本见 §9.1）

---

## 10. 已知问题与技术债（欢迎认领）

1. **海军缺失**：无水面舰艇与登陆战。英国与大陆仅靠多佛尔浅滩连接；盟军无法对挪威/北非实施登陆（威悉演习、火炬行动无法复现）。可行方向：新增 `navy` 兵种或"运输点"机制
2. **AI 不会主动进攻中立国**：苏联 AI 不会复现波罗的海/冬季战争（玩家可以）；轴心 AI 不主动打丹麦外的北欧。可在 `aiTurn` 增加对弱邻的宣战评估
3. **平衡性**：AI 互殴时轴心通常在 1942-1944 占优但最终力竭；玩家挂机必败属预期。数值表（`EQUIP`/`CITIES.inc`/初始兵力）欢迎做系统的平衡测试
4. **存档单槽位**：localStorage 仅一档，无导出/导入。可加多槽 + JSON 导入导出（`serialize()` 已是纯 JSON）
5. **触屏无 tooltip**（hover 依赖 mousemove）；移动端整体未适配
6. **音效开关不持久化**；无音量调节
7. **意大利参战前**其单位在场但不可控——设计如此，但 AI 轴心不会指挥它们
8. `debug_ai.js`、部分注释仍是开发期风格；可考虑引入 ESLint/Prettier 与真正的测试框架（vitest）托管 test_logic 的用例

---

## 11. 建议的后续方向（Roadmap 草案）

- **海军与登陆**（价值最高）：补齐北海-地中海海权博弈
- **多剧本**：1941 巴巴罗萨开局、1944 诺曼底开局（数据已支持按回合触发，只需换 `INITIAL_UNITS`/`CITIES` 起始属主）
- **联机/分享**：`serialize()` 是纯 JSON，做"生成对战码/粘贴续玩"成本很低
- **移动端**：触屏选择 + 底部操作条
- **数值自动化平衡**：用 `test_logic.js` 的模拟骨架跑蒙特卡洛胜率统计

---

## 12. 协作约定

- 分支：`main` 保护语义上的"可玩版本"，开发请开 `feature/*` 分支，PR 合入
- 提交信息用一句中文短语说明玩法/修复内容（现有历史即范例）
- 改 `MAP_ROWS`/坐标/城市/部署 → 必须附 `node test_logic.js` 通过的截图或输出
- 改渲染 → 用 `window.__fps` 对比前后帧率，并在高分屏（125%/150% 缩放）检查对齐
- 数值改动 → 跑一次三阵营 80 回合模拟，附上终局城市分布（模拟脚本会打印）

> 最后提醒：本项目所有"魔法数字"（42 伤害系数、0.69 缓存上限、140ms 防抖…）都在
> 上文有出处说明；调整任何一个之前，请先读完对应章节，理解它曾经炸过什么。
