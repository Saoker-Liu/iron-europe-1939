# 地图依据与尺度

## 开局与动态边界

地图以1939年8月31日欧洲国界为开局底图，战役从1939年9月开始，每回合一个月。128×112格，格心间距约45公里，采用兰伯特等角圆锥投影；436处城市、港口与基地均有独立城市格。

`HOME_COUNTRIES`保存开局归属，战役中的割让和吞并会改变法律归属，占领会改变城市及附属格控制权。政区颜色、国家边界与悬停提示按当前控制国显示。多个等距城市共同依附的领土，只有在这些城市归同一占领国时才转移；详见[外交与领土规则](DIPLOMACY.md)。地理地区名称不随控制权改名。

## 数据与许可

海岸、岛屿、天然湖泊与河流来自Natural Earth 1:50m公共领域数据。历史底图使用André Ourednik的Historical Basemaps `world_1938.geojson`，再按1939年事件校订；原始及衍生历史地图数据采用随附GPL-3.0许可。来源、下载日期与SHA-256见 `map_sources/manifest.json`；许可证见 `map_sources/LICENSE-historical-basemaps.txt`。这些文件参与离线重建，不能删除。

城市维护WGS84经纬度，由构建器按国家分配格位，港口要求邻海；候选格偏移小于60公里。狭小国家、岛屿和飞地用一格保留，不能理解为精确面积。森林、丘陵和山脉是区域示意，不是1939年逐格土地覆盖调查。

## 当前历史与地理校订

- 奥地利、苏台德及东普鲁士归德国；柯尼斯堡附近不残留现代苏联／俄罗斯飞地。波希米亚和摩拉维亚作为德国控制的保护国单列，斯洛伐克单列。
- 波兰开局保有东部地区和波兰走廊，但泽自由市与格丁尼亚分开。匈牙利保有战前获得的南斯洛伐克和喀尔巴阡鲁塞尼亚；不提前采用战后国界。
- 芬兰保留冬季战争前范围和维堡；波罗的海三国开局独立；罗马尼亚开局保有比萨拉比亚、北特兰西瓦尼亚与南多布罗加。
- 意大利保有阜姆、扎拉和十二群岛；阿尔巴尼亚为意大利控制地区。土耳其首都安卡拉。马耳他、塞浦路斯、直布罗陀归英国；马恩岛和泽西等王室属地在游戏中并入英国。奥兰属于芬兰并设置非军事区。
- 彼列科普保留克里米亚与大陆连接；克里特岛、康沃尔与北挪威半岛保持连续。芬兰伊纳里湖旁的孤立挪威边界碎片改归芬兰。扬马延岛保留，代表气象站／登陆补给点，不视为大型正规军港。
- 博恩霍尔姆、菲英岛、哥特兰、萨列马岛及法罗群岛等保留相应岛屿位置；英国与主要岛屿不增加虚构陆桥。海峡禁行边防止六边形接触造成陆军步行过海。
- 荷兰艾瑟尔湖按湖泊处理；布里斯托尔湾、汉堡易北河口、列宁格勒进港水道和挪威内湾保持外海连接。海洋与湖泊使用不同通行规则。
- 莱茵、多瑙、第聂伯、伏尔加、乌拉尔等河流可见，跨河规则独立于河流文字。主要天然湖泊被保留，不提前绘入战后大型水库。
- 基尔运河按实际走向概化为青色地理水道，显示“威廉皇帝运河”历史名称。它不构成一格宽海峡，目前没有舰艇穿越、船闸或运河通行权机制。

## 海陆移动与标签

不存在固定海运航线或城市传送边。陆军购买运输装备后沿相邻海格航行；上下船耗尽行动。军舰通过真实狭窄海峡的抽象水面连接航行，按格距消耗移动力；陆军不能借此步行横穿。

国家和大区、次级地区、局部地区分别在不同缩放层显示；地区名称逐级替换。城市名称逐级累加，全部城市名在最大缩放前已开放。机场、军港、工厂标志只在局部及更大缩放显示。低于地图尺度的海峡与岛屿文字可使用引线；标签不是新的国家或地形。

