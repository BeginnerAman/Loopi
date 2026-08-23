/**
 * DP Creator Studio V4 - Main App Controller & State Management
 * Lucide Icons Integration, Mobile-First 60fps Loop, Frame Studio
 */

import {
  DEFAULT_TEXT,
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
      
      // Frame Studio
      frameStyle: 'neon',
      frameColor: null,
      frameWidth: 2,
      framePadding: 26,
      showFrame: true,

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

    this.init();
  }

  init() {
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

    // 1. Draw Immersive Scene Background + Frame Studio
    const frameColor = this.state.frameColor || palette.primary;
    this.backgrounds.draw(ctx, W, H, time, this.state.sceneId, palette, {
      frameStyle: this.state.frameStyle,
      frameColor: frameColor,
      frameWidth: this.state.frameWidth * (W / 720),
      framePadding: this.state.framePadding * (W / 720),
      showFrame: this.state.showFrame && this.state.frameStyle !== 'none'
    });

    // 2. Draw Multi-Layer Particle Doodles
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

  // 🧠 "Auto Style": Intelligent Aesthetic Matcher
  autoStyle() {
    const text = this.state.text.toLowerCase();

    if (text.includes('hello') || text.includes('😊') || text.includes('cute')) {
      this.state.sceneId = 'purple';
      this.state.paletteIndex = 0;
      this.state.font = 'Outfit';
      this.state.animMode = 'type';
      this.state.frameStyle = 'neon';
      this.state.activeDoodles = ['spark', 'twinkle'];
      this.state.glowBlur = 28;
    } else if (text.includes('❤️') || text.includes('love') || text.includes('sweet')) {
      this.state.sceneId = 'sakura';
      this.state.paletteIndex = 2;
      this.state.font = 'Playfair Display';
      this.state.animMode = 'pop';
      this.state.frameStyle = 'vintage';
      this.state.activeDoodles = ['hearts', 'petals'];
      this.state.glowBlur = 30;
    } else if (text.includes('morning') || text.includes('☀️') || text.includes('sun')) {
      this.state.sceneId = 'nature';
      this.state.paletteIndex = 7;
      this.state.font = 'Outfit';
      this.state.animMode = 'slide_up';
      this.state.frameStyle = 'double';
      this.state.activeDoodles = ['twinkle', 'spark'];
    } else if (text.includes('night') || text.includes('🌙') || text.includes('dream')) {
      this.state.sceneId = 'moonlight';
      this.state.paletteIndex = 1;
      this.state.font = 'Playfair Display';
      this.state.animMode = 'cinematic';
      this.state.frameStyle = 'corners';
      this.state.activeDoodles = ['stars', 'shooting_star'];
    } else if (text.includes('coffee') || text.includes('☕') || text.includes('note')) {
      this.state.sceneId = 'paper';
      this.state.paletteIndex = 5;
      this.state.font = 'Caveat';
      this.state.animMode = 'handwriting';
      this.state.frameStyle = 'vintage';
      this.state.activeDoodles = ['doodles'];
    } else {
      this.state.sceneId = 'aurora';
      this.state.paletteIndex = 0;
      this.state.font = 'Outfit';
      this.state.animMode = 'wave';
      this.state.frameStyle = 'corners';
      this.state.activeDoodles = ['spark', 'twinkle'];
    }

    this.timeline.reset();
    this.syncUIFromState();
    this.showToast('Auto Styled Perfectly!');
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

    // Frame UI
    setVal('frameStyleSelect', this.state.frameStyle);
    setVal('frameWidth', this.state.frameWidth);
    setOut('frameWidthOut', `${this.state.frameWidth}px`);
    setVal('framePadding', this.state.framePadding);
    setOut('framePaddingOut', `${this.state.framePadding}px`);
    setChecked('showFrame', this.state.showFrame && this.state.frameStyle !== 'none');

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
    $('playPauseBtn').onclick = () => {
      this.timeline.togglePlay();
      const icon = $('playPauseBtn').querySelector('i');
      if (icon) {
        icon.setAttribute('data-lucide', this.timeline.isPaused ? 'play' : 'pause');
        this.refreshLucideIcons();
      }
    };

    // Text Input
    $('textInput').oninput = e => {
      this.state.text = e.target.value;
      this.timeline.reset();
      this.highlightActivePreset();
    };

    // Frame Studio Controls
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

    // Preview Mode Switcher (Canvas | Telegram DP | Fullscreen)
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
      } else if (format === 'gif') {
        exportStatus.textContent = 'Rendering GIF frames & quantizing colors...';
        await this.exporter.exportGIF(
          { resolution: res, fps, durationMs: timing.totalMs },
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
