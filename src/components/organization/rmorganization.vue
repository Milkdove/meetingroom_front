<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/myinfo' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a>组织管理</a></el-breadcrumb-item>
      <el-breadcrumb-item><a>解散组织</a></el-breadcrumb-item>
    </el-breadcrumb>
    <el-card id="info-card">
      <div slot="header" class="clearfix">
        <span :hidden="!hasOrg">我的组织</span>
        <span :hidden="hasOrg">尚未拥有组织，请先创建！</span>
      </div>
      <div :hidden="!hasOrg">
        <el-col :span="7">
          <el-card :body-style="{ padding: '0px' }">
            <img
              src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"
              class="image2"
            />
            <div style="padding: 14px">
              <div>
                <time class="time">{{ currentDate }}</time>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="10">
          <el-form style="margin-top: 20%" label-width="80px" :model="orgInfo">
            <el-form-item label="组织ID">
              <el-input readonly v-model="orgInfo.organization_id"></el-input>
            </el-form-item>
            <el-form-item label="组织名称">
              <el-input readonly v-model="orgInfo.organization_name"></el-input>
            </el-form-item>
          </el-form>
          <div style="text-align: center">
            <el-button @click="deleteOrg">解散组织</el-button>
          </div>
        </el-col>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      hasOrg: false,
      currentDate: new Date(),
      organization_id: "",
      user_id: "",
      orgInfo: {},
    };
  },
  created() {
    this.user_id = sessionStorage.getItem("user_id");
    this.organization_id = sessionStorage.getItem("organization_id");
    this.getOrginfo();
  },
  methods: {
    async getOrginfo() {
      const { data: res } = await this.$http.get(
        "/organizations/" + this.organization_id
      );
      if (res.meta.status !== 200) {
        this.hasOrg = false;
        return this.$message.error("未查询到组织信息！");
      }
      this.hasOrg = true;
      this.$data.orgInfo = res.data;
    },
    deleteOrg() {
      this.$prompt("此操作无法撤回，请输入组织名确认！", "解散组织", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: "",
        inputErrorMessage: "不能包含符号、空格或为空",
      })
        .then((val) => {
          if (val.value !== this.$data.orgInfo.organization_name) {
            alert("输入不正确");
            return;
          }
          this.sendDelete();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消！",
          });
        });
    },
    async sendDelete() {
      const { data: res } = await this.$http.delete(
        "/organizations/" + this.$data.orgInfo.organization_id
      );
      if (res.meta.status !== 200) {
        console.log(res.meta.status);
        this.$message.error("删除失败！请重试");
      } else {
        this.$data.orgInfo = res.data;
        this.$message.success("完成！组织已解散！");
        sessionStorage.setItem("organization_id", null);
        this.hasOrg = false;
        created();
      }
    },
  },
};
</script>
<style>
.el-card {
  width: 100%;
}
.el-col {
  align-content: center;
}
.time {
  font-size: 13px;
  color: #999;
}

.image2 {
  margin-top: 10px;
  margin-left: 50%;
  transform: translate(-50%);
  width: 200px;
  height: 200px;
  display: block;
  border-radius: 20%;
}
</style>