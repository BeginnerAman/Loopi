/**
 * DP Creator Studio V4 - Constants & Presets
 * Clean UI Lucide icon mappings, Quick Emojis, and Universal Presets
 */

export const DEFAULT_TEXT = 'Hello Ji...😊';

export const QUICK_EMOJIS = [
  '✨', '😊', '🌸', '🌙', '💖', '☀️', '👀', '☕', '🦋', '🕊️', '❄️', '🔥', '💫', '🌹', '🤍', '🎉', '⚡', '🖤'
];

export const MESSAGE_PRESETS = [
  {
    category: 'Cute & Friendly',
    items: [
      'Hello Ji...😊',
      'Smile please 😊',
      'Arey... 👋',
      'Kaise hain aap? 🌿',
      'Aur batao ... ☕'
    ]
  },
  {
    category: 'Aesthetic Quotes',
    items: [
      'Silence is luxury 🖤',
      'Dream big, shine brighter ✨',
      'Creating my own sunshine ☀️',
      'Peace over drama 🕊️',
      'Healing & Glowing 🌿',
      'Radiate positive vibes 💫'
    ]
  },
  {
    category: 'Mood & Vibes',
    items: [
      'Current mood: Vibing 💫',
      'Soft heart, strong mind 🌸',
      'Chasing sunsets & dreams 🌅',
      'Secretly cool 😎',
      'Not available right now ☕',
      'Caught you looking! 😉'
    ]
  },
  {
    category: 'Sweet & Romantic',
    items: [
      'You make me smile 💖',
      'Forever & Always ✨',
      'Sweet dreams 🌙',
      'My favorite notification 💌',
      'Always shining ✨',
      'Have a magical day 🌸'
    ]
  },
  {
    category: 'Morning & Night',
    items: [
      'Good Morning ☀️',
      'Subah Bakhair 🌅',
      'Good Night 🌙',
      'Have a blessed day 🌿'
    ]
  }
];

export const FRAME_STYLES = [
  { id: 'corners', name: 'Modern Corners', icon: 'corner-up-left' },
  { id: 'box', name: 'Classic Rectangle', icon: 'square' },
  { id: 'double', name: 'Double Border', icon: 'copy' },
  { id: 'neon', name: 'Neon Glow Border', icon: 'zap' },
  { id: 'vintage', name: 'Vintage Stationery', icon: 'feather' },
  { id: 'dotted', name: 'Dotted Tech', icon: 'grid' },
  { id: 'gradient', name: 'Gradient Aura', icon: 'palette' },
  { id: 'none', name: 'None (No Frame)', icon: 'ban' }
];

