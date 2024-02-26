开发配置用于辅助开发，查看关键信息。
# 涉及的 API
```ts
export type RendererOptions = {
  // 开发相关配置
  devConfig?: Partial<DevConfig>,
}

export type DevConfig = {
  // 是否渲染 fps
  isRenderFPS: boolean;
  // 是否渲染弹幕边框
  isRenderBarrageBorder: boolean;
  // 是否打印关键数据
  isLogKeyData: boolean;
}

declare class BarrageRenderer {
  /**
   * 设置开发配置（可以部分设置配置）
   * @param devConfig 开发配置
   */
  setDevConfig(devConfig: Partial<DevConfig>): void;
}
```
# 具体作用
- isRenderFPS：当设置为 true 时，会在左上角绘制渲染的帧率。
- isRenderBarrageBorder：当设置为 true 时，会在弹幕的外围渲染一个边框，用于辅助确认弹幕的渲染区域。
- isLogKeyData：当设置为 true 时，会打印一些关键信息，例如：实际轨道和虚拟轨道的高度和数量。