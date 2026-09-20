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
      "note": "布里斯托尔及埃文茅斯港区；经埃文河口通往布里斯托尔湾，埃文茅斯港1877年启用。",
      "major": true,
      "port": true
    },
    {
      "k": "plymouth",
      "n": "普利茅斯",
      "lon": -4.1427,
      "lat": 50.3755,
      "ct": "uk",
      "note": "德文港海军基地",
      "port": true
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
      "note": "基尔／霍尔特瑙，威廉皇帝运河 Kaiser-Wilhelm-Kanal（今称北海—波罗的海运河）的东端；1895年通航，1914年前完成扩建。",
      "major": true,
      "region": "基尔运河东口"
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
      "lat": 50,
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
      "note": "毕尔巴鄂 Bilbao，巴斯克工业中心，内尔维翁河口港口",
      "major": true,
      "region": "巴斯克",
      "port": true
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
    },
    {
      "k": "fiume",
      "n": "阜姆",
      "lon": 14.4422,
      "lat": 45.3271,
      "ct": "it",
      "note": "Fiume，今里耶卡 Rijeka；1924年并入意大利，1939年意大利港口。东侧苏沙克当时属南斯拉夫。",
      "major": true
    },
    {
      "k": "palma",
      "n": "帕尔马",
      "lon": 2.6502,
      "lat": 39.5696,
      "ct": "es",
      "region": "马略卡岛",
      "note": "Palma，西班牙巴利阿里群岛马略卡岛港口；1939年西班牙保持中立。",
      "major": true
    },
    {
      "k": "scapaflow",
      "n": "斯卡帕湾",
      "lon": -3.191,
      "lat": 58.835,
      "ct": "uk",
      "region": "奥克尼群岛",
      "note": "Scapa Flow，英国皇家海军锚地与基地；以霍伊岛莱尼斯岸上基地为地图节点。",
      "major": true
    },
    {
      "k": "ronne",
      "n": "伦讷",
      "lon": 14.706,
      "lat": 55.101,
      "ct": "dk",
      "region": "博恩霍尔姆岛",
      "note": "Rønne，丹麦博恩霍尔姆岛港口；1945年苏军轰炸及占领发生在本地图快照之后。",
      "major": true,
      "mapLabel": "伦讷·博恩霍尔姆"
    },
    {
      "k": "torshavn",
      "n": "托尔斯港",
      "lon": -6.7716,
      "lat": 62.0079,
      "ct": "dk",
      "region": "法罗群岛",
      "note": "Tórshavn，法罗群岛港口；1939年属丹麦，英国于1940年进驻。",
      "major": true
    },
    {
      "k": "jersey",
      "n": "泽西岛",
      "lon": -2.1045,
      "lat": 49.1838,
      "ct": "uk",
      "region": "海峡群岛",
      "note": "Jersey，以圣赫利尔 Saint Helier 港口为节点；英国王室属地，游戏归入英国，1940年才遭德军占领。",
      "major": true
    },
    {
      "k": "janmayen",
      "n": "扬马延岛",
      "lon": -8.5,
      "lat": 70.98,
      "ct": "no",
      "region": "挪威海",
      "note": "Jan Mayen，1930年已属挪威，1921年起设气象站；无正规港口，节点及海运表示天气允许时的登陆补给。",
      "major": true
    },
    {
      "k": "douglas",
      "n": "道格拉斯",
      "lon": -4.4821,
      "lat": 54.1523,
      "ct": "uk",
      "region": "马恩岛",
      "note": "英国王室属地，游戏归入英国；爱尔兰海港口",
      "major": true,
      "mapLabel": "道格拉斯·马恩岛",
      "port": true
    },
    {
      "k": "cardiff",
      "n": "加的夫",
      "lon": -3.1791,
      "lat": 51.4816,
      "ct": "uk",
      "region": "威尔士",
      "note": "南威尔士煤炭出口港",
      "major": true,
      "port": true
    },
    {
      "k": "swansea",
      "n": "斯旺西",
      "lon": -3.9436,
      "lat": 51.6214,
      "ct": "uk",
      "region": "威尔士",
      "note": "南威尔士港口与金属工业中心",
      "major": true,
      "port": true
    },
    {
      "k": "nottingham",
      "n": "诺丁汉",
      "lon": -1.1581,
      "lat": 52.9548,
      "ct": "uk",
      "region": "英格兰中部",
      "note": "东米德兰兹工业城市",
      "major": true
    },
    {
      "k": "leeds",
      "n": "利兹",
      "lon": -1.5491,
      "lat": 53.8008,
      "ct": "uk",
      "region": "约克郡",
      "note": "西约克郡工业与铁路枢纽",
      "major": true
    },
    {
      "k": "norwich",
      "n": "诺里奇",
      "lon": 1.2974,
      "lat": 52.6309,
      "ct": "uk",
      "region": "东安格利亚",
      "note": "英国东部地区中心",
      "major": true
    },
    {
      "k": "southampton",
      "n": "南安普敦",
      "lon": -1.4044,
      "lat": 50.9097,
      "ct": "uk",
      "region": "英格兰南部",
      "note": "港口与舰船、航空工业中心",
      "major": true,
      "port": true
    },
    {
      "k": "exeter",
      "n": "埃克塞特",
      "lon": -3.5339,
      "lat": 50.7184,
      "ct": "uk",
      "region": "德文郡",
      "note": "英国西南交通节点",
      "major": true
    },
    {
      "k": "inverness",
      "n": "因弗内斯",
      "lon": -4.2247,
      "lat": 57.4778,
      "ct": "uk",
      "region": "苏格兰高地",
      "note": "高地交通与补给节点",
      "major": true
    },
    {
      "k": "cork",
      "n": "科克",
      "lon": -8.4756,
      "lat": 51.8985,
      "ct": "ie",
      "region": "爱尔兰南部",
      "note": "利河港口与南部地区中心",
      "major": true,
      "port": true
    },
    {
      "k": "galway",
      "n": "戈尔韦",
      "lon": -9.0568,
      "lat": 53.2707,
      "ct": "ie",
      "region": "爱尔兰西部",
      "note": "大西洋岸港口",
      "major": true,
      "port": true
    },
    {
      "k": "limerick",
      "n": "利默里克",
      "lon": -8.6267,
      "lat": 52.6638,
      "ct": "ie",
      "region": "爱尔兰西部",
      "note": "香农河港口",
      "major": true
    },
    {
      "k": "waterford",
      "n": "沃特福德",
      "lon": -7.1101,
      "lat": 52.2593,
      "ct": "ie",
      "region": "爱尔兰东南部",
      "note": "苏尔河港口",
      "major": true,
      "port": true
    },
    {
      "k": "acoruna",
      "n": "拉科鲁尼亚",
      "lon": -8.4115,
      "lat": 43.3623,
      "ct": "es",
      "region": "加利西亚",
      "note": "A Coruña／La Coruña，西班牙西北大西洋港口",
      "major": true,
      "port": true
    },
    {
      "k": "vigo",
      "n": "维戈",
      "lon": -8.7207,
      "lat": 42.2406,
      "ct": "es",
      "region": "加利西亚",
      "note": "大西洋港口与造船业",
      "major": true,
      "port": true
    },
    {
      "k": "oviedo",
      "n": "奥维耶多",
      "lon": -5.8494,
      "lat": 43.3619,
      "ct": "es",
      "region": "阿斯图里亚斯",
      "note": "西班牙北部矿业地区中心",
      "major": true
    },
    {
      "k": "santander",
      "n": "桑坦德",
      "lon": -3.8099,
      "lat": 43.4623,
      "ct": "es",
      "region": "坎塔布里亚",
      "note": "比斯开湾港口",
      "major": true,
      "port": true
    },
    {
      "k": "burgos",
      "n": "布尔戈斯",
      "lon": -3.6969,
      "lat": 42.3439,
      "ct": "es",
      "region": "卡斯蒂利亚",
      "note": "西班牙北部内陆交通节点",
      "major": true
    },
    {
      "k": "valladolid",
      "n": "巴利亚多利德",
      "lon": -4.7286,
      "lat": 41.6523,
      "ct": "es",
      "region": "卡斯蒂利亚",
      "note": "杜罗河流域地区中心",
      "major": true
    },
    {
      "k": "salamanca",
      "n": "萨拉曼卡",
      "lon": -5.6639,
      "lat": 40.9701,
      "ct": "es",
      "region": "卡斯蒂利亚",
      "note": "西部内陆交通节点",
      "major": true
    },
    {
      "k": "murcia",
      "n": "穆尔西亚",
      "lon": -1.1307,
      "lat": 37.9922,
      "ct": "es",
      "region": "穆尔西亚",
      "note": "西班牙东南部地区中心",
      "major": true
    },
    {
      "k": "cartagena",
      "n": "卡塔赫纳",
      "lon": -0.986,
      "lat": 37.6257,
      "ct": "es",
      "region": "穆尔西亚",
      "note": "地中海港口与海军基地",
      "major": true,
      "port": true
    },
    {
      "k": "granada",
      "n": "格拉纳达",
      "lon": -3.5986,
      "lat": 37.1773,
      "ct": "es",
      "region": "安达卢西亚",
      "note": "西班牙南部内陆地区中心",
      "major": true
    },
    {
      "k": "malaga",
      "n": "马拉加",
      "lon": -4.4214,
      "lat": 36.7213,
      "ct": "es",
      "region": "安达卢西亚",
      "note": "西班牙南部地中海港口",
      "major": true,
      "port": true
    },
    {
      "k": "cordoba",
      "n": "科尔多瓦",
      "lon": -4.7794,
      "lat": 37.8882,
      "ct": "es",
      "region": "安达卢西亚",
      "note": "瓜达尔基维尔河流域交通节点",
      "major": true
    },
    {
      "k": "alicante",
      "n": "阿利坎特",
      "lon": -0.4907,
      "lat": 38.3452,
      "ct": "es",
      "region": "瓦伦西亚地区",
      "note": "西班牙东南地中海港口",
      "major": true,
      "port": true
    },
    {
      "k": "wilhelmshaven",
      "n": "威廉港",
      "lon": 8.112,
      "lat": 53.5323,
      "ct": "de",
      "region": "北海沿岸",
      "note": "德国海军基地，亚德湾港口",
      "major": true,
      "port": true
    },
    {
      "k": "emden",
      "n": "埃姆登",
      "lon": 7.206,
      "lat": 53.3675,
      "ct": "de",
      "region": "东弗里斯兰",
      "note": "埃姆斯河口港口",
      "major": true,
      "port": true
    },
    {
      "k": "rostock",
      "n": "罗斯托克",
      "lon": 12.0991,
      "lat": 54.0924,
      "ct": "de",
      "region": "梅克伦堡",
      "note": "瓦尔诺河港口与航空工业",
      "major": true,
      "port": true
    },
    {
      "k": "magdeburg",
      "n": "马格德堡",
      "lon": 11.6276,
      "lat": 52.1205,
      "ct": "de",
      "region": "易北河流域",
      "note": "工业与铁路枢纽",
      "major": true
    },
    {
      "k": "erfurt",
      "n": "爱尔福特",
      "lon": 11.0299,
      "lat": 50.9848,
      "ct": "de",
      "region": "图林根",
      "note": "德国中部交通节点",
      "major": true
    },
    {
      "k": "regensburg",
      "n": "雷根斯堡",
      "lon": 12.1016,
      "lat": 49.0134,
      "ct": "de",
      "region": "巴伐利亚",
      "note": "多瑙河交通与工业节点",
      "major": true
    },
    {
      "k": "visby",
      "n": "维斯比",
      "lon": 18.2948,
      "lat": 57.6348,
      "ct": "se",
      "region": "哥特兰岛",
      "note": "Gotland，瑞典波罗的海岛屿港口",
      "major": true,
      "mapLabel": "维斯比·哥特兰",
      "port": true
    },
    {
      "k": "karlskrona",
      "n": "卡尔斯克鲁纳",
      "lon": 15.5869,
      "lat": 56.1612,
      "ct": "se",
      "region": "布莱金厄",
      "note": "瑞典海军基地",
      "major": true,
      "port": true
    },
    {
      "k": "mariehamn",
      "n": "玛丽港",
      "lon": 19.9348,
      "lat": 60.0973,
      "ct": "fi",
      "region": "奥兰群岛非军事区",
      "note": "Mariehamn，芬兰自治奥兰群岛港口；1856年起非军事化，1921年确认并中立化。游戏保留通行与占领，禁止本地招募。",
      "major": true,
      "mapLabel": "玛丽港·奥兰非军事区",
      "demilitarized": true,
      "port": true
    },
    {
      "k": "plovdiv",
      "n": "普罗夫迪夫",
      "lon": 24.7453,
      "lat": 42.1354,
      "ct": "bg",
      "region": "色雷斯",
      "note": "保加利亚南部交通和工业中心",
      "major": true
    },
    {
      "k": "burgas",
      "n": "布尔加斯",
      "lon": 27.4626,
      "lat": 42.5048,
      "ct": "bg",
      "region": "黑海沿岸",
      "note": "保加利亚黑海港口",
      "major": true,
      "port": true
    },
    {
      "k": "ruse",
      "n": "鲁塞",
      "lon": 25.9657,
      "lat": 43.8356,
      "ct": "bg",
      "region": "多瑙河流域",
      "note": "保加利亚多瑙河港口",
      "major": true
    },
    {
      "k": "szeged",
      "n": "塞格德",
      "lon": 20.1414,
      "lat": 46.253,
      "ct": "hu",
      "region": "蒂萨河流域",
      "note": "匈牙利南部城市，靠近巴奇卡与巴纳特",
      "major": true
    },
    {
      "k": "pecs",
      "n": "佩奇",
      "lon": 18.2323,
      "lat": 46.0727,
      "ct": "hu",
      "region": "巴兰尼亚",
      "note": "匈牙利南部矿业与地区中心",
      "major": true
    },
    {
      "k": "gyor",
      "n": "杰尔",
      "lon": 17.6504,
      "lat": 47.6875,
      "ct": "hu",
      "region": "匈牙利西北部",
      "note": "铁路与工业节点",
      "major": true
    },
    {
      "k": "miskolc",
      "n": "米什科尔茨",
      "lon": 20.7784,
      "lat": 48.1035,
      "ct": "hu",
      "region": "匈牙利东北部",
      "note": "重工业地区中心",
      "major": true
    },
    {
      "k": "timisoara",
      "n": "蒂米什瓦拉",
      "lon": 21.2257,
      "lat": 45.7489,
      "ct": "ro",
      "region": "罗马尼亚巴纳特",
      "note": "东巴纳特地区中心；1939年属罗马尼亚",
      "major": true
    },
    {
      "k": "arad",
      "n": "阿拉德",
      "lon": 21.3123,
      "lat": 46.1866,
      "ct": "ro",
      "region": "克里沙纳",
      "note": "罗马尼亚西部铁路枢纽",
      "major": true
    },
    {
      "k": "oradea",
      "n": "奥拉迪亚",
      "lon": 21.9189,
      "lat": 47.0465,
      "ct": "ro",
      "region": "克里沙纳",
      "note": "1939年属罗马尼亚；1940年第二次维也纳裁决后才割予匈牙利",
      "major": true
    },
    {
      "k": "brasov",
      "n": "布拉索夫",
      "lon": 25.6012,
      "lat": 45.6579,
      "ct": "ro",
      "region": "特兰西瓦尼亚",
      "note": "喀尔巴阡山口交通及航空工业中心",
      "major": true
    },
    {
      "k": "sibiu",
      "n": "锡比乌",
      "lon": 24.1501,
      "lat": 45.7983,
      "ct": "ro",
      "region": "特兰西瓦尼亚",
      "note": "罗马尼亚中部地区中心",
      "major": true
    },
    {
      "k": "iasi",
      "n": "雅西",
      "lon": 27.6014,
      "lat": 47.1585,
      "ct": "ro",
      "region": "摩尔达维亚",
      "note": "罗马尼亚东北部交通节点",
      "major": true
    },
    {
      "k": "galati",
      "n": "加拉茨",
      "lon": 28.0074,
      "lat": 45.4353,
      "ct": "ro",
      "region": "多瑙河下游",
      "note": "多瑙河港口与船舶工业",
      "major": true
    },
    {
      "k": "craiova",
      "n": "克拉约瓦",
      "lon": 23.7949,
      "lat": 44.3302,
      "ct": "ro",
      "region": "奥尔特尼亚",
      "note": "罗马尼亚西南部地区中心",
      "major": true
    },
    {
      "k": "podgorica",
      "n": "波德戈理察",
      "lon": 19.2629,
      "lat": 42.4304,
      "ct": "yu",
      "region": "黑山",
      "note": "1939年属南斯拉夫；不使用战后铁托格勒名称",
      "major": true
    },
    {
      "k": "novisad",
      "n": "诺维萨德",
      "lon": 19.8335,
      "lat": 45.2671,
      "ct": "yu",
      "region": "巴奇卡／伏伊伏丁那",
      "note": "1939年属南斯拉夫；1941年匈牙利占领尚未发生",
      "major": true
    },
    {
      "k": "subotica",
      "n": "苏博蒂察",
      "lon": 19.665,
      "lat": 46.1005,
      "ct": "yu",
      "region": "巴奇卡／伏伊伏丁那",
      "note": "1939年属南斯拉夫；邻近匈牙利边界",
      "major": true
    },
    {
      "k": "petrovgrad",
      "n": "彼得罗夫格勒",
      "lon": 20.3816,
      "lat": 45.3816,
      "ct": "yu",
      "region": "西巴纳特／伏伊伏丁那",
      "note": "Petrovgrad，今兹雷尼亚宁 Zrenjanin；采用1935至1946年名称，1939年属南斯拉夫",
      "major": true
    },
    {
      "k": "nis",
      "n": "尼什",
      "lon": 21.8958,
      "lat": 43.3209,
      "ct": "yu",
      "region": "塞尔维亚",
      "note": "巴尔干铁路枢纽",
      "major": true
    },
    {
      "k": "banjaluka",
      "n": "巴尼亚卢卡",
      "lon": 17.191,
      "lat": 44.7722,
      "ct": "yu",
      "region": "波斯尼亚",
      "note": "南斯拉夫西部地区中心",
      "major": true
    },
    {
      "k": "osijek",
      "n": "奥西耶克",
      "lon": 18.6955,
      "lat": 45.554,
      "ct": "yu",
      "region": "斯拉沃尼亚",
      "note": "德拉瓦河港口与地区中心",
      "major": true
    },
    {
      "k": "dubrovnik",
      "n": "杜布罗夫尼克",
      "lon": 18.0944,
      "lat": 42.6507,
      "ct": "yu",
      "region": "达尔马提亚",
      "note": "1939年南斯拉夫亚得里亚海港口",
      "major": true,
      "port": true
    },
    {
      "k": "yerevan",
      "n": "埃里温",
      "lon": 44.5152,
      "lat": 40.1872,
      "ct": "su",
      "region": "亚美尼亚苏维埃社会主义共和国",
      "note": "苏联加盟共和国首府；不是独立国家首都",
      "major": true
    },
    {
      "k": "batumi",
      "n": "巴统",
      "lon": 41.6367,
      "lat": 41.6168,
      "ct": "su",
      "region": "格鲁吉亚／阿扎尔",
      "note": "苏联黑海港口及石油运输节点",
      "major": true,
      "port": true
    },
    {
      "k": "tbilisi",
      "n": "第比利斯",
      "lon": 44.8271,
      "lat": 41.7151,
      "ct": "su",
      "region": "格鲁吉亚苏维埃社会主义共和国",
      "note": "苏联加盟共和国首府与外高加索铁路枢纽",
      "major": true
    },
    {
      "k": "baku",
      "n": "巴库",
      "lon": 49.8671,
      "lat": 40.4093,
      "ct": "su",
      "region": "阿塞拜疆苏维埃社会主义共和国",
      "note": "苏联重要石油工业中心和里海港口；加盟共和国首府",
      "major": true,
      "port": true
    },
    {
      "k": "kutaisi",
      "n": "库塔伊西",
      "lon": 42.7034,
      "lat": 42.2679,
      "ct": "su",
      "region": "格鲁吉亚",
      "note": "西格鲁吉亚地区中心",
      "major": true
    },
    {
      "k": "grozny",
      "n": "格罗兹尼",
      "lon": 45.6986,
      "lat": 43.3178,
      "ct": "su",
      "region": "北高加索",
      "note": "苏联石油工业中心",
      "major": true
    },
    {
      "k": "makhachkala",
      "n": "马哈奇卡拉",
      "lon": 47.5047,
      "lat": 42.9849,
      "ct": "su",
      "region": "达吉斯坦",
      "note": "苏联里海港口",
      "major": true,
      "port": true
    },
    {
      "k": "ordzhonikidze",
      "n": "奥尔忠尼启则",
      "lon": 44.6818,
      "lat": 43.0246,
      "ct": "su",
      "region": "北奥塞梯",
      "note": "今弗拉季高加索；采用1939年地名，北高加索交通节点",
      "major": true
    },
    {
      "k": "sukhumi",
      "n": "苏呼米",
      "lon": 41.0234,
      "lat": 43.0015,
      "ct": "su",
      "region": "阿布哈兹／格鲁吉亚",
      "note": "1939年苏联格鲁吉亚苏维埃社会主义共和国境内阿布哈兹自治共和国首府、黑海港口",
      "major": true,
      "port": true
    },
    {
      "k": "kerch",
      "n": "刻赤",
      "lon": 36.468,
      "lat": 45.356,
      "ct": "su",
      "region": "克里米亚／刻赤海峡",
      "note": "1939年苏联俄罗斯苏维埃联邦社会主义共和国克里米亚自治共和国港口；隔刻赤海峡望塔曼半岛",
      "major": true,
      "port": true
    },
    {
      "k": "sochi",
      "n": "索契",
      "lon": 39.7231,
      "lat": 43.5855,
      "ct": "su",
      "region": "北高加索黑海沿岸",
      "note": "苏联黑海港口与沿海交通节点",
      "major": true,
      "port": true
    },
    {
      "k": "novgorod",
      "n": "诺夫哥罗德",
      "lon": 31.2758,
      "lat": 58.5215,
      "ct": "su",
      "region": "沃尔霍夫河／伊尔门湖",
      "note": "今大诺夫哥罗德，1941—1944年战场；不是下诺夫哥罗德（本图称高尔基）",
      "major": true
    },
    {
      "k": "kazan",
      "n": "喀山",
      "lon": 49.1064,
      "lat": 55.7963,
      "ct": "su",
      "region": "伏尔加河／鞑靼自治共和国",
      "note": "苏联鞑靼自治共和国首府，工业与交通中心",
      "major": true
    },
    {
      "k": "nikolaev",
      "n": "尼古拉耶夫",
      "lon": 31.9946,
      "lat": 46.975,
      "ct": "su",
      "region": "乌克兰／南布格河口",
      "note": "今米科拉伊夫 Mykolaiv，苏联造船与河口港城",
      "major": true
    },
    {
      "k": "cherkassy",
      "n": "切尔卡瑟",
      "lon": 32.0598,
      "lat": 49.4444,
      "ct": "su",
      "region": "乌克兰／第聂伯河",
      "note": "Cherkasy，第聂伯河交通节点；不使用战后水库岸线",
      "major": true
    },
    {
      "k": "pskov",
      "n": "普斯科夫",
      "lon": 28.3345,
      "lat": 57.8136,
      "ct": "su",
      "region": "苏联西北部",
      "note": "靠近1939年爱沙尼亚、拉脱维亚边界的交通节点",
      "major": true
    },
    {
      "k": "tikhvin",
      "n": "季赫温",
      "lon": 33.5293,
      "lat": 59.6273,
      "ct": "su",
      "region": "拉多加湖以东",
      "note": "列宁格勒东侧铁路与1941年战役地点",
      "major": true
    },
    {
      "k": "petrozavodsk",
      "n": "彼得罗扎沃茨克",
      "lon": 34.3469,
      "lat": 61.7891,
      "ct": "su",
      "region": "卡累利阿／奥涅加湖",
      "note": "1939年卡累利阿自治共和国首府",
      "major": true
    },
    {
      "k": "kalinin",
      "n": "加里宁",
      "lon": 35.9176,
      "lat": 56.8587,
      "ct": "su",
      "region": "伏尔加河上游",
      "note": "今特维尔 Tver，使用1931—1990年名称",
      "major": true
    },
    {
      "k": "yaroslavl",
      "n": "雅罗斯拉夫尔",
      "lon": 39.8845,
      "lat": 57.6261,
      "ct": "su",
      "region": "伏尔加河上游",
      "note": "伏尔加河工业与铁路节点",
      "major": true
    },
    {
      "k": "ryazan",
      "n": "梁赞",
      "lon": 39.7126,
      "lat": 54.6292,
      "ct": "su",
      "region": "奥卡河流域",
      "note": "莫斯科东南交通节点",
      "major": true
    },
    {
      "k": "tambov",
      "n": "坦波夫",
      "lon": 41.4523,
      "lat": 52.7212,
      "ct": "su",
      "region": "苏联中部",
      "note": "铁路和农业地区中心",
      "major": true
    },
    {
      "k": "penza",
      "n": "奔萨",
      "lon": 45.0183,
      "lat": 53.1959,
      "ct": "su",
      "region": "伏尔加河以西",
      "note": "苏联中部工业与铁路枢纽",
      "major": true
    },
    {
      "k": "kuibyshev",
      "n": "古比雪夫",
      "lon": 50.1002,
      "lat": 53.1959,
      "ct": "su",
      "region": "伏尔加河中游",
      "note": "今萨马拉 Samara，使用1935年起的名称；1941年疏散政府机关驻地",
      "major": true
    },
    {
      "k": "ulyanovsk",
      "n": "乌里扬诺夫斯克",
      "lon": 48.4031,
      "lat": 54.3142,
      "ct": "su",
      "region": "伏尔加河中游",
      "note": "苏联伏尔加河工业与运输城市",
      "major": true
    },
    {
      "k": "kirov",
      "n": "基洛夫",
      "lon": 49.668,
      "lat": 58.6035,
      "ct": "su",
      "region": "维亚特卡河流域",
      "note": "原维亚特卡 Vyatka，1934年更名；苏联东北部铁路节点",
      "major": true
    },
    {
      "k": "vinnytsia",
      "n": "文尼察",
      "lon": 28.4682,
      "lat": 49.2331,
      "ct": "su",
      "region": "乌克兰／波多利亚",
      "note": "苏联西部交通枢纽",
      "major": true
    },
    {
      "k": "poltava",
      "n": "波尔塔瓦",
      "lon": 34.5514,
      "lat": 49.5883,
      "ct": "su",
      "region": "乌克兰中部",
      "note": "哈尔科夫与第聂伯河之间的交通节点",
      "major": true
    },
    {
      "k": "sumy",
      "n": "苏梅",
      "lon": 34.7981,
      "lat": 50.9077,
      "ct": "su",
      "region": "乌克兰东北部",
      "note": "苏联西部工业与交通城市",
      "major": true
    },
    {
      "k": "kherson",
      "n": "赫尔松",
      "lon": 32.6169,
      "lat": 46.6354,
      "ct": "su",
      "region": "乌克兰／第聂伯河口",
      "note": "苏联河口港口与船舶工业节点",
      "major": true
    },
    {
      "k": "kremenchug",
      "n": "克列缅丘格",
      "lon": 33.4204,
      "lat": 49.0658,
      "ct": "su",
      "region": "乌克兰／第聂伯河",
      "note": "今克雷门丘克 Kremenchuk，第聂伯河交通与工业节点",
      "major": true
    },
    {
      "k": "simferopol",
      "n": "辛菲罗波尔",
      "lon": 34.1024,
      "lat": 44.9521,
      "ct": "su",
      "region": "克里米亚",
      "note": "1939年克里米亚自治共和国首府，苏联境内内陆铁路枢纽",
      "major": true
    },
    {
      "k": "maikop",
      "n": "迈科普",
      "lon": 40.1007,
      "lat": 44.6098,
      "ct": "su",
      "region": "北高加索／阿迪格",
      "note": "北高加索石油产区与交通节点",
      "major": true
    },
    {
      "k": "kuressaare",
      "n": "库雷萨雷",
      "lon": 22.485,
      "lat": 58.252,
      "ct": "ee",
      "region": "萨列马岛",
      "note": "Kuressaare／Saaremaa，1939年8月31日仍属独立爱沙尼亚的岛屿港口",
      "major": true,
      "mapLabel": "库雷萨雷·萨列马岛",
      "port": true
    },
    {
      "k": "tartu",
      "n": "塔尔图",
      "lon": 26.729,
      "lat": 58.378,
      "ct": "ee",
      "region": "爱沙尼亚东南部",
      "note": "独立爱沙尼亚的大学与地区中心",
      "major": true
    },
    {
      "k": "narva",
      "n": "纳尔瓦",
      "lon": 28.1903,
      "lat": 59.3772,
      "ct": "ee",
      "region": "爱沙尼亚东北部",
      "note": "1939年爱沙尼亚边境工业城市",
      "major": true
    },
    {
      "k": "liepaja",
      "n": "利耶帕亚",
      "lon": 21.0108,
      "lat": 56.5047,
      "ct": "lv",
      "region": "库尔兰",
      "note": "1939年独立拉脱维亚波罗的海港口",
      "major": true,
      "port": true
    },
    {
      "k": "daugavpils",
      "n": "陶格夫匹尔斯",
      "lon": 26.5362,
      "lat": 55.8747,
      "ct": "lv",
      "region": "拉特加尔",
      "note": "1939年独立拉脱维亚铁路枢纽",
      "major": true
    },
    {
      "k": "siauliai",
      "n": "希奥利艾",
      "lon": 23.3137,
      "lat": 55.9349,
      "ct": "lt",
      "region": "立陶宛北部",
      "note": "1939年独立立陶宛铁路与地区中心",
      "major": true
    },
    {
      "k": "brunsbuettel",
      "n": "布伦斯比特尔",
      "lon": 9.143,
      "lat": 53.897,
      "ct": "de",
      "region": "基尔运河西口",
      "note": "Kaiser-Wilhelm-Kanal／Kiel Canal，运河在易北河口的西端；连接北海与波罗的海",
      "major": true
    },
    {
      "k": "flensburg",
      "n": "弗伦斯堡",
      "lon": 9.436,
      "lat": 54.7937,
      "ct": "de",
      "region": "石勒苏益格",
      "note": "德国北部港口，靠近丹麦边界",
      "major": true,
      "port": true
    },
    {
      "k": "schwerin",
      "n": "什未林",
      "lon": 11.4075,
      "lat": 53.6355,
      "ct": "de",
      "region": "梅克伦堡",
      "note": "德国东北地区中心",
      "major": true
    },
    {
      "k": "limoges",
      "n": "利摩日",
      "lon": 1.2611,
      "lat": 45.8336,
      "ct": "fr",
      "region": "利穆赞",
      "note": "法国中部地区中心与交通节点",
      "major": true
    },
    {
      "k": "clermontferrand",
      "n": "克莱蒙费朗",
      "lon": 3.087,
      "lat": 45.7772,
      "ct": "fr",
      "region": "奥弗涅",
      "note": "法国中部工业城市",
      "major": true
    },
    {
      "k": "poitiers",
      "n": "普瓦捷",
      "lon": 0.3404,
      "lat": 46.5802,
      "ct": "fr",
      "region": "普瓦图",
      "note": "法国西部交通节点",
      "major": true
    },
    {
      "k": "amiens",
      "n": "亚眠",
      "lon": 2.2958,
      "lat": 49.8941,
      "ct": "fr",
      "region": "皮卡第",
      "note": "法国北部铁路枢纽",
      "major": true
    },
    {
      "k": "larochelle",
      "n": "拉罗谢尔",
      "lon": -1.1511,
      "lat": 46.1603,
      "ct": "fr",
      "region": "法国大西洋沿岸",
      "note": "法国大西洋港口",
      "major": true,
      "port": true
    },
    {
      "k": "perpignan",
      "n": "佩皮尼昂",
      "lon": 2.8956,
      "lat": 42.6887,
      "ct": "fr",
      "region": "鲁西永",
      "note": "法国南部与西班牙边境交通节点",
      "major": true
    },
    {
      "k": "livorno",
      "n": "里窝那",
      "lon": 10.3106,
      "lat": 43.5485,
      "ct": "it",
      "region": "托斯卡纳",
      "note": "意大利第勒尼安海港口",
      "major": true,
      "port": true
    },
    {
      "k": "verona",
      "n": "维罗纳",
      "lon": 10.9916,
      "lat": 45.4384,
      "ct": "it",
      "region": "威尼托",
      "note": "意大利东北铁路枢纽",
      "major": true
    },
    {
      "k": "perugia",
      "n": "佩鲁贾",
      "lon": 12.3888,
      "lat": 43.1107,
      "ct": "it",
      "region": "翁布里亚",
      "note": "意大利中部地区中心",
      "major": true
    },
    {
      "k": "pescara",
      "n": "佩斯卡拉",
      "lon": 14.2161,
      "lat": 42.4618,
      "ct": "it",
      "region": "阿布鲁佐",
      "note": "意大利亚得里亚海港口",
      "major": true,
      "port": true
    },
    {
      "k": "coimbra",
      "n": "科英布拉",
      "lon": -8.4292,
      "lat": 40.2033,
      "ct": "pt",
      "region": "葡萄牙中部",
      "note": "葡萄牙中部地区与交通中心",
      "major": true
    },
    {
      "k": "faro",
      "n": "法鲁",
      "lon": -7.9304,
      "lat": 37.0194,
      "ct": "pt",
      "region": "阿尔加维",
      "note": "葡萄牙南部港口",
      "major": true,
      "port": true
    },
    {
      "k": "patras",
      "n": "帕特雷",
      "lon": 21.7346,
      "lat": 38.2466,
      "ct": "gr",
      "region": "伯罗奔尼撒",
      "note": "希腊西部港口",
      "major": true,
      "port": true
    },
    {
      "k": "ioannina",
      "n": "约阿尼纳",
      "lon": 20.8537,
      "lat": 39.665,
      "ct": "gr",
      "region": "伊庇鲁斯",
      "note": "希腊西北部地区与山地交通中心",
      "major": true
    },
    {
      "k": "samsun",
      "n": "萨姆松",
      "lon": 36.3361,
      "lat": 41.2867,
      "ct": "tr",
      "region": "安纳托利亚黑海沿岸",
      "note": "土耳其黑海港口",
      "major": true,
      "port": true
    },
    {
      "k": "konya",
      "n": "科尼亚",
      "lon": 32.4846,
      "lat": 37.8746,
      "ct": "tr",
      "region": "安纳托利亚中部",
      "note": "土耳其内陆铁路与地区中心",
      "major": true
    },
    {
      "k": "erzurum",
      "n": "埃尔祖鲁姆",
      "lon": 41.2769,
      "lat": 39.9043,
      "ct": "tr",
      "region": "安纳托利亚东部",
      "note": "土耳其东部山地交通中心",
      "major": true
    },
    {
      "k": "zurich",
      "n": "苏黎世",
      "lon": 8.5417,
      "lat": 47.3769,
      "ct": "ch",
      "region": "瑞士东北部",
      "note": "瑞士工业、金融与铁路中心",
      "major": true
    },
    {
      "k": "geneva",
      "n": "日内瓦",
      "lon": 6.1432,
      "lat": 46.2044,
      "ct": "ch",
      "region": "日内瓦湖西端",
      "note": "瑞士西南城市，1939年国际联盟所在地",
      "major": true
    },
    {
      "k": "basel",
      "n": "巴塞尔",
      "lon": 7.5886,
      "lat": 47.5596,
      "ct": "ch",
      "region": "瑞士西北部",
      "note": "莱茵河港口与工业城市",
      "major": true
    },
    {
      "k": "lausanne",
      "n": "洛桑",
      "lon": 6.6323,
      "lat": 46.5197,
      "ct": "ch",
      "region": "沃州",
      "note": "日内瓦湖北岸地区中心",
      "major": true
    },
    {
      "k": "lucerne",
      "n": "卢塞恩",
      "lon": 8.3093,
      "lat": 47.0502,
      "ct": "ch",
      "region": "瑞士中部",
      "note": "瑞士中部湖区交通节点",
      "major": true
    },
    {
      "k": "lugano",
      "n": "卢加诺",
      "lon": 8.9511,
      "lat": 46.0037,
      "ct": "ch",
      "region": "提契诺",
      "note": "瑞士意大利语区代表城市",
      "major": true
    },
    {
      "k": "chur",
      "n": "库尔",
      "lon": 9.5319,
      "lat": 46.8508,
      "ct": "ch",
      "region": "格劳宾登",
      "note": "瑞士东南阿尔卑斯交通节点",
      "major": true
    },
    {
      "k": "leuven",
      "n": "鲁汶",
      "lon": 4.7005,
      "lat": 50.8798,
      "ct": "be",
      "region": "布拉班特",
      "note": "Leuven，比利时大学与铁路城市",
      "major": true
    },
    {
      "k": "namur",
      "n": "那慕尔",
      "lon": 4.8674,
      "lat": 50.4674,
      "ct": "be",
      "region": "瓦隆／默兹河",
      "note": "默兹河与桑布尔河交汇处的要塞城市",
      "major": true
    },
    {
      "k": "bruges",
      "n": "布鲁日",
      "lon": 3.2247,
      "lat": 51.2093,
      "ct": "be",
      "region": "西佛兰德",
      "note": "比利时西北地区中心；包括泽布吕赫港的腹地",
      "major": true
    },
    {
      "k": "thehague",
      "n": "海牙",
      "lon": 4.3007,
      "lat": 52.0705,
      "ct": "nl",
      "region": "南荷兰",
      "note": "Den Haag，荷兰政府所在地；法定首都仍为阿姆斯特丹",
      "major": true
    },
    {
      "k": "utrecht",
      "n": "乌德勒支",
      "lon": 5.1214,
      "lat": 52.0907,
      "ct": "nl",
      "region": "荷兰中部",
      "note": "荷兰铁路枢纽",
      "major": true
    },
    {
      "k": "breda",
      "n": "布雷达",
      "lon": 4.776,
      "lat": 51.5719,
      "ct": "nl",
      "region": "北布拉班特",
      "note": "荷兰南部交通节点",
      "major": true
    },
    {
      "k": "groningen",
      "n": "格罗宁根",
      "lon": 6.5665,
      "lat": 53.2194,
      "ct": "nl",
      "region": "荷兰东北部",
      "note": "北部地区中心",
      "major": true
    },
    {
      "k": "maastricht",
      "n": "马斯特里赫特",
      "lon": 5.6909,
      "lat": 50.8514,
      "ct": "nl",
      "region": "林堡",
      "note": "荷兰东南默兹河交通节点",
      "major": true
    },
    {
      "k": "odense",
      "n": "欧登塞",
      "lon": 10.3883,
      "lat": 55.4038,
      "ct": "dk",
      "region": "菲英岛",
      "note": "Odense，菲英岛地区中心",
      "major": true
    },
    {
      "k": "aalborg",
      "n": "奥尔堡",
      "lon": 9.9217,
      "lat": 57.0488,
      "ct": "dk",
      "region": "北日德兰",
      "note": "Aalborg，利姆水道港口和北日德兰交通节点",
      "major": true
    },
    {
      "k": "esbjerg",
      "n": "埃斯比约",
      "lon": 8.4519,
      "lat": 55.4765,
      "ct": "dk",
      "region": "西日德兰",
      "note": "丹麦北海港口",
      "major": true,
      "port": true
    },
    {
      "k": "lulea",
      "n": "吕勒奥",
      "lon": 22.1567,
      "lat": 65.5848,
      "ct": "se",
      "region": "北博滕／瑞典北部",
      "note": "Luleå，波的尼亚湾铁矿出口港",
      "major": true
    },
    {
      "k": "umea",
      "n": "于默奥",
      "lon": 20.263,
      "lat": 63.8258,
      "ct": "se",
      "region": "西博滕／瑞典北部",
      "note": "Umeå，瑞典北部沿海地区中心",
      "major": true
    },
    {
      "k": "gavle",
      "n": "耶夫勒",
      "lon": 17.1413,
      "lat": 60.6749,
      "ct": "se",
      "region": "耶斯特里克兰",
      "note": "Gävle，波的尼亚湾沿岸工业与港口城市",
      "major": true
    },
    {
      "k": "uppsala",
      "n": "乌普萨拉",
      "lon": 17.6389,
      "lat": 59.8586,
      "ct": "se",
      "region": "乌普兰",
      "note": "Uppsala，瑞典中部大学城市",
      "major": true
    },
    {
      "k": "jonkoping",
      "n": "延雪平",
      "lon": 14.1618,
      "lat": 57.7826,
      "ct": "se",
      "region": "斯莫兰／韦特恩湖",
      "note": "Jönköping，瑞典南部工业与交通中心",
      "major": true
    },
    {
      "k": "linkoping",
      "n": "林雪平",
      "lon": 15.6214,
      "lat": 58.4108,
      "ct": "se",
      "region": "东约特兰",
      "note": "Linköping，瑞典航空工业与地区中心",
      "major": true
    },
    {
      "k": "norrkoping",
      "n": "北雪平",
      "lon": 16.1924,
      "lat": 58.5877,
      "ct": "se",
      "region": "东约特兰",
      "note": "Norrköping，瑞典东岸工业港城",
      "major": true
    },
    {
      "k": "kiruna",
      "n": "基律纳",
      "lon": 20.2253,
      "lat": 67.8558,
      "ct": "se",
      "region": "拉普兰／瑞典北部",
      "note": "Kiruna，铁矿产区；使用旧城位置，非现代搬迁新城",
      "major": true
    },
    {
      "k": "ostersund",
      "n": "厄斯特松",
      "lon": 14.6357,
      "lat": 63.1792,
      "ct": "se",
      "region": "耶姆特兰",
      "note": "Östersund，瑞典西北内陆地区中心",
      "major": true
    },
    {
      "k": "sundsvall",
      "n": "松兹瓦尔",
      "lon": 17.3069,
      "lat": 62.3908,
      "ct": "se",
      "region": "梅德尔帕德",
      "note": "Sundsvall，瑞典中北部沿海工业城市",
      "major": true
    },
    {
      "k": "orebro",
      "n": "厄勒布鲁",
      "lon": 15.2134,
      "lat": 59.2753,
      "ct": "se",
      "region": "内尔克",
      "note": "Örebro，瑞典中部内陆交通节点",
      "major": true
    },
    {
      "k": "karlstad",
      "n": "卡尔斯塔德",
      "lon": 13.5036,
      "lat": 59.3793,
      "ct": "se",
      "region": "韦姆兰／维纳恩湖",
      "note": "Karlstad，瑞典西部湖区地区中心",
      "major": true
    },
    {
      "k": "vaasa",
      "n": "瓦萨",
      "lon": 21.6158,
      "lat": 63.0951,
      "ct": "fi",
      "region": "博滕区",
      "note": "Vaasa，芬兰西岸港口",
      "major": true
    },
    {
      "k": "kuopio",
      "n": "库奥皮奥",
      "lon": 27.677,
      "lat": 62.8924,
      "ct": "fi",
      "region": "萨沃",
      "note": "Kuopio，芬兰东部湖区代表城市",
      "major": true
    },
    {
      "k": "pori",
      "n": "波里",
      "lon": 21.7974,
      "lat": 61.4851,
      "ct": "fi",
      "region": "萨塔昆塔",
      "note": "Pori，芬兰西部工业与港口城市",
      "major": true
    },
    {
      "k": "rovaniemi",
      "n": "罗瓦涅米",
      "lon": 25.7294,
      "lat": 66.5039,
      "ct": "fi",
      "region": "拉普兰",
      "note": "Rovaniemi，芬兰北部交通节点",
      "major": true
    },
    {
      "k": "jyvaskyla",
      "n": "于韦斯屈莱",
      "lon": 25.7473,
      "lat": 62.2426,
      "ct": "fi",
      "region": "中芬兰",
      "note": "Jyväskylä，芬兰内陆地区中心",
      "major": true
    },
    {
      "k": "joensuu",
      "n": "约恩苏",
      "lon": 29.7636,
      "lat": 62.601,
      "ct": "fi",
      "region": "北卡累利阿",
      "note": "Joensuu，芬兰东部交通节点",
      "major": true
    },
    {
      "k": "kajaani",
      "n": "卡亚尼",
      "lon": 27.7278,
      "lat": 64.227,
      "ct": "fi",
      "region": "凯努",
      "note": "Kajaani，芬兰东北内陆地区中心",
      "major": true
    },
    {
      "k": "gaziantep",
      "n": "加济安泰普",
      "lon": 37.3781,
      "lat": 37.0662,
      "ct": "tr",
      "region": "安纳托利亚东南部",
      "note": "Gaziantep，土耳其东南商业与交通城市",
      "major": true
    },
    {
      "k": "malatya",
      "n": "马拉蒂亚",
      "lon": 38.3095,
      "lat": 38.3552,
      "ct": "tr",
      "region": "安纳托利亚东部",
      "note": "Malatya，土耳其东部铁路节点",
      "major": true
    },
    {
      "k": "kastamonu",
      "n": "卡斯塔莫努",
      "lon": 33.7765,
      "lat": 41.3887,
      "ct": "tr",
      "region": "黑海沿岸腹地",
      "note": "Kastamonu，土耳其北部内陆地区中心",
      "major": true
    },
    {
      "k": "bursa",
      "n": "布尔萨",
      "lon": 29.061,
      "lat": 40.195,
      "ct": "tr",
      "region": "马尔马拉地区",
      "note": "Bursa，土耳其西北工业城市",
      "major": true
    },
    {
      "k": "adana",
      "n": "阿达纳",
      "lon": 35.3213,
      "lat": 37,
      "ct": "tr",
      "region": "奇里乞亚",
      "note": "Adana，土耳其南部平原与铁路枢纽",
      "major": true
    },
    {
      "k": "antalya",
      "n": "安塔利亚",
      "lon": 30.7133,
      "lat": 36.8969,
      "ct": "tr",
      "region": "安纳托利亚西南部",
      "note": "Antalya，土耳其地中海港口",
      "major": true,
      "port": true
    },
    {
      "k": "kayseri",
      "n": "开塞利",
      "lon": 35.4826,
      "lat": 38.7225,
      "ct": "tr",
      "region": "安纳托利亚中部",
      "note": "Kayseri，内陆工业与铁路节点",
      "major": true
    },
    {
      "k": "sivas",
      "n": "锡瓦斯",
      "lon": 37.015,
      "lat": 39.7505,
      "ct": "tr",
      "region": "安纳托利亚中东部",
      "note": "Sivas，土耳其东西向铁路枢纽",
      "major": true
    },
    {
      "k": "diyarbakir",
      "n": "迪亚巴克尔",
      "lon": 40.2306,
      "lat": 37.9144,
      "ct": "tr",
      "region": "安纳托利亚东南部",
      "note": "Diyarbakır，底格里斯河上游地区中心",
      "major": true
    },
    {
      "k": "van",
      "n": "凡城",
      "lon": 43.373,
      "lat": 38.5012,
      "ct": "tr",
      "region": "凡湖地区",
      "note": "Van，土耳其东部湖区城市",
      "major": true
    },
    {
      "k": "stavanger",
      "n": "斯塔万格",
      "lon": 5.7331,
      "lat": 58.97,
      "ct": "no",
      "region": "罗加兰",
      "note": "挪威西南港口",
      "major": true,
      "port": true
    },
    {
      "k": "kristiansand",
      "n": "克里斯蒂安桑",
      "lon": 7.9956,
      "lat": 58.1467,
      "ct": "no",
      "region": "阿格德",
      "note": "挪威南岸港口",
      "major": true,
      "port": true
    },
    {
      "k": "bodo",
      "n": "博德",
      "lon": 14.4049,
      "lat": 67.2804,
      "ct": "no",
      "region": "诺尔兰",
      "note": "挪威北部沿海港口",
      "major": true,
      "port": true
    },
    {
      "k": "alesund",
      "n": "奥勒松",
      "lon": 6.1549,
      "lat": 62.4722,
      "ct": "no",
      "region": "默勒海岸",
      "note": "挪威西岸渔业港口",
      "major": true,
      "port": true
    },
    {
      "k": "bydgoszcz",
      "n": "比得哥什",
      "lon": 18.0084,
      "lat": 53.1235,
      "ct": "pl",
      "region": "波美拉尼亚",
      "note": "1939年波兰北部交通城市",
      "major": true
    },
    {
      "k": "czestochowa",
      "n": "琴斯托霍瓦",
      "lon": 19.1203,
      "lat": 50.8118,
      "ct": "pl",
      "region": "波兰中南部",
      "note": "波兰工业与铁路节点",
      "major": true
    },
    {
      "k": "kielce",
      "n": "凯尔采",
      "lon": 20.6286,
      "lat": 50.8661,
      "ct": "pl",
      "region": "圣十字地区",
      "note": "波兰中部工业地区中心",
      "major": true
    },
    {
      "k": "rzeszow",
      "n": "热舒夫",
      "lon": 21.9991,
      "lat": 50.0412,
      "ct": "pl",
      "region": "波兰东南部",
      "note": "波兰东南交通与工业城市",
      "major": true
    },
    {
      "k": "luck",
      "n": "卢茨克",
      "lon": 25.3254,
      "lat": 50.7472,
      "ct": "pl",
      "region": "沃里尼亚",
      "note": "Łuck，今乌克兰卢茨克；1939年8月属波兰",
      "major": true
    },
    {
      "k": "rowno",
      "n": "罗夫诺",
      "lon": 26.2516,
      "lat": 50.6199,
      "ct": "pl",
      "region": "沃里尼亚",
      "note": "Równe，今里夫内；1939年8月属波兰",
      "major": true
    },
    {
      "k": "pinsk",
      "n": "平斯克",
      "lon": 26.0728,
      "lat": 52.1229,
      "ct": "pl",
      "region": "波列西耶",
      "note": "今白俄罗斯境内；1939年8月属波兰",
      "major": true
    },
    {
      "k": "tarnopol",
      "n": "塔尔诺波尔",
      "lon": 25.5948,
      "lat": 49.5535,
      "ct": "pl",
      "region": "波兰东南部",
      "note": "Tarnopol，今捷尔诺波尔；1939年8月属波兰",
      "major": true
    },
    {
      "k": "vologda",
      "n": "沃洛格达",
      "lon": 39.8915,
      "lat": 59.2205,
      "ct": "su",
      "region": "苏联北部",
      "note": "通往白海与东北地区的铁路枢纽",
      "major": true
    },
    {
      "k": "cherepovets",
      "n": "切列波韦茨",
      "lon": 37.9069,
      "lat": 59.1269,
      "ct": "su",
      "region": "舍克斯纳河",
      "note": "苏联北部河运与铁路节点；不提前标注战后大型钢铁联合企业",
      "major": true
    },
    {
      "k": "ivanovo",
      "n": "伊万诺沃",
      "lon": 40.9737,
      "lat": 56.9995,
      "ct": "su",
      "region": "苏联中部",
      "note": "纺织工业中心",
      "major": true
    },
    {
      "k": "vladimir",
      "n": "弗拉基米尔",
      "lon": 40.4066,
      "lat": 56.1291,
      "ct": "su",
      "region": "苏联中部",
      "note": "莫斯科以东交通节点",
      "major": true
    },
    {
      "k": "bologoye",
      "n": "博洛戈耶",
      "lon": 34.1058,
      "lat": 57.8859,
      "ct": "su",
      "region": "瓦尔代地区",
      "note": "莫斯科—列宁格勒铁路枢纽",
      "major": true
    },
    {
      "k": "velizh",
      "n": "韦利日",
      "lon": 31.1969,
      "lat": 55.6058,
      "ct": "su",
      "region": "苏联西部",
      "note": "西德维纳河上游地区节点",
      "major": true
    },
    {
      "k": "roslavl",
      "n": "罗斯拉夫尔",
      "lon": 32.8639,
      "lat": 53.9474,
      "ct": "su",
      "region": "苏联西部",
      "note": "斯摩棱斯克以南铁路节点",
      "major": true
    },
    {
      "k": "vyazma",
      "n": "维亚济马",
      "lon": 34.298,
      "lat": 55.2104,
      "ct": "su",
      "region": "苏联西部",
      "note": "莫斯科西侧铁路与战役节点",
      "major": true
    },
    {
      "k": "belgorod",
      "n": "别尔哥罗德",
      "lon": 36.5872,
      "lat": 50.5997,
      "ct": "su",
      "region": "苏联西南部",
      "note": "库尔斯克—哈尔科夫之间的交通节点",
      "major": true
    },
    {
      "k": "mariupol",
      "n": "马里乌波尔",
      "lon": 37.5434,
      "lat": 47.0971,
      "ct": "su",
      "region": "乌克兰／亚速海",
      "note": "1939年苏联港口与冶金工业城市",
      "major": true,
      "port": true
    },
    {
      "k": "nice",
      "n": "尼斯",
      "lon": 7.262,
      "lat": 43.7102,
      "ct": "fr",
      "region": "普罗旺斯东部",
      "note": "法国地中海沿岸城市",
      "major": true
    },
    {
      "k": "besancon",
      "n": "贝桑松",
      "lon": 6.0241,
      "lat": 47.2378,
      "ct": "fr",
      "region": "弗朗什孔泰",
      "note": "法国东部地区中心",
      "major": true
    },
    {
      "k": "lemans",
      "n": "勒芒",
      "lon": 0.1996,
      "lat": 48.0061,
      "ct": "fr",
      "region": "曼恩",
      "note": "法国西部铁路与工业节点",
      "major": true
    },
    {
      "k": "angers",
      "n": "昂热",
      "lon": -0.5632,
      "lat": 47.4784,
      "ct": "fr",
      "region": "安茹",
      "note": "卢瓦尔河流域地区中心",
      "major": true
    },
    {
      "k": "pau",
      "n": "波城",
      "lon": -0.3708,
      "lat": 43.2951,
      "ct": "fr",
      "region": "贝阿恩",
      "note": "比利牛斯北麓地区中心",
      "major": true
    },
    {
      "k": "parma",
      "n": "帕尔马",
      "lon": 10.3279,
      "lat": 44.8015,
      "ct": "it",
      "region": "艾米利亚",
      "note": "Parma，意大利内陆城市；区别于西班牙马略卡岛Palma",
      "major": true
    },
    {
      "k": "udine",
      "n": "乌迪内",
      "lon": 13.2346,
      "lat": 46.0711,
      "ct": "it",
      "region": "弗留利",
      "note": "1939年意大利东北地区中心",
      "major": true
    },
    {
      "k": "lecce",
      "n": "莱切",
      "lon": 18.1718,
      "lat": 40.3515,
      "ct": "it",
      "region": "萨伦托",
      "note": "意大利东南半岛地区中心",
      "major": true
    },
    {
      "k": "reggiocalabria",
      "n": "雷焦卡拉布里亚",
      "lon": 15.65,
      "lat": 38.1113,
      "ct": "it",
      "region": "卡拉布里亚",
      "note": "墨西拿海峡东岸港城，与西西里隔海",
      "major": true,
      "port": true
    },
    {
      "k": "leon",
      "n": "莱昂",
      "lon": -5.5718,
      "lat": 42.5987,
      "ct": "es",
      "region": "莱昂",
      "note": "西班牙西北内陆地区中心",
      "major": true
    },
    {
      "k": "badajoz",
      "n": "巴达霍斯",
      "lon": -6.9707,
      "lat": 38.8794,
      "ct": "es",
      "region": "埃斯特雷马杜拉",
      "note": "西班牙西部边境城市",
      "major": true
    },
    {
      "k": "albacete",
      "n": "阿尔瓦塞特",
      "lon": -1.8585,
      "lat": 38.9943,
      "ct": "es",
      "region": "拉曼恰",
      "note": "西班牙东南内陆交通节点",
      "major": true
    },
    {
      "k": "braga",
      "n": "布拉加",
      "lon": -8.4265,
      "lat": 41.5454,
      "ct": "pt",
      "region": "米尼奥",
      "note": "葡萄牙北部地区中心",
      "major": true
    },
    {
      "k": "evora",
      "n": "埃武拉",
      "lon": -7.9097,
      "lat": 38.5714,
      "ct": "pt",
      "region": "阿连特茹",
      "note": "葡萄牙中南部内陆地区中心",
      "major": true
    },
    {
      "k": "oxford",
      "n": "牛津",
      "lon": -1.2577,
      "lat": 51.752,
      "ct": "uk",
      "region": "英格兰中南部",
      "note": "英国大学与工业城市",
      "major": true
    },
    {
      "k": "cambridge",
      "n": "剑桥",
      "lon": 0.1218,
      "lat": 52.2053,
      "ct": "uk",
      "region": "东安格利亚西部",
      "note": "英国大学与科研城市",
      "major": true
    },
    {
      "k": "carlisle",
      "n": "卡莱尔",
      "lon": -2.9382,
      "lat": 54.8925,
      "ct": "uk",
      "region": "坎布里亚",
      "note": "英格兰西北与苏格兰之间交通节点",
      "major": true
    },
    {
      "k": "dundee",
      "n": "邓迪",
      "lon": -2.9707,
      "lat": 56.462,
      "ct": "uk",
      "region": "苏格兰东岸",
      "note": "泰河口港城与工业中心",
      "major": true
    },
    {
      "k": "sligo",
      "n": "斯莱戈",
      "lon": -8.4761,
      "lat": 54.2766,
      "ct": "ie",
      "region": "爱尔兰西北部",
      "note": "爱尔兰西北港城与地区中心",
      "major": true
    },
    {
      "k": "bacau",
      "n": "巴克乌",
      "lon": 26.9146,
      "lat": 46.567,
      "ct": "ro",
      "region": "摩尔达维亚",
      "note": "罗马尼亚东部地区中心",
      "major": true
    },
    {
      "k": "suceava",
      "n": "苏恰瓦",
      "lon": 26.2556,
      "lat": 47.6514,
      "ct": "ro",
      "region": "布科维纳南部",
      "note": "1939年罗马尼亚北部地区城市",
      "major": true
    },
    {
      "k": "szolnok",
      "n": "索尔诺克",
      "lon": 20.194,
      "lat": 47.1621,
      "ct": "hu",
      "region": "匈牙利中东部",
      "note": "蒂萨河铁路与渡河节点",
      "major": true
    },
    {
      "k": "kecskemet",
      "n": "凯奇凯梅特",
      "lon": 19.6913,
      "lat": 46.8964,
      "ct": "hu",
      "region": "匈牙利大平原",
      "note": "多瑙河与蒂萨河之间的地区中心",
      "major": true
    },
    {
      "k": "kragujevac",
      "n": "克拉古耶瓦茨",
      "lon": 20.9114,
      "lat": 44.0128,
      "ct": "yu",
      "region": "舒马迪亚",
      "note": "南斯拉夫军工城市",
      "major": true
    },
    {
      "k": "pristina",
      "n": "普里什蒂纳",
      "lon": 21.1655,
      "lat": 42.6629,
      "ct": "yu",
      "region": "科索沃",
      "note": "1939年南斯拉夫境内地区中心",
      "major": true
    },
    {
      "k": "pleven",
      "n": "普列文",
      "lon": 24.6067,
      "lat": 43.417,
      "ct": "bg",
      "region": "保加利亚北部",
      "note": "保加利亚北部交通节点",
      "major": true
    },
    {
      "k": "vidin",
      "n": "维丁",
      "lon": 22.8725,
      "lat": 43.9962,
      "ct": "bg",
      "region": "保加利亚西北部",
      "note": "多瑙河港口",
      "major": true
    },
    {
      "k": "larissa",
      "n": "拉里萨",
      "lon": 22.4191,
      "lat": 39.639,
      "ct": "gr",
      "region": "色萨利",
      "note": "希腊中部平原与铁路中心",
      "major": true
    },
    {
      "k": "kalamata",
      "n": "卡拉马塔",
      "lon": 22.1142,
      "lat": 37.0389,
      "ct": "gr",
      "region": "伯罗奔尼撒南部",
      "note": "希腊南部港口",
      "major": true
    },
    {
      "k": "zilina",
      "n": "日利纳",
      "lon": 18.7408,
      "lat": 49.2231,
      "ct": "sk",
      "region": "斯洛伐克西北部",
      "note": "1939年斯洛伐克铁路枢纽",
      "major": true
    },
    {
      "k": "banskabystrica",
      "n": "班斯卡比斯特里察",
      "lon": 19.1462,
      "lat": 48.7363,
      "ct": "sk",
      "region": "斯洛伐克中部",
      "note": "1944年斯洛伐克民族起义中心；地图仍为1939年",
      "major": true
    },
    {
      "k": "durres",
      "n": "都拉斯",
      "lon": 19.4565,
      "lat": 41.3231,
      "ct": "al",
      "region": "阿尔巴尼亚沿海",
      "note": "1939年意大利占领下的阿尔巴尼亚港口",
      "major": true,
      "port": true
    },
    {
      "k": "korce",
      "n": "科尔察",
      "lon": 20.7808,
      "lat": 40.6186,
      "ct": "al",
      "region": "阿尔巴尼亚东南部",
      "note": "1939年意占阿尔巴尼亚内陆地区中心",
      "major": true
    },
    {
      "k": "akureyri",
      "n": "阿克雷里",
      "lon": -18.0878,
      "lat": 65.6885,
      "ct": "is",
      "region": "冰岛北部",
      "note": "冰岛北岸港城",
      "major": true,
      "port": true
    },
    {
      "k": "parnu",
      "n": "派尔努",
      "lon": 24.4971,
      "lat": 58.3859,
      "ct": "ee",
      "region": "爱沙尼亚西南部",
      "note": "1939年独立爱沙尼亚港城",
      "major": true
    },
    {
      "k": "ventspils",
      "n": "文茨皮尔斯",
      "lon": 21.558,
      "lat": 57.3937,
      "ct": "lv",
      "region": "库尔兰北部",
      "note": "1939年独立拉脱维亚港口",
      "major": true,
      "port": true
    },
    {
      "k": "panevezys",
      "n": "帕内韦日斯",
      "lon": 24.351,
      "lat": 55.7348,
      "ct": "lt",
      "region": "立陶宛东北部",
      "note": "1939年独立立陶宛地区中心",
      "major": true
    },
    {
      "k": "olomouc",
      "n": "奥洛穆茨",
      "lon": 17.2509,
      "lat": 49.5938,
      "ct": "bm",
      "region": "摩拉维亚",
      "note": "1939年波希米亚和摩拉维亚保护国内的城市",
      "major": true
    }
  ]
};
})();
