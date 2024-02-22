---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Fly Barrage"
  text: "Canvas 弹幕库"
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/quick-start

features:
  - title: 功能完善
    details: 支持滚动弹幕、顶部弹幕、底部弹幕、高级弹幕
  - title: 文字、图片混搭
    details: 弹幕内容支持混入图片
  - title: 自定义渲染
    details: 提供自定义渲染接口，高度定制化弹幕渲染
  - title: 不局限于特定框架
    details: 原生 Html、Vue、React 均可使用，不局限上层应用所使用的框架
---
### 安装
```bash
npm install fly-barrage
```

### 简单用法

::: code-group
```vue [template]
<!-- 这里以 Vue 框架为例 -->
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
```

```vue [script]
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
```

```vue [style]
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
:::

### 完整用法渲染效果
::: tip 提示
完整用法源码请直接 clone 项目，安装依赖后，执行 npm run dev 即可看到。（node 版本尽量使用高版本的，我本地的版本是 v18.19.0）
:::
![渲染效果](./assets/imgs/0001.png)
