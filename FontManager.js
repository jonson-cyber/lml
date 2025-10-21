/**
 * FontManager - Shriftlarni yuklash va SVG matnlarini boshqarish moduli
 * Handles font loading and SVG text management
 */
export class FontManager {
  constructor() {
    this.loadedFonts = new Set();
    this.fontLoadPromises = new Map();
    this.fontDefinitions = [];
  }

  /**
   * Shrift definitsiyalarini qo'shish
   * Add font definitions to be loaded
   * @param {Array} fonts - Array of font definition objects
   * Each font object should have: { family, src, weight, style, display }
   */
  addFontDefinitions(fonts) {
    if (!Array.isArray(fonts)) {
      throw new Error('Font definitions must be an array');
    }
    this.fontDefinitions.push(...fonts);
  }

  /**
   * Shriftlarni yuklash
   * Load all registered fonts using @font-face
   * @returns {Promise<void>}
   */
  async loadFonts() {
    try {
      // Agar shriftlar allaqachon yuklanayotgan bo'lsa, kutamiz
      // If fonts are already loading, wait for them
      if (this.fontLoadPromises.size > 0) {
        await Promise.all(this.fontLoadPromises.values());
        return;
      }

      // Har bir shrift uchun @font-face yaratish
      // Create @font-face for each font
      const loadPromises = this.fontDefinitions.map(async (font) => {
        if (this.loadedFonts.has(font.family)) {
          return; // Allaqachon yuklangan / Already loaded
        }

        const fontFace = new FontFace(
          font.family,
          font.src,
          {
            weight: font.weight || 'normal',
            style: font.style || 'normal',
            display: font.display || 'swap'
          }
        );

        const promise = fontFace.load()
          .then((loadedFace) => {
            document.fonts.add(loadedFace);
            this.loadedFonts.add(font.family);
            console.log(`✓ Shrift yuklandi / Font loaded: ${font.family}`);
            return loadedFace;
          })
          .catch((error) => {
            console.error(`✗ Shrift yuklanmadi / Font failed to load: ${font.family}`, error);
            throw new Error(`Failed to load font: ${font.family} - ${error.message}`);
          });

        this.fontLoadPromises.set(font.family, promise);
        return promise;
      });

      // Barcha shriftlar yuklanishini kutish
      // Wait for all fonts to load
      await Promise.all(loadPromises);
      
      // Document fonts tayyor bo'lishini kutish
      // Wait for document fonts to be ready
      await document.fonts.ready;

      console.log('✓ Barcha shriftlar yuklandi / All fonts loaded');
      
      // Promise xotirasini tozalash / Clean up promise cache
      this.fontLoadPromises.clear();
    } catch (error) {
      console.error('Shriftlarni yuklashda xatolik / Error loading fonts:', error);
      this.fontLoadPromises.clear();
      throw error;
    }
  }

  /**
   * SVG shriftlarini tuzatish
   * Fix SVG fonts by ensuring proper font-family and text rendering
   * @param {SVGElement} svgElement - SVG element to fix
   */
  fixSVGFonts(svgElement) {
    if (!svgElement || !(svgElement instanceof SVGElement)) {
      console.error('SVG element noto\'g\'ri / Invalid SVG element provided');
      return;
    }

    try {
      // SVG ichidagi barcha style elementlarni topish
      // Find all style elements in SVG
      const styleElements = svgElement.querySelectorAll('style');
      
      styleElements.forEach((styleElement) => {
        let styleContent = styleElement.textContent;
        
        // @font-face deklaratsiyalarini qo'shish
        // Add @font-face declarations if needed
        if (!styleContent.includes('@font-face')) {
          const fontFaceRules = this.generateFontFaceCSS();
          styleElement.textContent = fontFaceRules + '\n' + styleContent;
        }
      });

      // Agar style element bo'lmasa, yangi yaratish
      // Create new style element if none exists
      if (styleElements.length === 0 && this.fontDefinitions.length > 0) {
        const newStyle = document.createElementNS('http://www.w3.org/2000/svg', 'style');
        newStyle.textContent = this.generateFontFaceCSS();
        svgElement.insertBefore(newStyle, svgElement.firstChild);
      }

      // Barcha text elementlarga shrift qo'llash
      // Apply fonts to all text elements
      const textElements = svgElement.querySelectorAll('text, tspan');
      
      textElements.forEach((textElement) => {
        // font-family attributi bo'lmasa, default qo'yish
        // Set default font-family if not present
        if (!textElement.hasAttribute('font-family') && this.loadedFonts.size > 0) {
          const firstFont = this.fontDefinitions[0]?.family;
          if (firstFont) {
            textElement.setAttribute('font-family', firstFont);
          }
        }

        // text-rendering optimizatsiyasi
        // Optimize text rendering
        if (!textElement.hasAttribute('text-rendering')) {
          textElement.setAttribute('text-rendering', 'optimizeLegibility');
        }
      });

      console.log('✓ SVG shriftlari tuzatildi / SVG fonts fixed');
    } catch (error) {
      console.error('SVG shriftlarini tuzatishda xatolik / Error fixing SVG fonts:', error);
      throw error;
    }
  }

  /**
   * CSS @font-face qoidalarini generatsiya qilish
   * Generate CSS @font-face rules
   * @returns {string} CSS content
   */
  generateFontFaceCSS() {
    return this.fontDefinitions
      .map((font) => {
        return `
@font-face {
  font-family: '${font.family}';
  src: ${font.src};
  font-weight: ${font.weight || 'normal'};
  font-style: ${font.style || 'normal'};
  font-display: ${font.display || 'swap'};
}`;
      })
      .join('\n');
  }

  /**
   * Shrift yuklanish holatini tekshirish
   * Check if fonts are loaded
   * @param {string} [fontFamily] - Optional: specific font family to check
   * @returns {boolean} True if fonts are loaded
   */
  areFontsLoaded(fontFamily = null) {
    if (fontFamily) {
      return this.loadedFonts.has(fontFamily);
    }
    
    // Barcha registrlangan shriftlar yuklanganligini tekshirish
    // Check if all registered fonts are loaded
    if (this.fontDefinitions.length === 0) {
      return false;
    }
    
    return this.fontDefinitions.every((font) => this.loadedFonts.has(font.family));
  }

  /**
   * Ma'lum shrift yuklanishini kutish
   * Wait for a specific font to load
   * @param {string} fontFamily - Font family name
   * @param {number} timeout - Timeout in milliseconds (default: 5000)
   * @returns {Promise<boolean>} True if font loaded successfully
   */
  async waitForFont(fontFamily, timeout = 5000) {
    if (this.loadedFonts.has(fontFamily)) {
      return true;
    }

    try {
      const checkPromise = document.fonts.load(`1em "${fontFamily}"`);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Font load timeout: ${fontFamily}`)), timeout);
      });

      await Promise.race([checkPromise, timeoutPromise]);
      return true;
    } catch (error) {
      console.error(`Shrift kutishda xatolik / Error waiting for font: ${fontFamily}`, error);
      return false;
    }
  }

  /**
   * Barcha shriftlarni tozalash
   * Clear all loaded fonts
   */
  clear() {
    this.loadedFonts.clear();
    this.fontLoadPromises.clear();
    this.fontDefinitions = [];
    console.log('✓ FontManager tozalandi / FontManager cleared');
  }

  /**
   * Yuklanган shriftlar ro'yxatini olish
   * Get list of loaded fonts
   * @returns {Array<string>} Array of loaded font family names
   */
  getLoadedFonts() {
    return Array.from(this.loadedFonts);
  }
}
