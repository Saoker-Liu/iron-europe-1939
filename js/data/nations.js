/* 1939-08-31 political geography. WGS84 city coordinates; grid locations are generated.
 * Historical status and source notes: MAP_NOTES.md. */
(function(){
 const root=typeof window!=='undefined'?window:globalThis;
 root.GameData=root.GameData||{modules:{}};
 root.GameData.modules.nations={
  "COUNTRIES": {
    "de": {
      "name": "德国",
      "color": "#66796b",
      "faction": "axis"
    },
    "it": {
      "name": "意大利",
      "color": "#8fae86",
      "faction": "axis"
    },
    "uk": {
      "name": "英国",
      "color": "#b39b45",
      "faction": "west"
    },
    "fr": {
      "name": "法国",
      "color": "#54729e",
      "faction": "west"
    },
    "pl": {
      "name": "波兰",
      "color": "#a5703c",
      "faction": "west"
    },
    "us": {
      "name": "美国",
      "color": "#4e8a68",
      "faction": "west"
    },
    "su": {
      "name": "苏联",
      "color": "#b03a31",
      "faction": "sov"
    },
    "es": {
      "name": "西班牙",
      "color": "#a08c5a",
      "faction": "neutral"
    },
    "pt": {
      "name": "葡萄牙",
      "color": "#7a8c5a",
      "faction": "neutral"
    },
    "nl": {
      "name": "荷兰",
      "color": "#b06a3a",
      "faction": "neutral"
    },
    "be": {
      "name": "比利时",
      "color": "#8a7a3a",
      "faction": "neutral"
    },
    "se": {
      "name": "瑞典",
      "color": "#7c8f9c",
      "faction": "neutral"
    },
    "no": {
      "name": "挪威",
      "color": "#8aa1a8",
      "faction": "neutral"
    },
    "dk": {
      "name": "丹麦",
      "color": "#c0504d",
      "faction": "neutral"
    },
    "fi": {
      "name": "芬兰",
      "color": "#9bb0c4",
      "faction": "neutral"
    },
    "ee": {
      "name": "爱沙尼亚",
      "color": "#81b0a8",
      "faction": "neutral"
    },
    "lv": {
      "name": "拉脱维亚",
      "color": "#9c8a4e",
      "faction": "neutral"
    },
    "lt": {
      "name": "立陶宛",
      "color": "#a8843c",
      "faction": "neutral"
    },
    "ie": {
      "name": "爱尔兰",
      "color": "#79a86b",
      "faction": "neutral"
    },
    "ch": {
      "name": "瑞士",
      "color": "#c74e4e",
      "faction": "neutral"
    },
    "hu": {
      "name": "匈牙利",
      "color": "#8f7a4f",
      "faction": "neutral"
    },
    "ro": {
      "name": "罗马尼亚",
      "color": "#b09255",
      "faction": "neutral"
    },
    "yu": {
      "name": "南斯拉夫",
      "color": "#7e8ca0",
      "faction": "neutral"
    },
    "bg": {
      "name": "保加利亚",
      "color": "#96794f",
      "faction": "neutral"
    },
    "gr": {
      "name": "希腊",
      "color": "#6f9fc4",
      "faction": "neutral"
    },
    "tr": {
      "name": "土耳其",
      "color": "#b3603f",
      "faction": "neutral"
    },
    "sk": {
      "name": "斯洛伐克",
      "color": "#a58b70",
      "faction": "axis",
      "note": "1939年德国附庸国"
    },
    "bm": {
      "name": "波希米亚和摩拉维亚保护国",
      "short": "波希米亚—摩拉维亚",
      "color": "#8b977a",
      "faction": "axis",
      "controller": "de",
      "note": "1939年3月起由德国占领的保护国"
    },
    "al": {
      "name": "阿尔巴尼亚（意占）",
      "short": "阿尔巴尼亚",
      "color": "#90a981",
      "faction": "neutral",
      "controller": "it",
      "note": "1939年4月起由意大利占领"
    },
    "lu": {
      "name": "卢森堡",
      "color": "#b69bba",
      "faction": "neutral"
    },
    "dz": {
      "name": "但泽自由市",
      "color": "#c7b777",
      "faction": "neutral",
      "note": "开战前夕的自由市；不归波兰或德国领土"
    },
    "is": {
      "name": "冰岛",
      "color": "#91b8cb",
      "faction": "neutral",
      "note": "1939年与丹麦共戴君主"
    },
    "xx": {
      "name": "战区外陆地",
      "color": "#888276",
      "faction": "neutral",
      "context": true
    }
  },
  "FACTION_NAME": {
    "axis": "轴心国",
    "west": "同盟国",
    "sov": "苏联",
    "neutral": "中立国"
  },
  "FACTION_COLOR": {
    "axis": "#43484a",
    "west": "#2f5f9e",
    "sov": "#8f1f16",
    "neutral": "#6f6f6f"
  },
  "CITIES": [
    {
      "k": "london",
      "n": "伦敦",
      "ct": "uk",
      "cap": true,
      "lon": -0.1278,
      "lat": 51.5074
    },
    {
      "k": "birm",
      "n": "伯明翰",
      "ct": "uk",
      "lon": -1.902,
      "lat": 52.486
    },
    {
      "k": "manch",
      "n": "曼彻斯特",
      "ct": "uk",
      "lon": -2.245,
      "lat": 53.48
    },
    {
      "k": "glasgow",
      "n": "格拉斯哥",
      "ct": "uk",
      "lon": -4.252,
      "lat": 55.864
    },
    {
      "k": "edinburgh",
      "n": "爱丁堡",
      "ct": "uk",
      "lon": -3.188,
      "lat": 55.953
    },
    {
      "k": "belfast",
      "n": "贝尔法斯特",
      "ct": "uk",
      "lon": -5.93,
      "lat": 54.597
    },
    {
      "k": "dublin",
      "n": "都柏林",
      "ct": "ie",
      "cap": true,
      "lon": -6.26,
      "lat": 53.35
    },
    {
      "k": "paris",
      "n": "巴黎",
      "ct": "fr",
      "cap": true,
      "lon": 2.3522,
      "lat": 48.8566
    },
    {
      "k": "lille",
      "n": "里尔",
      "ct": "fr",
      "lon": 3.0586,
      "lat": 50.629
    },
    {
      "k": "strasburg",
      "n": "斯特拉斯堡",
      "ct": "fr",
      "lon": 7.752,
      "lat": 48.573
    },
    {
      "k": "brest",
      "n": "布雷斯特",
      "ct": "fr",
      "lon": -4.486,
      "lat": 48.391
    },
    {
      "k": "bordeaux",
      "n": "波尔多",
      "ct": "fr",
      "lon": -0.579,
      "lat": 44.837
    },
    {
      "k": "lyon",
      "n": "里昂",
      "ct": "fr",
      "lon": 4.8357,
      "lat": 45.764
    },
    {
      "k": "marseille",
      "n": "马赛",
      "ct": "fr",
      "lon": 5.3698,
      "lat": 43.296
    },
    {
      "k": "berlin",
      "n": "柏林",
      "ct": "de",
      "cap": true,
      "lon": 13.405,
      "lat": 52.52
    },
    {
      "k": "hamburg",
      "n": "汉堡",
      "ct": "de",
      "lon": 9.994,
      "lat": 53.551
    },
    {
      "k": "stettin",
      "n": "斯德丁",
      "ct": "de",
      "lon": 14.5528,
      "lat": 53.4285
    },
    {
      "k": "cologne",
      "n": "科隆",
      "ct": "de",
      "lon": 6.9603,
      "lat": 50.9375
    },
    {
      "k": "frankfurt",
      "n": "法兰克福",
      "ct": "de",
      "lon": 8.682,
      "lat": 50.1109
    },
    {
      "k": "munich",
      "n": "慕尼黑",
      "ct": "de",
      "lon": 11.582,
      "lat": 48.1351
    },
    {
      "k": "breslau",
      "n": "布雷斯劳",
      "ct": "de",
      "lon": 17.0385,
      "lat": 51.1079
    },
    {
      "k": "vienna",
      "n": "维也纳",
      "ct": "de",
      "lon": 16.3738,
      "lat": 48.2082
    },
    {
      "k": "prague",
      "n": "布拉格",
      "ct": "bm",
      "lon": 14.4378,
      "lat": 50.0755,
      "admin": true
    },
    {
      "k": "konigsberg",
      "n": "柯尼斯堡",
      "ct": "de",
      "lon": 20.453,
      "lat": 54.71
    },
    {
      "k": "warsaw",
      "n": "华沙",
      "ct": "pl",
      "cap": true,
      "lon": 21.0122,
      "lat": 52.2297
    },
    {
      "k": "danzig",
      "n": "但泽",
      "ct": "dz",
      "lon": 18.6466,
      "lat": 54.352,
      "cap": true
    },
    {
      "k": "poznan",
      "n": "波兹南",
      "ct": "pl",
      "lon": 16.9252,
      "lat": 52.4064
    },
    {
      "k": "krakow",
      "n": "克拉科夫",
      "ct": "pl",
      "lon": 19.945,
      "lat": 50.0647
    },
    {
      "k": "lwow",
      "n": "利沃夫",
      "ct": "pl",
      "lon": 24.0316,
      "lat": 49.8429
    },
    {
      "k": "wilno",
      "n": "维尔纽斯",
      "ct": "pl",
      "lon": 25.2797,
      "lat": 54.6872
    },
    {
      "k": "rome",
      "n": "罗马",
      "ct": "it",
      "cap": true,
      "lon": 12.4964,
      "lat": 41.9028
    },
    {
      "k": "milan",
      "n": "米兰",
      "ct": "it",
      "lon": 9.19,
      "lat": 45.4642
    },
    {
      "k": "turin",
      "n": "都灵",
      "ct": "it",
      "lon": 7.6869,
      "lat": 45.0703
    },
    {
      "k": "naples",
      "n": "那不勒斯",
      "ct": "it",
      "lon": 14.2681,
      "lat": 40.8518
    },
    {
      "k": "palermo",
      "n": "巴勒莫",
      "ct": "it",
      "lon": 13.3615,
      "lat": 38.1157
    },
    {
      "k": "moscow",
      "n": "莫斯科",
      "ct": "su",
      "cap": true,
      "lon": 37.6173,
      "lat": 55.7558
    },
    {
      "k": "leningrad",
      "n": "列宁格勒",
      "ct": "su",
      "lon": 30.3351,
      "lat": 59.9343
    },
    {
      "k": "gorky",
      "n": "高尔基",
      "ct": "su",
      "lon": 44.0059,
      "lat": 56.3269
    },
    {
      "k": "minsk",
      "n": "明斯克",
      "ct": "su",
      "lon": 27.5615,
      "lat": 53.9045
    },
    {
      "k": "smolensk",
      "n": "斯摩棱斯克",
      "ct": "su",
      "lon": 32.0453,
      "lat": 54.7826
    },
    {
      "k": "kiev",
      "n": "基辅",
      "ct": "su",
      "lon": 30.5234,
      "lat": 50.4501
    },
    {
      "k": "odessa",
      "n": "敖德萨",
      "ct": "su",
      "lon": 30.7233,
      "lat": 46.4825
    },
    {
      "k": "sevast",
      "n": "塞瓦斯托波尔",
      "ct": "su",
      "lon": 33.5254,
      "lat": 44.6167
    },
    {
      "k": "kharkov",
      "n": "哈尔科夫",
      "ct": "su",
      "lon": 36.2304,
      "lat": 49.9935
    },
    {
      "k": "staling",
      "n": "斯大林格勒",
      "ct": "su",
      "lon": 44.5169,
      "lat": 48.708
    },
    {
      "k": "rostov",
      "n": "罗斯托夫",
      "ct": "su",
      "lon": 39.7015,
      "lat": 47.2357
    },
    {
      "k": "madrid",
      "n": "马德里",
      "ct": "es",
      "cap": true,
      "lon": -3.7038,
      "lat": 40.4168
    },
    {
      "k": "barca",
      "n": "巴塞罗那",
      "ct": "es",
      "lon": 2.1734,
      "lat": 41.3851
    },
    {
      "k": "seville",
      "n": "塞维利亚",
      "ct": "es",
      "lon": -5.9845,
      "lat": 37.3891
    },
    {
      "k": "lisbon",
      "n": "里斯本",
      "ct": "pt",
      "cap": true,
      "lon": -9.1393,
      "lat": 38.7223
    },
    {
      "k": "porto",
      "n": "波尔图",
      "ct": "pt",
      "lon": -8.6291,
      "lat": 41.1579
    },
    {
      "k": "amsterdam",
      "n": "阿姆斯特丹",
      "ct": "nl",
      "cap": true,
      "lon": 4.9041,
      "lat": 52.3676
    },
    {
      "k": "rotterdam",
      "n": "鹿特丹",
      "ct": "nl",
      "lon": 4.4777,
      "lat": 51.9244
    },
    {
      "k": "brussels",
      "n": "布鲁塞尔",
      "ct": "be",
      "cap": true,
      "lon": 4.3517,
      "lat": 50.8503
    },
    {
      "k": "antwerp",
      "n": "安特卫普",
      "ct": "be",
      "lon": 4.4025,
      "lat": 51.2194
    },
    {
      "k": "stockholm",
      "n": "斯德哥尔摩",
      "ct": "se",
      "cap": true,
      "lon": 18.0686,
      "lat": 59.3293
    },
    {
      "k": "goteborg",
      "n": "哥德堡",
      "ct": "se",
      "lon": 11.9746,
      "lat": 57.7089
    },
    {
      "k": "oslo",
      "n": "奥斯陆",
      "ct": "no",
      "cap": true,
      "lon": 10.7522,
      "lat": 59.9139
    },
    {
      "k": "bergen",
      "n": "卑尔根",
      "ct": "no",
      "lon": 5.3221,
      "lat": 60.393
    },
    {
      "k": "copenhagen",
      "n": "哥本哈根",
      "ct": "dk",
      "cap": true,
      "lon": 12.5683,
      "lat": 55.6761
    },
    {
      "k": "helsinki",
      "n": "赫尔辛基",
      "ct": "fi",
      "cap": true,
      "lon": 24.9384,
      "lat": 60.1699
    },
    {
      "k": "tallinn",
      "n": "塔林",
      "ct": "ee",
      "cap": true,
      "lon": 24.7536,
      "lat": 59.437
    },
    {
      "k": "riga",
      "n": "里加",
      "ct": "lv",
      "cap": true,
      "lon": 24.1052,
      "lat": 56.9496
    },
    {
      "k": "kaunas",
      "n": "考纳斯",
      "ct": "lt",
      "cap": true,
      "lon": 23.9036,
      "lat": 54.8985
    },
    {
      "k": "klaipeda",
      "n": "梅梅尔",
      "ct": "de",
      "lon": 21.1443,
      "lat": 55.7033
    },
    {
      "k": "bern",
      "n": "伯尔尼",
      "ct": "ch",
      "cap": true,
      "lon": 7.4474,
      "lat": 46.948
    },
    {
      "k": "budapest",
      "n": "布达佩斯",
      "ct": "hu",
      "cap": true,
      "lon": 19.0402,
      "lat": 47.4979
    },
    {
      "k": "bucharest",
      "n": "布加勒斯特",
      "ct": "ro",
      "cap": true,
      "lon": 26.1025,
      "lat": 44.4268
    },
    {
      "k": "belgrade",
      "n": "贝尔格莱德",
      "ct": "yu",
      "cap": true,
      "lon": 20.4489,
      "lat": 44.7866
    },
    {
      "k": "zagreb",
      "n": "萨格勒布",
      "ct": "yu",
      "lon": 15.9819,
      "lat": 45.815
    },
    {
      "k": "sofia",
      "n": "索菲亚",
      "ct": "bg",
      "cap": true,
      "lon": 23.3219,
      "lat": 42.6977
    },
    {
      "k": "varna",
      "n": "瓦尔纳",
      "ct": "bg",
      "lon": 27.9147,
      "lat": 43.2141
    },
    {
      "k": "athens",
      "n": "雅典",
      "ct": "gr",
      "cap": true,
      "lon": 23.7275,
      "lat": 37.9838
    },
    {
      "k": "salonika",
      "n": "萨洛尼卡",
      "ct": "gr",
      "lon": 22.9444,
      "lat": 40.6401
    },
    {
      "k": "istanbul",
      "n": "伊斯坦布尔",
      "ct": "tr",
      "lon": 28.9784,
      "lat": 41.0082
    },
    {
      "k": "ankara",
      "n": "安卡拉",
      "ct": "tr",
      "lon": 32.8597,
      "lat": 39.9334,
      "cap": true
    },
    {
      "k": "izmir",
      "n": "伊兹密尔",
      "ct": "tr",
      "lon": 27.1428,
      "lat": 38.4237
    },
    {
      "k": "bratislava",
      "n": "布拉迪斯拉发",
      "lon": 17.1077,
      "lat": 48.1486,
      "ct": "sk",
      "cap": true
    },
    {
      "k": "luxembourg",
      "n": "卢森堡",
      "lon": 6.1319,
      "lat": 49.6116,
      "ct": "lu",
      "cap": true
    },
    {
      "k": "tirana",
      "n": "地拉那",
      "lon": 19.8187,
      "lat": 41.3275,
      "ct": "al",
      "admin": true
    },
    {
      "k": "gdynia",
      "n": "格丁尼亚",
      "lon": 18.5305,
      "lat": 54.5189,
      "ct": "pl"
    },
    {
      "k": "dover",
      "n": "多佛尔",
      "lon": 1.3134,
      "lat": 51.1279,
      "ct": "uk"
    },
    {
      "k": "calais",
      "n": "加来",
      "lon": 1.8587,
      "lat": 50.9513,
      "ct": "fr"
    },
    {
      "k": "ajaccio",
      "n": "阿雅克肖",
      "lon": 8.7386,
      "lat": 41.9192,
      "ct": "fr"
    },
    {
      "k": "cagliari",
      "n": "卡利亚里",
      "lon": 9.1217,
      "lat": 39.2238,
      "ct": "it"
    },
    {
      "k": "heraklion",
      "n": "伊拉克利翁",
      "lon": 25.1442,
      "lat": 35.3387,
      "ct": "gr"
    },
    {
      "k": "valletta",
      "n": "瓦莱塔",
      "lon": 14.5146,
      "lat": 35.8992,
      "ct": "uk"
    },
    {
      "k": "nicosia",
      "n": "尼科西亚",
      "lon": 33.3823,
      "lat": 35.1856,
      "ct": "uk"
    },
    {
      "k": "rhodes",
      "n": "罗得岛",
      "lon": 28.2278,
      "lat": 36.4341,
      "ct": "it"
    },
    {
      "k": "gibraltar",
      "n": "直布罗陀",
      "lon": -5.3536,
      "lat": 36.1408,
      "ct": "uk"
    },
    {
      "k": "murmansk",
      "n": "摩尔曼斯克",
      "lon": 33.0827,
      "lat": 68.9585,
      "ct": "su"
    },
    {
      "k": "arkhangelsk",
      "n": "阿尔汉格尔斯克",
      "lon": 40.5433,
      "lat": 64.5393,
      "ct": "su"
    },
    {
      "k": "saratov",
      "n": "萨拉托夫",
      "lon": 46.0343,
      "lat": 51.5336,
      "ct": "su"
    },
    {
      "k": "astrakhan",
      "n": "阿斯特拉罕",
      "lon": 48.0408,
      "lat": 46.3479,
      "ct": "su"
    },
    {
      "k": "reykjavik",
      "n": "雷克雅未克",
      "lon": -21.9426,
      "lat": 64.1466,
      "ct": "is",
      "cap": true
    },
    {
      "k": "viipuri",
      "n": "维堡",
      "lon": 28.749,
      "lat": 60.713,
      "ct": "fi"
    },
    {
      "k": "cluj",
      "n": "克卢日",
      "lon": 23.59,
      "lat": 46.77,
      "ct": "ro"
    },
    {
      "k": "chisinau",
      "n": "基希讷乌",
      "lon": 28.835,
      "lat": 47.01,
      "ct": "ro"
    },
    {
      "k": "uzhhorod",
      "n": "乌日霍罗德",
      "lon": 22.298,
      "lat": 48.62,
      "ct": "hu"
    },
    {
      "k": "kosice",
      "n": "科希策",
      "lon": 21.261,
      "lat": 48.717,
      "ct": "hu"
    },
    {
      "k": "genoa",
      "n": "热那亚",
      "lon": 8.9463,
      "lat": 44.4056,
      "ct": "it",
      "note": "利古里亚主要港口",
      "major": true
    },
    {
      "k": "venice",
      "n": "威尼斯",
      "lon": 12.3155,
      "lat": 45.4408,
      "ct": "it",
      "note": "亚得里亚海港口",
      "major": true
    },
    {
      "k": "zara",
      "n": "扎拉",
      "lon": 15.2314,
      "lat": 44.1194,
      "ct": "it",
      "note": "1939年意大利飞地，今扎达尔",
      "major": true
    },
    {
      "k": "trieste",
      "n": "的里雅斯特",
      "lon": 13.7768,
      "lat": 45.6495,
      "ct": "it",
      "note": "1939年意大利港口"
    },
    {
      "k": "bologna",
      "n": "博洛尼亚",
      "lon": 11.3426,
      "lat": 44.4949,
      "ct": "it",
      "note": "意大利北部铁路枢纽"
    },
    {
      "k": "florence",
      "n": "佛罗伦萨",
      "lon": 11.2558,
      "lat": 43.7696,
      "ct": "it",
      "note": "托斯卡纳主要城市"
    },
    {
      "k": "ancona",
      "n": "安科纳",
      "lon": 13.5189,
      "lat": 43.6158,
      "ct": "it",
      "note": "亚得里亚海港口"
    },
    {
      "k": "bari",
      "n": "巴里",
      "lon": 16.8719,
      "lat": 41.1171,
      "ct": "it",
      "note": "意大利南部港口"
    },
    {
      "k": "taranto",
      "n": "塔兰托",
      "lon": 17.247,
      "lat": 40.4644,
      "ct": "it",
      "note": "海军基地，1940年空袭地点"
    },
    {
      "k": "messina",
      "n": "墨西拿",
      "lon": 15.554,
      "lat": 38.1938,
      "ct": "it",
      "note": "西西里岛东北港口"
    },
    {
      "k": "catania",
      "n": "卡塔尼亚",
      "lon": 15.0873,
      "lat": 37.5027,
      "ct": "it",
      "note": "西西里岛东部城市"
    },
    {
      "k": "cassino",
      "n": "卡西诺",
      "lon": 13.8333,
      "lat": 41.49,
      "ct": "it",
      "note": "古斯塔夫防线与1944年战役地点",
      "major": true
    },
    {
      "k": "liverpool",
      "n": "利物浦",
      "lon": -2.9785,
      "lat": 53.4084,
      "ct": "uk",
      "note": "大西洋运输港口与西部航道司令部所在地",
      "major": true
    },
    {
      "k": "bristol",
      "n": "布里斯托尔",
      "lon": -2.5879,
      "lat": 51.4545,
      "ct": "uk",
      "note": "港口与航空工业中心"
    },
    {
      "k": "plymouth",
      "n": "普利茅斯",
      "lon": -4.1427,
      "lat": 50.3755,
      "ct": "uk",
      "note": "德文港海军基地"
    },
    {
      "k": "portsmouth",
      "n": "朴次茅斯",
      "lon": -1.088,
      "lat": 50.8198,
      "ct": "uk",
      "note": "海军基地与登陆集结港"
    },
    {
      "k": "newcastle",
      "n": "纽卡斯尔",
      "lon": -1.6178,
      "lat": 54.9783,
      "ct": "uk",
      "note": "泰恩河造船工业"
    },
    {
      "k": "hull",
      "n": "赫尔",
      "lon": -0.3367,
      "lat": 53.7457,
      "ct": "uk",
      "note": "英国东海岸港口"
    },
    {
      "k": "sheffield",
      "n": "谢菲尔德",
      "lon": -1.4701,
      "lat": 53.3811,
      "ct": "uk",
      "note": "钢铁与军工城市"
    },
    {
      "k": "aberdeen",
      "n": "阿伯丁",
      "lon": -2.0943,
      "lat": 57.1497,
      "ct": "uk",
      "note": "苏格兰东北港口"
    },
    {
      "k": "dunkirk",
      "n": "敦刻尔克",
      "lon": 2.3768,
      "lat": 51.0344,
      "ct": "fr",
      "note": "1940年敦刻尔克撤退地点",
      "major": true
    },
    {
      "k": "caen",
      "n": "卡昂",
      "lon": -0.3707,
      "lat": 49.1829,
      "ct": "fr",
      "note": "诺曼底；1944年卡昂战役",
      "region": "诺曼底",
      "major": true
    },
    {
      "k": "cherbourg",
      "n": "瑟堡",
      "lon": -1.6221,
      "lat": 49.6337,
      "ct": "fr",
      "note": "诺曼底；科唐坦半岛深水港",
      "region": "诺曼底",
      "major": true
    },
    {
      "k": "lehavre",
      "n": "勒阿弗尔",
      "lon": 0.1079,
      "lat": 49.4944,
      "ct": "fr",
      "note": "诺曼底；塞纳河口港口",
      "region": "诺曼底"
    },
    {
      "k": "rouen",
      "n": "鲁昂",
      "lon": 1.0993,
      "lat": 49.4432,
      "ct": "fr",
      "note": "诺曼底；塞纳河交通枢纽",
      "region": "诺曼底"
    },
    {
      "k": "saintlo",
      "n": "圣洛",
      "lon": -1.09,
      "lat": 49.1167,
      "ct": "fr",
      "note": "诺曼底；1944年突破战役节点",
      "region": "诺曼底"
    },
    {
      "k": "rennes",
      "n": "雷恩",
      "lon": -1.6778,
      "lat": 48.1173,
      "ct": "fr",
      "note": "布列塔尼交通枢纽"
    },
    {
      "k": "nantes",
      "n": "南特",
      "lon": -1.5536,
      "lat": 47.2184,
      "ct": "fr",
      "note": "卢瓦尔河港口与造船工业"
    },
    {
      "k": "orleans",
      "n": "奥尔良",
      "lon": 1.9093,
      "lat": 47.9029,
      "ct": "fr",
      "note": "卢瓦尔河交通枢纽"
    },
    {
      "k": "tours",
      "n": "图尔",
      "lon": 0.6848,
      "lat": 47.3941,
      "ct": "fr",
      "note": "卢瓦尔河城市"
    },
    {
      "k": "reims",
      "n": "兰斯",
      "lon": 4.0317,
      "lat": 49.2583,
      "ct": "fr",
      "note": "1945年德国投降文件签署地点"
    },
    {
      "k": "metz",
      "n": "梅斯",
      "lon": 6.1757,
      "lat": 49.1193,
      "ct": "fr",
      "note": "洛林要塞与铁路枢纽"
    },
    {
      "k": "nancy",
      "n": "南锡",
      "lon": 6.1844,
      "lat": 48.6921,
      "ct": "fr",
      "note": "洛林工业城市"
    },
    {
      "k": "dijon",
      "n": "第戎",
      "lon": 5.0415,
      "lat": 47.322,
      "ct": "fr",
      "note": "勃艮第铁路枢纽"
    },
    {
      "k": "toulouse",
      "n": "图卢兹",
      "lon": 1.4442,
      "lat": 43.6047,
      "ct": "fr",
      "note": "法国航空工业城市"
    },
    {
      "k": "toulon",
      "n": "土伦",
      "lon": 5.928,
      "lat": 43.1242,
      "ct": "fr",
      "note": "法国地中海舰队基地"
    },
    {
      "k": "grenoble",
      "n": "格勒诺布尔",
      "lon": 5.7245,
      "lat": 45.1885,
      "ct": "fr",
      "note": "阿尔卑斯山门户"
    },
    {
      "k": "sedan",
      "n": "色当",
      "lon": 4.9403,
      "lat": 49.7019,
      "ct": "fr",
      "note": "1940年德军突破默兹河地点"
    },
    {
      "k": "bremen",
      "n": "不来梅",
      "lon": 8.8017,
      "lat": 53.0793,
      "ct": "de",
      "note": "造船与航空工业"
    },
    {
      "k": "kiel",
      "n": "基尔",
      "lon": 10.1228,
      "lat": 54.3233,
      "ct": "de",
      "note": "波罗的海海军基地"
    },
    {
      "k": "lubeck",
      "n": "吕贝克",
      "lon": 10.6866,
      "lat": 53.8655,
      "ct": "de",
      "note": "波罗的海港口"
    },
    {
      "k": "hanover",
      "n": "汉诺威",
      "lon": 9.732,
      "lat": 52.3759,
      "ct": "de",
      "note": "铁路与工业枢纽"
    },
    {
      "k": "essen",
      "n": "埃森",
      "lon": 7.0123,
      "lat": 51.4556,
      "ct": "de",
      "note": "鲁尔重工业中心"
    },
    {
      "k": "dortmund",
      "n": "多特蒙德",
      "lon": 7.4653,
      "lat": 51.5136,
      "ct": "de",
      "note": "鲁尔钢铁与煤炭工业"
    },
    {
      "k": "leipzig",
      "n": "莱比锡",
      "lon": 12.3731,
      "lat": 51.3397,
      "ct": "de",
      "note": "萨克森工业与铁路枢纽"
    },
    {
      "k": "dresden",
      "n": "德累斯顿",
      "lon": 13.7373,
      "lat": 51.0504,
      "ct": "de",
      "note": "萨克森主要城市"
    },
    {
      "k": "nuremberg",
      "n": "纽伦堡",
      "lon": 11.0767,
      "lat": 49.4521,
      "ct": "de",
      "note": "巴伐利亚工业城市"
    },
    {
      "k": "stuttgart",
      "n": "斯图加特",
      "lon": 9.1829,
      "lat": 48.7758,
      "ct": "de",
      "note": "汽车与机械工业中心"
    },
    {
      "k": "kassel",
      "n": "卡塞尔",
      "lon": 9.4797,
      "lat": 51.3127,
      "ct": "de",
      "note": "装甲车辆工业中心"
    },
    {
      "k": "saarbrucken",
      "n": "萨尔布吕肯",
      "lon": 6.9969,
      "lat": 49.2402,
      "ct": "de",
      "note": "萨尔工业区"
    },
    {
      "k": "aachen",
      "n": "亚琛",
      "lon": 6.0839,
      "lat": 50.7753,
      "ct": "de",
      "note": "德国西部门户与1944年战役地点"
    },
    {
      "k": "innsbruck",
      "n": "因斯布鲁克",
      "lon": 11.4041,
      "lat": 47.2692,
      "ct": "de",
      "note": "蒂罗尔与布伦纳交通线"
    },
    {
      "k": "graz",
      "n": "格拉茨",
      "lon": 15.4395,
      "lat": 47.0707,
      "ct": "de",
      "note": "1939年德国境内的奥地利城市"
    },
    {
      "k": "linz",
      "n": "林茨",
      "lon": 14.2858,
      "lat": 48.3069,
      "ct": "de",
      "note": "多瑙河工业城市"
    },
    {
      "k": "salzburg",
      "n": "萨尔茨堡",
      "lon": 13.055,
      "lat": 47.8095,
      "ct": "de",
      "note": "阿尔卑斯山铁路枢纽"
    },
    {
      "k": "lodz",
      "n": "罗兹",
      "lon": 19.456,
      "lat": 51.7592,
      "ct": "pl",
      "note": "波兰主要工业城市"
    },
    {
      "k": "lublin",
      "n": "卢布林",
      "lon": 22.5684,
      "lat": 51.2465,
      "ct": "pl",
      "note": "波兰东部交通枢纽"
    },
    {
      "k": "brestlitovsk",
      "n": "布列斯特-立陶夫斯克",
      "lon": 23.6878,
      "lat": 52.0976,
      "ct": "pl",
      "note": "1939年波兰领土，布格河要塞"
    },
    {
      "k": "grodno",
      "n": "格罗德诺",
      "lon": 23.8258,
      "lat": 53.6694,
      "ct": "pl",
      "note": "1939年波兰东北部城市"
    },
    {
      "k": "bialystok",
      "n": "比亚韦斯托克",
      "lon": 23.1688,
      "lat": 53.1325,
      "ct": "pl",
      "note": "波兰东北部工业城市"
    },
    {
      "k": "katowice",
      "n": "卡托维兹",
      "lon": 19.0238,
      "lat": 50.2649,
      "ct": "pl",
      "note": "上西里西亚工业区"
    },
    {
      "k": "torun",
      "n": "托伦",
      "lon": 18.5984,
      "lat": 53.0138,
      "ct": "pl",
      "note": "维斯瓦河交通节点"
    },
    {
      "k": "tula",
      "n": "图拉",
      "lon": 37.6178,
      "lat": 54.193,
      "ct": "su",
      "note": "军工城市与莫斯科南翼"
    },
    {
      "k": "kursk",
      "n": "库尔斯克",
      "lon": 36.1874,
      "lat": 51.7373,
      "ct": "su",
      "note": "1943年库尔斯克会战地区",
      "major": true
    },
    {
      "k": "orel",
      "n": "奥廖尔",
      "lon": 36.0691,
      "lat": 52.9685,
      "ct": "su",
      "note": "苏联西部交通枢纽"
    },
    {
      "k": "bryansk",
      "n": "布良斯克",
      "lon": 34.3653,
      "lat": 53.2436,
      "ct": "su",
      "note": "铁路枢纽"
    },
    {
      "k": "voronezh",
      "n": "沃罗涅日",
      "lon": 39.2003,
      "lat": 51.6608,
      "ct": "su",
      "note": "顿河流域工业城市"
    },
    {
      "k": "rzhev",
      "n": "勒热夫",
      "lon": 34.328,
      "lat": 56.2624,
      "ct": "su",
      "note": "1942—1943年突出部战场"
    },
    {
      "k": "velikiye_luki",
      "n": "大卢基",
      "lon": 30.5438,
      "lat": 56.3439,
      "ct": "su",
      "note": "苏联西北部铁路枢纽"
    },
    {
      "k": "vitebsk",
      "n": "维捷布斯克",
      "lon": 30.2033,
      "lat": 55.1904,
      "ct": "su",
      "note": "西德维纳河城市"
    },
    {
      "k": "mogilev",
      "n": "莫吉廖夫",
      "lon": 30.335,
      "lat": 53.9007,
      "ct": "su",
      "note": "第聂伯河交通枢纽"
    },
    {
      "k": "gomel",
      "n": "戈梅利",
      "lon": 30.9878,
      "lat": 52.4345,
      "ct": "su",
      "note": "白俄罗斯东南部铁路枢纽"
    },
    {
      "k": "zhitomir",
      "n": "日托米尔",
      "lon": 28.6587,
      "lat": 50.2547,
      "ct": "su",
      "note": "基辅以西交通节点"
    },
    {
      "k": "dnepropetrovsk",
      "n": "第聂伯罗彼得罗夫斯克",
      "lon": 35.0462,
      "lat": 48.4647,
      "ct": "su",
      "note": "第聂伯河工业城市"
    },
    {
      "k": "zaporozhye",
      "n": "扎波罗热",
      "lon": 35.1396,
      "lat": 47.8388,
      "ct": "su",
      "note": "第聂伯河工业与水电节点"
    },
    {
      "k": "stalino",
      "n": "斯大林诺",
      "lon": 37.8028,
      "lat": 48.0159,
      "ct": "su",
      "note": "顿巴斯工业中心，今顿涅茨克"
    },
    {
      "k": "krasnodar",
      "n": "克拉斯诺达尔",
      "lon": 38.976,
      "lat": 45.0355,
      "ct": "su",
      "note": "库班地区交通枢纽"
    },
    {
      "k": "novorossiysk",
      "n": "新罗西斯克",
      "lon": 37.7686,
      "lat": 44.7239,
      "ct": "su",
      "note": "黑海港口"
    },
    {
      "k": "narvik",
      "n": "纳尔维克",
      "lon": 17.4273,
      "lat": 68.4385,
      "ct": "no",
      "note": "铁矿石出口港与1940年挪威战役",
      "major": true
    },
    {
      "k": "trondheim",
      "n": "特隆赫姆",
      "lon": 10.3951,
      "lat": 63.4305,
      "ct": "no",
      "note": "挪威中部港口"
    },
    {
      "k": "tromso",
      "n": "特罗姆瑟",
      "lon": 18.9553,
      "lat": 69.6492,
      "ct": "no",
      "note": "挪威北部港口"
    },
    {
      "k": "turku",
      "n": "图尔库",
      "lon": 22.2666,
      "lat": 60.4518,
      "ct": "fi",
      "note": "芬兰西南部港口"
    },
    {
      "k": "tampere",
      "n": "坦佩雷",
      "lon": 23.7609,
      "lat": 61.4978,
      "ct": "fi",
      "note": "芬兰工业中心"
    },
    {
      "k": "oulu",
      "n": "奥卢",
      "lon": 25.4651,
      "lat": 65.0121,
      "ct": "fi",
      "note": "波的尼亚湾北部港口"
    },
    {
      "k": "malmo",
      "n": "马尔默",
      "lon": 13.0038,
      "lat": 55.605,
      "ct": "se",
      "note": "瑞典南部港口"
    },
    {
      "k": "aarhus",
      "n": "奥胡斯",
      "lon": 10.2039,
      "lat": 56.1629,
      "ct": "dk",
      "note": "日德兰半岛港口"
    },
    {
      "k": "liege",
      "n": "列日",
      "lon": 5.5797,
      "lat": 50.6326,
      "ct": "be",
      "note": "默兹河工业与要塞城市"
    },
    {
      "k": "ghent",
      "n": "根特",
      "lon": 3.7174,
      "lat": 51.0543,
      "ct": "be",
      "note": "比利时工业城市"
    },
    {
      "k": "bastogne",
      "n": "巴斯托涅",
      "lon": 5.72,
      "lat": 50.0,
      "ct": "be",
      "note": "1944年阿登战役节点",
      "major": true
    },
    {
      "k": "arnhem",
      "n": "阿纳姆",
      "lon": 5.8987,
      "lat": 51.9851,
      "ct": "nl",
      "note": "1944年市场花园行动桥梁目标",
      "major": true
    },
    {
      "k": "eindhoven",
      "n": "埃因霍温",
      "lon": 5.4697,
      "lat": 51.4416,
      "ct": "nl",
      "note": "工业城市与市场花园行动路线"
    },
    {
      "k": "ploiesti",
      "n": "普洛耶什蒂",
      "lon": 26.0122,
      "lat": 44.9367,
      "ct": "ro",
      "note": "罗马尼亚石油与炼油中心"
    },
    {
      "k": "constanta",
      "n": "康斯坦察",
      "lon": 28.6348,
      "lat": 44.1598,
      "ct": "ro",
      "note": "罗马尼亚黑海港口"
    },
    {
      "k": "sarajevo",
      "n": "萨拉热窝",
      "lon": 18.4131,
      "lat": 43.8563,
      "ct": "yu",
      "note": "波斯尼亚主要城市"
    },
    {
      "k": "split",
      "n": "斯普利特",
      "lon": 16.4402,
      "lat": 43.5081,
      "ct": "yu",
      "note": "1939年南斯拉夫港口"
    },
    {
      "k": "skopje",
      "n": "斯科普里",
      "lon": 21.4314,
      "lat": 41.9981,
      "ct": "yu",
      "note": "巴尔干交通枢纽"
    },
    {
      "k": "ljubljana",
      "n": "卢布尔雅那",
      "lon": 14.5058,
      "lat": 46.0569,
      "ct": "yu",
      "note": "1939年南斯拉夫西北部城市"
    },
    {
      "k": "debrecen",
      "n": "德布勒森",
      "lon": 21.6273,
      "lat": 47.5316,
      "ct": "hu",
      "note": "匈牙利东部交通枢纽"
    },
    {
      "k": "edirne",
      "n": "埃迪尔内",
      "lon": 26.5557,
      "lat": 41.6771,
      "ct": "tr",
      "note": "土耳其欧洲部分交通节点"
    },
    {
      "k": "trabzon",
      "n": "特拉布宗",
      "lon": 39.7168,
      "lat": 41.0027,
      "ct": "tr",
      "note": "安纳托利亚黑海港口"
    },
    {
      "k": "bilbao",
      "n": "毕尔巴鄂",
      "lon": -2.935,
      "lat": 43.263,
      "ct": "es",
      "note": "西班牙北部工业港口"
    },
    {
      "k": "valencia",
      "n": "瓦伦西亚",
      "lon": -0.3763,
      "lat": 39.4699,
      "ct": "es",
      "note": "西班牙地中海港口"
    },
    {
      "k": "zaragoza",
      "n": "萨拉戈萨",
      "lon": -0.8891,
      "lat": 41.6488,
      "ct": "es",
      "note": "埃布罗河交通枢纽"
    },
    {
      "k": "brno",
      "n": "布尔诺",
      "lon": 16.6068,
      "lat": 49.1951,
      "ct": "bm",
      "note": "1939年保护国内的摩拉维亚工业城市"
    },
    {
      "k": "pilsen",
      "n": "比尔森",
      "lon": 13.3776,
      "lat": 49.7384,
      "ct": "bm",
      "note": "斯柯达工业中心"
    }
  ]
};
})();
