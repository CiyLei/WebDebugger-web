<template>
    <div style="padding: 20px">
        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="请求类型" style="width: 100%">
                            <pre><code>{{ toJson(props.row.requestBody) }}</code></pre>
                        </el-form-item>
                        <el-form-item label="接收类型" style="width: 100%">
                            <pre><code>{{ toJson(props.row.returnType) }}</code></pre>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
                    label="Url"
                    prop="url">
            </el-table-column>
            <el-table-column
                    label="请求方式"
                    prop="method">
            </el-table-column>
            <el-table-column
                    label="说明"
                    prop="description">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import * as URL from '../../UrlConstant'

    export default {
        name: "ApiListView",
        computed: {
            tableData() {
                return this.$store.state.apiList
            }
        },
        methods: {
            tableRowClassName({row, rowIndex}) {
                row.width
                let data = this.$store.state.apiList[rowIndex]
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
            }
        },
        mounted() {
            if (this.$store.state.apiList.length === 0) {
                this.axios.get(URL.GET_API_LIST).then((resp) => {
                    if (resp.data.success) {
                        this.$store.state.apiList = resp.data.data
                        console.log(this.$store.state.apiList)
                    } else {
                        this.$message({
                            showClose: true,
                            message: resp.data.message,
                            type: 'error',
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .el-table .get-row {
        background-color: rgb(253,245,230);
    }

    .el-table .post-row {
        background: rgb(240,249,235);
    }

    .el-form--inline .el-form-item__content {
        display: inline;
    }
</style>