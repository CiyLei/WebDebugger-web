<template>
    <div style="padding: 20px;">
        <h1>上传Apk安装</h1>
        <el-upload 
            class="upload-demo"
            :action="installFromUpload"
            :before-upload="beforeAvatarUpload"
            drag>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将apk拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传apk文件</div>
        </el-upload>
        <h1>通过Url安装</h1>
        <el-input
            placeholder="请输入Url"
            v-model="inputUrl"
            style="width: 600px;"
            clearable>
        </el-input>
        <el-button @click="handleInputUrlClick" type="primary" plain style="margin-left: 8px;">下载安装</el-button>
    </div>
</template>

<script>
    import * as URL from '../../UrlConstant'

    export default {
        name: "InstallView",
        data() {
            return {
                installFromUpload: URL.INSTALL_FROM_UPLOAD,
                inputUrl: ""
            }
        },
        methods: {
            beforeAvatarUpload(file) {
                const isApk = file.type === 'application/vnd.android.package-archive'
                if (!isApk) {
                    this.$message.error('上传apk文件!')
                }
                return isApk
            },
            handleInputUrlClick() {
                this.axios.get(URL.INSTALL_FROM_URL, {
                    params: {
                        url: this.inputUrl
                    }
                }).then((resp) => {
                    if (resp.data.success) {
                        this.$message({
                            showClose: true,
                            message: '执行成功',
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
            }
        },
    }
</script>