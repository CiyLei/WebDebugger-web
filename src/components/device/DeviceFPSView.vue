<template>
    <div id="deviceFpsView" style="height: 300px"></div>
</template>

<script>
    export default {
        name: "DeviceFPSView",
        watch: {
            '$store.state.deviceFPS': function () {
                let chart = this.$echarts.init(document.getElementById('deviceFpsView'));

                var date = this.$store.state.deviceDate;
                var data = this.$store.state.deviceFPS;

                let option = {
                    tooltip: {
                        trigger: 'axis',
                    },
                    title: {
                        left: 'left',
                        text: 'FPS 监控',
                    },
                    animation: false,
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: date,
                    },
                    yAxis: {
                        type: 'value',
                        boundaryGap: [0, '100%']
                    },
                    series: [
                        {
                            name: 'FPS',
                            type: 'line',
                            smooth: true,
                            symbol: 'none',
                            sampling: 'average',
                            itemStyle: {
                                color: 'rgb(0, 184, 148)'
                            },
                            areaStyle: {
                                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgb(0, 184, 148)'
                                }, {
                                    offset: 1,
                                    color: 'rgb(255, 118, 117)'
                                }])
                            },
                            data: data
                        }
                    ]
                };
                chart.setOption(option);
            }
        }
    }
</script>

<style scoped>

</style>