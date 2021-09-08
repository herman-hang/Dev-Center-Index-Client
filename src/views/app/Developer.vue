<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>开发者中心</el-breadcrumb-item>
      <el-breadcrumb-item>成为开发者</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <div slot="header" class="clearfix"><strong>成为开发者</strong></div>
      <!-- 主体信息 -->
      <el-form :model="developerConfigForm" :rules="developerConfigFormRules" ref="developerConfigFormRef" label-width="120px" class="form">
        <el-form-item label="申请条件:">
          <el-card class="box-card">
            <div class="text item">{{ isDeveloperForm.condition }}</div>
          </el-card>
        </el-form-item>
        <el-form-item label="支付宝账户" prop="alipay"><el-input placeholder="请输入支付宝账户" v-model="developerConfigForm.alipay"></el-input></el-form-item>
        <el-form-item label="支付宝真实姓名" prop="alipay_name"><el-input placeholder="请输入支付宝真实姓名" v-model="developerConfigForm.alipay_name"></el-input></el-form-item>
        <el-form-item label="微信账户" prop="wxpay"><el-input placeholder="请输入微信账户" v-model="developerConfigForm.wxpay"></el-input></el-form-item>
        <el-form-item label="微信真实姓名" prop="wxpay_name"><el-input placeholder="请输入微信真实姓名" v-model="developerConfigForm.wxpay_name"></el-input></el-form-item>
        <el-form-item label="QQ账户" prop="qqpay"><el-input placeholder="请输入QQ账户" v-model="developerConfigForm.qqpay"></el-input></el-form-item>
        <el-form-item label="QQ名称" prop="qqpay_name"><el-input placeholder="请输入QQ名称" v-model="developerConfigForm.qqpay_name"></el-input></el-form-item>
        <el-form-item><el-button type="primary" icon="el-icon-edit" @click="developerConfigEdit">提交</el-button></el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 开发者申请条件表单
      isDeveloperForm: {},
      // 表单数据绑定
      developerConfigForm: {},
      // 表单验证规则
      developerConfigFormRules: {
        alipay: [{ required: true, message: '请输入支付宝账户', trigger: 'blur' }],
        alipay_name: [{ required: true, message: '请输入支付宝真实姓名', trigger: 'blur' }],
        wxpay: [{ required: true, message: '请输入微信账户', trigger: 'blur' }],
        wxpay_name: [{ required: true, message: '请输入微信真实姓名', trigger: 'blur' }],
        qqpay: [{ required: true, message: '请输入QQ账户', trigger: 'blur' }],
        qqpay_name: [{ required: true, message: '请输入QQ名称', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.getDeveloperConfig();
  },
  methods: {
    /**
     * 获取申请条件
     */
    async getDeveloperConfig() {
      const { data: res } = await this.$http.get('Developer/developerConfig');
      if (res.code !== 200) return this.$message.error(res.msg);
      this.isDeveloperForm = res.data;
      this.isForm();
    },

    /**
     * 提交申请
     */
    developerConfigEdit() {
      // xss过滤
      Object.keys(this.developerConfigForm).forEach(key => {
        this.developerConfigForm[key] = this.$xss(this.developerConfigForm[key]);
      });
      this.$refs.developerConfigFormRef.validate(valid => {
        if (!valid) return;
        this.$confirm('您确认要提交申请?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            const { data: res } = await this.$http.post('Developer/becomeDeveloper', this.developerConfigForm);
            if (res.code !== 201) return this.$message.error(res.msg);
            this.$message.success(res.msg);
            this.getDeveloperConfig();
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
      });
    },

    /**
     * 控制显示指定表单
     * @param {Object} type 显示表单类型
     */
    isForm() {
      if (this.isDeveloperForm.is_developer === '1') {
        // 申请中
        const loading = this.$loading({
          lock: true,
          text: '正在审核中...',
          spinner: 'el-icon-s-order',
          target: document.querySelector('.form')
        });
      } else if (this.isDeveloperForm.is_developer === '3') {
        this.customClass = 'danger-form';
        // 已驳回
        const loading = this.$loading({
          lock: true,
          text: '已驳回！原因：' + this.isDeveloperForm.cause,
          spinner: 'el-icon-s-release',
          target: document.querySelector('.form')
        });
      } else if (this.isDeveloperForm.is_developer === '2') {
        // 已通过
        const loading = this.$loading({
          lock: true,
          text: '恭喜！您申请成为开发者的请求已经通过审核！',
          spinner: 'el-icon-s-claim',
          target: document.querySelector('.form')
        });
      }
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.box-card {
  max-width: 600px;
  background-color: #f0f9eb;
  border-color: #e1f3d8;
  color: limegreen;
}
.text {
  font-size: 14px;
  white-space: pre-line;
}
.item {
  padding: 18px 0;
}
</style>
