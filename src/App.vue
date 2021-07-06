<template>
  <el-container style="min-width: 800px; min-height: 600px">
    <el-aside
      style="
        background-color: #0984e3;
        width: 200px;
        overflow-y: auto;
        overflow-x: hidden;
      "
    >
      <el-menu
        :default-active="activeIndex"
        background-color="#0984e3"
        text-color="#fff"
        active-text-color="#ffd04b"
        class="el-menu-demo"
        @select="handleSelect"
      >
        <el-submenu index="1">
          <template slot="title">
            <span>系统功能</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="1">设备信息</el-menu-item>
            <el-menu-item index="2">界面</el-menu-item>
            <el-menu-item index="3">控制台</el-menu-item>
            <el-menu-item index="4">网络日志</el-menu-item>
            <el-menu-item index="5">截屏/录屏</el-menu-item>
            <el-menu-item index="6">数据库操作</el-menu-item>
            <el-menu-item index="7">切换环境</el-menu-item>
            <el-menu-item index="8">Logcat</el-menu-item>
            <el-menu-item index="9">Api清单</el-menu-item>
            <el-menu-item index="10">安装Apk</el-menu-item>
            <el-menu-item index="11">Adb支持</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="100" v-if="hasRouterNavigation">
          <template slot="title">
            <span>自定义功能</span>
          </template>
          <el-menu-item-group>
            <el-menu-item
              v-for="(item, index2) in routerNavigation"
              v-bind:key="'2-' + item + index2"
              v-bind:index="(12 + index2)"
              >{{ item.name }}</el-menu-item
            >
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-main style="padding: 0px; margin-left: 200px">
      <router-view :key="$route.fullPath"></router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {
  computed: {
    activeIndex() {
      return this.$store.state.activeIndex;
    },
    hasRouterNavigation() {
      return this.$store.state.routerNavigation.length > 0;
    },
    routerNavigation() {
      return this.$store.state.routerNavigation;
    },
  },
  created() {
    // 保存第一次进这个界面的时候，菜单选择是正确的
    const path = this.$route.path;
    const index =
      this.$routes.findIndex((it) => {
        return it.path === path;
      }) + 1;
    this.$store.state.activeIndex = index.toString();
  },
  watch: {
    // 保证路由跳转的时候，菜单选择是正确的
    "$route.path": function () {
      const path = this.$route.path;
      const index =
        this.$routes.findIndex((it) => {
          return it.path === path;
        }) + 1;
      this.$store.state.activeIndex = index.toString();
    },
  },
  methods: {
    handleSelect(key) {
      const path = this.$router.history.current.path;
      if (path !== this.$routes[key - 1].path) {
        this.$router.push(this.$routes[key - 1].path);
      }
    },
    downLog() {
      const log = {
        logCat: this.$store.state.logcatList,
        netList: this.$store.state.netList,
      };
      const logText = JSON.stringify(log, null, 4);
      const urlObject = window.URL || window.webkitURL || window;
      const export_blob = new Blob([logText]);
      const save_link = document.createElement("a");
      save_link.href = urlObject.createObjectURL(export_blob);
      save_link.download =
        "Android调试日志" + new Date().toLocaleString() + ".json";
      save_link.click();

      this.$confirm("是否清空现在的日志", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$store.state.logcatList = [];
        this.$store.state.netList = [];
      });
    },
  },
};
</script>

<style scoped>
.el-header {
  padding: 0px;
}

.el-aside {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  bottom: 0;
}

.el-aside >>> i {
  color: #fff;
}
</style>
