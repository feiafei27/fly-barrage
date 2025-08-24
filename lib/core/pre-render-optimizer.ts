import BarrageRenderer from '../index.ts';
import {BaseBarrage} from '../barrage/index';
import Utils from "../utils";

/**
 * 预渲染优化器
 * 用于生成并缓存弹幕的 ImageBitmap，弹幕只需要在 Canvas 中渲染一次，以此保证性能
 */
export default class PreRenderOptimizer {
  br: BarrageRenderer;
  imageBitmapCache = new Map<string, ImageBitmap>();

  constructor(br: BarrageRenderer) {
    this.br = br;
  }

  /**
   * 获取渲染弹幕对应的 ImageBitmap。
   * 因为 createImageBitmap 是一个异步操作，所以当缓存中有的话，返回 ImageBitmap，
   * 缓存中没有的话，直接返回 undefined。
   * @param barrage 需要渲染的弹幕
   */
  getImageBitmap(barrage: BaseBarrage): ImageBitmap | undefined {
    // 如果缓存中有 ImageBitmap 的话，直接获取返回即可
    if (this.imageBitmapCache.has(barrage.id)) {
      return this.imageBitmapCache.get(barrage.id);
    }

    // 进行弹幕的绘制
    const { width, height } = this.preRenderCanvas;
    this.preRenderCanvasCtx.clearRect(0, 0, width, height);

    barrage.setCtxFont(this.preRenderCanvasCtx);

    barrage.sections.forEach(section => {
      if (section.sectionType === 'text') {
        // 描边可见的时候，才执行这一句
        if (
          Utils.Color.isVisibleColor(this.br.renderConfig.strokeStyle) &&
          this.br.renderConfig.lineWidth > 0
        ) {
          this.preRenderCanvasCtx.strokeText(section.text, section.leftOffset, section.topOffset);
        }
        this.preRenderCanvasCtx.fillText(section.text, section.leftOffset, section.topOffset);
      } else if (section.sectionType === 'image') {
        this.preRenderCanvasCtx.drawImage(
          Utils.Cache.imageElementFactory(section.url),
          section.leftOffset,
          section.topOffset,
          section.width,
          section.height,
        )
      }
    })

    // 获取弹幕的 ImageBitmap
    createImageBitmap(
      this.preRenderCanvas,
      0,
      0,
      barrage.width * this.dpr,
      barrage.height * this.dpr,
    ).then(imageBitmap => {
      // 拿到 imageBitmap 数据后，缓存到 map 中
      this.imageBitmapCache.set(barrage.id, imageBitmap)
    });

    return undefined;
  }

  /**
   * 为了避免 ImageBitmap 占用太多的内存，需要在切换渲染弹幕集的时候，进行 ImageBitmap 的清空
   */
  clear() {
    this.imageBitmapCache.clear();
  }

  get preRenderCanvas() {
    return this.br.preRenderCanvas;
  }

  get preRenderCanvasCtx() {
    return this.br.preRenderCanvasCtx;
  }

  get dpr() {
    return this.br.dpr;
  }
}

