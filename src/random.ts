import { DifficultyMode, Point } from './types';

/**
 * 生成 0 到 n 之间的随机整数（包含 0 和 n）
 */
function randomInt(n: number): number {
  return Math.floor(Math.random() * (n + 1));
}

/**
 * 生成指定数量的随机字符
 * 
 * @param length 字符数量
 * @param source 字符来源
 * @param noRepeat 是否不允许重复
 * @returns 字符数组
 */
export function getRandomChars(
  length: number,
  source: string,
  noRepeat: boolean,
): string[] {
  const chars = source.split('');
  const result: string[] = [];

  // Fisher-Yates 洗牌算法
  const shuffled = [...chars];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = randomInt(i);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // 选择字符
  for (let i = 0; i < length; i++) {
    if (noRepeat && i < shuffled.length) {
      result.push(shuffled[i]);
    } else {
      result.push(chars[randomInt(chars.length - 1)]);
    }
  }

  return result;
}

/**
 * 生成随机噪点颜色（高透明度，浅色）
 */
export function getRandomNoiseColor(): string {
  const r = randomInt(255);
  const g = randomInt(255);
  const b = randomInt(255);
  const a = Math.random() * 0.5; // 透明度 0-0.3
  return `rgba(${r},${g},${b},${a})`;
}

/**
 * 生成随机文字颜色（深色，高不透明度）
 */
export function getRandomTextColor(mode: DifficultyMode = 'normal'): string {
  // 深色范围 0-128
  const r = randomInt(128);
  const g = randomInt(128);
  const b = randomInt(128);

  // 根据难度调整透明度
  let minOpacity = 0.7;
  let maxOpacity = 0.9;

  if (mode === 'easy') {
    minOpacity = 0.8;
    maxOpacity = 1.0;
  } else if (mode === 'hard') {
    minOpacity = 0.6;
    maxOpacity = 0.8;
  }

  const a = minOpacity + Math.random() * (maxOpacity - minOpacity);
  return `rgba(${r},${g},${b},${a})`;
}

/**
 * 生成随机坐标点
 */
export function getRandomPoint(width: number, height: number): Point {
  return {
    x: randomInt(width - 1),
    y: randomInt(height - 1),
  };
}

/**
 * 生成随机半径（用于圆形干扰）
 */
export function getRandomRadius(maxHeight: number): number {
  return randomInt(Math.floor(maxHeight / 4));
}

