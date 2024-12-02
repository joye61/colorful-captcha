const { createCaptchaAsFile } = require("../dist/index");
const path = require("path");

(async () => {
  const file = path.resolve(__dirname, "./file.png");
  const result = await createCaptchaAsFile(file);
  console.log(result);
})();