export const SCENES = [
  {
    id: 'aurora',
    name: 'Aurora',
    icon: 'sparkles',
    desc: 'Shimmering Northern Lights waves & deep stellar atmosphere',
    paletteIndex: 0,
    font: 'Outfit',
    anim: 'wave',
    frameStyle: 'corners',
    doodles: ['spark', 'stars'],
    bgType: 'aurora'
  },
  {
    id: 'nebula',
    name: 'Cosmic Nebula',
    icon: 'sparkles',
    desc: 'Deep galactic nebula clouds with stellar violet & cyan dust',
    paletteIndex: 0,
    font: 'Outfit',
    anim: 'shimmer',
    frameStyle: 'neon',
    doodles: ['stars', 'orbit'],
    bgType: 'nebula'
  },
  {
    id: 'golden',
    name: 'Royal Gold Velvet',
    icon: 'sparkle',
    desc: 'Deep obsidian luxury with floating liquid gold embers',
    paletteIndex: 10,
    font: 'Cinzel',
    anim: 'flip_3d',
    frameStyle: 'double',
    doodles: ['twinkle', 'spark'],
    bgType: 'golden'
  },
  {
    id: 'moonlight',
    name: 'Moonlight',
    icon: 'moon',
    desc: 'Luminous moon, subtle clouds & peaceful night glow',
    paletteIndex: 1,
    font: 'Playfair Display',
    anim: 'cinematic',
    frameStyle: 'double',
    doodles: ['stars', 'shooting_star'],
    bgType: 'moonlight'
  },
  {
    id: 'rain',
    name: 'Rainy Window',
    icon: 'cloud-rain',
    desc: 'Sliding rain streaks, glass condensation & soft blue mood',
    paletteIndex: 2,
    font: 'Inter',
    anim: 'type',
    frameStyle: 'corners',
    doodles: ['rain', 'drizzle'],
    bgType: 'rain'
  },
  {
    id: 'cloudy',
    name: 'Cloudy Dream',
    icon: 'cloud',
    desc: 'Floating fluffy clouds & tranquil pastel twilight',
    paletteIndex: 4,
    font: 'Caveat',
    anim: 'fade',
    frameStyle: 'corners',
    doodles: ['clouds', 'twinkle'],
    bgType: 'cloudy'
  },
  {
    id: 'dreamy',
    name: 'Dreamy Bokeh',
    icon: 'sun',
    desc: 'Soft glowing bokeh orbs & warm fairy light atmosphere',
    paletteIndex: 0,
    font: 'Dancing Script',
    anim: 'pop',
    frameStyle: 'gradient',
    doodles: ['twinkle', 'spark'],
    bgType: 'dreamy'
  },
  {
    id: 'sakura',
    name: 'Soft Sakura',
    icon: 'flower-2',
    desc: 'Falling cherry blossom petals & warm pastel ambiance',
    paletteIndex: 3,
    font: 'Playfair Display',
    anim: 'fade',
    frameStyle: 'vintage',
    doodles: ['petals', 'spark'],
    bgType: 'sakura'
  },
  {
    id: 'paper',
    name: 'Warm Paper',
    icon: 'scroll',
    desc: 'Vintage luxury stationery, ink texture & golden frame',
    paletteIndex: 5,
    font: 'Caveat',
    anim: 'handwriting',
    frameStyle: 'vintage',
    doodles: ['doodles'],
    bgType: 'paper'
  },
  {
    id: 'glass',
    name: 'Glassmorphism',
    icon: 'layers',
    desc: 'Frosted refractive glass panel with vivid vibrant backlight',
    paletteIndex: 8,
    font: 'Outfit',
    anim: 'slide_up',
    frameStyle: 'box',
    doodles: ['bubbles', 'spark'],
    bgType: 'glass'
  },
  {
    id: 'ocean',
    name: 'Ocean Deep',
    icon: 'waves',
    desc: 'Underwater caustics, soft ripples & bioluminescent glow',
    paletteIndex: 4,
    font: 'Montserrat',
    anim: 'wave',
    frameStyle: 'corners',
    doodles: ['bubbles', 'twinkle'],
    bgType: 'ocean'
  },
  {
    id: 'city',
    name: 'City Lights',
    icon: 'building-2',
    desc: 'Nocturnal metropolis bokeh with vibrant neon street glow',
    paletteIndex: 9,
    font: 'Inter',
    anim: 'neon',
    frameStyle: 'neon',
    doodles: ['spark', 'orbit'],
    bgType: 'city'
  },
  {
    id: 'nature',
    name: 'Emerald Forest',
    icon: 'trees',
    desc: 'Fresh foliage highlights, floating leaves & organic calmness',
    paletteIndex: 6,
    font: 'Playfair Display',
    anim: 'slide_up',
    frameStyle: 'double',
    doodles: ['butterflies', 'twinkle'],
    bgType: 'nature'
  },
  {
    id: 'minimal',
    name: 'Dark Minimal',
    icon: 'box',
    desc: 'Monochrome luxury, subtle geometric grid & razor sharp lines',
    paletteIndex: 8,
    font: 'Inter',
    anim: 'type',
    frameStyle: 'box',
    doodles: ['stars'],
    bgType: 'minimal'
  },
  {
    id: 'purple',
    name: 'Lavender Dream',
    icon: 'zap',
    desc: 'Velvet purple atmosphere with ethereal fairy dust',
    paletteIndex: 0,
    font: 'Outfit',
    anim: 'pop',
    frameStyle: 'neon',
    doodles: ['spark', 'twinkle'],
    bgType: 'purple'
  },
  {
    id: 'cinematic',
    name: 'Cinematic Flare',
    icon: 'film',
    desc: 'Anamorphic flare, film grain and widescreen aesthetic',
    paletteIndex: 10,
    font: 'Cinzel',
    anim: 'cinematic',
    frameStyle: 'none',
    doodles: ['shooting_star', 'spark'],
    bgType: 'cinematic'
  }
];

