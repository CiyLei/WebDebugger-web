<template>
    <iframe v-bind:src=dbSrc style="width: 100%; height: 800px;" frameborder="no"></iframe>
</template>

<script>
    export default {
        name: "DBView",
        data() {
            return {
                dbSrc: window.location.protocol + "//" + window.location.hostname + ":" + this.$store.state.dbPort
            }
        },
        mounted() {
            if (this.$store.state.dbPort === 0) {
                this.$router.push("/")
            }
        },
    }
</script>

<style scoped>

</style>