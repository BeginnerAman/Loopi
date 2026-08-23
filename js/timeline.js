/**
 * DP Creator Studio V4 - Timeline & Motion Sequencer
 * 3-Phase Lifecycle Timing: Intro -> Hold -> Outro -> Seamless Loop
 */

export class TimelineSequencer {
  constructor() {
    this.startTime = performance.now();
    this.isPaused = false;
    this.pauseTimestamp = 0;
    this.scrubTime = null;
  }

  reset() {
    this.startTime = performance.now();
    this.scrubTime = null;
    this.isPaused = false;
  }

  pause() {
    if (!this.isPaused) {
      this.pauseTimestamp = performance.now();
      this.isPaused = true;
    }
  }

  resume() {
    if (this.isPaused) {
      this.startTime += performance.now() - this.pauseTimestamp;
      this.isPaused = false;
      this.scrubTime = null;
    }
  }

  togglePlay() {
    if (this.isPaused) this.resume();
    else this.pause();
  }

  setScrub(progress01, totalDurationMs) {
    this.isPaused = true;
    this.pauseTimestamp = performance.now();
    this.scrubTime = progress01 * totalDurationMs;
  }

  computeDuration(textLength, speed, animMode, holdSeconds = 2.5, loop = true) {
    let inMs = 1000;
    if (animMode === 'type' || animMode === 'handwriting' || animMode === 'cascade') {
      inMs = Math.max(700, textLength * speed + 300);
    } else if (animMode === 'retype') {
      inMs = (textLength + 16) * speed + 900;
    } else if (animMode === 'cinematic') {
      inMs = 1300;
    } else if (animMode === 'fade') {
      inMs = 900;
    } else if (animMode === 'pop') {
      inMs = 850;
    } else {
      inMs = 900;
    }

    const holdMs = Math.max(1600, (holdSeconds || 2.5) * 1000);
    const outMs = loop ? 650 : 0; // Smooth 650ms outro dissolve/exit when loop is enabled
    const totalMs = inMs + holdMs + outMs;

    return {
      inMs,
      holdMs,
      outMs,
      totalMs: Math.max(2800, totalMs)
    };
  }

  getElapsed(now, totalDurationMs, shouldLoop = true) {
    if (this.scrubTime !== null) {
      return this.scrubTime;
    }
    if (this.isPaused) {
      return Math.max(0, this.pauseTimestamp - this.startTime);
    }

    const raw = Math.max(0, now - this.startTime);
    if (!shouldLoop) {
      return Math.min(totalDurationMs, raw);
    }
    return raw % totalDurationMs;
  }

  getLifecycle(elapsed, timing, shouldLoop = true) {
    const { inMs, holdMs, outMs } = timing;

    if (elapsed < inMs) {
      const p = Math.max(0, Math.min(1, elapsed / inMs));
      return {
        phase: 'in',
        progress: p,
        alpha: Math.min(1, p * 1.5),
        scale: 1,
        isHold: false,
        isOut: false
      };
    } else if (elapsed < inMs + holdMs) {
      const p = Math.max(0, Math.min(1, (elapsed - inMs) / holdMs));
      return {
        phase: 'hold',
        progress: p,
        holdElapsed: elapsed - inMs,
        alpha: 1,
        scale: 1,
        isHold: true,
        isOut: false
      };
    } else {
      const outDuration = outMs || 650;
      const p = Math.max(0, Math.min(1, (elapsed - inMs - holdMs) / outDuration));
      const ease = p * p;
      return {
        phase: 'out',
        progress: p,
        alpha: Math.max(0, 1 - ease),
        scale: 1 - ease * 0.08,
        isHold: false,
        isOut: true
      };
    }
  }
}
