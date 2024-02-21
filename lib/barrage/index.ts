import BaseBarrage from './base-barrage';
import FixedBarrage, { FixedBarrageOptions } from './fixed-barrage';
import ScrollBarrage, { ScrollBarrageOptions } from './scroll-barrage';
import SeniorBarrage, { SeniorBarrageOptions } from './senior-barrage';

export {
  BaseBarrage,
  FixedBarrage,
  ScrollBarrage,
  SeniorBarrage,
}

/**
 * 面向用户的弹幕配置
 */
export type BarrageOptions = ScrollBarrageOptions | FixedBarrageOptions | SeniorBarrageOptions;

export * from './base-barrage';
export * from './fixed-barrage';
export * from './scroll-barrage';
export * from './senior-barrage';
