<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>提现记录</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <div slot="header" class="clearfix">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input placeholder="请输入搜索内容" v-model="queryInfo.keywords" clearable @clear="withdraw">
              <el-button slot="append" icon="el-icon-search" @click="withdraw"></el-button>
            </el-input>
          </el-col>
        </el-row>
      </div>

      <!-- 列表表格 -->
      <el-table :data="withdrawListData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="100"></el-table-column>
        <el-table-column prop="indent" label="订单号"></el-table-column>
        <el-table-column prop="money" label="金额(单位:元)"></el-table-column>
        <el-table-column prop="withdraw_account" label="提现账户">
          <template slot-scope="scope">
            <span v-if="scope.row.withdraw_account === '0'">支付宝</span>
            <span v-else-if="scope.row.withdraw_account === '1'">微信</span>
            <span v-else>QQ</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="付款状态">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.status === '0'">审核中</el-tag>
            <el-tag type="success" v-else-if="scope.row.status === '1'">已通过</el-tag>
            <el-tooltip placement="top" v-else>
              <div slot="content">原因：{{ scope.row.cause }}</div>
              <el-tag type="danger">已驳回</el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="提现时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | date }}
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.current_page"
        :page-sizes="[25, 30, 40, 50]"
        :page-size="queryInfo.per_page"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryInfo.total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 列表表格数据绑定
      withdrawListData: [],
      // 查询参数
      queryInfo: {
        //搜索关键字
        keywords: '',
        //当前页码
        current_page: 1,
        //每页显示多少条数据
        per_page: 25,
        // 总页数
        total: 0
      }
    };
  },
  created() {
    this.withdraw();
    // 回车进行搜索
    var self = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key === 13) {
        self.withdraw();
      }
    };
  },
  methods: {
    /**
     * 获取列表表格数据
     */
    async withdraw() {
      const { data: res } = await this.$http.get('Finance/withdrawList', { params: this.queryInfo });
      if (res.code !== 200) return this.$message.error(res.msg);
      this.queryInfo.total = res.data.total;
      this.withdrawListData = res.data.data;
    },

    /**
     * 每页显示多少条信息监听事件
     * @param {Object} val
     */
    handleSizeChange(val) {
      this.queryInfo.per_page = val;
      // 刷新列表
      this.withdraw();
    },

    /**
     * 当前页监听事件
     * @param {Object} val
     */
    handleCurrentChange(val) {
      this.queryInfo.current_page = val;
      // 刷新列表
      this.withdraw();
    }
  }
};
</script>

<style lang="less" scoped></style>
