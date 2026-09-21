/* =========================================================================
 * i18n-en-landing：landing/index.html 的英文词典（静态 data-i18n 扫描用）。
 * 仅由 landing 页加载（../js/ui/i18n-en-landing.js），游戏本体不需要。
 * 键 = landing 页原文（与 HTML 属性逐字节一致，含全角标点），值 = EN 文案。
 * ========================================================================= */
(function () {
  'use strict';
  I18N.add({
    '钢铁欧陆 1939 · IRON EUROPE 1939-1945 — 六边形回合制二战战棋':
      'IRON EUROPE 1939-1945 · Steel Continent 1939 — Hex-Grid WWII Wargame',
    /* ---- nav ---- */
    '页面导航': 'Page navigation',
    '战场': 'Theater',
    '兵种': 'Arms',
    '海战': 'Naval war',
    '将领': 'Generals',
    '阵营': 'Sides',
    '战史': 'Timeline',
    '开战': 'Play',
    /* ---- hero ---- */
    '六边形回合制二战战棋': 'A hex-grid turn-based WWII wargame',
    '改写 1939–1945 的欧洲命运': 'rewrite the fate of Europe, 1939–1945',
    '占领敌方首都，令其全国崩溃。': 'Take an enemy capital, and the whole nation collapses.',
    '免费开战 · PLAY FREE': 'PLAY FREE',
    '检阅战场': 'Inspect the battlefield',
    /* ---- hero stats（.e 英文点缀在 EN 模式由 CSS 隐藏）---- */
    '六边形战区': 'Hex battlefield',
    '城市与港口': 'Cities and ports',
    '国家政权': 'Nations',
    '开局舰艇': 'Starting warships',
    '史实将领': 'Historic generals',
    '历史事件脚本': 'Historic events',
    /* ---- 01 map：lede 与 facts（含 <b>/<br>，走 data-i18n-html）---- */
    '128×112 六边形，每格约 45 公里，兰伯特等角圆锥投影。': '128×112 hexes, roughly 45 km apart, using a Lambert conformal conic projection.',
    '128×112 六边形，每格约 45 公里，兰伯特等角圆锥投影。<br>海岸河流来自 Natural Earth，<b>国界定格在 1939 年 8 月 31 日——开战前夜</b>。':
      '128×112 hexes at ~45 km each, in Lambert conformal conic projection.<br>Coastlines and rivers come from Natural Earth; <b>borders frozen on 31 August 1939 — the eve of war</b>.',
    '每格约 <b>45 公里</b>，兰伯特等角圆锥投影。距离即战略：一格的得失，就是一个师的行军日。':
      'Each hex spans <b>~45 km</b> in Lambert conformal conic projection. Distance is strategy: holding or losing one hex equals a march day of one division.',
    '海岸线、湖泊、河流源自 Natural Earth 公共数据；国界是<b>开战前夕的历史快照</b>——但泽自由市、波希米亚-摩拉维亚保护国、意占阿尔巴尼亚，原样呈现。':
      'Coastlines, lakes and rivers come from Natural Earth public-domain data; borders are a <b>historical snapshot of the eve of war</b> — the Free City of Danzig, the Protectorate of Bohemia-Moravia, Italian-occupied Albania, shown as they were.',
    '436 座城市 / 港口 / 基地<b>全部独立可占领</b>，位置经穷举对照验证，最大偏移约 41 公里。':
      '436 cities / ports / bases, <b>each independently capturable</b>; positions exhaustively cross-checked, maximum offset ≈ 41 km.',
    '彼列科普地峡、刻赤海峡、厄勒海峡、多佛尔、基尔运河——<b>真实水道塑造真实战略</b>。英国没有虚构的陆桥。':
      'Perekop Isthmus, Kerch Strait, Øresund, Dover, Kiel Canal — <b>real waterways shape real strategy</b>. Britain has no fictional land bridge.',
    '历史版本截图': 'Screenshot from an earlier build',
    '开始界面 · 阵营与难度': 'Start screen · factions and difficulty',
    '柏林 · 最大缩放': 'Berlin · max zoom',
    '选中部队 · III号坦克': 'Selected unit · Panzer III',
    /* ---- 02 arms ---- */
    '步兵、炮兵、装甲、空军——<b>多类装备，各有分工</b>。<br>山地固守、装甲突穿、炮兵覆盖、空军越顶，胜负全在你的排兵布阵。':
      'Infantry, artillery, armour, air — <b>many equipment classes, each with its own role</b>.<br>Hold the mountains, punch through with armour, blanket with artillery, strike over the top — victory lies in your deployment.',
    '当前陆空军类别与生产方式': 'Current land and air unit classes and where they are built',
    '类别': 'Class',
    '分支': 'Branch',
    '组建地点': 'Built at',
    '作战定位': 'Role',
    '步兵': 'Infantry',
    '11类': '11 types',
    '城市': 'City',
    '占领与守备': 'Capture and garrison',
    '炮兵': 'Artillery',
    '5类': '5 types',
    '工厂': 'Factory',
    '火力／防空／反坦克': 'Firepower / AA / anti-tank',
    '装甲': 'Armour',
    '突击与机动': 'Breakthrough and mobility',
    '空军': 'Air',
    '7类': '7 types',
    '机场': 'Airfield',
    '制空／轰炸／运输': 'Air superiority / bombing / airlift',
    '实际战斗修正按当前装备类别与目标计算': 'Combat modifiers are computed from the current equipment class and target',
    '控制区': 'Zones of Control',
    '空军与具有忽略控制区技能的将领可无视封锁，普通装甲仍受控制区影响。':
      'Air units and generals with the ignore-ZOC skill slip the lockdown; ordinary armour is still blocked by control zones.',
    '驻防工事': 'Entrenchment',
    '城市地形防御 +40%，首都 +60%；主动驻防另加30%。地形不是背景板，是武器。':
      'Urban terrain gives +40% defence, capitals +60%; garrisoning adds another 30%. Terrain is a weapon, not a backdrop.',
    '老练度': 'Veterancy',
    '部队越战越强，最高 +24% 攻防——老兵营值得守护。':
      'Units grow stronger as they fight, up to +24% attack and defence — veteran formations are worth protecting.',
    '将领技能': 'General Skills',
    '116 位史实名将各怀绝技，击杀晋升，最高五星。':
      '116 historic commanders each bring a signature skill; kills promote them, up to five stars.',
    '按 H 随时查阅': 'Press H anytime in game',
    /* ---- 03 navy ---- */
    '<b>91 艘采用舰名系统的开局军舰</b>组成欧洲战区的缩编舰队。<br>俾斯麦、胡德、贝尔法斯特、U-47——建造它们、指挥它们、击沉它们。':
      '<b>91 individually named starting warships</b> form the scaled-down fleets of the European theater.<br>Bismarck, Hood, Belfast, U-47 — build them, command them, sink them.',
    '八种舰型': 'Eight ship classes',
    '潜艇 SUBS': 'Submarines',
    '驱逐舰 DESTROYERS': 'Destroyers',
    '轻巡洋舰 LIGHT CRUISERS': 'Light cruisers',
    '重巡洋舰 HEAVY CRUISERS': 'Heavy cruisers',
    '战列巡洋舰 BATTLECRUISERS': 'Battlecruisers',
    '战列舰 BATTLESHIPS': 'Battleships',
    '护航航母 ESCORT CARRIERS': 'Escort carriers',
    '航空母舰 FLEET CARRIERS': 'Fleet carriers',
    '军港建造': 'Shipyard Building',
    '点击军港 ⚓ 造舰，泊位与城市易手实时联动；六国舰型逐年解锁：1939 德意志级 → 1941 俾斯麦级 → 1943 H 级计划。':
      'Click a naval port ⚓ to lay down ships; berths track city control in real time; six navies unlock hulls by year: 1939 Deutschland class → 1941 Bismarck class → 1943 Plan H.',
    '反潜博弈': 'ASW Warfare',
    '驱逐舰、潜艇、航母与具备攻击能力的陆基航空兵可打击潜艇——护航驱逐舰不是装饰品。':
      'Destroyers, submarines, carriers and land-based air with strike capability can all hunt submarines — escort destroyers are not decoration.',
    '舰炮岸轰': 'Shore Bombardment',
    '水面舰压制海岸守军，航母舰载机打击纵深；大舰巨炮重新有了意义。':
      'Surface ships suppress coastal defenders; carrier aircraft strike the deep — big-gun ships matter again.',
    '两栖登陆': 'Amphibious Assault',
    '运输船队载陆军跨海抢滩——1944 年的登陆日，可以由你重演，也可以让它不再发生。':
      'Transport convoys carry the army across the sea to storm the beach — replay the 1944 landings, or make sure they never happen.',
    '<b>考据彩蛋：</b>每艘开局军舰标注舰名来源——史实舰名 / 计划舰名 / 游戏拟名，分级呈现，绝不张冠李戴。AI与玩家共用造舰规则，难度设置会影响AI收入与战斗加成。':
      '<b>Nerd detail:</b> every starting warship shows its name origin — historic / planned / game-invented, graded and never misattributed. AI and players share the same shipbuilding rules; difficulty adjusts AI income and combat bonuses.',
    '德意志号 DEUTSCHLAND · ⚓ 军港': 'Panzerschiff Deutschland · ⚓ naval base',
    /* ---- 04 generals ---- */
    '116 位史实将领全部实装。按人物履历设计游戏技能——<b>完整数值与设计理由可供审阅</b>。':
      'All 116 historic generals are implemented, with skills designed from their real careers — <b>full stats and design rationale are open for review</b>.',
    '查看116位将领的完整审阅名录 →': 'Browse the full review catalog of all 116 generals →',
    '装甲攻 +25% · 移动力 +2 · 无视控制区': 'Armour attack +25% · movement +2 · ignores ZOC',
    '闪电战之父——「纵深穿插」这一技能，就是他本人。':
      'Father of the blitzkrieg — the deep-penetration skill is the man himself.',
    '装甲攻 +20% · 对炮兵 +40%': 'Armour attack +20% · +40% vs artillery',
    '第 7 装甲师「魔鬼之师」，席卷法军炮群的行家。':
      'The Ghost Division — 7th Panzer, expert at rolling up French gun lines.',
    '全体攻防 +20%': 'All units attack and defence +20%',
    '从诺门坎打到柏林的「胜利元帅」，均衡即全能。':
      'From Khalkhin Gol to Berlin: the Marshal of Victory. Balance is versatility.',
    '驻城防御 +50% · 反击系数 +30个百分点': 'Garrison defence +50% · counterattack +30 points',
    '斯大林格勒第 62 集团军——「贴身紧逼」的城市战之神。':
      'The 62nd Army at Stalingrad — the master of hugging tactics in urban war.',
    '防御 +25% · 反击系数 +30个百分点': 'Defence +25% · counterattack +30 points',
    '阿拉曼的先胜后战：不打好准备，一步也不动。':
      'El Alamein: win first, then fight — not one step without preparation.',
    '装甲攻 +30% · 移动力 +1': 'Armour attack +30% · movement +1',
    '第 3 集团军横扫西欧——油门踩到底。': 'Third Army across Western Europe — pedal to the metal.',
    '击杀 3 人晋升一星，<b>最高五星</b>，每星攻防 +4% —— 你的将领和你一起打完整场战争。':
      'Every 3 kills earn a star, <b>up to five</b>, +4% attack and defence per star — your generals fight the whole war at your side.',
    /* ---- 05 sides ---- */
    '三种完全不同的战争体验——<b>闪电猎手、困守待变、钢铁洪流</b>。换一个阵营，就是换一款游戏。':
      'Three completely different war experiences — <b>blitz hunter, stubborn defender, steel torrent</b>. Pick a different side and it is a different game.',
    '轴心国': 'Axis',
    '闪击波兰、横扫法国——<b>黄金窗口只有 21 个月</b>。装备与将领最精良，但 1941 年 6 月之后，你将同时面对三个方向。':
      'Blitz Poland, sweep France — <b>the golden window is only 21 months</b>. Finest equipment and generals, but after June 1941 you face three directions at once.',
    '适合：进攻型指挥官。': 'For: aggressive commanders.',
    '<b>将领</b><br>古德里安 · 隆美尔 · 曼施坦因<br>莫德尔 · 凯塞林':
      '<b>Generals</b><br>Guderian · Rommel · Manstein<br>Model · Kesselring',
    '同盟国': 'Allies',
    '守住马奇诺与伦敦，熬过最黑的两年——<b>等美国参战、等诺曼底翻盘</b>。防守反击的艺术。':
      'Hold the Maginot and London through the darkest two years — <b>wait for America, wait for the Normandy reversal</b>. The art of defence and counterattack.',
    '适合：耐心的战略家。': 'For: patient strategists.',
    '<b>将领</b><br>蒙哥马利 · 巴顿 · 戴高乐<br>艾森豪威尔 · 亚历山大':
      '<b>Generals</b><br>Montgomery · Patton · de Gaulle<br>Eisenhower · Alexander',
    '苏联': 'Soviet Union',
    '1941 年 6 月前和平备战；开战后<b>以空间换时间</b>，让俄罗斯的冬天替你作战，再用钢铁洪流攻克柏林。':
      'Rebuild in peace before June 1941; once war comes <b>trade space for time</b>, let the Russian winter fight for you, then take Berlin with the steel torrent.',
    '适合：大兵团作战爱好者。': 'For: admirers of grand-scale operations.',
    '<b>将领</b><br>朱可夫 · 罗科索夫斯基<br>科涅夫 · 崔可夫':
      '<b>Generals</b><br>Zhukov · Rokossovsky<br>Konev · Chuikov',
    '军校实习': 'Cadet',
    '前线指挥': 'Frontline',
    '标准': 'standard',
    '总参谋部': 'General Staff',
    'AI +12%，收入 +20%': 'AI +12%, income +20%',
    /* ---- 06 timeline ---- */
    '10 个历史事件脚本按月触发：<b>你读到的事件简报，就是当年将军们读到的战报</b>。复现历史，或者改写它。':
      'Ten historic event scripts fire month by month: <b>the briefing you read is the dispatch the generals read back then</b>. Replay history, or rewrite it.',
    '战争爆发': 'War breaks out',
    '国界定格于 8 月 31 日。从你的第一次移动开始，历史进入<b>你的版本</b>。':
      'Borders freeze on 31 August. From your first move, history enters <b>your version</b>.',
    '西线闪击战': 'Blitz in the West',
    '战报叙事——阿登森林不再是「不可穿越」，只要你的装甲敢走。':
      'Dispatch narrative — the Ardennes is impassable no longer, if your armour dares to march.',
    '意大利参战': 'Italy joins the war',
    '意大利领土与军队转入轴心，地中海战线开启。':
      'Italian territory and army pass to the Axis; the Mediterranean front opens.',
    '不列颠空战': 'Battle of Britain',
    '海峡上空的空权争夺——空军压制与海岸组合的实战课堂。':
      'The contest for air power over the Channel — a live lesson in combining air superiority with the coast.',
    '巴尔干加入轴心': 'The Balkans join the Axis',
    '匈牙利、罗马尼亚领土与军队转入轴心——南翼稳固，东进倒计时。':
      'Hungarian and Romanian territory and armies join the Axis — southern flank secure, countdown to the drive east.',
    '巴巴罗萨行动': 'Operation Barbarossa',
    '轴心-苏联开战，<b>苏联紧急动员 10 个师开赴西部边境</b>。史上最大的陆地攻势，在一张 128×112 的地图上展开。':
      'Axis and USSR go to war; <b>the Soviets emergency-mobilise 10 divisions to the western border</b>. The largest land offensive in history, on a 128×112 map.',
    '美国参战': 'America enters the war',
    '同盟国收入 <b>+40</b>，伦敦出现美军先头部队与美军装备——工业天平开始倾斜。':
      'Allied income <b>+40</b>; American spearheads and US equipment appear in London — the industrial balance begins to tip.',
    '斯大林格勒': 'Stalingrad',
    '战报叙事——城市战与崔可夫的高光时刻。':
      'Dispatch narrative — city fighting and the finest hour of Chuikov.',
    '库尔斯克': 'Kursk',
    '战报叙事——史上最大坦克会战，装甲克制的终极考卷。':
      'Dispatch narrative — the largest tank battle in history, the final exam in armour versus armour.',
    '诺曼底登陆': 'D-Day',
    '<b>最多 10 个盟军师在法国海岸抢滩</b>——两栖运输舰队此时就是你的生命线。':
      '<b>Up to 10 Allied divisions storm the French coast</b> — your amphibious transport fleet is the lifeline now.',
    '每年 12–2 月': 'Every Dec–Feb',
    '俄罗斯严冬': 'General Winter',
    '轴心国部队在苏联境内每月 <b>−12 兵力</b>，地图飘雪。拿破仑的教训，每年重放一遍。':
      'Axis forces inside the USSR lose <b>12 strength</b> each month as snow falls on the map. The lesson of Napoleon, replayed every year.',
    /* ---- 07 play ---- */
    '没有教程关。<b>左键点、拖动看、滚轮缩</b>，剩下的交给 H 键的帮助面板。':
      'No tutorial mission. <b>Left-click to select, drag to look, wheel to zoom</b> — the rest is in the H-key help panel.',
    '操作方式': 'Controls',
    '左键': 'LMB',
    '选择 / 攻击': 'Select / attack',
    '拖动': 'Drag',
    '平移地图': 'Pan the map',
    '滚轮': 'Wheel',
    '缩放': 'Zoom',
    '下一支部队': 'Next unit',
    '结束回合': 'End turn',
    '帮助': 'Help',
    '静音': 'Mute',
    '离线运行': 'Run offline',
    '# 免安装、零依赖，两条路任选': '# No install, zero dependencies — pick either route',
    '在线试玩': 'Play online',
    '本地离线': 'Offline clone',
    'git clone 后': 'after a git clone,',
    '双击 index.html': 'double-click index.html',
    '技术特性': 'Technical highlights',
    '零依赖 · 零构建': 'Zero dependencies, zero build',
    '纯原生 Canvas 渲染': 'Pure vanilla Canvas rendering',
    '离线可玩 · 单机': 'Playable offline, single-player',
    '自动存档 · 续玩': 'Autosave and resume',
    '共享规则 · 难度影响AI加成': 'Shared rules, difficulty tunes the AI',
    '政区 / 地形双渲染': 'Political / terrain dual rendering',
    '// 逻辑与表现完全分离': '// Logic and presentation fully separated',
    '不引用任何 DOM，可在 Node 里跑完整战役': 'touches no DOM and runs full campaigns in Node',
    '离屏缓存分层渲染': 'Layered offscreen-cache rendering',
    '地形缓存复用、动态单位视口剔除': 'cached terrain reused, off-screen units culled',
    '控制台可读实时帧率': 'live FPS readable from the console',
    /* ---- finale + footer ---- */
    '历史已经写好。<br><em>该写你的了。</em>': 'History is written.<br><em>Now write yours.</em>',
    'GitHub 仓库': 'GitHub repository',
    '<b>免责声明：</b>地图为战略概化表示，不代表对任何领土主权的立场。地理数据来自 Natural Earth（公有领域）；历史边界经 1939 年事件校订，定格于 1939-08-31。本作致敬《欧陆战争》《将军的荣耀》《世界征服者》系列。':
      '<b>Disclaimer:</b> the map is a strategic generalisation and takes no position on any territorial sovereignty. Geographic data from Natural Earth (public domain); historic borders checked against the events of 1939, frozen on 1939-08-31. A tribute to the European War, Glory of Generals and World Conqueror series.',
    '© 2026 钢铁欧陆 1939': '© 2026 IRON EUROPE 1939',
  });
})();
