/**
 * DP Creator Studio V4 - High Performance Particle & Doodle Physics Engine
 * Multi-layer rendering, object-pooled, 60fps mobile optimized
 */

export class ParticleEngine {
  constructor() {
    this.pools = new Map();
    this.maxPoolSize = 100;
  }

  getPool(type) {
    if (!this.pools.has(type)) {
      const items = [];
      for (let i = 0; i < this.maxPoolSize; i++) {
        items.push({
          x: Math.random(),
          y: Math.random(),
          vx: (Math.random() - 0.5) * 0.001,
          vy: Math.random() * 0.002 + 0.001,
          size: Math.random() * 0.6 + 0.7,
          rot: Math.random() * Math.PI * 2,
          vrot: (Math.random() - 0.5) * 0.05,
          phase: Math.random() * Math.PI * 2,
          speedMult: Math.random() * 0.5 + 0.75,
          seed: Math.random() * 1000
        });
      }
      this.pools.set(type, items);
    }
    return this.pools.get(type);
  }

  draw(ctx, W, H, time, activeDoodles, config, palette) {
    if (!activeDoodles || activeDoodles.length === 0) return;

    for (const doodleId of activeDoodles) {
      if (doodleId === 'none') continue;
      this.renderDoodleLayer(ctx, W, H, time, doodleId, config, palette);
    }
  }

  renderDoodleLayer(ctx, W, H, time, type, config, palette) {
    const amount = Math.min(this.maxPoolSize, Math.max(1, config.amount || 12));
    const sizeScale = (config.size || 100) / 100;
    const speed = (config.speed || 100) / 100;
    const opacity = (config.opacity || 100) / 100;
    const color = config.color || palette.primary;

    const pool = this.getPool(type);
    ctx.save();

    switch (type) {
      case 'spark':
        this.renderSparks(ctx, W, H, time, pool, amount, sizeScale, speed, opacity, color);
        break;
      case 'stars':
        this.renderStars(ctx, W, H, time, pool, amount, sizeScale, speed, opacity, color);
        break;
      case 'twinkle':
        this.renderTwinkles(ctx, W, H, time, pool, amount, sizeScale, speed, opacity, color);
        break;
      case 'rain':
        this.renderRain(ctx, W, H, time, pool, amount, sizeScale, speed, opacity, color);
        break;
      case 'drizzle':
        this.renderDrizzle(ctx, W, H, time, pool, amount, sizeScale, speed, opacity, color);
        break;
      case 'petals':
        this.renderPetals(ctx, W, H, time, pool, amount, sizeScale, speed, opacity, color);
        break;
      case 'snow':
        this.renderSnow(ctx, W, H, time, pool, amount, sizeScale, speed, opacity, color);
        break;
      case 'hearts':
        this.renderHearts(ctx, W, H, time, pool, amount, sizeScale, speed, opacity, color);
        break;
      case 'butterflies':
        this.renderButterflies(ctx, W, H, time, pool, amount, sizeScale, speed, opacity, color);
        break;
      case 'clouds':
        this.renderClouds(ctx, W, H, time, pool, amount, sizeScale, speed, opacity, color);
        break;
      case 'bubbles':
        this.renderBubbles(ctx, W, H, time, pool, amount, sizeScale, speed, opacity, color);
        break;
      case 'ribbons':
        this.renderRibbons(ctx, W, H, time, pool, amount, sizeScale, speed, opacity, color);
        break;
      case 'orbit':
        this.renderOrbit(ctx, W, H, time, pool, amount, sizeScale, speed, opacity, color);
        break;
      case 'shooting_star':
        this.renderShootingStars(ctx, W, H, time, pool, amount, sizeScale, speed, opacity, color);
        break;
      case 'doodles':
        this.renderHandDoodles(ctx, W, H, time, pool, amount, sizeScale, speed, opacity, color);
        break;
      default:
        break;
    }

    ctx.restore();
  }

  // 1. Sparkles (4-point flare)
  renderSparks(ctx, W, H, time, pool, count, sizeScale, speed, opacity, color) {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1.8 * sizeScale;
    ctx.lineCap = 'round';

    for (let i = 0; i < count; i++) {
      const p = pool[i];
      const t = time * 0.0008 * speed * p.speedMult + p.phase;
      const px = W * (0.08 + 0.84 * (0.5 + 0.5 * Math.sin(t * 0.73 + p.seed)));
      const py = H * (0.08 + 0.84 * (0.5 + 0.5 * Math.cos(t * 0.91 + p.seed * 0.3)));
      const pulse = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * 0.004 * speed + p.phase));
      const s = (4 + 6 * pulse) * sizeScale * p.size;

