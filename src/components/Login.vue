<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/image/icon alpha.png" alt="" />
      </div>
      <el-form
        ref="loginFormRef"
        :rules="rules"
        :model="loginForm"
        label-width="0px"
        class="login_form"
      >
        <!-- username -->
        <el-form-item prop="user_name">
          <el-input
            placeholder="请输入账号"
            prefix-icon="el-icon-user-solid"
            v-model="loginForm.user_name"
          ></el-input>
        </el-form-item>
        <!-- password -->
        <el-form-item prop="user_password">
          <el-input
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            v-model="loginForm.user_password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button
            :loading="loading"
            @click="login('loginFormRef')"
            type="primary"
            >登录</el-button
          >
          <el-button @click="resetForm('loginFormRef')" type="info"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单数据绑定对象

      loading: false,
      loginForm: {
        user_name: "admin",
        user_password: "123456",
      },
      rules: {
        // 验证信息是否合法
        user_name: [
          { required: true, message: "请输入用户名", triiger: "blur" },
          { min: 3, max: 10, message: "长度在3到10个字符之间" },
        ],
        user_password: [
          { required: true, message: "请输入密码", triiger: "blur" },
          { min: 6, max: 14, message: "长度在6到14个字符之间" },
        ],
      },
    };
  },

  methods: {
    // 重置方法
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 表单验证
    login(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("/login", this.loginForm);
        // const { data: res } = await this.$http.post("login", this.loginForm);
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.message);
        }
        this.$message.success("登陆成功！欢迎访问");

        window.sessionStorage.setItem("user_id", res.data.user_id);
        window.sessionStorage.setItem("user_role", res.data.user_role);
        window.sessionStorage.setItem(
          "organization_id",
          res.data.organization_id
        );
        window.sessionStorage.setItem("token", res.token);
        this.$router.push("/home");
      });
    },
  },
};
</script>

<style scoped  lang="less">
.login_container {
  background: rgb(38, 148, 134);
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background: rgb(255, 255, 255);
  border-radius: 20px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    width: 150px;
    height: 150px;
    border: 1px solid #eee;
    border-radius: 50%;
    box-shadow: 0 0 15px #aaa;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: rgb(255, 255, 255);
    }
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0%;
  width: 100%;
  padding: 0 30px;
  box-sizing: border-box;
}
</style>
