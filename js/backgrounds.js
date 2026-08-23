/**
 * DP Creator Studio V4 - 14 Immersive Visual Scene Presets
 * High-performance canvas shader & atmospheric rendering
 */

export class BackgroundRenderer {
  constructor() {
    this.noiseCache = null;
  }

  draw(ctx, W, H, time, sceneId, palette, config = {}) {
    ctx.save();
    switch (sceneId) {
      case 'aurora':
        this.renderAurora(ctx, W, H, time, palette);
        break;
      case 'moonlight':
        this.renderMoonlight(ctx, W, H, time, palette);
        break;
      case 'rain':
        this.renderRainyWindow(ctx, W, H, time, palette);
        break;
      case 'cloudy':
        this.renderCloudy(ctx, W, H, time, palette);
        break;
      case 'dreamy':
        this.renderDreamy(ctx, W, H, time, palette);
        break;
      case 'sakura':
        this.renderSakura(ctx, W, H, time, palette);
        break;
      case 'paper':
        this.renderPaper(ctx, W, H, time, palette);
        break;
      case 'glass':
        this.renderGlass(ctx, W, H, time, palette);
        break;
      case 'ocean':
        this.renderOcean(ctx, W, H, time, palette);
        break;
      case 'city':
        this.renderCity(ctx, W, H, time, palette);
        break;
      case 'nature':
        this.renderNature(ctx, W, H, time, palette);
        break;
      case 'minimal':
        this.renderMinimal(ctx, W, H, time, palette);
        break;
      case 'purple':
        this.renderPurpleGlow(ctx, W, H, time, palette);
        break;
      case 'cinematic':
        this.renderCinematic(ctx, W, H, time, palette);
        break;
      default:
        this.renderStandard(ctx, W, H, time, palette);
        break;
    }

    // Optional subtle corner brackets / frame
    if (config.showFrame !== false && sceneId !== 'cinematic' && sceneId !== 'paper') {
      this.drawCornerBrackets(ctx, W, H, palette);
    }

    ctx.restore();
  }

  drawCornerBrackets(ctx, W, H, palette) {
    const pad = 24;
    const arm = 22;
    ctx.save();
    ctx.strokeStyle = palette.primary + '30';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(pad, pad, W - pad * 2, H - pad * 2);

    ctx.strokeStyle = palette.primary + '80';
    ctx.lineWidth = 2.5;
    const corners = [
      [pad + 12, pad + 12, 1, 1],
      [W - pad - 12, pad + 12, -1, 1],
      [pad + 12, H - pad - 12, 1, -1],
      [W - pad - 12, H - pad - 12, -1, -1]
    ];

    corners.forEach(([x, y, sx, sy]) => {
      ctx.beginPath();
      ctx.moveTo(x, y + arm * sy);
      ctx.lineTo(x, y);
      ctx.lineTo(x + arm * sx, y);
      ctx.stroke();
    });
    ctx.restore();
  }

