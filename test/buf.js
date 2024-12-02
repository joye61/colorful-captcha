const { createCaptchaAsBuffer } = require("../dist/index");
const path = require("path");
const fs = require("fs/promises");

(async () => {
  const file = path.resolve(__dirname, "./buf.png");
  const result = await createCaptchaAsBuffer();
  console.log(result);
  fs.writeFile(file, result.buffer);
})();
