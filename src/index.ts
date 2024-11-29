import { getRandomChars } from "./char";
import { Canvas, FontLibrary } from "skia-canvas";
import path from "path";

FontLibrary.use("alibaba-puhuiti", [path.resolve(__dirname, "../puhuiti.ttf")]);

export async function createCaptcha(
  width: number = 120,
  height: number = 60,
  ...option: Parameters<typeof getRandomChars>
) {
  const chars = getRandomChars();
  const canvas = new Canvas(width, height);
  const context = canvas.getContext("2d");
  context.fillStyle = "white";
  context.fillRect(0, 0, width, height);
  context.font = "20px alibaba-puhuiti";
  context.fillStyle = "red";
  console.log(chars.join(""));
  console.log(context.measureText(chars.join("")));
  context.fillText(chars.join(""), 0, 20);
  const fileName = path.resolve(__dirname, "../a.png");
  await canvas.saveAs(fileName, { format: "png" });
}

createCaptcha();