## 重建、导出与存档

运行 `node build_map.js --write` 重建，再以 `node build_map.js --check` 验证。源文件与生成器均随仓库保留，过程不依赖下载。维护流程见[开发说明](DEVELOPMENT.md)。

[政区图](artifacts/europe-1939-political.png)和[地形图](artifacts/europe-1939-terrain.png)是当前开局数据导出，不能代表战役中后续的动态边界。可用 `python artifacts/render-map.py` 重绘；地名层级与局部港口等PNG同样由该脚本生成。

当前地图版本 `europe-1939-geographic-v8`，海岸修订号2。兼容存档在明确校正的海岸格上迁移失去合法地形的单位，避免叠格，保留属性；不会任意修正其它非法位置。不同旧地图版本不能直接按坐标载入，请开始新战役。不存在独立“浏览1939地图”入口，可通过正式战役的“地图全览”和“隐藏部队”查看。

## 地理与历史核对资料

- [Natural Earth 1:50m 数据](https://www.naturalearthdata.com/downloads/50m-physical-vectors/)
- [Historical Basemaps `world_1938.geojson`](https://github.com/aourednik/historical-basemaps)
- [USHMM：1939年9月入侵波兰地图](https://encyclopedia.ushmm.org/content/en/map/german-invasion-of-poland-september-1939)
- [USHMM：捷克斯洛伐克及1938—1939年分割](https://encyclopedia.ushmm.org/content/en/article/czechoslovakia)
- [美国国家档案馆：捷克斯洛伐克](https://www.archives.gov/research/holocaust/finding-aid/civilian/rg-84-czech.html)
- [USHMM：1939年3月梅梅尔](https://encyclopedia.ushmm.org/content/en/photo/hitler-enters-memel)
- [意大利总统府历史档案：1939年占领阿尔巴尼亚](https://archivio.quirinale.it/aspr/gianni-bisiach/AV-002-001628/8-aprile-1939-l-italia-occupa-l-albania-1)
- [扎达尔旅游局：1920年成为意大利飞地、二战末归属变化](https://zadar.travel/attractions/history/)
- [英国国防部：卡昂战役、诺曼底与瑟堡港](https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/30055/ww2_caen.pdf)
- [里耶卡市政府：1924年后意大利统治历史](https://www.rijeka.hr/en/city-government/history-of-rijeka/)
- [奥克尼地方政府：莱尼斯基地与斯卡帕湾](https://www.orkney.gov.uk/latest-news/scapa-flow-museum-set-to-welcome-visitors-again-from-2-july/)
- [法罗群岛官方历史时间表：1940年英国进驻](https://www.faroeislands.fo/the-big-picture/history-of-the-faroe-islands/historical-timeline)
- [博恩霍尔姆博物馆：二战与1945年事件](https://bornholmsmuseum.dk/en/visit/bornholm-museum/permanent-exhibitions/ww-ii-cold-war/)
- [泽西政府：1940年占领及解放历史](https://www.gov.je/Leisure/Liberation/pages/liberationhistory.aspx)
- [挪威极地研究所：扬马延位置、气象站与1930年归属](https://npolar.no/tema/jan-mayen/)
- [挪威极地研究所地名库：扬马延无港口及登陆条件](https://data.npolar.no/placename/7e2f0e25-8004-57d7-9818-8b705df326dc)
- [西班牙政府《Mar》：帕尔马港历史](https://revistamar.seg-social.es/en/-/150-a%C3%B1os-de-historia)
- [博恩霍尔姆旅游机构：伦讷](https://bornholm.info/en/roenne/)
- [布里斯托尔港：埃文茅斯与港区历史](https://www.bristolport.co.uk/about-us/our-history/)
- [马恩岛政府：英国王室属地地位](https://www.gov.im/about-the-government/departments/cabinet-office/media-centre/isle-of-man-an-overview/)
- [瑞典旅游机构：哥特兰岛维斯比](https://visitsweden.com/where-to-go/southern-sweden/gotland/visby/)
- [芬兰外交部：奥兰的特殊地位与1921年安排](https://um.fi/the-special-status-of-the-aland-islands)
- [兹雷尼亚宁市政府：彼得罗夫格勒历史名称](https://starisajt.zrenjanin.rs/en/about-the-city/history)
- [威廉港市政府：城市与军港历史](https://www.wilhelmshaven.de/Tourismus/Stadtportrait/Historie.php)
- [埃里温市政府：苏维埃亚美尼亚首府历史](https://www.yerevan.am/en/old-yerevan/)
- [德国北部水路航运局：基尔运河路线和通航历史](https://www.kuestendaten.de/media/zdm/kuestendaten/publikationen/Datencontainer/N/NOK_-2011-06-15Druck.pdf)
- [基尔运河代理机构UCA：历史、长度和两端港口](https://www.kiel-canal.de/history/)
- [爱沙尼亚旅游机构：萨列马岛与库雷萨雷](https://visitestonia.com/en/where-to-go/top-islands-to-visit-in-estonia)
- [诺夫哥罗德博物馆：1941—1944年当地战争历史](https://novgorodmuseum.ru/visit/sobytiya/put-k-pobede.-raznye-sudby-odnoj-vojny)
- [喀山市政府：城市历史与鞑靼自治共和国](https://kzn.ru/o-kazani/istoriya-kazani/?lang=ru)
- [瑞士旅游机构：苏黎世、日内瓦、巴塞尔等城市](https://help.myswitzerland.com/hc/en-us/articles/213795065-Which-cities-must-I-not-miss-during-my-stay)
- [丹麦旅游机构：欧登塞位于菲英岛](https://www.visitdenmark.com/travel-trade/sales-and-marketing-tools/itinerary-odense-funen)
- [吕勒奥市政府：港口、铁路及城市历史](https://www.lulea.se/kommun--politik/fakta-och-statistik/fakta-om-lulea-kommun.html)
- [土耳其官方旅游机构：卡斯塔莫努](https://kastamonu.goturkiye.com/)
- [土耳其官方旅游机构：加济安泰普](https://goturkiye.com/tr/gaziantep)
- [土耳其官方旅游机构：布尔萨](https://goturkiye.com/bursa/routes)
- [英国国家档案馆：1939—1947年苏联领土变化](https://www.nationalarchives.gov.uk/education/resources/cold-war-on-file/soviet-territories-1939-1947/)
- [英国皇家空军历史资料：十二群岛及1939边界](https://www.raf.mod.uk/what-we-do/our-history/air-historical-branch/second-world-war-campaign-narratives/operations-in-the-dodecanese-islands-sep-nov-1943/)
- [美国国会图书馆：高加索地图史及1937—1939年地图集](https://guides.loc.gov/caucasus-maps/contents-history)
- [国家地理学会：欧洲自然地理](https://education.nationalgeographic.org/resource/europe-physical-geography/)
- [美国海军历史与遗产司令部：LST-383](https://www.history.navy.mil/content/history/museums/nmusn/explore/photography/ships-us/ships-usn-l/uss-lst-383.html/1000)
- [美国海军历史与遗产司令部：诺曼底登陆运输与突击艇](https://www.history.navy.mil/browse-by-topic/wars-conflicts-and-operations/world-war-ii/1944/overlord.html)
- [荷兰水利署：艾瑟尔湖](https://www.rijkswaterstaat.nl/water/vaarwegenoverzicht/ijsselmeer)
- [阿夫鲁戴克大堤](https://www.rijkswaterstaat.nl/water/waterbeheer/bescherming-tegen-het-water/waterkeringen/dijken/afsluitdijk)
- [贝特斯塔峡湾地理资料](https://www.steinkjerleksikonet.no/beitstadfjorden)
- [奥克拉峡湾当地资料](https://akrafjorden.no/experiences/camp-akrafjorden)
