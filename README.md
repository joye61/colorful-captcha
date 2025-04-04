# colorful-captcha

> Traditional graphic verification codes have been considered an unsafe protection method. Modern OCR or AI technology can easily crack various forms of graphic verification codes. This project is not responsible for the security risks brought by the verification code. Please use it with caution.

The verification code image is something looks like this：

<div>
  <img src="./test/file.png"/> &nbsp;&nbsp;
</div>
<br />

# Install

```bash
npm install colorful-captcha
```

## Usage

`createCaptcha` is the core API exported by `colorful-captch`. This is an asynchronous function with the following return value type：

```ts

// Function signature
createCaptcha(option?: CreateCaptchaOption): Promise<CreateCaptchaReturn>;

// Parameter type
interface CreateCaptchaOption{
  // Verification code width, the default is 240px
  width?: number;
  // Verification code height, the default is 80px
  height?: number;
  // Verification code difficulty, Valid values: "easy" | "normal" | "hard", the default is "normal"
  mode?: DifficultyMode;
  // Spacing between characters, the default is 5px
  spacing?: number;
  // The length of characters, the default is 4
  length?: number;
  // Whether characters are allowed to be repeated, the default is false
  noRepeat?: boolean;
  // Source of character extraction, excluding 0, o, l, I
  // Default: "123456789abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
  source?: string;
  // Whether to use skia-canvas to generate images, the default is node-canvas
  useSkia?: boolean;
}

// Return value type
interface CreateCaptchaReturn {
  // Buffer of verification code image data
  buffer: Buffer;
  // The type of the graphic verification code image, The value is always png.
  type: "png";
  // The text array of the verification code
  chars: string[];
  // The text string of the verification code
  text: string;
  // Width of the verification code image
  width: number;
  // height of the verification code image
  height: number;
  // Verification code image mime type, The value is always image/png
  mime: "image/png",
}
```

## Example:

```ts
import { createCaptcha } from "colorful-captcha";
import fs from "node:fs/promises";
import express from "express";

(async () => {
  // Create captcha as buffer, Same as the function call name
  const result = createCaptcha();
  // Create captcha as buffer, With custom parameters
  const result = createCaptcha({
    width: 120,
    height: 80,
    mode: "hard",
    ... // Other parameters of type CreateCaptchaOption
  });

  // Now you can save the buffer into file:
  fs.writeFile("output.png", result.buffer);

  // Or reponse the buffer via http to user's browser
  // Bellow is a example for express.js:
  const app = express();
  app.get("/", function (req, res) {
    res.type(result.type);
    res.send(result.buffer);
  });
})();
```

## Note

The default width and height of the generated graphic verification code image is `240*80`. You can customize the width and height through parameters, but if you set the value inappropriately, the text may be cropped. In this case, please try to change a more appropriate ratio yourself
