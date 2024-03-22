/**
 * 数字数字求和
 */
const sum = (nums: number[]) => {
  let res = 0;
  nums.forEach(num => res += num);
  return res;
}

/**
 * 求数字数组的众数，如果有多个众数的话，返回最小的
 */
const findMode = (arr: number[]): number | null => {
  if (arr.length === 0) {
    return null;
  }

  let counter = arr.reduce<{ [key: number]: number }>((acc, cur) => {
    return { ...acc, [cur]: (acc[cur] || 0) + 1 };
  }, {});

  let maxCount = 0;
  let mode = null;

  for (const key in counter) {
    if (counter[key] > maxCount) {
      maxCount = counter[key];
      mode = parseInt(key);
    }
  }

  return mode;
}

/**
 * 获取随机的整数
 */
const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default {
  sum,
  findMode,
  getRandomInt,
}