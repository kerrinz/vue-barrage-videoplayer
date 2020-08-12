<template>
  <div class="player-barrage-wrap">
    <div v-for="n in 10" class="player-barrage-layer" :key="'layer'+ (n -1)" :id="'layer'+ (n-1)"></div>
  </div>
</template>

<script>
export default {
  name: "player-barrage-screen",
  props: {
    // 是否正在播放
    is_playing: {
      type: Boolean,
      default: false,
    },
    // 弹幕列表
    barrage_list: {
      type: Array,
      default: function () {
        return [];
      },
    },
    // 当前播放进度
    current_time: {
      type: Number,
      default: 0,
    },
    video_dom: null,
    // 弹幕时间轴的初始时间（手动干预进度条会触发更新）
    barrage_timeline_start: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      barraged_tag: 0, // 标记上一条弹幕的索引
    };
  },
  mounted() {
    // 测试弹幕
    setInterval(() => {
      if (this.is_playing) {
        let info = this.barrage_list[this.barraged_tag];
        if (info.start_time < this.video_dom.currentTime) {
          // 标记下一条弹幕的索引
          this.barraged_tag++;  
          if (info.mode <= 3) {
            this.createBarrage(this.barrage_list[this.barraged_tag]);
          }
        }
      }
    }, 10);
  },
  methods: {
    // 新建一个弹幕
    createBarrage(info) {
      let dom = document.createElement("span");
      dom.innerText = info.content;
      // dom.setAttribute("class", "barrage");
      dom.style.animation = "barrage 5s linear 0s";
      dom.style.left = "100%";
      dom.style.fontSize = info.font_size + "px";
      dom.style.color = "#" + info.font_color;
      dom.style.whiteSpace = "nowrap";
      dom.style.textShadow =
        "#000 1px 0px 1px, #000 0px 1px 1px, #000 0px -1px 1px, #000 -1px 0px 1px";
      // dom.style.zIndex = "1000";
      dom.style.position = "absolute";
      window.document
        .getElementsByClassName("player-barrage-layer")[Math.round(Math.random() * 9)].append(dom);
      //动画过渡完之后清除掉弹幕dom
      dom.addEventListener("animationend", () => {
        dom.removeEventListener("animationend", this, false);
        dom.innerHTML = "";
        dom.parentNode.removeChild(dom);
        dom.remove();
        // console.log('清除了一个弹幕～');
        dom = null;
      });
    },
  },
  watch: {
    /* 弹幕时间轴的初始时间。
     * 在手动改变进度条的时候触发，遍历弹幕列表获取下一条弹幕的索引
     */
    barrage_timeline_start: function () {
      let list = this.barrage_list;
      let barrage_start = this.barrage_timeline_start;
      for (let n = 0; n < list.length; n++) {
        if (list[n].start_time > barrage_start) {
          this.barraged_tag = n;
          break;
        }
      }
    },
  },
};
</script>

<style scoped>
.player-barrage-wrap {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  cursor: pointer;
  pointer-events: none;
  overflow: hidden;
}
.player-barrage-layer {
  position: relative;
  height: 2rem;
  line-height: 2rem;
  /* background: #000; */
  display: block;
  z-index: 1;
}
</style>
<style >
@keyframes barrage {
  from {
    left: 100%;
    transform: translate3d(0, 0, 0);
  }

  to {
    left: 0;
    transform: translate3d(-100%, 0, 0);
  }
}
</style>
