/**
 * 获取当前设备的 dpr
 */
function getDevicePixelRatio() {
  // 先创建一个 canvas 元素
  let canvas = document.createElement('canvas') as HTMLCanvasElement;
  // 获取绘图环境
  let context = canvas.getContext('2d') as any;
  // 匿名函数自调用，计算获取当前环境的像素比例
  let _pixelRatio = (function () {
    // 获取当前环境（例如 window）的设备像素比，获取不到的话，就取 1
    let devicePixelRatio = window.devicePixelRatio || 1;
    // backingStorePixelRatio 属性：该属性决定了浏览器在渲染 canvas 以前会用几个像素来存储画布信息
    // 这个属性在 safari6.0 中是 2，在其他浏览器中都是 1
    let backingStoreRatio =
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio ||
      1;
    // 这样计算应该是为了额外处理 safari6.0 的情况，因为其他浏览器该属性都是 1
    return devicePixelRatio / backingStoreRatio;
  })();
  // 释放刚刚创建的 canvas 元素
  canvas.width = canvas.height = 0;
  // 返回计算的结果
  return _pixelRatio;
}

export default {
  getDevicePixelRatio,
}
