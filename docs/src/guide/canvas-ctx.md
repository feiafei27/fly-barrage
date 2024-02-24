可通过弹幕渲染器实例的 canvas 以及 ctx 属性获取 Canvas 元素引用以及渲染上下文。

类型定义如下所示：
```ts
/**
 * 弹幕渲染器
 */
declare class BarrageRenderer {
  // Canvas 元素
  canvas: HTMLCanvasElement;
  // Canvas 渲染上下文;
  ctx: CanvasRenderingContext2D;
}
```