# ✨ Fly Barrage

Fully functional and powerful web-based barrage library

## 🎥 Rendering effects

![Rendering effects](./public/imgs/0001.png)

## 📝 Official Website

<https://fly-barrage.netlify.app/>

## 📥 Install

```bash
npm install fly-barrage
```

## 🌍 Usage
```vue
<!-- Taking Vue framework as an example, this library is not limited to specific frameworks. -->
<template>
    <div id="container">
        <video
            ref="video"
            id="video"
            controls
            autoplay
            src="../src/assets/demo1.mp4"
            @play="videoPlay"
            @pause="videoPause"
        ></video>
    </div>
</template>

<script setup lang="ts">
  import BarrageRenderer, { BarrageOptions } from 'fly-barrage';
  import { onMounted, ref } from 'vue';

  const barrages: BarrageOptions[] = [
    {
      "id": "e55b45c9-7f9e-48c9-9bba-4d3b53441976",
      "barrageType": "scroll",
      "time": 100,
      "text": "残灯无焰影幢幢，此夕闻君谪九江。",
      "fontSize": 34,
      "lineHeight": 1.2,
      "color": "#FFFF00",
    },
  ];

  const barrageRenderer = ref<BarrageRenderer>();
  const video = ref();

  onMounted(() => {
    barrageRenderer.value = new BarrageRenderer({
      container: 'container',
      video: video.value,
      barrages,
    });
  })

  const videoPlay = () => {
    barrageRenderer.value?.play();
  };

  const videoPause = () => {
    barrageRenderer.value?.pause();
  };
</script>

<style>
  * {
    padding: 0;
    margin: 0;
  }

  #container {
    width: 1000px;
    height: 700px;
    margin: 20px auto 0;
  }

  #video {
    width: 100%;
    height: 100%;
    background: black;
  }
</style>
```
For complete usage, please clone the project directly, install the dependencies, and then execute npm run dev to view the complete usage

Try to use a higher version of the node version, my local version is v18.19.0

## 🌲 License
[MIT License](LICENSE)
