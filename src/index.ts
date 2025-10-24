import type { CaptchaOptions, CaptchaResult } from './types';
import { Generator } from './Generator';

// 导出核心类
export { Generator } from './Generator';
export { Renderer } from './Renderer';
export { Distortion } from './Distortion';

// 导出类型
export type * from './types';

/**
 * 创建验证码（工厂函数）
 *
 * @example
 * ```typescript
 * const result = await createCaptcha({
 *   width: 240,
 *   height: 80,
 *   length: 4,
 *   mode: 'normal'
 * });
 * ```
 */
export async function createCaptcha(
  options?: CaptchaOptions,
): Promise<CaptchaResult> {
  const generator = new Generator(options);
  return generator.generate();
}
