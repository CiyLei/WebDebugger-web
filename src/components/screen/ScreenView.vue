<template>
    <div>
        <el-alert
                title="警告：如果你是的手机版本是Android5.1（SDK：22）的话，在申请截屏/录屏权限的时候千万不要勾选“不再提示”，如果不慎勾选请在设置中关闭，实在不行请重装App，否则此功能会导致App奔溃。"
                type="error"
                center
                show-icon>
        </el-alert>
        <div style="margin-top: 80px">
            <ScrrenImageView v-for="item in mediaList" v-bind:url="item" v-bind:key="item"></ScrrenImageView>
        </div>
        <el-tooltip class="item" effect="dark" content="刷新" placement="bottom">
            <el-button icon="el-icon-refresh" circle @click="getList" style="position: fixed; left: 20px; top: 120px"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="截屏" placement="bottom">
            <el-button icon="el-icon-camera" circle @click="screenCapture" style="position: fixed; left: 70px; top: 120px"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="开始录屏" placement="bottom">
            <el-button icon="el-icon-video-camera" circle @click="startScreenRecording" style="position: fixed; left: 130px; top: 120px"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="结束录屏" placement="bottom">
            <el-button icon="el-icon-switch-button" circle @click="stopScreenRecording" style="position: fixed; left: 190px; top: 120px"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="清除" placement="bottom">
            <el-button icon="el-icon-delete" circle @click="clean" style="position: fixed; left: 250px; top: 120px"></el-button>
        </el-tooltip>
        <div style="clear:both"></div>
        <footer style="height: 50px"></footer>
    </div>
</template>

<script>
    import ScrrenImageView from "./ScreenImageView"
    import * as URL from '../../UrlConstant'

    export default {
        name: "ScreenView",
        mounted() {
            if (this.$store.state.deviceInfoWebSocketPort === 0) {
                this.$router.push("/")
            }
        },
        computed: {
            mediaList() {
                return this.$store.state.mediaList
            }
        },
        components: {
            ScrrenImageView,
        },
        methods: {
            screenCapture() {
                this.axios.get(URL.SCREEN_CAPTURE).then((resp) => {
                    if (resp.data.success) {
                        this.$message({
                            message: '申请截屏成功',
                            type: 'success'
                        })
                    } else {
                        this.$message({
                            showClose: true,
                            message: resp.data.message,
                            type: 'error',
                        })
                    }
                })
            },
            getList() {
                this.axios.get(URL.MEDIA_LIST).then((resp) => {
                    if (resp.data.success) {
                        this.$store.state.mediaList = []
                        for (let index in resp.data.data.list) {
                            let path = resp.data.data.list[index]
                            let local = window.location.protocol + "//" + window.location.hostname + ":" + this.$store.state.resourcePort + "/" + path
                            this.$store.state.mediaList.unshift(local)
                        }
                    } else {
                        this.$message({
                            showClose: true,
                            message: resp.data.message,
                            type: 'error',
                        })
                    }
                })
            },
            clean() {
                this.axios.get(URL.MEDIA_CLEAN).then((resp) => {
                    if (resp.data.success) {
                        this.$message({
                            message: '清除成功',
                            type: 'success',
                            showClose: true,
                        })
                        this.getList()
                    } else {
                        this.$message({
                            showClose: true,
                            message: resp.data.message,
                            type: 'error',
                        })
                    }
                })
            },
            startScreenRecording() {
                this.axios.get(URL.START_SCREEN_RECORDING).then((resp) => {
                    if (resp.data.success) {
                        this.$message({
                            message: '申请开始录屏成功',
                            type: 'success'
                        })
                    } else {
                        this.$message({
                            showClose: true,
                            message: resp.data.message,
                            type: 'error',
                        })
                    }
                })
            },
            stopScreenRecording() {
                this.axios.get(URL.STOP_SCREEN_RECORDING).then((resp) => {
                    if (resp.data.success) {
                        this.$message({
                            message: '申请结束录屏成功',
                            type: 'success'
                        })
                    } else {
                        this.$message({
                            showClose: true,
                            message: resp.data.message,
                            type: 'error',
                        })
                    }
                })
            },
        },
    }
</script>