import { Canvas, FontLibrary } from "skia-canvas";
import type { CanvasRenderingContext2D } from "skia-canvas";
import path from "path";
import { getRandomChars } from "./random";
import type {
  CaptchaOptions,
  CaptchaConfig,
  CaptchaResult,
  DifficultyParams,
  ImageFormat,
} from "./types";
import { Renderer } from "./Renderer";
import { Distortion } from "./Distortion";

/**
 * 验证码生成器
 *
 * @example
 * ```typescript
 * const generator = new CaptchaGenerator({
 *   width: 240,
 *   height: 80,
 *   length: 4,
 *   mode: 'normal',
 *   format: 'png'
 * });
 *
 * const result = await generator.generate();
 * console.log(result.text); // 验证码文本
 * ```
 */
export class Generator {
  private config: CaptchaConfig;
  private renderer: Renderer;
  private distortionEngine: Distortion;

  // 字体配置（静态）
  private static readonly FONT_PATH = "../Alibaba-PuHuiTi-Heavy.ttf";
  private static readonly FONT_FAMILY = "Alibaba PuHuiTi Heavy";

  // 默认字符（移除易混淆字符：l, 1, I, o, O, 0）
  private static readonly DEFAULT_CHARS =
    "23456789abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";

  // 字体加载状态缓存（确保只加载一次）
  private static fontLoaded = false;

  // 图片格式与 MIME 类型映射
  private static readonly FORMAT_MIME_MAP: Record<ImageFormat, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
  };

  constructor(options?: CaptchaOptions) {
    this.config = this.normalizeConfig(options);
    this.renderer = new Renderer(this.config);
    this.distortionEngine = new Distortion(this.config.mode);

    // 确保字体已加载（只会加载一次）
    this.loadFont();
  }

  /**
   * 加载字体文件（带缓存，只加载一次）
   */
  private loadFont(): void {
    if (Generator.fontLoaded) {
      return;
    }

    try {
      const resolvedPath = path.resolve(__dirname, Generator.FONT_PATH);
      FontLibrary.use(Generator.FONT_FAMILY, [resolvedPath]);
      Generator.fontLoaded = true;
    } catch (error: any) {
      throw new Error(
        `Failed to load font file "${Generator.FONT_PATH}": ${error.message}`
      );
    }
  }

  /**
   * 创建画布并初始化绘图上下文
   */
  private createCanvas(): {
    canvas: Canvas;
    ctx: CanvasRenderingContext2D;
  } {
    const canvas = new Canvas(this.config.width, this.config.height);
    const ctx = canvas.getContext("2d");

    // 计算字体大小：高度的 80%
    const fontSize = Math.floor(this.config.height * 0.8);

    // 设置字体
    ctx.font = `${fontSize}px "${Generator.FONT_FAMILY}"`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";

    return { canvas, ctx };
  }

  /**
   * 解析并标准化配置
   */
  private normalizeConfig(options?: CaptchaOptions): CaptchaConfig {
    return {
      width: options?.width ?? 240,
      height: options?.height ?? 80,
      length: options?.length ?? 4,
      noRepeat: options?.noRepeat ?? true,
      source: options?.source ?? Generator.DEFAULT_CHARS,
      mode: options?.mode ?? "normal",
      spacing: options?.spacing ?? 5,
      format: options?.format ?? "png",
    };
  }

  /**
   * 根据难度计算干扰参数
   */
  private getDifficultyParams(): DifficultyParams {
    const area = this.config.width * this.config.height;

    let noiseCount = area / 4.5;
    let circleCount = this.config.height / 3;
    let lineCount = this.config.height;

    if (this.config.mode === "easy") {
      noiseCount = area / 5.5;
      circleCount = this.config.height / 4;
      lineCount = Math.floor(this.config.height * 0.72);
    } else if (this.config.mode === "normal") {
      noiseCount = area / 4.5;
      lineCount = Math.floor(this.config.height * 1.35);
    } else if (this.config.mode === "hard") {
      noiseCount = area / 3.3;
      circleCount = this.config.height / 2;
      lineCount = Math.floor(this.config.height * 2.0);
    }

    return {
      noiseCount: Math.floor(noiseCount),
      circleCount: Math.floor(circleCount),
      lineCount: Math.floor(lineCount),
    };
  }

  /**
   * 生成验证码
   */
  async generate(): Promise<CaptchaResult> {
    // 计算难度参数
    const params = this.getDifficultyParams();

    // 生成随机字符
    const chars = getRandomChars(
      this.config.length,
      this.config.source,
      this.config.noRepeat
    );

    // 创建画布
    const { canvas, ctx } = this.createCanvas();

    // 绘制背景
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, this.config.width, this.config.height);

    // 绘制干扰元素和文字
    this.renderer.drawNoise(ctx, params.noiseCount);
    this.renderer.drawCircles(ctx, params.circleCount);
    this.renderer.drawText(ctx, chars, this.distortionEngine);
    this.renderer.drawLines(ctx, params.lineCount);

    // 生成图片
    const buffer = await canvas.toBuffer(this.config.format);

    return {
      buffer,
      text: chars.join(""),
      mime: Generator.FORMAT_MIME_MAP[this.config.format],
      width: this.config.width,
      height: this.config.height,
    };
  }
}
