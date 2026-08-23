/**
 * DP Creator Studio V4 - Constants & Presets
 */

export const DEFAULT_TEXT = 'Hello Ji...😊';

export const MESSAGE_PRESETS = [
  {
    category: 'Cute',
    items: [
      'Hello Ji...😊',
      'Suniye na ✨',
      'Smile please 😊',
      'Sweet dreams 🌙',
      'Always shining ✨'
    ]
  },
  {
    category: 'Simple',
    items: [
      'Hello Ji...✨',
      'Welcome! 🌸',
      'Good Vibes Only 💫',
      'Stay Blessed 🌿',
      'Peace & Love 🕊️'
    ]
  },
  {
    category: 'Friendly',
    items: [
      'Arey Ji... 👋',
      'Kaise hain aap? 🌿',
      'Aur batao Ji... ☕',
      'Kaha gayab ho aaj kal? 🧐'
    ]
  },
  {
    category: 'Playful',
    items: [
      'Sun rahe hain? 👀',
      'Caught you looking! 😉',
      'Thinking of you... 💭',
      'Secretly cool 😎'
    ]
  },
  {
    category: 'Morning & Night',
    items: [
      'Good Morning Ji... ☀️',
      'Subah Bakhair 🌅',
      'Good Night 🌙',
      'Have a magical day 🌸'
    ]
  },
  {
    category: 'Sweet & Warm',
    items: [
      'Have a great day ✨',
      'You make me smile 💖',
      'Forever & Always ✨',
      'My favorite notification 💌'
    ]
  }
];

export const FRAME_STYLES = [
  { id: 'corners', name: 'Modern Corners', icon: '⌜⌟' },
  { id: 'box', name: 'Classic Rectangle', icon: '◻' },
  { id: 'double', name: 'Double Border', icon: '回' },
  { id: 'neon', name: 'Neon Glow Border', icon: '⚡' },
  { id: 'vintage', name: 'Vintage Stationery', icon: '📜' },
  { id: 'dotted', name: 'Dotted Tech', icon: '⬚' },
  { id: 'gradient', name: 'Gradient Aura', icon: '🌈' },
  { id: 'none', name: 'None (No Frame)', icon: '🚫' }
];

export const SCENES = [
  {
    id: 'aurora',
    name: 'Aurora',
    icon: '🌌',
    desc: 'Shimmering Northern Lights waves & deep stellar atmosphere',
    paletteIndex: 0,
    font: 'Outfit',
    anim: 'wave',
    frameStyle: 'corners',
    doodles: ['spark', 'stars'],
    bgType: 'aurora'
  },
  {
    id: 'moonlight',
    name: 'Moonlight',
    icon: '🌙',
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
    icon: '🌧️',
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
    icon: '☁️',
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
    icon: '✨',
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
    icon: '🌸',
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
    icon: '📜',
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
    icon: '🪩',
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
    icon: '🌊',
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
    icon: '🌃',
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
    icon: '🌿',
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
    icon: '🖤',
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
    icon: '💜',
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
    icon: '🎞️',
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
  { id: 'spark', name: 'Sparkles', icon: '✦', defaultAmount: 14 },
  { id: 'stars', name: 'Stars', icon: '⭐', defaultAmount: 10 },
  { id: 'twinkle', name: 'Twinkles', icon: '✨', defaultAmount: 12 },
  { id: 'rain', name: 'Rain Streaks', icon: '🌧️', defaultAmount: 24 },
  { id: 'drizzle', name: 'Gentle Drizzle', icon: '💧', defaultAmount: 16 },
  { id: 'petals', name: 'Sakura Petals', icon: '🌸', defaultAmount: 12 },
  { id: 'snow', name: 'Snow Flakes', icon: '❄️', defaultAmount: 18 },
  { id: 'hearts', name: 'Floating Hearts', icon: '❤️', defaultAmount: 8 },
  { id: 'butterflies', name: 'Butterflies', icon: '🦋', defaultAmount: 5 },
  { id: 'clouds', name: 'Floating Clouds', icon: '☁️', defaultAmount: 4 },
  { id: 'bubbles', name: 'Bubbles', icon: '🫧', defaultAmount: 10 },
  { id: 'ribbons', name: 'Ribbons / Confetti', icon: '🎀', defaultAmount: 14 },
  { id: 'orbit', name: 'Orbit Rings', icon: '➰', defaultAmount: 6 },
  { id: 'shooting_star', name: 'Shooting Stars', icon: '☄️', defaultAmount: 3 },
  { id: 'doodles', name: 'Hand Doodles', icon: '✏️', defaultAmount: 8 }
];

export const ANIMATIONS = [
  { id: 'type', name: 'Typewriter', icon: '⌨️', desc: 'Classic char-by-char with glowing cursor' },
  { id: 'fade', name: 'Soft Fade', icon: '✨', desc: 'Silky smooth opacity reveal' },
  { id: 'pop', name: 'Pop Bounce', icon: '💫', desc: 'Elastic bouncy entrance' },
  { id: 'slide_up', name: 'Slide Up', icon: '⬆️', desc: 'Smooth upward glide' },
  { id: 'slide_down', name: 'Slide Down', icon: '⬇️', desc: 'Gentle downward drop' },
  { id: 'slide_left', name: 'Slide Left', icon: '⬅️', desc: 'Lateral entrance from right' },
  { id: 'slide_right', name: 'Slide Right', icon: '➡️', desc: 'Lateral entrance from left' },
  { id: 'zoom_in', name: 'Zoom In', icon: '🔍', desc: 'Dramatic depth scale-up' },
  { id: 'wave', name: 'Wave Motion', icon: '🌊', desc: 'Dynamic sine wave bouncing letters' },
  { id: 'cascade', name: 'Letter Cascade', icon: '🔤', desc: 'Cascading staggered character drops' },
  { id: 'cinematic', name: 'Cinematic Reveal', icon: '🎞️', desc: 'Soft blur to sharp cinematic lens focus' },
  { id: 'handwriting', name: 'Handwriting', icon: '✍️', desc: 'Stroke by stroke handwriting flow' },
  { id: 'neon', name: 'Neon Flicker', icon: '💡', desc: 'Electric pulsing tube ignition' },
  { id: 'retype', name: 'Type & Retype', icon: '⌫', desc: 'Types, pauses, deletes, and re-types' }
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
