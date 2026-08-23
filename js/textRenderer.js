/**
 * DP Creator Studio V4 - Advanced Typography & Hyper-Realistic Animation Engine
 * 18 Animation Styles with Physics-Driven Easing (Damped Springs, Elastic Jelly, 3D Flip, Cyber Glitch, Shimmer Sweep),
 * 3-Phase Lifecycle (Intro -> Hold -> Outro), Stroke/Outline, Multi-line wrapping,
 * Dynamic Rainbow/Gradient fill, and Animated Emoji Hop Burst.
 */

const EMOJI_REGEX = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;

export class TextRenderer {
  constructor() {
    this.cursorTimer = 0;
  }

  // Detect emojis in string
  hasEmoji(str) {
    return EMOJI_REGEX.test(str);
  }

  // Parse text into tokens (characters and whole emoji glyphs)
  tokenize(text) {
    if (!text) return [];
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
      return Array.from(segmenter.segment(text), s => s.segment);
    }
    return Array.from(text);
  }

  // Wrap text while respecting max width
  wrapText(ctx, text, maxWidth) {
    if (!text) return [''];
    const lines = [];
    const paragraphs = text.split('\n');

    for (const paragraph of paragraphs) {
      if (paragraph === '') {
        lines.push('');
        continue;
      }
      const words = paragraph.split(/(\s+)/);
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine + word;
        const testWidth = ctx.measureText(testLine).width;
        if (testWidth > maxWidth && currentLine.trim().length > 0) {
          lines.push(currentLine.trimEnd());
          currentLine = word.trimStart();
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine.length > 0) {
        lines.push(currentLine);
      }
    }
    return lines.length > 0 ? lines : [''];
  }

  draw(ctx, W, H, time, elapsed, config, palette, timing) {
    const rawText = config.text || 'Hello Ji...😊';
    const fs = config.fontSize || 50;
    const fontName = config.font || 'Outfit';
    const fontWeight = config.fontWeight || '600';
    const fontStyle = config.italic ? 'italic' : 'normal';
    const letterSpacing = config.letterSpacing || 0;
    const lineHeightMult = config.lineHeight || 1.35;
    const align = config.align || 'center';
    const animMode = config.animMode || 'type';
    const glowBlur = config.glowBlur || 26;
    const glowColor = config.glowColor || palette.glow;
    const textMode = config.colorMode || 'solid';
    const textColor = config.textColor || palette.text;
    const strokeWidth = config.strokeWidth || 0;
    const strokeColor = config.strokeColor || '#000000';
    const shadowBlur = config.shadowBlur || 0;
    const shadowOffset = config.shadowOffset || 0;
    const shadowColor = config.shadowColor || 'rgba(0,0,0,0.6)';
    const textOpacity = (config.opacity || 100) / 100;
    const posX = (config.posX !== undefined ? config.posX : 50) / 100;
    const posY = (config.posY !== undefined ? config.posY : 50) / 100;
    const rotation = ((config.rotation || 0) * Math.PI) / 180;
    const scale = (config.scale || 100) / 100;
    const maxWidth = W * ((config.maxWidth || 80) / 100);

    ctx.save();

    // Configure base font
    ctx.font = `${fontStyle} ${fontWeight} ${fs}px "${fontName}", sans-serif`;
    if ('letterSpacing' in ctx) {
      ctx.letterSpacing = `${letterSpacing}px`;
    }
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';

    const tokens = this.tokenize(rawText);
    const totalChars = tokens.length;

    // Determine 3-Phase Lifecycle
    const { inMs, holdMs, outMs } = timing || { inMs: 1000, holdMs: 2500, outMs: 650, totalMs: 4150 };
    let phase = 'in';
    let phaseProgress = 0;

    if (elapsed < inMs) {
      phase = 'in';
      phaseProgress = Math.max(0, Math.min(1, elapsed / inMs));
    } else if (elapsed < inMs + holdMs) {
      phase = 'hold';
      phaseProgress = Math.max(0, Math.min(1, (elapsed - inMs) / holdMs));
    } else {
      phase = 'out';
      phaseProgress = Math.max(0, Math.min(1, (elapsed - inMs - holdMs) / Math.max(1, outMs)));
    }

    // Animation variables with physics
    let visibleTokenCount = totalChars;
    let animAlpha = 1;
    let animScaleX = 1;
    let animScaleY = 1;
    let animOffsetX = 0;
    let animOffsetY = 0;
    let isTypingActive = false;
    let emojiBurst = 0;
    let customLetterRender = null;
    let penTipPosition = null;
    let isGlitching = false;
    let isShimmering = false;

    if (phase === 'out') {
      const outEase = phaseProgress * phaseProgress;
      animAlpha = Math.max(0, 1 - outEase);
      animScaleX = 1 - outEase * 0.08;
      animScaleY = 1 - outEase * 0.08;
      if (animMode === 'slide_up') animOffsetY = -outEase * 40;
      else if (animMode === 'slide_down') animOffsetY = outEase * 40;
      else if (animMode === 'slide_left') animOffsetX = -outEase * 60;
      else if (animMode === 'slide_right') animOffsetX = outEase * 60;
    } else {
      switch (animMode) {
        case 'type': {
          if (phase === 'in') {
            const typedCount = Math.min(totalChars, Math.max(1, Math.floor(phaseProgress * totalChars)));
            visibleTokenCount = typedCount;
            isTypingActive = visibleTokenCount < totalChars;
          } else {
            visibleTokenCount = totalChars;
            const holdElapsed = elapsed - inMs;
            if (holdElapsed < 900) {
              const ep = holdElapsed / 900;
              emojiBurst = 1 - ep;
            }
          }
          break;
        }
        case 'fade': {
          if (phase === 'in') {
            const ease = 1 - Math.pow(1 - phaseProgress, 4);
            animAlpha = ease;
            animOffsetY = (1 - ease) * 16;
          }
          break;
        }
        case 'pop': {
          if (phase === 'in') {
            const p = phaseProgress;
            const s = p === 0 ? 0 : p === 1 ? 1 : 1 - Math.exp(-6 * p) * Math.cos(10 * p);
            animScaleX = s;
            animScaleY = s;
            animAlpha = Math.min(1, p * 3);
          }
          break;
        }
        case 'elastic_blob': {
          if (phase === 'in') {
            const p = phaseProgress;
            const stretch = Math.sin(p * Math.PI) * 0.35;
            const spring = 1 - Math.exp(-7 * p) * Math.cos(8 * p);
            animScaleX = spring + stretch;
            animScaleY = spring - stretch * 0.6;
            animAlpha = Math.min(1, p * 2.8);
          }
          break;
        }
        case 'glitch': {
          if (phase === 'in') {
            if (phaseProgress < 0.6) {
              isGlitching = true;
              animOffsetX = (Math.random() - 0.5) * 14 * (1 - phaseProgress);
              animOffsetY = (Math.random() - 0.5) * 6 * (1 - phaseProgress);
              animAlpha = 0.5 + Math.random() * 0.5;
            } else {
              animAlpha = 1;
            }
          } else {
            // Micro glitch spike during hold
            if (Math.random() < 0.04) {
              isGlitching = true;
              animOffsetX = (Math.random() - 0.5) * 8;
            }
          }
          break;
        }
        case 'shimmer': {
          isShimmering = true;
          if (phase === 'in') {
            animAlpha = 1 - Math.pow(1 - phaseProgress, 3);
            animOffsetY = (1 - animAlpha) * 15;
          }
          break;
        }
        case 'flip_3d': {
          if (phase === 'in') {
            const ease = 1 - Math.pow(1 - phaseProgress, 3);
            animScaleY = Math.max(0.05, ease);
            animOffsetY = (1 - ease) * -40;
            animAlpha = Math.min(1, phaseProgress * 2.5);
          }
          break;
        }
        case 'slide_up': {
          if (phase === 'in') {
            const ease = 1 - Math.pow(1 - phaseProgress, 3.5);
            animOffsetY = (1 - ease) * 70;
            animScaleX = 0.96 + 0.04 * ease;
            animScaleY = 0.96 + 0.04 * ease;
            animAlpha = Math.min(1, phaseProgress * 2.2);
          }
          break;
        }
        case 'slide_down': {
          if (phase === 'in') {
            const ease = 1 - Math.pow(1 - phaseProgress, 3.5);
            animOffsetY = (ease - 1) * 70;
            animScaleX = 0.96 + 0.04 * ease;
            animScaleY = 0.96 + 0.04 * ease;
            animAlpha = Math.min(1, phaseProgress * 2.2);
          }
          break;
        }
        case 'slide_left': {
          if (phase === 'in') {
            const ease = 1 - Math.pow(1 - phaseProgress, 3.5);
            animOffsetX = (1 - ease) * 90;
            animAlpha = Math.min(1, phaseProgress * 2.2);
          }
          break;
        }
        case 'slide_right': {
          if (phase === 'in') {
            const ease = 1 - Math.pow(1 - phaseProgress, 3.5);
            animOffsetX = (ease - 1) * 90;
            animAlpha = Math.min(1, phaseProgress * 2.2);
          }
          break;
        }
        case 'zoom_in': {
          if (phase === 'in') {
            const ease = 1 - Math.pow(1 - phaseProgress, 3);
            const z = 0.35 + 0.65 * ease;
            animScaleX = z;
            animScaleY = z;
            animAlpha = Math.min(1, phaseProgress * 2.5);
          } else {
            const z = 1 + Math.sin(phaseProgress * Math.PI) * 0.025;
            animScaleX = z;
            animScaleY = z;
          }
          break;
        }
        case 'wave': {
          if (phase === 'in') {
            animAlpha = Math.min(1, phaseProgress * 1.6);
          }
          break;
        }
        case 'cascade': {
          customLetterRender = 'cascade';
          if (phase === 'hold') {
            const holdElapsed = elapsed - inMs;
            if (holdElapsed < 800) {
              emojiBurst = 1 - holdElapsed / 800;
            }
          }
          break;
        }
        case 'cinematic': {
          if (phase === 'in') {
            const ease = 1 - Math.pow(1 - phaseProgress, 2.5);
            animAlpha = ease;
            const sc = 1.04 - (1 - ease) * 0.04;
            animScaleX = sc;
            animScaleY = sc;
          }
          break;
        }
        case 'handwriting': {
          if (phase === 'in') {
            visibleTokenCount = Math.min(totalChars, Math.max(1, Math.floor(phaseProgress * totalChars)));
            isTypingActive = visibleTokenCount < totalChars;
            penTipPosition = true;
          }
          break;
        }
        case 'neon': {
          if (phase === 'in') {
            let flicker = 1;
            if (phaseProgress < 0.12) flicker = Math.random() > 0.4 ? 1 : 0.08;
            else if (phaseProgress < 0.28) flicker = 0.15;
            else if (phaseProgress < 0.44) flicker = Math.random() > 0.3 ? 1 : 0.2;
            else flicker = 0.75 + 0.25 * phaseProgress;
            animAlpha = flicker;
          } else {
            animAlpha = 0.95 + 0.05 * Math.sin(time * 0.04);
          }
          break;
        }
        case 'retype': {
          const halfText = Math.max(1, Math.floor(totalChars * 0.55));
          if (phase === 'in') {
            if (phaseProgress < 0.5) {
              visibleTokenCount = Math.floor((phaseProgress / 0.5) * totalChars);
            } else if (phaseProgress < 0.75) {
              const delProg = (phaseProgress - 0.5) / 0.25;
              visibleTokenCount = Math.max(halfText, totalChars - Math.floor(delProg * (totalChars - halfText)));
            } else {
              const retProg = (phaseProgress - 0.75) / 0.25;
              visibleTokenCount = halfText + Math.floor(retProg * (totalChars - halfText));
            }
            isTypingActive = visibleTokenCount < totalChars;
          }
          break;
        }
        default:
          break;
      }
    }

    // Build visible string for line wrapping
    const visibleTokens = tokens.slice(0, visibleTokenCount);
    const visibleText = visibleTokens.join('');
    const lines = this.wrapText(ctx, visibleText, maxWidth);
    const lh = fs * lineHeightMult;

    // Calculate center coordinates
    const targetCenterX = W * posX;
    const targetCenterY = H * posY;

    // Apply global transforms
    ctx.translate(targetCenterX + animOffsetX, targetCenterY + animOffsetY);
    ctx.rotate(rotation);
    ctx.scale(scale * animScaleX, scale * animScaleY);
    ctx.globalAlpha = textOpacity * animAlpha;

    // Configure text fill style
    let fillStyle = textColor;
    if (isShimmering) {
      const g = ctx.createLinearGradient(-maxWidth / 2, 0, maxWidth / 2, 0);
      const sweep = ((time * 0.001) % 2) - 0.5;
      const p1 = Math.max(0, Math.min(1, sweep - 0.2));
      const p2 = Math.max(0, Math.min(1, sweep));
      const p3 = Math.max(0, Math.min(1, sweep + 0.2));
      g.addColorStop(0, textColor);
      g.addColorStop(p1, textColor);
      g.addColorStop(p2, '#ffffff');
      g.addColorStop(p3, textColor);
      g.addColorStop(1, textColor);
      fillStyle = g;
    } else if (textMode === 'gradient') {
      const g = ctx.createLinearGradient(-maxWidth / 2, 0, maxWidth / 2, 0);
      g.addColorStop(0, config.gradientStart || palette.primary);
      g.addColorStop(1, config.gradientEnd || palette.accent);
      fillStyle = g;
    } else if (textMode === 'rainbow') {
      const g = ctx.createLinearGradient(-maxWidth / 2, 0, maxWidth / 2, 0);
      const hueShift = (time * 0.05) % 360;
      g.addColorStop(0, `hsl(${hueShift}, 100%, 75%)`);
      g.addColorStop(0.5, `hsl(${(hueShift + 120) % 360}, 100%, 75%)`);
      g.addColorStop(1, `hsl(${(hueShift + 240) % 360}, 100%, 75%)`);
      fillStyle = g;
    } else if (textMode === 'glow') {
      fillStyle = '#ffffff';
    }

    const totalHeight = lines.length * lh;
    let startY = -totalHeight / 2 + lh / 2;

    // Render lines based on animation mode
    if (animMode === 'wave') {
      for (let lIdx = 0; lIdx < lines.length; lIdx++) {
        const line = lines[lIdx];
        const curY = startY + lIdx * lh;
        let lineX = 0;
        if (align === 'left') lineX = -maxWidth / 2;
        else if (align === 'right') lineX = maxWidth / 2;

        this.renderWaveLine(
          ctx,
          line,
          lineX,
          curY,
          time,
          lIdx,
          fs,
          letterSpacing,
          align,
          fillStyle,
          glowBlur,
          glowColor,
          strokeWidth,
          strokeColor,
          shadowBlur,
          shadowOffset,
          shadowColor
        );
      }
    } else if (customLetterRender === 'cascade') {
      let globalCharIdx = 0;
      for (let lIdx = 0; lIdx < lines.length; lIdx++) {
        const line = lines[lIdx];
        const curY = startY + lIdx * lh;
        let lineX = 0;
        if (align === 'left') lineX = -maxWidth / 2;
        else if (align === 'right') lineX = maxWidth / 2;

        const lineChars = this.tokenize(line);
        let totalWidth = 0;
        const widths = lineChars.map(c => {
          const w = ctx.measureText(c).width + letterSpacing;
          totalWidth += w;
          return w;
        });

        let curX = lineX;
        if (align === 'center') curX = lineX - totalWidth / 2;
        else if (align === 'right') curX = lineX - totalWidth;

        for (let i = 0; i < lineChars.length; i++, globalCharIdx++) {
          const ch = lineChars[i];
          const charW = widths[i];

          let charDropY = 0;
          let charAlpha = 1;
          let charSpringScale = 1;

          if (phase === 'in') {
            const startDelay = (globalCharIdx / Math.max(1, totalChars)) * 0.65;
            const lp = Math.max(0, Math.min(1, (phaseProgress - startDelay) / 0.35));
            const springEase = 1 - Math.exp(-6 * lp) * Math.cos(9 * lp);
            charDropY = (1 - Math.min(1, lp * 1.5)) * -80;
            charSpringScale = 0.5 + 0.5 * springEase;
            charAlpha = Math.min(1, lp * 2.5);
          }

          ctx.save();
          ctx.globalAlpha = textOpacity * animAlpha * charAlpha;

          if (shadowBlur > 0 || shadowOffset > 0) {
            ctx.shadowColor = shadowColor;
            ctx.shadowBlur = shadowBlur;
            ctx.shadowOffsetX = shadowOffset;
            ctx.shadowOffsetY = shadowOffset;
          }
          if (glowBlur > 0) {
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = glowBlur;
          }
          if (strokeWidth > 0) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeWidth * 2;
            ctx.strokeText(ch, curX + charW / 2, curY + charDropY);
          }

          ctx.fillStyle = fillStyle;
          ctx.fillText(ch, curX + charW / 2, curY + charDropY);
          ctx.restore();

          curX += charW;
        }
      }
    } else {
      // Standard line-by-line render with glitch and emoji hop
      for (let lIdx = 0; lIdx < lines.length; lIdx++) {
        const line = lines[lIdx];
        const curY = startY + lIdx * lh;
        let lineX = 0;
        if (align === 'left') lineX = -maxWidth / 2;
        else if (align === 'right') lineX = maxWidth / 2;

        if (isGlitching) {
          // Cyber Chromatic Aberration Red/Cyan split
          ctx.save();
          ctx.shadowColor = '#00f5ff';
          ctx.shadowBlur = 12;
          ctx.fillStyle = '#00f5ff';
          ctx.fillText(line, lineX - 3, curY);
          ctx.shadowColor = '#ff0077';
          ctx.fillStyle = '#ff0077';
          ctx.fillText(line, lineX + 3, curY);
          ctx.restore();
        }

        ctx.save();
        if (shadowBlur > 0 || shadowOffset > 0) {
          ctx.shadowColor = shadowColor;
          ctx.shadowBlur = shadowBlur;
          ctx.shadowOffsetX = shadowOffset;
          ctx.shadowOffsetY = shadowOffset;
        }
        if (glowBlur > 0) {
          ctx.shadowColor = glowColor;
          ctx.shadowBlur = glowBlur;
        }
        if (strokeWidth > 0) {
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = strokeWidth * 2;
          ctx.strokeText(line, lineX, curY);
        }

        ctx.fillStyle = fillStyle;
        ctx.fillText(line, lineX, curY);
        ctx.restore();
      }
    }

    // Emoji-aware pop & radial sparkle burst
    if (emojiBurst > 0 && this.hasEmoji(rawText)) {
      this.renderEmojiBurst(ctx, 0, startY + (lines.length - 1) * lh, emojiBurst, palette);
    }

    // Handwriting glowing pen tip sparkle
    if (penTipPosition && lines.length > 0) {
      const lastLine = lines[lines.length - 1];
      const textW = ctx.measureText(lastLine).width;
      let tipX = 0;
      if (align === 'center') tipX = textW / 2 + 4;
      else if (align === 'left') tipX = -maxWidth / 2 + textW + 4;
      else if (align === 'right') tipX = maxWidth / 2 + 4;
      const tipY = startY + (lines.length - 1) * lh + lh * 0.2;
      this.renderPenTip(ctx, tipX, tipY, palette.primary);
    }

    // Blinking typing cursor
    if (
      (animMode === 'type' || animMode === 'retype') &&
      config.showCursor !== false &&
      (isTypingActive || Math.floor(time / 450) % 2 === 0) &&
      phase !== 'out'
    ) {
      this.renderCursor(ctx, lines, lh, startY, align, maxWidth, palette.primary, fs);
    }

    ctx.restore();
  }

  // Glowing Handwriting pen tip
  renderPenTip(ctx, x, y, color) {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Wave motion rendering character by character
  renderWaveLine(
    ctx,
    line,
    x,
    y,
    time,
    lineIdx,
    fs,
    letterSpacing,
    align,
    fillStyle,
    glowBlur,
    glowColor,
    strokeWidth,
    strokeColor,
    shadowBlur,
    shadowOffset,
    shadowColor
  ) {
    const chars = this.tokenize(line);
    let totalWidth = 0;
    const widths = chars.map(c => {
      const w = ctx.measureText(c).width + letterSpacing;
      totalWidth += w;
      return w;
    });

    let curX = x;
    if (align === 'center') curX = x - totalWidth / 2;
    else if (align === 'right') curX = x - totalWidth;

    ctx.save();
    if (glowBlur > 0) {
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = glowBlur;
    }

    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i];
      const charW = widths[i];
      const waveY = y + Math.sin(time * 0.005 + (lineIdx * 5 + i) * 0.45) * (fs * 0.16);

      if (strokeWidth > 0) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth * 2;
        ctx.strokeText(ch, curX + charW / 2, waveY);
      }

      ctx.fillStyle = fillStyle;
      ctx.fillText(ch, curX + charW / 2, waveY);
      curX += charW;
    }
    ctx.restore();
  }

  // Blinking typing cursor bar with gradient glow
  renderCursor(ctx, lines, lh, startY, align, maxWidth, color, fs) {
    const lastLine = lines[lines.length - 1] || '';
    const lastY = startY + (lines.length - 1) * lh;
    const textW = ctx.measureText(lastLine).width;

    let cursorX = 0;
    if (align === 'center') {
      cursorX = textW / 2 + 6;
    } else if (align === 'left') {
      cursorX = -maxWidth / 2 + textW + 6;
    } else if (align === 'right') {
      cursorX = maxWidth / 2 + 6;
    }

    ctx.save();
    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.lineWidth = Math.max(2.5, fs * 0.06);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cursorX, lastY - lh * 0.32);
    ctx.lineTo(cursorX, lastY + lh * 0.32);
    ctx.stroke();
    ctx.restore();
  }

  // Emoji Pop radial burst
  renderEmojiBurst(ctx, x, y, strength, palette) {
    ctx.save();
    const count = 8;
    const r = (1 - strength) * 45;
    ctx.strokeStyle = palette.primary;
    ctx.fillStyle = palette.accent;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = strength * 0.85;

    for (let i = 0; i < count; i++) {
      const ang = (i * Math.PI * 2) / count;
      const bx = x + Math.cos(ang) * r;
      const by = y + Math.sin(ang) * r;

      ctx.beginPath();
      ctx.arc(bx, by, 2.5 * strength, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}
