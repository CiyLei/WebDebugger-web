<template>
    <div style="padding: 20px">
        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
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
                        <el-form-item label="响应头" style="width: 100%">
                            <code>{{ props.row.responseHeaders }}</code>
                        </el-form-item>
                        <el-form-item label="响应内容" style="width: 100%">
                            <code>{{ props.row.responseBody }}</code>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
                    label="请求方式"
                    prop="method">
            </el-table-column>
            <el-table-column
                    label="请求时间"
                    prop="requestDataTime">
            </el-table-column>
            <el-table-column
                    label="Url"
                    prop="url">
            </el-table-column>
        </el-table>
        <el-button icon="el-icon-delete" circle style="position: fixed; right: 60px; bottom: 40px;" @click="clean"></el-button>
    </div>
</template>

<script>
    export default {
        name: "NetView",
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
            }
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
        background-color: rgb(253,245,230);
    }

    .el-table .post-row {
        background: rgb(240,249,235);
    }
</style>