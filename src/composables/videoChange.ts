import { computed, ref } from 'vue';

// 每个视频的配置项
export type VideoItem = {
  // 唯一标识
  id: number,
  // 名称
  name: string,
  // 是否启动人像免遮挡
  isUnobstructed: boolean,
  // 视频的 url
  url: string
};

export default function useVideoChange() {
  const originPath = window.location.origin;
  const videos = ref<VideoItem[]>([
    {id: 1, name: '花好月圆会', isUnobstructed: false, url: originPath + '/videos/demo1.mp4'},
    {id: 2, name: '陶喆《天天》Soul Power2003', isUnobstructed: false, url: originPath + '/videos/demo2.mp4'},
    {id: 3, name: '书记舞（人像防挡）', isUnobstructed: true, url: originPath + '/videos/demo3.mp4'},
  ]);
  // 当前播放视频的 id
  const currentVideo = ref(2);
  // 当前播放视频的配置项
  const currentVideoItem = computed(() => videos.value.find(item => item.id === currentVideo.value));
  // 当前播放视频的 src
  const videoSrc = computed(() => currentVideoItem.value?.url);
  const changeNextVideo = () => {
    // 获取当前播放的视频 index
    const currentIndex = videos.value.findIndex(video => video.id === currentVideo.value);
    const nextVideo = (videos.value.length - 1) === currentIndex ? videos.value[0] : videos.value[currentIndex + 1];
    currentVideo.value = nextVideo.id;
  }

  return {
    videos,
    currentVideo,
    currentVideoItem,
    videoSrc,
    changeNextVideo,
  }
}
