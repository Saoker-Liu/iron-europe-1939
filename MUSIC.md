# MUSIC.md — 音乐方案 / Music Design (Task ④)

> 任务 ④：为游戏选择风格合适的音乐资源。
> All tracks are instrumental — no changes needed for the future English version (final task).

## 1. 选曲方案 / Track Slots

The game plays music per game-moment ("slot"). Files are named by slot, so swapping
a track later requires **zero code changes** — just replace the file.

| File | Plays when | Track (Kevin MacLeod) | Style / Why |
|------|-----------|----------------------|-------------|
| `music/menu.mp3` | Splash screen + main menu | *Five Armies* | Snare-driven military march; instantly reads "WW2 command" — matches the epic feel of 《欧陆战争》/《世界征服者》 menus |
| `music/lobby.mp3` | Faction-selection modal | *Air Prelude* | Calm strings/piano; lets the player think while choosing a nation |
| `music/battle.mp3` | Hex battle map (main loop) | *Impact Moderato* | Tense, percussive, low-melody — survives hours of looping without fatigue |
| `music/victory.mp3` | Victory ending modal | *Fanfare for Space* | Bright brass fanfare; rewards the win (team spec #6: binary ending modal) |
| `music/defeat.mp3` | Defeat ending modal | *Wounded* | Somber strings; sells the loss without mocking the player |

Total size: ~7 MB — safe for GitHub Pages auto-deploy from `main`.

### 备选曲目 / Approved alternates (swap-in ready, same slots)
- Menu: *Curse of the Scarab* · Lobby: *Sovereign* · Battle: *Rising Tide* · Defeat: *Mourning Song*
- Download: https://incompetech.com/music/royalty-free/index.html

## 2. 风格原则 / Style Principles

1. **Orchestral military vocabulary** — snare, brass, strings: the shared language of all
   three reference games (European War / Glory of Generals / World Conqueror).
2. **Instrumentals only, no vocals** — required so the English-version task needs zero music rework.
3. **Loop-safe battle music** — low melodic movement so long play sessions don't fatigue.
4. **Music under SFX** — the game's WebAudio SFX ( gunfire, UI clicks ) must stay louder than BGM.

## 3. 已实装的播放规则

`js/ui/music.js` 使用单个本地 Audio 播放器，音量为22%，由加载器在界面之前加载。阵营选择播放 lobby，浏览1939地图播放 menu，开始／继续战役播放 battle；胜利和战败分别播放 victory、defeat，终局音乐不循环。当前界面没有独立启动页，因此 menu 用于地图浏览。

浏览器阻止自动播放时，在下一次点击或按键时重试；切换场景仅更换同一播放器的曲目。顶部声音按钮与 M 键同时控制音乐及原有音效，静音期间仍记录场景，恢复时播放当前场景。切到后台暂停，回到前台恢复，已结束的终局音乐不重新播放。

音乐资源随本地游戏、离线包及 GitHub Pages 一起发布，无需在线音乐服务。游戏的“玩法说明”包含完整曲目、作者和许可署名。

## 4. 版权 / License

All five tracks: **Kevin MacLeod (incompetech.com), CC-BY 4.0** — free for any use
**with attribution**. The exact required credit line is in `music/credits.txt`; it must
be added to the in-game credits/about screen before this merges to `main`.
