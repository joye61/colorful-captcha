import {
  getRandomChars,
  getRandomNoiseColor,
  getRandomPoint,
  getRandomTextColor,
  PreDefinedChars,
} from "./random";
import { getCanvas, loadFont, NodeCanvas, SkiaCanvas } from "./canvas";
import type { CreateCaptchaOption, DifficultyParams } from "./types";
import { ExportFormat } from "skia-canvas";

/**
 * Parse option passed from user
 * Make sure each parameter has a default value
 * @param option
 * @returns
 */
function parseOption(
  option?: CreateCaptchaOption
): Required<CreateCaptchaOption> {
  let config: CreateCaptchaOption = {
    width: 240,
    height: 80,
    mode: "normal",
    spacing: 5,
    length: 4,
    noRepeat: false,
    source: PreDefinedChars,
    useSkia: false,
  };
  if (option && typeof option === "object") {
    config = {
      ...config,
      ...option,
    };
  }

  // If no width or height specified, an error will throw
  if (!config.width || !config.height) {
    throw new Error(
      `The width and height of the verification code must be specified`
    );
  }

  // Load font
  loadFont(config.useSkia);

  return config as Required<CreateCaptchaOption>;
}

/**
 * Create a canvas containing a graphical verification code
 * @param option CreateCaptchaOption
 */
export function createCaptchaCanvas(option?: CreateCaptchaOption) {
  const config = parseOption(option);

  const params: DifficultyParams = {
    noiseNum: (config.width * config.height) / 2,
    roundNum: config.height / 2,
    lineNum: config.height / 2,
  };
  if (config.mode === "hard") {
    params.roundNum = config.height;
    params.lineNum = config.height;
  } else if (config.mode === "easy") {
    params.roundNum = config.height / 4;
    params.lineNum = config.height / 4;
  }

  const chars = getRandomChars({
    length: config.length,
    noRepeat: config.noRepeat,
    source: config.source,
  });
  const { canvas, context } = getCanvas(config);
  context.fillStyle = "white";
  context.fillRect(0, 0, config.width, config.height);

  // Random fill noise
  for (let i = 0; i < params.noiseNum; i++) {
    context.fillStyle = getRandomNoiseColor();
    const { x, y } = getRandomPoint(config.width, config.height);
    context.fillRect(x, y, 1, 1);
  }

  // Draw random round shape
  for (let i = 0; i < params.roundNum; i++) {
    context.fillStyle = getRandomNoiseColor();
    context.beginPath();
    const { x, y } = getRandomPoint(config.width, config.height);
    context.arc(
      x,
      y,
      Math.floor((Math.random() * config.height) / 4),
      0,
      2 * Math.PI
    );
    context.fill();
    context.closePath();
  }

  // Draw verification code text
  const met = context.measureText(chars.join(""));
  let start =
    (config.width - met.width - (config.length - 1) * config.spacing) / 2;

  for (let i = 0; i < chars.length; i++) {
    const cmet = context.measureText(chars[i]);
    context.fillStyle = getRandomTextColor();
    const x = i === 0 ? start : start + config.spacing;
    const y = config.height / 2;
    start = x + cmet.width;
    context.fillText(chars[i], x, y);
    start = x + cmet.width;
  }

  // Draw random line segments
  for (let i = 0; i < params.lineNum; i++) {
    const from = getRandomPoint(config.width, config.height);
    const to = getRandomPoint(config.width, config.height);
    context.beginPath();
    context.strokeStyle = getRandomNoiseColor();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
    context.closePath();
  }

  return {
    chars,
    canvas,
    context,
    ...config,
  };
}

/**
 * Create a graphic verification code and return the result as a buffer
 * @param option CreateCaptchaOption
 * @returns
 */
export async function createCaptcha(option?: CreateCaptchaOption) {
  const result = createCaptchaCanvas(option);
  const type: ExportFormat = "png";
  const mime = "image/png";

  let buffer: ArrayBufferLike;
  if (result.useSkia) {
    buffer = await (result.canvas as SkiaCanvas).toBuffer(type);
  } else {
    buffer = (result.canvas as NodeCanvas).toBuffer(mime);
  }

  // const buffer = result.canvas.toBuffer(mime);
  return {
    buffer,
    type,
    mime,
    chars: result.chars,
    text: result.chars.join(""),
    width: result.width,
    height: result.height,
  };
}
