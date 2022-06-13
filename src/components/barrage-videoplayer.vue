<!--  传入参数（props）-->
<!--  必填项：src,-->
<!--  可选项：width, height, speedList, cover, biBarrageXml-->
<template>
  <div
    ref="area"
    :style="`--primaryColor: ${primaryColor}`"
    :class="{'player-area': true, 'player-fullscreen': isFullscreen, 'cursor-lasting-static': isCursorStatic}"
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
    <playerBarrageScreen
            v-if="biBarrageXml != null"
            :videoDom="videoDom"
            :barrageTimelineStart="barrageTimelineStart"
            :isPlaying="isPlaying"
            :biBarrageXml="biBarrageXml"
    />
    <!-- 加载动画 -->
    <div v-show="isShowLoading" class="player-loading" @click="videoDom.focus({preventScroll: true})">
      <img src="@/assets/images/loading.svg"  alt="loading"/>
    </div>
    <!-- 控制栏 -->
    <div class="player-controls-container" @click="videoDom.focus({preventScroll: true})">
      <div v-show="isShowVolumeHint" class="player-volumeHint">
        <span class="player-volumeHint-text">当前音量:{{volumePercent}}%</span>
      </div>
      <div class="player-paused-state">
        <svg
          v-show="!isPlaying"
          t="1596553913647"
          class="player-controls-icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="13502"
          width="32"
          height="32"
        >
          <path
            d="M897.143467 597.051733l-464.648534 311.5264c-46.976 31.488-110.592 18.944-142.08-28.023466A102.4 102.4 0 0 1 273.066667 823.5264V200.4736c0-56.5504 45.8496-102.4 102.4-102.4a102.4 102.4 0 0 1 57.028266 17.348267l464.64 311.5264c46.976 31.488 59.528533 95.104 28.032 142.08a102.4 102.4 0 0 1-28.023466 28.023466z"
            p-id="13503"
            fill="rgb(0,0,0,0.8)"
          />
        </svg>
      </div>
      <div :class="{'player-controls': true, 'cursor-lasting-static': isCursorStatic}">
        <div class="player-progress-bar">
          <progressBar
            :currentProgress="currentProgress"
            v-on:updateProgress="updateProgressByClickBar"
            v-on:getMouseDownStatus="getMouseDownStatusOfProgressBar"
            width="100%"
            height="4px"
          ></progressBar>
        </div>
        <div class="player-controls-bottom">
          <div class="player-controls-bottom-left">
            <div class="player-controls-btn cursor-pointer" @click="togglePlayStatus">
              <svg
                v-show="!isPlaying"
                t="1596553913647"
                class="player-controls-icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="13502"
                width="32"
                height="32"
              >
                <path
                  d="M897.143467 597.051733l-464.648534 311.5264c-46.976 31.488-110.592 18.944-142.08-28.023466A102.4 102.4 0 0 1 273.066667 823.5264V200.4736c0-56.5504 45.8496-102.4 102.4-102.4a102.4 102.4 0 0 1 57.028266 17.348267l464.64 311.5264c46.976 31.488 59.528533 95.104 28.032 142.08a102.4 102.4 0 0 1-28.023466 28.023466z"
                  p-id="13503"
                  fill="#ffffff"
                />
              </svg>
              <svg
                v-show="isPlaying"
                t="1596554115916"
                class="player-controls-icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="17417"
                width="32"
                height="32"
              >
                <path
                  d="M268.97201558 114.31784297c73.21218086 0 132.56071902 59.34853814 132.56071901 132.560719v530.24287606c0 73.21218086-59.34853814 132.56071902-132.56071901 132.560719s-132.56071902-59.34853814-132.56071901-132.560719V246.87856197c0-73.21218086 59.34853814-132.56071902 132.56071901-132.560719z m486.05596884 0c73.21218086 0 132.56071902 59.34853814 132.56071901 132.560719v530.24287606c0 73.21218086-59.34853814 132.56071902-132.56071901 132.560719s-132.56071902-59.34853814-132.56071901-132.560719V246.87856197c0-73.21218086 59.34853814-132.56071902 132.56071901-132.560719z"
                  p-id="17418"
                  fill="#ffffff"
                />
              </svg>
            </div>
            <div class="player-time">{{ currentTimeFormat }} / {{ fullTimeFormat }}</div>
          </div>
          <div class="player-controls-bottom-right">
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
            <div class="player-controls-btn btn-volume">
              <div class="cursor-pointer">
                <svg
                  t="1596553801150"
                  class="player-controls-icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="12518"
                  width="32"
                  height="32"
                >
                  <path
                    d="M308.971 657.987l150.28 165.279a16 16 0 0 0 11.838 5.236c8.837 0 16-7.163 16-16v-600.67a16 16 0 0 0-5.236-11.839c-6.538-5.944-16.657-5.463-22.602 1.075l-150.28 165.279A112 112 0 0 1 226.105 403H177c-17.673 0-32 14.327-32 32v154.333c0 17.674 14.327 32 32 32h49.105a112 112 0 0 1 82.866 36.654zM177 701.333c-61.856 0-112-50.144-112-112V435c0-61.856 50.144-112 112-112h49.105a32 32 0 0 0 23.676-10.472l150.28-165.28c35.668-39.227 96.383-42.113 135.61-6.445a96 96 0 0 1 31.418 71.028v600.671c0 53.02-42.98 96-96 96a96 96 0 0 1-71.029-31.417l-150.28-165.28a32 32 0 0 0-23.675-10.472H177z m456.058-348.336c-18.47-12.118-23.621-36.915-11.503-55.386 12.118-18.471 36.916-23.621 55.387-11.503C752.495 335.675 799 419.908 799 512c0 92.093-46.505 176.325-122.058 225.892-18.471 12.118-43.269 6.968-55.387-11.503-12.118-18.471-6.968-43.268 11.503-55.386C686.303 636.07 719 576.848 719 512c0-64.848-32.697-124.07-85.942-159.003z m92.93-137.323c-18.07-12.71-22.415-37.66-9.706-55.73s37.66-22.415 55.73-9.706C888.942 232.478 960 366.298 960 512s-71.058 279.522-187.988 361.762c-18.07 12.71-43.021 8.364-55.73-9.706-12.709-18.07-8.363-43.02 9.706-55.73C821.838 740.912 880 631.38 880 512c0-119.38-58.161-228.912-154.012-296.326z"
                    p-id="12519"
                    fill="#ffffff"
                  />
                </svg>
              </div>
              <div class="volume-control">
                <div class="volume-control-wrap">
                  <div class="volume-text">{{ volumePercent }}</div>
                  <volumeBar
                    :currentVolume="currentVolume"
                    v-on:updateVolume="updateVolumeByClickBar"
                    width="4px"
                  ></volumeBar>
                </div>
              </div>
            </div>
            <div class="player-controls-btn cursor-pointer" @click="toggleFullScreen">
              <svg t="1655114887825" v-show="!isFullscreen" class="player-controls-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18260" width="24" height="24"><path id="svg_1" d="m380,97.2l-161.8,0c-66.2,0 -120,53.8 -120,120l0,161.8c0,22.1 17.9,40 40,40s40,-17.9 40,-40l0,-144.4c-0.01199,-30.72452 26.01714,-57.53697 55.7,-57.4l146.1,0c22.1,0 40,-17.9 40,-40s-17.9,-40 -40,-40zm505.8,507.8c-22.1,0 -40,17.9 -40,40c0,48.13333 -0.03176,111.59892 0,144.4c0.03176,32.80108 -23.05908,57.404 -54.96651,57.5l-146.83349,0c-22.1,0 -40,17.9 -40,40s17.9,40 40,40l161.9,0c66.2,0 120,-53.8 120,-120l0,-161.9c-0.1,-22.1 -18,-40 -40.1,-40zm-506.8,240.8l-144.4,0l169.8,-169.8c15.6,-15.6 15.6,-40.9 0,-56.6c-15.6,-15.6 -40.9,-15.6 -56.6,0l-170.6,170.7l0,-146.1c0,-22.1 -17.9,-40 -40,-40s-40,17.9 -40,40l0,161.9c0,66.2 53.8,120 120,120l161.8,0c22.1,0 40,-17.9 40,-40s-17.9,-40.1 -40,-40.1zm427.8,-747.6l-161.8,0c-22.1,0 -40,17.9 -40,40s17.9,40 40,40l144.4,0l-169.8,169.8c-15.6,15.6 -15.6,40.9 0,56.6c7.8,7.8 18,11.7 28.3,11.7c10.2,0 20.5,-3.9 28.3,-11.7l170.7,-170.7l0,146.1c0,22.1 17.9,40 40,40s40,-17.9 40,-40l0,-161.8c-0.1,-66.2 -53.9,-120 -120.1,-120z"/></svg>
              <svg t="1655114887825" v-show="isFullscreen" class="player-controls-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18260" width="24" height="24">
                <g>
                  <rect x="-1" y="-1" width="1026" height="1026" fill="none"/>
                </g>
                <g>
                  <path d="m380,97.2l-161.8,0c-66.2,0 -120,53.8 -120,120l0,161.8c0,22.1 17.9,40 40,40s40,-17.9 40,-40l0,-144.4c-0.01199,-30.72452 26.01714,-57.53697 55.7,-57.4l146.1,0c22.1,0 40,-17.9 40,-40s-17.9,-40 -40,-40zm505.8,507.8c-22.1,0 -40,17.9 -40,40c0,48.13333 -0.03176,111.59892 0,144.4c0.03176,32.80108 -23.05908,57.404 -54.96651,57.5l-146.83349,0c-22.1,0 -40,17.9 -40,40s17.9,40 40,40l161.9,0c66.2,0 120,-53.8 120,-120l0,-161.9c-0.1,-22.1 -18,-40 -40.1,-40z"/>
                  <g stroke="null">
                  <g stroke="null" transform="matrix(0.9957858808448392,0,0,0.9957858808448392,-3349.1231593465923,-3349.1463172975646) ">
                    <rect stroke="null" x="2857.812198" y="3872.903436" width="1026" height="1026" fill="none"/>
                  </g>
                  <g stroke="null" transform="matrix(0.9957858808448392,0,0,0.9957858808448392,-3349.1231593465923,-3349.1463172975646) ">
                    <path stroke="null" d="m3077.012198,3971.103436zm588.6,1l-161.8,0c-22.1,0 -40,17.9 -40,40s17.9,40 40,40l144.4,0l-169.8,169.8c-15.6,15.6 -15.6,40.9 0,56.6c7.8,7.8 18,11.7 28.3,11.7c10.2,0 20.5,-3.9 28.3,-11.7l170.7,-170.7l0,146.1c0,22.1 17.9,40 40,40s40,-17.9 40,-40l0,-161.8c-0.1,-66.2 -53.9,-120 -120.1,-120z"/>
                    <path stroke="null" d="m3077.012198,3971.103436zm588.6,1l-161.8,0c-22.1,0 -40,17.9 -40,40s17.9,40 40,40l144.4,0l-169.8,169.8c-15.6,15.6 -15.6,40.9 0,56.6c7.8,7.8 18,11.7 28.3,11.7c10.2,0 20.5,-3.9 28.3,-11.7l170.7,-170.7l0,146.1c0,22.1 17.9,40 40,40s40,-17.9 40,-40l0,-161.8c-0.1,-66.2 -53.9,-120 -120.1,-120z"/>
                  </g>
                  </g>
                  <g stroke="null">
                  <g stroke="null" transform="matrix(0.9926195208669554,0,0,0.9926195208669554,-15173.84311031432,-15173.842709950044) ">
                    <rect stroke="null" x="15798.520739" y="14779.091967" width="1026" height="1026" fill="none"/>
                  </g>
                  <g stroke="null" transform="matrix(0.9926195208669554,0,0,0.9926195208669554,-15173.84311031432,-15173.842709950044) ">
                    <path stroke="null" d="m16017.720739,14877.291967zm160.8,748.6l-144.4,0l169.8,-169.8c15.6,-15.6 15.6,-40.9 0,-56.6c-15.6,-15.6 -40.9,-15.6 -56.6,0l-170.6,170.7l0,-146.1c0,-22.1 -17.9,-40 -40,-40s-40,17.9 -40,40l0,161.9c0,66.2 53.8,120 120,120l161.8,0c22.1,0 40,-17.9 40,-40s-17.9,-40.1 -40,-40.1z"/>
                  </g>
                  </g>
                </g>
              </svg>
              <div
                class="player-controls-btn-hint btn-fullscreen-hint"
              >{{isFullscreen ? '退出全屏' : '进入全屏'}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import volumeBar from "./volume-bar.vue";
import progressBar from "./progress-bar.vue";
import playerBarrageScreen from "./player-barrage-screen.vue";

export default {
  name: "barrage-videoplayer",
  components: { volumeBar, progressBar, playerBarrageScreen },
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
  data() {
    return {
      videoDom: null, //视频dom
      isShowCover: true, // 是否显示封面
      isFullscreen: false, // 是否处于全屏模式
      isCursorStatic: false, // 鼠标是否长时间静止不动
      isMousedownProgress: false, // 鼠标是否按下了进度条（并未松开）
      isPlaying: false, // 是否正在播放
      isShowLoading: false, // 是否显示加载框
      isShowVolumeHint: false, // 是否显示音量提示条（键盘触发）
      timeoutVolumeHint: 0, // 音量提示条多久ms后隐藏
      timeoutControlsHint: 0, // 控制面板多久ms后隐藏
      currentSpeed: 1.0, // 当前倍速
      volumePercent: 100, // 当前音量百分比（0-100），仅用于文字显示
      currentVolume: 1, // 当前音量（0-1），同时作用于当前音量条的长度
      currentProgress: 0, // 当前播放进度（0-1）。同时作用于当前进度条的长度
      currentTimeFormat: "00:00", // 当前播放进度的文字
      fullTimeFormat: "00:00", // 视频总长度的文字
      barrageTimelineStart: 0, // 弹幕时间轴的起始时间点（手动调整进度条触发更新）
    };
  },
  created() {},
  mounted() {
    this.videoDom = this.$refs.video;
    this.videoDom.focus({preventScroll: true});
    setInterval(() => {
      // 定时更新进度条
      if (this.isPlaying && !this.isMousedownProgress) {
        this.currentProgress =
          this.videoDom.currentTime / this.videoDom.duration;
      }
      // 定时更新进度的文字显示
      this.updateProgressText();
      // 音量提示面板的定时隐藏
      if (this.timeoutVolumeHint == null) {
        // 当定时为null，直接跳过
      } else if (this.timeoutVolumeHint === 0) {
        this.isShowVolumeHint = false;
        this.isCursorStatic = false;
        this.timeoutVolumeHint = null;
      } else if (this.timeoutVolumeHint > 0) {
        this.timeoutVolumeHint -= 1000;
      } else {
        this.timeoutVolumeHint = 0;
      }
      // 总控制面板的定时隐藏
      if (
        this.timeoutControlsHint == null ||
        this.currentProgress === 0 ||
        this.currentProgress === 1
      ) {
        // 当定时为null、视频还未播放或播放完毕的时候，直接跳过
      } else if (this.timeoutControlsHint === 0) {
        this.isCursorStatic = true;
        this.timeoutControlsHint = null;
      } else if (this.timeoutControlsHint > 0) {
        this.timeoutControlsHint -= 1000;
      } else {
        this.timeoutControlsHint = 0;
      }
      // 根据视频的readyState判断下一帧是否已加载，并控制loading的显示
      this.isShowLoading = this.videoDom.readyState < 3;
    }, 1000);
    // 视频dom监听器，用于控制鼠标的显示
    this.videoDom.addEventListener("mousemove", () => {
      this.isCursorStatic = false;
      this.timeoutControlsHint = 2000;
    });
    // 监听全屏事件的变化，保存数据
    window.addEventListener("fullscreenchange", () => {
      this.isFullscreen = this.isFullScreen();
    });
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
      this.currentTimeFormat = this.secondTimeFormat(
        this.videoDom.currentTime
      );
      this.fullTimeFormat = this.secondTimeFormat(this.videoDom.duration);
    },
    /* 时间格式化，秒格式化成xx:xx:xx
     */
    secondTimeFormat(second) {
      let result = parseInt(second);
      let h =
        Math.floor(result / 3600) < 10
          ? "0" + Math.floor(result / 3600)
          : Math.floor(result / 3600);
      let m =
        Math.floor((result / 60) % 60) < 10
          ? "0" + Math.floor((result / 60) % 60)
          : Math.floor((result / 60) % 60);
      let s =
        Math.floor(result % 60) < 10
          ? "0" + Math.floor(result % 60)
          : Math.floor(result % 60);
      result = `${h}:${m}:${s}`;
      return result;
    },
    /* 前进视频播放进度
     */
    forwardCurrentTime() {
      let newCurrentTime = this.videoDom.currentTime + 5;
      this.videoDom.currentTime = newCurrentTime;
      this.barrageTimelineStart = newCurrentTime;
      this.updateProgressBySetTime(newCurrentTime);
    },
    /* 后退视频播放进度
     */
    backwardCurrentTime() {
      let newCurrentTime = this.videoDom.currentTime - 5;
      this.videoDom.currentTime = newCurrentTime;
      this.barrageTimelineStart = newCurrentTime;
      this.updateProgressBySetTime(newCurrentTime);
    },
    /* 获取鼠标是否按下了进度条
     */
    getMouseDownStatusOfProgressBar(value) {
      this.isMousedownProgress = value;
    },
    /* 点击进度条更新视频播放进度
     */
    updateProgressByClickBar(value) {
      let duration = this.videoDom.duration;
      this.currentProgress = value;
      let new_current_time = Math.round(value * duration);
      this.barrageTimelineStart = new_current_time;
      this.videoDom.currentTime = new_current_time;
    },
    /* 通过新的播放时间更新视频播放进度
     */
    updateProgressBySetTime(newCurrentTime) {
      this.currentProgress = newCurrentTime / this.videoDom.duration;
    },
    /* 提高视频音量
     */
    increaseVolume() {
      this.isShowVolumeHint = true;
      this.timeoutVolumeHint = 2000;
      let nowVolume = this.videoDom.volume;
      if (nowVolume >= 0.9) {
        this.videoDom.volume = 1;
        this.currentVolume = 1;
      } else {
        let newVolume = this.videoDom.volume + 0.1;
        this.videoDom.volume = newVolume;
        this.currentVolume = newVolume;
      }
    },
    /* 降低视频音量
     */
    lowerVolume() {
      this.isShowVolumeHint = true;
      this.timeoutVolumeHint = 2000;
      let nowVolume = this.videoDom.volume;
      if (nowVolume <= 0.1) {
        this.videoDom.volume = 0;
        this.currentVolume = 0;
      } else {
        let newVolume = this.videoDom.volume - 0.1;
        this.videoDom.volume = newVolume;
        this.currentVolume = newVolume;
      }
    },
    /*  视频倍速播放
     */
    changeSpeed(e) {
      // 获取选择的倍速
      let value = e.currentTarget.dataset.value;
      // 应用视频倍速
      this.videoDom.playbackRate = value;
      // 标记变更后的倍速，用于显示文字
      this.currentSpeed = Number(value);
    },
    /* 点击音量条后更新音量（value范围：0-1）
     */
    updateVolumeByClickBar(value) {
      this.videoDom.volume = value;
      this.currentVolume = value;
    },
    /* 切换“全屏”和“非全屏”模式
     */
    toggleFullScreen() {
      let element = this.$refs.area;
      if (!this.isFullScreen()) {
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
    },
    /* 判断是否进入了全屏模式
     */
    isFullScreen: function () {
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
    currentVolume: function () {
      // 根据当前音量大小设置显示的音量文字
      this.volumePercent = Math.round(this.currentVolume * 100);
    },
    currentProgress: function () {
      // 进度条到终点时修改播放状态
      if (this.currentProgress === 1) {
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
  pointer-events: none;
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
  border-radius: 6px;
  box-shadow: 0 0 4px #bbbbbb;
  background: rgba(255, 255, 255, 0.8);
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
  visibility: visible;
  opacity: 1;
  position: relative;
  display: block;
  transition: visibility 0.3s, opacity 0.3s;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6));
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
  padding: 0.6rem 0.4rem;
  display: inline-flex;
  align-items: center;
}
.player-controls-bottom-right {
  display: inline-flex;
  padding: 0.6rem 0.4rem;
  align-items: center;
}
.player-controls-btn {
  position: relative;
  display: inline-block;
  color: #e5e5e5;
  padding: 0 0.4rem;
  transition: color 0.3s;
}
.player-controls-btn .player-controls-icon {
  height: 1.5rem;
  display: block;
  transition: height 0.3s;
}
.player-controls-btn svg path {
  fill: #e5e5e5;
  transition: fill 0.2s;
}
.player-controls-btn:hover svg > path {
  fill: #ffffff;
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
.player-time {
  display: inline-block;
  color: #e5e5e5;
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
@media (device-width: 100vw) {
  .player-controls-btn .player-controls-icon {
    height: 26px;
  }
}
@media (min-width: 1000px) {
  .player-loading {
    width: 100px;
    height: 100px;
  }
}
</style>