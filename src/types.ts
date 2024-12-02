export interface GetRandomCharsOption {
  // The number of characters, the default is 4
  length: number;
  // Whether characters are allowed to be repeated
  noRepeat: boolean;
  // Source of character extraction
  source: string;
}

export type DifficultyMode = "easy" | "normal" | "hard";

export interface CreateCaptchaOption extends Partial<GetRandomCharsOption> {
  // Verification code width
  width?: number;
  // Verification code height
  height?: number;
  // Verification code difficulty
  mode?: DifficultyMode;
  // Spacing between characters
  spacing?: number;
}

export interface DifficultyParams {
  // Noise number
  noiseNum: number;
  // Round number
  roundNum: number;
  // Line number
  lineNum: number;
}

export interface Point {
  x: number;
  y: number;
}
