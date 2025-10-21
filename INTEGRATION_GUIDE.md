# FontManager Integration Guide
# FontManager Integratsiya Qo'llanmasi

## O'z loyihangizga qanday qo'shish / How to Integrate Into Your Project

### 1. Fayllarni nusxalash / Copy Files

Faqat `FontManager.js` faylini loyihangizga ko'chiring:

```bash
cp FontManager.js your-project/src/
```

### 2. Import qilish / Import

**ES6 Modules:**
```javascript
import { FontManager } from './FontManager.js';
```

**CommonJS (Node.js):**
```javascript
const { FontManager } = require('./FontManager.js');
```

### 3. HTML faylingizda / In Your HTML File

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>My App</title>
</head>
<body>
  <!-- Your content here -->
  <svg id="mySvg">
    <text x="10" y="30">Hello SVG!</text>
  </svg>

  <script type="module">
    import { FontManager } from './FontManager.js';
    
    const fontManager = new FontManager();
    
    // Shriftlarni qo'shish / Add fonts
    fontManager.addFontDefinitions([
      {
        family: 'MyCustomFont',
        src: "url('/fonts/mycustomfont.woff2') format('woff2')",
        weight: 'normal',
        style: 'normal',
        display: 'swap'
      }
    ]);
    
    // Yuklash / Load
    await fontManager.loadFonts();
    
    // SVG ni tuzatish / Fix SVG
    const svg = document.getElementById('mySvg');
    fontManager.fixSVGFonts(svg);
  </script>
</body>
</html>
```

## Real Project Examples / Haqiqiy Loyiha Misollari

### Misol 1: React App

```jsx
// FontManager.js dan import
import { FontManager } from './FontManager';
import { useEffect, useState } from 'react';

function App() {
  const [fontManager] = useState(() => new FontManager());
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      fontManager.addFontDefinitions([
        {
          family: 'Roboto',
          src: "url('/fonts/roboto.woff2') format('woff2')",
          weight: 'normal',
          style: 'normal'
        }
      ]);

      try {
        await fontManager.loadFonts();
        setFontsLoaded(true);
      } catch (error) {
        console.error('Font loading failed:', error);
      }
    }

    loadFonts();
  }, [fontManager]);

  useEffect(() => {
    if (fontsLoaded) {
      // SVG elementlarni tuzatish
      const svgs = document.querySelectorAll('svg');
      svgs.forEach(svg => fontManager.fixSVGFonts(svg));
    }
  }, [fontsLoaded, fontManager]);

  return (
    <div className="App">
      {fontsLoaded ? (
        <h1>Fonts loaded!</h1>
      ) : (
        <h1>Loading fonts...</h1>
      )}
      
      <svg width="200" height="50">
        <text x="10" y="30">React SVG Text</text>
      </svg>
    </div>
  );
}

export default App;
```

### Misol 2: Vue.js

```vue
<template>
  <div>
    <div v-if="!fontsLoaded">Loading fonts...</div>
    <div v-else>
      <h1>Fonts loaded!</h1>
      <svg ref="svgRef" width="200" height="50">
        <text x="10" y="30">Vue SVG Text</text>
      </svg>
    </div>
  </div>
</template>

<script>
import { FontManager } from './FontManager';

export default {
  name: 'App',
  data() {
    return {
      fontManager: new FontManager(),
      fontsLoaded: false
    };
  },
  async mounted() {
    this.fontManager.addFontDefinitions([
      {
        family: 'MyFont',
        src: "url('/fonts/myfont.woff2') format('woff2')",
        weight: 'normal',
        style: 'normal'
      }
    ]);

    try {
      await this.fontManager.loadFonts();
      this.fontsLoaded = true;
      
      // SVG ni tuzatish
      this.$nextTick(() => {
        if (this.$refs.svgRef) {
          this.fontManager.fixSVGFonts(this.$refs.svgRef);
        }
      });
    } catch (error) {
      console.error('Font loading error:', error);
    }
  }
};
</script>
```

### Misol 3: Vanilla JavaScript

```javascript
// main.js
import { FontManager } from './FontManager.js';

// Global FontManager instance
const fontManager = new FontManager();

// DOMContentLoaded event
document.addEventListener('DOMContentLoaded', async () => {
  // Shriftlarni qo'shish
  fontManager.addFontDefinitions([
    {
      family: 'OpenSans',
      src: "url('fonts/opensans-regular.woff2') format('woff2')",
      weight: '400',
      style: 'normal',
      display: 'swap'
    },
    {
      family: 'OpenSans',
      src: "url('fonts/opensans-bold.woff2') format('woff2')",
      weight: '700',
      style: 'normal',
      display: 'swap'
    }
  ]);

  try {
    // Loading indicator
    showLoadingIndicator();
    
    // Shriftlarni yuklash
    await fontManager.loadFonts();
    
    // SVG elementlarni tuzatish
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => fontManager.fixSVGFonts(svg));
    
    hideLoadingIndicator();
    console.log('✓ All fonts loaded successfully');
  } catch (error) {
    console.error('Font loading failed:', error);
    showErrorMessage('Failed to load fonts');
  }
});

