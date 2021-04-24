<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/myinfo' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a>个人中心</a></el-breadcrumb-item>
      <el-breadcrumb-item><a>个人信息</a></el-breadcrumb-item>
    </el-breadcrumb>
    <el-card id="info-card">
      <div slot="header" class="clearfix">
        <span>个人信息</span>
      </div>

      <el-col :span="7">
        <el-card :body-style="{ padding: '0px' }">
          <img
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            class="image"
          />
          <div style="padding: 14px">
            <div class="bottom clearfix">
              <time class="time">{{ currentDate }}</time>
            </div>
          </div>
          <el-button type="text" class="button">修改头像</el-button>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-form label-width="80px" :model="userInfo">
          <el-form-item label="用户名">
            <el-input disabled v-model="userInfo.user_name"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="user_password">
            <el-input show-password v-model="userInfo.user_password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="user_email">
            <el-input v-model="userInfo.user_email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="user_mobile">
            <el-input v-model="userInfo.user_mobile"></el-input>
          </el-form-item>
          <el-form-item label="用户类型" prop="user_role">
            <el-radio-group disabled v-model="userInfo.user_role">
              <el-radio v-model="userInfo.user_role" :label="0"
                >管理员</el-radio
              >
              <el-radio v-model="userInfo.user_role" :label="1"
                >普通用户</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-button class="button" type="primary" @click="editUser"
          >更新资料</el-button
        >
      </el-col>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentDate: new Date(),
      user_id: "",
      userInfo: {},
    };
  },
  created() {
    this.user_id = sessionStorage.getItem("user_id");
    this.getUserinfo();
  },
  methods: {
    //获取个人信息
    async getUserinfo() {
      const { data: res } = await this.$http.get("/user/" + this.user_id);
      if (res.meta.status !== 200) {
        this.$alert("获取信息失败，请重新登录", {
          confirmButtonText: "确定",
          callback: () => {
            window.sessionStorage.clear();
            this.$router.push("/login");
          },
        });
      }
      this.$data.userInfo = res.data;
    },
    //更新资料
    async editUser() {
      const { data: res } = await this.$http.put(
        "/users/" + this.userInfo.user_id,
        this.userInfo
      );
      if (res.meta.status != 200) {
        return this.$message.error("更新失败！");
      }
      this.$message.success(res.meta.message);
      this.editDialogVisible = false;
      //更新信息
      this.userInfo = res.data;
    },
  },
};
</script>
<style>
.el-card {
  width: 100%;
}
.button {
  margin-left: 50%;
  transform: translate(-50%);
}
.el-col {
  align-content: center;
}
.time {
  font-size: 13px;
  color: #999;
}

.image {
  margin-top: 10px;
  margin-left: 50%;
  transform: translate(-50%);
  width: 200px;
  height: 200px;
  display: block;
  border-radius: 20%;
}
</style>