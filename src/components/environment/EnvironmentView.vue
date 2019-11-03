<template>
    <div style="padding: 20px">
        <h1>当前环境</h1>
        <el-autocomplete
                popper-class="my-autocomplete"
                v-model="retrofitUrl"
                :fetch-suggestions="querySearch"
                placeholder="请输入环境Url"
                style="width: 600px;">
            <i
                    class="el-icon-refresh el-input__icon"
                    slot="suffix"
                    style="cursor: pointer"
                    @click="handleRefreshClick">
            </i>
            <el-button slot="append" icon="el-icon-setting" @click="handleEditClick">
            </el-button>
            <template slot-scope="{ item }">
                <div class="name">{{ item.address }}</div>
                <span class="addr">{{ item.value }}</span>
            </template>
        </el-autocomplete>
    </div>
</template>

<script>
    import * as URL from '../../UrlConstant'

    export default {
        name: "EnvironmentView",
        data() {
            return {
                retrofitUrl: this.$store.state.retrofitUrl
            };
        },
        computed: {
            environmentList() {
                let result = []
                for (let i in this.$store.state.environmentList) {
                    let item = this.$store.state.environmentList[i]
                    result.push({
                        "value": item.url,
                        "address": item.name
                    })
                }
                return result
            }
        },
        methods: {
            querySearch(queryString, cb) {
                var environment = this.environmentList;
                var results = queryString ? environment.filter(this.createFilter(queryString)) : environment;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            getRetrofitInfo() {
                this.axios.get(URL.RETROFIT_INFO).then((resp) => {
                    if (resp.data.success) {
                        this.retrofitUrl = resp.data.data.url
                        this.$store.state.retrofitUrl = resp.data.data.url
                        this.$store.state.environmentList = resp.data.data.environment
                    } else {
                        this.$message({
                            showClose: true,
                            message: resp.data.message,
                            type: 'error',
                        })
                    }
                })
            },
            handleRefreshClick() {
                this.getRetrofitInfo()
            },
            handleEditClick() {
                this.axios.post(URL.RETROFIT_EDIT, {
                    newUrl: this.retrofitUrl
                }).then((resp) => {
                    if (resp.data.success) {
                        this.$message({
                            message: '设置成功',
                            type: 'success'
                        })
                        this.getRetrofitInfo()
                    } else {
                        this.$message({
                            showClose: true,
                            message: resp.data.message,
                            type: 'error',
                        })
                    }
                })
            },
        },
        mounted() {
            if (this.$store.state.retrofitUrl === undefined) {
                this.getRetrofitInfo()
            }
        }
    }
</script>

<style scoped>
    li {
        line-height: normal;
        padding: 7px;
    }

    .name {
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .addr {
        font-size: 12px;
        color: #b4b4b4;
    }

    .highlighted .addr {
        color: #ddd;
    }
</style>