      ctx.globalAlpha = (0.2 + 0.75 * pulse) * opacity;
      ctx.beginPath();
      // Horizontal flare
      ctx.moveTo(px - s * 2, py);
      ctx.lineTo(px + s * 2, py);
      // Vertical flare
      ctx.moveTo(px, py - s * 2);
      ctx.lineTo(px, py + s * 2);
      ctx.stroke();

      // Center bright core
      ctx.beginPath();
      ctx.arc(px, py, s * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 2. Stars (5-pointed geometric star)
  renderStars(ctx, W, H, time, pool, count, sizeScale, speed, opacity, color) {
    ctx.fillStyle = color;

    for (let i = 0; i < count; i++) {
      const p = pool[i];
      const t = time * 0.0003 * speed * p.speedMult + p.seed;
      const px = W * (0.08 + 0.84 * (0.5 + 0.5 * Math.sin(t * 0.65 + p.phase)));
      const py = H * (0.08 + 0.84 * (0.5 + 0.5 * Math.cos(t * 0.85 + p.seed * 0.4)));
      const pulse = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(time * 0.0035 * speed + p.phase));
      const r = (5 + 5 * pulse) * sizeScale * p.size;
      const rot = time * 0.0005 * speed + p.rot;

      ctx.globalAlpha = (0.3 + 0.65 * pulse) * opacity;
      ctx.beginPath();
      for (let j = 0; j < 10; j++) {
        const rad = j % 2 === 0 ? r : r * 0.42;
        const ang = rot + (j * Math.PI) / 5 - Math.PI / 2;
        const x = px + Math.cos(ang) * rad;
        const y = py + Math.sin(ang) * rad;
        j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    }
  }

  // 3. Twinkles (Diamond Shimmer)
  renderTwinkles(ctx, W, H, time, pool, count, sizeScale, speed, opacity, color) {
    ctx.fillStyle = color;
    for (let i = 0; i < count; i++) {
      const p = pool[i];
      const t = time * 0.0005 * speed * p.speedMult + p.phase;
      const px = W * (0.06 + 0.88 * (0.5 + 0.5 * Math.sin(t * 0.8 + p.seed)));
      const py = H * (0.06 + 0.88 * (0.5 + 0.5 * Math.cos(t * 0.7 + p.phase)));
      const pulse = 0.2 + 0.8 * Math.pow(0.5 + 0.5 * Math.sin(time * 0.005 * speed + p.seed), 2);
      const s = (6 + 7 * pulse) * sizeScale * p.size;

      ctx.globalAlpha = (0.25 + 0.7 * pulse) * opacity;
      ctx.beginPath();
      ctx.moveTo(px, py - s);
      ctx.lineTo(px + s * 0.55, py);
      ctx.lineTo(px, py + s);
      ctx.lineTo(px - s * 0.55, py);
      ctx.closePath();
      ctx.fill();
    }
  }

  // 4. Rain Streaks
  renderRain(ctx, W, H, time, pool, count, sizeScale, speed, opacity, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.8 * sizeScale;
    ctx.lineCap = 'round';

    for (let i = 0; i < count * 2; i++) {
      const idx = i % pool.length;
      const p = pool[idx];
      const travelSpeed = 0.00045 * speed * (1 + (i % 4) * 0.2);
      const prog = (time * travelSpeed + (p.seed * 0.13 + i * 0.07)) % 1.2;
      const px = W * (0.02 + 0.96 * ((p.seed * 3.7 + i * 0.17) % 1));
      const py = -60 + prog * (H + 120);
      const len = (14 + (i % 5) * 6) * sizeScale;

      const edgeAlpha = Math.sin(Math.min(1, Math.max(0, prog / 1.1)) * Math.PI);
      ctx.globalAlpha = (0.2 + 0.65 * edgeAlpha) * opacity;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px - 4 * sizeScale, py + len);
      ctx.stroke();
    }
  }

