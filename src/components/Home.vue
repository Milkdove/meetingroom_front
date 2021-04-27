<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/image/icon.png" class="icon" alt="" />
        <span>会议室管理系统</span>
      </div>
      <el-dropdown @command="jump">
        <div class="toggle-button">
          <el-avatar
            size="medium"
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
          ></el-avatar>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="/myinfo">个人中心</el-dropdown-item>
          <el-dropdown-item command="/myorganization"
            >我的组织</el-dropdown-item
          >
          <el-dropdown-item command="/mymeeting">我的预约</el-dropdown-item>
          <div @click="logout">
            <el-dropdown-item>退出登录</el-dropdown-item>
          </div>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '60px' : '210px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span>个人信息</span>
            </template>
            <el-menu-item-group>
              <template slot="title">个人中心</template>
              <el-menu-item index="myinfo">个人信息</el-menu-item>
              <el-menu-item index="myorganization">我的组织</el-menu-item>
              <el-menu-item index="mymeeting">我的预约</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-claim"></i>
              <span>会议室申请</span>
            </template>
            <el-menu-item-group>
              <template slot="title">会议室申请</template>
              <el-menu-item index="bookroom">预约会议室</el-menu-item>
              <el-menu-item index="querymeeting">查询会议安排</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3" v-if="isAdmin">
            <template slot="title">
              <i class="el-icon-s-home"></i>
              <span>会议室管理</span>
            </template>
            <el-menu-item-group>
              <template slot="title">会议室管理</template>
              <el-menu-item index="roomList">会议室列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4" v-if="isAdmin">
            <template slot="title">
              <i class="el-icon-s-custom"></i>
              <span>组织管理</span>
            </template>
            <el-menu-item-group>
              <template slot="title">组织操作</template>
              <el-menu-item index="addorganization">创建组织</el-menu-item>
              <el-menu-item index="rmorganization">解散组织</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="人员管理">
              <el-menu-item index="usermanager">组员管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="5" v-if="isAdmin">
            <template slot="title">
              <i class="el-icon-s-custom"></i>
              <span>审批管理</span>
            </template>
            <el-menu-item-group>
              <template slot="title">会议管理</template>
              <el-menu-item index="userapply">会议审批</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      isAdmin: false,
      isCollapse: false,
    };
  },
  created() {
    this.isAdmin = window.sessionStorage.getItem("user_role") == "0";
  },

  methods: {
    jump(url) {
      this.$router.push(url);
    },
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
  height: 45px;
  width: 90px;
  border-radius: 50%;
}
.el-header {
  background-color: rgb(38, 148, 134);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ffff;
  font-size: 25px;
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
  background-color: rgb(241, 238, 238);
}
.toggle-button {
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>