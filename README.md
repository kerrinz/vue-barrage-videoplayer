## vue-弹幕视频播放器
简体中文 / [English](https://github.com/yleencc/vue-barrage-videoplayer/blob/master/README_EN.md) 
### 简介
> 一个基于Vue的视频播放器组件（弹幕还没做完），仅适用于PC Web。
>
> 适用视频：http视频
>
> 功能：播放、音量控制、倍速、进度条控制、全屏
>
> 键盘控制：F全屏，↑↓键调整音量，←→调整进度，Space暂停/继续

### 预览示例
- [点击跳转预览](https://yleen.cc/files/works/barrage-video-player/)

### 计划表
- [X] 多播放器共存
- [ ] 右键查看视频数据
- [ ] 网页全屏
- [ ] 多语言支持
- [ ] 弹幕（开发了一点）
- [ ] 推流视频，websocket
- [ ] 适配好移动端

### 更新历史
- 0.1.1 增加了对同时使用多个播放器的支持，以及封面图
- 0.1.2 优化了遗留的部分烂代码

### 使用方式与示例
可参考[preview-videoplayer.vue](https://github.com/yleencc/vue-barrage-videoplayer/blob/master/src/views/preview-videoplayer.vue)文件
1. 将src/components下的四个文件复制到你的项目里，确保这四个文件保持在同一目录；
2. 在页面中引用：
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
      video_src: "https://yleen.cc/files/videos/output.mp4", // 视频链接
      cover: "https://yleen.cc/files/images/babala10.png", // 封面图的链接
    };
  },
}
```

### bug反馈
- 提[issue](https://github.com/yleencc/vue-barrage-videoplayer/issues)
- 本人首页的联系方式

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