export const PALETTES = [
  {
    id: 'lavender',
    name: 'Lavender Dream',
    primary: '#aa91ff',
    secondary: '#5f4bb5',
    bg: '#0c0a18',
    text: '#faf8ff',
    glow: '#aa91ff',
    accent: '#d8cbff'
  },
  {
    id: 'midnight',
    name: 'Midnight Blue',
    primary: '#8fbce9',
    secondary: '#3d6185',
    bg: '#070d17',
    text: '#f2f7ff',
    glow: '#8fbce9',
    accent: '#c0dcf7'
  },
  {
    id: 'rosedust',
    name: 'Rose Dust',
    primary: '#ff9db0',
    secondary: '#a7495f',
    bg: '#170910',
    text: '#fff5f8',
    glow: '#ff9db0',
    accent: '#ffd1dc'
  },
  {
    id: 'sakura_pal',
    name: 'Sakura Blush',
    primary: '#ffaec0',
    secondary: '#cf6888',
    bg: '#180b12',
    text: '#fff3f6',
    glow: '#ffaec0',
    accent: '#ffe2e8'
  },
  {
    id: 'ocean_pal',
    name: 'Ocean Breeze',
    primary: '#67e8f9',
    secondary: '#0e7490',
    bg: '#041217',
    text: '#ecfeff',
    glow: '#67e8f9',
    accent: '#a5f3fc'
  },
  {
    id: 'coffee',
    name: 'Warm Coffee',
    primary: '#e6c8a5',
    secondary: '#8a623e',
    bg: '#160e08',
    text: '#fff8f0',
    glow: '#e6c8a5',
    accent: '#faebd7'
  },
  {
    id: 'mint',
    name: 'Fresh Mint',
    primary: '#86efac',
    secondary: '#16a34a',
    bg: '#06160d',
    text: '#f0fdf4',
    glow: '#86efac',
    accent: '#bbf7d0'
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    primary: '#fb923c',
    secondary: '#c2410c',
    bg: '#1a0904',
    text: '#fff7ed',
    glow: '#fb923c',
    accent: '#fed7aa'
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    primary: '#e2e8f0',
    secondary: '#64748b',
    bg: '#090b10',
    text: '#ffffff',
    glow: '#e2e8f0',
    accent: '#f8fafc'
  },
  {
    id: 'cyber',
    name: 'Cyber Neon',
    primary: '#00f5ff',
    secondary: '#c026d3',
    bg: '#050410',
    text: '#ffffff',
    glow: '#00f5ff',
    accent: '#f43f5e'
  },
  {
    id: 'golden',
    name: 'Golden Hour',
    primary: '#fcd34d',
    secondary: '#b45309',
    bg: '#171104',
    text: '#fffbeb',
    glow: '#fcd34d',
    accent: '#fef3c7'
  },
  {
    id: 'emerald',
    name: 'Emerald Mist',
    primary: '#6ee7b7',
    secondary: '#047857',
    bg: '#03140d',
    text: '#ecfdf5',
    glow: '#6ee7b7',
    accent: '#a7f3d0'
  }
];

export const DOODLE_LIBRARY = [
  { id: 'spark', name: 'Sparkles', icon: 'sparkle', defaultAmount: 14 },
  { id: 'stars', name: 'Stars', icon: 'star', defaultAmount: 10 },
  { id: 'twinkle', name: 'Twinkles', icon: 'sparkles', defaultAmount: 12 },
  { id: 'circles', name: 'Celestial Circles', icon: 'circle-dot', defaultAmount: 4 },
  { id: 'orbit', name: 'Planetary Orbit 3D', icon: 'orbit', defaultAmount: 6 },
  { id: 'rain', name: 'Rain Streaks', icon: 'cloud-rain', defaultAmount: 24 },
  { id: 'drizzle', name: 'Gentle Drizzle', icon: 'droplets', defaultAmount: 16 },
  { id: 'petals', name: 'Sakura Petals', icon: 'flower-2', defaultAmount: 12 },
  { id: 'snow', name: 'Snow Flakes', icon: 'snowflake', defaultAmount: 18 },
  { id: 'hearts', name: 'Floating Hearts', icon: 'heart', defaultAmount: 8 },
  { id: 'butterflies', name: 'Butterflies', icon: 'wind', defaultAmount: 5 },
  { id: 'clouds', name: 'Floating Clouds', icon: 'cloud', defaultAmount: 4 },
  { id: 'bubbles', name: 'Bubbles', icon: 'circle-dot', defaultAmount: 10 },
  { id: 'ribbons', name: 'Ribbons / Confetti', icon: 'party-popper', defaultAmount: 14 },
  { id: 'shooting_star', name: 'Shooting Stars', icon: 'flame', defaultAmount: 3 },
  { id: 'doodles', name: 'Hand Doodles', icon: 'pen-tool', defaultAmount: 8 }
];

