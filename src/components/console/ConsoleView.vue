<template>
    <el-container style="margin: 30px;">
        <el-row :gutter="20" style="width: 100%">
            <el-col :span="12" >
                <el-collapse v-model="activeNames" >
                    <el-collapse-item title="import" name="1" >
                        <div style="border: 1px solid #eee;">
                            <codemirror v-model="importContent" :options="cmOptions"/>
                        </div>
                    </el-collapse-item>
                </el-collapse>
                <div style="font-size: 13px; font-weight: 500;height: 48px;line-height: 48px;">code</div>
                <div style="border: 1px solid #eee; ">
                    <codemirror v-model="code" :options="cmOptions"/>
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
                    <codemirror v-model="result" :options="readOptions" />
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
        data() {
            return {
                activeNames: ['1'],
                importContent: 'import android.widget.Toast;\nimport java.util.Random;',
                code: 'int i = 0;\nwhile(i < 10) {\n    System.out.println(new Random().nextInt());\n    i++;\n}\nToast.makeText(getContext(), "测试吐司", Toast.LENGTH_SHORT).show();',
                runOnMainThread: true,
                dialogVisible: false,
                cmOptions: {
                    tabSize: 4,
                    mode: 'text/x-java',
                    indentUnit: 4,
                    line: true,
                    smartIndent: true, // 自动缩进
                    autoCloseBrackets: true,// 自动补全括号
                    lineNumbers: true,
                    viewportMargin: Infinity,
                },
                readOptions: {
                    tabSize: 4,
                    mode: 'text/x-java',
                    indentUnit: 4,
                    line: true,
                    smartIndent: true, // 自动缩进
                    autoCloseBrackets: true,// 自动补全括号
                    lineNumbers: true,
                    readOnly: true,
                    viewportMargin: Infinity,
                    height: 400,
                },
                result: ''
            }
        },
        methods: {
            executeCode() {
                this.axios.post(URL.EXECUTE_CODE, {
                    code: this.code,
                    import: this.importContent,
                    runOnMainThread: this.runOnMainThread
                }).then((resp) => {
                    if (resp.data.success) {
                        this.result = resp.data.data
                        this.$message({
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
            showApi() {
                this.dialogVisible = true
            }
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
    /deep/ .CodeMirror {
        border: 1px solid #eee;
        height: 300px;
    }
</style>