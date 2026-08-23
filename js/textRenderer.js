/**
 * DP Creator Studio V4 - Advanced Typography & Emoji Animation Engine
 * 15 Animation Styles, Deep Styling, Stroke/Outline, Shadow, Rainbow/Gradient fill, Emoji-Aware Pop
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
    // Using Intl.Segmenter if available or fallback regex/array spread
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

  draw(ctx, W, H, time, elapsed, config, palette) {
    const rawText = config.text || 'Hello Ji...😊';
    const fs = config.fontSize || 50;
    const fontName = config.font || 'Outfit';
    const fontWeight = config.fontWeight || '600';
    const fontStyle = config.italic ? 'italic' : 'normal';
    const letterSpacing = config.letterSpacing || 0;
    const lineHeightMult = config.lineHeight || 1.35;
    const align = config.align || 'center';
    const animMode = config.animMode || 'type';
    const speed = config.speed || 70;
    const glowBlur = config.glowBlur || 24;
    const glowColor = config.glowColor || palette.glow;
    const textMode = config.colorMode || 'solid'; // 'solid' | 'gradient' | 'rainbow' | 'glow'
    const textColor = config.textColor || palette.text;
    const strokeWidth = config.strokeWidth || 0;
    const strokeColor = config.strokeColor || '#000000';
    const shadowOffset = config.shadowOffset || 0;
    const shadowBlur = config.shadowBlur || 0;
    const shadowColor = config.shadowColor || 'rgba(0,0,0,0.5)';
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

    // Animation progress calculation
    let visibleTokenCount = totalChars;
    let animAlpha = 1;
    let animScale = 1;
    let animOffsetX = 0;
    let animOffsetY = 0;
    let animBlur = 0;
    let isTypingActive = false;
    let emojiPopScale = 1;
    let emojiBurst = 0;

    switch (animMode) {
      case 'type': {
        const charDuration = speed;
        visibleTokenCount = Math.min(totalChars, Math.max(0, Math.floor(elapsed / charDuration)));
        isTypingActive = visibleTokenCount < totalChars;
        // Emoji-aware pop when finished typing
        if (visibleTokenCount >= totalChars) {
          const finishedAt = totalChars * charDuration;
          const afterElapsed = Math.max(0, elapsed - finishedAt);
          if (afterElapsed < 800) {
            const ep = afterElapsed / 800;
            emojiPopScale = 1 + Math.sin(ep * Math.PI) * 0.45;
            emojiBurst = 1 - ep;
          }
        }
        break;
      }
      case 'fade': {
        const duration = 1200;
        animAlpha = Math.min(1, Math.max(0, elapsed / duration));
        break;
      }
      case 'pop': {
        const duration = 900;
        const p = Math.min(1, Math.max(0, elapsed / duration));
        // Elastic bounce easing
        const c4 = (2 * Math.PI) / 3;
        animScale = p === 0 ? 0 : p === 1 ? 1 : Math.pow(2, -10 * p) * Math.sin((p * 10 - 0.75) * c4) + 1;
        animAlpha = Math.min(1, p * 2);
        break;
      }
      case 'slide_up': {
        const duration = 900;
        const p = Math.min(1, Math.max(0, elapsed / duration));
        const ease = 1 - Math.pow(1 - p, 3);
        animOffsetY = (1 - ease) * 90;
        animAlpha = ease;
        break;
      }
      case 'slide_down': {
        const duration = 900;
        const p = Math.min(1, Math.max(0, elapsed / duration));
        const ease = 1 - Math.pow(1 - p, 3);
        animOffsetY = (ease - 1) * 90;
        animAlpha = ease;
        break;
      }
      case 'slide_left': {
        const duration = 900;
        const p = Math.min(1, Math.max(0, elapsed / duration));
        const ease = 1 - Math.pow(1 - p, 3);
        animOffsetX = (1 - ease) * 120;
        animAlpha = ease;
        break;
      }
      case 'slide_right': {
        const duration = 900;
        const p = Math.min(1, Math.max(0, elapsed / duration));
        const ease = 1 - Math.pow(1 - p, 3);
        animOffsetX = (ease - 1) * 120;
        animAlpha = ease;
        break;
      }
      case 'zoom_in': {
        const duration = 1000;
        const p = Math.min(1, Math.max(0, elapsed / duration));
        const ease = 1 - Math.pow(1 - p, 3);
        animScale = 0.3 + 0.7 * ease;
        animAlpha = ease;
        break;
      }
      case 'wave': {
        animAlpha = Math.min(1, elapsed / 600);
        break;
      }
      case 'cascade': {
        const duration = speed * 1.5;
        visibleTokenCount = Math.min(totalChars, Math.max(0, Math.floor(elapsed / duration)));
        break;
      }
      case 'cinematic': {
        const duration = 1400;
        const p = Math.min(1, Math.max(0, elapsed / duration));
        animAlpha = p;
        animBlur = (1 - p) * 14;
        break;
      }
      case 'handwriting': {
        const duration = speed * 0.9;
        visibleTokenCount = Math.min(totalChars, Math.max(0, Math.floor(elapsed / duration)));
        isTypingActive = visibleTokenCount < totalChars;
        break;
      }
      case 'neon': {
        const p = elapsed / 1000;
        const flicker = Math.sin(p * 18) > 0.1 ? 1 : 0.25;
        animAlpha = Math.min(1, p) * flicker;
        break;
      }
      case 'retype': {
        const cycle = (totalChars + 20) * speed;
        const local = elapsed % cycle;
        const typeTime = totalChars * speed;
        const pauseTime = 1200;
        if (local < typeTime) {
          visibleTokenCount = Math.floor(local / speed);
        } else if (local < typeTime + pauseTime) {
          visibleTokenCount = totalChars;
        } else {
          const deleteElapsed = local - (typeTime + pauseTime);
          visibleTokenCount = Math.max(2, totalChars - Math.floor(deleteElapsed / (speed * 0.6)));
        }
        isTypingActive = visibleTokenCount < totalChars;
        break;
      }
      default:
        break;
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
    ctx.scale(scale * animScale, scale * animScale);
    ctx.globalAlpha = textOpacity * animAlpha;

    if (animBlur > 0 && 'filter' in ctx) {
      ctx.filter = `blur(${animBlur}px)`;
    }

    // Configure text fill style
    let fillStyle = textColor;
    if (textMode === 'gradient') {
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

    // Render each line
    for (let lIdx = 0; lIdx < lines.length; lIdx++) {
      const line = lines[lIdx];
      const curY = startY + lIdx * lh;

      let lineX = 0;
      if (align === 'left') lineX = -maxWidth / 2;
      else if (align === 'right') lineX = maxWidth / 2;

      // Dynamic wave effect per character
      if (animMode === 'wave') {
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
      } else {
        // Standard high-quality render
        ctx.save();

        // Shadow
        if (shadowBlur > 0 || shadowOffset > 0) {
          ctx.shadowColor = shadowColor;
          ctx.shadowBlur = shadowBlur;
          ctx.shadowOffsetX = shadowOffset;
          ctx.shadowOffsetY = shadowOffset;
        }

        // Glow
        if (glowBlur > 0) {
          ctx.shadowColor = glowColor;
          ctx.shadowBlur = glowBlur;
        }

        // Stroke outline
        if (strokeWidth > 0) {
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = strokeWidth * 2;
          ctx.strokeText(line, lineX, curY);
        }

        // Fill
        ctx.fillStyle = fillStyle;
        ctx.fillText(line, lineX, curY);

        ctx.restore();
      }
    }

    // Emoji-aware pop & radial sparkle burst on trailing emoji
    if (emojiBurst > 0 && this.hasEmoji(rawText)) {
      this.renderEmojiBurst(ctx, lineX => 0, startY + (lines.length - 1) * lh, emojiBurst, palette);
    }

    // Blinking typing cursor
    if (
      (animMode === 'type' || animMode === 'handwriting' || animMode === 'retype') &&
      config.showCursor !== false &&
      (isTypingActive || Math.floor(time / 450) % 2 === 0)
    ) {
      this.renderCursor(ctx, lines, lh, startY, align, maxWidth, palette.primary, fs);
    }

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
      const waveY = y + Math.sin(time * 0.005 + (lineIdx * 5 + i) * 0.45) * (fs * 0.18);

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

  // Blinking typing cursor bar
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
    ctx.lineWidth = Math.max(2.5, fs * 0.06);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cursorX, lastY - lh * 0.32);
    ctx.lineTo(cursorX, lastY + lh * 0.32);
    ctx.stroke();
    ctx.restore();
  }

  // Emoji Pop radial burst
  renderEmojiBurst(ctx, getX, y, strength, palette) {
    ctx.save();
    const count = 8;
    const r = (1 - strength) * 45;
    ctx.strokeStyle = palette.primary;
    ctx.fillStyle = palette.accent;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = strength * 0.8;

    for (let i = 0; i < count; i++) {
      const ang = (i * Math.PI * 2) / count;
      const bx = Math.cos(ang) * r;
      const by = y + Math.sin(ang) * r;

      ctx.beginPath();
      ctx.arc(bx, by, 2 * strength, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}
