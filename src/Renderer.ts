import { Canvas } from 'skia-canvas';
import type { CanvasRenderingContext2D } from 'skia-canvas';
import {
  getRandomNoiseColor,
  getRandomTextColor,
  getRandomPoint,
  getRandomRadius,
} from './random';
import type { CaptchaConfig } from './types';
import type { Distortion } from './Distortion';

/**
 * 渲染器类
 * 
 * 职责：
 * - 绘制噪点、圆形、线条等干扰元素
 * - 绘制验证码文字
 */
export class Renderer {
  constructor(private config: CaptchaConfig) {}

  /**
   * 绘制噪点（批量绘制优化）
   */
  drawNoise(ctx: CanvasRenderingContext2D, count: number): void {
    const { width, height } = this.config;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      const idx = (y * width + x) * 4;

      const gray = Math.floor(Math.random() * 128) + 64;
      data[idx] = gray;
      data[idx + 1] = gray;
      data[idx + 2] = gray;
      data[idx + 3] = Math.floor(Math.random() * 128) + 32;
    }

    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * 绘制圆形干扰
   */
  drawCircles(ctx: CanvasRenderingContext2D, count: number): void {
    const { width, height } = this.config;
    
    for (let i = 0; i < count; i++) {
      const { x, y } = getRandomPoint(width, height);
      const radius = getRandomRadius(height);

      ctx.fillStyle = getRandomNoiseColor();
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  /**
   * 绘制验证码文字
   */
  drawText(
    ctx: CanvasRenderingContext2D,
    chars: string[],
    distortion: Distortion,
  ): void {
    // 测量所有字符宽度
    const charWidths = chars.map((char) => ctx.measureText(char).width);
    const totalWidth =
      charWidths.reduce((sum, w) => sum + w, 0) +
      (chars.length - 1) * this.config.spacing;

    // 计算起始 x 坐标（水平居中）
    let x = (this.config.width - totalWidth) / 2;
    const y = this.config.height / 2;

    // 为每个字符单独绘制并应用变换
    for (let i = 0; i < chars.length; i++) {
      const charWidth = Math.ceil(charWidths[i] + 10);
      const charHeight = Math.ceil(this.config.height * 0.8);

      // 创建临时画布绘制单个字符
      const tempCanvas = new Canvas(charWidth, charHeight);
      const tempCtx = tempCanvas.getContext('2d');

      // 复制字体设置
      tempCtx.font = ctx.font;
      tempCtx.textAlign = 'center';
      tempCtx.textBaseline = 'middle';
      tempCtx.fillStyle = getRandomTextColor(this.config.mode);

      // 在临时画布中心绘制字符
      tempCtx.fillText(chars[i], charWidth / 2, charHeight / 2);

      // 应用扭曲效果
      distortion.apply(tempCtx, charWidth, charHeight);

      // 保存主画布状态
      ctx.save();

      // 随机旋转角度
      const rotateAngle = (Math.random() - 0.5) * 30 * (Math.PI / 180);

      // 随机垂直偏移
      const offsetY = (Math.random() - 0.5) * (this.config.height * 0.1);

      // 移动、旋转
      ctx.translate(x + charWidths[i] / 2, y + offsetY);
      ctx.rotate(rotateAngle);

      // 将变换后的字符绘制到主画布
      ctx.drawImage(tempCanvas, -charWidth / 2, -charHeight / 2);

      // 恢复状态
      ctx.restore();

      x += charWidths[i] + this.config.spacing;
    }
  }

  /**
   * 绘制线条干扰
   */
  drawLines(ctx: CanvasRenderingContext2D, count: number): void {
    const { width, height } = this.config;
    
    for (let i = 0; i < count; i++) {
      const from = getRandomPoint(width, height);
      const to = getRandomPoint(width, height);

      ctx.strokeStyle = getRandomNoiseColor();
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    }
  }
}
