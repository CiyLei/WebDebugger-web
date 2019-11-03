<template>
    <div style="width: 20%; float: left; min-width: 300px;height: 300px;" @click="down">
        <el-image :src="url" style="margin: 20px 20px 20px; height: 230px; width: 80%" v-if="!isMp4">
            <div slot="placeholder" class="image-slot">
                加载中<span class="dgot">...</span>
            </div>
        </el-image>
        <div id="no-image" v-if="isMp4">
            <i class="el-icon-video-camera"></i>
        </div>
        <div style="float: none"></div>
        <div style="text-align:center"><code>{{name}}</code></div>
    </div>
</template>

<script>
    export default {
        name: "ScreenImageView",
        props: {
            url: String
        },
        data() {
            let arr = this.url.split('/')
            return {
                name: arr[arr.length - 1],
            }
        },
        computed: {
            isMp4() {
                let target = ".mp4"
                let start = this.url.length - target.length;
                let arr = this.url.substr(start, target.length);
                if (arr === target) {
                    return true;
                }
                return false;
            }
        },
        methods: {
            down() {
                var a = document.createElement('a')
                a.href = this.url
                a.download = this.url
                a.click()
                a.remove()
            }
        }
    }
</script>

<style scoped>
    .el-image {
        cursor: pointer;
    }

    #no-image {
        height: 230px;
        background-color: rgb(245, 247, 250);
        margin: 20px 20px 20px;
        font-size: 50px;
        align-items: center;
        justify-content: center;
        display: flex;
        cursor: pointer;
    }
</style>