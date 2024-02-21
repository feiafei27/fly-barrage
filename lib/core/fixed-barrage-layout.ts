import BarrageRenderer from '../index.ts';
import { FixedBarrage } from '../barrage';
import Utils from '../utils';

/**
 * 用于处理顶部弹幕和底部弹幕的布局问题
 */
export default class FixedBarrageLayout {
  br: BarrageRenderer;

  // 用于维护当前渲染的顶部弹幕（从上往下排序）
  topRenderBarrages: FixedBarrage[] = [];

  // 用于维护当前渲染的底部弹幕（从下往上排序）
  bottomRenderBarrages: FixedBarrage[] = [];

  constructor(br: BarrageRenderer) {
    this.br = br;
  }

  /**
   * 获取当前应该渲染的固定弹幕
   * @param allFixedBarrages 所有的固定弹幕数组
   * @param time 视频播放的时间点
   */
  getRenderFixedBarrages(allFixedBarrages: FixedBarrage[], time: number): FixedBarrage[] {
    // 1：能够渲染的顶部弹幕和底部弹幕
    const nextTopRenderBarrages = allFixedBarrages
      .filter(barrage => barrage.barrageType === 'top' && time >= barrage.time && time <= barrage.endTime);
    const nextBottomRenderBarrages = allFixedBarrages
      .filter(barrage => barrage.barrageType === 'bottom' && time >= barrage.time && time <= barrage.endTime);

    // 2：移除接下来不用渲染的弹幕
    this.topRenderBarrages = this.topRenderBarrages
      .filter(barrage => nextTopRenderBarrages.includes(barrage));
    this.bottomRenderBarrages = this.bottomRenderBarrages
      .filter(barrage => nextBottomRenderBarrages.includes(barrage));

    // 3：获取新增的需要渲染的弹幕，之前已经渲染的不用处理，因为之前已经计算过 top 属性了
    const newTopRenderBarrages = nextTopRenderBarrages
      .filter(barrage => !this.topRenderBarrages.includes(barrage));
    const newBottomRenderBarrages = nextBottomRenderBarrages
      .filter(barrage => !this.bottomRenderBarrages.includes(barrage));

    // 4：遍历新增的弹幕，看能不能插入，能插入的话，计算 top
    newTopRenderBarrages.forEach(newTopBarrage => {
      this.insertFixedBarrage(newTopBarrage);
    });
    newBottomRenderBarrages.forEach(newBottomBarrage => {
      this.insertFixedBarrage(newBottomBarrage);
    });

    return [...this.topRenderBarrages, ...this.bottomRenderBarrages];
  }

  /**
   * 发送新的弹幕
   * @param barrage 弹幕实例
   */
  send(barrage: FixedBarrage) {
    this.insertFixedBarrage(barrage);
  }

