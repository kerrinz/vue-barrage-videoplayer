<template>
  <div class="container">
    <div class="video-wrap" v-for="n in 2" :key="n">
      <barrageVideoplayer :name="n" :src="video_src" :barrage_list="barrage_list" width="100%" height="100%"></barrageVideoplayer>
    </div>
    <div class="video-src">{{ video_src }}</div>
    <div class="upload-btn">
      <input type="file" @change="onInputFileChange" />
      <span>选择本地视频</span>
    </div>
  </div>
</template>

<script>
import barrageVideoplayer from "../components/barrage-videoplayer.vue";
import axios from "axios";

export default {
  components: {
    barrageVideoplayer,
  },
  data() {
    return {
      video_src: "https://recomi.site/files/videos/output.mp4",
      barrage_src: "/api_bilibili/x/v1/dm/list.so?oid=131068",
      barrage_list: [],
    };
  },
  created() {
    axios({
      method: "get",
      url: this.barrage_src,
      data: {},
    }).then((res) => {
      var xmlDoc = new DOMParser().parseFromString(res.data, "text/xml");
      var elements = xmlDoc.getElementsByTagName("d");
      var array = [];
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
  methods: {
    // 选择文件后将地址配置到视频上
    onInputFileChange(e) {
      let url = URL.createObjectURL(e.currentTarget.files[0]);
      this.video_src = url;
    },
  },
};
</script>

<style scoped>
.container {
  margin: auto;
  max-width: 1000px;
}
.video-wrap {
  display: inline-flex;
  width: 100%;
  max-height: 600px;
  background: #000;
}
.video-src {
  margin: 0.4rem 0;
}
.upload-btn {
  display: inline-block;
  position: relative;
  padding: 4px 10px;
  margin: 0.4rem 0;
  color: #888;
  background: #fafafa;
  color: #0082ba;
  border: 1px solid #5c9bb6;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}
.upload-btn:hover {
  background: #5c9bb6;
  color: #fafafa;
}
.upload-btn input {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
}
.upload-btn input::after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  cursor: pointer;
}
</style>