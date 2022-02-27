<template>
  <div id="app">
    <previewVideoplayer></previewVideoplayer>
  </div>
</template>

<script>
import previewVideoplayer from "./views/preview-videoplayer.vue";

export default {
  name: "App",
  components: {
    previewVideoplayer,
  },
  data() {
    return {};
  },
};
</script>

<style>
body {
  background: #f5f5f5;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body,
div {
  margin: 0;
  padding: 0;
}
</style>
