/* =========================================================================
 * ⑤ 将领：技能、生平、阵营、头像形象
 * 技能 effect 类型：
 *   atk {cls?, m}   def {cls?, m}   mov {cls?, n}   nozoc {}
 *   rng {n}         counter {m}     citydef {m}     vs {tgt, m}
 *   aura {m}        rage {}
 * 头像 face 字段（ui.js genPortrait 渲染半身像；国别底色与中央单字由名册保留）：
 *   hat: peak 大檐帽 | steel 钢盔 | beret 贝雷帽 | pilot 飞行/坦克皮帽
 *        ushanka 苏军棉帽 | bush 船形帽
 *   acc: goggles 风镜 | star 将星（苏军红、他国金）
 *   右下角技能属性徽记由 skills 自动推导，无需填写
 * ========================================================================= */
(function () {
  'use strict';
  const root = typeof window !== 'undefined' ? window : globalThis;
  root.GameData = root.GameData || { modules: {} };

  root.GameData.modules.generals = {
    GENERALS: [
      // ---- 德国 ----
      { id: 'guderian', name: '古德里安', ct: 'de', title: '装甲兵之父',
        face: {'hat':'beret'},
        skills: [{ k: 'atk', cls: 'tank', m: 0.25 }, { k: 'mov', cls: 'tank', n: 2 }, { k: 'nozoc' }],
        bio: '闪击战理论奠基人，1939 年第19装甲军横扫波兰，1940 年阿登突破直抵英吉利海峡，1941 年兵临莫斯科城下。' },
      { id: 'rommel', name: '隆美尔', ct: 'de', title: '沙漠之狐',
        face: {'hat':'peak','acc':'goggles'},
        skills: [{ k: 'atk', cls: 'tank', m: 0.20 }, { k: 'vs', tgt: 'art', m: 0.40 }, { k: 'rage' }],
        bio: '第7装甲师"魔鬼之师"师长，法国战役获骑士十字勋章；非洲军军团长，以少胜多震动北非。' },
      { id: 'manstein', name: '曼施坦因', ct: 'de', title: '战略大师',
        face: {'hat':'peak'},
        skills: [{ k: 'atk', cls: 'art', m: 0.25 }, { k: 'rng', n: 1 }],
        bio: '"曼施坦因计划"缔造者——装甲集群穿越阿登的镰刀收割；克里米亚与哈尔科夫反击战的名将。' },
      { id: 'model', name: '莫德尔', ct: 'de', title: '防御之狮',
        face: {'hat':'steel'},
        skills: [{ k: 'def', m: 0.30 }, { k: 'citydef', m: 0.40 }],
        bio: '东线"救火队员"，勒热夫防线令朱可夫顿足，1944 年在奥廖尔与阿登屡屡稳住崩坏战线。' },
      { id: 'kesselring', name: '凯塞林', ct: 'de', title: '空军元帅',
        face: {'hat':'peak'},
        skills: [{ k: 'atk', cls: 'air', m: 0.25 }, { k: 'def', cls: 'air', m: 0.30 }],
        bio: '波兰与法兰西战役的空中支援组织者，后任地中海战区总司令，构筑了古斯塔夫防线。' },
      { id: 'rundstedt', name: '龙德施泰特', ct: 'de', title: '西线老帅',
        face: {'hat':'peak'},
        skills: [{ k: 'def', m: 0.20 }, { k: 'citydef', m: 0.25 }],
        bio: '德军资历最深的陆军元帅，历任东线南方集团军群与西线总司令，1944 年坐镇阿登反攻幕后，两度被解职又两度起用。' },
      // ---- 苏联 ----
      { id: 'zhukov', name: '朱可夫', ct: 'su', title: '胜利元帅',
        face: {'hat':'ushanka','acc':'star'},
        skills: [{ k: 'atk', m: 0.20 }, { k: 'def', m: 0.20 }],
        bio: '诺门坎、莫斯科、斯大林格勒、库尔斯克、柏林——几乎每一场决定性胜利都有他的名字。' },
      { id: 'rokossovsky', name: '罗科索夫斯基', ct: 'su', title: '常胜统帅',
        face: {'hat':'peak','acc':'star'},
        skills: [{ k: 'atk', cls: 'tank', m: 0.20 }, { k: 'def', cls: 'tank', m: 0.15 }],
        bio: '从战俘营走出的元帅，斯大林格勒合围战与"巴格拉季昂"行动的白俄罗斯方面军司令。' },
      { id: 'konev', name: '科涅夫', ct: 'su', title: '炮兵元帅',
        face: {'hat':'ushanka'},
        skills: [{ k: 'atk', cls: 'art', m: 0.25 }],
        bio: '以炮兵火力运用著称的方面军司令，库尔斯克、维斯瓦-奥得河攻势与柏林战役的主力指挥官。' },
      { id: 'chuikov', name: '崔可夫', ct: 'su', title: '城市战之神',
        face: {'hat':'steel'},
        skills: [{ k: 'citydef', m: 0.50 }, { k: 'counter', m: 0.30 }, { k: 'def', cls: 'inf', m: 0.20 }],
        bio: '斯大林格勒第62集团军司令，"贴身紧逼"战术让德军炮火优势失效，后直捣柏林市中心。' },
      { id: 'katukov', name: '卡图科夫', ct: 'su', title: '伏击大师',
        face: {'hat':'pilot'},
        skills: [{ k: 'def', cls: 'tank', m: 0.20 }, { k: 'vs', tgt: 'tank', m: 0.30 }],
        bio: '1941 年姆岑斯克以第4坦克旅伏击古德里安的装甲集群，开创坦克伏击战法；后任近卫坦克第1集团军司令，转战库尔斯克直至柏林。' },
      { id: 'govorov', name: '戈沃罗夫', ct: 'su', title: '炮兵学者',
        face: {'hat':'peak','acc':'star'},
        skills: [{ k: 'citydef', m: 0.30 }, { k: 'atk', cls: 'art', m: 0.20 }],
        bio: '炮兵教官出身的方面军司令，1943 年"火花"行动以炮火准备突破列宁格勒封锁，两年后率北方方面军收复波罗的海沿岸。' },
      // ---- 西方同盟国 ----
      { id: 'montgomery', name: '蒙哥马利', ct: 'uk', title: '谨慎的猎手',
        face: {'hat':'beret'},
        skills: [{ k: 'def', m: 0.25 }, { k: 'counter', m: 0.30 }, { k: 'vs', tgt: 'air', m: 0.30 }],
        bio: '阿拉曼战役的胜利者，第8集团军统帅；以周密准备和谨慎推进著称，"先胜后战"的信徒。' },
      { id: 'patton', name: '巴顿', ct: 'us', title: '血胆将军',
        face: {'hat':'steel'},
        skills: [{ k: 'atk', cls: 'tank', m: 0.30 }, { k: 'mov', cls: 'tank', n: 1 }],
        bio: '第3集团军突击先锋，诺曼底突破与阿登反攻的利刃；美国装甲进攻作战的化身。' },
      { id: 'degaulle', name: '戴高乐', ct: 'fr', title: '自由法国领袖',
        face: {'hat':'peak'},
        skills: [{ k: 'atk', cls: 'tank', m: 0.20 }, { k: 'def', m: 0.10 }],
        bio: '战前装甲战术的鼓吹者，1940 年第4装甲师的反击者；"自由法国"运动的精神旗帜。' },
      { id: 'eisenhower', name: '艾森豪威尔', ct: 'us', title: '盟军最高统帅',
        face: {'hat':'peak'},
        skills: [{ k: 'aura', m: 0.10 }],
        bio: '霸王行动的组织者，把英美两国众多名将拧成一股绳的外交型统帅。' },
      { id: 'alexander', name: '亚历山大', ct: 'uk', title: '地中海统帅',
        face: {'hat':'bush'},
        skills: [{ k: 'atk', cls: 'inf', m: 0.15 }, { k: 'def', m: 0.15 }],
        bio: '敦刻尔克断后军长、地中海战区英军总司令，突尼斯与意大利战役的收束者。' },
      { id: 'bradley', name: '布莱德雷', ct: 'us', title: 'GI将军',
        face: {'hat':'steel'},
        skills: [{ k: 'atk', cls: 'inf', m: 0.20 }, { k: 'mov', cls: 'inf', n: 1 }],
        bio: '北非与西西里磨砺出的军长，诺曼底后率第12集团军群横扫法国，"眼镜蛇"行动撕开德军防线，被誉为"大兵的将军"。' },
      { id: 'leclerc', name: '勒克莱尔', ct: 'fr', title: '自由法国铁骑',
        face: {'hat':'beret'},
        skills: [{ k: 'atk', cls: 'tank', m: 0.20 }, { k: 'mov', cls: 'tank', n: 1 }],
        bio: '乍得纵队横穿撒哈拉会师突尼斯，率自由法国第2装甲师于 1944 年 8 月解放巴黎，随后一路直插贝希特斯加登。' },
      // aura 实际倍率由引擎写死 +10%，m:0.10 仅为让显示与实际一致（见 docs/skill-design.md 1.3 陷阱清单）
      { id: 'tedder', name: '特德', ct: 'uk', title: '盟军副统帅',
        face: {'hat':'peak'},
        skills: [{ k: 'atk', cls: 'air', m: 0.20 }, { k: 'aura', m: 0.10 }],
        bio: '地中海盟军空军总司令，以"轰炸机战线"绞杀德军补给线；后任艾森豪威尔的副统帅，把空地协同做成了诺曼底的胜负手。' },
      // ---- 意大利 ----
      { id: 'messe', name: '梅塞', ct: 'it', title: '远征军司令',
        face: {'hat':'bush'},
        skills: [{ k: 'atk', cls: 'tank', m: 0.15 }, { k: 'def', m: 0.10 }],
        bio: '意大利驻俄远征军(CSIR)与突尼斯第1集团军指挥官，意军中最清醒的职业军人。' },
      { id: 'balbo', name: '巴尔博', ct: 'it', title: '空军先驱',
        face: {'hat':'pilot'},
        skills: [{ k: 'atk', cls: 'air', m: 0.20 }, { k: 'mov', cls: 'air', n: 1 }],
        bio: '意大利空军元帅、跨大西洋编队飞行先驱，利比亚总督。' },
      // ---- 波兰 ----
      { id: 'bor', name: '博尔-科莫罗夫斯基', ct: 'pl', title: '华沙起义领袖',
        face: {'hat':'bush'},
        skills: [{ k: 'citydef', m: 0.50 }, { k: 'counter', m: 0.30 }],
        bio: '波兰家乡军总司令，1944 年 8 月率华沙军民举事抗德，坚守 63 天；虽败犹荣，家乡军的抵抗之火燃遍波兰全境。' },
    ],
  };
})();
