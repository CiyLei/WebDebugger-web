<template>
    <div v-loading="getDataLoading">
        <div style="height: 600px; overflow: scroll">
            <NetDialogView v-bind:table-data="netHistoryList"></NetDialogView>
        </div>
        <el-pagination
                background
                layout="prev, pager, next"
                :page-size="pageSize"
                @current-change="handleCurrentChange"
                :total="total">
        </el-pagination>
    </div>
</template>

<script>
    import * as URL from '../../UrlConstant'
    import NetDialogView from "./NetDialogView"

    export default {
        name: "NetHistoryDialogView",
        components: {
            NetDialogView
        },
        data() {
            return {
                getDataLoading: true,
                total: 0,
                netHistoryList: [],
                page: 1,
                pageSize: 10,
            }
        },
        methods: {
            handleCurrentChange(page) {
                this.page = page
                this.getNetHistoryList()
            },
            getNetHistoryList() {
                this.axios.get(URL.GET_HISTORY, {
                    params: {
                        page: this.page,
                        pageSize: this.pageSize,
                    }
                }).then((resp) => {
                    if (resp.data.success) {
                        this.total = resp.data.data.total
                        this.netHistoryList = resp.data.data.list
                        this.getDataLoading = false
                    } else {
                        this.$message({
                            showClose: true,
                            message: resp.data.message,
                            type: 'error',
                        })
                    }
                })
            }
        },
        mounted() {
            this.getNetHistoryList()
        }
    }
</script>

<style scoped>

</style>