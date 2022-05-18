<template>
  <div class="home">
    <div class="catalog-mobile">
      <h5>
        <a
          target="_blank"
          href="https://github.com/yleencc/vue-barrage-videoplayer"
        >
          Author: 月琳cc
        </a>
      </h5>
      <span>
        样例：
        <select
          v-model="selectedNavPath"
          class="nav-select"
          @change="onChangeSelectedNavItem"
        >
          <option v-for="item in navList" :key="item.path" :value="item.path">
            {{ item.name }}
          </option>
        </select>
      </span>
    </div>
    <div class="catalog">
      <div class="catalog-title">
        <h2>播放器样例</h2>
        <h5>
          <a
            target="_blank"
            href="https://github.com/yleencc/vue-barrage-videoplayer"
          >
            @vue-barrage-videoplayer
          </a>
          <p>Author: 月琳cc</p>
        </h5>
        <hr color="#abc" size="1" />
      </div>
      <nav class="nav-list">
        <router-link
          v-for="item in navList"
          :key="item.path"
          :class="{ 'nav-item': true, active: item.path == $route.path }"
          :to="item.path"
        >
          {{ item.name }}
        </router-link>
      </nav>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navList: [
        {
          path: "/simple",
          name: "简单样例",
        },
        {
          path: "/mpegts",
          name: "引入mpegts.js库",
        },
      ],
      selectedNavPath: null, // 当前选中高亮的路径
    };
  },
  created() {
    this.selectedNavPath = this.$route.path;
  },
  methods: {
    onChangeSelectedNavItem(e) {
      this.$router.push(e.target.value);
    },
  },
  watch: {
    // $route: function (to) {
    //   // 路由改变时执行
    //   console.info("to.path:" + to.path);
    // },
  },
};
</script>

<style scoped>
a {
  color: #456789;
}
.home {
  --primaryColor: #6789ab;
}
.home > .catalog {
  text-align: left;
  background: #fff;
  position: fixed;
  width: 12rem;
  top: 0;
  left: 0;
  bottom: 0;
  transition: transform 0.2s;
}
.home > .catalog-mobile {
  display: none;
  background: slategrey;
  height: 45px;
  color: white;
  box-shadow: #555 0 0 4px;
  justify-content: space-around;
  align-items: center;
}
.home > .catalog-mobile a {
  color: white;
}
.home > .catalog > .catalog-title {
  margin: 1rem 1.5rem;
}
.home > .catalog > .catalog-title p {
  margin: 0.25rem 0;
  font-weight: normal;
}
.nav-item {
  padding: 0.5rem 1.5rem;
  display: inline-block;
  color: #333;
  white-space: nowrap;
  text-decoration: none;
  transition: color 0.2s;
}
.nav-item:hover {
  color: var(--primaryColor);
}
.nav-item.active {
  color: var(--primaryColor);
  font-weight: bold;
  position: relative;
}
.nav-item.active::before {
  content: "";
  position: absolute;
  background: #6789ab;
  width: 4px;
  left: 0;
  top: 0;
  bottom: 0;
}
.content {
  margin-left: 12rem;
  padding: 2.5%;
  transition: margin-left 0.3s;
}
@media (max-width: 789px) {
  .home > .catalog > .catalog-title {
    margin: 1rem;
  }
  .nav-item {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .nav-item {
    font-size: 0.85rem;
  }
}
@media (max-width: 567px) {
  .home > .catalog-mobile {
    display: flex;
  }
  .home > .catalog {
    transform: translateX(-100%);
  }
  .content {
    margin-left: unset;
  }
}
</style>