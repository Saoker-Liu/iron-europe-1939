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

## 3. 接入指南 / Integration Guide (next step)

The game already has a synthesized-SFX module in `js/ui/ui.js` (see `SFX`, `toggleSound`,
the 🔊 button and the `M` key shortcut). Background music should be a small sibling
`MusicManager` following the same pattern:

```js
/* js/ui/music.js — drop-in MusicManager (follows ui.js SFX pattern) */
const Music = {
  audio: new Audio(), current: null, on: true,
  play(slot, loop = true) {
    if (!this.on || this.current === slot) return;
    this.current = slot;
    this.audio.src = `music/${slot}.mp3`;
    this.audio.loop = loop;
    this.audio.play().catch(() => {});   // autoplay guard: first call must come from a user click
  },
  stop() { this.audio.pause(); this.current = null; },
  toggle() { this.on = !this.on; this.on ? this.play(this.current || 'menu') : this.stop(); return this.on; }
};
```

Trigger points:
- splash CTA click → `Music.play('menu')` (browsers block autoplay before first user gesture — this matters!)
- faction modal open → `Music.play('lobby')`
- battle start → `Music.play('battle')`; end of campaign → `Music.stop()` then `Music.play('victory', false)` / `Music.play('defeat', false)`
- hook the existing 🔊 button / `M` key → `Music.toggle()` alongside `SFX.toggle()`

## 4. 版权 / License

All five tracks: **Kevin MacLeod (incompetech.com), CC-BY 4.0** — free for any use
**with attribution**. The exact required credit line is in `music/credits.txt`; it must
be added to the in-game credits/about screen before this merges to `main`.
