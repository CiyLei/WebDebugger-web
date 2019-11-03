<template>
    <div>
        <div v-for="(item, i1) in deviceInfoGroups" v-bind:key="i1">
            <div style="border:1px solid #dfe6e9"></div>
            <h2>{{item.groupName}}</h2>
            <p v-for="(info, i2) in item.infos" v-bind:key="i2">{{info.name}}：{{info.value}}</p>
        </div>
        <footer style="height: 50px"></footer>
    </div>
</template>

<script>
    export default {
        name: "DeviceInfoView",
        data() {
            return {
                items: new Array(100).keys(),
                // items2: new Array(100).keys()
            }
        },
        computed: {
            deviceInfoGroups() {
                return this.$store.state.deviceInfoGroups
            },
            activeNames: {
                get() {
                    return this.$store.state.deviceActiveTab
                },
                set(val) {
                    this.$store.state.deviceActiveTab = val
                }
            },
        },
    }
</script>

<style scoped>
    p {
        /*padding-right: 150px;*/
        display: inline-block;
        font-size: 17px;
        width: 33%;
    }
    h2 {
        margin-top: 50px;
    }
</style>