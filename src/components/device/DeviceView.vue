<template>
    <div v-loading="isLoading" style="padding: 20px">
        <h2 style="padding-bottom: 20px">实时情况</h2>
        <el-row :gutter="20">
            <el-col :span="12">
                <FPSView></FPSView>
            </el-col>
            <el-col :span="12">
                <MemoryView></MemoryView>
            </el-col>
            <el-col :span="24" style="margin-top: 20px">
                <DeviceInfo></DeviceInfo>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import * as URL from '../../UrlConstant'
    import DeviceInfo from './DeviceInfoView'
    import FPSView from './DeviceFPSView'
    import MemoryView from './DeviceMemoryView'

    export default {
        name: 'HelloWorld',
        components: {
            DeviceInfo,
            FPSView,
            MemoryView,
        },
        computed: {
            isLoading() {
                return this.$store.state.deviceInfoGroups.length === 0
            },
        },
        created() {
            if (this.$store.state.deviceInfoGroups.length === 0) {
                this.axios.get(URL.GET_DEVICE_INFO).then((resp) => {
                    if (resp.data.success) {
                        this.$store.state.deviceInfoGroups = resp.data.data.groups
                        this.$store.state.dbPort = resp.data.data.dbPort
                        this.$store.commit("openWebsocket", resp.data.data.port)
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
    .bg-purple {
        background: #d3dce6;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
    }

    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
</style>
