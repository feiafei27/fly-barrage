# 字体描边及阴影相关类型
```ts
// 字体描边相关
export type FontStroke = {
    // 描边颜色
    strokeStyle: string;
    // 描边宽度
    lineWidth: number;
    // 线条端点样式
    lineCap: CanvasLineCap;
    // 线条连接样式
    lineJoin: CanvasLineJoin;
    // 控制锐角处斜接角的最大长度
    miterLimit: number;
}

// 字体描边的默认值
export const DEFAULT_FONT_STROKE: FontStroke = {
    strokeStyle: 'rgba(0, 0, 0, 0)',
    lineWidth: 1,
    lineCap: 'butt',
    lineJoin: 'miter',
    miterLimit: 10,
}

// 字体阴影相关
export type FontShadow = {
    // 阴影颜色
    shadowColor: string;
    // 阴影模糊半径
    shadowBlur: number;
    // 阴影在 X 轴的偏移量
    shadowOffsetX: number;
    // 阴影在 Y 轴的偏移量
    shadowOffsetY: number;
}

// 字体阴影的默认值
export const DEFAULT_FONT_SHADOW: FontShadow = {
    shadowColor: 'rgba(0, 0, 0, 0)',
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
}

export type FontStrokeAndShadow = FontStroke & FontShadow;

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
} & FontStrokeAndShadow;
```

# 具体用法
::: tip
可以直接看项目中的完整 DEMO，已经实现了字体描边和字体阴影功能。
:::
字体描边和字体阴影的配置是在 RenderConfig 中的，所以可以在 new BarrageRenderer 实例的
时候，传递字体描边和字体阴影相关的属性，或者可以通过 BarrageRenderer 实例的 setRenderConfig
方法变更新的字体描边或者字体阴影。