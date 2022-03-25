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
    <div class="volume-full" :style="{width: width, height: height}">
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
      is_click_bar: false, // 是否点击了音量条
      full_height: null, //音量条的总高度（像素）
      dom_volume_full: null, //总音量条的dom
      full_bar_client_top: 0, //满载的音量条相对于视口的高度
    };
  },
  mounted() {
    this.dom_volume_full = this.$el.getElementsByClassName("volume-full")[0];
    window.addEventListener("mousemove", (e) => {
      if (this.is_click_bar) {
        this.move(e);
      }
    });
    window.addEventListener("mouseup", (e) => {
      this.up(e);
    });
  },
  methods: {
    down(e) {
      this.is_click_bar = true;
      //赋值高度备用
      let full_height = this.dom_volume_full.clientHeight;
      this.full_height = full_height;
      this.$emit('updateVolume', 1 - e.offsetY / this.full_height)
    },
    move(e) {
      //满载的音量条相对于视口的高度
      let full_bar_client_top = this.dom_volume_full.getBoundingClientRect().top;
      this.full_bar_client_top = full_bar_client_top;
      //当前点击位置距离视口的高度
      let clickY = e.clientY;
      //偏移量
      let offsetY = clickY - full_bar_client_top;
      //当鼠标按下的时候才进行更新数据
      if (this.is_click_bar ) {
        let new_volume = 1 - (offsetY / this.full_height);
        if (new_volume > 1) {
          this.$emit("updateVolume", 1)
        } else if (new_volume < 0) {
          this.$emit("updateVolume", 0)
        } else {
          this.$emit("updateVolume", new_volume)
        }
      }
    },
    up() {
      this.is_click_bar = false;
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