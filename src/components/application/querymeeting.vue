<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/myinfo' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a>会议室申请</a></el-breadcrumb-item>
      <el-breadcrumb-item><a>查询会议室安排</a></el-breadcrumb-item>
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
              @clear="getMeetingList"
            >
              <el-select v-model="select" slot="prepend" placeholder="请选择">
                <el-option label="名称" value="1"></el-option>
                <el-option label="类型" value="2"></el-option>
                <el-option label="人数大小" value="3"></el-option>
              </el-select>
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getMeetingList()"
              ></el-button>
            </el-input>
          </el-col>
        </div>
      </el-row>
      <el-table
        :data="meetingList"
        border
        :default-sort="{ prop: 'meeting_name', order: 'descending' }"
      >
        <el-table-column
          label="会议ID"
          width="100px"
          sortable
          prop="meeting_id"
          fixed="left"
        >
        </el-table-column>
        <el-table-column
          label="会议室名称"
          sortable
          prop="meeting_name"
        ></el-table-column>
        <el-table-column sortable label="审核状态" prop="meeting_state">
          <template ref="stateRef" v-slot="scope">
            {{ "\xa0\xa0" + (scope.row.meeting_state ? "审核通过" : "审核中") }}
          </template>
        </el-table-column>
        <el-table-column sortable label="会议日期" prop="meeting_date">
        </el-table-column>
        <el-table-column label="会议备注" prop="meeting_desc">
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              size="small"
              type="primary"
              @click="queryMeeting(scope.row.meeting_id)"
              >查看详情
            </el-button>
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
      title="会议详细信息"
      :visible.sync="meetingDialogVisible"
      width="50%"
    >
      <el-form :model="meetingForm" label-width="100px">
        <el-form-item label="会议ID">
          <el-input readonly v-model="meetingForm.meeting_id"></el-input>
        </el-form-item>
        <el-form-item label="会议名称">
          <el-input readonly v-model="meetingForm.meeting_name"></el-input>
        </el-form-item>
        <el-form-item label="会议室编号">
          <el-input readonly v-model="roomForm.room_no"></el-input>
        </el-form-item>
        <el-form-item label="会议室名称">
          <el-input readonly v-model="roomForm.room_name"></el-input>
        </el-form-item>
        <el-form-item label="会议时间">
          <el-input readonly v-model="meetingForm.meeting_date"></el-input>
        </el-form-item>
        <el-form-item label="发起者">
          <el-input readonly v-model="meetingForm.user_name"></el-input>
        </el-form-item>
        <el-form-item label="发起者手机">
          <el-input readonly v-model="meetingForm.user_mobile"></el-input>
        </el-form-item>
        <el-form-item label="审批人">
          <el-input readonly v-model="meetingForm.admin_name"></el-input>
        </el-form-item>
        <el-form-item label="审批状态" prop="meeting_state">
          {{ "\xa0\xa0" + (meetingForm.meeting_state ? "审核通过" : "审核中") }}
        </el-form-item>
        <el-form-item label="会议描述">
          <el-input
            type="textarea"
            readonly
            v-model="meetingForm.meeting_desc"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="meetingDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      meetingDialogVisible: false,
      queryInfo: {
        pagenum: 1,
        pagesize: 5,
      },
      meetingForm: {},
      roomForm: {},
      meetingList: [],
      infototal: 2,
      select: "1",
    };
  },
  created() {
    this.getMeetingList();
  },
  methods: {
    // 获取会议列表
    async getMeetingList() {
      const { data: res } = await this.$http.get("/allmeetings", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取会议列表失败！");
      }
      this.infototal = res.data.total;
      this.meetingList = res.data.list;
    },

    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getMeetingList();
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getMeetingList();
    },
    //获取详细的会议信息
    async queryMeeting(id) {
      this.meetingDialogVisible = true;
      const { data: res } = await this.$http.get("/meeting/" + id);
      if (res.meta.status != 200) {
        return this.$message.error(res.meta.message);
      }
      this.meetingForm = res.data;
      const { data: res2 } = await this.$http.get("/rooms/" + res.data.room_id);
      this.roomForm = res2.data;
      this.meetingDialogVisible = true;
    },
  },
};
</script>

<style lang="less" scoped>
.el-select {
  width: 110px;
}
</style>