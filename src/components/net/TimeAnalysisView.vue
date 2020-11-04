<template>
    <div id="timeAnalysisChartView" style="height: 500px"></div>
</template>

<script>
    export default {
        name: "TimeAnalysisView",
        props: {
            requestInfo: {}
        },
        mounted: function () {
            // console.log(this.requestInfo)
            let chart = this.$echarts.init(document.getElementById('timeAnalysisChartView'));
            let analysisData = []
            // 解析dns时间
            if (this.requestInfo.dnsStartTime != 0) {
                // 有走dns
                if (this.requestInfo.dnsEndTime != 0) {
                    // dns成功
                    analysisData.push({
                        "name": "DNS解析（" + (this.requestInfo.dnsEndTime - this.requestInfo.dnsStartTime) + "ms）",
                        "value": this.requestInfo.dnsEndTime - this.requestInfo.dnsStartTime,
                    })
                } else if (this.requestInfo.callFailedTime != 0) {
                    // dns失败
                    analysisData.push({
                        "name": "DNS解析失败（" + (this.requestInfo.callFailedTime - this.requestInfo.dnsStartTime) + "ms）",
                        "value": this.requestInfo.callFailedTime - this.requestInfo.dnsStartTime,
                    })
                }
            }
            // 解析连接时间
            if (this.requestInfo.connectStartTime != 0) {
                let secureData = []
                // 开始连接
                if (this.requestInfo.secureConnectStartTime != 0) {
                    // 解析https时间
                    if (this.requestInfo.secureConnectEndTime != 0) {
                        // https加密成功
                        secureData.push({
                            "name": "HTTPS加密（" + (this.requestInfo.secureConnectEndTime - this.requestInfo.secureConnectStartTime) + "ms）",
                            "value": this.requestInfo.secureConnectEndTime - this.requestInfo.secureConnectStartTime,
                        })
                    } else {
                        // https加密失败
                        secureData.push({
                            "name": "HTTPS加密失败（" + (this.requestInfo.connectFailedTime - this.requestInfo.secureConnectStartTime) + "ms）",
                            "value": this.requestInfo.connectFailedTime - this.requestInfo.secureConnectStartTime,
                        })
                    }
                }
                // 连接成功
                if (this.requestInfo.connectEndTime != 0) {
                    // 连接成功
                    analysisData.push({
                        "name": "连接成功（" + (this.requestInfo.connectEndTime - this.requestInfo.connectStartTime) + "ms）",
                        "children": secureData,
                        "value": this.requestInfo.connectEndTime - this.requestInfo.connectStartTime
                    })
                } else if (this.requestInfo.connectFailedTime != 0) {
                    // 连接失败
                    analysisData.push({
                        "name": "连接失败（" + (this.requestInfo.connectFailedTime - this.requestInfo.connectStartTime) + "ms）",
                        "children": secureData,
                        "value": this.requestInfo.connectFailedTime - this.requestInfo.connectStartTime
                    })
                }
            }
            // 解析写入读取内容时间
            if (this.requestInfo.connectionAcquiredTime != 0) {
                // 获得一个连接
                let readAndWriteData = []

                // 解析读取http request header时间
                if (this.requestInfo.requestHeadersStartTime != 0) {
                    // 开始读取http request header
                    if (this.requestInfo.requestHeadersEndTime != 0) {
                        // 读取http request header成功
                        readAndWriteData.push({
                            "name": "写入请求头（" + (this.requestInfo.requestHeadersEndTime - this.requestInfo.requestHeadersStartTime) + "ms）",
                            "value": this.requestInfo.requestHeadersEndTime - this.requestInfo.requestHeadersStartTime,
                        })
                    } else if (this.requestInfo.callFailedTime != 0) {
                        // 读取http request header失败
                        readAndWriteData.push({
                            "name": "写入请求头失败（" + (this.requestInfo.callFailedTime - this.requestInfo.requestHeadersStartTime) + "ms）",
                            "value": this.requestInfo.callFailedTime - this.requestInfo.requestHeadersStartTime,
                        })
                    }
                }

                // 解析读取http request body时间
                if (this.requestInfo.requestBodyStartTime != 0) {
                    // 开始读取http request body
                    if (this.requestInfo.requestBodyEndTime != 0) {
                        // 读取http request body成功
                        readAndWriteData.push({
                            "name": "写入请求内容（" + (this.requestInfo.requestBodyEndTime - this.requestInfo.requestBodyStartTime) + "ms）",
                            "value": this.requestInfo.requestBodyEndTime - this.requestInfo.requestBodyStartTime,
                        })
                    } else if (this.requestInfo.callFailedTime != 0) {
                        // 读取http request body失败
                        readAndWriteData.push({
                            "name": "写入请求内容失败（" + (this.requestInfo.callFailedTime - this.requestInfo.requestBodyStartTime) + "ms）",
                            "value": this.requestInfo.callFailedTime - this.requestInfo.requestBodyStartTime,
                        })
                    }
                }

                // 解析读取http response header时间
                if (this.requestInfo.responseHeadersStartTime != 0) {
                    // 开始读取http response header
                    if (this.requestInfo.responseHeadersEndTime != 0) {
                        // 读取http response header成功
                        readAndWriteData.push({
                            "name": "读取响应头（" + (this.requestInfo.responseHeadersEndTime - this.requestInfo.responseHeadersStartTime) + "ms）",
                            "value": this.requestInfo.responseHeadersEndTime - this.requestInfo.responseHeadersStartTime,
                        })
                    } else if (this.requestInfo.callFailedTime != 0) {
                        // 读取http response header失败
                        readAndWriteData.push({
                            "name": "读取响应头失败（" + (this.requestInfo.callFailedTime - this.requestInfo.responseHeadersStartTime) + "ms）",
                            "value": this.requestInfo.callFailedTime - this.requestInfo.responseHeadersStartTime,
                        })
                    }
                }

                // 解析读取http response body时间
                if (this.requestInfo.responseBodyStartTime != 0) {
                    // 开始读取http response body
                    if (this.requestInfo.responseBodyEndTime != 0) {
                        // 读取http response body成功
                        readAndWriteData.push({
                            "name": "读取响应内容（" + (this.requestInfo.responseBodyEndTime - this.requestInfo.responseBodyStartTime) + "ms）",
                            "value": this.requestInfo.responseBodyEndTime - this.requestInfo.responseBodyStartTime,
                        })
                    } else if (this.requestInfo.callFailedTime != 0) {
                        // 读取http response body失败
                        readAndWriteData.push({
                            "name": "读取响应内容失败（" + (this.requestInfo.callFailedTime - this.requestInfo.responseBodyStartTime) + "ms）",
                            "value": this.requestInfo.callFailedTime - this.requestInfo.responseBodyStartTime,
                        })
                    }
                }

                // 读取内容结束，连接释放
                if (this.requestInfo.connectionReleasedTime != 0) {
                    // 连接成功
                    analysisData.push({
                        "name": "读取写入成功（" + (this.requestInfo.connectionReleasedTime - this.requestInfo.connectionAcquiredTime) + "ms）",
                        "children": readAndWriteData,
                        "value": this.requestInfo.connectionReleasedTime - this.requestInfo.connectionAcquiredTime
                    })
                } else if (this.requestInfo.callFailedTime != 0) {
                    // 连接失败
                    analysisData.push({
                        "name": "读取写入失败（" + (this.requestInfo.callFailedTime - this.requestInfo.connectionAcquiredTime) + "ms）",
                        "children": readAndWriteData,
                        "value": this.requestInfo.callFailedTime - this.requestInfo.connectionAcquiredTime
                    })
                }
            }
            let option = {
                series: {
                    type: 'sunburst',
                    data: analysisData,
                    radius: [0, '90%'],
                    label: {
                        rotate: 'radial'
                    }
                }
            }
            chart.setOption(option);
        },
    }
</script>

<style scoped>

</style>