<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/myinfo' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a>个人中心</a></el-breadcrumb-item>
      <el-breadcrumb-item><a>我的预约</a></el-breadcrumb-item>
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
          label="会议名称"
          sortable
          prop="meeting_name"
          fixed="left"
        >
        </el-table-column>
        <el-table-column
          label="审批人"
          sortable
          prop="admin_name"
        ></el-table-column>
        <el-table-column sortable label="审核状态" prop="meeting_state">
          <template v-slot="scope">
            {{ "\xa0\xa0" + (scope.row.meeting_state ? "审核通过" : "审核中") }}
          </template>
        </el-table-column>
        <el-table-column sortable label="会议日期" prop="meeting_date">
        </el-table-column>
        <el-table-column label="会议备注" prop="meeting_desc">
        </el-table-column>
        <el-table-column label="操作">
          <template id="statereg" v-slot="scope">
            <el-button
              size="small"
              type="danger"
              @click="cancelMeeting(scope.row.meeting_id)"
            >
              {{ scope.row.meeting_state ? "释放会议" : "取消申请" }}</el-button
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        pagenum: 1,
        pagesize: 5,
      },
      meetingList: [],
      infototal: 2,
      select: "1",
    };
  },
  created() {
    this.getMeetingList();
  },
  methods: {
    async getMeetingList() {
      const { data: res } = await this.$http.get("/meetings", {
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
    cancelMeeting(id) {
      this.$data.meeting_id = id;
      this.$confirm("是否取消该次会议室预约?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            "/meetings/" + this.$data.meeting_id
          );
          if (res.meta.status !== 200) {
            this.$message.error("无法释放！");
          } else {
            this.$message.success(res.meta.message);
            this.getMeetingList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "操作取消",
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