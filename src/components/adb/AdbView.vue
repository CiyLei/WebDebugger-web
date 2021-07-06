<template>
    <div>
        <el-container>
            <el-aside width="500px">
                <div style="background-color: rgb(253,246,236); width: 420px; margin-top: 20px; margin-left: 30px;margin-bottom: 30px; padding: 10px;">
                    <p><b>使用说明</b></p>
                    1.只能有一台手机连上电脑，且开启usb调试 <br/>
                    2.下载 <a
                        href="https://raw.githubusercontent.com/CiyLei/AdbProxyInstall/master/AdbProxyInstall/bin/Debug/AdbProxyInstall.exe">AdbProxyInstall</a>
                    程序并安装
                </div>

                <div style="width: 500px" v-loading="isLoading">
                    <el-image :src="require('../../assets/phone.webp')"></el-image>
                </div>
                <div style="position: absolute; width: 60px; height: 60px; top: 900px; left: 100px;"
                     @click="handleSendId" id="4"></div>
                <div style="position: absolute; width: 60px; height: 60px; top: 900px; left: 178px;"
                     @click="handleSendId" id="82"></div>
                <div style="position: absolute; width: 60px; height: 60px; top: 900px; left: 256px;"
                     @click="handleSendId" id="84"></div>
                <div style="position: absolute; width: 60px; height: 60px; top: 900px; left: 334px;"
                     @click="handleSendId" id="3"></div>
                <div style="position: absolute; width: 30px; height: 65px; top: 430px; left: 40px;"
                     @click="handleSendId" id="24"></div>
                <div style="position: absolute; width: 30px; height: 65px; top: 495px; left: 40px;"
                     @click="handleSendId" id="25"></div>
                <div style="position: absolute; width: 30px; height: 80px; top: 360px; left: 435px; "
                     @click="handleSendId" id="26"></div>
                <AdbScreenView
                        style="position: absolute; background-color: rgb(51,153,102); left: 280px; top: 275px;"></AdbScreenView>
            </el-aside>
            <el-main>
                <h2>自定义ADB命令</h2>
                <el-input v-model="adbShell" placeholder="请输入内容" style="width: 350px;"></el-input>
                <el-button icon="el-icon-right" circle style="margin-left: 10px; margin-top: 10px"
                           @click="handleSendShellButton"></el-button>

                <h2>发送文字</h2>
                <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="textarea">
                </el-input>
                <el-button icon="el-icon-right" circle style=" margin-top: 10px"
                           @click="handleSendTextButton"></el-button>
                <h2>快捷按键</h2>

                <h3>功能键</h3>
                <el-button @click="handleSendId" id="5">拨号键</el-button>
                <el-button @click="handleSendId" id="6">挂机键</el-button>
                <el-button @click="handleSendId" id="27">拍照键</el-button>
                <el-button @click="handleSendId" id="80">拍照对焦键</el-button>
                <el-button @click="handleSendId" id="83">通知键</el-button>
                <el-button @click="handleSendId" id="91">话筒静音键</el-button>
                <el-button @click="handleSendId" id="164">扬声器静音键</el-button>

                <h3>控制键</h3>
                <el-button @click="handleSendId" id="66">回车键</el-button>
                <el-button @click="handleSendId" id="111">ESC键</el-button>
                <el-button @click="handleSendId" id="23">导航键 确定键</el-button>
                <el-button @click="handleSendId" id="19">导航键 向上</el-button>
                <el-button @click="handleSendId" id="20">导航键 向下</el-button>
                <el-button @click="handleSendId" id="21">导航键 向左</el-button>
                <el-button @click="handleSendId" id="22">导航键 向右</el-button>
                <el-button @click="handleSendId" id="122">光标移动到开始键</el-button>
                <el-button @click="handleSendId" id="123">光标移动到末尾键</el-button>
                <el-button @click="handleSendId" id="92">向上翻页键</el-button>
                <el-button @click="handleSendId" id="93">向下翻页键</el-button>
                <el-button @click="handleSendId" id="67">退格键</el-button>
                <el-button @click="handleSendId" id="112">删除键</el-button>
                <el-button @click="handleSendId" id="124">插入键</el-button>
                <el-button @click="handleSendId" id="61">Tab键</el-button>
                <el-button @click="handleSendId" id="143">小键盘锁</el-button>
                <el-button @click="handleSendId" id="115">大写锁定键</el-button>
                <el-button @click="handleSendId" id="121">Break/Pause键</el-button>
                <el-button @click="handleSendId" id="116">滚动锁定键</el-button>
                <el-button @click="handleSendId" id="168">放大键</el-button>
                <el-button @click="handleSendId" id="169">缩小键</el-button>
            </el-main>
        </el-container>
        <h1 style="margin: 20px">快捷命令</h1>
        <div style="padding-left: 20px">
            <el-tooltip class="item" effect="dark" content="需要回到截屏/录屏页手动刷新" placement="bottom">
                <el-button @click="hanleScreenCaptureButton">截屏</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="需要回到截屏/录屏页手动刷新" placement="bottom">
                <el-button @click="hanleScreenRecordingButton(10)">录屏10秒</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="需要回到截屏/录屏页手动刷新" placement="bottom">
                <el-button @click="hanleScreenRecordingButton(20)">录屏20秒</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="需要回到截屏/录屏页手动刷新" placement="bottom">
                <el-button @click="hanleScreenRecordingButton(30)">录屏30秒</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="需要回到截屏/录屏页手动刷新" placement="bottom">
                <el-button @click="hanleScreenRecordingButton(60)">录屏1分钟</el-button>
            </el-tooltip>
        </div>
        <div style="height: 150px"></div>
    </div>
