<template>
    <ul>
        <li v-for="(item, index) in logCatList" v-bind:key="item + index"><b><code v-bind:class="{
            'logcatv' : (eq(item, 'V')),
            'logcatd' : (eq(item, 'D')),
            'logcati' : (eq(item, 'I')),
            'logcatw' : (eq(item, 'W')),
            'logcate' : (eq(item, 'E')),
            'logcata' : (eq(item, 'A')),
        }">{{item}}</code></b></li>
    </ul>
</template>

<script>
    export default {
        name: "LogCatDialogView",
        props: {
            logCatList: Array
        },
        methods: {
            eq(item, string) {
                // (item.split(' ')[4] === 'A')
                if (item !== undefined) {
                    let arr = item.split(' ')
                    return arr[6] === string || arr[4] === string
                }
                return false
            },
        }
    }
</script>

<style scoped>
    li {
        list-style-type: none;
    }

    .logcatv {
        color: rgb(187,187,187);
    }
    .logcatd {
        color: rgb(10,114,190);
    }
    .logcati {
        color: rgb(75,185,21);
    }
    .logcatw {
        color: rgb(159,158,5);
    }
    .logcate {
        color: rgb(254,108,103);
    }
    .logcata {
        color: rgb(236,15,3);
    }
</style>