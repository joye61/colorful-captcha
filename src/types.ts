/**
 * 验证码难度模式
 */
export type DifficultyMode = 'easy' | 'normal' | 'hard';

/**
 * 支持的图片格式（skia-canvas toBuffer 支持的图片格式）
 */
export type ImageFormat = 'png' | 'jpg' | 'jpeg' | 'webp';

/**
 * 验证码配置选项
 */
export interface CaptchaOptions {
  /** 验证码宽度（默认：240） */
  width?: number;
  /** 验证码高度（默认：80） */
  height?: number;
  /** 验证码字符数量（默认：4） */
  length?: number;
  /** 字符是否允许重复（默认：false） */
  noRepeat?: boolean;
  /** 字符来源（默认：预定义字符集） */
  source?: string;
  /** 难度模式（默认：normal） */
  mode?: DifficultyMode;
  /** 字符间距（默认：5） */
  spacing?: number;
  /** 图片格式（默认：png） */
  format?: ImageFormat;
}

/**
 * 验证码完整配置（所有字段必填）
 */
export interface CaptchaConfig {
  width: number;
  height: number;
  length: number;
  noRepeat: boolean;
  source: string;
  mode: DifficultyMode;
  spacing: number;
  format: ImageFormat;
}

/**
 * 难度参数
 */
export interface DifficultyParams {
  /** 噪点数量 */
  noiseCount: number;
  /** 圆形干扰数量 */
  circleCount: number;
  /** 线条干扰数量 */
  lineCount: number;
}

/**
 * 验证码生成结果
 */
export interface CaptchaResult {
  /** 图片 Buffer */
  buffer: Buffer;
  /** 验证码文本 */
  text: string;
  /** 图片 MIME 类型 */
  mime: string;
  /** 图片宽度 */
  width: number;
  /** 图片高度 */
  height: number;
}

/**
 * 坐标点
 */
export interface Point {
  x: number;
  y: number;
}

