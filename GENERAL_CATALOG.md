# 史实将领与技能审阅名录

当前共 **116 位**，覆盖 **15 国**；原有23位，新增93位。数据源为 `js/data/generals.js`，本文件由实际游戏数据生成，避免文档与技能数值分离。

## 设计与生效规则

- 人物均取自真实二战时期军政／军事指挥体系；选人参照二战策略游戏常见将领池，自行设计数值，不宣称与《钢铁雄心4》某一版本的名单或特质一一对应。
- “史实职务”描述人物履历；“设计理由”和所有技能数字都是游戏化方案，不是史实能力评分。相近作战经历可以共享技能组合，不为凑数虚构独特能力。
- 保留原23位的技能；新增将领通常2项，少数3项。多数攻防加成为10%～25%，光环5%～10%、最多取一个最强值，移动通常+1。
- 同一指挥官只能指派给一支部队；兵种限定技能仅对对应兵种生效，其它部队不获得该项加成。推荐兵种只是搭配建议，不额外限制指派。
- 山地／伞兵／游骑兵等特性来自单位本身，将领技能不凭空授予山地适应或伞降能力。对空加成也不会把普通步兵变成区域防空炮。
- 普通反击技能增加反击系数的百分点，不是最终反击伤害乘以1+百分比；防空拦截使用单独结算。攻击属性的百分比同样不等于最终伤害同比增加。
- 当前系统为陆空军将领；海军将领指派仍未开放。国家按游戏内服役／阵营归属编码处理，例如帕克、科宁厄姆在英国皇家空军栏内。
- 沿用现有机制：名单覆盖整个二战，而非严格1939年在任表；不新增解锁年份、死亡或退休事件。国家加入玩家阵营后，其将领进入可指派池。中立国将领并非开局全部可用。
- 新战役将92位将领部署到现有本国陆空军，保留24位待指派（含美国12位）；不额外生成部队、不增加经济费用。保留原有任命，新增部署优先匹配技能兵种和专长。旧存档不补发任命，原指派、空闲状态和击杀星级保留。

## 国家分布

| 国家 | 人数 |
|---|---:|
| 德国 | 20 |
| 苏联 | 20 |
| 英国 | 15 |
| 美国 | 12 |
| 法国 | 10 |
| 意大利 | 10 |
| 波兰 | 6 |
| 芬兰 | 5 |
| 罗马尼亚 | 4 |
| 匈牙利 | 3 |
| 希腊 | 3 |
| 挪威 | 2 |
| 荷兰 | 2 |
| 比利时 | 2 |
| 南斯拉夫 | 2 |

## 新战役开局任命

仅新战役生效。中立国将领随本国部队部署，不改变国家阵营；美国开局没有可用陆空军，12位将领全部待命。以下地点为初始所在城市或最近城市。

