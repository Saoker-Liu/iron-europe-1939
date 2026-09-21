# Iron Europe 1939

[Play](https://ttdnx2999-cmd.github.io/test_collab/?lang=en) · [中文说明](README.md)

A single-player, turn-based hex wargame covering the European theatre. Runs in your browser, including offline: extract the complete game package and open `index.html`. Choose **English** on the introduction page, then **Play Free**. Choose the Axis, Allies or Soviet Union, or try the tutorial first.

## Learn the controls

The tutorial uses a small, fictional 8×5-hex training map. It teaches selection, movement, automatic waiting, undoing a move, combat, capturing cities, recruitment and ending turns. It does not overwrite your campaign.

- Left-click a unit or city. Blue hexes are reachable; highlighted enemies can be attacked. The unit can move into range automatically when appropriate.
- Drag to pan; scroll to zoom. Use **Find City** to search city, country and region names. English mode also accepts original Chinese names.
- **N:** next unit needing orders. **E / Enter:** end turn. **G:** generals. **H:** help. **M:** mute. **Esc / right-click:** cancel selection.
- **Atlas** fits the map to the screen. **Regions / Terrain** changes the map view; **Hide Units** clears counters from view.

Regional labels change with zoom; city labels accumulate as you zoom in. Factories, airfields and ports appear at local zoom levels. You do not need maximum zoom to see all city names.

## Campaign, income and saves

The campaign begins in September 1939 on a map based on the borders of 31 August. One turn is one month. The map has 436 city, port and base nodes across 128×112 hexes, roughly 45 km apart. Geography, forces and historical events are simplified for strategy play.

New campaigns start with 1,009 units: 773 land units, 145 air units and 91 ships. There are 93 initial factories, 93 airfields and 39 naval ports. Each playable faction starts with 1,200 gold. Cities produce the income shown in their panels. Difficulty affects AI combat and income bonuses. There is no automatic end date in 1945.

**Save** stores your progress in this browser. **Main Menu** saves the campaign and returns to faction selection; wait for any current action to finish. Switching language also saves first. Use **Continue Campaign** to resume. Saves are not shared between browsers, devices, local files and the online site. Clearing browser data can erase them. Starting deployments change only in new campaigns; existing saves do not replay past events.

## Actions, entrenchment and undo

Units may move and then attack, but attacking ends their actions. New units cannot act until next turn. An unacted land or naval unit can enter at least one legal, empty adjacent hex even if its movement cost exceeds the unit's allowance. This does not bypass terrain restrictions, occupied hexes or blocked crossings.

A move that leaves no valid attack target automatically puts the unit on wait. **Undo Move** restores only the last ordinary move that had no wider effect. Occupation, declarations of war, surrender, territorial transfers and events cannot be undone. Attacking, moving or attacking with another unit, ending the turn, or changing the state through recruitment, construction, equipment or general assignments ends the opportunity. Merely selecting another unit does not.

**Entrench** gives +30% defence and persists across turns. Entrenched units appear dimmed and are skipped by Next Unit and pending-order prompts. You can still select them manually; moving or attacking ends entrenchment. **Disband Unit** removes a unit without a refund and frees its general. Transport aircraft must unload their paratroopers first.

## Recruitment and construction

Land units spawn in an empty friendly city hex, never beside it. Aircraft are a separate layer and may share a city with a ground unit. Ships launch into the port's empty sea berth.

| Location | Available units |
|---|---|
| City: Militia | Militia, garrison, irregular infantry |
| City: Foot Infantry | Infantry, mountain infantry, marines, rangers, paratroopers |
| City: Mobile Infantry | Cavalry, motorised infantry, mechanised infantry |
| Factory: Artillery | Artillery, anti-aircraft, anti-tank, field guns, rockets |
| Factory: Armour | Armoured cars, light, medium, heavy and super-heavy tanks |
| Airfield | Light fighters, heavy fighters, close air support, naval bombers, tactical bombers, strategic bombers, transports |
| Naval port | Submarines, destroyers, light and heavy cruisers, battlecruisers, battleships, escort/light carriers, fleet carriers |

Build a **factory** for 150 gold in 3 turns, an **airfield** for 120 in 2 turns, or a **port** for 180 in 3 turns. Ports need a suitable adjacent sea hex. Different facilities can be built simultaneously, but duplicates are not allowed. Pay when work starts; projects cannot currently be cancelled. Factories unlock production, not additional income. Facilities and unfinished projects transfer with the city. Port work pauses if a non-friendly unit occupies the site. Demilitarised zones cannot recruit forces or build airfields or naval ports.

Infantry, artillery and armour have 1939, 1941 and 1943 tiers. Production uses the newest unlocked model; existing units do not upgrade automatically. Infantry and aircraft tiers cost 10% and 20% more than their base tier. Major countries have distinctive equipment and historical or planned naval/air models. Unlock dates are gameplay choices, not necessarily service-entry dates.

## Combat and recovery

Base damage is approximately `42 × effective attack / (effective attack + effective defence)`, modified by strength, target type, equipment, generals, experience and random variation. There is no universal rock–paper–scissors counter chart.

Terrain defence: forest +30%, hills +40%, mountains +60%, cities +40%, capitals +60%. Artillery that is not embarked, and aircraft, ignore terrain defence bonuses. Infantry and armour generally counterattack adjacent attackers; artillery and ships obey their range and target restrictions. Anti-aircraft guns protect their own hex and adjacent friendlies and fire on attacking planes.

Mountain infantry and rangers reduce penalties in their specialist terrain. Marines reduce river-crossing and amphibious penalties. Anti-tank guns specialise against armour; field guns have longer range; rockets damage enemy units behind the target. Enemy zones of control can stop movement. Aircraft and units with an applicable Ignore ZOC skill are exempt. Crossing a river normally costs an extra movement point and imposes an attack penalty.

Ordinary land units recover 25 strength in friendly cities or 12 in friendly territory each turn, up to 100. Embarked units do not recover. T-34 units recover 35 in friendly cities, 20 in friendly territory and 10 in hostile territory. Ships recover 25 in friendly naval ports. Fallout prevents recovery.

There are 116 historical generals, with 92 deployed and 24 available initially. Assign generals from your own faction to compatible land or air units; ships cannot receive generals. Every three unit kills earn a star, up to five; each additional star gives +4% attack and defence. Unit veterancy has three levels, each giving +8% attack and defence. Ordinary skills affect the commanded unit only. Auras affect adjacent friendly units, not the general's own hex, and only the strongest aura applies.

## Sea transport and naval warfare

Army units on the coast can buy transport equipment and move into adjacent sea hexes. Embarking and disembarking each use all actions for the turn. Sea movement is fixed at 5; lakes are impassable. Equipment is retained after landing, and upgrades cost the difference.

| Equipment | Unlock | Cost | Attack retained at sea | Defence at sea |
|---|---:|---:|---:|---:|
| Transport ship | 1939 | 25 | 20% | 6 |
| Amphibious transport | 1942 | 55 | 45% | 12 |
| Amphibious assault ship | 1944 | 90 | 70% | 18 |

There are no fixed ferry routes. Ships cannot capture cities. Submarines attack sea targets only; destroyers, submarines, carriers and armed aircraft can attack submarines. Surface ships can bombard coastal targets; carriers launch their own air attacks without separate air units. Shipbuilding requires gold, a valid controlled port and an empty berth, but has no additional per-turn quota or fleet-size cap. Ship names distinguish historical, planned, game-created and generic names.

Cyan lines represent navigable straits. The Kiel Canal is currently a geographical marker only.

## Air power, paradrops and nuclear strikes

Aircraft are recruited and based only at friendly airfields. Their radius is measured from their base; they do not occupy territory like land units. Rebase to a friendly airfield within range to end their actions for the turn. Capturing an airfield destroys enemy aircraft still stationed there; a treaty cession evacuates them instead.

Light fighters, CAS and naval bombers are low-cost; heavy fighters, tactical bombers and transports are mid-cost; strategic bombers are the most expensive. Fighters are effective against aircraft at enemy airfields. CAS and tactical bombers support ground operations; naval bombers attack ships. Transports cannot attack.

Recruit paratroopers in a city, then move them to a friendly transport aircraft's base. Neither unit may have acted before loading. Each transport carries one unit. It can drop onto a legal, empty land hex within range; both units finish their actions and the plane stays at its base. Destroying the transport also destroys its cargo.

From 1945, only strategic bombers can launch nuclear strikes, costing 2,000 gold. All units in the target hex are destroyed; adjacent units lose 75 strength. Friendly forces and airfield aircraft are affected too. Fallout covers the target and adjacent hexes for six turns, dealing 20 damage per turn, blocking recovery and reducing affected city income to zero. A strike does not capture a city. Hitting neutral or non-belligerent countries may trigger war; confirmation is required.

## Diplomacy and victory

Read [Diplomacy and Treaties](DIPLOMACY.en.md) for territorial rules, limited wars and conditional events. Capturing a capital normally forces that country to surrender and be annexed. The Winter War is an exception. Defeat all major hostile factions to win; losing all your faction's capitals means defeat. Winning one limited war does not win the entire campaign.

## Credits


Music by Kevin MacLeod, licensed under CC BY 4.0. Full credits: [music/credits.txt](music/credits.txt). Audio starts after a click or keypress and pauses in the background. Map data uses Natural Earth and historical boundary sources; retain the source manifest and licences in `map_sources/` when redistributing.
