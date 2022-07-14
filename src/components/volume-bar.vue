/**
  $emit: updateVolume -> 更新音量，参数为一个0-1的音量值
  props: width, height,
        currentVolume, -> 当前音量（0-1）
 */

<template>
  <div
    class="volume-bar"
    :style="{width: '100%', height: height}"
    @mousedown.left.stop="down"
    @mousemove.stop="move"
    @mouseup.stop="up"
  >
    <div ref="volume-full" class="volume-full" :style="{width: width, height: height}">
      <div
        class="volume-current volume-ball"
        :style="{width: '100%', height: currentVolume * 100 + '%'}"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "volumeBar",
  props: {
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "100%",
    },
    //当前音量（0-1）
    currentVolume: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      isClickBar: false, // 是否点击了音量条
      fullBarHeight: null, // 音量条的总高度（像素）
      fullBarDom: null, // 总音量条的dom
      fullBarClientTop: 0, // 满载的音量条相对于视口的高度
      listeners: [], // 事件监听列表，列表项格式：{eventName: String, element: ELement, method: Function}
      intervals: [], // 定时器列表，列表项格式：Function
    };
  },
  mounted() {
    this.fullBarDom = this.$refs["volume-full"];
    //绑定全局监听器
    let move = {
      eventName: "mousemove",
      element: window,
      method: function(e) {
        if (this.isClickBar) {
          this.move(e);
        }
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
    down(e) {
      this.isClickBar = true;
      //赋值高度备用
      const fullBarHeight = this.fullBarDom.clientHeight;
      this.fullBarHeight = fullBarHeight;
      this.$emit('updateVolume', 1 - e.offsetY / fullBarHeight)
    },
    move(e) {
      //满载的音量条相对于视口的高度
      const fullBarClientTop = this.fullBarDom.getBoundingClientRect().top;
      this.fullBarClientTop = fullBarClientTop;
      //偏移量
      const offsetY = e.clientY - fullBarClientTop;
      //当鼠标按下的时候才进行更新数据
      if (this.isClickBar ) {
        const newVolume = 1 - (offsetY / this.fullBarHeight);
        if (newVolume > 1) {
          this.$emit("updateVolume", 1)
        } else if (newVolume < 0) {
          this.$emit("updateVolume", 0)
        } else {
          this.$emit("updateVolume", newVolume)
        }
      }
    },
    up() {
      this.isClickBar = false;
    },
  },
};
</script>

<style>
.volume-bar {
  display: inline-block;
  cursor: pointer;
  text-align: center;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.volume-full {
  display: inline-block;
  position: relative;
  background: rgb(180, 180, 180);
  border-radius: 10px;
}
.volume-current {
  position: absolute;
  bottom: 0;
  background-color: var(--primaryColor);
  pointer-events: none;
  border-radius: 10px;
}
.volume-current::after {
  content: "";
  display: inline-block;
  position: absolute;
  /* top: 0; */
  width: 12px;
  height: 12px;
  border-radius: 100%;
  background: #fff;
  transform: translate(-50%, -50%);
}
</style>