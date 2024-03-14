import { computed, ref } from 'vue';

export default function useVideoChange() {
  const originPath = window.location.origin;
  const videos = ref([
    {id: 1, name: '花好月圆会', url: originPath + '/videos/demo1.mp4'},
    {id: 2, name: 'That\'s What I Like', url: originPath + '/videos/demo2.mp4'},
  ]);
  const currentVideo = ref(1);
  const videoSrc = computed(() => videos.value.find(item => item.id === currentVideo.value)?.url);
  const changeNextVideo = () => {
    // 获取当前播放的视频 index
    const currentIndex = videos.value.findIndex(video => video.id === currentVideo.value);
    const nextVideo = (videos.value.length - 1) === currentIndex ? videos.value[0] : videos.value[currentIndex + 1];
    currentVideo.value = nextVideo.id;
  }

  return {
    videos,
    currentVideo,
    videoSrc,
    changeNextVideo,
  }
}
