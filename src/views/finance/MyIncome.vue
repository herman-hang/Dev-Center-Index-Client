<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>我的收入</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <div slot="header" class="clearfix">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input placeholder="请输入搜索内容" v-model="queryInfo.keywords" clearable @clear="buyLog">
              <el-button slot="append" icon="el-icon-search" @click="buyLog"></el-button>
            </el-input>
          </el-col>
        </el-row>
      </div>
      <el-table :data="buyLogData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="100"></el-table-column>
        <el-table-column prop="indent" label="订单号"></el-table-column>
        <el-table-column prop="product_id" label="产品ID" width="100"></el-table-column>
        <el-table-column prop="product_type" label="产品类型">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.product_type === '0'">插件</el-tag>
            <el-tag type="success" v-else>模板</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="buy_type" label="购买类型">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.buy_type === '0'">购买</el-tag>
            <el-tag v-else>续费</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="money" label="金额(单位:元)"></el-table-column>
        <el-table-column prop="pay_type" label="支付类型">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_type === '0'">微信支付</el-tag>
            <el-tag v-else-if="scope.row.pay_type === '1'">QQ支付</el-tag>
            <el-tag v-else>支付宝支付</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="buy_ip" label="记录IP"></el-table-column>
        <el-table-column prop="status" label="付款状态">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.status === '0'">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="购买时间">
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
      // 表单绑定的数据
      buyLogData: [],
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
    this.buyLog();
    // 回车进行搜索
    var self = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key === 13) {
        self.buyLog();
      }
    };
  },
  methods: {
    /**
     * 获取列表数据
     */
    async buyLog() {
      const { data: res } = await this.$http.get('Finance/myIncome', { params: this.queryInfo });
      if (res.code !== 200) return this.$message.error(res.msg);
      this.queryInfo.total = res.data.total;
      this.buyLogData = res.data.data;
    },

    /**
     * 每页显示多少条信息监听事件
     * @param {Object} val
     */
    handleSizeChange(val) {
      this.queryInfo.per_page = val;
      // 刷新列表
      this.buyLog();
    },

    /**
     * 当前页监听事件
     * @param {Object} val
     */
    handleCurrentChange(val) {
      this.queryInfo.current_page = val;
      // 刷新列表
      this.buyLog();
    }
  }
};
</script>

<style lang="less" scoped></style>
