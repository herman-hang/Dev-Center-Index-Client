<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>账号管理</el-breadcrumb-item>
      <el-breadcrumb-item>修改密码</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <div slot="header" class="clearfix"><strong>修改密码</strong></div>
      <!-- 主体信息 -->
      <el-form :model="passwordEditForm" :rules="passwordEditFormRules" ref="passwordEditFormRef" label-width="100px">
        <el-form-item label="用户名" prop="user">
          <span>{{ passwordEditForm.user }}</span>
        </el-form-item>
        <el-form-item label="原始密码" prop="mpassword"><el-input type="password" placeholder="请输入原始密码" v-model="passwordEditForm.mpassword"></el-input></el-form-item>
        <el-form-item label="新密码" prop="password"><el-input type="password" placeholder="请输入新密码" v-model="passwordEditForm.password"></el-input></el-form-item>
        <el-form-item label="确认密码" prop="passwords"><el-input type="password" placeholder="请输入确认密码" v-model="passwordEditForm.passwords"></el-input></el-form-item>
        <el-form-item><el-button type="primary" icon="el-icon-edit" @click="passEdit">提交</el-button></el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义验证规则
    var validatePasswords = (rule, value, callback) => {
      if (value !== this.passwordEditForm.password) {
        callback(new Error('两次输入密码不一致！'));
      } else {
        callback();
      }
    };
    return {
      // 表单数据绑定
      passwordEditForm: {
        mpassword: '',
        password: '',
        passwords: ''
      },
      // 验证表单规则
      passwordEditFormRules: {
        mpassword: [{ required: true, message: '请输入原始密码', trigger: 'blur' }],
        password: [{ required: true, message: '请输入新密码', trigger: 'blur' }, { min: 6, max: 15, message: '新密码只能是6到15位之间', trigger: 'blur' }],
        passwords: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { min: 6, max: 15, message: '确认密码只能是6到15位之间', trigger: 'blur' },
          { validator: validatePasswords, trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.material();
  },
  methods: {
    /**
     * 获取资料数据
     */
    async material() {
      const { data: res } = await this.$http.get('Account/material');
      if (res.code !== 200) return this.$message.error(res.msg);
      this.passwordEditForm = res.data;
    },

    /**
     * 修改密码提交
     */
    passEdit() {
      this.$refs.passwordEditFormRef.validate(async valid => {
        if (!valid) return;
        // 发起请求
        const { data: res } = await this.$http.put('Account/passwordEdit', this.passwordEditForm);
        if (res.code !== 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        sessionStorage.removeItem('user_token');
        this.$router.push('/login');
      });
    }
  }
};
</script>

<style lang="less" scoped></style>
