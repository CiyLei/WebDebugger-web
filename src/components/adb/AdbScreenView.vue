<template>
    <canvas width="340" height="560" @mousedown="mousedown" @mouseup="mouseup" @mousemove="mousemove">
    </canvas>
</template>

<script>
    var isDown = false
    var downTime = false
    var isMove = false
    var downX, downY;
    export default {
        name: "AdbScreenView",
        methods: {
            mousedown(e) {
                downX = e.offsetX
                downY = e.offsetY
                isDown = true
                downTime = new Date().getTime()
            },
            mouseup(e) {
                isDown = false
                this.clearCanvas(e.target)

                var absDownX = parseInt(downX / e.target.width * this.$store.state.deviceScreenWidth)
                var absDownY = parseInt(downY / e.target.height * this.$store.state.deviceScreenHeight)
                var absX = parseInt(e.offsetX / e.target.width * this.$store.state.deviceScreenWidth)
                var absY = parseInt(e.offsetY / e.target.height * this.$store.state.deviceScreenHeight)

                if (isMove) {
                    // console.log("move")
                    this.sendAdbShell("shell input swipe " + absDownX + " " + absDownY + " " + absX + " " + absY + " 300")
                } else {
                    if (new Date().getTime() - downTime > 1000) {
                        // console.log("long")
                        this.sendAdbShell("shell input swipe " + absDownX + " " + absDownY + " " + absDownX + " " + absDownY + " 800")
                    } else {
                        // console.log("click")
                        this.sendAdbShell("shell input tap " + absDownX + " " + absDownY)
                    }
                }
                isMove = false
            },
            mousemove(e) {
                if (isDown) {
                    isMove = true

                    var ctx = e.target.getContext("2d")

                    this.clearCanvas(e.target)

                    ctx.beginPath()
                    ctx.lineWidth = 2

                    ctx.moveTo(downX, downY)
                    ctx.lineTo(e.offsetX, e.offsetY)
                    ctx.stroke();

                    ctx.beginPath()
                    ctx.arc(downX, downY, 10, 0, 2 * Math.PI)
                    ctx.stroke();

                }
            },
            clearCanvas(canvas) {
                var ctx = canvas.getContext("2d")
                ctx.fillStyle = canvas.style.backgroundColor
                ctx.beginPath();
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.closePath();
            },
            sendAdbShell(shell) {
                var a = document.createElement('a')
                a.href = "adbshell://" + window.btoa(shell)
                a.click()
                a.remove()
            },
        }
    }
</script>

<style scoped>

</style>