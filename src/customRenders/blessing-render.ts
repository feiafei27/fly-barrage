import { VerticalBarrageRenderCache } from '../models/vertical-barrage-render';
import { RenderFn } from '../../lib';

// 实例缓存器
export let verticalBarrageRenderCache: VerticalBarrageRenderCache;

// 自定义渲染函数
export const blessingRenderFn: RenderFn = ({ ctx, barrage, imageElementFactory }) => {
  if (!verticalBarrageRenderCache) {
    verticalBarrageRenderCache = new VerticalBarrageRenderCache(ctx);
  }

  // 渲染上方的图片
  if (barrage.addition) {
    ctx.drawImage(
      imageElementFactory(barrage.addition.lanternUrl),
      barrage.left,
      barrage.top,
      barrage.addition.lanternWidth,
      barrage.addition.lanternHeight,
    )
  }

  // 渲染垂直文字
  if (barrage.text && barrage.addition) {
    const instance = verticalBarrageRenderCache.getInstance(barrage);
    if (instance) {
      instance.renderBarrage(
        barrage.left + (barrage.addition.lanternWidth - instance.width) / 2,
        barrage.top + barrage.addition.lanternHeight
      );
    }
  }
}