/**
 * DP Creator Studio V4 - High-Performance Export Studio
 * Watermark-Free GIF, MP4, WebM & PNG Exporters with Synchronized Timing & Compact GIF Mode
 */

export class Exporter {
  constructor(renderFrameCallback) {
    this.renderFrame = renderFrameCallback; // (ctx, W, H, time, elapsed, timing) => void
    this.isExporting = false;
  }

  // Trigger file download in browser
  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 2500);
  }

  // PNG Snapshot export
  async exportPNG(options, timing) {
    const size = options.resolution || 720;
    const offscreen = document.createElement('canvas');
    offscreen.width = size;
    offscreen.height = size;
    const ctx = offscreen.getContext('2d');

    const now = performance.now();
    this.renderFrame(ctx, size, size, now, options.elapsed || 1500, timing);

    return new Promise(resolve => {
      offscreen.toBlob(blob => {
        const filename = `dp-motion-${Date.now()}.png`;
        this.downloadBlob(blob, filename);
        resolve({ success: true, filename });
      }, 'image/png');
    });
  }

  // MP4 / WebM Video Export via MediaRecorder
  async exportVideo(options, timing, onProgress) {
    if (this.isExporting) return;
    this.isExporting = true;

    try {
      const size = options.resolution || 720;
      const fps = options.fps || 30;
      const durationMs = timing ? timing.totalMs : (options.durationMs || 4000);
      const totalFrames = Math.ceil((durationMs / 1000) * fps);

      const offscreen = document.createElement('canvas');
      offscreen.width = size;
      offscreen.height = size;
      const ctx = offscreen.getContext('2d');

      const stream = offscreen.captureStream(fps);

      // Determine supported mime type
      const mimeTypes = [
        'video/mp4;codecs=h264',
        'video/mp4',
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm'
      ];
      let selectedMime = '';
      for (const m of mimeTypes) {
        if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(m)) {
          selectedMime = m;
          break;
        }
      }

      if (!selectedMime) {
        throw new Error('Video recording is not supported in this browser.');
      }

      const recorder = new MediaRecorder(stream, {
        mimeType: selectedMime,
        videoBitsPerSecond: options.quality === 'high' ? 8000000 : 4000000
      });

      const chunks = [];
      recorder.ondataavailable = e => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      const recordPromise = new Promise(resolve => {
        recorder.onstop = () => {
          const ext = selectedMime.includes('mp4') ? 'mp4' : 'webm';
          const blob = new Blob(chunks, { type: selectedMime });
          const filename = `dp-motion-${Date.now()}.${ext}`;
          this.downloadBlob(blob, filename);
          resolve({ success: true, filename });
        };
      });

      recorder.start();

      const startTime = performance.now();
      const frameInterval = 1000 / fps;

      for (let f = 0; f < totalFrames; f++) {
        const simTime = startTime + f * frameInterval;
        const simElapsed = f * frameInterval;
        this.renderFrame(ctx, size, size, simTime, simElapsed, timing);

        if (onProgress) {
          onProgress(Math.round((f / totalFrames) * 95));
        }
        await new Promise(r => setTimeout(r, Math.max(8, frameInterval * 0.9)));
      }

      recorder.stop();
      const result = await recordPromise;
      if (onProgress) onProgress(100);
      return result;
    } finally {
      this.isExporting = false;
    }
  }

  // GIF Export with embedded fast palette quantization, LZW encoding & Compact mode
  async exportGIF(options, timing, onProgress) {
    if (this.isExporting) return;
    this.isExporting = true;

    try {
      const isCompact = options.compact === true;
      const size = isCompact ? 380 : Math.min(512, options.resolution || 360);
      const fps = isCompact ? 14 : Math.min(24, options.fps || 16);
      const durationMs = timing ? timing.totalMs : (options.durationMs || 3500);
      const totalFrames = Math.ceil((durationMs / 1000) * fps);

      const offscreen = document.createElement('canvas');
      offscreen.width = size;
      offscreen.height = size;
      const ctx = offscreen.getContext('2d', { willReadFrequently: true });

      const frames = [];
      const startTime = performance.now();
      const frameInterval = 1000 / fps;

      // 1. Capture all frames
      for (let f = 0; f < totalFrames; f++) {
        const simTime = startTime + f * frameInterval;
        const simElapsed = f * frameInterval;
        this.renderFrame(ctx, size, size, simTime, simElapsed, timing);

        const imgData = ctx.getImageData(0, 0, size, size);
        frames.push(imgData.data);

        if (onProgress) {
          onProgress(Math.round((f / totalFrames) * 50));
        }
        if (f % 4 === 0) {
          await new Promise(r => setTimeout(r, 0));
        }
      }

      // 2. Encode GIF bytes
      const delayCentisecs = Math.round(100 / fps);
      const maxColors = isCompact ? 128 : 256;
      const gifBlob = await this.encodeGIF(frames, size, size, delayCentisecs, maxColors, prog => {
        if (onProgress) {
          onProgress(50 + Math.round(prog * 50));
        }
      });

      const filename = `dp-motion-${isCompact ? 'compact-' : ''}${Date.now()}.gif`;
      this.downloadBlob(gifBlob, filename);
      if (onProgress) onProgress(100);
      return { success: true, filename };
    } finally {
      this.isExporting = false;
    }
  }

  // Client-side lightweight high-quality GIF89a builder
  async encodeGIF(frames, w, h, delayCs, maxColors = 256, onProg) {
    const palette = this.buildPalette(frames[0], maxColors);
    const colorMap = new Map();
    for (let i = 0; i < palette.length; i++) {
      const key = `${palette[i][0]},${palette[i][1]},${palette[i][2]}`;
      colorMap.set(key, i);
    }

    const out = [];
    const push = (...a) => out.push(...a);
    const str = s => [...s].map(ch => ch.charCodeAt(0));

    // Header
    push(...str('GIF89a'), w & 255, w >> 8, h & 255, h >> 8, 0xf7, 0, 0);

    // Global Color Table (256 RGB triplets)
    for (let i = 0; i < 256; i++) {
      if (i < palette.length) {
        push(palette[i][0], palette[i][1], palette[i][2]);
      } else {
        push(0, 0, 0);
      }
    }

    // Netscape Application Extension (for infinite loop)
    push(0x21, 0xff, 11, ...str('NETSCAPE2.0'), 3, 1, 0, 0, 0);

    const total = frames.length;
    for (let fIdx = 0; fIdx < total; fIdx++) {
      const rgba = frames[fIdx];

      // Graphic Control Extension
      push(0x21, 0xf9, 4, 0, delayCs & 255, (delayCs >> 8) & 255, 0, 0);

      // Image Descriptor
      push(0x2c, 0, 0, 0, 0, w & 255, w >> 8, h & 255, h >> 8, 0);

      // Color indexing (quantization)
      const indexed = new Uint8Array(w * h);
      for (let i = 0, p = 0; p < rgba.length; p += 4, i++) {
        const r = rgba[p] & 0xf8;
        const g = rgba[p + 1] & 0xf8;
        const b = rgba[p + 2] & 0xf8;
        const key = `${r},${g},${b}`;
        let colIdx = colorMap.get(key);
        if (colIdx === undefined) {
          colIdx = this.findClosestColor(r, g, b, palette);
          colorMap.set(key, colIdx);
        }
        indexed[i] = colIdx;
      }

      // LZW compression
      const lzwData = this.lzwCompress(indexed, 8);
      push(8);
      for (let i = 0; i < lzwData.length; i += 255) {
        const chunkLen = Math.min(255, lzwData.length - i);
        push(chunkLen, ...lzwData.slice(i, i + chunkLen));
      }
      push(0);

      if (onProg && fIdx % 3 === 0) {
        onProg(fIdx / total);
        await new Promise(r => setTimeout(r, 0));
      }
    }

    push(0x3b); // GIF trailer
    return new Blob([new Uint8Array(out)], { type: 'image/gif' });
  }

  buildPalette(firstFrameRGBA, maxColors = 256) {
    const palette = [];
    const seen = new Set();

    for (let i = 0; i < firstFrameRGBA.length; i += 16) {
      const r = firstFrameRGBA[i] & 0xf8;
      const g = firstFrameRGBA[i + 1] & 0xf8;
      const b = firstFrameRGBA[i + 2] & 0xf8;
      const key = (r << 16) | (g << 8) | b;
      if (!seen.has(key)) {
        seen.add(key);
        palette.push([r, g, b]);
        if (palette.length >= maxColors) break;
      }
    }

    while (palette.length < 256) {
      const idx = palette.length;
      palette.push([
        (idx * 37) % 256,
        (idx * 73) % 256,
        (idx * 127) % 256
      ]);
    }
    return palette;
  }

  findClosestColor(r, g, b, palette) {
    let minDist = Infinity;
    let best = 0;
    for (let i = 0; i < palette.length; i++) {
      const pr = palette[i][0];
      const pg = palette[i][1];
      const pb = palette[i][2];
      const dist = (r - pr) * (r - pr) + (g - pg) * (g - pg) + (b - pb) * (b - pb);
      if (dist < minDist) {
        minDist = dist;
        best = i;
        if (dist === 0) break;
      }
    }
    return best;
  }

  lzwCompress(indexed, minCodeSize) {
    const clearCode = 1 << minCodeSize;
    const eoiCode = clearCode + 1;
    let codeSize = minCodeSize + 1;
    let dict = new Map();

    const resetDict = () => {
      dict.clear();
      for (let i = 0; i < clearCode; i++) {
        dict.set(String.fromCharCode(i), i);
      }
      dict.set('CLEAR', clearCode);
      dict.set('EOI', eoiCode);
      codeSize = minCodeSize + 1;
    };

    resetDict();

    const outBytes = [];
    let bitAcc = 0;
    let bitCount = 0;

    const writeCode = code => {
      bitAcc |= code << bitCount;
      bitCount += codeSize;
      while (bitCount >= 8) {
        outBytes.push(bitAcc & 0xff);
        bitAcc >>= 8;
        bitCount -= 8;
      }
    };

    writeCode(clearCode);

    let prefix = '';
    for (let i = 0; i < indexed.length; i++) {
      const k = String.fromCharCode(indexed[i]);
      const combo = prefix + k;
      if (dict.has(combo)) {
        prefix = combo;
      } else {
        writeCode(dict.get(prefix));
        if (dict.size < 4096) {
          dict.set(combo, dict.size);
          if (dict.size === (1 << codeSize) + 1 && codeSize < 12) {
            codeSize++;
          }
        } else {
          writeCode(clearCode);
          resetDict();
        }
        prefix = k;
      }
    }

    if (prefix !== '') {
      writeCode(dict.get(prefix));
    }
    writeCode(eoiCode);

    if (bitCount > 0) {
      outBytes.push(bitAcc & 0xff);
    }

    return outBytes;
  }
}
