<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/myinfo' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a>组织管理</a></el-breadcrumb-item>
      <el-breadcrumb-item><a>创建组织</a></el-breadcrumb-item>
    </el-breadcrumb>
    <el-card id="info-card">
      <div slot="header" class="clearfix">
        <span :hidden="!hasOrg">您已有以下组织</span>
        <span :hidden="hasOrg">尚未拥有组织，请创建！</span>
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
        <el-button @click="addOrg">创建组织</el-button>
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
    addOrg() {
      this.$prompt("给你的组织起一个好听的名字吧！", "创建组织", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[\u4E00-\u9FA5A-Za-z0-9]+$/,
        inputErrorMessage: "不能包含符号、空格或为空",
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
      const { data: res } = await this.$http.post("/organizations", val);
      if (res.meta.status !== 200) {
        return this.$message.error("创建失败！请检查名称！");
      }
      this.$data.orgInfo = res.data;
      sessionStorage.setItem("organization_id", res.data.organization_id);
      this.$message.success("恭喜您！创建组织成功！");
      this.hasOrg = true;
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