function showLoadingIndicator() {
  document.body.classList.add('fonts-loading');
}

function hideLoadingIndicator() {
  document.body.classList.remove('fonts-loading');
}

function showErrorMessage(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv);
}
```

## Advanced Usage / Kengaytirilgan Foydalanish

### Custom Font Loading Strategy

```javascript
import { FontManager } from './FontManager.js';

class CustomFontManager extends FontManager {
  constructor() {
    super();
    this.loadingStrategy = 'progressive'; // 'progressive' | 'all-at-once'
  }

  // Override loadFonts for progressive loading
  async loadFonts() {
    if (this.loadingStrategy === 'progressive') {
      // Load critical fonts first
      const criticalFonts = this.fontDefinitions.filter(f => f.critical);
      const nonCriticalFonts = this.fontDefinitions.filter(f => !f.critical);
      
      // Load critical fonts immediately
      this.fontDefinitions = criticalFonts;
      await super.loadFonts();
      
      // Load non-critical fonts in background
      setTimeout(async () => {
        this.fontDefinitions = nonCriticalFonts;
        await super.loadFonts();
      }, 1000);
    } else {
      await super.loadFonts();
    }
  }
}

// Usage
const fontManager = new CustomFontManager();
fontManager.addFontDefinitions([
  {
    family: 'HeaderFont',
    src: "url('fonts/header.woff2') format('woff2')",
    critical: true
  },
  {
    family: 'BodyFont',
    src: "url('fonts/body.woff2') format('woff2')",
    critical: false
  }
]);
```

### With TypeScript

```typescript
// fontManager.d.ts
export interface FontDefinition {
  family: string;
  src: string;
  weight?: string | number;
  style?: string;
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
}

export class FontManager {
  loadedFonts: Set<string>;
  fontLoadPromises: Map<string, Promise<FontFace>>;
  fontDefinitions: FontDefinition[];

  constructor();
  addFontDefinitions(fonts: FontDefinition[]): void;
  loadFonts(): Promise<void>;
  fixSVGFonts(svgElement: SVGElement): void;
  areFontsLoaded(fontFamily?: string): boolean;
  waitForFont(fontFamily: string, timeout?: number): Promise<boolean>;
  generateFontFaceCSS(): string;
  getLoadedFonts(): string[];
  clear(): void;
}
```

```typescript
// app.ts
import { FontManager, FontDefinition } from './FontManager';

const fontManager = new FontManager();

const fonts: FontDefinition[] = [
  {
    family: 'Roboto',
    src: "url('fonts/roboto.woff2') format('woff2')",
    weight: '400',
    style: 'normal',
    display: 'swap'
  }
];

fontManager.addFontDefinitions(fonts);

async function init() {
  await fontManager.loadFonts();
  
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg: SVGElement) => {
    fontManager.fixSVGFonts(svg);
  });
}

init();
```

## Best Practices / Eng Yaxshi Amaliyotlar

### 1. Font Preloading

```html
<head>
  <!-- Muhim shriftlarni oldindan yuklash -->
  <link rel="preload" href="/fonts/main-font.woff2" as="font" type="font/woff2" crossorigin>
</head>
```

### 2. Error Handling

```javascript
try {
  await fontManager.loadFonts();
} catch (error) {
  // Fallback to system fonts
  console.warn('Custom fonts failed, using system fonts');
  document.body.classList.add('system-fonts');
}
```

### 3. Performance Monitoring

```javascript
const startTime = performance.now();

await fontManager.loadFonts();

const loadTime = performance.now() - startTime;
console.log(`Fonts loaded in ${loadTime}ms`);

// Send to analytics
if (loadTime > 3000) {
  console.warn('Font loading is slow');
}
```

### 4. Font Loading Events

```javascript
fontManager.addEventListener = (event, callback) => {
  // Custom event system
  document.addEventListener(`fontmanager:${event}`, callback);
};

// Before loading
document.dispatchEvent(new CustomEvent('fontmanager:beforeload'));

await fontManager.loadFonts();

// After loading
document.dispatchEvent(new CustomEvent('fontmanager:loaded'));
```

## Troubleshooting / Muammolarni Hal Qilish

### Issue: Fonts not loading
```javascript
// Check if FontFace API is supported
if (!('FontFace' in window)) {
  console.error('FontFace API not supported');
  // Use fallback method
}

// Check CORS issues
// Ensure fonts are served with correct headers:
// Access-Control-Allow-Origin: *
```

### Issue: SVG text not updated
```javascript
// Force repaint
svg.style.display = 'none';
svg.offsetHeight; // trigger reflow
svg.style.display = '';
```

## Resources / Resurslar

- [MDN FontFace API](https://developer.mozilla.org/en-US/docs/Web/API/FontFace)
- [Web Font Best Practices](https://web.dev/font-best-practices/)
- [Font Display Options](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display)
