# FontManager - Shrift Boshqaruv Moduli

FontManager - bu shriftlarni yuklash va SVG matnlarini boshqarish uchun JavaScript moduli.

## Xususiyatlar / Features

- ✅ Shriftlarni dinamik yuklash / Dynamic font loading
- ✅ @font-face deklaratsiyalari / @font-face declarations
- ✅ SVG matnlarini avtomatik tuzatish / Automatic SVG text fixing
- ✅ Shrift yuklanish holatini tekshirish / Font loading status checking
- ✅ Xato boshqarish / Error handling
- ✅ Promise-based API
- ✅ ES6 module format

## Foydalanish / Usage

### 1. Modulni import qilish / Import the module

```javascript
import { FontManager } from './FontManager.js';
```

### 2. FontManager obyektini yaratish / Create FontManager instance

```javascript
const fontManager = new FontManager();
```

### 3. Shrift definitsiyalarini qo'shish / Add font definitions

```javascript
fontManager.addFontDefinitions([
  {
    family: 'Roboto',
    src: "url(path/to/roboto.woff2) format('woff2')",
    weight: 'normal',
    style: 'normal',
    display: 'swap'
  },
  {
    family: 'Open Sans',
    src: "url(path/to/opensans.woff2) format('woff2')",
    weight: 'normal',
    style: 'normal',
    display: 'swap'
  }
]);
```

### 4. Shriftlarni yuklash / Load fonts

```javascript
try {
  await fontManager.loadFonts();
  console.log('Shriftlar yuklandi! / Fonts loaded!');
} catch (error) {
  console.error('Xatolik / Error:', error);
}
```

### 5. SVG shriftlarini tuzatish / Fix SVG fonts

```javascript
const svgElement = document.querySelector('svg');
fontManager.fixSVGFonts(svgElement);
```

## API Hujjatlari / API Documentation

### Constructor

```javascript
const fontManager = new FontManager();
```

Yangi FontManager obyektini yaratadi.

### Methods

#### `addFontDefinitions(fonts: Array)`

Shrift definitsiyalarini qo'shadi.

**Parametrlar / Parameters:**
- `fonts` - Shrift obyektlari massivi / Array of font objects

**Misol / Example:**
```javascript
fontManager.addFontDefinitions([
  {
    family: 'MyFont',
    src: "url(fonts/myfont.woff2) format('woff2')",
    weight: 'normal',
    style: 'normal',
    display: 'swap'
  }
]);
```

#### `async loadFonts()`

Barcha registrlangan shriftlarni yuklaydi.

**Qaytaradi / Returns:** `Promise<void>`

**Misol / Example:**
```javascript
await fontManager.loadFonts();
```

#### `fixSVGFonts(svgElement: SVGElement)`

SVG elementdagi shriftlarni tuzatadi va optimizatsiya qiladi.

**Parametrlar / Parameters:**
- `svgElement` - Tuzatish uchun SVG elementi / SVG element to fix

**Misol / Example:**
```javascript
const svg = document.querySelector('#mySvg');
fontManager.fixSVGFonts(svg);
```

#### `areFontsLoaded(fontFamily?: string): boolean`

Shriftlar yuklanganligini tekshiradi.

**Parametrlar / Parameters:**
- `fontFamily` (optional) - Tekshirish uchun shrift nomi / Font family to check

**Qaytaradi / Returns:** `boolean`

**Misol / Example:**
```javascript
if (fontManager.areFontsLoaded()) {
  console.log('Barcha shriftlar yuklandi');
}

if (fontManager.areFontsLoaded('Roboto')) {
  console.log('Roboto yuklandi');
}
```

#### `async waitForFont(fontFamily: string, timeout?: number): Promise<boolean>`

Ma'lum shrift yuklanishini kutadi.

**Parametrlar / Parameters:**
- `fontFamily` - Shrift nomi / Font family name
- `timeout` (optional) - Kutish vaqti (ms), default: 5000

**Qaytaradi / Returns:** `Promise<boolean>`

**Misol / Example:**
```javascript
const loaded = await fontManager.waitForFont('Roboto', 3000);
```

#### `generateFontFaceCSS(): string`

@font-face CSS qoidalarini generatsiya qiladi.

**Qaytaradi / Returns:** `string` - CSS kodi

#### `getLoadedFonts(): Array<string>`

Yuklangan shriftlar ro'yxatini qaytaradi.

**Qaytaradi / Returns:** `Array<string>` - Shrift nomlari massivi

**Misol / Example:**
```javascript
const fonts = fontManager.getLoadedFonts();
console.log('Yuklangan shriftlar:', fonts);
```

#### `clear()`

Barcha yuklangan shriftlarni va ma'lumotlarni tozalaydi.

**Misol / Example:**
```javascript
fontManager.clear();
```

## Demo

Demoni ko'rish uchun `index.html` faylini brauzerda oching.

To see the demo, open `index.html` in a browser.

## Talablar / Requirements

- Modern brauzer (ES6 modules support)
- FontFace API support

## Litsenziya / License

MIT