# vue弹幕视频播放器
[![GitHub stars](https://img.shields.io/github/stars/yleencc/vue-barrage-videoplayer)](https://github.com/yleencc/vue-barrage-videoplayer/stargazers) [![GitHub forks](https://img.shields.io/github/forks/yleencc/vue-barrage-videoplayer)](https://github.com/yleencc/vue-barrage-videoplayer/network) [![GitHub release](https://img.shields.io/github/v/release/yleencc/vue-barrage-videoplayer?include_prereleases)](https://github.com/yleencc/vue-barrage-videoplayer/releases) [![GitHub license](https://img.shields.io/github/license/yleencc/vue-barrage-videoplayer)](https://github.com/yleencc/vue-barrage-videoplayer/blob/master/LICENSE)

Language: 简体中文 / [English](https://github.com/yleencc/vue-barrage-videoplayer/blob/master/README_EN.md)
 
## 简介
一个基于Vue的弹幕视频播放器组件，适用于PC版网页，且视频为静态资源视频。

注：该组件为UI封装，并不涉及底层编解码。早期代码有点烂，勿喷，后续会慢慢进行改进。

## 预览
- [点击跳转预览](https://yleen.cc/files/works/barrage-video-player/)

## 功能支持
- 主要功能：音量和进度条、倍速、全屏、网页全屏、画中画、弹幕（部分）
- 键盘控制：（F）全屏，（↑↓）调整音量，（←→）调整进度，（空格）暂停/继续
- 视频格式：仅支持原生H5 Video所支持的视频格式，如果需要额外支持flv、mpegts, m2ts等格式，需要引用其他第三方库，例如[mpegts.js](https://github.com/xqq/mpegts.js)；
- 获取视频dom的方式：配置ref后调用videoDom。例如`ref="player"`，通过`this.$refs.player[0].videoDom`得到视频dom。

### 弹幕支持情况
- 格式：暂时只支持旧版B站xml弹幕格式，详细格式情况參考[这篇文章](https://blog.csdn.net/Enderman_xiaohei/article/details/86659064)
- 显示：支持滚动、顶部悬停、底部悬停三种弹幕
- 设置项：计划开发中...

---

## 计划表
- [X] 多播放器共存
- [X] 弹幕显示
- [X] 网页全屏
- [ ] 弹幕设置
- [ ] 封装成易于导入的库
- [ ] 右键查看视频数据
- [ ] 多语言支持
- [ ] 直播推流
- [ ] ~~适配移动端~~

## 使用方式与示例
注意：前往[releases](https://github.com/yleencc/vue-barrage-videoplayer/releases)下载最新版本，且项目需要引入`axios`

示例代码文件：[preview-videoplayer.vue](https://github.com/yleencc/vue-barrage-videoplayer/blob/master/src/views/preview-simple.vue) 

引入方式：
1. 将`src/components`下的四个文件复制到你的项目里，确保这四个文件保持在同一目录；
2. 将`src/assets`文件夹复制到项目`src/`里面，确保`/src/assets/images/loading.svg`存在（该文件为缓冲时的加载图标）
3. 在页面中导入`barrage-videoplayer.vue`
4. 极简代码示例：
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
      videoSrc: "这里是视频地址~",
    };
  },
}
```

## 传入参数
`barrage-videoplayer.vue`

| 字段 | 是否可选 | 类型 | 默认值 | 备注 |
|---|---|---|---|---|
| src | `必选` | String | null | 视频链接 |
| cover | `可选` | String | null | 自定义封面图的链接，为null则显示视频的默认封面 |
| primaryColor | `可选` | String | "cornflowerblue" | 主题色，可使用css属性值：颜色名称、#十六进制、rgb、rgba、HSL、HSLA |
| width | `可选` | String | 100% | 视频宽度，对应css样式 |
| height | `可选` | String | 100% | 视频高度，对应css样式 |
| speed_list | `可选` | array | ["2.0", "1.5", "1.25", "1.0", "0.75", "0.5"]  | 倍速选择的列表，初始1.0倍速 |
| biBarrageXml | `可选` | String | null | 弹幕链接，使用的是旧版B站XML风格，为null则不显示弹幕；需处理跨域问题 |


### bug反馈
- 提[issue](https://github.com/yleencc/vue-barrage-videoplayer/issues)
- 或者本人首页的联系方式，不急的话邮箱优先

### 引用
- vue、axios、mpegts.js

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
