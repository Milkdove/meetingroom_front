<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/myinfo' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a>个人中心</a></el-breadcrumb-item>
      <el-breadcrumb-item><a>我的组织</a></el-breadcrumb-item>
    </el-breadcrumb>
    <el-card id="info-card">
      <div slot="header" class="clearfix">
        <span>我的组织</span>
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
        </el-col>
      </div>
      <div :hidden="hasOrg" style="text-align: center">
        <el-button @click="joinOrg">加入组织</el-button>
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
        return this.$message.error(res.meta.message);
      }
      this.hasOrg = true;
      this.$data.orgInfo = res.data;
    },
    joinOrg() {
      this.$prompt("请输入组织ID", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /[\d]{1,10}/,
        inputErrorMessage: "请输入数字",
      })
        .then((val) => {
          this.sendPost(val.value);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消！",
          });
        });
    },
    async sendPost(val) {
      const { data: res } = await this.$http.put(
        "/joinOrg/" + this.user_id + "/" + val
      );
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.message);
      } else {
        this.$message.success("已提交申请，请联系管理员审批！");
        this.$data.orgInfo = res.data;
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