  /**
   * 封装通用的工具方法
   * @param barrage 弹幕实例
   */
  insertFixedBarrage(barrage: FixedBarrage) {
    // 标识 barrage 是否插入成功
    let inserted = false;
    if (barrage.barrageType === 'top') {
      // 如果当前没有渲染的顶部弹幕的话，判断 topRange 能不能插进去
      if (this.topRenderBarrages.length === 0) {
        if (this.topRangeLength >= barrage.height) {
          barrage.top = this.topRange[0];
          this.topRenderBarrages.push(barrage);
          inserted = true;
        }
      } else {
        // 判断顶部弹幕的间隙能不能插入，遍历存在的顶部弹幕
        for (let i = 0; i < this.topRenderBarrages.length; i++) {
          const currentTopBarrage = this.topRenderBarrages[i];
          // 如果当前是第一个的话，判断第一个上面能否插入
          if (i === 0) {
            if (currentTopBarrage.top - this.topRange[0] >= barrage.height) {
              barrage.top = this.topRange[0];
              this.topRenderBarrages.unshift(barrage);
              inserted = true;
              break;
            }
          }
          // 判断下面能不能插入
          // 先计算下面间隙的高度
          const belowGapHeight = (i === this.topRenderBarrages.length - 1)
            ? (this.topRange[1] - currentTopBarrage.top - currentTopBarrage.height)
            : (this.topRenderBarrages[i + 1].top - currentTopBarrage.top - currentTopBarrage.height);
          if (belowGapHeight >= barrage.height) {
            barrage.top = currentTopBarrage.top + currentTopBarrage.height;
            this.topRenderBarrages.splice(i + 1, 0, barrage);
            inserted = true;
            break;
          }
        }
      }
    } else {
      // 如果当前没有渲染的底部弹幕的话，判断 bottomRange 能不能插进去
      if (this.bottomRenderBarrages.length === 0) {
        if (this.bottomRangeLength >= barrage.height) {
          barrage.top = this.bottomRange[0] - barrage.height;
          this.bottomRenderBarrages.push(barrage);
          inserted = true;
        }
      } else {
        // 判断底部弹幕的间隙能不能插入，遍历存在的底部弹幕
        for (let i = 0; i < this.bottomRenderBarrages.length; i++) {
          const currentBottomBarrage = this.bottomRenderBarrages[i];
          // 如果当前是第一个的话，判断第一个下面能否插入
          if (i === 0) {
            if (this.bottomRange[0] - currentBottomBarrage.top - currentBottomBarrage.height >= barrage.height) {
              barrage.top = this.bottomRange[0] - barrage.height;
              this.bottomRenderBarrages.unshift(barrage);
              inserted = true;
              break;
            }
          }
          // 判断上面能不能插入
          // 先计算上面间隙的高度
          const aboveGapHeight = (i === this.bottomRenderBarrages.length - 1)
            ? (currentBottomBarrage.top - this.bottomRange[1])
            : (currentBottomBarrage.top - this.bottomRenderBarrages[i + 1].top - this.bottomRenderBarrages[i + 1].height);
          if (aboveGapHeight >= barrage.height) {
            barrage.top = currentBottomBarrage.top - barrage.height;
            this.bottomRenderBarrages.splice(i + 1, 0, barrage);
            inserted = true;
            break;
          }
        }
      }
    }
    // 如果是重要弹幕，但却没有插入成功的话，进行特殊处理
    if (barrage.prior && !inserted) {
      if (barrage.barrageType === 'top') {
        barrage.top = Utils.Math.getRandomInt(this.topRange[0], this.topRange[1] - barrage.height);
        this.topRenderBarrages.push(barrage);
        this.topRenderBarrages.sort((a, b) => a.top - b.top);
      } else {
        barrage.top = Utils.Math.getRandomInt(this.bottomRange[1], this.bottomRange[0] - barrage.height);
        this.bottomRenderBarrages.push(barrage);
        this.bottomRenderBarrages.sort((a, b) => b.top - a.top);
      }
    }
  }

  /**
   * 清空缓存数组
   */
  clearStoredBarrage() {
    this.topRenderBarrages = [];
    this.bottomRenderBarrages = [];
  }

  /**
   * 一半的 Canvas 高度，top 弹幕只能在 halfCanvasHeight 的上面，bottom 弹幕只能在 halfCanvasHeight 的下面
   */
  get middleHeightPoint() {
    return this.br.canvasSize.height / 2
  }

  /**
   * 顶部弹幕 y 轴方向的范围
   */
  get topRange() {
    return [0, this.middleHeightPoint];
  }

  /**
   * topRange 的长度
   */
  get topRangeLength() {
    return this.topRange[1] - this.topRange[0];
  }

  /**
   * 底部弹幕 y 轴方向的范围
   */
  get bottomRange() {
    return [this.br.canvasSize.height, this.middleHeightPoint];
  }

  /**
   * bottomRange 的长度
   */
  get bottomRangeLength() {
    return this.bottomRange[0] - this.bottomRange[1];
  }
}
