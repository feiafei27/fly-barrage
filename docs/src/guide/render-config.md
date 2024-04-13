渲染配置用于控制全局的渲染效果。
# 涉及的 API
```ts
export type RendererOptions = {
  // 渲染相关配置
  renderConfig?: Partial<RenderConfig>;
}

export type RenderConfig = {
  // 自定义弹幕过滤器，返回 false，弹幕就会被过滤掉
  barrageFilter?: (barrage: BaseBarrage) => boolean;
  // 重要弹幕 边框 的自定义渲染函数
  priorBorderCustomRender?: RenderFn;

  // Canvas 元素默认和 container 等高，为了避免弹幕渲染遮挡住播放器的控制栏，
  // 可以设置减少一定的高度
  heightReduce: number;
  // 弹幕运行速度，仅对滚动弹幕有效（每秒多少像素）
  speed: number;
  // 显示区域，只针对滚动弹幕，有效值 0 ~ 1
  renderRegion: number;
  // 滚动弹幕水平最小间距
  minSpace: number;
  // 是否重叠，只适用于滚动弹幕
  avoidOverlap: boolean;

  // 透明度，有效值 0 ~ 1
  opacity: number;
  // 弹幕字体
  fontFamily: string;
  // 字体粗细
  fontWeight: string;
}

/**
 * 自定义 render 函数
 */
export type RenderFn = (options: CustomRenderOptions) => void;

/**
 * 自定义 render 函数的参数
 */
export type CustomRenderOptions = {
  // 渲染上下文
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  // 渲染的弹幕实例
  barrage: BaseBarrage;
  // 渲染器实例
  br: BarrageRenderer;
  // 缓存获取图片的工厂方法
  imageElementFactory: (url: string) => HTMLImageElement,
}

declare class BarrageRenderer {
  /**
   * 设置渲染配置（可以部分设置配置）
   * @param renderConfig 渲染配置
   */
  setRenderConfig(renderConfig: Partial<RenderConfig>): void;
}
```
# 具体作用
- barrageFilter：弹幕过滤器，可实现相关弹幕的屏蔽操作，例如不渲染滚动弹幕。
- priorBorderCustomRender：重要弹幕边框的自定义渲染函数，如果没有配置的话，默认会简单渲染一个 #89D5FF 颜色的矩形边框。
- speed：用于配置滚动弹幕的运动速度。
- renderRegion：用于配置滚动弹幕能够渲染多大比例的 canvas 区域，可借此实现半屏渲染或 1/4 屏的渲染滚动弹幕。
- minSpace：设置前后滚动弹幕的最小间距，避免挨得太近。
- avoidOverlap：当设置为 true 的时候，会使用虚拟轨道算法对滚动弹幕进行布局计算，防止滚动弹幕相互重叠。
- opacity：设置全局的渲染透明度，有的用户喜欢半透明的弹幕，可以借此进行实现。
- fontFamily：设置弹幕渲染时使用的字体。
- fontWeight：设置弹幕渲染时使用的字体粗细。