/**
  $emit: dragging(currentProgress) -> 按下或拖动进度条的过程中触发;
         released(currentProgress) -> 松开/释放进度条时触发;
  props: width, height,
         currentProgress, -> 当前进度，范围0-1
 */
<template>
  <div
    class="progress-bar"
    :style="{width: width}"
    @mousedown.left="down"
    @mousemove="move"
    @mouseup="up"
  >
    <div ref="progress-full" class="progress-full" :style="{height: height}">
      <div class="progress-current" :style="{width: currentProgress * 100 + '%'}"></div>
      <span class="progress-cursor" :style="{left: cursorPercent + '%'}"></span>
      <span ref="preview" class="progress-preview" :style="{left: previewPostionLeft}">
        <span class="preview-time">{{ preTimeLabel }}</span>
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
    // 当前进度，范围0-1
    currentProgress: {
      type: Number,
      default: 0,
    },
    videoDom: null,
  },
  computed: {
    previewPostionLeft() {
      if (this.isPreviewCenter) {
        return `${this.cursorPercent}%`;
      } else {
        let offset = Math.floor(this.dom_preview.clientWidth / 2);
        return this.cursorPercent > 50 ? `calc(100% - ${offset}px)` : `${offset}px`;
      }
    }
  },
  data() {
    return {
      isDragging: false, //是否处于拖动进度条过程中（未松开）
      init_clientX: 0, //初始进度的偏移量，相对于视口
      dom_full: null, //完整进度条的dom，即进度条背景
      dom_preview: null,
      isPreviewCenter: true, // 游标的时间预览是否处于进度条中间的正常的不用处理的位置
      cursorPercent: 0, // 鼠标悬浮时的游标所处的百分比位置
      preTimeLabel: "00:00", // 游标的时间预览文字
      listeners: [], // 事件监听列表，列表项格式：{eventName: String, element: ELement, method: Function}
      intervals: [], // 定时器列表，列表项格式：Function
    };
  },
  mounted() {
    //初始化一些固定数据
    this.dom_full = this.$refs["progress-full"];
    this.dom_preview = this.$refs["preview"];
    //绑定全局监听器
    let move = {
      eventName: "mousemove",
      element: window,
      method: function(e) {
        this.move(e);
      }.bind(this),
    }
    let up = {
      eventName: "mouseup",
      element: window,
      method: function(e) {
        this.up(e);
      }.bind(this),
    }
    this.listeners.push(move);
    this.listeners.push(up);
    window.addEventListener("mousemove", move.method, false);
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
      let fullClientX = this.dom_full.getBoundingClientRect().left;
      // 设置当前的播放进度（同时作用于当前进度条的样式）
      let preCurrentProgress =
        (e.clientX - fullClientX) / this.dom_full.clientWidth;
      this.$emit("dragging", preCurrentProgress);
    },
    move(e) {
      let fullClientX = this.dom_full.getBoundingClientRect().left;
      let preCurrentProgress = (e.clientX - fullClientX) / this.dom_full.clientWidth;
      if (this.isDragging) {
        this.$emit("dragging", preCurrentProgress);
      }
      this.cursorPercent = preCurrentProgress * 100;
      this.preTimeLabel = this.secondTimeFormat(preCurrentProgress * this.videoDom.duration)
      let cursorOffset = e.clientX - fullClientX - this.dom_preview.clientWidth / 2;
      /* 游标的时间预览处于正常位置不会触碰边缘的时候为True（即处于中间段）
       * 图示（进度条）：|_|____中间段____|_|
       */
      this.isPreviewCenter = (cursorOffset > 0 && cursorOffset < this.dom_full.clientWidth - this.dom_preview.clientWidth);
    },
    up(e) {
      if (this.isDragging) {
        this.isDragging = false;
        let fullClientX = this.dom_full.getBoundingClientRect().left;
        let preCurrentProgress = (e.clientX - fullClientX) / this.dom_full.clientWidth;
        this.$emit("released", preCurrentProgress);
      }
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
  right: 0;
  top: 50%;
  bottom: 50%;
  width: 15px;
  height: 15px;
  border-radius: 100%;
  background: #fff;
  -o-transform: translate(50%, -50%);
  -ms-transform: translate(50%, -50%);
  -moz-transform: translate(50%, -50%);
  -webkit-transform: translate(50%, -50%);
  transform: translate(50%, -50%);
  opacity: 0;
  transition: opacity 0.3s;
}
.progress-bar:hover .progress-current::after {
  opacity: 1;
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