import type { CanvasRenderingContext2D } from 'skia-canvas';
import type { DifficultyMode } from './types';

/**
 * 扭曲算法实现
 */
export class Distortion {
  private waveAmplitude: number;
  private waveFrequency: number;
  private verticalAmplitude: number;

  constructor(mode: DifficultyMode) {
    // 根据难度设置扭曲参数
    if (mode === 'easy') {
      this.waveAmplitude = 2;
      this.waveFrequency = 0.15;
      this.verticalAmplitude = 0.3;
    } else if (mode === 'normal') {
      this.waveAmplitude = 3;
      this.waveFrequency = 0.2;
      this.verticalAmplitude = 0.5;
    } else {
      this.waveAmplitude = 3;
      this.waveFrequency = 0.2;
      this.verticalAmplitude = 0.8;
    }
  }

  /**
   * 应用扭曲效果
   * 
   * 优化算法：双向波形扭曲 + 行级预计算 + 随机相位
   * - 水平扭曲：打破字符形态
   * - 垂直扰动：防止OCR列扫描识别
   * - 随机相位：消除固定倾斜方向
   */
  apply(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
  ): void {
    // 随机相位偏移
    const phaseX = Math.random() * Math.PI * 2;
    const phaseY = Math.random() * Math.PI * 2;

    // 获取原始图像数据
    const imageData = ctx.getImageData(0, 0, width, height);
    const originalData = new Uint8ClampedArray(imageData.data);
    const newImageData = ctx.createImageData(width, height);

    // 预计算每行的偏移量
    const rowOffsets = new Float32Array(height * 2);
    for (let y = 0; y < height; y++) {
      rowOffsets[y * 2] = Math.sin(y * this.waveFrequency + phaseX) * this.waveAmplitude;
      rowOffsets[y * 2 + 1] =
        Math.sin(y * this.waveFrequency * 1.5 + phaseY) * this.verticalAmplitude;
    }

    // 应用双向波形扭曲
    for (let y = 0; y < height; y++) {
      const offsetX = rowOffsets[y * 2];
      const offsetY = rowOffsets[y * 2 + 1];
      const srcY = Math.round(y + offsetY);

      if (srcY < 0 || srcY >= height) continue;

      for (let x = 0; x < width; x++) {
        const srcIdx = (y * width + x) * 4;

        if (originalData[srcIdx + 3] > 0) {
          const srcX = Math.round(x + offsetX);

          if (srcX >= 0 && srcX < width) {
            const newSrcIdx = (srcY * width + srcX) * 4;
            const destIdx = srcIdx;

            newImageData.data[destIdx] = originalData[newSrcIdx];
            newImageData.data[destIdx + 1] = originalData[newSrcIdx + 1];
            newImageData.data[destIdx + 2] = originalData[newSrcIdx + 2];
            newImageData.data[destIdx + 3] = originalData[newSrcIdx + 3];
          }
        }
      }
    }

    ctx.putImageData(newImageData, 0, 0);
  }
}
