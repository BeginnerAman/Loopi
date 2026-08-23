/**
 * DP Creator Studio V4 - Timeline & Motion Sequencer
 * Animation clock, loop cycle timing, hold phase, interactive scrubbing
 */

export class TimelineSequencer {
  constructor() {
    this.startTime = performance.now();
    this.isPaused = false;
    this.scrubTime = null;
    this.listeners = [];
  }

  reset() {
    this.startTime = performance.now();
    this.scrubTime = null;
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
    this.scrubTime = progress01 * totalDurationMs;
  }

  computeDuration(textLength, speed, animMode, holdSeconds = 2.5) {
    let animInDuration = 1200;
    if (animMode === 'type' || animMode === 'handwriting' || animMode === 'cascade') {
      animInDuration = Math.max(800, textLength * speed + 500);
    } else if (animMode === 'retype') {
      animInDuration = (textLength + 20) * speed + 1200;
    } else if (animMode === 'cinematic') {
      animInDuration = 1600;
    } else {
      animInDuration = 1100;
    }

    const holdMs = holdSeconds * 1000;
    const totalMs = animInDuration + holdMs;
    return {
      animInDuration,
      holdMs,
      totalMs: Math.max(3000, Math.min(12000, totalMs))
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
}
