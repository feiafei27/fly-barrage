import { Ref } from 'vue';
import BarrageRenderer, { FrameRenderHook } from '../../lib';
import { VideoItem } from './videoChange';
import _ from 'lodash';

export default function usePortraitUnobstructed(
  video: Ref<HTMLVideoElement>,
  currentVideoItem: Ref<VideoItem | undefined>,
  barrageRenderer: Ref<BarrageRenderer>
) {
  // 创建一个 canvas 用于抓取 video 每一帧的数据
  const grabCanvas = document.createElement('canvas');
  const grabCtx = grabCanvas.getContext('2d', {
    willReadFrequently: true
  }) as CanvasRenderingContext2D;

  new ResizeObserver(_.throttle(() => {
    if (!video.value) return;
    grabCanvas.width = video.value.clientWidth;
    grabCanvas.height = video.value.clientHeight;
    barrageRenderer.value.handleHighDprVague(grabCanvas, grabCtx);
  }, 100)).observe(document.getElementById('container')!);

  // 每一帧渲染前，计算出蒙版并设置进去
  const beforeFrameRender: FrameRenderHook = ({ br }) => {
    if (currentVideoItem.value?.isUnobstructed) {
      if (!video.value) return;
      const { videoRenderWidth, videoRenderHeight, isWidthSame } = videoRenderSize(
        video.value.clientWidth,
        video.value.clientHeight,
        video.value.videoWidth / video.value.videoHeight
      );

      grabCtx.drawImage(
        video.value, 
        !isWidthSame ? (grabCanvas.width / barrageRenderer.value.dpr - videoRenderWidth) / 2 : 0, 
        isWidthSame ? (grabCanvas.height / barrageRenderer.value.dpr - videoRenderHeight) / 2 : 0, 
        videoRenderWidth, 
        videoRenderHeight
      );
      // 获取这一帧的 ImageData
      const imageData = grabCtx.getImageData(0, 0, grabCanvas.width, grabCanvas.height);
      // 像素数量
      const pixelCount = imageData.data.length / 4;
      const imageDataArray = imageData.data;
      // 修改 imageData，得到我们想要的蒙版
      for (let i = 0; i < pixelCount; i++) {
        if (imageDataArray[i * 4 + 1] === 255) {
          imageDataArray[4 * i + 3] = 0;
        }
      }

      br.setMask(imageData);
    } else {
      br.setMask();
    }
  }

  return {
    // 蒙版数据在真实的业务场景中应该是后端传递给前端。
    // 对于特定的视频（有纯色背景），前端也能进行蒙版的计算，
    // 不过出于性能的考虑，这里加上了节流函数，防止执行的太过频繁，否则弹幕的绘制帧率会过低，
    // 如果你的电脑性能好的话，可以将 time 缩小或者直接去掉节流函数，这样可以获得更加实时的蒙版数据。
    beforeFrameRender: _.throttle(beforeFrameRender, 200),
  }
}

/**
 * 获取 video 播放视频时，实际播放内容占据的宽高
 * @param videoWidth video 元素的宽
 * @param videoHeight video 元素的高
 * @param videoRenderRatio 播放视频宽高比
 */
function videoRenderSize(videoWidth: number, videoHeight: number, videoRenderRatio: number) {
  let videoRenderWidth: number;
  let videoRenderHeight: number;
  let isWidthSame: boolean;

  if (videoWidth / videoHeight > videoRenderRatio) {
    // 视频渲染高度与 video 一致
    videoRenderHeight = videoHeight;
    videoRenderWidth = videoRenderHeight * videoRenderRatio;
    isWidthSame = false;
  } else {
    // 视频渲染宽度与 video 一致
    videoRenderWidth = videoWidth;
    videoRenderHeight = videoRenderWidth / videoRenderRatio;
    isWidthSame = true;
  }

  return {
    videoRenderWidth,
    videoRenderHeight,
    isWidthSame
  };
}