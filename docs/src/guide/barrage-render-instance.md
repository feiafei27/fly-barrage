# 创建弹幕渲染器实例
```ts
const barrageRenderer = new BarrageRenderer({
  // 容器 DOM
  container: 'container',
  // video 元素引用
  video: document.getElementById('video'),
  // 弹幕数据，也可后续设置
  barrages: [],
});
```
完整的参数如下所示：
```ts
/**
 * 弹幕渲染器 class 构造函数的参数
 */
export type RendererOptions = {
  // 容器 DOM
  container: string | HTMLElement;
  // video 元素（获取 video 元素，只是为了获取播放状态，不会对 video 执行其他操作）
  video: HTMLVideoElement;
  // 弹幕数据
  barrages?: BarrageOptions[];
  // 弹幕中渲染图片的配置
  barrageImages?: BarrageImage[];
  // 渲染相关配置
  renderConfig?: Partial<RenderConfig>;
  // 开发相关配置
  devConfig?: Partial<DevConfig>,
  // 一系列钩子函数
  // 每一帧渲染前的钩子函数
  beforeFrameRender?: FrameRenderHook;
  // 每一帧渲染后的钩子函数
  afterFrameRender?: FrameRenderHook;
  // 每个弹幕渲染前的钩子函数
  beforeBarrageRender?: BarrageRenderHook;
  // 每个弹幕渲染后的钩子函数
  afterBarrageRender?: BarrageRenderHook;

  // 蒙版数据
  mask?: string | ImageData;
}

// 弹幕的配置看下一小节

/**
 * 弹幕中渲染图片的配置
 */
export type BarrageImage = {
  // 弹幕图片的唯一标识
  id: string;
  // 图片的地址
  url: string;
  // 渲染时的宽
  width: number;
  // 渲染时的高
  height: number;
}

/**
 * 弹幕渲染器渲染弹幕的配置
 */
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
 * 开发相关配置
 */
export type DevConfig = {
  // 是否渲染 fps
  isRenderFPS: boolean;
  // 是否渲染弹幕边框
  isRenderBarrageBorder: boolean;
  // 是否打印关键数据
  isLogKeyData: boolean;
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

/**
 * 帧渲染钩子函数的类型
 */
export type FrameRenderHook = (data: {
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  br: BarrageRenderer,
}) => void;

/**
 * 弹幕渲染钩子函数的类型
 */
export type BarrageRenderHook = (data: {
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  br: BarrageRenderer,
  barrage: BaseBarrage,
}) => void;
```

# 弹幕渲染器提供的方法
## play(): void;
作用：执行弹幕的播放操作。

## pause(): void;
作用：暂停弹幕的播放。

## switch(isOpen: boolean): void;
作用：控制是否打开弹幕。

## setBarrages(barrageOptions: BarrageOptions[]): void;
作用：设置弹幕数据。

## send(barrage: BarrageOptions): void;
作用：发送弹幕。

## resize(): void;
作用：container 元素尺寸变更后，canvas 元素以及弹幕的渲染也需要随之进行改变。

## setRenderConfig(renderConfig: Partial\<RenderConfig\>): void;
作用：设置渲染配置。

## setDevConfig(devConfig: Partial\<DevConfig\>): void;
作用：设置开发配置。

## renderFrame(): void;
作用：触发一帧的渲染。

## setMask(mask?: string | ImageData): void;
作用：设置蒙版数据（图片的 url 或者 ImageData 数据）。