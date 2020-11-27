<template>
    <el-container style="margin: 30px;">
        <el-row :gutter="20" style="width: 100%">
            <el-col :span="12" >
                <el-collapse v-model="activeNames" >
                    <el-collapse-item title="import" name="1" >
                        <div style="border: 1px solid #eee;" id="importDiv">
                            <codemirror :value="importContent" :options="cmOptions" @input="onImportChange"/>
                        </div>
                    </el-collapse-item>
                </el-collapse>
                <div style="font-size: 13px; font-weight: 500;height: 48px;line-height: 48px;">code</div>
                <div style="border: 1px solid #eee; " id="codeDiv">
                    <codemirror :value="consoleCode" :options="cmOptions" @input="onCodeChange"/>
                </div>
                <div style="margin-top: 20px;">
                    <el-button type="primary" plain @click="executeCode()">运行</el-button>
                    <el-checkbox v-model="runOnMainThread" style="margin-left: 10px;">运行在主线程中</el-checkbox>
                    <el-button type="text" style="float: right;" @click="showApi()">API示例</el-button>
                </div>
            </el-col>
            <el-col :span="12" style="height: 100%;">
                <div style="font-size: 13px; font-weight: 500;height: 48px;line-height: 48px;">运行结果</div>
                <div style="border: 1px solid #eee; " id="resultDiv">
                    <codemirror :value="consoleResutl" :options="readOptions" />
                </div>
            </el-col>
        </el-row>
        <el-dialog
            title="API示例"
            :visible.sync="dialogVisible"
            width="30%">
            <div>
                <ul style="line-height: 30px;">
                    <li><b>getContext()</b>：获取上下文(Application)</li>
                    <li><b>getTopActivity()</b>：获取顶上的Activity</li>
                    <li><b>System.out.println()</b>：输出内容</li>
                    <li><b>System.out.println(getContext().getPackageName())</b>：输出包名</li>
                </ul>
                
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>

<script>
    import 'codemirror/mode/clike/clike.js'
    import { codemirror } from 'vue-codemirror'
    import * as URL from '../../UrlConstant'

    export default {
        name: "ConsoleView",
        computed: {
            importContent() {
                return this.$store.state.importContent
            },
            consoleCode() {
                return this.$store.state.consoleCode
            },
            consoleResutl() {
                console.log("123")
                return this.$store.state.consoleResult
            },
        },
        data() {
            return {
                activeNames: ['1'],
                runOnMainThread: true,
                dialogVisible: false,
                cmOptions: {
                    tabSize: 4,
                    mode: 'text/x-java',
                    indentUnit: 4,
                    line: true,
                    smartIndent: true, // 自动缩进
                    autoCloseBrackets: true,// 自动补全括号
                    lineNumbers: true, // 显示行数
                    viewportMargin: Infinity,
                },
                readOptions: {
                    tabSize: 4,
                    mode: 'text/x-java',
                    indentUnit: 4,
                    line: true,
                    smartIndent: true, // 自动缩进
                    autoCloseBrackets: true,// 自动补全括号
                    lineNumbers: true, // 显示行数
                    readOnly: true, // 只读
                    viewportMargin: Infinity,
                    height: 400,
                },
            }
        },
        methods: {
            // 执行代码
            executeCode() {
                this.axios.post(URL.EXECUTE_CODE, {
                    code: this.consoleCode,
                    import: this.importContent,
                    runOnMainThread: this.runOnMainThread
                }).then((resp) => {
                    if (resp.data.success) {
                        this.$store.state.consoleResult = resp.data.data
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
            },
            // 显示api示例
            showApi() {
                this.dialogVisible = true
            },
            // import修改回调
            onImportChange(newImport) {
                this.$store.state.importContent = newImport
            },
            // code修改回调
            onCodeChange(newImport) {
                this.$store.state.consoleCode = newImport
            },
        },
        components: {
            codemirror
        }
    }
</script>

<style scoped>
    .el-collapse {
        border-top: 0px;
        border-bottom: 0px;
    }
    .el-collapse-item__header{
        border-bottom: 0px;
    }
    /deep/ .el-collapse-item__wrap {
        border-bottom: 0px;
    }
    /deep/ #resultDiv .CodeMirror {
        height: 695px;
    }
    /deep/ #importDiv .CodeMirror {
        height: 120px;
    }
    /deep/ #codeDiv .CodeMirror {
        height: 500px;
    }
</style>