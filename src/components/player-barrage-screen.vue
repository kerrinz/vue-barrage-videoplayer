<template>
  <div
    ref="wrap"
    class="player-barrage-wrap"
    v-if="enable"
    :style="`--animationPlayState: ${animationPlayState}`"
  >
    <div
      v-for="n in channelAmount"
      ref="channels"
      class="player-barrage-layer"
      :key="`channel-${n - 1}`"
    ></div>
  </div>
</template>

<script>
  import axios from "axios";
  export default {
    name: "player-barrage-screen",
    props: {
      // 是否开启弹幕
      enable: {
        type: Boolean,
        default: true,
      },
      // 是否正在播放
      isPlaying: {
        type: Boolean,
        default: false,
      },
      // 当前播放进度
      currentTime: {
        type: Number,
        default: 0,
      },
      videoDom: null,
      // 弹幕时间轴的初始时间（手动干预进度条会触发更新）
      barrageTimelineStart: {
        type: Number,
        default: 0,
      },
      // 弹幕的链接地址（XML文件格式，B站风格）
      biBarrageXml: {
        type: String,
        default: null,
      },
    },
    data() {
      return {
        barragedTag: 0, // 标记下一条等待显示的弹幕的索引
        barrageList: [], // 弹幕列表
        channelAmount: 10, // 弹幕通道数量
        animationPlayState: "uset",
        scrollOccupy: [], // 滚动弹幕的占用情况，0为空闲，>0的数为剩余的时间（毫秒），该时间经过后通道变为空闲（0）
        topOccupy: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 顶部占用，暂时10行（下标从最顶部部开始，0表示空闲，1表示占用）
        bottomOccupy: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 底部占用（下标从最底部开始）
        /* timer: {
          timeOutIds: [],
          addSetTimeOut(fun, ms) {
            const id = setTimeout(() => {fun(); this.stop(id)}, ms);
            this.timeOutIds.push(id);
            return id;
          },
          pauseAll() {
            for (let i = 0; i < this.timeOutIds.length; i++) {
              clearTimeout(this.timeOutIds[i]);
            }
          },
          startAll() {

          },
          start() {

          },
          stop(id) {
              clearTimeout(this.timeOutIds[id]);
          },
          clearAll() {
            for (const i = 0; i < this.timeOutIds.length; i++) {
              clearTimeout(this.timeOutIds[i]);
            }
          }
        }, // 延时和计时的管理器 */
      };
    },
    beforeMount() {
      // 初始化通道占用情况
      for (let i = 0; i < this.channelAmount; i++) {
        this.scrollOccupy.push(0)
      }
    },
    mounted() {
      this.requestBarrageList();
      // 测试弹幕
      setInterval(() => {
        if (this.isPlaying) {
          const info = this.barrageList[this.barragedTag];
          if (info && info.startTime < this.videoDom.currentTime) {
            // 标记下一条弹幕的索引
            this.barragedTag++;
            if (!this.enable) return;
            switch (info.mode) {
              case 0:case 1:case 2:case 3:
                this.createBarrage(info);
                break;
              case 4: // 底部弹幕
                this.createBottomFixedBarrage(info);
                break;
              case 5: // 顶部弹幕
                this.createTopFixedBarrage(info);
                break;
            }
          }
        }
      }, 1);
      // 滚动弹幕的计时器
      setInterval(() => {
        if (this.isPlaying) {
          for (let i = 0; i < this.scrollOccupy.length; i++) {
            if (this.scrollOccupy[i] > 100) this.scrollOccupy[i] -= 100;
            else this.scrollOccupy[i] = 0;
          }
        }
      }, 100);
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
          const xmlDoc = new DOMParser().parseFromString(res.data, "text/xml");
          const elements = xmlDoc.getElementsByTagName("d");
          let array = [];
          for (let n = 0, len = elements.length; n < len; n++) {
            const pAttributeList = elements[n].getAttribute("p").split(",");
            // 弹幕的信息
            const color = Number(pAttributeList[3]).toString(16);
            const info = {
              content: elements[n].innerHTML,
              startTime: Number(pAttributeList[0]),
              mode: Number(pAttributeList[1]),
              fontSize: pAttributeList[2],
              fontColor: color,
              timestamp: pAttributeList[4],
              barragePool: pAttributeList[5],
              userHash: pAttributeList[6],
              rowId: pAttributeList[7],
            };
            array.push(info);
          }
          // 写个冒泡过渡一下。。
          for (let i = 0, len = array.length; i < len; i++) {
            for (let j = 0, lenCache = len - i - 1; j < lenCache; j++) {
              if (array[j].startTime > array[j + 1].startTime) {
                const arrayCache = array[j];
                array[j] = array[j + 1];
                array[j + 1] = arrayCache;
              }
            }
          }
          this.barrageList = array;
        });
      },
      /* 新建一个滚动弹幕
       */
      createBarrage(info) {
        // 先寻找空闲的通道
        let index = 0;
        for (let i = 0; i < this.scrollOccupy.length; i++) {
          if(this.scrollOccupy[i] == 0) {
            index = i;
            break;
          }
          if (i == this.scrollOccupy.length - 1) return; // 没有空闲的位置则不显示该弹幕
        }
        this.scrollOccupy[index] = 500 + Number(info.content.length) * 50;
        let dom = document.createElement("span");
        dom.innerText = info.content;
        dom.setAttribute("class", "barrage barrage-scroll");
        dom.style.fontSize = `${info.fontSize*0.8}px`;
        dom.style.color = `#${info.fontColor}`;
        //动画过渡完之后清除掉弹幕dom
        dom.addEventListener("animationend", () => {
          dom.removeEventListener("animationend", this, false);
          dom.innerHTML = "";
          dom.parentNode.removeChild(dom);
          dom.remove();
          dom = null;
        });
        this.$refs["channels"][index].append(dom);
      },
      /* 新建一个底部固定弹幕
       */
      createBottomFixedBarrage(info) {
        // 先寻找空闲的通道（底部倒数）
        let index = 0;
        for (let i = 0; i < this.bottomOccupy.length; i++) {
          if(this.bottomOccupy[i] == 0) {
            index = i;
            break;
          }
        }
        this.bottomOccupy[index] = 1; // 占用该通道
        let dom = document.createElement("span");
        dom.innerText = info.content;
        dom.setAttribute("class", "barrage barrage-center barrage-bottom");
        dom.style.fontSize = `${info.fontSize*0.8}px`;
        dom.style.bottom = `${(Number(info.fontSize)*0.8 + 4) * index}px`;
        dom.style.color = `#${info.fontColor}`;
        // 之后清除掉弹幕dom
        setTimeout(() =>{
          dom.style.opacity = 0;
          this.bottomOccupy[index] = 0; // 释放该通道
          dom.parentNode.removeChild(dom);
          dom.remove();
          dom = null;
        }, 5000);
        this.$refs["wrap"].append(dom);
      },
      /* 新建一个顶部固定弹幕
       */
      createTopFixedBarrage(info) {
        // 先寻找空闲的通道
        let index = 0;
        for (let i = 0; i < this.topOccupy.length; i++) {
          if(this.topOccupy[i] == 0) {
            index = i;
            break;
          }
        }
        this.topOccupy[index] = 1; // 占用该通道
        let dom = document.createElement("span");
        dom.innerText = info.content;
        dom.setAttribute("class", "barrage barrage-center barrage-top");
        dom.style.fontSize = `${info.fontSize}px`;
        dom.style.top = `${(Number(info.fontSize)*0.8 + 4) * index}px`;
        dom.style.color = `#${info.fontColor}`;
        // 之后清除掉弹幕dom
        setTimeout(() =>{
          dom.style.opacity = 0;
          this.topOccupy[index] = 0; // 释放该通道
          dom.parentNode.removeChild(dom);
          dom.remove();
          dom = null;
        }, 5000);
        this.$refs["wrap"].append(dom);
      }
    },
    watch: {
      isPlaying: function () {
        this.animationPlayState = this.isPlaying ? "unset" : "paused";
        
      },
      /* 更新弹幕
       */
      biBarrageXml: function () {
        this.requestBarrageList();
      },
      /* 弹幕时间轴的初始时间。
       * 在手动改变进度条的时候触发，遍历弹幕列表获取下一条弹幕的索引
       */
      barrageTimelineStart: function () {
        const list = this.barrageList;
        const barrageStart = this.barrageTimelineStart;
        for (let n = 0; n < list.length; n++) {
          if (list[n].startTime >= barrageStart) {
            this.barragedTag = n;
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

  .player-barrage-wrap >>> .barrage {
    white-space: pre;
    position: absolute;
    text-shadow: #000 1px 0px 1px, #000 0px 1px 1px, #000 0px -1px 1px, #000 -1px 0px 1px;
  }

  .player-barrage-wrap >>> .barrage-center {
    z-index: 1;
    left: 50%;
    transform: translateX(-50%);
    -webkit-transform: translateX(-50%);
    -o-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
  }

  .player-barrage-wrap >>> .barrage-bottom {
    bottom: 0;
  }

  .player-barrage-wrap >>> .barrage-scroll {
    left: 100%;
    animation: horizontal-scroll 7s linear 0s;
    animation-play-state: var(--animationPlayState)!important;
  } 
</style>
<style>
  @keyframes horizontal-scroll {
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
