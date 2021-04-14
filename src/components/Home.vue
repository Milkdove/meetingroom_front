<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/image/icon.png" class="icon" alt="" />
        <span>会议室管理系统</span>
      </div>
      <el-button size="mini" @click="logout">登出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-s-custom"></i>
              <span>组织管理</span>
            </template>
            <el-menu-item-group>
              <template slot="title">组织操作</template>
              <el-menu-item index="1-1">添加组织</el-menu-item>
              <el-menu-item index="1-2">删除组织</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="人员管理">
              <el-menu-item index="1-3">添加人员</el-menu-item>
              <el-menu-item index="1-3">申请审批</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-home"></i>
              <span>会议室管理</span>
            </template>
            <el-menu-item-group>
              <template slot="title">会议室管理</template>
              <el-menu-item index="2-1">添加会议室</el-menu-item>
              <el-menu-item index="2-2">删除会议室</el-menu-item>
              <el-menu-item index="2-2">查询会议室</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-s-claim"></i>
              <span>会议室申请</span>
            </template>
            <el-menu-item-group>
              <template slot="title">会议室申请</template>
              <el-menu-item index="3-1">预约会议室</el-menu-item>
              <el-menu-item index="3-2">查询会议室</el-menu-item>
              <el-menu-item index="3-2">取消申请</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span>个人信息</span>
            </template>
            <el-menu-item-group>
              <template slot="title">个人信息</template>
              <el-menu-item index="4-1">个人信息</el-menu-item>
              <el-menu-item index="4-2">我的预约</el-menu-item>
              <el-menu-item index="4-3">我的组织</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>Main</el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      isCollapse: false,
    };
  },
  created() {
    this.getMenuList();
  },

  methods: {
    //登出功能 清除token以及跳转回登录页面
    logout() {
      this.$confirm("是否退出登录？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          window.sessionStorage.clear();
          this.$message.success("已退出");
          this.$router.push("/login");
        })
        .catch(() => {});
    },
    async getMenuList() {
      const { data: res } = await this.$http.get("/get/menus");
      if (!res.meta)
        return this.$message.error("对不起，您的权限验证不通过，请重新登录");
      this.menulist = res.data;
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.icon {
  height: 50px;
  width: 50px;
}
.el-header {
  background-color: rgb(38, 148, 134);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ffff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #ffff;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: rgb(211, 211, 211);
}
.toggle-button {
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>