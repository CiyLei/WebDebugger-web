<template>
    <div style="padding: 20px">
        <el-table
            :data="tableData"
            :row-class-name="tableRowClassName"
            row-key="id"
            border
            :expand-row-keys="selectIds"
            @expand-change="handleExpandChangeEvent"
            style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand" v-if="!props.row.callFailError">
                        <el-form-item label="请求头" style="width: 100%">
                            <code>{{ props.row.requestHeaders }}</code>
                            <el-tooltip class="item" effect="dark" content="复制请求头" placement="top">
                                <el-button type="primary" icon="el-icon-document-copy" size="mini"
                                           @click="handleCopyHeaderClick(props.row.requestHeaders)"></el-button>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="请求内容" style="width: 100%">
                            <pre><code>{{ toJson(props.row.requestBody) }}</code></pre>
                            <el-tooltip class="item" effect="dark" content="复制请求内容" placement="top">
                                <el-button type="primary" icon="el-icon-document-copy" size="mini"
                                           @click="copyContent(toJson(props.row.requestBody))"></el-button>
                            </el-tooltip>
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
                prop="method"
                width="100">
            </el-table-column>
            <el-table-column
                label="请求时间"
                show-overflow-tooltip
                width="220">
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
        <el-tooltip class="item" effect="dark" content="清空网络请求日志" placement="top">
            <el-button icon="el-icon-delete" circle style="position: fixed; right: 60px; bottom: 40px;"
                       @click="clean"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="上传查看网络请求日志" placement="top">
            <el-button icon="el-icon-upload2" circle style="position: fixed; right: 120px; bottom: 40px;"
                       @click="uploadNetLog"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="查看历史请求记录" placement="top">
            <el-button icon="el-icon-timer" circle style="position: fixed; right: 180px; bottom: 40px;"
                       @click="handleViewHistory"></el-button>
        </el-tooltip>

        <el-dialog title="输入日志文件内容" :visible.sync="uploadViewIsShow" style="text-align: center">
            <el-input
                type="textarea"
                :rows="10"
                placeholder="请输入内容"
                v-model="netLog">
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="uploadViewIsShow = false">取 消</el-button>
                <el-button type="primary" @click="handleNetLog">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="查看请求日志" :visible.sync="viewNetLogDialogIsShow" style="text-align: center;" width="96%">
            <NetDialogView v-bind:table-data="netList"></NetDialogView>
        </el-dialog>
        <el-dialog title="查看历史请求记录" :visible.sync="netHistoryDialogIsShow" style="text-align: center" width="96%">
            <NetHistoryDialogView></NetHistoryDialogView>
        </el-dialog>
        <el-dialog title="请求时间分析" :visible.sync="timeAnalysisIsShow" style="text-align: center" width="80%">
            <TimeAnalysisView v-bind:request-info="timeAnalysisRequest" v-if="timeAnalysisIsShow"></TimeAnalysisView>
        </el-dialog>
    </div>
</template>

<script>
    import NetDialogView from "./NetDialogView"
    import NetHistoryDialogView from "./NetHistoryDialogView"
    import TimeAnalysisView from "./TimeAnalysisView"

    export default {
        name: "NetView",
        components: {
            NetDialogView,
            NetHistoryDialogView,
            TimeAnalysisView
        },
        data() {
            return {
                uploadViewIsShow: false,
                viewNetLogDialogIsShow: false,
                netLog: "",
                netList: [],
                netHistoryDialogIsShow: false,
                selectIds: [],
                timeAnalysisIsShow: false,
                timeAnalysisRequest: {},
            }
        },
        mounted() {
            if (this.$store.state.deviceInfoWebSocketPort === 0) {
                this.$router.push("/")
            }
        },
        computed: {
            tableData() {
                return this.$store.state.netList
            }
        },
        methods: {
            tableRowClassName({row, rowIndex}) {
                row.width
                let data = this.$store.state.netList[rowIndex]
                if (data.method === 'GET') {
                    return 'get-row';
                }
                return 'post-row';
            },
            clean() {
                this.$store.state.netList = []
            },
            toJson(string) {
                try {
                    return JSON.stringify(JSON.parse(string), null, 4)
                } catch (e) {
                    e.toString()
                }
                return string
            },
            uploadNetLog() {
                this.uploadViewIsShow = true
            },
            handleNetLog() {
                this.uploadViewIsShow = false
                const data = JSON.parse(this.netLog)
                this.netList = data.netList
                this.viewNetLogDialogIsShow = true
            },
            handleViewHistory() {
                this.netHistoryDialogIsShow = true
            },
            handleExpandChangeEvent(row, expanded) {
                this.selectIds = expanded.map((it) => {
                    return it.id
                })
            },
            handleCopyHeaderClick(content) {
                let out = "";
                Object.keys(content).forEach(function (key) {
                    let values = content[key]
                    out += key + ":" + values.join("; ") + "\n"
                })
                this.copyContent(out)
            },
            copyContent(content) {
                // 复制到粘贴板
                const aux = document.createElement("textarea");
                aux.value = content
                document.body.appendChild(aux)
                aux.select()
                document.execCommand("copy")
                document.body.removeChild(aux)
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
        },
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
        line-height: 30px;
    }

    .el-form-item {
        margin-bottom: 10px;
    }

    .el-form-item__label {
        font-size: 10px;
    }

    .el-table__expanded-cell[class*=cell] {
        padding: 8px 8px;
    }

    .el-table td .el-button.is-circle {
        padding: 5px;
    }
</style>