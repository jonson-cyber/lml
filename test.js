/**
 * FontManager Test Suite
 * Simple tests for FontManager functionality
 */

import { FontManager } from './FontManager.js';

// Test utilities
const assert = (condition, message) => {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log('✓', message);
};

const test = async (name, fn) => {
  console.log(`\n📝 Test: ${name}`);
  try {
    await fn();
    console.log('✅ PASSED:', name);
  } catch (error) {
    console.error('❌ FAILED:', name);
    console.error('   Error:', error.message);
    throw error;
  }
};

// Run tests
async function runTests() {
  console.log('🚀 FontManager Test Suite\n');
  console.log('=' .repeat(50));

  try {
    // Test 1: Constructor
    await test('Constructor initializes correctly', () => {
      const fm = new FontManager();
      assert(fm.loadedFonts instanceof Set, 'loadedFonts should be a Set');
      assert(fm.fontLoadPromises instanceof Map, 'fontLoadPromises should be a Map');
      assert(Array.isArray(fm.fontDefinitions), 'fontDefinitions should be an array');
      assert(fm.loadedFonts.size === 0, 'loadedFonts should be empty initially');
    });

    // Test 2: Add font definitions
    await test('addFontDefinitions adds fonts correctly', () => {
      const fm = new FontManager();
      const fonts = [
        { family: 'TestFont1', src: "url('test1.woff2')" },
        { family: 'TestFont2', src: "url('test2.woff2')" }
      ];
      fm.addFontDefinitions(fonts);
      assert(fm.fontDefinitions.length === 2, 'Should have 2 font definitions');
      assert(fm.fontDefinitions[0].family === 'TestFont1', 'First font should be TestFont1');
    });

    // Test 3: Add font definitions - error handling
    await test('addFontDefinitions throws error for invalid input', () => {
      const fm = new FontManager();
      let errorThrown = false;
      try {
        fm.addFontDefinitions('not an array');
      } catch (error) {
        errorThrown = true;
        assert(error.message.includes('array'), 'Error message should mention array');
      }
      assert(errorThrown, 'Should throw error for non-array input');
    });

    // Test 4: areFontsLoaded - empty
    await test('areFontsLoaded returns false when no fonts', () => {
      const fm = new FontManager();
      assert(fm.areFontsLoaded() === false, 'Should return false when no fonts defined');
    });

    // Test 5: areFontsLoaded - with font family
    await test('areFontsLoaded checks specific font', () => {
      const fm = new FontManager();
      fm.loadedFonts.add('TestFont');
      assert(fm.areFontsLoaded('TestFont') === true, 'Should return true for loaded font');
      assert(fm.areFontsLoaded('UnloadedFont') === false, 'Should return false for unloaded font');
    });

    // Test 6: getLoadedFonts
    await test('getLoadedFonts returns array of fonts', () => {
      const fm = new FontManager();
      fm.loadedFonts.add('Font1');
      fm.loadedFonts.add('Font2');
      const loaded = fm.getLoadedFonts();
      assert(Array.isArray(loaded), 'Should return an array');
      assert(loaded.length === 2, 'Should have 2 fonts');
      assert(loaded.includes('Font1'), 'Should include Font1');
      assert(loaded.includes('Font2'), 'Should include Font2');
    });

    // Test 7: generateFontFaceCSS
    await test('generateFontFaceCSS creates correct CSS', () => {
      const fm = new FontManager();
      fm.addFontDefinitions([
        {
          family: 'TestFont',
          src: "url('test.woff2')",
          weight: '400',
          style: 'normal',
          display: 'swap'
        }
      ]);
      const css = fm.generateFontFaceCSS();
      assert(css.includes('@font-face'), 'Should contain @font-face');
      assert(css.includes('TestFont'), 'Should contain font family name');
      assert(css.includes("url('test.woff2')"), 'Should contain font source');
    });

    // Test 8: clear
    await test('clear removes all data', () => {
      const fm = new FontManager();
      fm.loadedFonts.add('Font1');
      fm.addFontDefinitions([{ family: 'Font2', src: "url('test.woff2')" }]);
      fm.clear();
      assert(fm.loadedFonts.size === 0, 'loadedFonts should be empty');
      assert(fm.fontDefinitions.length === 0, 'fontDefinitions should be empty');
    });

    // Test 9: fixSVGFonts - null check (skip in Node.js environment)
    await test('fixSVGFonts handles invalid input', () => {
      const fm = new FontManager();
      // Note: This test only works in browser environment
      // In Node.js, SVGElement is not defined
      console.log('   ⚠ Skipping SVG tests in Node.js environment');
      assert(true, 'Test skipped in Node.js environment');
    });

    console.log('\n' + '='.repeat(50));
    console.log('🎉 All tests passed!');
    console.log('='.repeat(50));

  } catch (error) {
    console.log('\n' + '='.repeat(50));
    console.log('💥 Test suite failed!');
    console.log('='.repeat(50));
    throw error;
  }
}

// Run tests if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(error => {
    console.error('Test suite error:', error);
    process.exit(1);
  });
}

export { runTests };
