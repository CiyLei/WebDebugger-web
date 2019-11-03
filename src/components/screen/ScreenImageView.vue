<template>
    <div style="width: 20%; float: left; min-width: 300px;height: 330px; text-align:center;">
        <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04); margin: 10px; padding: 20px">
            <el-image :src="url" :fit="fit" style=" height: 230px; width: 80%; cursor: pointer" v-if="!isMp4"
                      @click="down">
                <div slot="placeholder" class="image-slot">
                    加载中<span class="dgot">...</span>
                </div>
            </el-image>
            <video id="video" controls="controls" style="height: 230px; width: 80%" v-if="isMp4">
                <source v-bind:src="url">
            </video>
            <div style="float: none"></div>
            <div style="text-align:center; margin-top: 10px"><code>{{name}}</code></div>
        </div>
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
                fit: "contain"
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
                a.target = this.url
                a.click()
                a.remove()
            }
        }
    }
</script>

<style scoped>
</style>