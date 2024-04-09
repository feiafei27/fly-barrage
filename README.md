## ✨ Fly Barrage

Fully functional and powerful web-based barrage library

## 🎉 All of my open source libraries
> fly-barrage: Web based barrage library, recommended by Gitee.
>
> gitee: https://gitee.com/fei_fei27/fly-barrage;
>
> github: https://github.com/feiafei27/fly-barrage;

> fly-gesture-unlock: Web based gesture unlocking library.
>
> gitee: https://gitee.com/fei_fei27/fly-gesture-unlock;
>
> github: https://github.com/feiafei27/fly-gesture-unlock;

## 🎥 Rendering Effects

![Rendering effects](./public/imgs/0001.png)

## 📝 Official Website

<https://fly-barrage.netlify.app/>

## 🎄 Online Experience

<https://fly-barrage-online.netlify.app/>

## 📥 Install

```bash
npm install fly-barrage
```

## 🌍 Usage(native version)
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Fly Barrage</title>
  <style>
    * {
      padding: 0;
      margin: 0;
    }
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #374B6A;
      height: 100vh;
    }
    #container {
      width: calc(100vw - 100px);
      height: calc(100vh - 100px);
    }
    #video {
      background-color: black;
      width: 100%;
      height: 100%;
    }
  </style>
</head>
<body>
  <div id="container">
    <video id="video" controls autoplay src="../public/videos/demo1.mp4"></video>
  </div>
  <!-- 引入 fly-barrage 立即执行文件 -->
  <script src="https://unpkg.com/fly-barrage/dist/fly-barrage.iife.js"></script>
  <!-- 引入 lodash 工具库 -->
  <script src="https://unpkg.com/lodash/lodash.min.js"></script>
  <script>
    // 获取弹幕渲染器 class
    const { BarrageRenderer } = FlyBarrage;
    // 获取 video 元素引用
    const video = document.getElementById('video');
    video.volume = 0.1;
    // 声明弹幕内容
    const barrages = [
      {
        "id": "e55b45c9-7f9e-48c9-9bba-4d3b53441976",
        "barrageType": "scroll",
        "time": 1000,
        "text": "残灯无焰影幢幢，此夕闻君谪九江。",
        "fontSize": 34,
        "lineHeight": 1.2,
        "color": "#FFFF00",
        "addition": {
          "grade": 2
        }
      }
    ]
    // 创建弹幕渲染器实例
    const barrageRenderer = new BarrageRenderer({
      container: 'container',
      video: video,
      barrages,
      renderConfig: {
        heightReduce: 60,
        speed: 100,
        fontWeight: 'bold',
      },
    });
    // 给 video 元素绑定 play 事件，回调函数内部调用渲染器实例的 play 方法
    video.addEventListener('play', () => {
      barrageRenderer.play();
    });
    // 给 video 元素绑定 pause 事件，回调函数内部调用渲染器实例的 pause 方法
    video.addEventListener('pause', () => {
      barrageRenderer.pause();
    });
    // container 尺寸发生了变化的话，需要调用渲染器实例的 resize 方法
    // 这里需要借助 lodash 的防抖函数封装一下，不要太过频繁的调用 resize
    window.onresize = _.debounce(() => {
      barrageRenderer.resize();
    }, 150);
  </script>
</body>
</html>
```

## 🌍 Usage(Vue3 + TS version)
```vue
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
