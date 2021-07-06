<template>
  <div>
    <el-container style="padding: 20px; height: 100%">
      <el-aside width="20px">
        <div style="position: fixed; margin-left: 10px">
          <div style="margin-top: 20px">
            <el-tooltip
              class="item"
              effect="dark"
              content="清空列表"
              placement="right"
            >
              <el-button
                icon="el-icon-delete"
                @click="logcatClean"
                circle
              ></el-button>
            </el-tooltip>
          </div>
          <div style="margin-top: 20px">
            <el-tooltip
              class="item"
              effect="dark"
              content="置底"
              placement="right"
            >
              <el-button
                icon="el-icon-bottom"
                circle
                v-bind:class="{ 'el-button--primary': logcatBottomCheck }"
                @click="handleBottomClick"
              ></el-button>
            </el-tooltip>
          </div>
          <div style="margin-top: 20px">
            <el-tooltip
              class="item"
              effect="dark"
              content="无限缓存"
              placement="right"
            >
              <el-button
                icon="el-icon-tickets"
                circle
                v-bind:class="{ 'el-button--primary': logcatUnlimited }"
                @click="handleToggleUnlimitedClick"
              ></el-button>
            </el-tooltip>
          </div>
          <div style="margin-top: 20px">
            <el-tooltip
              class="item"
              effect="dark"
              content="上传查看LogCat"
              placement="right"
            >
              <el-button
                icon="el-icon-upload2"
                circle
                @click="uploadLogCat"
              ></el-button>
            </el-tooltip>
          </div>
        </div>
      </el-aside>
      <el-main style="height: 880px;">
        <div id="logcatContentView">
          <ul>
            <li v-for="(item, index) in logcatList" v-bind:key="item + index">
              <b
                ><code
                  v-bind:class="{
                    logcatv: eq(item, 'V'),
                    logcatd: eq(item, 'D'),
                    logcati: eq(item, 'I'),
                    logcatw: eq(item, 'W'),
                    logcate: eq(item, 'E'),
                    logcata: eq(item, 'A'),
                  }"
                  >{{ item }}</code
                ></b
              >
            </li>
          </ul>
          <div id="logcatBottomDiv" style="height: 10px"></div>
        </div>
      </el-main>
    </el-container>

    <el-dialog
      title="输入日志文件内容"
      :visible.sync="uploadViewIsShow"
      style="text-align: center"
    >
      <el-input
        type="textarea"
        :rows="10"
        placeholder="请输入内容"
        v-model="logCat"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadViewIsShow = false">取 消</el-button>
        <el-button type="primary" @click="handleLogCat">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="查看LogCat"
      :visible.sync="viewLogCatDialogIsShow"
      width="96%"
    >
      <LogCatDialogView v-bind:log-cat-list="logCatList"></LogCatDialogView>
    </el-dialog>
  </div>
</template>

<script>
import LogCatDialogView from "./LogCatDialogView";

export default {
  name: "LogcatView",
  data() {
    return {
      uploadViewIsShow: false,
      viewLogCatDialogIsShow: false,
      logCat: "",
      logCatList: [],
    };
  },
  components: {
    LogCatDialogView,
  },
  computed: {
    logcatList() {
      return this.$store.state.logcatList;
    },
    logcatBottomCheck: {
      get: function () {
        return this.$store.state.logcatBottomCheck;
      },
      set: function (val) {
        if (val) {
          document.getElementById("logcatBottomDiv").scrollIntoView();
        }
        this.$store.state.logcatBottomCheck = val;
      },
    },
    logcatUnlimited: {
      get: function () {
        return this.$store.state.logcatUnlimited;
      },
      set: function (val) {
        this.$store.state.logcatUnlimited = val;
      },
    },
  },
  mounted() {
    if (this.$store.state.deviceInfoWebSocketPort === 0) {
      this.$router.push("/");
    } else {
      document.getElementById("logcatContentView").style.cssText =
        "height: " + (document.documentElement.clientHeight - 170) + "px";
      if (this.logcatBottomCheck) {
        document.getElementById("logcatBottomDiv").scrollIntoView();
      }
    }
  },
  methods: {
    logcatClean() {
      this.$store.state.logcatList = [];
    },
    eq(item, string) {
      // (item.split(' ')[4] === 'A')
      if (item !== undefined) {
        let arr = item.split(" ");
        return arr[6] === string || arr[4] === string;
      }
      return false;
    },
    handleBottomClick() {
      this.logcatBottomCheck = !this.logcatBottomCheck;
    },
    handleToggleUnlimitedClick() {
      this.logcatUnlimited = !this.logcatUnlimited;
    },
    uploadLogCat() {
      this.uploadViewIsShow = true;
    },
    handleLogCat() {
      this.uploadViewIsShow = false;
      const data = JSON.parse(this.logCat);
      this.logCatList = data.logCat;
      this.viewLogCatDialogIsShow = true;
    },
  },
  watch: {
    "$store.state.logcatList": function () {
      if (this.logcatBottomCheck) {
        document.getElementById("logcatBottomDiv").scrollIntoView();
      }
    },
  },
};
</script>

<style scoped>
li {
  list-style-type: none;
}

.logcatv {
  color: rgb(187, 187, 187);
}
.logcatd {
  color: rgb(10, 114, 190);
}
.logcati {
  color: rgb(75, 185, 21);
}
.logcatw {
  color: rgb(159, 158, 5);
}
.logcate {
  color: rgb(254, 108, 103);
}
.logcata {
  color: rgb(236, 15, 3);
}
</style>