  // 5. Gentle Drizzle
  renderDrizzle(ctx, W, H, time, pool, count, sizeScale, speed, opacity, color) {
    ctx.fillStyle = color;
    for (let i = 0; i < count * 1.5; i++) {
      const idx = i % pool.length;
      const p = pool[idx];
      const travelSpeed = 0.00018 * speed * (1 + (i % 3) * 0.15);
      const prog = (time * travelSpeed + (p.phase * 0.2 + i * 0.09)) % 1.15;
      const px = W * (0.05 + 0.9 * ((p.seed * 5.3 + i * 0.23) % 1));
      const py = -40 + prog * (H + 80);
      const r = (2 + (i % 3)) * sizeScale;

      ctx.globalAlpha = (0.2 + 0.5 * Math.sin(prog * Math.PI)) * opacity;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 6. Sakura Petals (Realistic Flutter & 3D Tilt)
  renderPetals(ctx, W, H, time, pool, count, sizeScale, speed, opacity, color) {
    ctx.fillStyle = color;
    for (let i = 0; i < count; i++) {
      const p = pool[i];
      const fallSpeed = 0.00015 * speed * p.speedMult;
      const prog = (time * fallSpeed + p.seed * 0.1) % 1.25;
      const sway = Math.sin(time * 0.002 * speed + p.phase) * 35 * sizeScale;
      const px = W * (0.05 + 0.9 * ((p.seed * 7.1) % 1)) + sway;
      const py = -50 + prog * (H + 100);
      const tilt = Math.cos(time * 0.003 * speed + p.phase);
      const rot = p.rot + time * 0.001 * speed;
      const w = 12 * sizeScale * p.size;
      const h = 7 * sizeScale * p.size * Math.max(0.15, Math.abs(tilt));

      ctx.globalAlpha = (0.35 + 0.55 * Math.sin(Math.min(1, prog / 1.1) * Math.PI)) * opacity;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(rot);

      ctx.beginPath();
      ctx.moveTo(0, -h);
      ctx.bezierCurveTo(w, -h * 0.7, w, h * 0.7, 0, h);
      ctx.bezierCurveTo(-w, h * 0.7, -w, -h * 0.7, 0, -h);
      ctx.fill();

      ctx.restore();
    }
  }

  // 7. Snow (Drifting Fluffy Snowflakes)
  renderSnow(ctx, W, H, time, pool, count, sizeScale, speed, opacity, color) {
    ctx.fillStyle = color;
    for (let i = 0; i < count * 1.6; i++) {
      const idx = i % pool.length;
      const p = pool[idx];
      const fallSpeed = 0.00012 * speed * (0.8 + (i % 4) * 0.3);
      const prog = (time * fallSpeed + p.seed * 0.15 + i * 0.05) % 1.2;
      const sway = Math.sin(time * 0.0015 * speed + p.phase + i) * 20 * sizeScale;
      const px = W * (0.03 + 0.94 * ((p.seed * 4.9 + i * 0.13) % 1)) + sway;
      const py = -40 + prog * (H + 80);
      const r = (2.2 + (i % 4) * 1.5) * sizeScale * p.size;

      ctx.globalAlpha = (0.3 + 0.55 * Math.sin(Math.min(1, prog) * Math.PI)) * opacity;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 8. Floating Romantic Hearts
  renderHearts(ctx, W, H, time, pool, count, sizeScale, speed, opacity, color) {
    ctx.fillStyle = color;
    for (let i = 0; i < count; i++) {
      const p = pool[i];
      const riseSpeed = 0.00014 * speed * p.speedMult;
      const prog = (time * riseSpeed + p.seed * 0.1) % 1.25;
      const sway = Math.sin(time * 0.0025 * speed + p.phase) * 25 * sizeScale;
      const px = W * (0.1 + 0.8 * ((p.seed * 9.1) % 1)) + sway;
      const py = H + 40 - prog * (H + 90);
      const scale = (0.7 + 0.3 * Math.sin(time * 0.004 * speed + p.phase)) * sizeScale * p.size;
      const s = 10 * scale;

      ctx.globalAlpha = (0.3 + 0.6 * Math.sin(Math.min(1, prog / 1.1) * Math.PI)) * opacity;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(Math.sin(time * 0.0015 * speed + p.phase) * 0.2);

      ctx.beginPath();
      ctx.moveTo(0, s * 0.3);
      ctx.bezierCurveTo(-s, -s * 0.5, -s * 0.8, -s * 1.1, 0, -s * 0.4);
      ctx.bezierCurveTo(s * 0.8, -s * 1.1, s, -s * 0.5, 0, s * 0.3);
      ctx.fill();

      ctx.restore();
    }
  }

  // 9. Butterflies (Flapping Silhouette)
  renderButterflies(ctx, W, H, time, pool, count, sizeScale, speed, opacity, color) {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;

    for (let i = 0; i < count; i++) {
      const p = pool[i];
      const t = time * 0.00035 * speed * p.speedMult + p.phase;
      const px = W * (0.15 + 0.7 * (0.5 + 0.5 * Math.sin(t * 0.8 + p.seed)));
      const py = H * (0.15 + 0.7 * (0.5 + 0.5 * Math.cos(t * 1.1 + p.seed * 0.5)));
      const flap = Math.abs(Math.sin(time * 0.015 * speed + p.seed));
      const s = 12 * sizeScale * p.size;
      const rot = Math.sin(t * 0.5) * 0.4;

      ctx.globalAlpha = (0.4 + 0.55 * flap) * opacity;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(rot);

      // Left wing
      ctx.beginPath();
      ctx.ellipse(-s * 0.5 * flap, -s * 0.2, s * 0.6 * flap, s * 0.45, -0.3, 0, Math.PI * 2);
      ctx.fill();

      // Right wing
      ctx.beginPath();
      ctx.ellipse(s * 0.5 * flap, -s * 0.2, s * 0.6 * flap, s * 0.45, 0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // 10. Floating Clouds
  renderClouds(ctx, W, H, time, pool, count, sizeScale, speed, opacity, color) {
    ctx.fillStyle = color;
    for (let i = 0; i < count; i++) {
      const p = pool[i];
      const driftSpeed = 0.00004 * speed * p.speedMult;
      const prog = (time * driftSpeed + p.seed * 0.2) % 1.3;
      const px = -150 + prog * (W + 300);
      const py = H * (0.15 + 0.65 * ((p.seed * 3.3) % 1));
      const s = 45 * sizeScale * p.size;

      ctx.globalAlpha = 0.12 * opacity;
      ctx.save();
      ctx.translate(px, py);

      ctx.beginPath();
      ctx.arc(0, 0, s * 0.6, 0, Math.PI * 2);
      ctx.arc(s * 0.45, -s * 0.2, s * 0.45, 0, Math.PI * 2);
      ctx.arc(-s * 0.45, -s * 0.15, s * 0.4, 0, Math.PI * 2);
      ctx.arc(s * 0.75, s * 0.1, s * 0.35, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // 11. Translucent Rising Bubbles
  renderBubbles(ctx, W, H, time, pool, count, sizeScale, speed, opacity, color) {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1.6 * sizeScale;

    for (let i = 0; i < count; i++) {
      const p = pool[i];
      const riseSpeed = 0.00016 * speed * p.speedMult;
      const prog = (time * riseSpeed + p.seed * 0.12) % 1.2;
      const sway = Math.sin(time * 0.002 * speed + p.phase) * 18 * sizeScale;
      const px = W * (0.1 + 0.8 * ((p.seed * 6.3) % 1)) + sway;
      const py = H + 40 - prog * (H + 80);
      const r = (9 + (i % 4) * 4) * sizeScale * p.size;

      const alpha = (0.2 + 0.55 * Math.sin(Math.min(1, prog / 1.05) * Math.PI)) * opacity;
      ctx.globalAlpha = alpha;

      // Outer bubble rim
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.stroke();

      // Specular highlight
      ctx.globalAlpha = alpha * 0.8;
      ctx.beginPath();
      ctx.arc(px - r * 0.35, py - r * 0.35, r * 0.25, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 12. Ribbons / Confetti
  renderRibbons(ctx, W, H, time, pool, count, sizeScale, speed, opacity, color) {
    ctx.fillStyle = color;
    for (let i = 0; i < count; i++) {
      const p = pool[i];
      const fallSpeed = 0.00022 * speed * p.speedMult;
      const prog = (time * fallSpeed + p.seed * 0.14) % 1.25;
      const sway = Math.sin(time * 0.003 * speed + p.phase) * 30 * sizeScale;
      const px = W * (0.05 + 0.9 * ((p.seed * 8.7) % 1)) + sway;
      const py = -40 + prog * (H + 80);
      const spin = Math.sin(time * 0.005 * speed + p.phase);
      const rot = p.rot + time * 0.002 * speed;
      const w = 14 * sizeScale * p.size;
      const h = 6 * sizeScale * p.size * Math.abs(spin);

      ctx.globalAlpha = (0.35 + 0.55 * Math.sin(Math.min(1, prog / 1.1) * Math.PI)) * opacity;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(rot);
      ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.restore();
    }
  }

  // 13. Orbit Rings with Satellites
  renderOrbit(ctx, W, H, time, pool, count, sizeScale, speed, opacity, color) {
    const cx = W / 2;
    const cy = H / 2;
    const rx = 270 * sizeScale;
    const ry = 190 * sizeScale;

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1.8 * sizeScale;
    ctx.globalAlpha = 0.35 * opacity;
    ctx.setLineDash([6, 16]);

    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, time * 0.00008 * speed, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Satellites
    const satCount = Math.max(2, Math.round(count * 0.5));
    for (let i = 0; i < satCount; i++) {
      const ang = time * 0.0006 * speed + (i * Math.PI * 2) / satCount;
      const px = cx + rx * Math.cos(ang);
      const py = cy + ry * Math.sin(ang);
      const r = (5 + 2 * Math.sin(time * 0.004 * speed + i)) * sizeScale;

      ctx.globalAlpha = 0.85 * opacity;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();

      // Satellite halo
      ctx.globalAlpha = 0.3 * opacity;
      ctx.beginPath();
      ctx.arc(px, py, r * 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 14. Shooting Stars / Meteors
  renderShootingStars(ctx, W, H, time, pool, count, sizeScale, speed, opacity, color) {
    for (let i = 0; i < count; i++) {
      const cycle = 3500 / speed;
      const localTime = (time + i * 1400) % cycle;
      if (localTime > 900) continue; // Only active in burst phase

      const prog = localTime / 900;
      const startX = W * (0.2 + 0.6 * (i % 3));
      const startY = H * (0.05 + 0.25 * (i % 2));
      const len = 130 * sizeScale;
      const currentX = startX + prog * (W * 0.5);
      const currentY = startY + prog * (H * 0.5);

      const grad = ctx.createLinearGradient(
        currentX - len * 0.7,
        currentY - len * 0.7,
        currentX,
        currentY
      );
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(1, color);

      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.5 * sizeScale;
      ctx.lineCap = 'round';
      ctx.globalAlpha = (1 - prog) * 0.85 * opacity;

      ctx.beginPath();
      ctx.moveTo(currentX - len * 0.7, currentY - len * 0.7);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
    }
  }

  // 15. Hand-drawn Doodles (Squiggles, Loops & Hearts)
  renderHandDoodles(ctx, W, H, time, pool, count, sizeScale, speed, opacity, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.2 * sizeScale;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (let i = 0; i < count; i++) {
      const p = pool[i];
      const t = time * 0.00025 * speed * p.speedMult + p.phase;
      const px = W * (0.12 + 0.76 * (0.5 + 0.5 * Math.sin(t * 0.7 + p.seed)));
      const py = H * (0.12 + 0.76 * (0.5 + 0.5 * Math.cos(t * 0.85 + p.seed * 0.3)));
      const pulse = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(time * 0.003 * speed + p.phase));
      const s = 14 * sizeScale * p.size;

      ctx.globalAlpha = (0.3 + 0.6 * pulse) * opacity;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(p.rot + Math.sin(time * 0.001 * speed + p.seed) * 0.3);

      if (i % 3 === 0) {
        // Scribble loop
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.6, 0, Math.PI * 1.5);
        ctx.bezierCurveTo(s, s * 0.5, s * 0.5, -s, 0, -s * 0.3);
        ctx.stroke();
      } else if (i % 3 === 1) {
        // Star cross
        ctx.beginPath();
        ctx.moveTo(-s, 0);
        ctx.lineTo(s, 0);
        ctx.moveTo(0, -s);
        ctx.lineTo(0, s);
        ctx.moveTo(-s * 0.5, -s * 0.5);
        ctx.lineTo(s * 0.5, s * 0.5);
        ctx.stroke();
      } else {
        // Mini wave doodle
        ctx.beginPath();
        ctx.moveTo(-s, 0);
        ctx.quadraticCurveTo(-s * 0.5, -s * 0.8, 0, 0);
        ctx.quadraticCurveTo(s * 0.5, s * 0.8, s, 0);
        ctx.stroke();
      }

      ctx.restore();
    }
  }
}
