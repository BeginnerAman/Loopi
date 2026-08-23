/**
 * DP Creator Studio V4 - Main App Controller & State Management
 * Quick Emoji Bar, Interactive Touch Emitter, Shareable URL Hash, Compact GIF Mode
 */

import {
  DEFAULT_TEXT,
  QUICK_EMOJIS,
  MESSAGE_PRESETS,
  FRAME_STYLES,
  SCENES,
  PALETTES,
  DOODLE_LIBRARY,
  ANIMATIONS,
  FONTS
} from './constants.js';

import { ParticleEngine } from './particles.js';
import { BackgroundRenderer } from './backgrounds.js';
import { TextRenderer } from './textRenderer.js';
import { TimelineSequencer } from './timeline.js';
import { Exporter } from './exporter.js';

class DPStudioApp {
  constructor() {
    this.canvas = document.getElementById('previewCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.W = this.canvas.width;
    this.H = this.canvas.height;

    // Subsystems
    this.particles = new ParticleEngine();
    this.backgrounds = new BackgroundRenderer();
    this.textEngine = new TextRenderer();
    this.timeline = new TimelineSequencer();
    this.exporter = new Exporter((ctx, w, h, t, el, timing) => this.renderFrame(ctx, w, h, t, el, timing));

    // Master App State
    this.state = {
      text: DEFAULT_TEXT,
      sceneId: 'purple',
      paletteIndex: 0,
      customColors: {
        text: null,
        glow: null,
        doodle: null,
        bgPrimary: null,
        bgSecondary: null,
        gradientStart: '#aa91ff',
        gradientEnd: '#d8cbff'
      },
      colorMode: 'solid',
      
      // Frame Studio & Atmosphere
      frameStyle: 'neon',
      frameColor: null,
      frameWidth: 2,
      framePadding: 26,
      showFrame: true,
      filmGrain: false,
      vignette: false,

      // Typography
      font: 'Outfit',
      fontSize: 52,
      fontWeight: '600',
      italic: false,
      letterSpacing: 0,
      lineHeight: 1.35,
      align: 'center',
      opacity: 100,
      strokeWidth: 0,
      strokeColor: '#000000',
      shadowBlur: 0,
      shadowOffset: 0,
      shadowColor: 'rgba(0,0,0,0.6)',
      glowBlur: 26,
      
      // Layout & Transform
      posX: 50,
      posY: 50,
      rotation: 0,
      scale: 100,
      maxWidth: 82,

      // Doodles & Particles
      activeDoodles: ['spark', 'twinkle'],
      doodleConfig: {
        amount: 14,
        size: 100,
        speed: 100,
        opacity: 90,
        color: null
      },

      // Animation & Timing
      animMode: 'type',
      speed: 70,
      showCursor: true,
      loop: true,
      holdDuration: 2.5,

      // UI Views
      previewMode: 'canvas',
      isExporting: false
    };

    this.autoStyleCounter = 0;
    this.init();
  }

  init() {
    this.loadStateFromURLHash();
    this.buildQuickEmojisUI();
    this.buildPresetsUI();
    this.buildFramesUI();
    this.buildScenesUI();
    this.buildPalettesUI();
    this.buildDoodlesUI();
    this.buildAnimationsUI();
    this.buildFontsUI();
    this.bindEvents();
    this.syncUIFromState();
    this.refreshLucideIcons();

    // Start 60fps render loop
    const loop = (now) => {
      this.tick(now);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  refreshLucideIcons() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  }

  // Load state from shareable URL Hash if present
  loadStateFromURLHash() {
    try {
      if (window.location.hash && window.location.hash.length > 2) {
        const hashStr = window.location.hash.substring(1);
        const decoded = JSON.parse(decodeURIComponent(escape(atob(hashStr))));
        if (decoded && decoded.text) {
          Object.assign(this.state, decoded);
        }
      }
    } catch (e) {
      // Ignore invalid hash gracefully
    }
  }

  // Generate shareable URL
  getShareableURL() {
    const compactState = {
      text: this.state.text,
      sceneId: this.state.sceneId,
      paletteIndex: this.state.paletteIndex,
      font: this.state.font,
      animMode: this.state.animMode,
      frameStyle: this.state.frameStyle,
      activeDoodles: this.state.activeDoodles,
      fontSize: this.state.fontSize,
      glowBlur: this.state.glowBlur,
      colorMode: this.state.colorMode
    };
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(compactState))));
    return `${window.location.origin}${window.location.pathname}#${encoded}`;
  }

  getCurrentPalette() {
    const base = PALETTES[this.state.paletteIndex] || PALETTES[0];
    const c = this.state.customColors;
    return {
      primary: c.bgPrimary || base.primary,
      secondary: c.bgSecondary || base.secondary,
      bg: base.bg,
      text: c.text || base.text,
      glow: c.glow || base.glow,
      accent: base.accent
    };
  }

  // Master frame rendering used by both live preview and exporter
  renderFrame(ctx, W, H, time, elapsed, customTiming) {
    const palette = this.getCurrentPalette();
    const timing = customTiming || this.timeline.computeDuration(
      this.state.text.length,
      this.state.speed,
      this.state.animMode,
      this.state.holdDuration,
      this.state.loop
    );

    // 1. Draw Immersive Scene Background + Frame Studio + Atmosphere
    const frameColor = this.state.frameColor || palette.primary;
    this.backgrounds.draw(ctx, W, H, time, this.state.sceneId, palette, {
      frameStyle: this.state.frameStyle,
      frameColor: frameColor,
      frameWidth: this.state.frameWidth * (W / 720),
      framePadding: this.state.framePadding * (W / 720),
      showFrame: this.state.showFrame && this.state.frameStyle !== 'none',
      filmGrain: this.state.filmGrain,
      vignette: this.state.vignette
    });

    // 2. Draw Multi-Layer Particle Doodles & Interactive Touch Sparkles
    const doodleColor = this.state.customColors.doodle || palette.primary;
    this.particles.draw(
      ctx,
      W,
      H,
      time,
      this.state.activeDoodles,
      { ...this.state.doodleConfig, color: doodleColor },
      palette
    );

    // 3. Draw Advanced Typography & Emoji Animation
    const textConfig = {
      text: this.state.text,
      fontSize: this.state.fontSize * (W / 720),
      font: this.state.font,
      fontWeight: this.state.fontWeight,
      italic: this.state.italic,
      letterSpacing: this.state.letterSpacing * (W / 720),
      lineHeight: this.state.lineHeight,
      align: this.state.align,
      opacity: this.state.opacity,
      colorMode: this.state.colorMode,
      textColor: this.state.customColors.text || palette.text,
      gradientStart: this.state.customColors.gradientStart || palette.primary,
      gradientEnd: this.state.customColors.gradientEnd || palette.accent,
      glowBlur: this.state.glowBlur * (W / 720),
      glowColor: this.state.customColors.glow || palette.glow,
      strokeWidth: this.state.strokeWidth * (W / 720),
      strokeColor: this.state.strokeColor,
      shadowBlur: this.state.shadowBlur * (W / 720),
      shadowOffset: this.state.shadowOffset * (W / 720),
      shadowColor: this.state.shadowColor,
      posX: this.state.posX,
      posY: this.state.posY,
      rotation: this.state.rotation,
      scale: this.state.scale,
      maxWidth: this.state.maxWidth,
      animMode: this.state.animMode,
      speed: this.state.speed,
      showCursor: this.state.showCursor,
      loop: this.state.loop
    };

    this.textEngine.draw(ctx, W, H, time, elapsed, textConfig, palette, timing);
  }

  // Animation Loop Tick
  tick(now) {
    const timing = this.timeline.computeDuration(
      this.state.text.length,
      this.state.speed,
      this.state.animMode,
      this.state.holdDuration,
      this.state.loop
    );

    const elapsed = this.timeline.getElapsed(now, timing.totalMs, this.state.loop);

    // Render Canvas
    this.renderFrame(this.ctx, this.W, this.H, now, elapsed, timing);

    // Update Visual Timeline Bar
    const progress = Math.min(1, Math.max(0, elapsed / timing.totalMs));
    const timelineBar = document.getElementById('timelineProgress');
    const timelineTime = document.getElementById('timelineTime');
    if (timelineBar) {
      timelineBar.style.width = `${progress * 100}%`;
    }
    if (timelineTime) {
      timelineTime.textContent = `${(elapsed / 1000).toFixed(1)}s / ${(timing.totalMs / 1000).toFixed(1)}s`;
    }
  }

  // 1-Tap Quick Emoji Toolbar
  buildQuickEmojisUI() {
    const container = document.getElementById('quickEmojiBar');
    if (!container) return;
    container.innerHTML = '';

    QUICK_EMOJIS.forEach(emoji => {
      const btn = document.createElement('button');
      btn.className = 'quickEmojiBtn';
      btn.textContent = emoji;
      btn.title = `Add ${emoji}`;

      btn.onclick = () => {
        const input = document.getElementById('textInput');
        this.state.text = (this.state.text || '') + emoji;
        input.value = this.state.text;
        this.timeline.reset();
        this.highlightActivePreset();
      };
      container.appendChild(btn);
    });
  }

  // Build Presets UI
  buildPresetsUI() {
    const container = document.getElementById('messagePresetsList');
    if (!container) return;
    container.innerHTML = '';

    MESSAGE_PRESETS.forEach(cat => {
      const group = document.createElement('div');
      group.className = 'presetGroup';
      
      const title = document.createElement('div');
      title.className = 'presetCategoryTitle';
      title.textContent = cat.category;
      group.appendChild(title);

      const chips = document.createElement('div');
      chips.className = 'presetChips';

      cat.items.forEach(msg => {
        const chip = document.createElement('button');
        chip.className = 'presetChip';
        chip.textContent = msg;
        if (msg === this.state.text) chip.classList.add('active');

        chip.onclick = () => {
          this.state.text = msg;
          document.getElementById('textInput').value = msg;
          this.timeline.reset();
          this.highlightActivePreset();
        };
        chips.appendChild(chip);
      });

      group.appendChild(chips);
      container.appendChild(group);
    });
  }

  highlightActivePreset() {
    document.querySelectorAll('.presetChip').forEach(btn => {
      btn.classList.toggle('active', btn.textContent === this.state.text);
    });
  }

  buildFramesUI() {
    const select = document.getElementById('frameStyleSelect');
    if (!select) return;
    select.innerHTML = '';

    FRAME_STYLES.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f.id;
      opt.textContent = f.name;
      select.appendChild(opt);
    });
  }

  buildScenesUI() {
    const container = document.getElementById('scenesGrid');
    if (!container) return;
    container.innerHTML = '';

    SCENES.forEach(sc => {
      const btn = document.createElement('button');
      btn.className = `sceneCard ${sc.id === this.state.sceneId ? 'active' : ''}`;
      btn.dataset.id = sc.id;
      btn.innerHTML = `
        <div class="sceneIcon"><i data-lucide="${sc.icon}"></i></div>
        <div class="sceneMeta">
          <b>${sc.name}</b>
          <small>${sc.desc}</small>
        </div>
      `;

      btn.onclick = () => {
        this.applyScene(sc);
      };
      container.appendChild(btn);
    });
  }

  applyScene(sc) {
    this.state.sceneId = sc.id;
    this.state.paletteIndex = sc.paletteIndex;
    this.state.font = sc.font;
    this.state.animMode = sc.anim;
    this.state.frameStyle = sc.frameStyle || 'corners';
    this.state.activeDoodles = [...sc.doodles];
    this.timeline.reset();
    this.syncUIFromState();
  }

  buildPalettesUI() {
    const container = document.getElementById('palettesGrid');
    if (!container) return;
    container.innerHTML = '';

    PALETTES.forEach((p, idx) => {
      const btn = document.createElement('button');
      btn.className = `paletteCard ${idx === this.state.paletteIndex ? 'active' : ''}`;
      btn.dataset.idx = idx;
      btn.innerHTML = `
        <div class="paletteSwatches">
          <span style="background:${p.primary}"></span>
          <span style="background:${p.secondary}"></span>
          <span style="background:${p.bg}"></span>
          <span style="background:${p.accent}"></span>
        </div>
        <div class="paletteName">${p.name}</div>
      `;

      btn.onclick = () => {
        this.state.paletteIndex = idx;
        this.state.customColors.text = null;
        this.state.customColors.glow = null;
        this.state.customColors.doodle = null;
        this.state.frameColor = null;
        this.timeline.reset();
        this.syncUIFromState();
      };
      container.appendChild(btn);
    });
  }

  buildDoodlesUI() {
    const container = document.getElementById('doodlesGrid');
    if (!container) return;
    container.innerHTML = '';

    DOODLE_LIBRARY.forEach(d => {
      const btn = document.createElement('button');
      const isSelected = this.state.activeDoodles.includes(d.id);
      btn.className = `doodleChip ${isSelected ? 'active' : ''}`;
      btn.dataset.id = d.id;
      btn.innerHTML = `<i data-lucide="${d.icon}"></i> <span>${d.name}</span>`;

      btn.onclick = () => {
        const cur = this.state.activeDoodles;
        if (cur.includes(d.id)) {
          if (cur.length > 1) {
            this.state.activeDoodles = cur.filter(x => x !== d.id);
          }
        } else {
          if (cur.length >= 3) {
            cur.shift();
          }
          cur.push(d.id);
          this.state.activeDoodles = [...cur];
        }
        this.syncDoodlesUI();
      };
      container.appendChild(btn);
    });
  }

  syncDoodlesUI() {
    document.querySelectorAll('.doodleChip').forEach(btn => {
      btn.classList.toggle('active', this.state.activeDoodles.includes(btn.dataset.id));
    });
  }

  buildAnimationsUI() {
    const container = document.getElementById('animGrid');
    if (!container) return;
    container.innerHTML = '';

    ANIMATIONS.forEach(a => {
      const btn = document.createElement('button');
      btn.className = `animCard ${a.id === this.state.animMode ? 'active' : ''}`;
      btn.dataset.id = a.id;
      btn.innerHTML = `
        <div class="animIcon"><i data-lucide="${a.icon}"></i></div>
        <div class="animMeta">
          <b>${a.name}</b>
          <small>${a.desc}</small>
        </div>
      `;

      btn.onclick = () => {
        this.state.animMode = a.id;
        this.timeline.reset();
        this.syncAnimUI();
      };
      container.appendChild(btn);
    });
  }

  syncAnimUI() {
    document.querySelectorAll('.animCard').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.id === this.state.animMode);
    });
  }

  buildFontsUI() {
    const select = document.getElementById('fontSelect');
    if (!select) return;
    select.innerHTML = '';

    FONTS.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f.family;
      opt.textContent = `${f.name} (${f.type})`;
      select.appendChild(opt);
    });
  }

  // 🎲 "Surprise Me": Harmonious Random Design Generator
  surpriseMe() {
    const randomScene = SCENES[Math.floor(Math.random() * SCENES.length)];
    const randomAnim = ANIMATIONS[Math.floor(Math.random() * ANIMATIONS.length)].id;
    const randomFont = FONTS[Math.floor(Math.random() * FONTS.length)].family;
    const randomFrame = FRAME_STYLES[Math.floor(Math.random() * FRAME_STYLES.length)].id;
    
    const pool = DOODLE_LIBRARY.map(d => d.id);
    const d1 = pool[Math.floor(Math.random() * pool.length)];
    let d2 = pool[Math.floor(Math.random() * pool.length)];
    while (d2 === d1) d2 = pool[Math.floor(Math.random() * pool.length)];

    this.state.sceneId = randomScene.id;
    this.state.paletteIndex = Math.floor(Math.random() * PALETTES.length);
    this.state.font = randomFont;
    this.state.animMode = randomAnim;
    this.state.frameStyle = randomFrame;
    this.state.activeDoodles = [d1, d2];
    this.state.fontSize = 42 + Math.floor(Math.random() * 24);
    this.state.glowBlur = 18 + Math.floor(Math.random() * 24);
    this.state.customColors.text = null;
    this.state.customColors.glow = null;
    this.state.customColors.doodle = null;
    this.state.frameColor = null;

    this.timeline.reset();
    this.syncUIFromState();
    this.showToast('New Design Created!');
  }

  // 🧠 "Auto Style": Intelligent Aesthetic Matcher & Multi-Variation Engine
  autoStyle() {
    if (!this.autoStyleCounter) this.autoStyleCounter = 0;
    this.autoStyleCounter++;

    const text = (this.state.text || '').toLowerCase();
    const len = this.state.text.length;

    let mood = 'cute_playful';

    if (/❤️|💖|💕|💌|🥰|😘|🌹|💐|love|pyaar|dil|heart|ishq|miss|sweet|jaan|forever/.test(text)) {
      mood = 'romantic_love';
    } else if (/🌙|⭐|🌌|✨|😴|🌃|night|raat|sleep|dream|moon|stars|midnight|khwab|so jao/.test(text)) {
      mood = 'dreamy_night';
    } else if (/☀️|🌅|🌸|🌿|🍀|🌻|morning|subah|sun|sunrise|fresh|nature|green|rose|namaste|pranam/.test(text)) {
      mood = 'fresh_morning';
    } else if (/🌧️|💧|⛈️|🌊|☂️|rain|barish|drizzle|weather|clouds|mausam|water|storm|blue/.test(text)) {
      mood = 'moody_rain';
    } else if (/☕|📜|📖|✍️|coffee|chai|tea|note|letter|book|words|shayari|kavita|poem/.test(text)) {
      mood = 'vintage_coffee';
    } else if (/🔥|⚡|😎|🎉|🥳|💃|cool|fire|vibe|party|rock|dance|music|neon|magic|banger/.test(text)) {
      mood = 'cyber_neon';
    } else if (/🕊️|🖤|💎|👑|🎯|peace|calm|focus|success|quote|attitude|simple|monochrome/.test(text)) {
      mood = 'classy_minimal';
    }

    const moodProfiles = {
      cute_playful: [
        {
          name: 'Lavender Pop',
          sceneId: 'purple',
          paletteIndex: 0,
          font: 'Outfit',
          animMode: 'type',
          frameStyle: 'neon',
          doodles: ['spark', 'twinkle'],
          colorMode: 'solid',
          glowBlur: 28,
          fontWeight: '600'
        },
        {
          name: 'Dreamy Bounce',
          sceneId: 'dreamy',
          paletteIndex: 10,
          font: 'Dancing Script',
          animMode: 'pop',
          frameStyle: 'gradient',
          doodles: ['spark', 'bubbles'],
          colorMode: 'gradient',
          glowBlur: 32,
          fontWeight: '700'
        },
        {
          name: 'Sakura Blush',
          sceneId: 'sakura',
          paletteIndex: 3,
          font: 'Playfair Display',
          animMode: 'fade',
          frameStyle: 'vintage',
          doodles: ['petals', 'twinkle'],
          colorMode: 'solid',
          glowBlur: 24,
          fontWeight: '600'
        },
        {
          name: 'Mint Glass',
          sceneId: 'glass',
          paletteIndex: 6,
          font: 'Montserrat',
          animMode: 'slide_up',
          frameStyle: 'box',
          doodles: ['spark', 'orbit'],
          colorMode: 'glow',
          glowBlur: 26,
          fontWeight: '700'
        }
      ],
      romantic_love: [
        {
          name: 'Rose Romance',
          sceneId: 'sakura',
          paletteIndex: 2,
          font: 'Playfair Display',
          animMode: 'pop',
          frameStyle: 'vintage',
          doodles: ['hearts', 'petals'],
          colorMode: 'gradient',
          glowBlur: 30,
          fontWeight: '600'
        },
        {
          name: 'Velvet Heartbeat',
          sceneId: 'purple',
          paletteIndex: 0,
          font: 'Dancing Script',
          animMode: 'type',
          frameStyle: 'neon',
          doodles: ['hearts', 'spark'],
          colorMode: 'solid',
          glowBlur: 28,
          fontWeight: '700'
        },
        {
          name: 'Warm Sunset Love',
          sceneId: 'dreamy',
          paletteIndex: 7,
          font: 'Outfit',
          animMode: 'fade',
          frameStyle: 'gradient',
          doodles: ['hearts', 'twinkle'],
          colorMode: 'glow',
          glowBlur: 32,
          fontWeight: '600'
        }
      ],
      dreamy_night: [
        {
          name: 'Midnight Celestial',
          sceneId: 'moonlight',
          paletteIndex: 1,
          font: 'Playfair Display',
          animMode: 'cinematic',
          frameStyle: 'corners',
          doodles: ['stars', 'shooting_star'],
          colorMode: 'solid',
          glowBlur: 26,
          fontWeight: '600'
        },
        {
          name: 'Cosmic Aurora',
          sceneId: 'aurora',
          paletteIndex: 0,
          font: 'Outfit',
          animMode: 'wave',
          frameStyle: 'neon',
          doodles: ['stars', 'twinkle'],
          colorMode: 'rainbow',
          glowBlur: 30,
          fontWeight: '700'
        },
        {
          name: 'Cloudy Slumber',
          sceneId: 'cloudy',
          paletteIndex: 4,
          font: 'Caveat',
          animMode: 'fade',
          frameStyle: 'box',
          doodles: ['clouds', 'stars'],
          colorMode: 'solid',
          glowBlur: 22,
          fontWeight: '700'
        }
      ],
      fresh_morning: [
        {
          name: 'Emerald Sunrise',
          sceneId: 'nature',
          paletteIndex: 11,
          font: 'Outfit',
          animMode: 'slide_up',
          frameStyle: 'double',
          doodles: ['twinkle', 'butterflies'],
          colorMode: 'solid',
          glowBlur: 24,
          fontWeight: '600'
        },
        {
          name: 'Golden Radiance',
          sceneId: 'dreamy',
          paletteIndex: 10,
          font: 'Playfair Display',
          animMode: 'zoom_in',
          frameStyle: 'gradient',
          doodles: ['spark', 'twinkle'],
          colorMode: 'gradient',
          glowBlur: 32,
          fontWeight: '700'
        },
        {
          name: 'Fresh Bloom',
          sceneId: 'sakura',
          paletteIndex: 6,
          font: 'Montserrat',
          animMode: 'pop',
          frameStyle: 'corners',
          doodles: ['petals', 'spark'],
          colorMode: 'solid',
          glowBlur: 25,
          fontWeight: '600'
        }
      ],
      moody_rain: [
        {
          name: 'Rainy Slate',
          sceneId: 'rain',
          paletteIndex: 2,
          font: 'Inter',
          animMode: 'type',
          frameStyle: 'corners',
          doodles: ['rain', 'drizzle'],
          colorMode: 'solid',
          glowBlur: 24,
          fontWeight: '600'
        },
        {
          name: 'Ocean Ripple',
          sceneId: 'ocean',
          paletteIndex: 4,
          font: 'Montserrat',
          animMode: 'wave',
          frameStyle: 'box',
          doodles: ['bubbles', 'drizzle'],
          colorMode: 'gradient',
          glowBlur: 28,
          fontWeight: '600'
        }
      ],
      vintage_coffee: [
        {
          name: 'Warm Parchment',
          sceneId: 'paper',
          paletteIndex: 5,
          font: 'Caveat',
          animMode: 'handwriting',
          frameStyle: 'vintage',
          doodles: ['doodles'],
          colorMode: 'solid',
          glowBlur: 18,
          fontWeight: '700'
        },
        {
          name: 'Cafe Poetry',
          sceneId: 'paper',
          paletteIndex: 5,
          font: 'Playfair Display',
          animMode: 'type',
          frameStyle: 'double',
          doodles: ['spark', 'doodles'],
          colorMode: 'solid',
          glowBlur: 22,
          fontWeight: '600'
        }
      ],
      cyber_neon: [
        {
          name: 'Cyberpunk Neon',
          sceneId: 'city',
          paletteIndex: 9,
          font: 'Outfit',
          animMode: 'neon',
          frameStyle: 'neon',
          doodles: ['spark', 'orbit'],
          colorMode: 'rainbow',
          glowBlur: 35,
          fontWeight: '800'
        },
        {
          name: 'Electric Pulse',
          sceneId: 'purple',
          paletteIndex: 9,
          font: 'Montserrat',
          animMode: 'cascade',
          frameStyle: 'dotted',
          doodles: ['shooting_star', 'spark'],
          colorMode: 'glow',
          glowBlur: 30,
          fontWeight: '700'
        }
      ],
      classy_minimal: [
        {
          name: 'Obsidian Minimal',
          sceneId: 'minimal',
          paletteIndex: 8,
          font: 'Inter',
          animMode: 'type',
          frameStyle: 'box',
          doodles: ['stars'],
          colorMode: 'solid',
          glowBlur: 20,
          fontWeight: '600'
        },
        {
          name: 'Cinematic Luxury',
          sceneId: 'cinematic',
          paletteIndex: 10,
          font: 'Cinzel',
          animMode: 'cinematic',
          frameStyle: 'none',
          doodles: ['shooting_star', 'spark'],
          colorMode: 'gradient',
          glowBlur: 24,
          fontWeight: '700'
        }
      ]
    };

    const variations = moodProfiles[mood] || moodProfiles.cute_playful;
    const selected = variations[(this.autoStyleCounter - 1) % variations.length];

    this.state.sceneId = selected.sceneId;
    this.state.paletteIndex = selected.paletteIndex;
    this.state.font = selected.font;
    this.state.animMode = selected.animMode;
    this.state.frameStyle = selected.frameStyle;
    this.state.activeDoodles = [...selected.doodles];
    this.state.colorMode = selected.colorMode;
    this.state.glowBlur = selected.glowBlur;
    this.state.fontWeight = selected.fontWeight || '600';
    this.state.showFrame = selected.frameStyle !== 'none';

    this.state.customColors.text = null;
    this.state.customColors.glow = null;
    this.state.customColors.doodle = null;
    this.state.frameColor = null;

    if (len <= 10) {
      this.state.fontSize = 58;
      this.state.speed = 80;
    } else if (len <= 22) {
      this.state.fontSize = 50;
      this.state.speed = 68;
    } else if (len <= 45) {
      this.state.fontSize = 42;
      this.state.speed = 55;
    } else {
      this.state.fontSize = 34;
      this.state.speed = 45;
    }

    this.timeline.reset();
    this.syncUIFromState();
    const currentIdx = ((this.autoStyleCounter - 1) % variations.length) + 1;
    this.showToast(`Auto Styled: ${selected.name} (${currentIdx}/${variations.length})`);
  }

  showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 2200);
  }

  // Synchronize all inputs & controls from state
  syncUIFromState() {
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    };
    const setChecked = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.checked = val;
    };
    const setOut = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setVal('textInput', this.state.text);
    setVal('fontSelect', this.state.font);
    setVal('fontSize', this.state.fontSize);
    setOut('fontSizeOut', this.state.fontSize);
    setVal('fontWeight', this.state.fontWeight);
    setChecked('fontItalic', this.state.italic);
    setVal('letterSpacing', this.state.letterSpacing);
    setOut('letterSpacingOut', this.state.letterSpacing);
    setVal('lineHeight', this.state.lineHeight);
    setOut('lineHeightOut', this.state.lineHeight);
    setVal('textAlign', this.state.align);
    setVal('textOpacity', this.state.opacity);
    setOut('textOpacityOut', `${this.state.opacity}%`);
    setVal('colorMode', this.state.colorMode);

    // Frame UI & Atmosphere
    setVal('frameStyleSelect', this.state.frameStyle);
    setVal('frameWidth', this.state.frameWidth);
    setOut('frameWidthOut', `${this.state.frameWidth}px`);
    setVal('framePadding', this.state.framePadding);
    setOut('framePaddingOut', `${this.state.framePadding}px`);
    setChecked('showFrame', this.state.showFrame && this.state.frameStyle !== 'none');
    setChecked('filmGrainToggle', this.state.filmGrain);
    setChecked('vignetteToggle', this.state.vignette);

    setVal('glowBlur', this.state.glowBlur);
    setOut('glowBlurOut', this.state.glowBlur);
    setVal('strokeWidth', this.state.strokeWidth);
    setOut('strokeWidthOut', this.state.strokeWidth);
    setVal('shadowBlur', this.state.shadowBlur);
    setOut('shadowBlurOut', this.state.shadowBlur);

    setVal('posX', this.state.posX);
    setOut('posXOut', `${this.state.posX}%`);
    setVal('posY', this.state.posY);
    setOut('posYOut', `${this.state.posY}%`);
    setVal('rotation', this.state.rotation);
    setOut('rotationOut', `${this.state.rotation}°`);
    setVal('scale', this.state.scale);
    setOut('scaleOut', `${this.state.scale}%`);
    setVal('maxWidth', this.state.maxWidth);
    setOut('maxWidthOut', `${this.state.maxWidth}%`);

    setVal('doodleAmount', this.state.doodleConfig.amount);
    setOut('doodleAmountOut', this.state.doodleConfig.amount);
    setVal('doodleSize', this.state.doodleConfig.size);
    setOut('doodleSizeOut', `${this.state.doodleConfig.size}%`);
    setVal('doodleSpeed', this.state.doodleConfig.speed);
    setOut('doodleSpeedOut', `${this.state.doodleConfig.speed}%`);
    setVal('doodleOpacity', this.state.doodleConfig.opacity);
    setOut('doodleOpacityOut', `${this.state.doodleConfig.opacity}%`);

    setVal('animSpeed', this.state.speed);
    setOut('animSpeedOut', this.state.speed);
    setChecked('showCursor', this.state.showCursor);
    setChecked('loopToggle', this.state.loop);

    document.querySelectorAll('.sceneCard').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.id === this.state.sceneId);
    });

    document.querySelectorAll('.paletteCard').forEach(btn => {
      btn.classList.toggle('active', +btn.dataset.idx === this.state.paletteIndex);
    });

    this.syncDoodlesUI();
    this.syncAnimUI();
    this.highlightActivePreset();
    this.refreshLucideIcons();
  }

  bindEvents() {
    const $ = id => document.getElementById(id);

    // Top action buttons
    $('surpriseBtn').onclick = () => this.surpriseMe();
    $('autoStyleBtn').onclick = () => this.autoStyle();
    $('replayBtn').onclick = () => this.timeline.reset();
    
    // Share Design Button
    const shareBtn = $('shareBtn');
    if (shareBtn) {
      shareBtn.onclick = () => {
        const shareURL = this.getShareableURL();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(shareURL).then(() => {
            this.showToast('Design Link copied to clipboard!');
          }).catch(() => {
            prompt('Copy your Design Link:', shareURL);
          });
        } else {
          prompt('Copy your Design Link:', shareURL);
        }
      };
    }

    $('playPauseBtn').onclick = () => {
      this.timeline.togglePlay();
      const icon = $('playPauseBtn').querySelector('i');
      if (icon) {
        icon.setAttribute('data-lucide', this.timeline.isPaused ? 'play' : 'pause');
        this.refreshLucideIcons();
      }
    };

    // Interactive Touch & Drag Sparkle Emitter with rAF coalescing (Buttery smooth 60/120fps)
    let pendingTouch = null;
    let rAFScheduled = false;

    const processTouch = () => {
      rAFScheduled = false;
      if (pendingTouch) {
        const { clientX, clientY } = pendingTouch;
        pendingTouch = null;
        const rect = this.canvas.getBoundingClientRect();
        if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
          const x = ((clientX - rect.left) / rect.width) * this.W;
          const y = ((clientY - rect.top) / rect.height) * this.H;
          const palette = this.getCurrentPalette();
          this.particles.emitTouch(x, y, palette.primary, 3);
        }
      }
    };

    const handleTouchPointer = e => {
      const touch = e.touches ? e.touches[0] : e;
      if (!touch) return;
      pendingTouch = { clientX: touch.clientX, clientY: touch.clientY };
      if (!rAFScheduled) {
        rAFScheduled = true;
        requestAnimationFrame(processTouch);
      }
    };

    this.canvas.addEventListener('pointerdown', handleTouchPointer, { passive: true });
    this.canvas.addEventListener('pointermove', e => {
      if (e.buttons > 0) handleTouchPointer(e);
    }, { passive: true });
    this.canvas.addEventListener('touchmove', handleTouchPointer, { passive: true });

    // Text Input
    $('textInput').oninput = e => {
      this.state.text = e.target.value;
      this.timeline.reset();
      this.highlightActivePreset();
    };

    // Frame Studio & Atmosphere
    $('frameStyleSelect').onchange = e => {
      this.state.frameStyle = e.target.value;
      this.state.showFrame = e.target.value !== 'none';
      $('showFrame').checked = this.state.showFrame;
    };
    $('frameColorPicker').oninput = e => (this.state.frameColor = e.target.value);
    $('frameWidth').oninput = e => {
      this.state.frameWidth = +e.target.value;
      $('frameWidthOut').textContent = `${e.target.value}px`;
    };
    $('framePadding').oninput = e => {
      this.state.framePadding = +e.target.value;
      $('framePaddingOut').textContent = `${e.target.value}px`;
    };
    $('showFrame').onchange = e => {
      this.state.showFrame = e.target.checked;
      if (!e.target.checked) this.state.frameStyle = 'none';
      else if (this.state.frameStyle === 'none') this.state.frameStyle = 'corners';
      $('frameStyleSelect').value = this.state.frameStyle;
    };

    const grainToggle = $('filmGrainToggle');
    if (grainToggle) {
      grainToggle.onchange = e => (this.state.filmGrain = e.target.checked);
    }
    const vignetteToggle = $('vignetteToggle');
    if (vignetteToggle) {
      vignetteToggle.onchange = e => (this.state.vignette = e.target.checked);
    }

    // Typography
    $('fontSelect').onchange = e => (this.state.font = e.target.value);
    $('fontSize').oninput = e => {
      this.state.fontSize = +e.target.value;
      $('fontSizeOut').textContent = e.target.value;
    };
    $('fontWeight').onchange = e => (this.state.fontWeight = e.target.value);
    $('fontItalic').onchange = e => (this.state.italic = e.target.checked);
    $('letterSpacing').oninput = e => {
      this.state.letterSpacing = +e.target.value;
      $('letterSpacingOut').textContent = e.target.value;
    };
    $('lineHeight').oninput = e => {
      this.state.lineHeight = +e.target.value;
      $('lineHeightOut').textContent = e.target.value;
    };
    $('textAlign').onchange = e => (this.state.align = e.target.value);
    $('textOpacity').oninput = e => {
      this.state.opacity = +e.target.value;
      $('textOpacityOut').textContent = `${e.target.value}%`;
    };

    // Color Studio
    $('colorMode').onchange = e => {
      this.state.colorMode = e.target.value;
      $('gradientControls').style.display = e.target.value === 'gradient' ? 'grid' : 'none';
    };
    $('textColorPicker').oninput = e => (this.state.customColors.text = e.target.value);
    $('glowColorPicker').oninput = e => (this.state.customColors.glow = e.target.value);
    $('doodleColorPicker').oninput = e => (this.state.customColors.doodle = e.target.value);
    $('gradStartPicker').oninput = e => (this.state.customColors.gradientStart = e.target.value);
    $('gradEndPicker').oninput = e => (this.state.customColors.gradientEnd = e.target.value);

    // Effects & Stroke
    $('glowBlur').oninput = e => {
      this.state.glowBlur = +e.target.value;
      $('glowBlurOut').textContent = e.target.value;
    };
    $('strokeWidth').oninput = e => {
      this.state.strokeWidth = +e.target.value;
      $('strokeWidthOut').textContent = e.target.value;
    };
    $('strokeColorPicker').oninput = e => (this.state.strokeColor = e.target.value);
    $('shadowBlur').oninput = e => {
      this.state.shadowBlur = +e.target.value;
      $('shadowBlurOut').textContent = e.target.value;
    };

    // Layout
    $('posX').oninput = e => {
      this.state.posX = +e.target.value;
      $('posXOut').textContent = `${e.target.value}%`;
    };
    $('posY').oninput = e => {
      this.state.posY = +e.target.value;
      $('posYOut').textContent = `${e.target.value}%`;
    };
    $('rotation').oninput = e => {
      this.state.rotation = +e.target.value;
      $('rotationOut').textContent = `${e.target.value}°`;
    };
    $('scale').oninput = e => {
      this.state.scale = +e.target.value;
      $('scaleOut').textContent = `${e.target.value}%`;
    };
    $('maxWidth').oninput = e => {
      this.state.maxWidth = +e.target.value;
      $('maxWidthOut').textContent = `${e.target.value}%`;
    };

    // Doodle Physics
    $('doodleAmount').oninput = e => {
      this.state.doodleConfig.amount = +e.target.value;
      $('doodleAmountOut').textContent = e.target.value;
    };
    $('doodleSize').oninput = e => {
      this.state.doodleConfig.size = +e.target.value;
      $('doodleSizeOut').textContent = `${e.target.value}%`;
    };
    $('doodleSpeed').oninput = e => {
      this.state.doodleConfig.speed = +e.target.value;
      $('doodleSpeedOut').textContent = `${e.target.value}%`;
    };
    $('doodleOpacity').oninput = e => {
      this.state.doodleConfig.opacity = +e.target.value;
      $('doodleOpacityOut').textContent = `${e.target.value}%`;
    };

    // Timing & Motion
    $('animSpeed').oninput = e => {
      this.state.speed = +e.target.value;
      $('animSpeedOut').textContent = e.target.value;
      this.timeline.reset();
    };
    $('showCursor').onchange = e => (this.state.showCursor = e.target.checked);
    $('loopToggle').onchange = e => {
      this.state.loop = e.target.checked;
      this.timeline.reset();
    };

    // Interactive Timeline Scrubber
    const timelineTrack = $('timelineTrack');
    const handleScrub = e => {
      const rect = timelineTrack.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const prog = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const timing = this.timeline.computeDuration(
        this.state.text.length,
        this.state.speed,
        this.state.animMode,
        this.state.holdDuration,
        this.state.loop
      );
      this.timeline.setScrub(prog, timing.totalMs);
    };

    timelineTrack.addEventListener('mousedown', e => {
      handleScrub(e);
      const onMove = ev => handleScrub(ev);
      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    });

    timelineTrack.addEventListener('touchstart', e => handleScrub(e), { passive: true });
    timelineTrack.addEventListener('touchmove', e => handleScrub(e), { passive: true });

    // Preview Mode Switcher
    document.querySelectorAll('.previewModeBtn').forEach(b => {
      b.onclick = () => {
        document.querySelectorAll('.previewModeBtn').forEach(z => z.classList.remove('active'));
        b.classList.add('active');
        const mode = b.dataset.mode;
        this.state.previewMode = mode;

        const previewContainer = $('previewContainer');
        const circleMask = $('telegramCircleMask');

        if (mode === 'telegram') {
          circleMask.style.display = 'block';
          previewContainer.classList.add('telegramMode');
        } else {
          circleMask.style.display = 'none';
          previewContainer.classList.remove('telegramMode');
        }

        if (mode === 'fullscreen') {
          if (!document.fullscreenElement) {
            previewContainer.requestFullscreen().catch(() => {});
          }
        } else if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      };
    });

    // Mobile Accordion toggles
    document.querySelectorAll('.accordionHeader').forEach(head => {
      head.onclick = () => {
        const item = head.parentElement;
        item.classList.toggle('open');
      };
    });

    // Export Triggers
    $('exportGifBtn').onclick = () => this.handleExport('gif');
    const compactGifBtn = $('exportCompactGifBtn');
    if (compactGifBtn) {
      compactGifBtn.onclick = () => this.handleExport('compact-gif');
    }
    $('exportMp4Btn').onclick = () => this.handleExport('mp4');
    $('exportPngBtn').onclick = () => this.handleExport('png');
  }

  async handleExport(format) {
    if (this.state.isExporting) return;
    this.state.isExporting = true;

    const modal = document.getElementById('exportModal');
    const progBar = document.getElementById('exportProgressFill');
    const progText = document.getElementById('exportProgressText');
    const exportStatus = document.getElementById('exportStatus');

    modal.classList.add('visible');
    progBar.style.width = '0%';
    progText.textContent = '0%';
    exportStatus.textContent = `Preparing ${format.toUpperCase()} (No Watermark)...`;

    const res = +document.getElementById('exportResolution').value || 512;
    const fps = +document.getElementById('exportFps').value || 24;
    const timing = this.timeline.computeDuration(
      this.state.text.length,
      this.state.speed,
      this.state.animMode,
      this.state.holdDuration,
      this.state.loop
    );

    try {
      if (format === 'png') {
        exportStatus.textContent = 'Generating Crisp Snapshot...';
        await this.exporter.exportPNG({ resolution: res }, timing);
        progBar.style.width = '100%';
        progText.textContent = '100%';
      } else if (format === 'compact-gif') {
        exportStatus.textContent = 'Encoding Telegram/Discord Compact GIF (<5MB)...';
        await this.exporter.exportGIF(
          { resolution: 380, fps: 14, durationMs: timing.totalMs, compact: true },
          timing,
          p => {
            progBar.style.width = `${p}%`;
            progText.textContent = `${p}%`;
          }
        );
      } else if (format === 'gif') {
        exportStatus.textContent = 'Rendering GIF frames & quantizing colors...';
        await this.exporter.exportGIF(
          { resolution: res, fps, durationMs: timing.totalMs, compact: false },
          timing,
          p => {
            progBar.style.width = `${p}%`;
            progText.textContent = `${p}%`;
          }
        );
      } else if (format === 'mp4') {
        exportStatus.textContent = 'Recording smooth 60fps video stream...';
        await this.exporter.exportVideo(
          { resolution: res, fps, durationMs: timing.totalMs, quality: 'high' },
          timing,
          p => {
            progBar.style.width = `${p}%`;
            progText.textContent = `${p}%`;
          }
        );
      }

      exportStatus.textContent = 'Download complete!';
      setTimeout(() => {
        modal.classList.remove('visible');
        this.state.isExporting = false;
      }, 1500);
    } catch (err) {
      exportStatus.textContent = `Export error: ${err.message}`;
      setTimeout(() => {
        modal.classList.remove('visible');
        this.state.isExporting = false;
      }, 3000);
    }
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.app = new DPStudioApp();
});
