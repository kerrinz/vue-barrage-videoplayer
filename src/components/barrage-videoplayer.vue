<!--  传入参数（props）-->
<!--  必填项：src,-->
<!--  可选项：width, height, speedList, cover, biBarrageXml-->
<template>
  <div
    ref="area"
    :style="`--primaryColor: ${primaryColor}`"
    class="player-area"
    :class="{'player-full-flxed': isPageFullscreen, 'cursor-lasting-static': isCursorStatic}"
  >
    <!-- 视频主体 -->
    <video
      ref="video"
      class="player-video cursor-pointer"
      @click="togglePlayStatus"
      @dblclick="toggleFullScreen"
      @keydown.f.prevent="toggleFullScreen"
      @keydown.space.prevent="togglePlayStatus"
      @keydown.left.prevent="backwardCurrentTime"
      @keydown.right.prevent="forwardCurrentTime"
      @keydown.up.prevent="increaseVolume"
      @keydown.down.prevent="lowerVolume"
      @keydown.esc.prevent="toggleFullScreen"
      tabindex="0"
      :width="width"
      :height="height"
    >
      <source :src="src" />
    </video>
    <!-- 封面图 -->
    <div v-if="cover!=null && isShowCover" class="player-cover">
      <img :src="cover" :width="width" :height="height" alt=""/>
    </div>
    <!-- 弹幕 -->
    <PlayerBarrageScreen
            v-if="biBarrageXml != null"
            :enable="isShowBarrage"
            :video-dom="videoDom"
            :barrage-timeline-start="barrageTimelineStart"
            :is-playing="isPlaying"
            :bi-barrage-xml="biBarrageXml"
    />
    <!-- 加载动画 -->
    <div v-show="isShowLoading" class="player-loading" @click="videoDom.focus({preventScroll: true})">
      <img src="@/assets/images/loading.svg"  alt="loading"/>
    </div>
    <!-- 控制栏 -->
    <div class="player-controls-container" @click="videoDom.focus({preventScroll: true})">
      <div v-show="isShowVolumeHint" class="player-volumeHint">
        <span class="player-volumeHint-text">当前音量:{{ volumePercent }}%</span>
      </div>
      <!-- 暂停的大图标 -->
      <div class="player-paused-state">
        <svg-icon v-show="!isPlaying" icon-class="icon-pause-large" style="width: 3em; height: 2.2em" />
      </div>
      <div class="player-controls" :class="{'cursor-lasting-static': isCursorStatic}">
        <div class="player-progress-bar">
          <ProgressBar
            :duration="duration"
            :current-time="currentTime"
            :buffered="buffered"
            @dragging="onDraggingProgress"
            @released="onReleasedProgress"
            width="100%"
            height="3px"
          ></ProgressBar>
        </div>
        <div class="player-controls-bottom">
          <div class="player-controls-bottom-left">
            <!-- 播放与暂停按钮 -->
            <div class="player-controls-btn cursor-pointer" @click="togglePlayStatus">
              <svg-icon v-show="!isPlaying" icon-class="icon-play" class-name="player-controls-icon" />
              <svg-icon v-show="isPlaying" icon-class="icon-pause" class-name="player-controls-icon" />
            </div>
            <div class="time-label">
              {{ currentTimeLabel }} / <span class="fulltime">{{ fullTimeLabel }}</span>
              </div>
          </div>
          <div class="player-controls-bottom-right">
            <!-- 弹幕开关按钮 -->
            <div class="player-controls-btn" v-if="biBarrageXml != null" @click="toggleShowBarrage">
              <div class="cursor-pointer">
                <svg-icon v-show="isShowBarrage" icon-class="icon-danmaku-enable" class-name="player-controls-icon" />
                <svg-icon v-show="!isShowBarrage" icon-class="icon-danmaku-disable" class-name="player-controls-icon" />
                <div
                  class="player-controls-btn-hint"
                >{{isShowBarrage ? '关闭弹幕' : '开启弹幕'}}</div>
              </div>
            </div>
            <div class="player-controls-btn cursor-pointer btn-speed">
              <span>{{currentSpeed === 1 ? '倍速' : `${currentSpeed}x`}}</span>
              <div class="speed-control">
                <ul class="speed-control-list">
                  <li
                    v-for="item in speedList"
                    :key="item"
                    @click="changeSpeed"
                    :data-value="item"
                    :class="{'current': currentSpeed === Number(item)}"
                  >{{ item }}x</li>
                </ul>
              </div>
            </div>
            <!-- 音量 -->
            <div class="player-controls-btn btn-volume">
              <!-- 音量按钮 -->
              <div class="cursor-pointer" @click="toggleMute">
                <svg-icon v-if="volumePercent > 50" icon-class="icon-volume-full" class-name="player-controls-icon" />
                <svg-icon v-else-if="volumePercent == 0" icon-class="icon-volume-mute" class-name="player-controls-icon" />
                <svg-icon v-else icon-class="icon-volume-low" class-name="player-controls-icon" />
              </div>
              <!-- 音量条 -->
              <div class="volume-control">
                <div class="volume-control-wrap">
                  <div class="volume-text">{{ volumePercent }}</div>
                  <VolumeBar
                    class="volume-bar"
                    :current-volume="currentVolume"
                    @updateVolume="updateVolumeByClickBar"
                    width="4px"
                  ></VolumeBar>
                </div>
              </div>
            </div>
            <!-- 画中画按钮 -->
            <div v-if="pictureInPictureEnabled" class="player-controls-btn cursor-pointer" @click="togglePictureInPicture">
              <svg-icon v-if="isPictureInPicture" icon-class="icon-picture-in-picture-exit" class-name="player-controls-icon" />
              <svg-icon v-else icon-class="icon-picture-in-picture" class-name="player-controls-icon" />
              <div
                class="player-controls-btn-hint"
              >{{isPictureInPicture ? '关闭画中画' : '开启画中画'}}</div>
            </div>
            <!-- 网页全屏开关按钮 -->
            <div class="player-controls-btn cursor-pointer" @click="togglePageFullscreen">
              <svg-icon v-if="isPageFullscreen" icon-class="icon-page-fullscreen-exit" class-name="player-controls-icon" />
              <svg-icon v-else icon-class="icon-page-fullscreen" class-name="player-controls-icon" />
              <div
                class="player-controls-btn-hint"
              >{{isPageFullscreen ? '退出网页全屏' : '网页全屏'}}</div>
            </div>
            <!-- 全屏开关按钮 -->
            <div class="player-controls-btn cursor-pointer" @click="toggleFullScreen">
              <svg-icon v-if="isFullscreen" icon-class="icon-fullscreen-exit" class-name="player-controls-icon" />
              <svg-icon v-else icon-class="icon-fullscreen" class-name="player-controls-icon" />
              <div class="player-controls-btn-hint btn-fullscreen-hint">
                {{isFullscreen ? '退出全屏' : '进入全屏'}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VolumeBar from "./volume-bar.vue";
import ProgressBar from "./progress-bar.vue";
import PlayerBarrageScreen from "./player-barrage-screen.vue";
import '@/assets/icons'; // icon

export default {
  name: "barrage-videoplayer",
  components: { VolumeBar, ProgressBar, PlayerBarrageScreen },
  props: {
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "100%",
    },
    // 倍速列表
    speedList: {
      type: Array,
      default: function () {
        return ["2.0", "1.5", "1.25", "1.0", "0.75", "0.5"];
      },
    },
    // 视频链接
    src: {
      type: String,
      default: null,
    },
    // 主题色
    primaryColor: {
      type: String,
      default: "cornflowerblue",
    },
    // 封面图的链接
    cover: {
      type: String,
      default: null,
    },
    // 弹幕的链接地址（XML文件格式，B站风格）
    biBarrageXml: {
      type: String,
      default: null,
    }
  },
  computed: {
    // 当前音量的百分比显示值
    volumePercent() {
      if (this.currentVolume < 0.005) return Math.ceil(this.currentVolume * 100);
      else return Math.round(this.currentVolume * 100);
    },
  },
  data() {
    return {
      videoDom: null, //视频dom
      duration: 0, // 视频全长
      buffered: null, // 缓冲(TimeRanges)
      isShowCover: true, // 是否显示封面
      isShowBarrage: true, // 是否显示弹幕
      isFullscreen: false, // 是否处于全屏模式
      isPageFullscreen: false, // 是否处于网页全屏模式
      isPictureInPicture: false, // 是否处于画中画模式
      pictureInPictureEnabled: false, // 浏览器是否支持画中画模式
      isCursorStatic: false, // 鼠标是否长时间静止不动
      isDraggingProgressBar: false, // 是否处于拖动进度条的过程中
      isPlaying: false, // 是否正在播放
      isShowLoading: false, // 是否显示加载框
      isShowVolumeHint: false, // 是否显示音量提示条（键盘触发）
      volumeHintTimeout: 0, // 音量提示条多久ms后隐藏
      controlsHintTimeout: 0, // 控制面板多久ms后隐藏
      currentSpeed: 1.0, // 当前倍速
      currentVolume: 1, // 当前音量（0-1），同时作用于当前音量条的长度；currentVolumeCache为该值的缓存
      currentTime: 0, // 当前播放进度，仅作用于进度条UI，变更该项并不会作用于video.currentTime
      currentTimeLabel: "00:00", // 当前播放进度的文字
      fullTimeLabel: "00:00", // 视频总长度的文字
      barrageTimelineStart: 0, // 弹幕时间轴的起始时间点（手动调整进度条触发更新）
      listeners: [], // 事件监听列表，列表项格式：{eventName: String, element: ELement, method: Function}
      intervals: [], // 定时器列表，列表项格式：Function
    };
  },
  created() {},
  mounted() {
    this.videoDom = this.$refs.video;
    this.videoDom.focus({preventScroll: true});
    this.pictureInPictureEnabled = document.pictureInPictureEnabled && !this.videoDom.disablePictureInPicture;
    let interval = function() {
      // 定时更新进度条
      if (this.isPlaying && !this.isDraggingProgressBar) {
        this.currentTime = this.videoDom.currentTime;
      }
      // 定时更新进度的文字显示
      this.updateProgressText();
      // 音量提示面板的定时隐藏
      if (this.volumeHintTimeout == null) {
        // 当定时为null，直接跳过
      } else if (this.volumeHintTimeout === 0) {
        this.isShowVolumeHint = false;
        this.isCursorStatic = false;
        this.volumeHintTimeout = null;
      } else if (this.volumeHintTimeout > 0) {
        this.volumeHintTimeout -= 1000;
      } else {
        this.volumeHintTimeout = 0;
      }
      // 总控制面板的定时隐藏
      if (
        this.controlsHintTimeout == null ||
        this.currentTime === 0 ||
        this.currentTime === this.duration
      ) {
        // 当定时为null、视频还未播放或播放完毕的时候，直接跳过
      } else if (this.controlsHintTimeout === 0) {
        this.isCursorStatic = true;
        this.controlsHintTimeout = null;
      } else if (this.controlsHintTimeout > 0) {
        this.controlsHintTimeout -= 1000;
      } else {
        this.controlsHintTimeout = 0;
      }
      // 根据视频的readyState判断下一帧是否已加载，并控制loading的显示
      this.isShowLoading = this.videoDom.readyState < 3;
    }.bind(this);
    this.intervals.push(interval);
    setInterval(interval, 1000);
    let mouseMove = {
      eventName: "mousemove",
      element: this.videoDom,
      method: function() {
        this.isCursorStatic = false;
        this.controlsHintTimeout = 2000;
      }.bind(this),
    } // 视频dom监听器，用于控制鼠标的显示
    let fullscreenchange = {
      eventName: "fullscreenchange",
      element: window,
      method: function() {
        this.isFullscreen = this.checkIsFullScreen();
      }.bind(this),
    } // 监听全屏事件的变化，保存数据
    let pic = {
      eventName: "leavepictureinpicture",
      element: this.videoDom,
      method: function() {
        this.isPictureInPicture = false;
      }.bind(this),
    } // 画中画监听
    let onprogress = {
      eventName: "progress",
      element: this.videoDom,
      method: function() {
        this.buffered = this.videoDom.buffered;
      }.bind(this),
    } // 视频加载下载过程中触发
    let onDurationchange = {
      eventName: "durationchange",
      element: this.videoDom,
      method: function(e) {
        this.duration = e.target.duration;
      }.bind(this),
    } // 视频音频时长发生变化时触发
    this.listeners.push(mouseMove);
    this.listeners.push(fullscreenchange);
    this.listeners.push(pic);
    this.listeners.push(onprogress);
    this.listeners.push(onDurationchange);
    this.videoDom.addEventListener("mousemove", mouseMove.method, false);
    window.addEventListener("fullscreenchange", fullscreenchange.method, false);
    this.videoDom.addEventListener("leavepictureinpicture", pic.method, false);
    this.videoDom.addEventListener("progress", onprogress.method, false);
    this.videoDom.addEventListener("durationchange", onDurationchange.method, false);
  },
  beforeDestroy() {
    // 销毁事件监听器
    for (const index in this.listeners) {
      const item = this.listeners[index];
      item.element.removeEventListener(item.eventName, item.method);
    }
    // 销毁定时器
    for (const index in this.intervals) {
      clearInterval(this.intervals[index])
    }
  },
  methods: {
    /* 切换播放状态
     */
    togglePlayStatus() {
      if (this.videoDom.paused) {
        this.videoDom.play();
        this.isPlaying = true;
      } else {
        this.videoDom.pause();
        this.isPlaying = false;
      }
      this.isShowCover = false;
    },
    /* 更新视频进度的文字显示
     */
    updateProgressText() {
      this.currentTimeLabel = this.secondTimeFormat(this.videoDom.currentTime);
      this.fullTimeLabel = this.secondTimeFormat(this.videoDom.duration);
    },
    /* 时间格式化，秒格式化成xx:xx:xx
     */
    secondTimeFormat(second) {
      const result = parseInt(second);
      const h =
        Math.floor(result / 3600) < 10
          ? "0" + Math.floor(result / 3600)
          : Math.floor(result / 3600);
      const m =
        Math.floor((result / 60) % 60) < 10
          ? "0" + Math.floor((result / 60) % 60)
          : Math.floor((result / 60) % 60);
      const s =
        Math.floor(result % 60) < 10
          ? "0" + Math.floor(result % 60)
          : Math.floor(result % 60);
      if(h == '00')
        return `${m}:${s}`;
      else
        return `${h}:${m}:${s}`;
    },
    // 更新视频的当前播放时间，同时更新其他依赖
    updateVideoCurrentTime(newCurrentTime) {
      this.videoDom.currentTime = newCurrentTime;
      this.barrageTimelineStart = newCurrentTime;
      this.currentTime = newCurrentTime;
      if (newCurrentTime == this.duration) this.isPlaying = false;
      this.updateProgressText();
    },
    /* 前进视频播放进度
     */
    forwardCurrentTime() {
      this.updateVideoCurrentTime(this.videoDom.currentTime + 5);
    },
    /* 后退视频播放进度
     */
    backwardCurrentTime() {
      this.updateVideoCurrentTime(this.videoDom.currentTime - 5);
    },
    /* 拖动进度条
     */
    onDraggingProgress(value) {
      this.currentTime = value;
      this.isDraggingProgressBar = true;
    },
    /* 松开/释放拖动的进度条
     */
    onReleasedProgress(value) {
      this.updateVideoCurrentTime(value);
      this.isDraggingProgressBar = false;
    },
    /* 提高视频音量
     */
    increaseVolume() {
      this.isShowVolumeHint = true;
      this.volumeHintTimeout = 2000;
      const nowVolume = this.videoDom.volume;
      if (nowVolume >= 0.9) {
        this.videoDom.volume = 1;
        this.currentVolume = 1;
      } else {
        const newVolume = this.videoDom.volume + 0.1;
        this.videoDom.volume = newVolume;
        this.currentVolume = newVolume;
      }
    },
    /* 降低视频音量
     */
    lowerVolume() {
      this.isShowVolumeHint = true;
      this.volumeHintTimeout = 2000;
      const nowVolume = this.videoDom.volume;
      if (nowVolume <= 0.1) {
        this.videoDom.volume = 0;
        this.currentVolume = 0;
      } else {
        const newVolume = this.videoDom.volume - 0.1;
        this.videoDom.volume = newVolume;
        this.currentVolume = newVolume;
      }
    },
    /*  视频倍速播放
     */
    changeSpeed(e) {
      // 获取选择的倍速
      const value = e.currentTarget.dataset.value;
      // 应用视频倍速
      this.videoDom.playbackRate = value;
      // 标记变更后的倍速，用于显示文字
      this.currentSpeed = Number(value);
    },
    /* 点击音量条后更新音量（value范围：0-1）
     */
    updateVolumeByClickBar(value) {
      if (this.videoDom.muted && value) {
        this.videoDom.muted = false;
      }
      this.videoDom.volume = value;
      this.currentVolume = value;
    },
    /**
     * 切换弹幕显示状态
     */
    toggleShowBarrage() {
      this.isShowBarrage = !this.isShowBarrage;
    },
    /**
     * 切换静音模式
     */
    toggleMute() {
      if (this.videoDom.muted) {
        this.videoDom.muted = false;
        this.updateVolumeByClickBar(this.currentVolumeCache ?? 0.1);
      } else if(this.videoDom.volume == 0) {
        this.updateVolumeByClickBar(0.1);
      }else {
        this.videoDom.muted = true;
        this.currentVolumeCache = this.currentVolume;
        this.updateVolumeByClickBar(0);
      }
    },
    /**
     * 切换画中画模式
     */
    togglePictureInPicture() {
      try {
        const flag = !document.pictureInPictureElement;
        flag ? this.videoDom.requestPictureInPicture() : document.exitPictureInPicture();
        this.isPictureInPicture = flag;
      } catch (error) {
        console.error(error);
      }
    },
    /* 切换全屏模式
     */
    toggleFullScreen() {
      const element = this.$refs.area;
      if (!this.checkIsFullScreen()) {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if(element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        } else if (element.oRequestFullscreen) {
          element.oRequestFullscreen();
        }
        this.isFullscreen = true;
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.oRequestFullscreen) {
          document.oCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
        this.isFullscreen = false;
      }
      this.isPageFullscreen = false;
    },
    /**
     * 切换网页全屏
     */
    togglePageFullscreen() {
      if (this.checkIsFullScreen()) {
        this.toggleFullScreen();
      }
      this.isPageFullscreen = !this.isPageFullscreen;
    },
    /* 判断是否进入了全屏模式
     */
    checkIsFullScreen () {
      return !!(
        document.fullscreen ||
        document.mozFullScreen ||
        document.webkitIsFullScreen ||
        document.webkitFullScreen ||
        document.msFullScreen
      );
    },
  },
  watch: {
    currentTime: function () {
      // 进度条到终点时修改播放状态
      if (this.videoDom.currentTime === this.duration) {
        this.isPlaying = false;
      }
    },
    src: function () {
      // 当视频地址变更时，重载视频
      this.videoDom.load();
    },
  },
};
</script>

