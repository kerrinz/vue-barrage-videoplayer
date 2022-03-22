## vue-barrage-videoplayer
[简体中文](https://github.com/yleencc/vue-barrage-videoplayer/blob/master/README.md) / [English]

### Introduction
> A vue component of video player with barrages. Apply to: PC web and static video file

### Functional Support
> Mainly support: playback, volume control, multiple speed, progress bar control, full screen, barrages(partial)
>
> Keyboard control：F fullscreen，↑↓ volume，←→ progress bar，Space pause/resume

#### Barrages Support
> Format：Only supports the xml barrage format of Bilibili. For details of the format, please refer to [this article](https://blog.csdn.net/Enderman_xiaohei/article/details/86659064)
>
> Operation: Currently, only the barrage can be displayed and no other operations can be performed.

### Preview
- [Click to redirect](https://yleen.cc/files/works/barrage-video-player/)

### Plan
- [X] Multiplayer coexistence
- [X] Barrage (a small part developed)
- [ ] Full screen with only web page
- [ ] Upgrade Vue version to 3.x
- [ ] Right click to view video data
- [ ] Multilingual support
- [ ] push stream video, websocket
- [ ] for mobile web

### Updated history：
- 0.1.1 Added support for using multiple players at the same time; Support cover picture.
- 0.1.2 Optimized code.
- 0.2.0 Supports the display of sliding bullet chatter, and the function of importing external bullet chatter files is reserved.

### How to use
[preview-videoplayer.vue](https://github.com/yleencc/vue-barrage-videoplayer/blob/master/src/views/preview-videoplayer.vue)
1. Copy the four files under src/components to your project, make sure that these four files are kept in the same directory.
2. Copy src/assets to yours /src，the file "/src/assets/images/loading.svg" is loading icon.
3. Use in the page:
``` vue
<template>
    <barrageVideoplayer
        :src="video_src"
        :cover="cover"
        :biBarrageXml="biBarrageXml"
        width="100%"
        height="100%"
    ></barrageVideoplayer>
</template>
<script>
import barrageVideoplayer from "../components/barrage-videoplayer.vue";
export default {
  components: {barrageVideoplayer},
  data() {
    return {
      video_src: "", // video link
      cover: "", // cover link
      biBarrageXml: "", // barrage xml (bilibili format)
    };
  },
}
```

## 传入参数
- （barrage-videoplayer.vue）

| 字段 | 是否可选 | 类型 | 默认值 | 备注 |
|---|---|---|---|---|
| src | 必选 | String | null | 视频链接 |
| cover | 可选 | String | null | 封面图的链接 |
| width | 可选 | String | 100% | 视频宽度，对应css样式 |
| height | 可选 | String | 100% | 视频高度，对应css样式 |
| speedList | 可选 | array | ["2.0", "1.5", "1.0", "0.75", "0.5", "0.25"]  | 倍速选择的列表 |
| biBarrageXml | 可选 | String | null | 弹幕链接，使用的是B站XML风格，需处理跨域问题 |

### bug
- [issue](https://github.com/yleencc/vue-barrage-videoplayer/issues)
- contact me by email

### Project setup
```
npm install
```

#### Compiles and hot-reloads for development
```
npm run serve
```

#### Compiles and minifies for production
```
npm run build
```

#### Lints and fixes files
```
npm run lint
```

#### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