| 国家 | 将领 | 开局部队 | 位置／待命原因 |
|---|---|---|---|
| 德国 | 古德里安 | III号坦克 | 斯德丁附近（59, 57） |
| 德国 | 隆美尔 | III号坦克 | 布雷斯劳附近（59, 63） |
| 德国 | 曼施坦因 | 105mm leFH18 榴弹炮 | 布雷斯劳附近（61, 60） |
| 德国 | 莫德尔 | 1939型普通步兵师 | 萨尔布吕肯附近（46, 66） |
| 德国 | 凯塞林 | Ju 87 B 斯图卡 | 布雷斯劳附近（61, 63） |
| 德国 | 龙德施泰特 | 1939型普通步兵师 | 梅梅尔附近（68, 50） |
| 苏联 | 朱可夫 | T-34/76 坦克 | 莫吉廖夫附近（80, 54） |
| 苏联 | 罗科索夫斯基 | T-34/76 坦克 | 戈梅利附近（80, 57） |
| 苏联 | 科涅夫 | 76mm ZiS-3 加农炮 | 日托米尔附近（79, 62） |
| 苏联 | 崔可夫 | 1939型近卫军师 | 巴统附近（106, 81） |
| 苏联 | 卡图科夫 | T-34/76 坦克 | 莫吉廖夫附近（82, 54） |
| 苏联 | 戈沃罗夫 | 76mm ZiS-3 加农炮 | 基辅附近（84, 62） |
| 英国 | 蒙哥马利 | 玛蒂尔达 II 步兵坦克 | 伦敦附近（37, 58） |
| 美国 | 巴顿 | 待指派 | 开局无适配的本国陆空军 |
| 法国 | 戴高乐 | 索玛 S35 坦克 | 巴黎附近（39, 67） |
| 美国 | 艾森豪威尔 | 待指派 | 开局无适配的本国陆空军 |
| 英国 | 亚历山大 | 英联邦步兵师 | 伦敦附近（35, 57） |
| 美国 | 布莱德雷 | 待指派 | 开局无适配的本国陆空军 |
| 法国 | 勒克莱尔 | 索玛 S35 坦克 | 奥尔良附近（36, 67） |
| 英国 | 特德 | 飓风 Mk I | 伦敦附近（36, 58） |
| 意大利 | 梅塞 | M13/40 中型坦克 | 维罗纳附近（50, 78） |
| 意大利 | 巴尔博 | C.200 雷电 | 罗马附近（53, 88） |
| 波兰 | 博尔-科莫罗夫斯基 | 待指派 | 预备将领 |
| 德国 | 博克 | 国防军步兵师 | 斯图加特附近（47, 67） |
| 德国 | 勒布 | 1939型普通步兵师 | 弗伦斯堡附近（51, 52） |
| 德国 | 克鲁格 | 国防军步兵师 | 斯图加特附近（50, 68） |
| 德国 | 克莱斯特 | III号坦克 | 布雷斯劳附近（63, 62） |
| 德国 | 霍特 | III号坦克 | 布雷斯劳附近（64, 64） |
| 德国 | 霍普纳 | 1939型轻型坦克 | 科隆附近（47, 62） |
| 德国 | 海因里希 | 国防军步兵师 | 科隆附近（45, 63） |
| 德国 | 施图登特 | 国防军步兵师 | 科隆附近（46, 63） |
| 德国 | 迪特尔 | 1939型山地步兵师 | 因斯布鲁克附近（51, 73） |
| 德国 | 林格尔 | 待指派 | 预备将领 |
| 德国 | 巴尔克 | 1939型中型坦克 | 维也纳附近（59, 71） |
| 德国 | 曼陀菲尔 | 待指派 | 预备将领 |
| 德国 | 里希特霍芬 | He 111 H | 柏林附近（56, 59） |
| 德国 | 施佩勒 | 待指派 | 预备将领 |
| 苏联 | 华西列夫斯基 | 步兵师 | 基辅附近（82, 64） |
| 苏联 | 瓦图京 | 步兵师 | 列宁格勒附近（80, 37） |
| 苏联 | 铁木辛哥 | 步兵师 | 列宁格勒附近（79, 37） |
| 苏联 | 马利诺夫斯基 | 步兵师 | 基辅附近（84, 64） |
| 苏联 | 托尔布欣 | 步兵师 | 列宁格勒附近（77, 39） |
| 苏联 | 梅列茨科夫 | 步兵师 | 明斯克附近（76, 55） |
| 苏联 | 巴格拉米扬 | 步兵师 | 明斯克附近（77, 55） |
| 苏联 | 切尔尼亚霍夫斯基 | 1939型轻型坦克 | 高尔基附近（98, 41） |
| 苏联 | 雷巴尔科 | 1939型T-34坦克 | 辛菲罗波尔附近（91, 77） |
| 苏联 | 罗特米斯特罗夫 | 待指派 | 预备将领 |
| 苏联 | 列柳申科 | 待指派 | 预备将领 |
| 苏联 | 诺维科夫 | I-16 | 莫斯科附近（90, 46） |
| 苏联 | 韦尔希宁 | I-16 | 莫斯科附近（90, 46） |
| 苏联 | 戈洛瓦诺夫 | 待指派 | 预备将领 |
| 英国 | 艾伦布鲁克 | 25磅野战炮 | 伦敦附近（35, 59） |
| 英国 | 韦维尔 | 英联邦步兵师 | 伦敦附近（36, 59） |
| 英国 | 奥金莱克 | 英联邦步兵师 | 格拉斯哥附近（34, 44） |
| 英国 | 斯利姆 | 英联邦步兵师 | 曼彻斯特附近（34, 52） |
| 英国 | 登普西 | 待指派 | 预备将领 |
| 英国 | 霍罗克斯 | 1939型轻型坦克 | 利兹附近（35, 51） |
| 英国 | 奥康纳 | 英联邦步兵师 | 伯明翰附近（35, 54） |
| 英国 | 戈特 | 英联邦步兵师 | 格拉斯哥附近（33, 45） |
| 英国 | 道丁 | 飓风 Mk I | 伦敦附近（36, 58） |
| 英国 | 帕克 | 飓风 Mk I | 伦敦附近（36, 58） |
| 英国 | 哈里斯 | 惠灵顿 Mk I | 伯明翰附近（34, 54） |
| 英国 | 科宁厄姆 | 待指派 | 预备将领 |
| 美国 | 马歇尔 | 待指派 | 开局无适配的本国陆空军 |
| 美国 | 克拉克 | 待指派 | 开局无适配的本国陆空军 |
| 美国 | 德弗斯 | 待指派 | 开局无适配的本国陆空军 |
| 美国 | 霍奇斯 | 待指派 | 开局无适配的本国陆空军 |
| 美国 | 辛普森 | 待指派 | 开局无适配的本国陆空军 |
| 美国 | 帕奇 | 待指派 | 开局无适配的本国陆空军 |
| 美国 | 李奇微 | 待指派 | 开局无适配的本国陆空军 |
| 美国 | 加文 | 待指派 | 开局无适配的本国陆空军 |
| 美国 | 斯帕茨 | 待指派 | 开局无适配的本国陆空军 |
| 法国 | 德·拉特尔 | 法国步兵师 | 里尔附近（39, 61） |
| 法国 | 朱安 | 1939型山地猎兵师 | 格勒诺布尔附近（43, 78） |
| 法国 | 柯尼希 | 法国步兵师 | 里尔附近（40, 62） |
| 法国 | 拉尔米纳 | 待指派 | 预备将领 |
| 法国 | 甘末林 | 法国步兵师 | 色当附近（42, 64） |
| 法国 | 魏刚 | 1939型普通步兵师 | 斯特拉斯堡附近（46, 69） |
| 法国 | 安齐热 | 法国步兵师 | 亚眠附近（38, 62） |
| 法国 | 维耶曼 | MS.406 | 巴黎附近（38, 66） |
| 意大利 | 巴多格里奥 | 75mm 山地炮 | 罗马附近（53, 87） |
| 意大利 | 格拉齐亚尼 | 意大利步兵师 | 罗马附近（53, 89） |
| 意大利 | 巴斯蒂科 | 意大利步兵师 | 那不勒斯附近（57, 92） |
| 意大利 | 加里博尔迪 | 意大利步兵师 | 佩斯卡拉附近（55, 88） |
| 意大利 | 罗阿塔 | 意大利步兵师 | 米兰附近（47, 78） |
| 意大利 | 安布罗西奥 | 待指派 | 预备将领 |
| 意大利 | 甘巴拉 | 意大利步兵师 | 都灵附近（44, 78） |
| 意大利 | 福吉耶 | C.200 雷电 | 罗马附近（53, 88） |
| 波兰 | 西科尔斯基 | 波兰步兵师 | 格丁尼亚附近（63, 54） |
| 波兰 | 安德斯 | 1939型山地步兵师 | 塔尔诺波尔附近（73, 71） |
| 波兰 | 马切克 | 7TP 轻型坦克 | 华沙附近（67, 59） |
| 波兰 | 索萨博夫斯基 | 波兰步兵师 | 比得哥什附近（63, 56） |
| 波兰 | 库特谢巴 | 波兰步兵师 | 波兹南附近（61, 58） |
| 芬兰 | 曼纳海姆 | 1939型普通步兵师 | 罗瓦涅米附近（73, 10） |
| 芬兰 | 西拉斯沃 | 老式步兵师 | 赫尔辛基附近（73, 36） |
| 芬兰 | 塔尔韦拉 | 1939型普通步兵师 | 罗瓦涅米附近（71, 9） |
| 芬兰 | 海因里希斯 | 1939型普通步兵师 | 罗瓦涅米附近（75, 9） |
| 芬兰 | 艾罗 | 待指派 | 预备将领 |
| 罗马尼亚 | 杜米特雷斯库 | 老式步兵师 | 布加勒斯特附近（77, 82） |
| 罗马尼亚 | 阿夫拉梅斯库 | 1939型山地步兵师 | 苏恰瓦附近（74, 71） |
| 罗马尼亚 | 达斯卡列斯库 | 1939型普通步兵师 | 苏恰瓦附近（74, 69） |
| 罗马尼亚 | 丘佩尔卡 | 1939型普通步兵师 | 苏恰瓦附近（76, 69） |
| 匈牙利 | 松博特海伊 | 1939型普通步兵师 | 乌日霍罗德附近（70, 68） |
| 匈牙利 | 雅尼 | 老式步兵师 | 布达佩斯附近（64, 74） |
| 匈牙利 | 米克洛什 | 1939型轻型坦克 | 布达佩斯附近（66, 72） |
| 希腊 | 帕帕戈斯 | 老式步兵师 | 雅典附近（73, 101） |
| 希腊 | 皮齐卡斯 | 老式步兵师 | 拉里萨附近（72, 94） |
| 希腊 | 卡齐米特罗斯 | 1939型卫戍部队 | 雅典附近（75, 100） |
| 挪威 | 鲁格 | 老式步兵师 | 奥斯陆附近（55, 38） |
| 挪威 | 弗莱舍 | 老式步兵师 | 卑尔根附近（49, 35） |
| 荷兰 | 温克尔曼 | 1939型普通步兵师 | 格罗宁根附近（46, 55） |
| 荷兰 | 赖因德斯 | 老式步兵师 | 阿姆斯特丹附近（45, 57） |
| 比利时 | 范奥弗斯特雷滕 | 老式步兵师 | 布鲁塞尔附近（42, 62） |
| 比利时 | 凯亚尔茨 | 老式步兵师 | 布鲁塞尔附近（42, 60） |
| 南斯拉夫 | 西莫维奇 | 基础型轻型战斗机 | 贝尔格莱德附近（67, 81） |
| 南斯拉夫 | 科查·波波维奇 | 老式步兵师 | 贝尔格莱德附近（66, 81） |

