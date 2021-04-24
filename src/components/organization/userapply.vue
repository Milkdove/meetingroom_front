<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/myinfo' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a>审批管理</a></el-breadcrumb-item>
      <el-breadcrumb-item><a>会议审批</a></el-breadcrumb-item>
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
        :default-sort="{ prop: 'meeting_state', order: 'descending' }"
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
          label="会议名称"
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
              @click="
                queryMeeting(scope.row.meeting_id, scope.row.meeting_state)
              "
              >审批申请
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
        <el-form-item label="会议名称">
          <el-input readonly v-model="meetingForm.meeting_name"></el-input>
        </el-form-item>
        <el-form-item label="申请的会议室">
          <el-input readonly v-model="roomForm.room_name"></el-input>
        </el-form-item>
        <el-form-item label="会议室编号">
          <el-input readonly v-model="roomForm.room_no"></el-input>
        </el-form-item>
        <el-form-item label="会议室类型">
          <el-input readonly v-model="roomForm.room_type"></el-input>
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
        <el-button type="success" @click="passApply">通 过</el-button
        ><el-button type="danger" @click="nopassApply">驳 回</el-button>
        <el-button type="info" @click="meetingDialogVisible = false"
          >闲 置</el-button
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
      roomForm: {},
      meetingForm: {},
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
    async queryMeeting(id, state) {
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
    async passApply() {
      const { data: res } = await this.$http.put(
        "/meeting/" + this.meetingForm.meeting_id
      );
      if (res.meta.status !== 200) {
        this.$message.error("操作失败！请重试！");
      } else {
        this.$message.success(res.meta.message);
        this.meetingDialogVisible = false;
      }
      this.getMeetingList();
    },
    async nopassApply() {
      const { data: res } = await this.$http.delete(
        "/meetings/" + this.meetingForm.meeting_id
      );
      if (res.meta.status !== 200) {
        this.$message.error("操作失败！请重试！");
      } else {
        this.$message.success(res.meta.message);
        this.meetingDialogVisible = false;
      }
      this.getMeetingList();
    },
  },
};
</script>

<style lang="less" scoped>
.el-select {
  width: 110px;
}
</style>