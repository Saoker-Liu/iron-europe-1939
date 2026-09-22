# Iron Europe 1939: Standalone Project Document

**Project Document — English Edition**

| Document field | Value |
|---|---|
| Document version | 1.0 |
| Date | 22 September 2026 |
| Code baseline | `e704c606cecdaf2078ff841f9a2dbf21a1cc01da` |
| Product | A bilingual, online/offline, single-player browser strategy game |
| Repository | [GitHub repository](https://github.com/ttdnx2999-cmd/test_collab) |
| Online game | [GitHub Pages](https://ttdnx2999-cmd.github.io/test_collab/) |
| Audience | Reviewers, contributors, future developers and players |

This document is intended to stand alone. It explains the project’s purpose, current rules, technical structure, development history, validation process and known boundaries without requiring the reader to reconstruct the earlier development conversation. It is based on the current source tree, project guides, specialist catalogues, deployment workflow and development history.

Historical names and geography establish the setting. Unit counts, skill values, economic prices and several event conditions are game design choices; they are not claims about real military strength or a complete historical reconstruction.

## 1. Project overview

*Iron Europe 1939* is a turn-based hex strategy game set in the European theatre of World War II. The player chooses the Axis, Allies or Soviet Union and manages land, naval and air forces, city production, construction, commanders and diplomatic consequences. The opening map uses the historical borders of 31 August 1939, and the campaign begins in September 1939 with one month per turn.

The project grew from a playable game demo. Its central engineering problem was consistency: ports must connect to navigable water, aircraft must depend on airfields, territorial changes must update political colours and borders, and actions that may start a war must explain their consequences before execution. As the opening deployment expanded, the interface also had to reduce repetitive clicking and teach new players how the systems fit together.

The complete game directory can be opened directly in a browser without installing runtime dependencies. The online version is a static site. The project combines a playable strategy game with historical data organisation, rules modelling, interaction design, bilingual localisation, automated regression testing and static deployment.

### 1.1 Goals and design principles

| Goal | Current approach |
|---|---|
| Make the European theatre geographically recognisable | Projected geography, corrected historical borders, coast and island connectivity checks, and 436 city/port/base nodes |
| Give each military branch a clear role | Separate city, factory, naval-port and airfield production with branch-specific movement and combat rules |
| Preserve historical flavour while allowing alternate outcomes | Representative equipment and commanders, conditional events, and explicit labels for planned ships and gameplay unlock dates |
| Reduce operational burden | Persistent entrenchment, automatic waiting, category tabs, harmless-move undo, main-menu return and saves |
| Lower the learning barrier | Tutorial-first landing flow, six independent small-map courses, and an explicit skip option |
| Support collaboration and iteration | Layered data/engine/UI structure, stable logical identifiers, regression tests and deployment version checks |

### 1.2 Scope and non-goals

The current delivery includes the European campaign, six tutorial courses, Chinese and English UI, rules-driven computer opponents, browser-local saves, map and military reference data, music, automated checks and static deployment.

It does not currently provide multiplayer, cloud accounts, global theatres, a complete logistics or resource chain, free-form diplomatic negotiation, or day-by-day historical simulation. Japanese naval and air equipment is retained as data for future scenarios; the current map does not make Japan a playable faction. “1939–1945” describes the theme and technology window, not an automatic 1945 end date.

## 2. Current release scale

These values were checked by constructing a new campaign object at the time of writing. They describe the main scenario, not every tutorial checkpoint or older save.

| Metric | Current value |
|---|---|
| Map | 128×112 hexes, approximately 45 km between cell centres |
| City nodes | 436 cities, ports and bases |
| Map countries/regimes | 31 with city nodes; the data set contains 33 country entries including the United States and background land |
| Playable factions | Axis, Allies and Soviet Union |
| Opening forces | 1,009 units: 773 land units, 145 air units and 91 ships |
| Opening facilities | 93 factories, 93 airfields and 39 naval ports |
| Commanders | 116 across 15 countries; 92 assigned and 24 initially unassigned |
| Starting treasury | 1,200 gold for each playable faction |
| Tutorials | Basic course plus five specialist courses; 23 specialist checkpoints |
| Map data version | `europe-1939-geographic-v8`, coastline revision 2 |
| Save format | v9 |

Units represent strategic-scale formations. An air counter is not a fixed number of aircraft, the opening fleet is not a ship-by-ship September 1939 inventory, and land forces are not strict historical divisions. National strength depends on quantity, equipment, geography and force composition together.

## 3. Player experience and core loop

### 3.1 First entry and campaign start

The entry flow is: **choose language on the landing page → Play Free → tutorial catalogue → take a course or skip → choose faction and difficulty → campaign**.

The catalogue highlights Basic Operations but also offers Advanced Tactics, Army, Navy, Air Force, and Economy and Diplomacy. Experienced players can choose **Skip tutorials and start a campaign**. Courses have no advertised completion time and are not mandatory. The built-in playtest survey has been removed; feedback is collected separately by the project team.

During a campaign, the top bar shows date and treasury, the map shows the front, and the side panel exposes units, cities and production. Drag to pan, scroll to zoom and click counters to issue orders. City search reduces the cost of locating targets on the large map. Main Menu provides a safe return path and campaign continuation.

### 3.2 Turn loop

1. Inspect the front, enemy positions, available actions, city income and facility progress.
2. Spend resources on recruitment, construction, transport equipment and commander assignments.
3. Move, support, attack or entrench according to terrain, range and target type.
4. Capture cities or trigger events, updating control, territory and diplomatic relations.
5. End the turn. The engine resolves AI actions, income, recovery, construction, events and fallout before advancing to the next month.

A unit may move and then attack; an attack ends its actions. A newly produced unit remains at its production location until the next turn. A city is captured only when a land unit enters it; bombardment, air strikes and nuclear strikes cannot capture a city remotely.

### 3.3 Reducing repetitive actions

Entrenchment gives +30% defence and persists across turns. Entrenched counters are dimmed and skipped by pending-order prompts, but can still be selected manually. A successful move or attack removes entrenchment. A unit that moves without a valid attack target automatically waits. Disbanding returns no gold but releases the assigned commander.

Undo is limited to the latest ordinary move that caused no wider state change. Attacks, another unit’s effective action, ending the turn, recruitment, construction, equipment purchases and commander assignments close the undo window. Merely selecting another unit does not. Moves that cause occupation, war, surrender, cession, annexation or an event cannot be undone; this prevents rollback from recreating units or diplomatic state.

## 4. Map and territorial model

### 4.1 From geographic data to a playable map

City locations are maintained in WGS84 coordinates and projected onto the hex grid with a Lambert conformal conic projection. Natural Earth supplies coastlines, rivers and lakes. Historical Basemaps’ 1938 borders provide the starting political layer, which is then corrected for the August 1939 setting.

Rounding every coordinate to the nearest cell would overlap dense cities, place ports inland, or erase small countries and islands. The map builder therefore assigns constrained cells using country membership, coastal requirements and bounded positional offsets. Important islands and enclaves that are smaller than the grid scale receive explicit representation.

Development corrected a broken Crete, the south-western British coastline and Bristol access to the sea, fragmented Finland–Norway border cells, the incorrect Soviet patch near Königsberg, lake/ocean confusion and the missing Ural River. Narrow straits use water connections plus land movement prohibitions so adjacent hexes do not create fictional land bridges. The Kiel Canal is currently a geographic label only and is not a ship transit route.

### 4.2 Zoom and information hierarchy

At low zoom, countries and major regions are shown. Higher zoom levels replace them with secondary and local regions. City labels accumulate as the view enlarges; major names do not disappear, and all city names become available before maximum zoom. Factory, airfield and naval-port icons appear only at local and closer zoom levels. Region labels are visual hierarchy, not additional administrative entities or terrain rules.

### 4.3 Legal ownership and wartime control

Country and faction are separate. Germany and Italy, for example, may share a faction without becoming one country. The map distinguishes legal ownership from wartime control: occupation changes control, while treaty cession and annexation change legal ownership.

Every non-city cell is associated with all nearest cities belonging to its legal country. If a cell is equally close to cities A and B, capturing only A does not transfer it; both cities must be controlled by the same occupier. This turns city advances into continuous territorial change without allowing a single city to determine an implausibly large border. Legal borders are recalculated after treaty changes.

Political colours, borders, city control and hover information must use the same control model. Flags or faction membership alone are insufficient. Terrain, rivers and natural-region names do not change with military control.

## 5. Military, economy and diplomacy

### 5.1 Production and economy

City income is the main source of gold. Gold funds units, facilities, transport equipment and late-game nuclear strikes. Ordinary cities recruit infantry, factories unlock artillery and armour, airfields produce aircraft, and naval ports launch ships.

| Facility | Cost/time | Main constraint |
|---|---:|---|
| Factory | 150 gold / 3 turns | Opens artillery and armour production; adds no city income |
| Airfield | 120 gold / 2 turns | Aircraft production, basing and rebasing |
| Port | 180 gold / 3 turns | Requires a coastal city and suitable adjacent sea cell |

Payment occurs when construction starts. A facility type cannot be duplicated, while different projects may run concurrently. Projects cannot currently be cancelled. Facilities and unfinished projects transfer with a city; port work pauses if a non-friendly unit occupies the construction site.

Land units are produced in an empty friendly city cell and are never moved to a neighbouring cell automatically. Aircraft occupy a separate layer and may share a city with ground forces. Ships require an empty sea berth. Technology is year-based; production offers the newest unlocked model, and existing units do not upgrade automatically. Infantry and aircraft tiers two and three cost 110% and 120% of their base price, without compounding.

### 5.2 Land force categories

| Category | Units | Tactical purpose |
|---|---|---|
| Militia | Militia, garrison, irregular infantry | Low-cost reinforcement, defence and limited mobility |
| Foot infantry | Infantry, mountain infantry, marines, rangers, paratroopers | Main line plus mountain, amphibious, forest and airborne roles |
| Mobile infantry | Cavalry, motorised and mechanised infantry | Mobility or protection in exchange for higher cost |
| Artillery | Guns, AA, anti-tank, field guns and rockets | Support, area defence, anti-armour, long-range pressure and directional splash |
| Armour | Armoured cars, light, medium, heavy and super-heavy tanks | From mobile reconnaissance-style action to breakthrough power, trading speed against cost and protection |

Major countries have variants built on these templates. French Panhard armoured cars improve anti-infantry damage; British Firefly tanks improve anti-armour damage; Soviet T-34s recover more effectively; German Tigers improve defence and counterattack. German 88 mm AA guns also perform well against armour, while Soviet Katyusha launchers increase splash damage. These bonuses do not form a universal counter chart; target, terrain and equipment still matter.

### 5.3 Movement, combat and commanders

Base damage is approximately `42 × effective attack / (effective attack + effective defence)`, then modified by strength, equipment, target type, commanders, experience and random variation. Forest, hills, mountains, cities and capitals provide +30%, +40%, +60%, +40% and +60% defence respectively. Unembarked artillery and aircraft ignore terrain defence bonuses. Entrenchment is a separate state from city terrain.

Ordinary land units usually pay one extra movement point to cross a river and may suffer an attack penalty. Mountain infantry, rangers and marines reduce penalties in their specialist environments. Enemy zones of control can stop movement. An unacted unit may still enter at least one legal, empty adjacent cell even when its movement allowance cannot pay that cell’s full terrain cost; this does not bypass blocked edges, occupation or land/sea restrictions.

A surviving defender counterattacks when it meets the applicable conditions. Infantry and armour generally counterattack only adjacent attackers; artillery and ships use their range and target restrictions. AA guns protect their own cell and adjacent friendly units and resolve aircraft interception separately.

Ordinary commander skills affect the commanded unit and must meet any class restriction. Auras affect adjacent friendly units; multiple auras do not stack and only the strongest applies. Unit veterancy has three levels, each adding 8% attack and defence. A commander gains a star every three kills, up to five stars; each additional star adds 4% attack and defence. The current commander system covers land and air forces; naval commander assignment is not implemented. The catalogue spans the war rather than representing only officers active in 1939.

### 5.4 Sea transport and naval warfare

The former fixed “shipping route” system was removed. A coastal land unit can buy transport equipment and enter the sea; embarkation and disembarkation each consume all actions for the turn. Sea movement is fixed at five. Transport equipment is retained after landing and upgrades charge only the price difference.

| Equipment | Unlock | Cost | Attack retained / sea defence |
|---|---:|---:|---:|
| Transport ship | 1939 | 25 | 20% / 6 |
| Amphibious transport | 1942 | 55 | 45% / 12 |
| Amphibious assault ship | 1944 | 90 | 70% / 18 |

The independent navy contains submarines, destroyers, light cruisers, heavy cruisers, battlecruisers, battleships, escort/light carriers and fleet carriers. Destroyers and several other classes can fight submarines; submarines can attack only sea targets, and hidden detection is not implemented. Surface ships can bombard land targets but cannot capture cities. Carriers launch abstract carrier attacks without separate aircraft counters.

Naval production is limited by gold, year, control and berth availability only. There is no additional per-turn quota, budget percentage or fleet-size cap. Ships recover 25 strength per turn in a friendly port and do not repair in ordinary sea cells. Names use historical or planned names by country and class before falling back to generic numbering; used names are not immediately recycled after sinking. Historical, planned and invented names are labelled separately.

### 5.5 Air power, airlift and nuclear strikes

Aircraft operate from airfields and use the airfield as the centre of their mission radius. They remain at base after a sortie. Rebase is limited to a friendly airfield within range and ends the aircraft’s actions for the turn. Aircraft still stationed at a captured hostile airfield are destroyed; treaty cession evacuates them under the withdrawal rules.

Light fighters, CAS and naval bombers are low-cost; heavy fighters, tactical bombers and transports are mid-cost; strategic bombers are most expensive. Fighters are effective against aircraft at enemy airfields, CAS and tactical bombers support ground operations, naval bombers attack ships, and transports cannot attack.

A transport aircraft and paratrooper must share a friendly airfield and both must be unacted before loading. One transport carries one paratrooper. A drop onto a legal empty land cell within range ends both units’ actions while the aircraft remains at base. Destroying the transport also destroys its cargo. There is no independent interception or landing-dispersion model.

From 1945, strategic bombers can spend 2,000 gold on a nuclear strike. All units in the centre cell are destroyed, adjacent units lose 75 strength, and friendly forces are affected as well. Fallout lasts six full turn settlements, deals 20 damage per turn, blocks recovery and sets affected city income to zero. Nuclear strikes require confirmation and do not capture cities. This is a fictional late-war rule, not a claim that every listed country or aircraft could deliver nuclear weapons historically.

### 5.6 Diplomacy, events and victory

| Concept | Territorial result | Result for the former owner’s forces |
|---|---|---|
| Occupation | Enemy city and eligible dependent cells change control | Land units are not forcibly moved merely because the map changes colour; captured airfields have a separate aircraft rule |
| Cession | Specified legal territory transfers permanently | Units withdraw to the nearest suitable remaining national territory |
| Annexation | All territory transfers | The annexed country’s units are disbanded; other forces in the same faction are not |
| Surrender | Usually triggered by capture of the enemy capital and resolved as annexation | Annexation rules apply, except where a scenario treaty overrides them |

Entering a neutral country or attacking a neutral target can widen a war. Equal-cost paths prefer neutral-free routes, and a confirmation dialog explains the consequences before execution. Before Barbarossa, Soviet attacks on neutrals create bilateral limited wars rather than automatically involving the Allies. Other cases use the existing opposing-faction alignment rule.

Historical events are conditional rules rather than unconditional reenactments. Major examples include the Soviet–German partition after Poland’s surrender, the November 1939 Winter War, the June 1940 Baltic annexations and Bessarabian cession, Italian and Hungarian/Romanian alignment, Barbarossa in June 1941, US entry in December 1941 and the Normandy landing in June 1944.

The Winter War has a special outcome: Finland taking Leningrad can force an armistice; the Soviet capture of Helsinki causes Finland to cede Viipuri and its dependent Karelian cells while remaining independent. This is the game’s victory condition, not a claim about how the real war ended. Territorial ranges are approximated by the 45 km grid and nearest-city model.

Losing all capitals of the player’s faction causes defeat. Victory is assessed against the major hostile factions; winning a single limited war does not win the European campaign.

## 6. Tutorial design and learning objectives

The original basic tutorial covered only core commands. The current system decomposes the larger ruleset into small independent exercises with observable, actionable and verifiable goals.

| Course | Map / nodes | Learning and actions |
|---|---|---|
| Basic Operations | 8×5; original 10-step guide | Selection, movement, automatic waiting, undo, combat, turns, capture and recruitment |
| Advanced Tactics | 10×7; 4 checkpoints | Compare terrain and units, cross a river, observe counterattack, assign Guderian and attack |
| Army | 10×7; 4 checkpoints | Inspect three infantry tabs, build artillery, build armour, support an infantry assault with fire |
| Navy | 10×7; 4 checkpoints | Build a destroyer, fight a submarine, buy transport equipment, sail and land |
| Air Force | 10×7; 5 checkpoints | Build aircraft, sortie CAS, rebase, paradrop infantry and perform a late-war nuclear strike |
| Economy and Diplomacy | 10×7; 6 checkpoints | Income, construction, occupation, a scripted cession, surrender/annexation and a limited neutral war |

A course opens its next checkpoint after the current objective is met. Every checkpoint starts with a fresh setup and can be restarted or exited to the catalogue. Enemies do not take their own turns, but normal counterattack, economic and production rules remain active. The cession button executes only the scripted training treaty; it does not add a “demand territory” power to the campaign.

Tutorials use the production engine’s actions and settlement methods and track objectives separately. They are not disconnected explanation animations. No tutorial completion rate, learning-transfer study or first-campaign success statistic has yet been collected.

## 7. Technical architecture

### 7.1 Runtime and module responsibilities

The client uses native HTML, CSS and JavaScript, with Canvas 2D for the map. Node.js and Python are development tools for checks, map construction and exports; the game itself does not require them. Map and music assets are bundled locally for offline play.

| Layer | Main locations | Responsibility |
|---|---|---|
| Entry and loading | `index.html`, `landing/`, `js/loader.js` | Landing page, language, tutorial entry, ordered loading, progress and asset versions |
| Geography and assembly | `js/core/` | odd-r hex coordinates, distance, projection and shared data assembly |
| Content data | `js/data/` | Map, cities, countries, equipment, commanders, economy, deployment, events and tutorial copy |
| Campaign engine | `js/engine/game.js` | Actions, combat, production, economy, AI, save and load |
| Diplomacy extension | `js/engine/diplomacy.js` | Legal ownership, dependent cells, limited wars, cession, annexation and treaties |
| Tutorial engine | `tutorial.js`, `tutorial-campaigns.js` | Basic guide, specialist setups and objective validation |
| UI layer | `js/ui/` | Map drawing, menus, confirmations, feedback, language, music and unit icons |
| Build and verification | Root builders, `test_*.js`, `.github/workflows/` | Data generation, regression tests, publishing and offline packaging |

The runtime flow is **assemble data → create a campaign or tutorial object → player action → UI confirmation → engine validation and state change → map and panel update**. The engine does not depend on the DOM and can be tested in Node. The UI explains and confirms intent, but the engine validates legality again.

### 7.2 Pathfinding and computer opponents

Movement combines hex adjacency, terrain cost, river crossings, zones of control, sea/land eligibility, occupancy and diplomacy. Equal-cost paths use neutral-territory risk as a secondary sort key. Approach-and-attack actions describe both transit-country and target-country consequences.

The AI is rules- and score-driven, not an online language model. Land forces use unit roles, city distance, retreat conditions, attack opportunities and defensive positions. Naval and air forces have separate mission and production logic. AI purchase preferences and difficulty multipliers are strategy settings, not player production caps.

### 7.3 Rendering performance and the map-freeze fix

Terrain, borders and rivers use cached geometry; units and dynamic labels are viewport-culled. Paths and icon geometry are reused instead of rebuilding the entire European map every frame. Cache keys include control state and the political revision so same-faction cessions still refresh borders.

A development bug once left interaction state changing while the visible map appeared frozen. The fix addressed animation timestamps before the first frame, cache invalidation and recovery after drawing exceptions. The incident demonstrated that correct game state does not guarantee correct rendering; scheduling, cache lifetime and actual screenshots must all be checked. No unmeasured frame-rate or minimum-device claim is made here.

### 7.4 Saves and bilingual display

Formal campaigns use browser local storage rather than cloud saves. Online and offline URLs, browsers and devices do not share progress automatically. Save format v9 stores units, facilities, commanders, ship names, wars, territorial changes, events and fallout. Loading an older save must not reissue opening forces or replay past events.

Language is selected with `?lang=en|zh` and local preference. Display text is separate from logical identifiers: city keys, equipment keys, recruitment groups and ship identity do not change during translation. A formal campaign must finish its current action and save before switching language. English coverage includes menus, prompts, battle logs, data names and tutorials; stale branch copy must not overwrite newer rules.

### 7.5 Audio and visual assets

Unit silhouettes share one geometry definition between Canvas counters and SVG menus. Music changes with menu, campaign, victory and defeat scenes; playback starts after the first user interaction, pauses when the page is backgrounded, and is controlled by the sound button or `M` key.

## 8. Development history and major trade-offs

The project used an iterative cycle of requirements, implementation, play observation, correction and revalidation. The project owner supplied gameplay direction and historical/geographic corrections. The coding assistant contributed to data organisation, implementation, debugging, regression checks, copy and deployment verification. Branches were used during the broader project to integrate music, skills, artwork and localisation; this document focuses on the resulting product rather than treating those integrations as independent claims.

| Stage | Problem discovered | Resulting decision |
|---|---|---|
| Map reconstruction | Sparse cities, modern-border remnants, incorrect ports and islands | 436 nodes, historical corrections, connectivity checks and layered labels |
| Branch separation | Fixed shipping routes and land-style air forces were unsuitable | Purchasable army transport equipment, independent fleets, airfield-radius missions and airlift |
| Production and deployment | Heavy units were mixed into city recruitment; front lines had gaps | Factory production, category tabs, larger opening deployment and commander assignments |
| Economy and workload | Tight budgets and repetitive waiting orders | Higher starting funds/income, persistent entrenchment, automatic waiting and disbanding |
| Undo and diplomacy | Accidental transit wars and dangerous rollback | War confirmation, pure-move undo and country-level control state |
| Content and localisation | External branch copy lagged behind main rules | Current English copy completed without changing save or ship identity keys |
| First-time entry | Players could start a campaign without understanding the systems | Tutorial-first catalogue with six courses, an explicit skip option and no fixed duration claim |

Several proposals were deliberately abandoned: fixed sea routes, naval fleet-size and budget quotas, automatic deployment beside a defended city, undoing occupation or annexation, and the built-in feedback questionnaire. Future work should use the final rules rather than revive old branch assumptions.

Three lessons shaped the project. Historical data must be expressed at the game’s scale instead of copied as if it were a survey. Adding systems increases operational cost, so every content expansion needs interaction support and teaching. Finally, merging, pushing, deploying and what players actually see are separate stages and must be checked separately.

## 9. Verification, release and reproduction

### 9.1 Verification coverage

| Verification layer | Main coverage |
|---|---|
| Data and map | Deterministic generation, city positions, borders, land/sea connectivity, rivers and label tiers |
| Rules | Movement, combat, branches, facilities, opening deployment, commanders, diplomacy and saves |
| Interaction | Canvas scheduling, buttons, category menus, war cancel/confirm, undo and safe return |
| Tutorials | Basic guide, 23 specialist objectives, real action gates and save isolation |
| Localisation | Dictionary and display data, cross-language saves, ship-name uniqueness and landing coverage |
| Long simulation | Up to 80 turns across three factions, checking illegal terrain, overlap, negative gold and exceptions |
| Browser checks | Chinese/English entry, course rendering, skip path, screenshots and runtime exceptions |

The baseline was checked by GitHub Actions run [35597772559](https://github.com/ttdnx2999-cmd/test_collab/actions/runs/35597772559), which completed the defined checks and deployment. The live `version.json` was checked against the same release line. Browser checks covered landing-page entry, course selection, skipping to faction selection and rendering every specialist checkpoint.

These results support the statement that the specified paths passed their checks. They do not prove the absence of defects, complete balance, universal device compatibility or that every English-speaking player will understand the game. The opening-force figures here were re-counted from a new campaign rather than copied from an old report.

### 9.2 Maintenance and reproduction

Players must download the complete directory and open `index.html`; copying only the entry file is insufficient. Development checks use Node.js, and the publishing workflow uses Node 22. Map changes begin with source data and the builder: run `node build_map.js --write`, then `node build_map.js --check`; do not hand-edit generated map data. After commander changes, run `node build_general_catalog.js` and verify catalogue synchronisation.

The definitive test list is `.github/workflows/deploy-pages.yml`. Changes to tutorials should at minimum run `test_tutorial.js`, `test_tutorial_courses.js`, `test_render.js` and localisation tests, followed by a real-browser check of entry and layout.

### 9.3 Release and version verification

Pushing `main` triggers GitHub Actions: code and map checks, regression tests, static-site packaging and GitHub Pages deployment. `version.json` records the deployed commit, and the loader passes a release version to child scripts. Translation-resource changes must also account for browser caching.

A `v*` tag triggers a separate Release workflow that creates an offline game package. “The site is deployed,” “the local directory is synchronised” and “a new Release attachment exists” are three different claims. Redistribution must retain map sources, music and licences; a page that opens successfully can still be incomplete if data or attribution is missing.

## 10. Current limitations and proposed next work

### 10.1 Known boundaries

The main scenario still uses capital capture as the normal surrender trigger. Additional garrisons reduce empty-capital rushes but do not create a multi-condition surrender model. The large opening army can still create considerable late-game workload, and the rules-driven AI has not been demonstrated to have stable long-term strategy.

Geography and treaties use a coarse grid and cannot reproduce every small boundary precisely. The Kiel Canal is not navigable. The navy has no hidden detection or commander assignment, and carrier aviation is abstracted as direct attacks. The air force has no persistent air-superiority patrol, complete interception model or landing dispersion. The economy uses one currency and has no population, oil, ammunition or logistics chain. Saves are not synchronised between devices.

Commander and equipment availability is tuned for gameplay and should not be treated as a strict 1939 inventory. Tutorial progress is not persisted between sessions, and no formal learning-effect study has been performed. Since the built-in questionnaire was removed, the project does not automatically collect playtest statistics.

Reference maintenance still has known inconsistencies: `NAVAL_NAMES.md` and `AIR_CATALOG.md` retain an older “774 land units” sentence while the current count is 773, and the ship-name document contains v6-era save-format wording while the overall save format is v9. This document uses the current code count. Future maintenance should generate shared numbers or add consistency checks across catalogues.

### 10.2 Proposed, not committed

| Priority | Expected improvement | Suggested acceptance method |
|---|---|---|
| New-player usability study | Determine whether courses let players complete a first campaign independently | Observe completion, confusion, accidental wars and help usage rather than judging only completion time |
| Workload and balance | Reduce mid/late-game fatigue and evaluate capital-rush and economic pacing | Manual play across factions and difficulties, compared with turn-level metrics |
| Scenario configuration | Support naval or local-war scenarios without duplicating the campaign engine | Load map, deployment, victory and events from independent scenario data and run regression checks |
| Data synchronisation | Prevent numbers and rules drifting across many documents | Generate opening counts, catalogues and selected copy from shared sources |
| Accessibility | Improve small-screen layout, colour recognition and keyboard operation | Test multiple viewport sizes and input methods |
| Military and political depth | Evaluate reconnaissance, logistics, naval commanders and richer surrender conditions | Define rules and interaction cost before implementing and testing separately |

These are proposals, not promises, schedules or funded commitments.

## 11. Sources, attribution and document index

The project uses geographic data, historical borders, equipment and biographical references, and licensed music. This document records the project’s internal source structure; it does not constitute a new audit of every external link or a new legal opinion.

Natural Earth data is marked as public domain in the source manifest. Historical Basemaps is accompanied by GPL-3.0 licensing and derivative-data notes. Download URLs, dates and SHA-256 values are stored in `map_sources/manifest.json`. A licence for one source must not be assumed to cover all code and assets.

All background music is by Kevin MacLeod under CC BY 4.0: *Five Armies*, *Air Prelude*, *Impact Moderato*, *Fanfare for Space* and *Wounded*. Full attribution is in `music/credits.txt`. Program code, music, historical references and map sources should retain separate attribution records.

| Resource | What it supports |
|---|---|
| `README.md`, `README.en.md` | Current rules, entry flow, controls, economy, combat, saves and bilingual wording |
| `DEVELOPMENT.md` | Module responsibilities, change constraints, performance, verification, release and localisation |
| `MAP_NOTES.md` | Projection, scale, historical corrections, connectivity, map version and sources |
| `CITY_CATALOG.md` | Staged city expansion and regional representation; not every row is from the latest change |
| `DIPLOMACY.md`, `DIPLOMACY.en.md` | Countries/factions, four territorial changes, event conditions, treaties and historical distinctions |
| `NAVAL_CATALOG.md` | Ship classes, unlocks, ports and the treatment of planned ships |
| `NAVAL_NAMES.md` | Individual ship identity, name pools, opening fleet and save compatibility |
| `AIR_CATALOG.md` | Air-force deployment, aircraft, prices, airfields, airlift and nuclear strikes |
| `GENERAL_CATALOG.md` | 116 commanders, skill design, assignments and identity references |
| `docs/skill-design.md` | Skill effects, scope and maintenance procedure |
| `MUSIC.md`, `music/credits.txt` | Playback, tracks, authorship and attribution |
| `map_sources/manifest.json` and attached licences | Original map sources, hashes and licensing text |
| `landing/index.html`, in-game help and language dictionaries | Public entry page and player-facing rules |
| Tutorial data, engine and UI files | Six courses, objective gates, real actions and skip path |
| Tests, builders and workflows | Reproducible checks, generated data and publishing |
| Git history and development record | Requirement changes, trade-offs, fixes and branch integration context |

As a handover document, the figures and feature claims here are tied to the code baseline at the top. After future changes, re-check opening counts, save format, tutorial entry, current rules and deployment status before updating this document.
