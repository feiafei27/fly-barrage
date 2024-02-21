/**
 * 生成随机整数
 * @param min 最小值
 * @param max 最大值
 */
export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}