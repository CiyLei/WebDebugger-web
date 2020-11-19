<template>
    <div style="padding: 20px">
        <el-table
            :data="tableData"
            :row-class-name="tableRowClassName"
            border
            style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand" v-if="!props.row.callFailError">
                        <el-form-item label="请求头" style="width: 100%">
                            <code>{{ props.row.requestHeaders }}</code>
                        </el-form-item>
                        <el-form-item label="请求内容" style="width: 100%">
                            <code>{{ props.row.requestBody }}</code>
                        </el-form-item>
                        <el-form-item label="请求用时" style="width: 40%">
                            <code>{{ props.row.timeCost }}ms</code>
                        </el-form-item>
                        <el-form-item label="响应码" style="width: 40%">
                            <code>{{ props.row.code }}</code>
                        </el-form-item>
                        <el-form-item label="响应头" style="width: 100%;">
                            <code>{{ props.row.responseHeaders }}</code>
                        </el-form-item>
                        <el-form-item label="响应内容" style="width: 100%;">
                            <pre><code>{{ toJson(props.row.responseBody) }}</code></pre>
                        </el-form-item>
                    </el-form>
                    <el-alert
                        :title="props.row.callFailError"
                        type="error"
                        :closable="false"
                        :description="props.row.callFailErrorDetail"
                        v-if="props.row.callFailError">
                    </el-alert>
                </template>
            </el-table-column>
            <el-table-column
                label="请求方式"
                width="100"
                prop="method">
            </el-table-column>
            <el-table-column
                label="请求时间"
                width="220"
                show-overflow-tooltip>
                <template slot-scope="scope">
                    {{time2Str(scope.row.requestTime)}}
                    <el-button icon="el-icon-time" @click="handleTimeAnalysisClick(scope.row)" circle></el-button>
                </template>
            </el-table-column>
            <el-table-column
                label="Url"
                prop="url"
                show-overflow-tooltip>
            </el-table-column>
        </el-table>
        <el-dialog title="请求时间分析" :visible.sync="timeAnalysisIsShow" style="text-align: center" width="80%" append-to-body>
            <TimeAnalysisView v-bind:request-info="timeAnalysisRequest" v-if="timeAnalysisIsShow"></TimeAnalysisView>
        </el-dialog>
    </div>
</template>

<script>
    import TimeAnalysisView from "./TimeAnalysisView"

    export default {
        name: "NetDialogView",
        components: {
            TimeAnalysisView,
        },
        props: {
            tableData: Array
        },
        data() {
            return {
                timeAnalysisIsShow: false,
                timeAnalysisRequest: {},
            }
        },
        methods: {
            tableRowClassName({row, rowIndex}) {
                row.width
                let data = this.tableData[rowIndex]
                if (data.method === 'GET') {
                    return 'get-row';
                }
                return 'post-row';
            },
            toJson(string) {
                try {
                    return JSON.stringify(JSON.parse(string), null, 4)
                } catch (e) {
                    e.toString()
                }
                return string
            },
            timeFormat(time) {
                if (time < 10) return "0" + time
                return time
            },
            time2Str(time) {
                const date = new Date(time)
                return date.getFullYear() + "-" + this.timeFormat(date.getMonth() + 1) + "-"
                    + this.timeFormat(date.getDate()) + " " + this.timeFormat(date.getHours())
                    + ":" + this.timeFormat(date.getMinutes()) + ":" + this.timeFormat(date.getSeconds())
            },
            handleTimeAnalysisClick(data) {
                this.timeAnalysisRequest = data
                this.timeAnalysisIsShow = true
            },
        }
    }
</script>

<style>
    .demo-table-expand {
        font-size: 0;
    }

    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .el-table .get-row {
        background-color: rgb(253, 245, 230);
    }

    .el-table .post-row {
        background: rgb(240, 249, 235);
    }

    .el-form--inline .el-form-item__content {
        display: inline;
    }
</style>