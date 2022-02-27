## vue-barrage-videoplayer
[简体中文](https://github.com/yleencc/vue-barrage-videoplayer/blob/master/README.md) / [English]
> A vue component of video player (The barrage is in future). Only applies to PC web.
>
> Applicable video: http video
>
> Support: playback, volume control, multiple speed, progress bar control, full screen


### Preview
- [Click to redirect](https://yleen.cc/files/works/barrage-video-player/)

### Plan
- [ ] Right click to view video data
- [ ] Multilingual support
- [ ] barrage
- [ ] push stream video, websocket
- [ ] for mobile web

### Updated history：
- 0.1.1 Added support for using multiple players at the same time; Support cover picture
- 0.1.2 Optimized code


### How to use
[preview-videoplayer.vue](https://github.com/yleencc/vue-barrage-videoplayer/blob/master/src/views/preview-videoplayer.vue)
1. Copy the four files under src/components to your project, make sure that these four files are kept in the same directory;
2. Quoted in the page:
``` vue
<template>
    <barrageVideoplayer
        :src="video_src"
        :cover="cover"
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
      video_src: "https://yleen.cc/files/videos/output.mp4", // video link
      cover: "https://yleen.cc/files/images/babala10.png", // cover link
    };
  },
```

### bug
- [issue](https://github.com/yleencc/vue-barrage-videoplayer/issues)
- contact me

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
