<template>
    <el-container style="min-width: 800px; min-height: 600px">
        <el-header>
            <el-menu
                    style="min-width: 900px"
                    :default-active="activeIndex"
                    background-color="#0984e3"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                    class="el-menu-demo"
                    mode="horizontal"
                    @select="handleSelect">
                <el-menu-item index="1">设备信息</el-menu-item>
                <el-menu-item index="2">Logcat</el-menu-item>
                <el-menu-item index="3">截屏/录屏</el-menu-item>
                <el-menu-item index="4">网络日志</el-menu-item>
                <el-menu-item index="5">切换环境</el-menu-item>
                <el-menu-item index="6">Api清单</el-menu-item>
                <el-menu-item index="7">Adb支持</el-menu-item>
                <el-menu-item index="8" disabled>数据库操作（敬请期待）</el-menu-item>
            </el-menu>
        </el-header>
        <el-main style="padding: 0px">
            <router-view></router-view>
            <div style="position: fixed; right: 60px; top: 80px">
                <el-tooltip class="item" effect="dark" content="导出日志" placement="bottom">
                    <el-button icon="el-icon-download" type="primary" circle @click="downLog"></el-button>
                </el-tooltip>
            </div>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        computed: {
            activeIndex() {
                return this.$store.state.activeIndex
            }
        },
        created() {
            // 保存第一次进这个界面的时候，菜单选择是正确的
            const path = this.$route.path
            const index = this.$routes.findIndex((it) => {
                return it.path === path
            }) + 1
            this.$store.state.activeIndex = index.toString()
        },
        watch: {
            // 保证路由跳转的时候，菜单选择是正确的
            '$route.path': function () {
                const path = this.$route.path
                const index = this.$routes.findIndex((it) => {
                    return it.path === path
                }) + 1
                this.$store.state.activeIndex = index.toString()
            }
        },
        methods: {
            handleSelect(key) {
                const path = this.$router.history.current.path;
                if (path !== this.$routes[key - 1].path) {
                    this.$router.push(this.$routes[key - 1].path)
                }
            },
            downLog() {
                const log = {
                    "logCat": this.$store.state.logcatList,
                    "netList": this.$store.state.netList
                }
                const logText = JSON.stringify(log, null, 4)
                const urlObject = window.URL || window.webkitURL || window;
                const export_blob = new Blob([logText]);
                const save_link = document.createElement("a");
                save_link.href = urlObject.createObjectURL(export_blob);
                save_link.download = "Android调试日志" + new Date().toLocaleString() + ".json";
                save_link.click()

                this.$confirm('是否清空现在的日志', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.state.logcatList = []
                    this.$store.state.netList = []
                })
            }
        },
    }
</script>

<style scoped>
    .el-header {
        padding: 0px;
    }

    .el-menu {
        position: static;
        z-index: 999;
        top: 0;
        left: 0;
        right: 0;;
    }
</style>
g