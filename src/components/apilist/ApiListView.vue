<template>
    <div style="padding: 20px">
        <el-table
                :data="tableData"
                border
                :row-class-name="tableRowClassName"
                style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="请求类型" style="width: 100%">
                            <pre><code>{{ toJson(props.row.requestBody) }}</code></pre>
                        </el-form-item>
                        <el-form-item label="接收类型" style="width: 100%" v-if="!$store.state.detailedReturnType">
                            <pre><code>{{ toJson(props.row.returnType) }}</code></pre>
                        </el-form-item>
                        <el-form-item label="详细列表" style="width: 100%" v-if="$store.state.detailedReturnType">
                            <div v-for="(item, i) in props.row.detailedReturnType" v-bind:key="item + i"
                                 style="background-color: rgb(248,248,248); margin-bottom: 20px">
                                <h3 style="padding-left: 20px;padding-right: 10px; margin: 0px; font-size: 14px; background-color: rgb(222,227,233)">
                                    {{ item.fileName.toString() }}
                                </h3>
                                <!--                                style="padding-left: 20px; padding-right: 20px;"-->
                                <div v-for="(value, key) in item.parameterMap" v-bind:key="key + value">
                                    <div style="width: 30%; display: inline-block; padding-left: 20px; padding-right: 20px">
                                        <b><code>{{key}}</code></b>
                                    </div>
                                    <div style="width: 70%; display: inline-block; padding-left: 20px; padding-right: 20px">
                                        <b><code>{{value}}</code></b>
                                    </div>
                                </div>
                            </div>
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
                    width="100"
                    prop="method">
            </el-table-column>
            <el-table-column
                    label="说明"
                    prop="description">
            </el-table-column>
        </el-table>
        <el-tooltip class="item" effect="dark" content="查看详细列表" placement="top">
            <el-button icon="el-icon-view" circle style="position: fixed; right: 60px; bottom: 40px;"
                       v-bind:class="{'el-button--primary':$store.state.detailedReturnType}"
                       @click="toggleDetailedReturnType"></el-button>
        </el-tooltip>
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
            },
            toggleDetailedReturnType() {
                this.$store.state.detailedReturnType = !this.$store.state.detailedReturnType
            }
        },
        mounted() {
            if (this.$store.state.apiList.length === 0) {
                this.axios.get(URL.GET_API_LIST).then((resp) => {
                    if (resp.data.success) {
                        this.$store.state.apiList = resp.data.data
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
        background-color: rgb(253, 245, 230);
    }

    .el-table .post-row {
        background: rgb(240, 249, 235);
    }

    .el-form--inline .el-form-item__content {
        display: inline;
    }
</style>