## vue-barrage-videoplayer
[![GitHub stars](https://img.shields.io/github/stars/yleencc/vue-barrage-videoplayer)](https://github.com/yleencc/vue-barrage-videoplayer/stargazers) [![GitHub forks](https://img.shields.io/github/forks/yleencc/vue-barrage-videoplayer)](https://github.com/yleencc/vue-barrage-videoplayer/network)  [![GitHub license](https://img.shields.io/github/license/yleencc/vue-barrage-videoplayer)](https://github.com/yleencc/vue-barrage-videoplayer/blob/master/LICENSE)  [![GitHub issues](https://img.shields.io/github/issues/yleencc/vue-barrage-videoplayer)](https://github.com/yleencc/vue-barrage-videoplayer/issues) 

Language: [简体中文](https://github.com/yleencc/vue-barrage-videoplayer/blob/master/README.md) / English

### Introduction
A vue component of barrages video player. Apply to PC web with static source video.

### Preview
- [Click to redirect](https://yleen.cc/files/works/barrage-video-player/)

### Functional Support
- Mainly: Volume and progress bar, multiple speed, fullscreen and page-fullcreen, picture in picture, barrages(partial)
- Keyboard control：(F) fullscreen, (↑↓) volume, (←→) progress bar, (Space) pause/resume
- Video format: Only supports video formats supported by native H5 Video. If you need to additionally support flv, mpegts, m2ts and other formats, you need to refer to other third-party libraries, such as [mpegts.js](https://github.com/xqq /mpegts.js);
- How to get video dom: Configure 'ref' and call videoDom attribute. For example, configure `ref="player"` and get the video dom through `this.$refs.player[0].videoDom`.

#### Barrages Support
- Format：Only supports the `xml barrage format of Bilibili`. For details of the format refer to [this article](https://blog.csdn.net/Enderman_xiaohei/article/details/86659064).
- Display: Supports scrolling, top fixed and bottom fixed barrages.
- Settings: waiting for development

---

### Plan
- [X] Multiplayer coexistence
- [X] Barrage display
- [X] Full screen with only web page
- [ ] Barrage settings
- [ ] Packaged for easier import
- [ ] Show video data and more tools by right click
- [ ] Multiple Language Support
- [ ] Live push stream
- [ ] ~~Adapt to mobile web~~

### How to use
Notice: Download files in [releases](https://github.com/yleencc/vue-barrage-videoplayer/releases), and the project needs to import `axios`.
Example codes: [preview-videoplayer.vue](https://github.com/yleencc/vue-barrage-videoplayer/blob/master/src/views/preview-videoplayer.vue)
Import and use:
1. Copy the four files under `src/components` to your project, make sure that these four files are kept in the same directory.
2. Copy `src/asset`s to yours `/src`，the file "`/src/assets/images/loading.svg`" is loading icon.
3. Minimal code example:
``` vue
<template>
    <barrageVideoplayer
        :src="videoSrc"
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
      videoSrc: "", 
    };
  },
}
```

## Parameter
- （barrage-videoplayer.vue）

| parameter | required/optional | type | default | more |
|---|---|---|---|---|
| src | required | String | null | Video source. |
| cover | optional | String | null | Customize Cover image source. If null, show video default cover. |
| primaryColor | optional | String | "cornflowerblue" | Theme color. Can use css attributes：colorName、#Hex、rgb、rgba、HSL、HSLA |
| width | optional | String | 100% | Video width with css code. |
| height | optional | String | 100% | Video height with css cod. |
| speedList | optional | array | ["2.0", "1.5", "1.25", "1.0", "0.75", "0.5"]  | Multiple play speed. Initialized to 1.0 |
| biBarrageXml | optional | String | null | Barrages source with Bilibili XML format. If null will not support barrages. Need to deal with cross-domain issues. |

### bug
- [issue](https://github.com/yleencc/vue-barrage-videoplayer/issues)
- contact me by email

---

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
