<template>
  <div
    id="player-area"
    :class="{'player-area': true, 'player-fullscreen': is_fullscreen, 'cursor-lasting-static': is_cursor_static}"
    @contextmenu.prevent="mouseclick('右')"
  >
    <!-- 视频主体 -->
    <video
      id="player-video"
      class="player-video cursor-pointer"
      @click="togglePlayStatus"
      @keydown.f="toggleFullScreen"
      @keydown.space="togglePlayStatus"
      @keydown.left="backwardCurrentTime"
      @keydown.right="forwardCurrentTime"
      @keydown.up="increaseVolume"
      @keydown.down="lowerVolume"
      @keydown.esc.stop="toggleFullScreen"
      tabindex="0"
      :width="width"
      :height="height"
    >
      <source :src="src" />
    </video>
    <!-- 弹幕 -->
    <playerBarrageScreen :video_dom="video_dom" :barrage_list="barrage_list" :barrage_timeline_start="barrage_timeline_start" :is_playing="is_playing"/>
    <!-- 加载动画 -->
    <div v-show="is_show_loading" class="player-loading" @click="video_dom.focus()">
      <img src="../assets/images/loading.svg" />
    </div>
    <!-- 控制栏 -->
    <div class="player-controls-container" @click="video_dom.focus()">
      <div v-show="is_show_volume_hint" class="player-volumeHint">
        <span class="player-volumeHint-text">当前音量:{{volume_percent}}%</span>
      </div>
      <div class="player-paused-state">
        <svg
          v-show="!is_playing"
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
      <div :class="{'player-controls': true, 'cursor-lasting-static': is_cursor_static}">
        <div class="player-progress-bar">
          <progressBar
            :current_progress="current_progress"
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
                v-show="!is_playing"
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
                v-show="is_playing"
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
            <div class="player-time">{{ current_time_format }} / {{ full_time_format }}</div>
          </div>
          <div class="player-controls-bottom-right">
            <div class="player-controls-btn cursor-pointer btn-speed">
              <span>{{current_speed == '1.0' ? '倍速' : current_speed+'x'}}</span>
              <div class="speed-control">
                <ul class="speed-control-list">
                  <li
                    v-for="item in speed_list"
                    :key="item"
                    @click="changeSpeed"
                    :data-value="item"
                    :class="{'current': current_speed == item}"
                  >{{ item }}x</li>
                </ul>
              </div>
            </div>
            <div class="player-controls-btn btn-volume">
              <div class="cursor-pointer" type="buttom" @click="showVolumeControl">
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
                  <div class="volume-text">{{ volume_percent }}</div>
                  <volumeBar
                    :current_volume="current_volume"
                    v-on:updateVolume="updateVolumeByClickBar"
                    width="4px"
                  ></volumeBar>
                </div>
              </div>
            </div>
            <div class="player-controls-btn cursor-pointer" @click="toggleFullScreen">
              <svg
                v-show="!is_fullscreen"
                class="player-controls-icon"
                t="1596553111831"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="10800"
                width="32"
                height="32"
              >
                <path
                  d="M0 232.732444A232.732444 232.732444 0 0 1 232.732444 0h558.535112A232.732444 232.732444 0 0 1 1024 232.732444v558.535112A232.732444 232.732444 0 0 1 791.267556 1024H232.732444A232.732444 232.732444 0 0 1 0 791.267556V232.732444z m232.732444-139.662222a139.662222 139.662222 0 0 0-139.662222 139.662222v558.535112a139.662222 139.662222 0 0 0 139.662222 139.662222h558.535112a139.662222 139.662222 0 0 0 139.662222-139.662222V232.732444a139.662222 139.662222 0 0 0-139.662222-139.662222H232.732444z"
                  p-id="10801"
                  fill="#ffffff"
                />
                <path
                  d="M549.575111 245.845333c0-25.799111 20.935111-46.734222 46.734222-46.734222h116.821334A140.202667 140.202667 0 0 1 853.333333 339.313778v116.821333a46.734222 46.734222 0 0 1-93.468444 0v-116.821333c0-25.827556-20.906667-46.734222-46.734222-46.734222h-116.821334a46.734222 46.734222 0 0 1-46.734222-46.734223zM245.845333 549.546667c25.799111 0 46.734222 20.935111 46.734223 46.734222v116.821333c0 25.827556 20.906667 46.734222 46.734222 46.734222h116.821333a46.734222 46.734222 0 0 1 0 93.468445h-116.821333A140.202667 140.202667 0 0 1 199.111111 713.130667v-116.821334c0-25.799111 20.935111-46.734222 46.734222-46.734222z"
                  p-id="10802"
                  fill="#ffffff"
                />
              </svg>
              <svg
                v-show="is_fullscreen"
                t="1596958879235"
                class="player-controls-icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="2734"
                width="32"
                height="32"
              >
                <path
                  d="M0.739556 233.130667a232.391111 232.391111 0 0 1 232.391111-232.391111h557.738666a232.391111 232.391111 0 0 1 232.391111 232.391111v557.738666a232.391111 232.391111 0 0 1-232.391111 232.391111H233.130667a232.391111 232.391111 0 0 1-232.391111-232.391111V233.130667z m232.391111-139.434667a139.434667 139.434667 0 0 0-139.434667 139.434667v557.738666a139.434667 139.434667 0 0 0 139.434667 139.434667h557.738666a139.434667 139.434667 0 0 0 139.434667-139.434667V233.130667a139.434667 139.434667 0 0 0-139.434667-139.434667H233.130667z"
                  p-id="2735"
                  fill="#ffffff"
                />
                <path
                  d="M601.088 186.652444c25.685333 0 46.506667 20.792889 46.506667 46.478223v96.796444c0 25.685333 20.792889 46.478222 46.478222 46.478222h96.796444a46.478222 46.478222 0 1 1 0 92.984889h-96.796444a139.434667 139.434667 0 0 1-139.463111-139.463111V233.130667c0-25.685333 20.821333-46.478222 46.478222-46.478223z m-414.435556 414.435556c0-25.656889 20.792889-46.478222 46.478223-46.478222h96.796444a139.434667 139.434667 0 0 1 139.463111 139.463111v96.796444a46.478222 46.478222 0 0 1-92.984889 0v-96.796444c0-25.685333-20.792889-46.478222-46.478222-46.478222H233.130667a46.478222 46.478222 0 0 1-46.478223-46.506667z"
                  p-id="2736"
                  fill="#ffffff"
                />
              </svg>
              <div
                class="player-controls-btn-hint btn-fullscreen-hint"
              >{{is_fullscreen ? '退出全屏' : '进入全屏'}}</div>
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
      default: "auto",
    },
    height: {
      type: String,
      default: "auto",
    },
    speed_list: {
      type: Array,
      default: function () {
        return ["2.0", "1.5", "1.0", "0.75", "0.5", "0.25"];
      },
    },
    // 视频链接
    src: {
      type: String,
      default: null,
    },
    barrage_list: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      video_dom: null, //视频dom
      is_fullscreen: false, // 是否处于全屏模式
      is_cursor_static: false, // 鼠标是否长时间静止不动
      is_mousedown_progress: false, // 鼠标是否按下了进度条（并未松开）
      is_show_volume_control: false, // 是否显示音量控制面板
      is_playing: false, // 是否正在播放
      is_show_loading: false, // 是否显示加载框
      is_show_volume_hint: false, // 是否显示音量提示条（键盘触发）
      timeout_volume_hint: 0, // 音量提示条多久ms后隐藏
      timeout_controls_hint: 0, // 控制面板多久ms后隐藏
      current_speed: "1.0", // 当前倍速
      volume_percent: 100, // 当前音量百分比（0-100），仅用于文字显示
      current_volume: 1, // 当前音量（0-1），同时作用于当前音量条的长度
      current_progress: 0, // 当前播放进度（0-1）。同时作用于当前进度条的长度
      current_time_format: "00:00", // 当前播放进度的文字
      full_time_format: "00:00", // 视频总长度的文字
      barrage_timeline_start: 0, // 弹幕时间轴的起始时间点（手动调整进度条触发更新）
    };
  },
  created() {},
  mounted() {
    this.video_dom = document.getElementById("player-video");
    this.video_dom.focus();
    setInterval(() => {
      // 定时更新进度条
      if (this.is_playing && !this.is_mousedown_progress) {
        this.current_progress =
          this.video_dom.currentTime / this.video_dom.duration;
      }
      // 定时更新进度的文字显示
      this.updateProgressText();
      // 音量提示面板的定时隐藏
      if (this.timeout_volume_hint == null) {
        // 当定时为null，直接跳过
      } else if (this.timeout_volume_hint == 0) {
        this.is_show_volume_hint = false;
        this.is_cursor_static = false;
        this.timeout_volume_hint == null;
      } else if (this.timeout_volume_hint > 0) {
        this.timeout_volume_hint -= 1000;
      } else {
        this.timeout_volume_hint = 0;
      }
      // 总控制面板的定时隐藏
      if (
        this.timeout_controls_hint == null ||
        this.current_progress == 0 ||
        this.current_progress == 1
      ) {
        // 当定时为null、视频还未播放或播放完毕的时候，直接跳过
      } else if (this.timeout_controls_hint == 0) {
        this.is_cursor_static = true;
        this.timeout_controls_hint == null;
      } else if (this.timeout_controls_hint > 0) {
        this.timeout_controls_hint -= 1000;
      } else {
        this.timeout_controls_hint = 0;
      }
      // 根据视频的readyState判断下一帧是否已加载，并控制loading的显示
      if (this.video_dom.readyState >= 3) {
        this.is_show_loading = false;
      } else {
        this.is_show_loading = true;
      }
    }, 1000);
    // 视频dom监听器，用于控制鼠标的显示
    this.video_dom.addEventListener("mousemove", () => {
      this.is_cursor_static = false;
      this.timeout_controls_hint = 2000;
    });
    // 监听全屏事件的变化，保存数据
    window.addEventListener("fullscreenchange", () => {
      this.is_fullscreen = this.isFullScreen();
    });
  },
  methods: {
    //切换播放状态
    togglePlayStatus() {
      if (this.video_dom.paused) {
        this.video_dom.play();
        this.is_playing = true;
      } else {
        this.video_dom.pause();
        this.is_playing = false;
      }
    },
    //更新视频进度的文字显示
    updateProgressText() {
      this.current_time_format = this.secondTimeFormat(
        this.video_dom.currentTime
      );
      this.full_time_format = this.secondTimeFormat(this.video_dom.duration);
    },
    //时间格式化，秒格式化成xx:xx:xx
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
    //前进视频播放进度
    forwardCurrentTime() {
      let newCurrentTime = this.video_dom.currentTime + 5;
      this.video_dom.currentTime = newCurrentTime;
      this.barrage_timeline_start = newCurrentTime;
      this.updateProgressBySetTime(newCurrentTime);
    },
    //后退视频播放进度
    backwardCurrentTime() {
      let newCurrentTime = this.video_dom.currentTime - 5;
      this.video_dom.currentTime = newCurrentTime;
      this.barrage_timeline_start = newCurrentTime;
      this.updateProgressBySetTime(newCurrentTime);
    },
    //获取鼠标是否按下了进度条
    getMouseDownStatusOfProgressBar(value) {
      this.is_mousedown_progress = value;
    },
    //点击进度条更新视频播放进度
    updateProgressByClickBar(value) {
      let duration = this.video_dom.duration;
      this.current_progress = value;
      let new_current_time = Math.round(value * duration);
      this.barrage_timeline_start = new_current_time;
      this.video_dom.currentTime = new_current_time;
      console.log(value);
      console.log("now duration:" + Math.round(value * duration));
    },
    //通过新的播放时间更新视频播放进度
    updateProgressBySetTime(newCurrentTime) {
      this.current_progress = newCurrentTime / this.video_dom.duration;
    },
    //提高视频音量
    increaseVolume() {
      this.is_show_volume_hint = true;
      this.timeout_volume_hint = 2000;
      let nowVolume = this.video_dom.volume;
      if (nowVolume >= 0.9) {
        this.video_dom.volume = 1;
        this.current_volume = 1;
      } else {
        let newVolume = this.video_dom.volume + 0.1;
        this.video_dom.volume = newVolume;
        this.current_volume = newVolume;
      }
    },
    //降低视频音量
    lowerVolume() {
      this.is_show_volume_hint = true;
      this.timeout_volume_hint = 2000;
      let nowVolume = this.video_dom.volume;
      if (nowVolume <= 0.1) {
        this.video_dom.volume = 0;
        this.current_volume = 0;
      } else {
        let newVolume = this.video_dom.volume - 0.1;
        this.video_dom.volume = newVolume;
        this.current_volume = newVolume;
      }
    },
    // 视频倍速播放
    changeSpeed(e) {
      // 获取选择的倍速
      let value = e.currentTarget.dataset.value;
      // 应用视频倍速
      this.video_dom.playbackRate = value;
      // 标记变更后的倍速，用于显示文字
      this.current_speed = value;
    },
    //点击音量条后更新音量（value范围：0-1）
    updateVolumeByClickBar(value) {
      this.video_dom.volume = value;
      this.current_volume = value;
    },
    //显示音量控制面板
    showVolumeControl() {
      this.is_show_volume_control = !this.is_show_volume_control;
    },
    //切换“全屏”和“非全屏”模式
    toggleFullScreen() {
      let element = document.getElementById("player-area");
      if (!this.isFullScreen()) {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        } else if (element.oRequestFullscreen) {
          element.oRequestFullscreen();
        }
        this.is_fullscreen = true;
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
        this.is_fullscreen = false;
      }
    },
    //判断是否进入了全屏模式
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
    current_volume: function () {
      // 根据当前音量大小设置显示的音量文字
      this.volume_percent = Math.round(this.current_volume * 100);
    },
    current_progress: function () {
      // 进度条到终点时修改播放状态
      if (this.current_progress == 1) {
        this.is_playing = false;
      }
    },
    src: function () {
      // 当视频地址变更时，重载视频
      this.video_dom.load();
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
.player-loading {
  position: absolute;
  top: 50%;
  bottom: 50%;
  left: 50%;
  right: 50%;
  width: 80px;
  height: 80px;
  /* background: rgb(255, 255, 255, 0.8); */
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
  background: rgb(255, 255, 255, 0.8);
}
.player-paused-state svg {
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
  pointer-events: ;
  transform: translate(0, -100%);
  border-radius: 4px;
  background: rgb(0, 0, 0, 0.8);
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
}
.player-controls-bottom-right {
  display: inline-flex;
  padding: 0.6rem 0.4rem;
}
.player-controls-btn {
  position: relative;
  display: inline-block;
  color: #e5e5e5;
  padding: 0 0.4rem;
  transition: color 0.3s;
}
.player-controls-btn .player-controls-icon {
  height: 22px;
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
  background: rgb(21, 21, 21, 0.8);
  transition: opacity 0.3s, visibility 0s;
  transform: translate(-50%, -200%);
}
.btn-fullscreen-hint {
  margin-left: -16px;
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
  color: #00d8d9;
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