  // 1. 🌌 Aurora
  renderAurora(ctx, W, H, time, palette) {
    // Base space sky
    const g = ctx.createRadialGradient(W * 0.5, H * 0.2, 30, W * 0.5, H * 0.7, W * 0.85);
    g.addColorStop(0, '#101432');
    g.addColorStop(0.5, '#08091a');
    g.addColorStop(1, '#030408');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Aurora wave ribbons
    const colors = ['#00f5d430', '#7000ff26', '#00bbf926', '#f7258520'];
    colors.forEach((col, idx) => {
      ctx.save();
      ctx.fillStyle = col;
      ctx.beginPath();
      const waveSpeed = 0.0008 + idx * 0.0003;
      const baseH = H * (0.22 + idx * 0.12);
      ctx.moveTo(0, H);
      ctx.lineTo(0, baseH);

      for (let x = 0; x <= W; x += 15) {
        const ang1 = (x * 0.008) + (time * waveSpeed);
        const ang2 = (x * 0.003) - (time * waveSpeed * 0.6);
        const y = baseH + Math.sin(ang1) * 35 + Math.cos(ang2) * 20;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });
  }

  // 2. 🌙 Moonlight
  renderMoonlight(ctx, W, H, time, palette) {
    // Deep night gradient
    const g = ctx.createRadialGradient(W * 0.75, H * 0.22, 20, W * 0.5, H * 0.6, W * 0.8);
    g.addColorStop(0, '#1b2a4a');
    g.addColorStop(0.45, '#090e1d');
    g.addColorStop(1, '#03060a');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Glowing Moon
    const mx = W * 0.76;
    const my = H * 0.22;
    const mr = 42;

    // Moon outer atmospheric halo
    const halo = ctx.createRadialGradient(mx, my, mr * 0.5, mx, my, mr * 4.5);
    halo.addColorStop(0, '#b8dcff44');
    halo.addColorStop(0.4, '#8fbce918');
    halo.addColorStop(1, 'transparent');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(mx, my, mr * 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Moon disc
    ctx.fillStyle = '#f8fbff';
    ctx.shadowColor = '#8fbce9';
    ctx.shadowBlur = 24;
    ctx.beginPath();
    ctx.arc(mx, my, mr, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Soft moon crater texture
    ctx.fillStyle = '#dbe6f660';
    ctx.beginPath();
    ctx.arc(mx - 10, my - 8, 11, 0, Math.PI * 2);
    ctx.arc(mx + 12, my + 10, 8, 0, Math.PI * 2);
    ctx.arc(mx + 5, my - 14, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. 🌧️ Rainy Window
  renderRainyWindow(ctx, W, H, time, palette) {
    // Gloomy rainy dusk
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#151b28');
    g.addColorStop(0.6, '#0d111b');
    g.addColorStop(1, '#05070c');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Soft window droplet condensation
    ctx.save();
    for (let i = 0; i < 28; i++) {
      const seed = i * 43.19;
      const x = W * (0.05 + 0.9 * ((seed * 3.1) % 1));
      const drift = ((time * 0.00008 + seed * 0.1) % 1) * (H + 40);
      const y = drift - 20;
      const r = 2.5 + (i % 4) * 1.5;

      const dropGrad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
      dropGrad.addColorStop(0, '#ffffff55');
      dropGrad.addColorStop(0.7, '#8fbce925');
      dropGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = dropGrad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // 4. ☁️ Cloudy Dream
  renderCloudy(ctx, W, H, time, palette) {
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#241b3a');
    g.addColorStop(0.5, '#120f22');
    g.addColorStop(1, '#07050d');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Subtle cloud silhouettes
    ctx.save();
    for (let i = 0; i < 3; i++) {
      const cy = H * (0.35 + i * 0.25);
      const speed = 0.00006 + i * 0.00003;
      const cx = ((time * speed * W + i * 280) % (W + 400)) - 200;

      const cloudG = ctx.createRadialGradient(cx, cy, 30, cx, cy, 220);
      cloudG.addColorStop(0, palette.primary + '18');
      cloudG.addColorStop(0.6, palette.secondary + '0a');
      cloudG.addColorStop(1, 'transparent');

      ctx.fillStyle = cloudG;
      ctx.beginPath();
      ctx.arc(cx, cy, 180, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // 5. ✨ Dreamy Bokeh
  renderDreamy(ctx, W, H, time, palette) {
    const g = ctx.createRadialGradient(W * 0.4, H * 0.35, 10, W * 0.5, H * 0.5, W * 0.8);
    g.addColorStop(0, palette.secondary + '44');
    g.addColorStop(0.5, palette.bg);
    g.addColorStop(1, '#05040a');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Warm bokeh orbs
    ctx.save();
    for (let i = 0; i < 6; i++) {
      const ang = time * 0.00025 + i * 1.05;
      const bx = W * (0.2 + 0.6 * (0.5 + 0.5 * Math.sin(ang * 0.8)));
      const by = H * (0.2 + 0.6 * (0.5 + 0.5 * Math.cos(ang * 1.1)));
      const br = 80 + 35 * Math.sin(time * 0.001 + i);

      const bg = ctx.createRadialGradient(bx, by, 0, bx, by, br);
      bg.addColorStop(0, palette.primary + '25');
      bg.addColorStop(0.5, palette.primary + '0d');
      bg.addColorStop(1, 'transparent');

      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // 6. 🌸 Soft Sakura
  renderSakura(ctx, W, H, time, palette) {
    const g = ctx.createRadialGradient(W * 0.5, H * 0.3, 20, W * 0.5, H * 0.6, W * 0.8);
    g.addColorStop(0, '#2f1522');
    g.addColorStop(0.5, '#170912');
    g.addColorStop(1, '#0a0307');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Ambient soft pink glow
    const pg = ctx.createRadialGradient(W * 0.3, H * 0.7, 0, W * 0.3, H * 0.7, 240);
    pg.addColorStop(0, '#ffaec022');
    pg.addColorStop(1, 'transparent');
    ctx.fillStyle = pg;
    ctx.fillRect(0, 0, W, H);
  }

  // 7. 📜 Warm Paper
  renderPaper(ctx, W, H, time, palette) {
    // Warm parchment
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#1c150e');
    g.addColorStop(0.5, '#130d08');
    g.addColorStop(1, '#0c0704');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Paper inner border & subtle frame
    ctx.save();
    ctx.strokeStyle = '#e6c8a535';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(32, 32, W - 64, H - 64);
    ctx.strokeRect(38, 38, W - 76, H - 76);

    // Decorative corner flourishes
    const drawFlourish = (x, y, rot) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.strokeStyle = '#e6c8a560';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(15, 0, 20, 10, 25, 25);
      ctx.stroke();
      ctx.restore();
    };

    drawFlourish(46, 46, 0);
    drawFlourish(W - 46, 46, Math.PI / 2);
    drawFlourish(W - 46, H - 46, Math.PI);
    drawFlourish(46, H - 46, -Math.PI / 2);
    ctx.restore();
  }

  // 8. 🪩 Glassmorphism
  renderGlass(ctx, W, H, time, palette) {
    // Dark chromatic base
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#060f1e');
    g.addColorStop(0.5, '#070b14');
    g.addColorStop(1, '#0f0518');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Neon backlit spheres
    const orb1X = W * 0.3 + Math.sin(time * 0.0006) * 50;
    const orb1Y = H * 0.3 + Math.cos(time * 0.0006) * 50;
    const g1 = ctx.createRadialGradient(orb1X, orb1Y, 0, orb1X, orb1Y, 180);
    g1.addColorStop(0, '#00f5ff35');
    g1.addColorStop(1, 'transparent');
    ctx.fillStyle = g1;
    ctx.beginPath();
    ctx.arc(orb1X, orb1Y, 180, 0, Math.PI * 2);
    ctx.fill();

    const orb2X = W * 0.7 + Math.cos(time * 0.0005) * 50;
    const orb2Y = H * 0.7 + Math.sin(time * 0.0005) * 50;
    const g2 = ctx.createRadialGradient(orb2X, orb2Y, 0, orb2X, orb2Y, 200);
    g2.addColorStop(0, '#c026d330');
    g2.addColorStop(1, 'transparent');
    ctx.fillStyle = g2;
    ctx.beginPath();
    ctx.arc(orb2X, orb2Y, 200, 0, Math.PI * 2);
    ctx.fill();

    // Central Frosted Glass Card
    ctx.save();
    const pad = 40;
    ctx.fillStyle = '#ffffff08';
    ctx.strokeStyle = '#ffffff25';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(pad, pad, W - pad * 2, H - pad * 2, 28);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // 9. 🌊 Ocean Deep
  renderOcean(ctx, W, H, time, palette) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#042738');
    g.addColorStop(0.5, '#031722');
    g.addColorStop(1, '#020b10');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Dynamic caustic light ripples
    ctx.save();
    ctx.strokeStyle = '#67e8f918';
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      const waveY = H * (0.2 + i * 0.22);
      ctx.moveTo(0, waveY);
      for (let x = 0; x <= W; x += 30) {
        const y = waveY + Math.sin(x * 0.01 + time * 0.001 + i) * 16;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  // 10. 🌃 City Night
  renderCity(ctx, W, H, time, palette) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#090814');
    g.addColorStop(0.6, '#0f0c1f');
    g.addColorStop(1, '#040308');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // City street bokeh
    const bokehColors = ['#ffa50022', '#00f0ff20', '#ff00771e', '#ffd70025'];
    for (let i = 0; i < 14; i++) {
      const seed = i * 29.3;
      const x = W * (0.05 + 0.9 * ((seed * 7.7) % 1));
      const y = H * (0.45 + 0.5 * ((seed * 3.3) % 1));
      const r = 20 + (i % 5) * 14;
      const col = bokehColors[i % bokehColors.length];

      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 11. 🌿 Emerald Forest
  renderNature(ctx, W, H, time, palette) {
    const g = ctx.createRadialGradient(W * 0.5, H * 0.25, 20, W * 0.5, H * 0.6, W * 0.8);
    g.addColorStop(0, '#0a2f1c');
    g.addColorStop(0.5, '#04180d');
    g.addColorStop(1, '#020a05');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Sunbeam light rays
    ctx.save();
    const beam = ctx.createLinearGradient(0, 0, W * 0.7, H);
    beam.addColorStop(0, '#86efac18');
    beam.addColorStop(0.5, '#86efac05');
    beam.addColorStop(1, 'transparent');
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(W * 0.4, 0);
    ctx.lineTo(W, H * 0.8);
    ctx.lineTo(W * 0.6, H);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // 12. 🖤 Minimal
  renderMinimal(ctx, W, H, time, palette) {
    ctx.fillStyle = '#08090d';
    ctx.fillRect(0, 0, W, H);

    // Fine grid
    ctx.save();
    ctx.strokeStyle = '#ffffff0a';
    ctx.lineWidth = 1;
    const step = 48;
    for (let x = step; x < W; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = step; y < H; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Precise luxury border
    ctx.strokeStyle = '#ffffff18';
    ctx.strokeRect(28, 28, W - 56, H - 56);
    ctx.restore();
  }

  // 13. 💜 Purple Glow
  renderPurpleGlow(ctx, W, H, time, palette) {
    const g = ctx.createRadialGradient(W * 0.5, H * 0.35, 10, W * 0.5, H * 0.65, W * 0.8);
    g.addColorStop(0, '#2e1454');
    g.addColorStop(0.48, '#110922');
    g.addColorStop(1, '#06030c');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Intense pulsating neon perimeter glow
    const pulse = 0.5 + 0.5 * Math.sin(time * 0.003);
    ctx.save();
    ctx.strokeStyle = '#aa91ff' + Math.floor(40 + pulse * 45).toString(16).padStart(2, '0');
    ctx.lineWidth = 2.5;
    ctx.strokeRect(30, 30, W - 60, H - 60);
    ctx.restore();
  }

  // 14. 🎞️ Cinematic Flare
  renderCinematic(ctx, W, H, time, palette) {
    // Deep dark background
    ctx.fillStyle = '#06070a';
    ctx.fillRect(0, 0, W, H);

    // Anamorphic horizontal lens flare line
    const flareY = H * 0.5;
    const flareG = ctx.createLinearGradient(0, flareY, W, flareY);
    flareG.addColorStop(0, 'transparent');
    flareG.addColorStop(0.3, '#38bdf815');
    flareG.addColorStop(0.5, '#67e8f965');
    flareG.addColorStop(0.7, '#38bdf815');
    flareG.addColorStop(1, 'transparent');

    ctx.save();
    ctx.strokeStyle = flareG;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, flareY);
    ctx.lineTo(W, flareY);
    ctx.stroke();

    // Central flare halo
    const halo = ctx.createRadialGradient(W * 0.5, flareY, 0, W * 0.5, flareY, 90);
    halo.addColorStop(0, '#ffffff55');
    halo.addColorStop(0.4, '#38bdf822');
    halo.addColorStop(1, 'transparent');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(W * 0.5, flareY, 90, 0, Math.PI * 2);
    ctx.fill();

    // Letterbox bars (widescreen cinematic DP feel)
    const barH = H * 0.07;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, W, barH);
    ctx.fillRect(0, H - barH, W, barH);
    ctx.restore();
  }

  // Standard fallback
  renderStandard(ctx, W, H, time, palette) {
    const g = ctx.createRadialGradient(W * 0.5, H * 0.25, 20, W * 0.5, H * 0.65, W * 0.78);
    g.addColorStop(0, palette.secondary);
    g.addColorStop(0.48, palette.bg);
    g.addColorStop(1, '#040509');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }
}