## 逐人审阅

每位的“人物资料”是便于继续核对的外文资料入口；本轮对代表人物及少数容易混淆的身份进行了联网核对，并非116人的档案级传记考证。职务只列代表性任职，不表示该职务贯穿整个战争。

### 德国

| 姓名／ID | 代表性史实职务 | 建议兵种 | 游戏技能 | 设计理由 | 资料入口 |
|---|---|---|---|---|---|
| 古德里安<br>Heinz Guderian<br>`guderian` | 装甲集群及装甲集团军指挥官 | 装甲 | 装甲攻击+25%；装甲移动力+2；忽略敌方控制区 | 装甲突破的核心将领，以移动和忽略控制区体现纵深穿插。 | [人物资料](https://en.wikipedia.org/wiki/Heinz_Guderian) |
| 隆美尔<br>Erwin Rommel<br>`rommel` | 非洲军及集团军群指挥官 | 装甲 | 装甲攻击+20%；对炮兵有效攻击+40%；兵力低于50%时攻击+15% | 装甲突击、压制炮兵与低兵力反击定位。 | [人物资料](https://en.wikipedia.org/wiki/Erwin_Rommel) |
| 曼施坦因<br>Erich von Manstein<br>`manstein` | 集团军与集团军群指挥官 | 炮兵 | 炮兵攻击+25%；陆上射程+1 | 沿用炮兵策划型模板；射程加成为游戏抽象，不表示其仅指挥炮兵。 | [人物资料](https://en.wikipedia.org/wiki/Erich_von_Manstein) |
| 莫德尔<br>Walter Model<br>`model` | 集团军群指挥官 | 陆军通用 | 所指挥部队防御+30%；驻城防御+40% | 防御与危机处置定位，专长城市坚守。 | [人物资料](https://en.wikipedia.org/wiki/Walter_Model) |
| 凯塞林<br>Albert Kesselring<br>`kesselring` | 航空队及战区指挥官 | 空军 | 空军攻击+25%；空军防御+30% | 以空军攻防增强体现航空背景。 | [人物资料](https://en.wikipedia.org/wiki/Albert_Kesselring) |
| 龙德施泰特<br>Gerd von Rundstedt<br>`rundstedt` | 西线总司令、集团军群指挥官 | 陆军通用 | 所指挥部队防御+20%；驻城防御+25% | 稳健防御型，低于莫德尔的专精防守强度。 | [人物资料](https://en.wikipedia.org/wiki/Gerd_von_Rundstedt) |
| 博克<br>Fedor von Bock<br>`bock` | 集团军群指挥官 | 陆军通用 | 所指挥部队攻击+15%；邻格友军攻击+8%（取最强） | 集团军群协同进攻，采用全兵种进攻与小幅光环。 | [人物资料](https://en.wikipedia.org/wiki/Fedor_von_Bock) |
| 勒布<br>Wilhelm Ritter von Leeb<br>`leeb` | 北方集团军群司令 | 陆军通用 | 所指挥部队防御+20%；驻城防御+25% | 防御理论与围城指挥，偏向阵地防守。 | [人物资料](https://en.wikipedia.org/wiki/Wilhelm_Ritter_von_Leeb) |
| 克鲁格<br>Günther von Kluge<br>`kluge` | 中央集团军群司令 | 陆军通用 | 所指挥部队防御+15%；普通反击系数+20个百分点 | 前线集团军群指挥，偏向稳守反击。 | [人物资料](https://en.wikipedia.org/wiki/G%C3%BCnther_von_Kluge) |
| 克莱斯特<br>Paul Ludwig Ewald von Kleist<br>`kleist` | 装甲集群指挥官 | 装甲 | 装甲攻击+20%；装甲移动力+1 | 装甲集群长距离推进，以突击和机动表现。 | [人物资料](https://en.wikipedia.org/wiki/Paul_Ludwig_Ewald_von_Kleist) |
| 霍特<br>Hermann Hoth<br>`hoth` | 装甲集团军司令 | 装甲 | 装甲攻击+20%；对装甲有效攻击+20% | 装甲会战与攻势指挥，侧重坦克交战。 | [人物资料](https://en.wikipedia.org/wiki/Hermann_Hoth) |
| 霍普纳<br>Erich Hoepner<br>`hoepner` | 第4装甲集群司令 | 装甲 | 装甲攻击+15%；装甲移动力+1；对炮兵有效攻击+15% | 快速装甲突破后威胁后方炮兵。 | [人物资料](https://en.wikipedia.org/wiki/Erich_Hoepner) |
| 海因里希<br>Gotthard Heinrici<br>`heinrici` | 维斯瓦集团军群司令 | 步兵 | 步兵防御+25%；普通反击系数+25个百分点 | 纵深阵地防守，以步兵防护与反击表现。 | [人物资料](https://en.wikipedia.org/wiki/Gotthard_Heinrici) |
| 施图登特<br>Kurt Student<br>`student` | 空降部队指挥官 | 伞兵 | 步兵攻击+20%；步兵移动力+1 | 空降作战组织者，建议指挥伞兵；技能不授予空降能力。 | [人物资料](https://en.wikipedia.org/wiki/Kurt_Student) |
| 迪特尔<br>Eduard Dietl<br>`dietl` | 山地部队指挥官 | 山地步兵 | 步兵防御+20%；步兵移动力+1 | 建议山地步兵，依靠兵种本身的地形适应。 | [人物资料](https://en.wikipedia.org/wiki/Eduard_Dietl) |
| 林格尔<br>Julius Ringel<br>`ringel` | 第5山地师师长 | 山地步兵 | 步兵攻击+15%；步兵防御+15% | 山地步兵攻防均衡，不虚构额外地形技能。 | [人物资料](https://en.wikipedia.org/wiki/Julius_Ringel) |
| 巴尔克<br>Hermann Balck<br>`balck` | 装甲师与集团军指挥官 | 装甲 | 装甲攻击+20%；普通反击系数+20个百分点 | 装甲机动反击，兼顾主动突击与防御反击。 | [人物资料](https://en.wikipedia.org/wiki/Hermann_Balck) |
| 曼陀菲尔<br>Hasso von Manteuffel<br>`manteuffel` | 第5装甲集团军司令 | 装甲 | 装甲攻击+20%；装甲移动力+1 | 装甲进攻与战役机动，保持在既有名将强度以内。 | [人物资料](https://en.wikipedia.org/wiki/Hasso_von_Manteuffel) |
| 里希特霍芬<br>Wolfram von Richthofen<br>`richthofen` | 航空队司令 | CAS／战术轰炸机 | 空军攻击+20%；对步兵有效攻击+20% | 战术航空支援，建议CAS或战术轰炸机。 | [人物资料](https://en.wikipedia.org/wiki/Wolfram_von_Richthofen) |
| 施佩勒<br>Hugo Sperrle<br>`sperrle` | 第3航空队司令 | 空军 | 空军攻击+15%；空军防御+15% | 航空队攻防组织，作为均衡空军指挥官。 | [人物资料](https://en.wikipedia.org/wiki/Hugo_Sperrle) |

### 苏联

| 姓名／ID | 代表性史实职务 | 建议兵种 | 游戏技能 | 设计理由 | 资料入口 |
|---|---|---|---|---|---|
| 朱可夫<br>Georgy Zhukov<br>`zhukov` | 方面军司令、最高统帅部代表 | 陆军通用 | 所指挥部队攻击+20%；所指挥部队防御+20% | 综合攻防型主力将领。 | [人物资料](https://en.wikipedia.org/wiki/Georgy_Zhukov) |
| 罗科索夫斯基<br>Konstantin Rokossovsky<br>`rokossovsky` | 方面军司令 | 装甲 | 装甲攻击+20%；装甲防御+15% | 装甲攻防兼备，强调作战组织。 | [人物资料](https://en.wikipedia.org/wiki/Konstantin_Rokossovsky) |
| 科涅夫<br>Ivan Konev<br>`konev` | 方面军司令 | 炮兵 | 炮兵攻击+25%；对步兵有效攻击+25% | 炮兵支援与打击步兵目标。 | [人物资料](https://en.wikipedia.org/wiki/Ivan_Konev) |
| 崔可夫<br>Vasily Chuikov<br>`chuikov` | 第62集团军及近卫第8集团军司令 | 步兵 | 驻城防御+50%；普通反击系数+30个百分点；步兵防御+20% | 城市战防御、步兵防护和近战反击。 | [人物资料](https://en.wikipedia.org/wiki/Vasily_Chuikov) |
| 卡图科夫<br>Mikhail Katukov<br>`katukov` | 近卫坦克第1集团军司令 | 装甲 | 装甲防御+20%；对装甲有效攻击+30% | 装甲防御与反坦克交战。 | [人物资料](https://en.wikipedia.org/wiki/Mikhail_Katukov) |
| 戈沃罗夫<br>Leonid Govorov<br>`govorov` | 列宁格勒方面军司令 | 炮兵 | 驻城防御+30%；炮兵攻击+20% | 围城战环境中的城防和炮兵火力。 | [人物资料](https://en.wikipedia.org/wiki/Leonid_Govorov) |
| 华西列夫斯基<br>Aleksandr Vasilevsky<br>`vasilevsky` | 总参谋长、方面军司令 | 陆军通用 | 所指挥部队攻击+15%；邻格友军攻击+10%（取最强） | 战役筹划与协同，光环偏重组织能力。 | [人物资料](https://en.wikipedia.org/wiki/Aleksandr_Vasilevsky) |
| 瓦图京<br>Nikolai Vatutin<br>`vatutin` | 乌克兰第1方面军司令 | 步兵／装甲 | 步兵攻击+20%；装甲攻击+15% | 步坦协同攻势，对两类兵种分别加成。 | [人物资料](https://en.wikipedia.org/wiki/Nikolai_Vatutin) |
| 铁木辛哥<br>Semyon Timoshenko<br>`timoshenko` | 方面军指挥官 | 步兵 | 步兵攻击+15%；所指挥部队防御+15% | 大兵团陆军指挥，偏向可靠步兵。 | [人物资料](https://en.wikipedia.org/wiki/Semyon_Timoshenko) |
| 马利诺夫斯基<br>Rodion Malinovsky<br>`malinovsky` | 乌克兰第2方面军司令 | 陆军通用 | 所指挥部队攻击+15%；所指挥部队防御+15% | 多兵种战役指挥，保持均衡。 | [人物资料](https://en.wikipedia.org/wiki/Rodion_Malinovsky) |
| 托尔布欣<br>Fyodor Tolbukhin<br>`tolbukhin` | 乌克兰第3方面军司令 | 炮兵／步兵 | 炮兵攻击+20%；步兵攻击+15% | 步炮协同与准备充分的进攻。 | [人物资料](https://en.wikipedia.org/wiki/Fyodor_Tolbukhin) |
| 梅列茨科夫<br>Kirill Meretskov<br>`meretskov` | 卡累利阿方面军司令 | 山地步兵／游骑兵 | 步兵攻击+15%；步兵移动力+1 | 北方战区进攻，建议山地或游骑兵部队。 | [人物资料](https://en.wikipedia.org/wiki/Kirill_Meretskov) |
| 巴格拉米扬<br>Ivan Bagramyan<br>`bagramyan` | 波罗的海第1方面军司令 | 步兵 | 所指挥部队攻击+15%；步兵移动力+1 | 战役突破后的步兵推进。 | [人物资料](https://en.wikipedia.org/wiki/Ivan_Bagramyan) |
| 切尔尼亚霍夫斯基<br>Ivan Chernyakhovsky<br>`cherniakhovsky` | 白俄罗斯第3方面军司令 | 装甲／步兵 | 装甲攻击+15%；步兵攻击+15%；装甲移动力+1 | 装甲出身与方面军协同进攻。 | [人物资料](https://en.wikipedia.org/wiki/Ivan_Chernyakhovsky) |
| 雷巴尔科<br>Pavel Rybalko<br>`rybalko` | 近卫坦克第3集团军司令 | 装甲 | 装甲攻击+25%；装甲移动力+1 | 装甲突破主力，侧重突击。 | [人物资料](https://en.wikipedia.org/wiki/Pavel_Rybalko) |
| 罗特米斯特罗夫<br>Pavel Rotmistrov<br>`rotmistrov` | 近卫坦克第5集团军司令 | 装甲 | 装甲攻击+15%；对装甲有效攻击+25% | 坦克会战定位，克制装甲目标。 | [人物资料](https://en.wikipedia.org/wiki/Pavel_Rotmistrov) |
| 列柳申科<br>Dmitry Lelyushenko<br>`lelyushenko` | 坦克第4集团军司令 | 装甲 | 装甲攻击+20%；普通反击系数+15个百分点 | 装甲攻势与反击作战。 | [人物资料](https://en.wikipedia.org/wiki/Dmitry_Lelyushenko) |
| 诺维科夫<br>Alexander Novikov<br>`novikov` | 苏联空军司令 | 空军 | 空军攻击+20%；邻格友军攻击+8%（取最强） | 航空作战统筹，机场附近协同支援。 | [人物资料](https://en.wikipedia.org/wiki/Alexander_Novikov) |
| 韦尔希宁<br>Konstantin Vershinin<br>`vershinin` | 航空第4集团军司令 | 空军 | 空军攻击+15%；空军防御+15% | 航空集团军攻防均衡。 | [人物资料](https://en.wikipedia.org/wiki/Konstantin_Vershinin) |
| 戈洛瓦诺夫<br>Alexander Golovanov<br>`golovanov` | 远程航空兵司令 | 战略轰炸机 | 空军攻击+20%；空军作战半径／转场距离+1 | 建议战略轰炸机，远程航空体现为航程加成。 | [人物资料](https://en.wikipedia.org/wiki/Alexander_Golovanov) |

### 英国

| 姓名／ID | 代表性史实职务 | 建议兵种 | 游戏技能 | 设计理由 | 资料入口 |
|---|---|---|---|---|---|
| 蒙哥马利<br>Bernard Montgomery<br>`montgomery` | 第8集团军及第21集团军群指挥官 | 步兵／防空炮 | 所指挥部队防御+25%；普通反击系数+30个百分点；对空军有效攻击+30% | 防守反击；对空技能在合法攻击或防空拦截中生效。 | [人物资料](https://en.wikipedia.org/wiki/Bernard_Montgomery) |
| 亚历山大<br>Harold Alexander, 1st Earl Alexander of Tunis<br>`alexander` | 地中海盟军地面部队指挥官 | 步兵 | 步兵攻击+15%；所指挥部队防御+15% | 步兵进攻与通用防御。 | [人物资料](https://en.wikipedia.org/wiki/Harold_Alexander,_1st_Earl_Alexander_of_Tunis) |
| 特德<br>Arthur Tedder, 1st Baron Tedder<br>`tedder` | 盟军远征军副最高司令 | 空军 | 空军攻击+20%；邻格友军攻击+10%（取最强） | 空军攻击与机场邻格支援。 | [人物资料](https://en.wikipedia.org/wiki/Arthur_Tedder,_1st_Baron_Tedder) |
| 艾伦布鲁克<br>Alan Brooke, 1st Viscount Alanbrooke<br>`alanbrooke` | 帝国总参谋长 | 陆军通用 | 所指挥部队防御+15%；邻格友军攻击+10%（取最强） | 战略协调与防御组织。 | [人物资料](https://en.wikipedia.org/wiki/Alan_Brooke,_1st_Viscount_Alanbrooke) |
| 韦维尔<br>Archibald Wavell, 1st Earl Wavell<br>`wavell` | 中东战区总司令 | 步兵 | 步兵攻击+15%；邻格友军攻击+8%（取最强） | 战区统筹与步兵攻势。 | [人物资料](https://en.wikipedia.org/wiki/Archibald_Wavell,_1st_Earl_Wavell) |
| 奥金莱克<br>Claude Auchinleck<br>`auchinleck` | 中东战区总司令 | 陆军通用 | 所指挥部队防御+20%；普通反击系数+20个百分点 | 防御战组织与反击。 | [人物资料](https://en.wikipedia.org/wiki/Claude_Auchinleck) |
| 斯利姆<br>William Slim, 1st Viscount Slim<br>`slim` | 第14集团军司令 | 步兵 | 步兵攻击+20%；步兵防御+20% | 步兵协同与持续作战；人物来自缅甸战区，作为可选将领。 | [人物资料](https://en.wikipedia.org/wiki/William_Slim,_1st_Viscount_Slim) |
| 登普西<br>Miles Dempsey<br>`dempsey` | 第2集团军司令 | 步兵／装甲 | 步兵攻击+15%；装甲攻击+15% | 西北欧战场步坦协同。 | [人物资料](https://en.wikipedia.org/wiki/Miles_Dempsey) |
| 霍罗克斯<br>Brian Horrocks<br>`horrocks` | 第30军军长 | 装甲 | 装甲攻击+15%；装甲移动力+1 | 机械化军团推进。 | [人物资料](https://en.wikipedia.org/wiki/Brian_Horrocks) |
| 奥康纳<br>Richard O'Connor<br>`oconnor` | 西部沙漠部队指挥官 | 装甲／步兵 | 装甲攻击+20%；步兵移动力+1 | 沙漠战机动与快速包围的抽象。 | [人物资料](https://en.wikipedia.org/wiki/Richard_O'Connor) |
| 戈特<br>John Vereker, 6th Viscount Gort<br>`gort` | 英国远征军司令 | 步兵 | 步兵防御+20%；普通反击系数+15个百分点 | 远征军防御与掩护作战。 | [人物资料](https://en.wikipedia.org/wiki/John_Vereker,_6th_Viscount_Gort) |
| 道丁<br>Hugh Dowding<br>`dowding` | 战斗机司令部司令 | 轻／重型战斗机 | 空军防御+25%；对空军有效攻击+20% | 建议战斗机，以防护与对空优势体现本土防空。 | [人物资料](https://en.wikipedia.org/wiki/Hugh_Dowding) |
| 帕克<br>Keith Park<br>`park` | 第11战斗机大队指挥官 | 轻／重型战斗机 | 空军攻击+15%；对空军有效攻击+25% | 建议战斗机，集中表现截击能力。 | [人物资料](https://en.wikipedia.org/wiki/Keith_Park) |
| 哈里斯<br>Sir Arthur Harris, 1st Baronet<br>`harris` | 轰炸机司令部司令 | 战略轰炸机 | 空军攻击+25%；空军作战半径／转场距离+1 | 建议战略轰炸机，远程轰炸定位。 | [人物资料](https://en.wikipedia.org/wiki/Sir_Arthur_Harris,_1st_Baronet) |
| 科宁厄姆<br>Arthur Coningham (RAF officer)<br>`coningham` | 战术航空指挥官 | CAS／战术轰炸机 | 空军攻击+20%；对装甲有效攻击+15% | 建议CAS或战术轰炸机，对装甲地面目标增益。 | [人物资料](https://en.wikipedia.org/wiki/Arthur_Coningham_%28RAF_officer%29) |

### 美国

| 姓名／ID | 代表性史实职务 | 建议兵种 | 游戏技能 | 设计理由 | 资料入口 |
|---|---|---|---|---|---|
| 巴顿<br>George S. Patton<br>`patton` | 第3集团军司令 | 装甲 | 装甲攻击+30%；装甲移动力+1 | 装甲攻势与机动；没有忽略控制区技能。 | [人物资料](https://en.wikipedia.org/wiki/George_S._Patton) |
| 艾森豪威尔<br>Dwight D. Eisenhower<br>`eisenhower` | 盟军远征军最高司令 | 陆军通用 | 邻格友军攻击+10%（取最强） | 联合作战统筹，使用邻格指挥光环。 | [人物资料](https://en.wikipedia.org/wiki/Dwight_D._Eisenhower) |
| 布莱德雷<br>Omar Bradley<br>`bradley` | 第12集团军群司令 | 步兵 | 步兵攻击+20%；步兵移动力+1 | 步兵协同推进。 | [人物资料](https://en.wikipedia.org/wiki/Omar_Bradley) |
| 马歇尔<br>George C. Marshall<br>`marshall` | 美国陆军参谋长 | 陆军通用 | 邻格友军攻击+10%（取最强）；所指挥部队防御+10% | 战略组织型将领，收益集中在周边协同。 | [人物资料](https://en.wikipedia.org/wiki/George_C._Marshall) |
| 克拉克<br>Mark W. Clark<br>`clark` | 第5集团军司令 | 步兵／炮兵 | 步兵攻击+15%；炮兵攻击+15% | 意大利战场步炮协同。 | [人物资料](https://en.wikipedia.org/wiki/Mark_W._Clark) |
| 德弗斯<br>Jacob L. Devers<br>`devers` | 第6集团军群司令 | 装甲 | 装甲攻击+15%；邻格友军攻击+8%（取最强） | 装甲背景与集团军群协调。 | [人物资料](https://en.wikipedia.org/wiki/Jacob_L._Devers) |
| 霍奇斯<br>Courtney Hodges<br>`hodges` | 第1集团军司令 | 步兵 | 步兵攻击+20%；步兵防御+15% | 步兵集团军持续推进。 | [人物资料](https://en.wikipedia.org/wiki/Courtney_Hodges) |
| 辛普森<br>William Hood Simpson<br>`simpson` | 第9集团军司令 | 步兵 | 步兵攻击+15%；邻格友军攻击+8%（取最强） | 集团军协同攻势。 | [人物资料](https://en.wikipedia.org/wiki/William_Hood_Simpson) |
| 帕奇<br>Alexander Patch<br>`patch` | 第7集团军司令 | 步兵 | 步兵攻击+15%；步兵移动力+1 | 登陆后的陆上推进，建议步兵或海军陆战队。 | [人物资料](https://en.wikipedia.org/wiki/Alexander_Patch) |
| 李奇微<br>Matthew Ridgway<br>`ridgway` | 第18空降军军长 | 伞兵 | 步兵攻击+20%；步兵防御+15% | 建议伞兵，强化着陆后的作战能力。 | [人物资料](https://en.wikipedia.org/wiki/Matthew_Ridgway) |
| 加文<br>James M. Gavin<br>`gavin` | 第82空降师师长 | 伞兵 | 步兵攻击+15%；步兵移动力+1 | 建议伞兵，强调落地后机动。 | [人物资料](https://en.wikipedia.org/wiki/James_M._Gavin) |
| 斯帕茨<br>Carl Spaatz<br>`spaatz` | 战略航空部队指挥官 | 战略轰炸机 | 空军攻击+20%；空军防御+15% | 建议战略轰炸机，兼顾任务火力与防护。 | [人物资料](https://en.wikipedia.org/wiki/Carl_Spaatz) |

### 法国

| 姓名／ID | 代表性史实职务 | 建议兵种 | 游戏技能 | 设计理由 | 资料入口 |
|---|---|---|---|---|---|
| 戴高乐<br>Charles de Gaulle<br>`degaulle` | 第4装甲师指挥官、自由法国领导人 | 装甲 | 装甲攻击+20%；所指挥部队防御+10% | 以装甲作战经历配置攻防技能。 | [人物资料](https://en.wikipedia.org/wiki/Charles_de_Gaulle) |
| 勒克莱尔<br>Philippe Leclerc de Hauteclocque<br>`leclerc` | 自由法国第2装甲师师长 | 装甲 | 装甲攻击+20%；装甲移动力+1 | 装甲师机动与突击。 | [人物资料](https://en.wikipedia.org/wiki/Philippe_Leclerc_de_Hauteclocque) |
| 德·拉特尔<br>Jean de Lattre de Tassigny<br>`delattre` | 法国第1集团军司令 | 步兵 | 步兵攻击+20%；邻格友军攻击+8%（取最强） | 法国陆军协同进攻。 | [人物资料](https://en.wikipedia.org/wiki/Jean_de_Lattre_de_Tassigny) |
| 朱安<br>Alphonse Juin<br>`juin` | 驻意大利远征军司令 | 山地步兵 | 步兵攻击+20%；步兵移动力+1 | 建议山地步兵，借助兵种地形适应进行迂回。 | [人物资料](https://en.wikipedia.org/wiki/Alphonse_Juin) |
| 柯尼希<br>Marie-Pierre Kœnig<br>`koenig` | 自由法国旅指挥官 | 步兵 | 步兵防御+25%；普通反击系数+20个百分点 | 比尔哈凯姆防御，偏向坚守反击。 | [人物资料](https://en.wikipedia.org/wiki/Marie-Pierre_K%C5%93nig) |
| 拉尔米纳<br>Edgard de Larminat<br>`larminat` | 自由法国军指挥官 | 步兵 | 步兵攻击+15%；步兵防御+15% | 步兵组织与攻防均衡。 | [人物资料](https://en.wikipedia.org/wiki/Edgard_de_Larminat) |
| 甘末林<br>Maurice Gamelin<br>`gamelin` | 法国陆军总司令 | 陆军通用 | 所指挥部队防御+15%；邻格友军攻击+5%（取最强） | 统筹型基础将领，数值低于一线突出将领。 | [人物资料](https://en.wikipedia.org/wiki/Maurice_Gamelin) |
| 魏刚<br>Maxime Weygand<br>`weygand` | 法军总司令 | 步兵 | 步兵防御+20%；驻城防御+20% | 1940年防御指挥，采用阵地防守定位。 | [人物资料](https://en.wikipedia.org/wiki/Maxime_Weygand) |
| 安齐热<br>Charles Huntziger<br>`huntziger` | 法国第2集团军司令 | 步兵／炮兵 | 步兵防御+15%；炮兵防御+10% | 有限的基础防御加成，不以高级军衔代表强战斗能力。 | [人物资料](https://en.wikipedia.org/wiki/Charles_Huntziger) |
| 维耶曼<br>Joseph Vuillemin<br>`vuillemin` | 法国空军参谋长 | 空军 | 空军防御+15%；邻格友军攻击+5%（取最强） | 航空兵组织与防御。 | [人物资料](https://en.wikipedia.org/wiki/Joseph_Vuillemin) |

### 意大利

| 姓名／ID | 代表性史实职务 | 建议兵种 | 游戏技能 | 设计理由 | 资料入口 |
|---|---|---|---|---|---|
| 梅塞<br>Giovanni Messe<br>`messe` | 远征军及第1集团军指挥官 | 装甲 | 装甲攻击+15%；所指挥部队防御+10% | 装甲进攻与基础防御。 | [人物资料](https://en.wikipedia.org/wiki/Giovanni_Messe) |
| 巴尔博<br>Italo Balbo<br>`balbo` | 空军元帅、利比亚总督 | 空军 | 空军攻击+20%；空军作战半径／转场距离+1 | 航空攻击和航程；历史职务不等于实际机队战斗指挥。 | [人物资料](https://en.wikipedia.org/wiki/Italo_Balbo) |
| 巴多格里奥<br>Pietro Badoglio<br>`badoglio` | 意大利总参谋长 | 炮兵 | 炮兵攻击+15%；所指挥部队防御+10% | 炮兵背景与基础参谋指挥。 | [人物资料](https://en.wikipedia.org/wiki/Pietro_Badoglio) |
| 格拉齐亚尼<br>Rodolfo Graziani<br>`graziani` | 北非意军指挥官 | 步兵 | 步兵攻击+15%；步兵防御+10% | 基础步兵指挥，不把职务直接转成高强度技能。 | [人物资料](https://en.wikipedia.org/wiki/Rodolfo_Graziani) |
| 巴斯蒂科<br>Ettore Bastico<br>`bastico` | 北非战区指挥官 | 陆军通用 | 所指挥部队防御+15%；邻格友军攻击+5%（取最强） | 战区防御协调。 | [人物资料](https://en.wikipedia.org/wiki/Ettore_Bastico) |
| 加里博尔迪<br>Italo Gariboldi<br>`gariboldi` | 驻苏意大利第8集团军司令 | 步兵 | 步兵防御+15%；普通反击系数+10个百分点 | 基础步兵防御定位。 | [人物资料](https://en.wikipedia.org/wiki/Italo_Gariboldi) |
| 罗阿塔<br>Mario Roatta<br>`roatta` | 第2集团军司令 | 步兵 | 步兵攻击+10%；步兵防御+15% | 基础步兵组织型将领。 | [人物资料](https://en.wikipedia.org/wiki/Mario_Roatta) |
| 安布罗西奥<br>Vittorio Ambrosio<br>`ambrosio` | 集团军与总参谋部指挥官 | 陆军通用 | 所指挥部队防御+15%；邻格友军攻击+5%（取最强） | 联合指挥与组织支援。 | [人物资料](https://en.wikipedia.org/wiki/Vittorio_Ambrosio) |
| 甘巴拉<br>Gastone Gambara<br>`gambara` | 军级指挥官 | 步兵 | 步兵攻击+15%；步兵移动力+1 | 步兵军机动作战。 | [人物资料](https://en.wikipedia.org/wiki/Gastone_Gambara) |
| 福吉耶<br>Rino Corso Fougier<br>`fougier` | 意大利空军参谋长 | 空军 | 空军攻击+15%；空军防御+15% | 均衡航空兵指挥。 | [人物资料](https://en.wikipedia.org/wiki/Rino_Corso_Fougier) |

### 波兰

| 姓名／ID | 代表性史实职务 | 建议兵种 | 游戏技能 | 设计理由 | 资料入口 |
|---|---|---|---|---|---|
| 博尔-科莫罗夫斯基<br>Tadeusz Bór-Komorowski<br>`bor` | 波兰家乡军指挥官 | 非正规步兵／卫戍部队 | 驻城防御+50%；步兵防御+20% | 城市防御与步兵防护，建议非正规步兵或卫戍部队。 | [人物资料](https://en.wikipedia.org/wiki/Tadeusz_B%C3%B3r-Komorowski) |
| 西科尔斯基<br>Władysław Sikorski<br>`sikorski` | 波兰流亡军总司令 | 步兵 | 邻格友军攻击+8%（取最强）；步兵防御+15% | 流亡军整合与协同。 | [人物资料](https://en.wikipedia.org/wiki/W%C5%82adys%C5%82aw_Sikorski) |
| 安德斯<br>Władysław Anders<br>`anders` | 波兰第2军军长 | 山地步兵 | 步兵攻击+20%；步兵防御+15% | 建议山地步兵，表现意大利战场的步兵攻坚。 | [人物资料](https://en.wikipedia.org/wiki/W%C5%82adys%C5%82aw_Anders) |
| 马切克<br>Stanisław Maczek<br>`maczek` | 波兰第1装甲师师长 | 装甲 | 装甲攻击+20%；装甲移动力+1 | 装甲师机动突破。 | [人物资料](https://en.wikipedia.org/wiki/Stanis%C5%82aw_Maczek) |
| 索萨博夫斯基<br>Stanisław Sosabowski<br>`sosabowski` | 独立伞兵旅指挥官 | 伞兵 | 步兵防御+20%；步兵移动力+1 | 建议伞兵，强化着陆后的防护与机动。 | [人物资料](https://en.wikipedia.org/wiki/Stanis%C5%82aw_Sosabowski) |
| 库特谢巴<br>Tadeusz Kutrzeba<br>`kutrzeba` | 波兹南集团军司令 | 步兵 | 步兵攻击+15%；普通反击系数+20个百分点 | 步兵反攻定位。 | [人物资料](https://en.wikipedia.org/wiki/Tadeusz_Kutrzeba) |

### 芬兰

| 姓名／ID | 代表性史实职务 | 建议兵种 | 游戏技能 | 设计理由 | 资料入口 |
|---|---|---|---|---|---|
| 曼纳海姆<br>Carl Gustaf Emil Mannerheim<br>`mannerheim` | 芬兰军队总司令 | 陆军通用 | 所指挥部队防御+20%；邻格友军攻击+10%（取最强） | 国土防御与多部队协调。 | [人物资料](https://en.wikipedia.org/wiki/Carl_Gustaf_Emil_Mannerheim) |
| 西拉斯沃<br>Hjalmar Siilasvuo<br>`siilasvuo` | 芬兰军级指挥官 | 游骑兵 | 步兵攻击+20%；步兵移动力+1 | 建议游骑兵，表现分割包围中的步兵机动。 | [人物资料](https://en.wikipedia.org/wiki/Hjalmar_Siilasvuo) |
| 塔尔韦拉<br>Paavo Talvela<br>`talvela` | 芬兰军级指挥官 | 步兵 | 步兵攻击+20%；普通反击系数+15个百分点 | 步兵反击与局部进攻。 | [人物资料](https://en.wikipedia.org/wiki/Paavo_Talvela) |
| 海因里希斯<br>Erik Heinrichs<br>`heinrichs` | 卡累利阿集团军司令、总参谋长 | 步兵 | 步兵防御+15%；邻格友军攻击+8%（取最强） | 前线与参谋组织兼备。 | [人物资料](https://en.wikipedia.org/wiki/Erik_Heinrichs) |
| 艾罗<br>Aksel Airo<br>`airo` | 芬兰总部作战计划负责人 | 陆军通用 | 所指挥部队防御+10%；邻格友军攻击+8%（取最强） | 作战筹划以小幅光环体现。 | [人物资料](https://en.wikipedia.org/wiki/Aksel_Airo) |

### 罗马尼亚

| 姓名／ID | 代表性史实职务 | 建议兵种 | 游戏技能 | 设计理由 | 资料入口 |
|---|---|---|---|---|---|
| 杜米特雷斯库<br>Petre Dumitrescu<br>`dumitrescu` | 罗马尼亚第3集团军司令 | 步兵 | 步兵防御+15%；普通反击系数+15个百分点 | 步兵集团军防御指挥。 | [人物资料](https://en.wikipedia.org/wiki/Petre_Dumitrescu) |
| 阿夫拉梅斯库<br>Gheorghe Avramescu<br>`avramescu` | 山地军与第4集团军指挥官 | 山地步兵 | 步兵攻击+15%；步兵移动力+1 | 建议山地步兵，体现山地军作战经历。 | [人物资料](https://en.wikipedia.org/wiki/Gheorghe_Avramescu) |
| 达斯卡列斯库<br>Nicolae Dăscălescu<br>`dascalescu` | 罗马尼亚第4集团军司令 | 步兵 | 步兵攻击+15%；步兵防御+15% | 集团军步兵攻防均衡。 | [人物资料](https://en.wikipedia.org/wiki/Nicolae_D%C4%83sc%C4%83lescu) |
| 丘佩尔卡<br>Nicolae Ciupercă<br>`ciuperca` | 罗马尼亚第4集团军司令 | 炮兵／步兵 | 炮兵攻击+15%；步兵防御+10% | 步炮配合的基础指挥。 | [人物资料](https://en.wikipedia.org/wiki/Nicolae_Ciuperc%C4%83) |

### 匈牙利

| 姓名／ID | 代表性史实职务 | 建议兵种 | 游戏技能 | 设计理由 | 资料入口 |
|---|---|---|---|---|---|
| 松博特海伊<br>Ferenc Szombathelyi<br>`szombathelyi` | 匈牙利总参谋长 | 陆军通用 | 所指挥部队防御+10%；邻格友军攻击+5%（取最强） | 基础参谋协同。 | [人物资料](https://en.wikipedia.org/wiki/Ferenc_Szombathelyi) |
| 雅尼<br>Gusztáv Jány<br>`jany` | 匈牙利第2集团军司令 | 步兵 | 步兵防御+15%；普通反击系数+10个百分点 | 基础步兵防御。 | [人物资料](https://en.wikipedia.org/wiki/Guszt%C3%A1v_J%C3%A1ny) |
| 米克洛什<br>Béla Miklós<br>`miklos` | 机动军与第1集团军指挥官 | 装甲 | 装甲攻击+15%；装甲移动力+1 | 机械化部队指挥经历对应装甲机动。 | [人物资料](https://en.wikipedia.org/wiki/B%C3%A9la_Mikl%C3%B3s) |

### 希腊

| 姓名／ID | 代表性史实职务 | 建议兵种 | 游戏技能 | 设计理由 | 资料入口 |
|---|---|---|---|---|---|
| 帕帕戈斯<br>Alexandros Papagos<br>`papagos` | 希腊军队总司令 | 步兵 | 步兵防御+20%；邻格友军攻击+8%（取最强） | 本土防御与步兵协同。 | [人物资料](https://en.wikipedia.org/wiki/Alexandros_Papagos) |
| 皮齐卡斯<br>Ioannis Pitsikas<br>`pitsikas` | 伊庇鲁斯军队指挥官 | 步兵 | 步兵防御+20%；普通反击系数+15个百分点 | 山区战线的步兵防守。 | [人物资料](https://en.wikipedia.org/wiki/Ioannis_Pitsikas) |
| 卡齐米特罗斯<br>Charalambos Katsimitros<br>`katsimitros` | 希腊第8步兵师师长 | 步兵 | 步兵防御+25%；驻城防御+20% | 边境阵地坚守，城市加成为游戏化守备定位。 | [人物资料](https://en.wikipedia.org/wiki/Charalambos_Katsimitros) |

### 挪威

| 姓名／ID | 代表性史实职务 | 建议兵种 | 游戏技能 | 设计理由 | 资料入口 |
|---|---|---|---|---|---|
| 鲁格<br>Otto Ruge<br>`ruge` | 挪威军队总司令 | 步兵 | 步兵防御+20%；邻格友军攻击+5%（取最强） | 本土防御组织。 | [人物资料](https://en.wikipedia.org/wiki/Otto_Ruge) |
| 弗莱舍<br>Carl Gustav Fleischer<br>`fleischer` | 挪威第6师师长 | 步兵 | 步兵攻击+15%；步兵防御+15% | 纳尔维克战区步兵攻防。 | [人物资料](https://en.wikipedia.org/wiki/Carl_Gustav_Fleischer) |

### 荷兰

| 姓名／ID | 代表性史实职务 | 建议兵种 | 游戏技能 | 设计理由 | 资料入口 |
|---|---|---|---|---|---|
| 温克尔曼<br>Henri Winkelman<br>`winkelman` | 荷兰军队总司令 | 陆军通用 | 所指挥部队防御+15%；驻城防御+20% | 国土防御与城市坚守。 | [人物资料](https://en.wikipedia.org/wiki/Henri_Winkelman) |
| 赖因德斯<br>Izaak H. Reijnders<br>`reijnders` | 荷兰军队统帅 | 步兵 | 步兵防御+15%；邻格友军攻击+5%（取最强） | 动员与防御部署；保留为战役可选人物。 | [人物资料](https://en.wikipedia.org/wiki/Izaak_Reijnders) |

### 比利时

| 姓名／ID | 代表性史实职务 | 建议兵种 | 游戏技能 | 设计理由 | 资料入口 |
|---|---|---|---|---|---|
| 范奥弗斯特雷滕<br>Raoul Van Overstraeten<br>`vanoverstraeten` | 比利时军事顾问 | 陆军通用 | 所指挥部队防御+15%；邻格友军攻击+5%（取最强） | 防御筹划与指挥支援。 | [人物资料](https://en.wikipedia.org/wiki/Raoul_Van_Overstraeten) |
| 凯亚尔茨<br>Maurice Keyaerts<br>`keyaerts` | 阿登猎兵及骑兵指挥官 | 游骑兵／骑兵 | 步兵防御+15%；步兵移动力+1 | 建议游骑兵或骑兵，侧重掩护机动。 | [人物资料](https://18daagseveldtocht.be/grote-eenheden/legerkorpsen/groepering-keyaerts/) |

### 南斯拉夫

| 姓名／ID | 代表性史实职务 | 建议兵种 | 游戏技能 | 设计理由 | 资料入口 |
|---|---|---|---|---|---|
| 西莫维奇<br>Dušan Simović<br>`simovic` | 南斯拉夫空军与参谋指挥官 | 空军 | 空军防御+15%；邻格友军攻击+5%（取最强） | 空军背景与参谋组织。 | [人物资料](https://en.wikipedia.org/wiki/Du%C5%A1an_Simovi%C4%87) |
| 科查·波波维奇<br>Koča Popović<br>`kocha` | 南斯拉夫游击军指挥官 | 非正规步兵 | 步兵攻击+15%；步兵移动力+1 | 建议非正规步兵，游动作战的抽象。 | [人物资料](https://en.wikipedia.org/wiki/Ko%C4%8Da_Popovi%C4%87) |

## 核对资料与审阅重点

以下是本轮查阅的代表性资料。逐人行内链接用于进一步核对身份与经历；技能数字由本游戏设计，不出自这些史料。

- [美国陆军军史中心：布莱德雷](https://history.army.mil/Research/Reference-Topics/5-Star/Gen-Omar-N-Bradley/)：集团军群指挥经历。
- [英国国家陆军博物馆：奥金莱克](https://www.nam.ac.uk/explore/claude-auchinleck)：中东战区指挥背景。
- [法国解放勋章博物馆：德·拉特尔](https://www.ordredelaliberation.fr/fr/compagnons/jean-lattre-de-tassigny-de)：法国第1集团军及解放战役。
- [法国解放勋章博物馆：比尔哈凯姆的柯尼希与拉尔米纳](https://www.ordredelaliberation.fr/fr/collection/630f4d5718d4961067e5d09c)：自由法国防御作战。
- [曼纳海姆档案主题站：总部](https://mannerheim.fi/10_ylip/e_pmaja.htm)：海因里希斯与艾罗的参谋角色。
- [罗马尼亚二战将领目录](https://www.worldwar2.ro/generali/)：杜米特雷斯库、阿夫拉梅斯库等人物入口。
- [荷兰军史研究所：动员](https://www.nimh.nl/militaire-geschiedenis-van-nederland/webthemas/de-meidagen-van-1940/de-strijd-op-nederlands-grondgebied/mobilisatie)：赖因德斯的战前防御筹划。
- [比利时十八日战役资料：凯亚尔茨部队](https://18daagseveldtocht.be/grote-eenheden/legerkorpsen/groepering-keyaerts/)：猎兵与骑兵部队背景。

建议优先审阅：是否需要按年份解锁将领；空军将领数量是否足够；通用参谋光环是否过多；非主要国家是否应继续扩编；是否为山地／空降／游击专长新增专用技能。目前先使用已生效的技能体系，避免显示了技能却没有实际效果。

## 文档维护

修改将领数据后运行 `node build_general_catalog.js`；以 `node build_general_catalog.js --check` 检查本名录与游戏数据一致。
