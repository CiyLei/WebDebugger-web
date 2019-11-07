<template>
    <el-container>
        <el-aside width="500px">
            <div style="position: fixed; top: 120px; width: 500px">
                <el-image :src="require('../../assets/phone.webp')"></el-image>
            </div>
            <div style="position: fixed; width: 60px; height: 60px; top: 800px; left: 100px;" @click="handleBack"></div>
            <div style="position: fixed; width: 60px; height: 60px; top: 800px; left: 178px;" @click="handleMenu"></div>
            <div style="position: fixed; width: 60px; height: 60px; top: 800px; left: 256px;" @click="handleSearch"></div>
            <div style="position: fixed; width: 60px; height: 60px; top: 800px; left: 334px;" @click="handleHome"></div>
            <div style="position: fixed; width: 30px; height: 65px; top: 320px; left: 40px;" @click="handleVolumePlus"></div>
            <div style="position: fixed; width: 30px; height: 65px; top: 385px; left: 40px;" @click="handleVolumeLess"></div>
            <div style="position: fixed; width: 30px; height: 80px; top: 250px; left: 435px; " @mousedown="handlePowerDown" @mouseup="handlePowerUp"></div>
            <AdbScreenView style="position: fixed; background-color: rgb(51,153,102); left: 80px; top: 230px;"></AdbScreenView>
        </el-aside>
        <el-main>Main</el-main>
    </el-container>
</template>

<script>
    import AdbScreenView from './AdbScreenView'

    var powerDownTime = false

    export default {
        name: "AdbView",
        methods: {
            handleBack() {
                console.log("handleBack")
            },
            handleMenu() {
                console.log("handleMenu")
            },
            handleSearch() {
                console.log("handleSearch")
            },
            handleHome() {
                console.log("handleHome")
            },
            handleVolumePlus() {
                console.log("handleVolumePlus")
            },
            handleVolumeLess() {
                console.log("handleVolumeLess")
            },
            handlePowerDown() {
                powerDownTime = new Date().getTime()
            },
            handlePowerUp() {
                if (new Date().getTime() - powerDownTime > 1000) {
                    console.log("long handlePower")
                } else {
                    console.log("click handlePower")
                }
            },
        },
        components: {
            AdbScreenView,
        }
    }
</script>

<style scoped>

</style>