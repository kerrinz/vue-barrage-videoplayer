/**
  $emit: updateProgress, -> 调整进度条后触发的事件，传递参数：currentProgress
         getMouseDownStatus, -> 获取是否鼠标按下的状态，传递参数：true/false
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
    <div class="progress-full" :style="{height: height}">
      <div class="progress-current" :style="{width: currentProgress * 100 + '%'}"></div>
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
  },
  data() {
    return {
      is_mousedown_progress: false, //是否点击了进度条并保持点击状态
      current_width_px: 0, // 当前进度条的像素长度
      init_clientX: 0, //初始进度的偏移量，相对于视口
      dom_full: null, //完整进度条的dom，即进度条背景
    };
  },
  mounted() {
    //初始化一些固定数据
    let dom_full = this.$el.getElementsByClassName("progress-full")[0];
    this.dom_full = dom_full;
    //绑定全局监听器
    window.addEventListener("mousemove", (e) => {
      if (this.is_mousedown_progress) {
        this.move(e);
      }
    });
    window.addEventListener("mouseup", (e) => {
      this.up(e);
    });
  },
  beforeDestroy() {
    //
  },
  methods: {
    down(e) {
      this.$emit("getMouseDownStatus", true);
      this.is_mousedown_progress = true;
      // 获取完整进度条的clientX（dom左上角）
      let init_clientX = this.dom_full.getBoundingClientRect().left;
      // 计算调整后的当前进度条的长度
      this.current_width_px = e.clientX - init_clientX;
      // 设置当前的播放进度（同时作用于当前进度条的样式）
        let current =
          (e.clientX - init_clientX) / this.dom_full.clientWidth;
        this.$emit("updateProgress", current);
    },
    move(e) {
      if (this.is_mousedown_progress) {
        let init_clientX = this.dom_full.getBoundingClientRect().left;
        this.current_width_px = e.clientX - init_clientX;
        let current =
          (e.clientX - init_clientX) / this.dom_full.clientWidth;
        this.$emit("updateProgress", current);
      }
    },
    up() {
      if (this.is_mousedown_progress) {
        // 标记鼠标不处于按下的状态了
        this.is_mousedown_progress = false;
        // 松开鼠标后，即调整进度条后，此时的进度（0-1）
        let current =
          this.current_width_px / this.dom_full.clientWidth;
        this.$emit("updateProgress", current);
        this.$emit("getMouseDownStatus", false);
      }
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
  overflow: hidden;
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
  transform: translate(50%, -50%);
  opacity: 0;
  transition: opacity 0.3s;
}
.progress-bar:hover .progress-current::after {
  opacity: 1;
}
</style>