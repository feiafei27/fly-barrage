import BaseBarrage, { BarrageType, BaseBarrageOptions } from './base-barrage.ts';
import BarrageRenderer from '../index.ts';

export type FixedBarrageOptions = BaseBarrageOptions & {
  // 弹幕的类型
  barrageType: 'top' | 'bottom';
  // 固定弹幕能够存在的时间
  duration: number;
}

/**
 * 用于描述顶部弹幕、底部弹幕
 */
export default class FixedBarrage extends BaseBarrage {
  // 弹幕类型
  readonly barrageType: BarrageType;
  // 弹幕持续时间
  duration: number;
  // 弹幕结束时间
  endTime: number;

  constructor(fixedBarrageOptions: FixedBarrageOptions, barrageRenderer: BarrageRenderer) {
    super(fixedBarrageOptions, barrageRenderer);

    const { barrageType, duration} = fixedBarrageOptions;
    this.barrageType = barrageType;
    this.duration = duration;
    this.endTime = this.time + duration;

    this.calcFixedBarrageLeft();
  }

  /**
   * 计算固定弹幕的 left 属性
   */
  calcFixedBarrageLeft() {
    this.left = (this.br.canvasSize.width - this.width) / 2;
  }
}
