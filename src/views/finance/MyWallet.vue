<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>我的钱包</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <div slot="header" class="clearfix"><strong>我的钱包</strong></div>
      <!-- 主体信息 -->
      <el-form :model="myWalletForm" :rules="myWalletFormRules" ref="myWalletFormRef" label-width="100px">
        <el-form-item label="总消费" prop="expenditure">
          <span>￥{{ myWalletForm.expenditure }}</span>
        </el-form-item>
        <el-form-item label="总余额" prop="money">
          <span>￥{{ myWalletForm.money }}</span>
        </el-form-item>
        <el-form-item label="申请提现" prop="apply_money"><el-input type="number" placeholder="请输入申请余额" v-model="myWalletForm.apply_money"></el-input></el-form-item>
        <el-form-item label="到账账户" prop="account">
          <el-radio-group v-model="myWalletForm.account">
            <el-radio :label="0">支付宝</el-radio>
            <el-radio :label="1">微信</el-radio>
            <el-radio :label="2">QQ</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item><el-button type="primary" icon="el-icon-edit" @click="withdraw">提交</el-button></el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 表单数据绑定
      myWalletForm: {
        apply_money: '',
        account: ''
      },
      // 表单验证规则
      myWalletFormRules: {
        apply_money: [{ required: true, message: '请输入申请余额', trigger: 'blur' }],
        account: [{ required: true, message: '请选择申请到账的账户', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.moneyInfo();
  },
  methods: {
    /**
     * 获取总消费和总余额数据
     */
    async moneyInfo() {
      const { data: res } = await this.$http.get('Finance/myWallet');
      if (res.code !== 200) return this.$message.error(res.msg);
      this.myWalletForm = res.data;
    },

    /**
     * 申请提现
     */
    withdraw() {
      this.$refs.myWalletFormRef.validate(async valid => {
        const { data: res } = await this.$http.post('Finance/applyWithdraw', this.myWalletForm);
        if (res.code !== 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        this.moneyInfo();
      });
    }
  }
};
</script>

<style lang="less" scoped></style>
