/**
  $emit: dragging(currentProgress) -> 按下或拖动进度条的过程中触发;
         released(currentProgress) -> 松开进度条时触发;
  props: width, height,
         currentProgress, -> 当前进度，范围0-1
         duration, -> 参考videoDom.duration
         buffered, -> 参考videoDom.buffered
 */
<template>
  <div
    ref="progress-root"
    class="progress-bar"
    :style="{width: width}"
    @mousedown.left="down"
    @mousemove="move"
    @mouseup="up"
  >
    <div ref="progress-full" class="progress-full" :style="{height: height}">
      <!-- 缓冲段 -->
      <div class="progress-buffered" :style="{width: bufferedBarPercent + '%'}"></div>
      <!-- 当前播放时间段 -->
      <div class="progress-current" :style="{width: currentTimeRatio * 100 + '%'}"></div>
      <!-- 游标 -->
      <span class="progress-cursor" :style="{left: cursorPercent + '%'}"></span>
      <!-- 预览框 -->
      <span ref="preview" class="progress-preview" :style="{left: previewPostionLeft}">
        <span class="preview-time">{{ previewTimeLabel }}</span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "progress-bar",
  props: {
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "3px",
    },
    // 当前播放进度
    currentTime: {
      type: Number,
      default: 0,
      required: true,
    },
    // 视频全长，例如videoDom.duration
    duration: {
      type: Number,
      default: 0,
      require: true,
    },
    // 视频缓冲，参考videoDom.buffered
    buffered: {
      type: TimeRanges,
      default: null,
    }
  },
  computed: {
    // 当前播放进度与总时长的占比
    currentTimeRatio(){
      return this.currentTime / this.duration;
    },
    // 预览时间的百分比位置
    previewPostionLeft() {
      if (this.isPreviewCenter) {
        return `${this.cursorPercent}%`;
      } else {
        return this.cursorPercent > 50 ? `calc(100% - ${this.halfOfPreview}px)` : `${this.halfOfPreview}px`;
      }
    },
    // 预览框的一半大小
    halfOfPreview() {
      return Math.floor(this.previewDom.clientWidth / 2);
    },
    // 缓冲进度条百分比位置
    bufferedBarPercent() {
      // 遍历每一段缓存
      for (let i = 0; i < this.buffered?.length; i++) {
        // 该缓存段开始时间比当前时间还大，那么后面都不可能是了，跳出循环
        if(this.buffered.start(i) > this.currentTime) {
          break;
        }
        // 在该缓存段之内
        if (this.currentTime < this.buffered.end(i)) {
          return this.buffered.end(i) / this.duration * 100;
        }
      }
      return this.currentTimeRatio * 100;
    }
  },
  data() {
    return {
      isDragging: false, // 是否处于拖动进度条过程中（未松开）
      isPreviewCenter: true, // 游标的时间预览是否处于进度条中间的正常的不用处理的位置
      rootBarDom: null, // 进度条根元素dom
      fullBarDom: null, // 完整进度条的dom，即进度条背景
      previewDom: null, // 预览框的dom
      previewTimeLabel: "00:00", // 游标的时间预览文字
      cursorPercent: 0, // 鼠标悬浮时的游标所处的百分比位置
      listeners: [], // 事件监听列表，列表项格式：{eventName: String, element: ELement, method: Function}
      intervals: [], // 定时器列表，列表项格式：Function
    };
  },
  mounted() {
    //初始化一些固定数据
    this.rootBarDom = this.$refs["progress-root"];
    this.fullBarDom = this.$refs["progress-full"];
    this.previewDom = this.$refs["preview"];
    //绑定监听器
    let inWindowMove = {
      eventName: "mousemove",
      element: window,
      method: function(e) {
        this.move(e);
      }.bind(this),
    }
    let inRootbarMove = {
      eventName: "mousemove",
      element: this.rootBarDom,
      method: function(e) {
        this.onlyInRootBarDomMove(e);
      }.bind(this),
    }
    let up = {
      eventName: "mouseup",
      element: window,
      method: function(e) {
        this.up(e);
      }.bind(this),
    }
    this.listeners.push(inWindowMove);
    this.listeners.push(inRootbarMove);
    this.listeners.push(up);
    window.addEventListener("mousemove", inWindowMove.method, false);
    this.rootBarDom.addEventListener("mousemove", inRootbarMove.method, false);
    window.addEventListener("mouseup", up.method, false);
  },
  beforeDestroy() {
    // 销毁事件监听器
    for (let index in this.listeners) {
      let item = this.listeners[index];
      item.element.removeEventListener(item.eventName, item.method);
    }
    // 销毁定时器
    for (let index in this.intervals) {
      clearInterval(this.intervals[index])
    }
  },
  methods: {
    down(e) {
      this.isDragging = true;
      // 获取完整进度条的clientX（dom左上角）
      const fullBarClientX = this.fullBarDom.getBoundingClientRect().left;
      // 预播放进度传给dragging事件
      this.$emit("dragging", (e.clientX - fullBarClientX) / this.fullBarDom.clientWidth * this.duration);
    },
    move(e) {
      if (this.isDragging) {
        const fullBarClientX = this.fullBarDom.getBoundingClientRect().left;
        const currentBarWidth = e.clientX - fullBarClientX;
        // 预播放进度占比
        const preCurrentTimeRatio = currentBarWidth / this.fullBarDom.clientWidth;
          this.$emit("dragging", preCurrentTimeRatio * this.duration);
      }
    },
    up(e) {
      if (this.isDragging) {
        this.isDragging = false;
        const fullBarClientX = this.fullBarDom.getBoundingClientRect().left;
        this.$emit("released", (e.clientX - fullBarClientX) / this.fullBarDom.clientWidth * this.duration);
      }
    },
    // 仅在Rootbar内移动才触发
    onlyInRootBarDomMove(e) {
      const fullBarClientX = this.fullBarDom.getBoundingClientRect().left;
      const currentBarWidth = e.clientX - fullBarClientX;
      // 预播放进度占比
      const preCurrentTimeRatio = currentBarWidth / this.fullBarDom.clientWidth;
      this.cursorPercent = preCurrentTimeRatio * 100;
      this.previewTimeLabel = this.secondTimeFormat(preCurrentTimeRatio * this.duration)
      let cursorOffset = e.clientX - fullBarClientX - this.halfOfPreview;
      /* 游标的时间预览处于正常位置不会触碰边缘的时候为True（即处于中间段）
       * 图示（进度条）：|_|____中间段____|_|
       */
      this.isPreviewCenter = (cursorOffset > 0 && cursorOffset < this.fullBarDom.clientWidth - this.previewDom.clientWidth);
    },
    /* 时间格式化，秒格式化成xx:xx:xx
     */
    secondTimeFormat(second) {
      let result = parseFloat(second);
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
      if(h == '00')
        return `${m}:${s}`;
      else
        return `${h}:${m}:${s}`;
    },
  },
};
</script>

