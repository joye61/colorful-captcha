import { DifficultyMode, GetRandomCharsOption, Point } from "./types";

// Source for predefined character extraction, excluding 0, o, l, I
export const PreDefinedChars =
  "123456789abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";

/**
 * Get a random integer value, including 0 and the value itself
 * @param n
 * @returns
 */
export function getRandomValue(n: number) {
  return Math.floor(Math.random() * (n + 1));
}

/**
 * Generates a specified number of random characters from a source
 * @param option GetRandomCharsOption
 * @returns string[] char array contains all random values
 */
export function getRandomChars(option: GetRandomCharsOption) {
  const list = option.source.split("");
  const shuffle: Array<string> = [];
  for (let i = 0; i < option.source.length; i++) {
    const outIndex = getRandomValue(list.length - 1);
    shuffle.push(list[outIndex]);
    list.splice(outIndex, 1);
  }

  const output: Array<string> = [];
  for (let i = 0; i < option.length; i++) {
    const outIndex = getRandomValue(shuffle.length - 1);
    output.push(shuffle[outIndex]);
    if (option.noRepeat) {
      shuffle.splice(outIndex, 1);
    }
  }
  return output;
}

/**
 * Get a random color for confusion
 */
export function getRandomNoiseColor() {
  const values: number[] = [];
  for (let i = 0; i < 3; i++) {
    values.push(getRandomValue(255));
  }
  return `rgba(${values.join(",")},${Math.random()})`;
}

/**
 * Get a random text color.
 * The text color should be darker than the obfuscation color
 * @returns
 */
export function getRandomTextColor(mode: DifficultyMode = "normal") {
  const values: number[] = [];
  for (let i = 0; i < 3; i++) {
    values.push(getRandomValue(128));
  }
  let modeValue = 0.6;
  if (mode === "hard") {
    modeValue = 0.5;
  } else if (mode === "easy") {
    modeValue = 0.7;
  }
  const opacity = modeValue + Math.random() * (1 - modeValue);
  return `rgba(${values.join(",")}, ${opacity})`;
}

/**
 * Get a random point in the coordinate system
 * @param width
 * @param height
 * @returns
 */
export function getRandomPoint(width: number, height: number): Point {
  return { x: getRandomValue(width), y: getRandomValue(height) };
}
