import { Canvas as SkiaCanvas, FontLibrary } from "skia-canvas";
import path from "path";
import { registerFont, createCanvas, Canvas as NodeCanvas } from "canvas";
import { CreateCaptchaOption } from "./types";

export { SkiaCanvas, NodeCanvas };

// Font family name
const fontName = "puhuiti";

// Font is loaded or not
let isFontLoaded = false;

/**
 * Load font only once
 * @param useSkia Whether use skia-canvas
 * @returns
 */
export function loadFont(useSkia = false) {
  if (isFontLoaded) return;

  const fontFile = path.resolve(__dirname, `../${fontName}.ttf`);
  if (useSkia) {
    FontLibrary.use(fontName, [fontFile]);
  } else {
    registerFont(fontFile, {
      family: fontName,
      style: "bold",
    });
  }
  isFontLoaded = true;
}

/**
 * Init a new canvas with width and height
 * @param width
 * @param height
 * @returns
 */
export function getCanvas(option: Required<CreateCaptchaOption>) {
  let canvas: SkiaCanvas | NodeCanvas;
  if (option.useSkia) {
    canvas = new SkiaCanvas(option.width, option.height);
  } else {
    canvas = createCanvas(option.width, option.height);
  }
  const context = canvas.getContext("2d");
  const lineHeight = option.height - option.height / 4;
  context.font = `bold ${lineHeight}px ${fontName}`;
  context.textBaseline = "middle";
  return { canvas, context };
}