<style scoped>
.player-area {
  position: relative;
  display: inline-block;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.player-full-flxed {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #000;
  z-index: 1003;
}
.cursor-pointer {
  cursor: pointer;
}
.cursor-lasting-static .cursor-pointer {
  cursor: none;
}
.cursor-lasting-static.player-controls {
  visibility: hidden;
  opacity: 0;
}
.player-video {
  outline: none;
  vertical-align: middle;
  object-fit: contain;
}
.player-cover {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  background: #000;
  pointer-events: none;
}
.player-cover > img{
  object-fit: contain;
}
.player-loading {
  position: absolute;
  top: 50%;
  bottom: 50%;
  left: 50%;
  right: 50%;
  width: 80px;
  height: 80px;
  transform: translate(-50%, -50%);
}
.player-loading img {
  fill: #fff;
  width: inherit;
  height: inherit;
}
.player-paused-state {
  position: absolute;
  pointer-events: none;
  top: 0;
  right: 2%;
  transform: translate(0, -100%);
  border-radius: 8px;
  box-shadow: 1px 1px 5px rgba(34, 34, 34, 0.5);
  background: rgba(255, 255, 255, 0.6);
}
.player-paused-state > svg {
  margin: 0.4rem 1rem;
}
.player-controls-container {
  position: absolute;
  bottom: 0;
  width: 100%;
}
.player-volumeHint {
  position: absolute;
  top: 0;
  left: 12px;
  pointer-events: none;
  transform: translate(0, -100%);
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.8);
}
.player-volumeHint-text {
  position: relative;
  display: inline-block;
  padding: 0.4rem 0.6rem;
  color: #fff;
  font-size: 1rem;
}
.player-controls {
  padding-top: 12px;
  visibility: visible;
  opacity: 1;
  position: relative;
  display: block;
  transition: visibility 0.3s, opacity 0.3s;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6));
}
.player-controls-container:hover .player-controls {
  visibility: visible;
  opacity: 1;
}
.player-controls-container:hover .cursor-pointer {
  cursor: pointer;
}
.player-controls-bottom {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.player-controls-bottom-left {
  display: inline-flex;
  align-items: center;
}
.player-controls-bottom-right {
  display: inline-flex;
  padding: 0.6rem 0.5rem;
  align-items: center;
}
.player-full-flxed .player-controls-bottom > .player-controls-bottom-right {
  padding: 1rem 0.5rem;
}
.player-controls-btn {
  position: relative;
  display: inline-block;
  color: #e5e5e5;
  padding: 0 0.5rem;
  transition: color 0.3s;
}
.player-controls-bottom-left > .player-controls-btn {
  margin: 0 0.25rem;
}
.player-controls-btn .player-controls-icon {
  width: 1.5rem;
  height: 1.5rem;
  display: block;
  transition: height 0.3s;
  fill: #e3e3e3;
  transition: fill 0.2s;
}
.player-controls-btn .player-controls-icon:hover {
  fill: #fff;
}
.player-controls-btn:hover {
  color: #fff;
}
.player-controls-btn:hover .player-controls-btn-hint {
  visibility: visible;
  opacity: 1;
}
.player-controls-btn-hint {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  top: 0;
  left: 50%;
  white-space: nowrap;
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  background: rgba(21, 21, 21, 0.8);
  transition: opacity 0.3s, visibility 0s;
  transform: translate(-50%, -200%);
}
.btn-fullscreen-hint {
  margin-left: -1rem;
}
.time-label {
  display: inline-block;
  color: #e5e5e5;
}
.time-label .fulltime{
  color: #fff;
  opacity: 0.45;
}
.btn-speed:hover .speed-control {
  visibility: visible;
}
.speed-control {
  visibility: hidden;
  position: absolute;
  top: 0;
  left: 50%;
  padding-bottom: 24px;
  transition: visibility 0.3s;
  transform: translate(-50%, -100%);
}
.speed-control .speed-control-list {
  list-style: none;
  color: #e5e5e5;
  width: 80px;
  padding: 0;
  margin: 0;
  overflow: hidden;
  border-radius: 4px;
  background: rgba(21, 21, 21, 0.8);
}
.speed-control .speed-control-list li {
  position: relative;
  display: block;
  height: 35px;
  line-height: 35px;
}
.speed-control .speed-control-list li:hover {
  color: #fff;
  background: rgba(99, 99, 99, 0.8);
}
.speed-control .speed-control-list li.current {
  color: var(--primaryColor);
}
.btn-volume:hover .volume-control {
  visibility: visible;
}
.volume-control {
  visibility: hidden;
  position: absolute;
  top: 0;
  left: 50%;
  padding: 24px 10px;
  transition: visibility 0.3s;
  transform: translate(-50%, -100%);
}
.volume-control .volume-bar {
  flex: 1;
}
.volume-control-wrap {
  display: flex;
  text-align: center;
  flex-direction: column;
  margin: auto;
  width: 45px;
  height: 120px;
  padding: 0.6rem 0 1rem;
  background: rgba(21, 21, 21, 0.8);
  border-radius: 4px;
}
.volume-text {
  color: #fff;
  margin-bottom: 0.5rem;
}
@media (min-width: 1000px) {
  .player-loading {
    width: 100px;
    height: 100px;
  }
}
</style>