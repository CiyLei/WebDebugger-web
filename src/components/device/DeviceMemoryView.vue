<template>
    <div id="deviceMemoryView" style="height: 300px"></div>
</template>

<script>
    export default {
        name: "DeviceMemoryView",
        watch: {
            "$store.state.deviceTotalMemData": function () {

                let chart = this.$echarts.init(document.getElementById('deviceMemoryView'));

                var date = this.$store.state.deviceDate;
                var totalMemData = this.$store.state.deviceTotalMemData
                var totalPrivateDirty = this.$store.state.deviceTotalPrivateDirty;
                var totalPss = this.$store.state.deviceTotalPss;

                let option = {
                    title: {
                        left: 'left',
                        text: '内存监控'
                    },
                    animation: false,
                    legend: {
                        left: 'right',
                        data: ['空闲内存（MB）', '应用实际占用大小（MB）', '应用占用大小（MB）'],
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: date
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '空闲内存（MB）',
                            type: 'line',
                            smooth: true,
                            itemStyle: {
                                color: 'rgb(223, 230, 233)'
                            },
                            areaStyle: {
                                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgb(223, 230, 233)'
                                }, {
                                    offset: 1,
                                    color: 'rgb(223, 230, 233)'
                                }])
                            },
                            data: totalMemData
                        },
                        {
                            name: '应用实际占用大小（MB）',
                            type: 'line',
                            smooth: true,
                            itemStyle: {
                                color: 'rgb(103,208,165)'
                            },
                            areaStyle: {
                                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgb(103,208,165)'
                                }, {
                                    offset: 1,
                                    color: 'rgb(103,208,165)'
                                }])
                            },
                            data: totalPss
                        },
                        {
                            name: '应用占用大小（MB）',
                            type: 'line',
                            smooth: true,
                            itemStyle: {
                                color: 'rgb(48,126,163)'
                            },
                            areaStyle: {
                                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgb(48,126,163)'
                                }, {
                                    offset: 1,
                                    color: 'rgb(48,126,163)'
                                }])
                            },
                            data: totalPrivateDirty
                        },
                    ]
                };
                chart.setOption(option);
            }
        }
    }
</script>

<style scoped>

</style>