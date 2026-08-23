# DP Motion Studio

A mobile-optimized, high-performance 1:1 animated profile display picture (DP) creator built with HTML5 Canvas, modern CSS, and modular vanilla JavaScript.

## Features

- 14 Visual Scenes: Pre-configured atmospheric canvas environments including Aurora, Moonlight, Rainy Window, Cloudy Dream, Dreamy Bokeh, Soft Sakura, Warm Paper, Glassmorphism, Ocean Deep, City Lights, Emerald Forest, Dark Minimal, Lavender Dream, and Cinematic Flare.
- Multi-Layer Particle Engine: Object-pooled 60 FPS physics renderer supporting simultaneous particle layers such as Sparkles, Stars, Twinkles, Rain streaks, Drizzle, Sakura petals, Snowflakes, Floating hearts, Butterflies, Clouds, Bubbles, Ribbons, Orbit rings, Shooting stars, and Hand doodles.
- Deep Typography Controls: Text styling with Solid, Linear Gradient, Dynamic Rainbow Shift, and Luminous Glow options. Includes Font Family selection, Weight, Italic toggle, Letter Spacing, Line Height, Text Opacity, Stroke Outline with custom width and color, Drop Shadow, and Glow Blur.
- Layout and Transformations: Real-time controls for Horizontal X position, Vertical Y position, Rotation (-30 deg to +30 deg), Scale (50% to 150%), and Max Width wrapping.
- 14 Animation Styles: Typewriter with blinking cursor, Soft Fade, Pop Bounce, Slide Up, Slide Down, Slide Left, Slide Right, Zoom In, Wave Motion, Letter Cascade, Cinematic Reveal, Handwriting Draw, Neon Flicker, and Type and Retype.
- Emoji-Aware Motion: Animated sequence where primary text reveals first, followed by an energetic pop scale and radial flare burst on trailing emojis.
- Telegram and WhatsApp DP Safe Zone Preview: Real-time circular crop mask overlay to verify profile picture framing before export.
- Interactive Timeline: Scrubbable progress bar for reviewing frame-by-frame animation at specific timestamps.
- Zero Watermark Exporters: Client-side local rendering for GIF (adaptive color quantization), MP4 and WebM video streams, and PNG snapshots at 360p, 512p (Telegram DP standard), 720p, and 1080p resolutions.
- Surprise Me and Auto Style Generators: One-click algorithms for harmonious random styling and text-sentiment matching.

## Project Structure

```
Loopi/
├── index.html          # Semantic entry point and UI layout
├── README.md           # Documentation
├── css/
│   └── style.css       # Mobile-first glassmorphism design system
└── js/
    ├── app.js          # Master application state controller and UI event wiring
    ├── backgrounds.js  # 14 Canvas shader background scene renderers
    ├── constants.js    # Scene configurations, palettes, doodle physics, and fonts
    ├── exporter.js     # Watermark-free GIF, MP4, WebM, and PNG export pipelines
    ├── particles.js    # Object-pooled multi-layer 60 FPS particle physics engine
    ├── textRenderer.js # Typography rendering, multi-line wrap, and emoji dynamics
    └── timeline.js     # Animation loop clock and interactive timeline sequencer
```

## Getting Started

### Local Development

No build tools or package installations required. Run with any local HTTP server:

```bash
# Using Python 3
python -m http.server 8080

# Or using Node.js
npx serve .
```

Open `http://localhost:8080` in your desktop or mobile browser.

### GitHub Pages Deployment

1. Initialize Git and commit the files:
   ```bash
   git init
   git add .
   git commit -m "feat: initial release of DP Motion Studio"
   ```

2. Link to your GitHub repository and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/BeginnerAman/Loopi.git
   git push -u origin main
   ```

3. In your GitHub repository settings, navigate to Pages:
   - Source: Deploy from a branch
   - Branch: `main` / `root`
   - Click Save

The application will be live at `https://BeginnerAman.github.io/Loopi/`.

## Browser Support

- Chrome, Edge, Brave, Opera (Desktop and Mobile)
- Safari (iOS 14+ and macOS)
- Firefox (Desktop and Mobile)

## License

MIT License. Free for personal and commercial use without watermarks.
