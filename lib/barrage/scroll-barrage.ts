import BaseBarrage, { BarrageType, BaseBarrageOptions } from './base-barrage.ts';
import BarrageRenderer from '../index.ts';

export type ScrollBarrageOptions = BaseBarrageOptions & {
  // 弹幕的类型
  barrageType: 'scroll';
}

/**
 * 用于描述滚动弹幕
 */
export default class ScrollBarrage extends BaseBarrage {
  readonly barrageType: BarrageType = 'scroll';
  // 用于描述滚动弹幕在播放进度为 0 时，滚动弹幕左侧距离 Canvas 左侧的距离
  originalLeft!: number;
  // 用于描述滚动弹幕在播放进度为 0 时，滚动弹幕右侧距离 Canvas 左侧的距离
  originalRight!: number;
  // 标识当前的滚动弹幕是否应该显示，当设置不允许遮挡的话，部分滚动弹幕会不显示
  show = true;
  // 当前弹幕会占据几个实际轨道
  grade!: number;

  constructor(scrollBarrageOptions: ScrollBarrageOptions, barrageRenderer: BarrageRenderer) {
    super(scrollBarrageOptions, barrageRenderer);

    this.calcOriginal();
  }

  /**
   * 计算原始的 left 和 right 位置
   */
  calcOriginal() {
    // 计算当播放时间为 0 时，弹幕左侧距离 Canvas 左侧的距离
    // 计算公式是：Canvas 元素的宽 + 弹幕出现时间 * 弹幕速度
    this.originalLeft = this.br.canvasSize.width + (this.time / 1000) * this.br.renderConfig.speed;
    this.originalRight = this.originalLeft + this.width;
  }
}
