<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/myinfo' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a>会议室管理</a></el-breadcrumb-item>
      <el-breadcrumb-item><a>会议室列表</a></el-breadcrumb-item>
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
              @clear="getRoomList"
            >
              <el-select v-model="select" slot="prepend" placeholder="请选择">
                <el-option label="会议名称" value="1"></el-option>
                <el-option label="会议室名称" value="2"></el-option>
                <el-option label="会议日期" value="3"></el-option>
              </el-select>
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getRoomList()"
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
              添加会议室
            </el-button>
          </el-col>
        </div>
      </el-row>
      <el-table
        :data="roomList"
        border
        :default-sort="{ prop: 'room_no', order: 'descending' }"
      >
        <el-table-column label="编号" sortable prop="room_no" fixed="left">
        </el-table-column>
        <el-table-column
          label="会议室名称"
          sortable
          prop="room_name"
        ></el-table-column>
        <el-table-column sortable label="可容纳人数" prop="room_size">
        </el-table-column>
        <el-table-column label="会议室类型" prop="room_type"> </el-table-column>
        <el-table-column label="状态" prop="room_state">
          <template id="statereg" v-slot="scope">
            <el-switch
              @change="stateChange(scope.row)"
              v-model="scope.row.room_state"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
            {{ "\xa0\xa0" + (scope.row.room_state == 1 ? "可用" : "已禁用") }}
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="room_desc"> </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template id="statereg" v-slot="scope">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              circle
              @click="showEditDialog(scope.row.room_id)"
            ></el-button>
            <el-button
              size="small"
              type="danger"
              icon="el-icon-delete"
              @click="deleteRoom(scope.row.room_id)"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 50, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="infototal"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="请输入会议室信息"
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
        <el-form-item label="会议室名称" prop="room_name">
          <el-input v-model="addForm.room_name"></el-input>
        </el-form-item>
        <el-form-item label="编号" prop="room_no">
          <el-input v-model="addForm.room_no"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="room_type">
          <el-input v-model="addForm.room_type"></el-input>
        </el-form-item>
        <el-form-item label="容纳人数" prop="room_size">
          <el-input v-model.number="addForm.room_size"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="room_state">
          <el-switch
            inactive-value="0"
            active-value="1"
            v-model="addForm.room_state"
          ></el-switch>
        </el-form-item>
        <el-form-item label="备注" prop="room_desc">
          <el-input type="textarea" v-model="addForm.room_desc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="addRoom"> 确 定 </el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改会议室信息"
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
        <el-form-item label="会议室名称">
          <el-input v-model="editForm.room_name"></el-input>
        </el-form-item>
        <el-form-item label="会议室编号" prop="room_no">
          <el-input disabled v-model="editForm.room_no"></el-input>
        </el-form-item>
        <el-form-item label="会议室类型" prop="room_type">
          <el-input v-model="editForm.room_type"></el-input>
        </el-form-item>
        <el-form-item label="容纳人数" prop.number="room_size">
          <el-input v-model.number="editForm.room_size"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="room_desc">
          <el-input type="textarea" v-model="editForm.room_desc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoom">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addForm: {},
      editForm: {},
      addFormRules: {
        room_name: [
          { required: true, message: "请输入会议室名", triiger: "blur" },
          { min: 3, max: 10, message: "长度在3到10个字符之间" },
        ],
        room_no: [
          { required: true, message: "请输入会议室编号", triiger: "blur" },
          {
            message: "请输入数字编号",
            trigger: ["blur", "change"],
          },
        ],
        room_size: [
          { required: true, message: "请输入可容纳人数", trigger: "blur" },
          {
            type: "number",
            message: "请输入数字",
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
      roomList: [],
      infototal: 2,
      select: "1",
    };
  },
  created() {
    this.getRoomList();
  },
  methods: {
    async getRoomList() {
      const { data: res } = await this.$http.get("/rooms", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.message);
      }
      this.infototal = res.data.total;
      this.roomList = res.data.list;
    },
    async stateChange(roominfo) {
      const { data: res } = await this.$http.put(
        `/rooms/${roominfo.room_id}/state/${roominfo.room_state}`
      );
      if (res.meta.status !== 200) {
        roominfo.room_state = !roominfo.room_state;
        return this.$message.error(res.meta.message);
      }
      this.$notify.success({
        title: "会议室",
        message: res.meta.message,
        showClose: false,
      });
    },

    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getRoomList();
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getRoomList();
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
    addRoom() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("/rooms", this.addForm);
        if (res.meta.status != 200) {
          return this.$message.error(res.meta.message);
        }
        this.$notify.success({
          title: "会议室",
          message: res.meta.message,
          showClose: false,
        });
        //关闭
        this.addDialogVisible = false;
        //刷新列表
        this.getRoomList();
      });
    },
    async showEditDialog(room_id) {
      const { data: res } = await this.$http.get("/rooms/" + room_id);
      if (res.meta.status != 200) {
        return this.$message.error(res.meta.message);
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    editRoom() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "/rooms/" + this.editForm.room_id,
          this.editForm
        );
        if (res.meta.status != 200) {
          return this.$message.error(res.meta.message);
        }
        this.$message.success(res.meta.message);
        this.editDialogVisible = false;
        //刷新列表
        this.getRoomList();
      });
    },
    deleteRoom(room_id) {
      this.$confirm("此操作将永久删除该会议室, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete("/rooms/" + room_id);
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.message);
          }
          this.$notify.success({
            title: "会议室",
            message: res.meta.message,
            showClose: false,
          });
          this.getRoomList();
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