</template>

<script>
    import AdbScreenView from './AdbScreenView'
    import * as URL from '../../UrlConstant'

    // var powerDownTime = false

    export default {
        name: "AdbView",
        data() {
            return {
                adbShell: '',
                textarea: ''
            }
        },
        computed: {
            isLoading() {
                return this.$store.state.deviceScreenWidth === 0
            },
        },
        methods: {
            handleSendId(e) {
                if (e.target.id !== "") {
                    this.sendAdbShellInputCode(e.target.id)
                } else if (e.target.parentElement.id !== "") {
                    this.sendAdbShellInputCode(e.target.parentElement.id)
                }
            },
            // 长按要间隔 算了
            handlePowerDown() {
                // powerDownTime = new Date().getTime()
            },
            handlePowerUp() {
                // if (new Date().getTime() - powerDownTime > 1000) {
                //     console.log("long handlePower")
                //     this.sendAdbShell("shell sendevent  /dev/input/event0 1 116 1;shell sendevent  /dev/input/event0 0 0 0;")
                // } else {
                //     console.log("click handlePower")
                //     this.sendAdbShellInputCode(26)
                // }
            },
            sendAdbShell(shell) {
                var a = document.createElement('a')
                a.href = "adbshell://" + window.btoa(shell)
                a.click()
                a.remove()
            },
            sendAdbShellInputCode(inputCode) {
                this.sendAdbShell("shell input keyevent " + inputCode)
            },
            handleSendShellButton() {
                this.sendAdbShell(this.adbShell)
            },
            handleSendTextButton() {
                this.sendAdbShell("shell input text " + this.textarea)
            },
            hanleScreenCaptureButton() {
                var saveFile = this.$store.state.mediaCachePath + this.formatDate(new Date()) + "_ADB" + ".png"
                this.sendAdbShell("shell screencap -p " + saveFile)
            },
            hanleScreenRecordingButton(e) {
                var saveFile = this.$store.state.mediaCachePath + this.formatDate(new Date()) + "_ADB" + ".mp4"
                this.sendAdbShell("shell screenrecord --time-limit " + e + " " + saveFile)
            },
            formatDate(now) {
                var year = now.getFullYear();  //取得4位数的年份
                var month = now.getMonth() + 1;  //取得日期中的月份，其中0表示1月，11表示12月
                var date = now.getDate();      //返回日期月份中的天数（1到31）
                var hour = now.getHours();     //返回日期中的小时数（0到23）
                var minute = now.getMinutes(); //返回日期中的分钟数（0到59）
                var second = now.getSeconds(); //返回日期中的秒数（0到59）
                return year + "-" + this.f2S(month) + "-" + this.f2S(date) + "_" + this.f2S(hour) + ":" + this.f2S(minute) + ":" + this.f2S(second);
            },
            f2S(val) {
                if (val < 10) {
                    return "0" + val
                }
                return val
            }
        },
        components: {
            AdbScreenView,
        },
        mounted() {
            if (this.$store.state.deviceScreenWidth === 0) {
                this.axios.get(URL.GET_ADB_NEED_INFO).then((resp) => {
                    if (resp.data.success) {
                        this.$store.state.deviceScreenWidth = resp.data.data.width
                        this.$store.state.deviceScreenHeight = resp.data.data.height
                        this.$store.state.mediaCachePath = resp.data.data.mediaCachePath
                    } else {
                        this.$message({
                            showClose: true,
                            message: resp.data.message,
                            type: 'error',
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped>

    .el-button {
        margin-left: 0px;
        margin-top: 10px;
        margin-right: 10px;
    }
</style>