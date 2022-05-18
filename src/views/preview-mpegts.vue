<template>
  <div class="container">
    <article>
      注：由于mpegts.js的限制，flv仅支持h.264视频+aac音频编码。
      <p>在此提供ffmpeg转码命令参考：ffmpeg -i test.flv -vcodec libx264 -c:a aac test.flv</p>
    </article>
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
    <div class="video-src">视频地址：{{ videoSrc }}</div>
    <div class="upload-btn">
      <input type="file" @change="onInputFileChange" />
      <span>选择本地视频</span>
    </div>
    <div class="upload-btn">
      <input type="file" @change="onInputBarrageChange" />
      <span>导入本地XML弹幕文件</span>
    </div>
    <div class="upload-btn" @click="clearBarrage">
      <span>清空弹幕</span>
    </div>
  </div>
</template>

<script>
import barrageVideoplayer from "../components/barrage-videoplayer.vue";
import mpegts from "mpegts.js"; // mpegts库，用于播放部分不受支持的视频类型
const videoTypes = {
  flv: "flv",
  ts: "mpegts",
  m2ts: "m2ts",
}; // 文件后缀对应视频类型

export default {
  components: {
    barrageVideoplayer,
  },
  data() {
    return {
      videoSrc: "https://yleen.cc/files/videos/output.mp4", // 视频链接
      cover: "https://yleen.cc/files/images/liuhua1.png", // 可选，封面图的链接
      biBarrageXml: "/files/danmu_bili/danmaku.xml", // 可选，B站弹幕xml格式文件的链接（需要处理跨域问题）
      mpegtsPlayer: null,
    };
  },
  methods: {
    /* 选择本地视频文件
     */
    onInputFileChange(e) {
      this.cover = null; // 去掉封面
      let newSrc = URL.createObjectURL(e.currentTarget.files[0]);
      let suffix = this.getFileSuffixLowerCase(e.currentTarget.files[0].name); // 文件后缀名
      if (suffix in videoTypes && mpegts.isSupported()) {
        // 处理不受原生支持的视频格式
        if (this.mpegtsPlayer != null) this.mpegtsPlayer.destroy();
        this.mpegtsPlayer = mpegts.createPlayer({
          type: videoTypes[suffix], // 支持mpegts, m2ts, flv
          isLive: false, // 是否直播推流模式
          url: newSrc, // 链接
        });
        this.mpegtsPlayer.attachMediaElement(this.$refs.player[0].videoDom); // 挂载
        this.mpegtsPlayer.load();
      } else {
        // mpegtsPlayer.destroy();
        if (this.mpegtsPlayer != null) this.mpegtsPlayer.detachMediaElement();
        this.videoSrc = newSrc;
      }
    },
    /* 选择本地弹幕文件
     */
    onInputBarrageChange(e) {
      this.biBarrageXml = URL.createObjectURL(e.currentTarget.files[0]);
    },
    /* 获取文件后缀，小写字母
     */
    getFileSuffixLowerCase(filename) {
      let arr = filename.split(".");
      return arr[arr.length - 1].toLocaleLowerCase();
    },
    /* 清空弹幕
     */
    clearBarrage() {
      this.biBarrageXml = null;
    },
  },
};
</script>

<style scoped>
.container {
  margin: auto;
  max-width: 1000px;
}
article {
  text-align: left;
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