<style scoped>
.progress-bar {
  position: relative;
  cursor: pointer;
  padding: 2px 0;
  transition: height 0.2s;
  /* overflow: hidden; */
}
.progress-bar:hover .progress-full {
  height: 6px !important;
}
.progress-full {
  position: relative;
  display: inline-block;
  width: 100%;
  background: rgba(255, 255, 255, 0.33);
  transition: height 0.3s;
}
.progress-current {
  position: absolute;
  left: 0;
  top: 0;
  height: inherit;
  width: 50%;
  display: inline-block;
  background-color: var(--primaryColor);
}
.progress-current::after {
  content: "";
  position: absolute;
  display: inline-block;
  box-sizing: border-box;
  right: 0;
  top: 50%;
  bottom: 50%;
  width: 14px;
  height: 14px;
  border-radius: 100%;
  border: 2px solid #fff;
  background: var(--primaryColor);
  -o-transform: translate(50%, -50%);
  -ms-transform: translate(50%, -50%);
  -moz-transform: translate(50%, -50%);
  -webkit-transform: translate(50%, -50%);
  transform: translate(50%, -50%);
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 1002;
}
.progress-bar:hover .progress-current::after {
  opacity: 1;
}
.progress-buffered {
  position: absolute;
  left: 0;
  top: 0;
  height: inherit;
  width: 50%;
  display: inline-block;
  background-color: rgba(255,255,255,0.5);
}
.progress-cursor {
  opacity: 0;
  background: #fff;
  position: absolute;
  width: 2px;
  height: 10px;
  left: 0%;
  bottom: 50%;
  border-radius: 2px;
  pointer-events: none;
  -o-transform: translate(-50%, 50%);
  -ms-transform: translate(-50%, 50%);
  -moz-transform: translate(-50%, 50%);
  -webkit-transform: translate(-50%, 50%);
  transform: translate(-50%, 50%);
  transition: opacity.2s;
  z-index: 1001;
}
.progress-bar:hover .progress-cursor,
.progress-bar:hover .progress-preview {
  opacity: 1;
}
.progress-preview {
  opacity: 0;
  color: #fff;
  position: absolute;
  width: auto;
  height: auto;
  padding: 0 4px;
  left: 25px;
  bottom: 50%;
  pointer-events: none;
  -o-transform: translate(-50%, -10px);
  -ms-transform: translate(-50%, -10px);
  -moz-transform: translate(-50%, -10px);
  -webkit-transform: translate(-50%, -10px);
  transform: translate(-50%, -10px);
  transition: opacity.2s;
}
.progress-preview .preview-time{
  background: rgb(34, 34, 34, 0.6);
  display: inline-block;
  padding: 5px;
  border-radius: 2px;
}
</style>