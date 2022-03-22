<template>
  <div class="container">
    <div class="video-wrap" v-for="n in 1" :key="n">
      <!-- 参考用法；有些参数可不选，传参详见barrage-videoplayer.vue文件 -->
      <barrageVideoplayer
        :src="video_src"
        :cover="cover"
        :biBarrageXml="biBarrageXml"
        width="100%"
        height="100%"
      ></barrageVideoplayer>
    </div>
    <div class="video-src">视频地址：{{ video_src }}</div>
    <div class="upload-btn">
      <input type="file" @change="onInputFileChange" />
      <span>选择本地视频</span>
    </div>
    <div class="upload-btn">
      <input type="file" @change="onInputBarrageChange" />
      <span>导入本地XML弹幕文件</span>
    </div>
  </div>
</template>

<script>
  import barrageVideoplayer from "../components/barrage-videoplayer.vue";
  export default {
  components: {
    barrageVideoplayer,
  },
  data() {
    return {
      video_src: "https://yleen.cc/files/videos/output.mp4", // 视频链接
      cover: "https://yleen.cc/files/images/liuhua1.png", // 可选，封面图的链接
      biBarrageXml: "/files/danmu_bili/danmaku.xml", // 获可选，B站弹幕xml格式文件的链接（需要处理跨域问题）
    };
  },
  methods: {
    /* 选择本地视频文件
     */
    onInputFileChange(e) {
      this.video_src = URL.createObjectURL(e.currentTarget.files[0]);
    },
    /* 选择本地弹幕文件
     */
    onInputBarrageChange(e) {
      this.biBarrageXml = URL.createObjectURL(e.currentTarget.files[0]);
    },
  },
};
</script>

<style scoped>
.container {
  margin: auto;
  max-width: 1000px;
}
.video-wrap {
  display: inline-flex;
  width: 100%;
  max-height: 600px;
  background: #000;
}
.video-src {
  margin: 0.4rem 0;
}
.upload-btn {
  display: inline-block;
  position: relative;
  padding: 4px 10px;
  margin: 0.4rem;
  background: #fafafa;
  color: #0082ba;
  border: 1px solid #5c9bb6;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}
.upload-btn:hover {
  background: #5c9bb6;
  color: #fafafa;
}
.upload-btn input {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
}
.upload-btn input::after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  cursor: pointer;
}
</style>