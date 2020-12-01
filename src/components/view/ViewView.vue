<template>
    <div style="padding: 20px;">
        <el-tooltip effect="dark" content="刷新界面树" placement="bottom">
            <el-button icon="el-icon-refresh" @click="handleViewTreeRefresh" circle></el-button>
        </el-tooltip>
        <el-tooltip effect="dark" content="开启触摸定位" placement="bottom">
            <el-button icon="el-icon-aim" @click="handleInstallMonitorView" circle></el-button>
        </el-tooltip>
        <el-tooltip effect="dark" content="关闭触摸定位" placement="bottom">
            <el-button icon="el-icon-circle-close" @click="handleUnInstallMonitorView" circle></el-button>
        </el-tooltip>
        <div class="box" ref="box" style="height: 780px;">
            <div class="left" style="overflow: auto;">
                <div style="border: 1px solid #f2f2f2; height: 99%;">
                    <el-tree :data="viewTree" @node-click="handleNodeClick" node-key="id" ref="tree" highlight-current
                        :expand-on-click-node="false" :default-expand-all="true" class="flow-tree">
                        <span class="custom-tree-node" slot-scope="{node, data}">
                            <span :id="data.id" :title="data.label">{{data.label}}</span>
                        </span>
                    </el-tree>
                </div>
            </div>
            <div class="resize" title="收缩侧边栏">
                ⋮
            </div>
            <div class="mid">
                <div style="border: 1px solid #f2f2f2; height: 99%;">
                    <el-table :data="attributesData" :span-method="arraySpanMethod" border style="width: 100%">
                        <el-table-column label="属性名称" width="180" style="padding: 0px;">
                            <template slot-scope="scope">
                                <div :class="attributeLabelStyle(scope.row.type)">{{ scope.row.attributes }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="属性值">
                            <template slot-scope="scope">
                                <div :class="attributeLabelStyle(scope.row.type)" v-if="!scope.row.isEdit">
                                    {{ scope.row.value }}</div>
                                <el-input type="textarea" :rows="1" placeholder="请输入内容" v-model="scope.row.value"
                                    v-if="scope.row.isEdit && scope.row.inputType == 0"
                                    @blur="handleTextBlur(scope.row)">
                                </el-input>
                                <el-select v-model="scope.row.value" placeholder="请选择"
                                    v-if="scope.row.isEdit && scope.row.inputType == 1"
                                    @change="handleSelectChange(scope.row)">
                                    <el-option v-for="item in scope.row.selectOptions" :key="item" :label="item"
                                        :value="item">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="属性说明">
                            <template slot-scope="scope">
                                <div :class="attributeLabelStyle(scope.row.type)">{{ scope.row.description }}</div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import * as URL from '../../UrlConstant'

    export default {
        data() {
            return {
                isCodeClick: false,
                preSelectCode: 0,
                currentSelectCode: 0,
                attributesData: [],
            }
        },
        computed: {
            viewTree() {
                return this.$store.state.viewTree
            },
            selectViewHashCode: function () {
                return this.$store.state.selectViewHashCode
            }
        },
        watch: {
            'selectViewHashCode': function (newVal) {
                this.isCodeClick = true
                document.getElementById(newVal.data).click()
            }
        },
        mounted() {
            if (this.$store.state.deviceInfoWebSocketPort === 0) {
                this.$router.push("/")
            } else {
                this.dragControllerDiv()
                this.handleViewTreeRefresh()
            }
        },
        methods: {
            // 输入框失去焦点
            handleTextBlur(data) {
                this.setAttributesValue(data.attributes, data.value)
            },
            // 选择框改变
            handleSelectChange(data) {
                this.setAttributesValue(data.attributes, data.value)
            },
            setAttributesValue(name, value) {
                this.axios.get(URL.SET_ATTRIBUTES, {
                    params: {
                        code: this.currentSelectCode,
                        attribute: name,
                        value: value
                    }
                }).then((resp) => {
                    if (!resp.data.success) {
                        this.$message({
                            showClose: true,
                            message: resp.data.message,
                            type: 'error',
                        })
                    }
                })
            },
            attributeLabelStyle(type) {
                if (type == 1) {
                    return 'attribute-label'
                }
                return 'attribute-content'
            },
            handleViewTreeRefresh() {
                this.axios.get(URL.VIEW_VIEW_TREE).then((resp) => {
                    if (resp.data.success) {
                        this.$store.state.viewTree = resp.data.data
                    } else {
                        this.$message({
                            showClose: true,
                            message: resp.data.message,
                            type: 'error',
                        })
                    }
                })
            },
            handleInstallMonitorView() {
                this.axios.get(URL.VIEW_INSTALL_MONITOR_VIEW).then((resp) => {
                    if (!resp.data.success) {
                        this.$message({
                            showClose: true,
                            message: resp.data.message,
                            type: 'error',
                        })
                    }
                })
            },
            handleUnInstallMonitorView() {
                this.axios.get(URL.VIEW_UNINSTALL_MONITOR_VIEW).then((resp) => {
                    if (!resp.data.success) {
                        this.$message({
                            showClose: true,
                            message: resp.data.message,
                            type: 'error',
                        })
                    }
                })
            },
            // 节点点击回调
            handleNodeClick(data) {
                if (!this.isCodeClick) {
                    // 通知手机选中View
                    this.axios.get(URL.VIEW_SELECT_VIEW, {
                        params: {
                            code: data.id
                        }
                    }).then((resp) => {
                        if (!resp.data.success) {
                            this.$message({
                                showClose: true,
                                message: resp.data.message,
                                type: 'error',
                            })
                        }
                    })
                }
                this.isCodeClick = false
                if (this.preSelectCode != data.id) {
                    this.preSelectCode = data.id
                    // 防止太频繁，0.5秒访问一次
                    let _this = this
                    setTimeout(function () {
                        if (data.id == _this.preSelectCode) {
                            _this.loadViewAttributes(_this.preSelectCode)
                        }
                    }, 500);
                }
            },
            // 加载View的属性
            loadViewAttributes: function (code) {
                if (this.currentSelectCode != code) {
                    this.currentSelectCode = code
                    // 读取属性列表
                    this.axios.get(URL.GET_ATTRIBUTES, {
                        params: {
                            code: code
                        }
                    }).then((resp) => {
                        if (resp.data.success) {
                            this.attributesData = resp.data.data
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
            arraySpanMethod({ row, column, rowIndex, columnIndex }) {
                if (this.attributesData[rowIndex].type == 1) {
                    if (columnIndex === 0) {
                        return [1, 3]
                    } else {
                        return [0, 0]
                    }
                }
            },
            dragControllerDiv: function () {
                var resize = document.getElementsByClassName('resize');
                var left = document.getElementsByClassName('left');
                var mid = document.getElementsByClassName('mid');
                var box = document.getElementsByClassName('box');
                for (let i = 0; i < resize.length; i++) {
                    // 鼠标按下事件
                    resize[i].onmousedown = function (e) {
                        //颜色改变提醒
                        resize[i].style.background = '#818181';
                        var startX = e.clientX;
                        resize[i].left = resize[i].offsetLeft;
                        // 鼠标拖动事件
                        document.onmousemove = function (e) {
                            var endX = e.clientX;
                            var moveLen = resize[i].left + (endX - startX) - resize[i].clientWidth; // （endx-startx）=移动的距离。resize[i].left+移动的距离=左边区域最后的宽度
                            var maxT = box[i].clientWidth - resize[i].offsetWidth; // 容器宽度 - 左边区域的宽度 = 右边区域的宽度

                            if (moveLen < 200) moveLen = 200; // 左边区域的最小宽度为32px
                            if (moveLen > maxT - 200) moveLen = maxT - 200; //右边区域最小宽度为150px

                            resize[i].style.left = moveLen; // 设置左侧区域的宽度

                            for (let j = 0; j < left.length; j++) {
                                left[j].style.width = moveLen + 'px';
                                mid[j].style.width = (box[i].clientWidth - moveLen - 10) + 'px';
                            }
                        };
                        // 鼠标松开事件
                        document.onmouseup = function () {
                            //颜色恢复
                            resize[i].style.background = '#d6d6d6';
                            document.onmousemove = null;
                            document.onmouseup = null;
                            resize[i].releaseCapture && resize[i].releaseCapture(); //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
                        };
                        resize[i].setCapture && resize[i].setCapture(); //该函数在属于当前线程的指定窗口里设置鼠标捕获
                        return false;
                    };
                }
            },
        }
    }
</script>

<style>
    /* 拖拽相关样式 */
    /*包围div样式*/
    .box {
        width: 100%;
        height: 100%;
        margin: 1% 0px;
        overflow: hidden;
    }

    /*左侧div样式*/
    .left {
        width: calc(65% - 10px);
        /*左侧初始化宽度*/
        height: 100%;
        background: #FFFFFF;
        float: left;
    }

    /*拖拽区div样式*/
    .resize {
        cursor: col-resize;
        float: left;
        position: relative;
        top: 45%;
        background-color: #d6d6d6;
        border-radius: 5px;
        margin-top: -10px;
        width: 10px;
        height: 50px;
        background-size: cover;
        background-position: center;
        /*z-index: 99999;*/
        font-size: 32px;
        color: white;
    }

    /*拖拽区鼠标悬停样式*/
    .resize:hover {
        color: #444444;
    }

    /*右侧div'样式*/
    .mid {
        float: left;
        width: 35%;
        /*右侧初始化宽度*/
        height: 100%;
        background: #fff;
    }

    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }

    .flow-tree {
        min-width: 100%;
        display: inline-block !important;
    }

    .el-table td,
    .el-table th {
        padding: 0px;
    }

    .el-table .cell,
    .el-table th div,
    .el-table--border td:first-child .cell,
    .el-table--border th:first-child .cell {
        padding-left: 0px;
        padding-right: 0px;
    }

    .attribute-label {
        font-weight: bold;
        padding-top: 2px;
        padding-bottom: 2px;
        padding-left: 10px;
        padding-right: 10px;
        background-color: #eeeeee;
    }

    .attribute-content {
        padding-top: 2px;
        padding-bottom: 2px;
        padding-left: 10px;
        padding-right: 10px;
    }

    .el-table th>.cell {
        padding: 10px;
        margin-left: 10px;
    }
</style>