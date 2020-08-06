<template>
  <div class="container">
    <div class="video-wrap">
      <barrageVideoplayer width="100%"></barrageVideoplayer>
    </div>
    <br v-for="n in 1" :key="n">
  </div>
</template>

<script>
import barrageVideoplayer from '../components/barrage-videoplayer.vue'

export default {
  components: {
    barrageVideoplayer
  }
};
</script>

<style scoped>
.container {
  margin: auto;
  max-width: 1000px;
}
</style>