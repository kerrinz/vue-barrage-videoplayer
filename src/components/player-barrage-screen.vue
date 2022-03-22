<template>
  <div class="player-barrage-wrap">
    <div v-for="n in 10" :ref="'channel' + n" class="player-barrage-layer" :key="'layer'+ (n -1)" :id="'layer'+ (n-1)"></div>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    name: "player-barrage-screen",
    props: {
      // 是否正在播放
      is_playing: {
        type: Boolean,
        default: false,
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
      // 弹幕的链接地址（XML文件格式，B站风格）
      biBarrageXml: {
        type: String,
        default: null,
      }
    },
    data() {
      return {
        barraged_tag: 0, // 标记上一条弹幕的索引
        barrage_list: [], // 弹幕列表
      };
    },
    mounted() {
      this.requestBarrageList();
      console.log(this.$refs);
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
      /* 获取并处理排序弹幕列表
       */
      requestBarrageList() {
        // 获取弹幕列表
        axios({
          method: "get",
          url: this.biBarrageXml,
          data: {},
        }).then((res) => {
          let xmlDoc = new DOMParser().parseFromString(res.data, "text/xml");
          let elements = xmlDoc.getElementsByTagName("d");
          let array = [];
          for (let n = 0, len = elements.length; n < len; n++) {
            let p_attr_list = elements[n].getAttribute("p").split(",");
            // 弹幕的信息
            let color = Number(p_attr_list[3]).toString(16);
            let info = {
              content: elements[n].innerHTML,
              start_time: Number(p_attr_list[0]),
              mode: Number(p_attr_list[1]),
              font_size: p_attr_list[2],
              font_color: color,
              timestamp: p_attr_list[4],
              barrage_pool: p_attr_list[5],
              user_hash: p_attr_list[6],
              row_id: p_attr_list[7],
            };
            array.push(info);
            // console.log(info);
          }
          // 写个冒泡过渡一下。。
          for (let i = 0, len = array.length; i < len; i++) {
            for (let j = 0, len_cache = len - i - 1; j < len_cache; j++) {
              if (array[j].start_time > array[j + 1].start_time) {
                let array_cache = array[j];
                array[j] = array[j + 1];
                array[j + 1] = array_cache;
              }
            }
          }
          this.barrage_list = array;
          console.log(array);
        });
      },
      /* 新建一个弹幕
       */
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
      /* 更新弹幕
       */
      biBarrageXml: function () {
        this.requestBarrageList();
      },
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
    display: block;
    z-index: 1;
  }
</style>
<style>
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
