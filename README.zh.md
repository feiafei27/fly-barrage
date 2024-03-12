## ✨ Fly Barrage

功能完善，强大的 web 端弹幕库

## 🎉 我的所有开源库
> fly-barrage: web 端弹幕库，gitee 推荐项目。
>
> gitee: https://gitee.com/fei_fei27/fly-barrage;
>
> github: https://github.com/feiafei27/fly-barrage;

> fly-gesture-unlock: web 端手势解锁库。
>
> gitee: https://gitee.com/fei_fei27/fly-gesture-unlock;
>
> github: https://github.com/feiafei27/fly-gesture-unlock;

## 🎥 渲染效果

![渲染效果](./public/imgs/0001.png)

## 📝 官方网站

<https://fly-barrage.netlify.app/>

## 📥 安装

```bash
npm install fly-barrage
```

## 🌍 用法
```vue
<!-- 这里使用 Vue 框架作为例子，本库并不局限于特定框架 -->
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
完整用法，请直接 clone 项目，安装依赖后，执行 npm run dev 即可看到完整用法

尽量使用高版本 node，我本地的版本是 v18.19.0

## 🌲 License
[MIT License](LICENSE)
