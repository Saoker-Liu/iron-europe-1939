/* =========================================================================
 * ⑤ 将领：技能、生平、阵营
 * 技能 effect 类型：
 *   atk {cls?, m}   def {cls?, m}   mov {cls?, n}   nozoc {}
 *   rng {n}         counter {m}     citydef {m}     vs {tgt, m}
 *   aura {m}        rage {}
 * ========================================================================= */
(function () {
  'use strict';
  const root = typeof window !== 'undefined' ? window : globalThis;
  root.GameData = root.GameData || { modules: {} };

  root.GameData.modules.generals = {
    GENERALS: [
      // ---- 德国 ----
      { id: 'guderian', name: '古德里安', ct: 'de', title: '装甲兵之父',
        skills: [{ k: 'atk', cls: 'tank', m: 0.25 }, { k: 'mov', cls: 'tank', n: 2 }, { k: 'nozoc' }],
        bio: '闪击战理论奠基人，1939 年第19装甲军横扫波兰，1940 年阿登突破直抵英吉利海峡，1941 年兵临莫斯科城下。' },
      { id: 'rommel', name: '隆美尔', ct: 'de', title: '沙漠之狐',
        skills: [{ k: 'atk', cls: 'tank', m: 0.20 }, { k: 'vs', tgt: 'art', m: 0.40 }, { k: 'rage' }],
        bio: '第7装甲师"魔鬼之师"师长，法国战役获骑士十字勋章；非洲军军团长，以少胜多震动北非。' },
      { id: 'manstein', name: '曼施坦因', ct: 'de', title: '战略大师',
        skills: [{ k: 'atk', cls: 'art', m: 0.25 }, { k: 'rng', n: 1 }],
        bio: '"曼施坦因计划"缔造者——装甲集群穿越阿登的镰刀收割；克里米亚与哈尔科夫反击战的名将。' },
      { id: 'model', name: '莫德尔', ct: 'de', title: '防御之狮',
        skills: [{ k: 'def', m: 0.30 }, { k: 'citydef', m: 0.40 }],
        bio: '东线"救火队员"，勒热夫防线令朱可夫顿足，1944 年在奥廖尔与阿登屡屡稳住崩坏战线。' },
      { id: 'kesselring', name: '凯塞林', ct: 'de', title: '空军元帅',
        skills: [{ k: 'atk', cls: 'air', m: 0.25 }, { k: 'def', cls: 'air', m: 0.30 }],
        bio: '波兰与法兰西战役的空中支援组织者，后任地中海战区总司令，构筑了古斯塔夫防线。' },
      // ---- 苏联 ----
      { id: 'zhukov', name: '朱可夫', ct: 'su', title: '胜利元帅',
        skills: [{ k: 'atk', m: 0.20 }, { k: 'def', m: 0.20 }],
        bio: '诺门坎、莫斯科、斯大林格勒、库尔斯克、柏林——几乎每一场决定性胜利都有他的名字。' },
      { id: 'rokossovsky', name: '罗科索夫斯基', ct: 'su', title: '常胜统帅',
        skills: [{ k: 'atk', cls: 'tank', m: 0.20 }, { k: 'def', cls: 'tank', m: 0.15 }],
        bio: '从战俘营走出的元帅，斯大林格勒合围战与"巴格拉季昂"行动的白俄罗斯方面军司令。' },
      { id: 'konev', name: '科涅夫', ct: 'su', title: '炮兵元帅',
        skills: [{ k: 'atk', cls: 'art', m: 0.25 }],
        bio: '以炮兵火力运用著称的方面军司令，库尔斯克、维斯瓦-奥得河攻势与柏林战役的主力指挥官。' },
      { id: 'chuikov', name: '崔可夫', ct: 'su', title: '城市战之神',
        skills: [{ k: 'citydef', m: 0.50 }, { k: 'counter', m: 0.30 }, { k: 'def', cls: 'inf', m: 0.20 }],
        bio: '斯大林格勒第62集团军司令，"贴身紧逼"战术让德军炮火优势失效，后直捣柏林市中心。' },
      // ---- 西方同盟国 ----
      { id: 'montgomery', name: '蒙哥马利', ct: 'uk', title: '谨慎的猎手',
        skills: [{ k: 'def', m: 0.25 }, { k: 'counter', m: 0.30 }],
        bio: '阿拉曼战役的胜利者，第8集团军统帅；以周密准备和谨慎推进著称，"先胜后战"的信徒。' },
      { id: 'patton', name: '巴顿', ct: 'us', title: '血胆将军',
        skills: [{ k: 'atk', cls: 'tank', m: 0.30 }, { k: 'mov', cls: 'tank', n: 1 }],
        bio: '第3集团军突击先锋，诺曼底突破与阿登反攻的利刃；美国装甲进攻作战的化身。' },
      { id: 'degaulle', name: '戴高乐', ct: 'fr', title: '自由法国领袖',
        skills: [{ k: 'atk', cls: 'tank', m: 0.20 }, { k: 'def', m: 0.10 }],
        bio: '战前装甲战术的鼓吹者，1940 年第4装甲师的反击者；"自由法国"运动的精神旗帜。' },
      { id: 'eisenhower', name: '艾森豪威尔', ct: 'us', title: '盟军最高统帅',
        skills: [{ k: 'aura', m: 0.10 }],
        bio: '霸王行动的组织者，把英美两国众多名将拧成一股绳的外交型统帅。' },
      { id: 'alexander', name: '亚历山大', ct: 'uk', title: '地中海统帅',
        skills: [{ k: 'atk', cls: 'inf', m: 0.15 }, { k: 'def', m: 0.15 }],
        bio: '敦刻尔克断后军长、地中海战区英军总司令，突尼斯与意大利战役的收束者。' },
      // ---- 意大利 ----
      { id: 'messe', name: '梅塞', ct: 'it', title: '远征军司令',
        skills: [{ k: 'atk', cls: 'tank', m: 0.15 }],
        bio: '意大利驻俄远征军(CSIR)与突尼斯第1集团军指挥官，意军中最清醒的职业军人。' },
      { id: 'balbo', name: '巴尔博', ct: 'it', title: '空军先驱',
        skills: [{ k: 'atk', cls: 'air', m: 0.20 }],
        bio: '意大利空军元帅、跨大西洋编队飞行先驱，利比亚总督。' },
    ],
  };
})();
