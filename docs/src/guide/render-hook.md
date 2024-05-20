# 钩子函数
相关类型如下所示：
```ts
/**
 * 弹幕渲染器 class 构造函数的参数
 */
export type RendererOptions = {
  // 一系列钩子函数
  // 每一帧渲染前的钩子函数
  beforeFrameRender?: FrameRenderHook;
  // 每一帧渲染后的钩子函数
  afterFrameRender?: FrameRenderHook;
  // 每个弹幕渲染前的钩子函数
  beforeBarrageRender?: BarrageRenderHook;
  // 每个弹幕渲染后的钩子函数
  afterBarrageRender?: BarrageRenderHook;
}

/**
 * 帧渲染钩子函数的类型
 */
export type FrameRenderHook = (data: {
  // 渲染上下文
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  // 弹幕渲染器实例
  br: BarrageRenderer,
}) => void;

/**
 * 弹幕渲染钩子函数的类型
 */
export type BarrageRenderHook = (data: {
  // 渲染上下文
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  // 弹幕渲染器实例
  br: BarrageRenderer,
  // 当前渲染的弹幕实例
  barrage: BaseBarrage,
}) => void;
```
也可以直接通过弹幕渲染器实例进行设置
```ts
const barrageRenderer = new BarrageRenderer({
  // 容器 DOM
  container: 'container',
  // video 元素引用
  video: document.getElementById('video'),
  // 弹幕数据，也可后续设置
  barrages: [],
});
barrageRenderer.beforeFrameRender = () => {
  // do something
}
```