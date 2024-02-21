import BaseBarrage, { BarrageType, BaseBarrageOptions } from './base-barrage.ts';
import BarrageRenderer from '../index.ts';

export type SeniorBarrageOptions = BaseBarrageOptions & {
  // 弹幕的类型
  barrageType: 'senior';
  // 高级弹幕配置
  seniorBarrageConfig: SeniorBarrageConfig;
}

/**
 * 用于描述高级弹幕
 */
export default class SeniorBarrage extends BaseBarrage {
  readonly barrageType: BarrageType = 'senior';
  // 高级弹幕配置
  seniorBarrageConfig: SeniorBarrageConfig;

  // 用于描述高级弹幕在 x、y 轴上的运动速度
  vx!: number;
  vy!: number;

  // 实际的 起始点 和 结束点
  actualStartLocation!: Location;
  actualEndLocation!: Location;

  constructor(seniorBarrageOptions: SeniorBarrageOptions, barrageRenderer: BarrageRenderer) {
    super(seniorBarrageOptions, barrageRenderer);

    this.seniorBarrageConfig = seniorBarrageOptions.seniorBarrageConfig;

    this.calcActualLocation();
  }

  /**
   * 计算关键点的实际坐标
   */
  calcActualLocation() {
    const { startLocation, endLocation, motionDuration } = this.seniorBarrageConfig;

    // 计算实际起始点的位置
    // 计算 actualStartLocation
    let actualStartLocationX = (startLocation.type || 'PIXEL') === 'PIXEL' ? startLocation.x : startLocation.x * this.canvasSize.width;
    let actualStartLocationY = (startLocation.type || 'PIXEL') === 'PIXEL' ? startLocation.y : startLocation.y * this.canvasSize.height;
    if (startLocation.offsetX) actualStartLocationX += startLocation.offsetX;
    if (startLocation.offsetY) actualStartLocationY += startLocation.offsetY;
    this.actualStartLocation = {
      x: actualStartLocationX,
      y: actualStartLocationY
    };
    // 计算 actualEndLocation
    let actualEndLocationX = (endLocation.type || 'PIXEL') === 'PIXEL' ? endLocation.x : endLocation.x * this.canvasSize.width;
    let actualEndLocationY = (endLocation.type || 'PIXEL') === 'PIXEL' ? endLocation.y : endLocation.y * this.canvasSize.height;
    if (endLocation.offsetX) actualEndLocationX += endLocation.offsetX;
    if (endLocation.offsetY) actualEndLocationY += endLocation.offsetY;
    this.actualEndLocation = {
      x: actualEndLocationX,
      y: actualEndLocationY
    };

    // 根据实际起始点的位置，计算 vx 和 vy
    this.vx = (this.actualEndLocation.x - this.actualStartLocation.x) / motionDuration;
    this.vy = (this.actualEndLocation.y - this.actualStartLocation.y) / motionDuration;
  }

  get canvasSize() {
    return this.br.canvasSize;
  }
}

/**
 * 用于描述二位平面中的一点（单位 px）
 */
export type Location = {
  x: number;
  y: number;
}

/**
 * 用于描述二位平面中的一点（面向用户）
 */
export type LocationDefine = Location & {
  // 定义的类型：直接像素 或 canvas 百分比
  type?: 'PIXEL' | 'PERCENT';
  // 在 x、y 定义的基础上进行坐标偏移
  offsetX?: number;
  offsetY?: number;
}

/**
 * 用于描述高级弹幕的运动配置
 */
export type SeniorBarrageConfig = {
  // 起始点
  startLocation: LocationDefine;
  // 结束点
  endLocation: LocationDefine;
  // 生存时间（单位为毫秒）（数据要求：> 0）
  totalDuration: number;
  // 延迟时间（单位为毫秒）（数据要求：>= 0）
  delay: number;
  // 运动时长（单位为毫秒）（数据要求：>= 0）
  motionDuration: number;
}
