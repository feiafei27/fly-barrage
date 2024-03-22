import { Ref } from 'vue';
import { FrameRenderHook } from '../../lib';
import _ from 'lodash';

export default function usePortraitUnobstructed(video: Ref<HTMLVideoElement>) {
  // 创建一个 canvas 用于抓取 video 每一帧的数据
  const grabCanvas = document.createElement('canvas');
  grabCanvas.width = video.value.clientWidth * 1.5;
  grabCanvas.height = video.value.clientHeight * 1.5;
  const grabCtx = grabCanvas.getContext('2d') as CanvasRenderingContext2D;

  // 每一帧渲染前，计算出蒙版并设置进去
  const beforeFrameRender: FrameRenderHook = ({ br }) => {
    grabCtx.drawImage(video.value, 0, 0, grabCanvas.width, grabCanvas.height);
    // 获取这一帧的 ImageData
    const imageData = grabCtx.getImageData(0, 0, grabCanvas.width, grabCanvas.height);
    // 像素数量
    const pixelCount = imageData.data.length / 4;
    const imageDataArray = imageData.data;
    // 修改 imageData，得到我们想要的蒙版
    for (let i = 0; i < pixelCount; i++) {
      // 这里不用 ES6 解构赋值的写法，主要为了保证计算性能
      const r = imageDataArray[i * 4];
      const g = imageDataArray[i * 4 + 1];
      const b = imageDataArray[i * 4 + 2];

      // 将非绿色区域设为透明
      if (r === 0 && g === 255 && b === 0) {
        imageDataArray[4 * i + 3] = 0;
      }
    }

    br.setMask(imageData);
  }

  return {
    // 蒙版数据在真实的业务场景中应该是后端传递给前端。
    // 对于特定的视频（有纯色背景），前端也能进行蒙版的计算，
    // 不过处于性能的考虑，这里加上了节流函数，防止执行的太过频繁，否则弹幕的绘制帧率会过低，
    // 如果你的电脑性能好的话，可以将 time 缩小或者直接去掉节流函数，这样可以获得更加实时的蒙版数据。
    beforeFrameRender: _.throttle(beforeFrameRender, 200),
  }
}