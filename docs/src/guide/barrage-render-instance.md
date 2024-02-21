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
}

/**
 * 弹幕渲染器渲染弹幕的配置
 */
export type RenderConfig = {
  // 自定义弹幕过滤器，返回 false，弹幕就会被过滤掉
  barrageFilter?: (barrage: BaseBarrage) => boolean;

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

// 弹幕的配置看下一小节
```

# 弹幕渲染器提供的方法
## play()
作用：执行弹幕的播放操作。

## pause()
作用：暂停弹幕的播放。

## switch(isOpen: boolean)
作用：控制是否打开弹幕。

## setBarrages(barrages?: BarrageOptions[])
作用：设置弹幕数据。

## send(barrage: BarrageOptions)
作用：发送弹幕。

## resize()
作用：container 元素尺寸变更后，canvas 元素以及弹幕的渲染也需要随之进行改变。

## setRenderConfig(renderConfig: Partial\<RenderConfig\>)
作用：设置渲染配置。

## setDevConfig(devConfig: Partial\<DevConfig\>)
作用：设置开发配置。

## renderFrame()
作用：触发一帧的渲染
