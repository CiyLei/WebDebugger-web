<template>
    <el-container style="min-width: 700px; min-height: 600px">
        <el-header>
            <el-menu
                    style="min-width: 700px"
                    :default-active="activeIndex"
                    background-color="#0984e3"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                    class="el-menu-demo"
                    mode="horizontal"
                    @select="handleSelect">
                <el-menu-item index="1">设备信息</el-menu-item>
                <el-menu-item index="2">Logcat</el-menu-item>
                <el-menu-item index="3">网络日志</el-menu-item>
                <el-menu-item index="4">截屏/录屏</el-menu-item>
                <el-menu-item index="5">切换环境</el-menu-item>
                <el-menu-item index="6" disabled>数据库操作（敬请期待）</el-menu-item>
            </el-menu>
        </el-header>
        <el-main style="padding: 0px">
            <router-view></router-view>
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