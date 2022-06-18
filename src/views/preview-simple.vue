<template>
  <div class="container">
    <div class="video-wrap" v-for="n in 1" :key="n">
      <!-- 核心组件 -->
      <barrageVideoplayer
        ref="player"
        :src="videoSrc"
        :cover="cover"
        :biBarrageXml="biBarrageXml"
        primaryColor="#FB7299"
        width="100%"
        height="100%"
      ></barrageVideoplayer>
    </div>
    <div class="video-src">
      视频地址：<input
        :value="videoSrc"
        @input="onChangeInputSrc"
        type="text"
      />
      <button @click="videoSrc = inputSrc" class="upload-btn">确定</button>
    </div>
    <button class="upload-btn">
      <input type="file" @change="onInputFileChange" />
      <span>选择本地视频</span>
    </button>
    <button class="upload-btn">
      <input type="file" @change="onInputBarrageChange" />
      <span>导入本地XML弹幕文件</span>
    </button>
    <button class="upload-btn" @click="clearBarrage">
      <span>清空弹幕</span>
    </button>
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
      videoSrc: "https://yleen.cc/files/videos/摇曳露营01.mp4", // 视频链接
      cover: "https://yleen.cc/files/images/摇曳露营cover1.jpg", // 可选，封面图的链接
      biBarrageXml: "/files/danmu_bili/摇曳露营01_acfun.xml", // 可选，B站弹幕xml格式文件的链接（需要处理跨域问题）
      inputSrc: null,
    };
  },
  created() {
    this.inputSrc = this.videoSrc;
  },
  methods: {
    /**
     * 选择本地视频文件
     */
    onInputFileChange(e) {
      this.cover = null; // 去掉封面
      this.videoSrc = URL.createObjectURL(e.currentTarget.files[0]);
    },
    /**
     * 选择本地弹幕文件
     */
    onInputBarrageChange(e) {
      this.biBarrageXml = URL.createObjectURL(e.currentTarget.files[0]);
    },
    /**
     * 清空弹幕
     */
    clearBarrage() {
      this.biBarrageXml = null;
    },
    /**
     * 手动输入视频链接
     */
    onChangeInputSrc(e) {
      this.inputSrc = e.target.value;
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
  box-shadow: #aaa 0 0 4px;
}
.video-src {
  margin: 0.4rem 0;
}
.video-src input {
  display: inline-block;
  width: 400px;
  max-width: 90%;
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
.upload-btn > input {
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
@media (max-width: 567px) {
  .video-wrap {
    font-size: 12px;
  }
}
</style>