import { Canvas, FontLibrary } from "skia-canvas";
import path from "path";
import { getRandomTextColor, getRandomValue } from "./random";

const fontName = "puhuiti";
FontLibrary.use(fontName, [path.resolve(__dirname, `../${fontName}.ttf`)]);

/**
 * Init a new canvas with width and height
 * @param width
 * @param height
 * @returns
 */
export function createCanvas(width: number, height: number) {
  const canvas = new Canvas(width, height);
  const context = canvas.getContext("2d");
  context.font = `bold ${height - height / 4}px/1 ${fontName}`;
  context.textBaseline = "top";

  return { canvas, context };
}

/**
 * Create a canvas that just surrounds the text
 * @param char
 * @param width
 * @param height
 * @returns
 */
export function createTextCanvas(char: string, width: number, height: number) {
  const canvas = new Canvas(width, height);
  const context = canvas.getContext("2d");
  context.font = `bold ${height}px/1 ${fontName}`;
  context.textBaseline = "top";
  context.fillStyle = getRandomTextColor();
  context.translate(width / 2, height / 2);
  const degree = getRandomValue(60) - 30;
  context.rotate((degree * Math.PI) / 180);
  context.fillText(char, -width / 2, -height / 2);
  return { context, canvas };
}
