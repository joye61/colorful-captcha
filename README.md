# colorful-captcha

A Node.js based colorful captcha generation library that provides high-quality graphic verification codes with multiple difficulty levels and customizable configurations.

> ⚠️ **Security Notice**: Traditional graphic verification codes are considered an unsafe protection method. Modern OCR and AI technology can easily crack various forms of graphic verification codes. This project is not responsible for security risks brought by verification codes. Please use with caution.

## Features

- 🎨 **Multiple Image Formats**: Support PNG, JPG, JPEG, WebP format output
- 🛡️ **Three Difficulty Levels**: Easy, normal, hard interference levels
- 🎯 **Highly Customizable**: Support custom dimensions, character sources, spacing, etc.
- 🔤 **Smart Characters**: Exclude confusing characters by default (o, 0, O, l, I, 1)
- ⚡ **High Performance**: Based on [skia-canvas](https://github.com/samizdatco/skia-canvas) with excellent rendering performance

## Preview

The captcha image looks like this:

<div>
  <img src="./test/buf.png"/> &nbsp;&nbsp;
</div>
<br />

## Installation

```bash
npm install colorful-captcha
```

## API Documentation

### Main Interface

`createCaptcha` is the core API exported by the library, which is an asynchronous function:

```typescript
// Function signature
createCaptcha(options?: CaptchaOptions): Promise<CaptchaResult>;

// Configuration parameter type
interface CaptchaOptions {
  /** Captcha width (default: 240) */
  width?: number;
  /** Captcha height (default: 80) */
  height?: number;
  /** Number of captcha characters (default: 4) */
  length?: number;
  /** Whether characters are allowed to repeat (default: true) */
  noRepeat?: boolean;
  /** Character source (default: predefined character set, excluding confusing characters) */
  source?: string;
  /** Difficulty mode: "easy" | "normal" | "hard" (default: normal) */
  mode?: DifficultyMode;
  /** Character spacing (default: 5) */
  spacing?: number;
  /** Image format: "png" | "jpg" | "jpeg" | "webp" (default: png) */
  format?: ImageFormat;
}

// Return value type
interface CaptchaResult {
  /** Image Buffer data */
  buffer: Buffer;
  /** Captcha text content */
  text: string;
  /** Image MIME type */
  mime: string;
  /** Image width */
  width: number;
  /** Image height */
  height: number;
}
```

### Exported Classes and Interfaces

In addition to the main function, you can also directly use the underlying classes:

```typescript
// Exported core classes
export { Generator } from './Generator';   // Captcha generator
export { Renderer } from './Renderer';     // Renderer
export { Distortion } from './Distortion'; // Distortion algorithm

// Exported type definitions
export type * from './types';
```

## Usage Examples

### Basic Usage

```typescript
import { createCaptcha } from "colorful-captcha";
import fs from "node:fs/promises";

(async () => {
  // Generate captcha with default configuration
  const result = await createCaptcha();
  
  console.log('Captcha text:', result.text);
  console.log('Image size:', result.width, 'x', result.height);
  console.log('MIME type:', result.mime);
  
  // Save to file
  await fs.writeFile("captcha.png", result.buffer);
})();
```

### Custom Configuration

```typescript
import { createCaptcha } from "colorful-captcha";

(async () => {
  // Generate captcha with custom parameters
  const result = await createCaptcha({
    width: 300,           // Width 300px
    height: 100,          // Height 100px
    length: 6,            // 6 characters
    mode: "hard",         // Hard mode
    format: "webp",       // WebP format
    noRepeat: true,       // No character repetition allowed
    spacing: 8,           // Character spacing 8px
    source: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" // Custom character set
  });
  
  console.log('Captcha:', result.text);
})();
```

### Express.js Integration

```typescript
import express from "express";
import { createCaptcha } from "colorful-captcha";

const app = express();

app.get("/captcha", async (req, res) => {
  try {
    const result = await createCaptcha({
      mode: "normal",
      format: "png"
    });
    
    // Set response headers
    res.setHeader('Content-Type', result.mime);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    // Return image data
    res.send(result.buffer);
    
    // Save captcha text to session or other storage for verification
    // req.session.captcha = result.text;
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate captcha' });
  }
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
```

### Advanced Usage: Using Underlying Classes

```typescript
import { Generator, Renderer, Distortion } from "colorful-captcha";

// Create custom generator
const generator = new Generator({
  width: 240,
  height: 80,
  mode: "normal"
});

// Generate captcha
const result = await generator.generate();
```

## Configuration Guide

### Difficulty Level Details

| Difficulty | Noise Density | Interference Lines | Distortion Level | Use Case |
|------------|---------------|-------------------|------------------|----------|
| `easy` | Low | Few | Slight | User experience priority |
| `normal` | Medium | Medium | Moderate | Balance security and usability |
| `hard` | High | Dense | Strong | High security requirements |

### Default Character Set

Default character set excludes confusing characters:
```
23456789abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ
```

Excluded characters: `0`, `O`, `o`, `1`, `l`, `I`

## Notes

1. **Aspect Ratio**: Default size is `240×80`, if customizing please maintain appropriate aspect ratio to avoid text clipping
2. **Font Dependencies**: Project has built-in Alibaba PuHuiTi font, no additional installation required
3. **Performance Considerations**: Based on skia-canvas implementation with excellent performance, but pay attention to memory usage when generating large captchas
4. **Node.js Version**: Recommend using Node.js 16+ for best compatibility

## Architecture Design

### Core Modules

- **Generator**: Captcha generator, responsible for coordinating the entire generation process
- **Renderer**: Renderer, handles drawing of text, noise, lines and other elements
- **Distortion**: Distortion algorithm, implements character deformation to increase recognition difficulty
- **Types**: Complete TypeScript type definitions

### Technical Features

- **Modular Architecture**: Clear separation of concerns, easy to maintain and extend
- **Type Safety**: Complete TypeScript support, reduces runtime errors
- **High Performance Rendering**: Efficient graphics processing based on skia-canvas
- **Algorithm Optimization**: Bidirectional wave distortion + random phase, effectively counters OCR recognition

## FAQ

### Q: Why choose skia-canvas?
A: skia-canvas is based on Google Skia graphics engine with excellent performance, supports multiple image formats, and high rendering quality.

### Q: How secure is the captcha?
A: This library uses multiple interference techniques (noise, lines, distortion), but traditional captchas face AI recognition threats. It's recommended to use with other security measures.

### Q: How to use in production environment?
A: It's recommended to combine with Redis or other cache storage for captcha text, set reasonable expiration time, and limit verification attempts.

### Q: Can I customize the font?
A: Current version has built-in Alibaba PuHuiTi font. For custom fonts, you can modify the Generator class.

## Related Links

- [GitHub Repository](https://github.com/joye61/colorful-captcha)
- [NPM Package](https://www.npmjs.com/package/colorful-captcha)
- [Issue Reports](https://github.com/joye61/colorful-captcha/issues)

## License

MIT License - See [LICENSE](./LICENSE) file for details