export const ANIMATIONS = [
  { id: 'type', name: 'Typewriter', icon: 'keyboard', desc: 'Natural char-by-char with glowing cursor & emoji hop' },
  { id: 'fade', name: 'Soft Fade', icon: 'sun', desc: 'Silky smooth opacity reveal' },
  { id: 'pop', name: 'Pop Bounce', icon: 'maximize-2', desc: 'Elastic spring physics bounce' },
  { id: 'elastic_blob', name: 'Elastic Jelly', icon: 'sparkles', desc: 'Organic jelly tension stretch & settle' },
  { id: 'glitch', name: 'Cyber Glitch', icon: 'zap', desc: 'Holographic chromatic aberration laser snap' },
  { id: 'shimmer', name: 'Shimmer Sweep', icon: 'sparkle', desc: 'Radiant metallic light beam sweep' },
  { id: 'flip_3d', name: '3D Flip', icon: 'layers', desc: 'Luxury kinetic 3D perspective unfold' },
  { id: 'slide_up', name: 'Slide Up', icon: 'arrow-up', desc: 'Smooth upward glide with overshoot settling' },
  { id: 'slide_down', name: 'Slide Down', icon: 'arrow-down', desc: 'Gentle downward drop with overshoot settling' },
  { id: 'slide_left', name: 'Slide Left', icon: 'arrow-left', desc: 'Lateral entrance from right' },
  { id: 'slide_right', name: 'Slide Right', icon: 'arrow-right', desc: 'Lateral entrance from left' },
  { id: 'zoom_in', name: 'Zoom In', icon: 'zoom-in', desc: 'Dramatic depth lens scale-up & breathing' },
  { id: 'wave', name: 'Wave Motion', icon: 'activity', desc: 'Dynamic sine wave bouncing letters' },
  { id: 'cascade', name: 'Letter Cascade', icon: 'list-ordered', desc: 'Cascading staggered character drops with spring bounce' },
  { id: 'cinematic', name: 'Cinematic Reveal', icon: 'film', desc: 'Optical focus pull & letter tracking expansion' },
  { id: 'handwriting', name: 'Handwriting', icon: 'pen-tool', desc: 'Stroke by stroke flow with glowing pen tip spark' },
  { id: 'neon', name: 'Neon Flicker', icon: 'zap', desc: 'Electric pulsing tube ignition & hum' },
  { id: 'retype', name: 'Type & Retype', icon: 'repeat', desc: 'Types, pauses, deletes, and re-types' }
];

export const FONTS = [
  { name: 'Outfit', family: 'Outfit', type: 'Modern' },
  { name: 'Inter', family: 'Inter', type: 'Sans' },
  { name: 'Montserrat', family: 'Montserrat', type: 'Geometric' },
  { name: 'Playfair Display', family: 'Playfair Display', type: 'Serif' },
  { name: 'Cinzel', family: 'Cinzel', type: 'Luxury' },
  { name: 'Caveat', family: 'Caveat', type: 'Handwritten' },
  { name: 'Pacifico', family: 'Pacifico', type: 'Brush' },
  { name: 'Dancing Script', family: 'Dancing Script', type: 'Calligraphy' },
  { name: 'Courier New', family: 'Courier New', type: 'Monospace' },
  { name: 'Trebuchet MS', family: 'Trebuchet MS', type: 'Clean' }
];
