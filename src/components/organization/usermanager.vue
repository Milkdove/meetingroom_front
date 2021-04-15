<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/myinfo' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a>组织管理</a></el-breadcrumb-item>
      <el-breadcrumb-item><a>组员管理</a></el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20" style="width: 100%">
        <div style="margin-top: 15px">
          <el-col :span="10">
            <el-input
              placeholder="请输入内容"
              v-model="queryInfo.query"
              class="input-with-select"
              clearable
              @clear="getUserList"
            >
              <el-select v-model="select" slot="prepend" placeholder="请选择">
                <el-option label="用户名" value="1"></el-option>
                <el-option label="电话" value="2"></el-option>
                <el-option label="邮箱" value="3"></el-option>
              </el-select>
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getUserList()"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="14">
            <el-button
              style="float: right"
              icon="el-icon-plus"
              type="primary"
              @click="addDialogVisible = true"
            >
              添加用户
            </el-button>
          </el-col>
        </div>
      </el-row>
      <el-table :data="userList" border>
        <el-table-column label="" type="index"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="电话" prop="mobile"> </el-table-column>
        <el-table-column label="email" prop="email"> </el-table-column>
        <el-table-column label="状态">
          <template id="statereg" v-slot="scope">
            <el-switch
              @change="stateChange(scope.row)"
              v-model="scope.row.state"
              active-color="rgb(38, 148, 134)"
              inactive-color="#bbb"
            >
            </el-switch>
            {{ "\xa0\xa0" + (scope.row.state ? "已启用" : "已禁用") }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template id="statereg" v-slot="scope">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              circle
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              size="small"
              type="danger"
              icon="el-icon-delete"
              @click="deleteUser(scope.row.id)"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 10, 50, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="infototal"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="请输入用户信息"
      :visible.sync="addDialogVisible"
      width="50%"
      :before-close="handleClose"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input show-password v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="用户类型" prop="role">
          <el-radio-group v-model="addForm.role">
            <el-radio label="管理员"></el-radio>
            <el-radio label="普通用户"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="addForm.state"> </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="addUser"> 确 定 </el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名">
          <el-input disabled v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input show-password v-model="editForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="用户类型" prop="role">
          <el-radio-group v-model="editForm.role">
            <el-radio label="管理员"></el-radio>
            <el-radio label="普通用户"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
        role: "普通用户",
        state: false,
      },
      editForm: {},
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", triiger: "blur" },
          { min: 3, max: 10, message: "长度在3到10个字符之间" },
        ],
        password: [
          { required: true, message: "请输入密码", triiger: "blur" },
          { min: 6, max: 14, message: "长度在6到14个字符之间" },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
      },
      editDialogVisible: false,
      addDialogVisible: false,
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 1,
      },
      userList: [
        {
          id: 2,
          username: "tige117",
          mobile: "18616358651",
          email: "tige112@163.com",
          state: true, // 当前用户的状态
        },
        {
          id: 1,
          username: "123123",
          mobile: "123123",
          email: "tige112@163.com",
          state: false, // 当前用户的状态
        },
        {
          id: 1,
          username: "1qwe",
          mobile: "123123",
          email: "tige112@163.com",
          state: false, // 当前用户的状态
        },
        {
          id: 2,
          username: "zs",
          mobile: "123123",
          email: "tige112@163.com",
          state: true, // 当前用户的状态
        },
      ],
      infototal: 2,
      select: "",
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("/get/users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败！");
      }
      this.total = res.data.total;
      // this.userList = res.data.users;
    },
    async stateChange(userinfo) {
      const { data: res } = await this.$http.put(
        `/put/users/${userinfo.id}/state/${userinfo.state}`
      );
      if (res.meta.status !== 200) {
        userinfo.state = !userinfo.state;
        return this.$message.error("更改失败");
      }
      this.$message.success(res.meta.message);
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getUserList();
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "/post/users",
          this.addForm
        );
        if (res.meta.status != 201) {
          return this.$message.error("添加用户失败！");
        }
        this.$message.success(res.meta.message);
        //关闭
        this.addDialogVisible = false;
        //刷新列表
        this.getUserList();
      });
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("/get/users/" + id);
      if (res.meta.status != 200) {
        return this.$message.error("查询失败");
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    editUser() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "/put/users/" + this.editForm.id,
          this.editForm
        );
        if (res.meta.status != 200) {
          return this.$message.error("修改用户失败！");
        }
        this.$message.success(res.meta.message);
        this.editDialogVisible = false;
        //刷新列表
        this.getUserList();
      });
    },
    deleteUser(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete("/delete/users/" + id);
          if (res.meta.status !== 200) {
            return this.$message.error("删除失败！");
          }
          this.$message.success(res.meta.message);
          this.getUserList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "删除取消",
          });
        });
    },
  },
};
</script>

<style lang="less" scoped>
.el-select {
  width: 110px;
}
</style>