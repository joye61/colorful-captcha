// 预定义字符提取的源
const PreDefinedChars =
  "123456789abcdefghijklmnpqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ";

/**
 * 从源中随机生成指定个数的字符
 * @param num 字符的个数，默认为4
 * @param noRepeat 字符是否允许出现重复，默认不允许出现重复
 * @param chars 字符提取的源
 * @returns
 */
export function getRandomChars(
  num: number = 4,
  noRepeat = false,
  chars = PreDefinedChars
) {
  const list = chars.split("");
  const shuffle: Array<string> = [];
  for (let i = 0; i < chars.length; i++) {
    const outIndex = Math.floor(Math.random() * list.length);
    shuffle.push(list[outIndex]);
    list.splice(outIndex, 1);
  }

  const output: Array<string> = [];
  for (let i = 0; i < num; i++) {
    const outIndex = Math.floor(Math.random() * shuffle.length);
    output.push(shuffle[outIndex]);
    if (noRepeat) {
      shuffle.splice(outIndex, 1);
    }
  }

  return output;
}
