const { BarrageRenderer } = FlyBarrage;

// 获取 video 元素引用
const video = document.getElementById('video');
video.volume = 0.1;

// 创建渲染实例
const barrageRenderer = new BarrageRenderer({
  container: 'container',
  video: video,
  barrages,
  renderConfig: {
    heightReduce: 60,
    speed: 100,
    fontWeight: 'bold',
  },
  devConfig: {
    isRenderFPS: true,
    isRenderBarrageBorder: false,
    isLogKeyData: true
  }
});

video.addEventListener('play', () => {
  barrageRenderer.play();
});

video.addEventListener('pause', () => {
  barrageRenderer.pause();
});

window.onresize = _.debounce(() => {
  barrageRenderer.resize();
}, 150);

