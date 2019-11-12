import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import App from './App.vue'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import echarts from 'echarts'

import axios from 'axios'
import VueAxios from 'vue-axios'

import DeviceView from './components/device/DeviceView'
import LogcatView from './components/logcat/LogcatView'
import NetView from './components/net/NetView'
import ScreenView from './components/screen/ScreenView'
import EnvironmentView from './components/environment/EnvironmentView'
import AdbView from './components/adb/AdbView'

import * as URL from './UrlConstant'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VueAxios, axios)

const routes = [
    {path: '/', component: DeviceView},
    {path: '/logcat', component: LogcatView},
    {path: '/net', component: NetView},
    {path: '/screen', component: ScreenView},
    {path: '/environment', component: EnvironmentView},
    {path: '/adb', component: AdbView},
];
const router = new VueRouter({
    routes // (缩写) 相当于 routes: routes
})

var deviceWebSocket = undefined
var logcatWebSocket = undefined
var netWebSocket = undefined
var mediaWebSocket = undefined

const store = new Vuex.Store({
    state: {
        activeIndex: "1",

        deviceInfoGroups: [],
        deviceInfoWebSocketPort: 0,
        deviceDate: [],
        deviceFPS: [],
        deviceTotalMemData: [],
        deviceTotalPrivateDirty: [],
        deviceTotalPss: [],

        logcatList: [],
        // 最大缓存数量
        logcatListMax: 500,
        // 是否置底
        logcatBottomCheck: true,
        // 是否无限缓存
        logcatUnlimited: false,

        netList: [],

        resourcePort: 0,
        mediaList: [],

        retrofitUrl: undefined,
        environmentList: [],

        // 屏幕宽高
        deviceScreenWidth: 0,
        deviceScreenHeight: 0,
        mediaCachePath: "",

        deviceActiveTab: ['1'],
        count: 0,
    },
    mutations: {
        increment(state) {
            state.count++
        },
        openWebsocket(state, port) {
            state.deviceInfoWebSocketPort = port
            if (typeof (WebSocket) === "undefined") {
                this._vm.$message({
                    showClose: true,
                    message: '此浏览器不支持WebSocket，无法开启实时功能',
                    type: 'error',
                })
            } else {
                if (deviceWebSocket === undefined) {
                    openDevicoeInfoWS(state, port)
                }
                if (logcatWebSocket === undefined) {
                    openLogcatWS(state, port)
                }
                if (netWebSocket === undefined) {
                    openNetWS(state, port)
                }
                if (mediaWebSocket === undefined) {
                    openMediaWS(state, port)
                }
            }
        }
    }
})

Vue.prototype.$routes = routes
Vue.prototype.$echarts = echarts

new Vue({
    store,
    router,
    render: h => h(App),
}).$mount('#app')

// FPS、内存 WebSocket
function openDevicoeInfoWS(state, port) {
    let path = "ws://" + window.location.hostname + ":" + port + URL.WEB_SOCKET_DEVICE
    deviceWebSocket = new WebSocket(path)
    let showCount = 30
    deviceWebSocket.onmessage = function (msg) {
        let data = JSON.parse(msg.data)
        if (data.fps === 0) {
            return
        }

        while (state.deviceDate.length >= showCount) {
            state.deviceDate.shift()
        }
        let now = new Date();
        state.deviceDate.push([now.getHours(), now.getMinutes(), now.getSeconds()].join(":"))

        while (state.deviceFPS.length >= showCount) {
            state.deviceFPS.shift()
        }
        state.deviceFPS.push(data.fps.toFixed(2))

        while (state.deviceTotalMemData.length >= showCount) {
            state.deviceTotalMemData.shift()
        }
        state.deviceTotalMemData.push((data.totalMem / 1024.00).toFixed(2))

        while (state.deviceTotalPrivateDirty.length >= showCount) {
            state.deviceTotalPrivateDirty.shift()
        }
        state.deviceTotalPrivateDirty.push((data.totalPrivateDirty / 1024).toFixed(2))

        while (state.deviceTotalPss.length >= showCount) {
            state.deviceTotalPss.shift()
        }
        state.deviceTotalPss.push((data.totalPss / 1024).toFixed(2))
    }
}

// Logcat WebSocket
function openLogcatWS(state, port) {
    let path = "ws://" + window.location.hostname + ":" + port + URL.WEB_SOCKET_LOGCAT
    logcatWebSocket = new WebSocket(path)
    logcatWebSocket.onmessage = function (msg) {
        while (!state.logcatUnlimited && state.logcatList.length >= state.logcatListMax) {
            state.logcatList.shift()
        }
        state.logcatList.push(msg.data)
    }
}

// Net WebSocket
function openNetWS(state, port) {
    let path = "ws://" + window.location.hostname + ":" + port + URL.WEB_SOCKET_NET
    netWebSocket = new WebSocket(path)
    netWebSocket.onmessage = function (msg) {
        let data = JSON.parse(msg.data)
        state.netList.unshift(data)
    }
}

// Media WebSocket
function openMediaWS(state, port) {
    let path = "ws://" + window.location.hostname + ":" + port + URL.WEB_SOCKET_MEDIA_ADD
    mediaWebSocket = new WebSocket(path)
    mediaWebSocket.onmessage = function (msg) {
        let data = JSON.parse(msg.data)
        state.resourcePort = data.port
        for (let index in data.list) {
            let path = data.list[index]
            let local = window.location.protocol + "//" + window.location.hostname + ":" + state.resourcePort + "/" + path
            var exist = false
            for (let m in state.mediaList) {
                if (m === local) {
                    exist = true
                    break
                }
            }
            if (!exist) {
                state.mediaList.unshift(local)
            }
        }
    }
}