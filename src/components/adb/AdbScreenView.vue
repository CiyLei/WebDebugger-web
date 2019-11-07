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

                if (isMove) {
                    console.log("move", downX, downY, e.offsetX, e.offsetY)
                } else {
                    if (new Date().getTime() - downTime > 1000) {
                        console.log("long", downX, downY)
                    } else {
                        console.log("click", downX, downY)
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
                    ctx.arc(downX, downY, 10, 0,2*Math.PI)
                    ctx.stroke();

                }
            },
            clearCanvas(canvas) {
                var ctx = canvas.getContext("2d")
                ctx.fillStyle=canvas.style.backgroundColor
                ctx.beginPath();
                ctx.fillRect(0,0,canvas.width,canvas.height);
                ctx.closePath();
            }
        }
    }
</script>

<style scoped>

</style>