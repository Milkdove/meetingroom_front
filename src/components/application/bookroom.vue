<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/myinfo' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a>会议室申请</a></el-breadcrumb-item>
      <el-breadcrumb-item><a>预约会议室</a></el-breadcrumb-item>
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
                <el-option label="名称" value="1"></el-option>
                <el-option label="类型" value="2"></el-option>
                <el-option label="人数大小" value="3"></el-option>
              </el-select>
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getRoomList()"
              ></el-button>
            </el-input>
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
        <el-table-column label="状态">
          <template id="statereg" v-slot="scope">
            {{ "\xa0\xa0" + (scope.row.room_state ? "可用" : "不可用") }}
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="room_desc"> </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template id="statereg" v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-date"
              @click="showBookDialog(scope.row.room_id)"
              >预定</el-button
            >
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
      title="预定会议室"
      :visible.sync="bookDialogVisible"
      width="80%"
      :before-close="handleClose"
    >
      <el-form
        :model="bookForm"
        :rules="bookFormRules"
        ref="bookFormRef"
        label-width="100px"
      >
        <el-form-item label="会议名称" prop="meeting_name">
          <el-input v-model="bookForm.meeting_name"></el-input>
        </el-form-item>
        <el-form-item label="会议室编号" prop="room_no">
          <el-input disabled v-model="bookForm.room_no"></el-input>
        </el-form-item>
        <el-form-item class="timeText" size="mini" label="已被预约时间">
          <el-table :data="room_time" height="200px" border>
            <el-table-column
              label="会议ID"
              width="100px"
              prop="meeting_id"
              align="center"
            >
            </el-table-column>
            <el-table-column align="center" label="开始时间" sortable>
              <template v-slot="scope"
                ><el-date-picker
                  readonly
                  v-model="scope.row.meeting_starttime"
                  type="datetime"
                >
                </el-date-picker
              ></template>
            </el-table-column>
            <el-table-column align="center" disabled label="结束时间" sortable>
              <template v-slot="scope"
                ><el-date-picker
                  readonly
                  v-model="scope.row.meeting_endtime"
                  type="datetime"
                >
                </el-date-picker
              ></template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="预约时间" prop="meeting_date">
          <el-date-picker
            v-model="bookForm.meeting_date"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['9:00:00', '12:00:00']"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="参会人数" prop="meeting_size">
          <el-input v-model.number="bookForm.meeting_size"></el-input>
        </el-form-item>
        <el-form-item label="会议备注" prop="meeting_desc">
          <el-input type="textarea" v-model="bookForm.meeting_desc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bookDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="bookRoom">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bookForm: {},
      room_time: {},
      bookFormRules: {
        meeting_name: [
          { required: true, message: "请输入会议室名", triiger: "blur" },
          { min: 3, max: 10, message: "长度在3到10个字符之间" },
        ],
        meeting_size: [
          {
            required: true,
            pattern: /^-?[1-9]\d*$/,
            message: "请输入正整数",
            triiger: "blur",
          },
        ],
      },
      bookDialogVisible: false,
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
    async showBookDialog(room_id) {
      //点击预定按钮 获取会议室信息
      const { data: res } = await this.$http.get("/rooms/" + room_id);
      if (res.meta.status != 200) {
        return this.$message.error(res.meta.message);
      }
      if (res.data.room_state == 0) {
        return this.$message.error("该会议室不可用！");
      }
      this.room_time = res.list;
      this.bookForm = res.data;
      this.bookDialogVisible = true;
    },
    //预定会议室
    bookRoom() {
      this.$refs.bookFormRef.validate(async (valid) => {
        if (!valid) return;
        if (!this.bookForm.meeting_date) {
          alert("请选择日期");
          return;
        }
        const { data: res } = await this.$http.post("/meetings", this.bookForm);
        if (res.meta.status != 200) {
          return this.$message.error(res.meta.message);
        }
        this.$message.success(res.meta.message);
        this.bookDialogVisible = false;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-select {
  width: 110px;
}
.el-date-picker {
  width: 100px;
}
</style>