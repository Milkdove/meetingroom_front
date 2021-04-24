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
        <el-table-column
          sortable
          label="用户名"
          prop="user_name"
        ></el-table-column>
        <el-table-column sortable label="电话" prop="user_mobile">
        </el-table-column>
        <el-table-column sortable label="email" prop="user_email">
        </el-table-column>
        <el-table-column label="状态" prop="user_state">
          <template id="statereg" v-slot="scope">
            <el-switch
              @change="stateChange(scope.row)"
              v-model="scope.row.user_state"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
            {{ "\xa0\xa0" + (scope.row.user_state == 1 ? "可用" : "已禁用") }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template id="statereg" v-slot="scope">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              circle
              @click="showEditDialog(scope.row.user_id)"
            ></el-button>
            <el-button
              size="small"
              type="danger"
              icon="el-icon-delete"
              @click="deleteUser(scope.row.user_id)"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
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
        <el-form-item label="用户名" prop="user_name">
          <el-input v-model="addForm.user_name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="user_password">
          <el-input show-password v-model="addForm.user_password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="user_email">
          <el-input v-model="addForm.user_email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="user_mobile">
          <el-input v-model="addForm.user_mobile"></el-input>
        </el-form-item>
        <el-form-item label="用户类型" prop="user_role">
          <el-radio-group v-model="addForm.user_role">
            <el-radio :label="0">管理员</el-radio>
            <el-radio :label="1">普通用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch
            :active-value="1"
            :inactive-value="0"
            v-model="addForm.user_state"
          >
          </el-switch>
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
          <el-input disabled v-model="editForm.user_name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="user_password">
          <el-input show-password v-model="editForm.user_password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="user_email">
          <el-input v-model="editForm.user_email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="user_mobile">
          <el-input v-model="editForm.user_mobile"></el-input>
        </el-form-item>
        <el-form-item label="用户类型">
          <el-radio v-model="editForm.user_role" :label="0">管理员</el-radio>
          <el-radio v-model="editForm.user_role" :label="1">普通用户</el-radio>
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
      addForm: {},
      editForm: {
        user_role: 1,
      },
      addFormRules: {
        user_name: [
          { required: true, message: "请输入用户名", triiger: "blur" },
          { min: 3, max: 10, message: "长度在3到10个字符之间" },
        ],
        user_password: [
          { required: true, message: "请输入密码", triiger: "blur" },
          { min: 6, max: 14, message: "长度在6到14个字符之间" },
        ],
        user_email: [
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
        pagenum: 1,
        pagesize: 5,
      },
      userList: [],
      infototal: 50,
      select: "1",
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("/users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败！");
      }
      this.infototal = res.data.total;
      this.userList = res.data.list;
    },
    async stateChange(userinfo) {
      const { data: res } = await this.$http.put(
        `/users/${userinfo.user_id}/state/${userinfo.user_state}`
      );
      if (res.meta.status !== 200) {
        userinfo.user_state = !userinfo.user_state;
        return this.$message.error("更改失败");
      }
      this.$notify.success({
        title: "用户",
        message: res.meta.message,
        showClose: false,
      });
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
        const { data: res } = await this.$http.post("/users", this.addForm);
        if (res.meta.status != 200) {
          return this.$message.error("添加用户失败！");
        }
        this.$notify.success({
          title: "用户",
          message: res.meta.message,
          showClose: false,
        });
        //关闭
        this.addDialogVisible = false;
        //刷新列表
        this.getUserList();
      });
    },
    async showEditDialog(user_id) {
      const { data: res } = await this.$http.get("/user/" + user_id);
      this.user_role = res.data.user_role;
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
          "/users/" + this.editForm.user_id,
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
    deleteUser(user_id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete("/users/" + user_id);
          if (res.meta.status !== 200) {
            return this.$message.error("删除失败！");
          }
          this.$notify.success({
            title: "用户",
            message: res.meta.message,
            showClose: false,
          });
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