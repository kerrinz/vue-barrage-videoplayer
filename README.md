# vue弹幕视频播放器
简体中文 / [English](https://github.com/yleencc/vue-barrage-videoplayer/blob/master/README_EN.md)
 
## 简介
> 一个基于Vue的弹幕视频播放器组件。适用于：`PC版网页`、`静态资源视频`

## 功能支持
> 主要功能：播放、音量控制、倍速、进度条控制、全屏、弹幕（部分）
>
> 键盘控制：F全屏，↑↓键调整音量，←→调整进度，Space暂停/继续
>
> 视频格式：仅支持原生Video所支持的视频格式，如果需要额外支持flv、mpegts, m2ts等格式，需要引入第三方库，例如[mpegts.js](https://github.com/xqq/mpegts.js)；另外，可以通过ref的形式获取播放器的视频dom，例如配置`ref="player"`，通过`this.$refs.player[0].videoDom`得到视频dom，便于使用第三方库拓展。

### 弹幕支持情况
> 格式：只支持B站xml弹幕格式，详细格式情况參考[这篇文章](https://blog.csdn.net/Enderman_xiaohei/article/details/86659064)
>
> 显示：支持滚动弹幕、顶部悬停弹幕、底部悬停弹幕
>
> 设置项：暂未支持

## 预览示例
- [点击跳转预览](https://yleen.cc/files/works/barrage-video-player/)

---

## 计划表
- [X] 多播放器共存
- [X] 弹幕显示
- [ ] 弹幕设置
- [ ] 网页全屏
- [ ] Vue升级到3.x版本
- [ ] 右键查看视频数据
- [ ] 多语言支持
- [ ] 推流视频，websocket
- [ ] 适配好移动端

## 更新历史
- 0.1.1 增加了对同时使用多个播放器的支持，以及封面图
- 0.1.2 优化了遗留的部分烂代码
- 0.2   支持显示滑动弹幕，预留导入外部弹幕文件功能
- 0.3   优化滑动弹幕，支持顶部和底部的悬停弹幕，缩小默认字体大小

## 使用方式与示例
可参考简单示例[preview-videoplayer.vue](https://github.com/yleencc/vue-barrage-videoplayer/blob/master/src/views/preview-simple.vue) 文件
1. 将`src/components`下的四个文件复制到你的项目里，确保这四个文件保持在同一目录；
2. 将`src/assets`文件夹复制到项目`src/`里面，确保`/src/assets/images/loading.svg`存在（该文件为缓冲时的加载图标）
3. 在页面中引用`barrage-videoplayer.vue`
   - 注：项目需要引入`axios`
4. 简单示例：
``` vue
<template>
    <barrageVideoplayer
        :src="video_src"
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
      video_src: "",
    };
  },
}
```

## 传入参数
`barrage-videoplayer.vue`

| 字段 | 是否可选 | 类型 | 默认值 | 备注 |
|---|---|---|---|---|
| src | `必选` | String | null | 视频链接 |
| cover | `可选` | String | null | 封面图的链接 |
| primaryColor | `可选` | String | "cornflowerblue" | 主题色，可使用css属性值：颜色名称、#十六进制、rgb、rgba、HSL、HSLA |
| width | `可选` | String | 100% | 视频宽度，对应css样式 |
| height | `可选` | String | 100% | 视频高度，对应css样式 |
| speed_list | `可选` | array | ["2.0", "1.5", "1.25", "1.0", "0.75", "0.5"]  | 倍速选择的列表 |
| biBarrageXml | `可选` | String | null | 弹幕链接，使用的是B站XML风格，需处理跨域问题 |

（如果不需要封面则不配置cover，不需要弹幕功能则不配置biBarrageXml）

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
