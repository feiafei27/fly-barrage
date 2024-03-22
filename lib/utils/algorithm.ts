import { BaseBarrage } from '../barrage'

/**
 * 按照二分查找法进行弹幕的插入，保持 time 的排序
 * @param barrages 弹幕数组
 * @param barrage 需要插入的弹幕
 */
const insertBarrageByTime = (barrages: BaseBarrage[], barrage: BaseBarrage) => {
  let left = 0;
  let right = barrages.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (barrages[mid].time < barrage.time) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  barrages.splice(left, 0, barrage);
}

export default {
  insertBarrageByTime,
}