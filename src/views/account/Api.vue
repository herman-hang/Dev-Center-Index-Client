<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>账号管理</el-breadcrumb-item>
      <el-breadcrumb-item>API设置</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <div slot="header" class="clearfix"><strong>API设置</strong></div>
      <!-- 主体信息 -->
      <el-form :model="apiForm" ref="apiFormRef" label-width="100px">
        <el-form-item label="API:" prop="api">
          <span class="item">{{ apiForm.api }}</span>
        </el-form-item>
        <el-form-item label="KEY:" prop="api_key">
          <span class="item">{{ apiForm.api_key }}</span>
          <el-button class="btn" size="mini" @click="reset" v-if="apiForm.api_key == ''">生成</el-button>
          <el-button class="btn" size="mini" @click="reset" v-else>重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 表单数据绑定
      apiForm: {}
    };
  },
  created() {
    this.api();
  },
  methods: {
    /**
     * 获取表单数据
     */
    async api() {
      const { data: res } = await this.$http.get('Account/api');
      if (res.code !== 200) return this.$message.error(res.msg);
      if (res.data.api_key === null) {
        res.data.api_key = '';
      }
      this.apiForm = res.data;
    },

    /**
     * 重置KEY
     */
    async reset() {
      const { data: res } = await this.$http.post('Account/resetKey');
      if (res.code !== 200) return this.$message.error(res.msg);
      this.$message.success(res.msg);
      this.api();
    }
  }
};
</script>

<style lang="less" scoped>
.item {
  color: red;
}
.btn {
  margin-left: 5px;
}
</style>
