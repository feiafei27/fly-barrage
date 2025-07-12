import { BaseBarrage } from '../../lib';

/**
 * 封装垂直弹幕的渲染操作
 */
export default class VerticalBarrageRender {
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  barrage: BaseBarrage;

  barrageChars: BarrageChar[] = [];

  // 当前文字渲染的宽高
  width!: number;
  height!: number;

  constructor(
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    barrage: BaseBarrage,
  ) {
    this.ctx = ctx;
    this.barrage = barrage;

    this.initBarrage();
  }

  // 初始化弹幕
  initBarrage() {
    const { text, lineHeight, fontSize } = this.barrage;
    const chars = text.split('').filter(item => item);
    let maxWidth = 0;
    const singleTopOffset = ((lineHeight - 1) * fontSize) / 2;
    chars.forEach(char => {
      // 设置好文本状态后，进行文本的测量
      this.barrage.setCtxFont(this.ctx);
      const { width } = this.ctx.measureText(char);

      // 更新最大宽
      maxWidth = maxWidth >= width ? maxWidth : width;

      // 计算当前字符的 topOffset
      const topOffset = this.barrageChars.length * (fontSize * lineHeight) + singleTopOffset;
      // leftOffset 先算作 0
      const leftOffset = 0;

      this.barrageChars.push(new BarrageChar(char, width, fontSize, topOffset, leftOffset));
    });

    this.width = maxWidth;
    this.height = this.barrageChars.length * (fontSize * lineHeight);

    // 计算实际的 leftOffset
    this.barrageChars.forEach(barrageChar => {
      barrageChar.leftOffset = (this.width - barrageChar.width) / 2;
    })
  }

  // 渲染弹幕
  renderBarrage(left: number, top: number) {
    // 设置绘图上下文
    this.barrage.setCtxFont(this.ctx);
    this.ctx.fillStyle = this.barrage.color;

    this.barrageChars.forEach(barrageChar => {
      this.ctx.strokeText(barrageChar.char, left + barrageChar.leftOffset, top + barrageChar.topOffset);
      this.ctx.fillText(barrageChar.char, left + barrageChar.leftOffset, top + barrageChar.topOffset);

      // this.ctx.strokeStyle = '#89D5FF';
      // this.ctx.strokeRect(
      //   left + barrageChar.leftOffset,
      //   top + barrageChar.topOffset,
      //   barrageChar.width,
      //   barrageChar.height
      // );
    })

    // this.ctx.strokeRect(
    //   left - 3,
    //   top - 3,
    //   this.width + 6,
    //   this.height + 6,
    // );
  }
}

/**
 * 字母单个字符的封装
 */
class BarrageChar {
  char: string;

  width: number;
  height: number;

  // 当前字符实际渲染时，和整体文字左上角的偏移量
  topOffset: number;
  leftOffset: number;

  constructor(char: string, width: number, height: number, topOffset: number, leftOffset: number) {
    this.char = char;
    this.width = width;
    this.height = height;
    this.topOffset = topOffset;
    this.leftOffset = leftOffset;
  }
}

/**
 * VerticalBarrageRender 缓存器
 */
export class VerticalBarrageRenderCache {
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

  map = new Map<string, VerticalBarrageRender>();

  constructor(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  getInstance(barrage: BaseBarrage) {
    if (this.map.has(barrage.id)) return this.map.get(barrage.id);

    const instance = new VerticalBarrageRender(this.ctx, barrage);
    this.map.set(barrage.id, instance);
    return instance;
  }
}

