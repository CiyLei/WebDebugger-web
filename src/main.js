import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import App from './App.vue'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import echarts from 'echarts'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'

import axios from 'axios'
import VueAxios from 'vue-axios'

import DeviceView from './components/device/DeviceView'
import LogcatView from './components/logcat/LogcatView'
import NetView from './components/net/NetView'
import ScreenView from './components/screen/ScreenView'
import EnvironmentView from './components/environment/EnvironmentView'
import AdbView from './components/adb/AdbView'
import ApiListView from "./components/apilist/ApiListView";
import DBView from "./components/db/DBView";
import ConsoleView from "./components/console/ConsoleView";
import InstallView from "./components/install/InstallView";
import ViewView from "./components/view/ViewView";

import * as URL from './UrlConstant'

import uuidv1 from 'uuid/v1'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VueAxios, axios)
Vue.use(codemirror)

const routes = [
    {path: '/', component: DeviceView},
    {path: '/view', component: ViewView},
    {path: '/console', component: ConsoleView},
    {path: '/net', component: NetView},
    {path: '/screen', component: ScreenView},
    {path: '/db', component: DBView},
    {path: '/environment', component: EnvironmentView},
    {path: '/logcat', component: LogcatView},
    {path: '/apiList', component: ApiListView},
    {path: '/install', component: InstallView},
    {path: '/adb', component: AdbView},
];
const router = new VueRouter({
    routes // (缩写) 相当于 routes: routes
})

var deviceWebSocket = undefined
var logcatWebSocket = undefined
var netWebSocket = undefined
var mediaWebSocket = undefined
var viewMonitorWebSocket = undefined

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

        // api 清单
        apiList: [],
        // 详细返回值
        detailedReturnType: false,

        // 屏幕宽高
        deviceScreenWidth: 0,
        deviceScreenHeight: 0,
        mediaCachePath: "",

        deviceActiveTab: ['1'],
        count: 0,

        // 数据库调试端口
        dbPort: 0,

        // 包导入代码
        importContent: "import android.widget.Toast;\nimport java.util.Random;",
        // 控制台代码
        consoleCode: 'int i = 0;\nwhile(i < 10) {\n    System.out.println(new Random().nextInt());\n    i++;\n}\nToast.makeText(getContext(), "测试吐司", Toast.LENGTH_SHORT).show();',
        // 控制台运行结果
        consoleResult: "",

        // view树
        viewTree: [],
        // 当前选中的view hashcode
        selectViewHashCode: "",
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
                if (viewMonitorWebSocket === undefined) {
                    openViewMonitorWS(state, port)
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
    deviceWebSocket.onclose = function () {
        deviceWebSocket = undefined
        reconnectWebSocket();
    }
    deviceWebSocket.onerror = function () {
        deviceWebSocket = undefined
        reconnectWebSocket();
    }
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
    logcatWebSocket.onclose = function () {
        logcatWebSocket = undefined
        reconnectWebSocket();
    }
    logcatWebSocket.onerror = function () {
        logcatWebSocket = undefined
        reconnectWebSocket();
    }
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
    netWebSocket.onclose = function () {
        netWebSocket = undefined
        reconnectWebSocket();
    }
    netWebSocket.onerror = function () {
        netWebSocket = undefined
        reconnectWebSocket();
    }
    netWebSocket.onmessage = function (msg) {
        let data = JSON.parse(msg.data)
        // 将id赋值一个uuid
        data.id = uuidv1()
        state.netList.unshift(data)
    }
}

// Media WebSocket
function openMediaWS(state, port) {
    let path = "ws://" + window.location.hostname + ":" + port + URL.WEB_SOCKET_MEDIA_ADD
    mediaWebSocket = new WebSocket(path)
    mediaWebSocket.onclose = function () {
        mediaWebSocket = undefined
        reconnectWebSocket();
    }
    mediaWebSocket.onerror = function () {
        mediaWebSocket = undefined
        reconnectWebSocket();
    }
    mediaWebSocket.onmessage = function (msg) {
        let data = JSON.parse(msg.data)
        state.resourcePort = data.port
        for (let index in data.list) {
            let path = data.list[index]
            let local = window.location.protocol + "//" + window.location.hostname + ":" + state.resourcePort + "/" + path
            var exist = false
            for (let m in state.mediaList) {
                if (state.mediaList[m] === local) {
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

// view监控 WebSocket
function openViewMonitorWS(state, port) {
    let path = "ws://" + window.location.hostname + ":" + port + URL.WEB_SOCKET_VIEW_MONITOR
    viewMonitorWebSocket = new WebSocket(path)
    viewMonitorWebSocket.onclose = function () {
        viewMonitorWebSocket = undefined
        reconnectWebSocket();
    }
    viewMonitorWebSocket.onerror = function () {
        viewMonitorWebSocket = undefined
        reconnectWebSocket();
    }
    viewMonitorWebSocket.onmessage = function (msg) {
        state.selectViewHashCode = msg
    }
}

// 重连锁
var lockReconnect = false

// 重连WebSocket
function reconnectWebSocket() {
    if (lockReconnect) return;
    lockReconnect = true;
    setTimeout(function () {     //没连接上会一直重连，设置延迟避免请求过多
        store.commit("openWebsocket", store.state.deviceInfoWebSocketPort)
        lockReconnect = false;
    }, 2000);
}