<template>
  <div class="container">
    <div class="card">
      <div class="login-top">找回密码</div>
      <!-- 密码修改第一步表单区域 -->
      <el-form ref="passwordEditFormRef" :model="passwordEditForm" :rules="passwordEditFormRules" label-width="0px" class="form" v-show="oneForm">
        <!-- 用户名 -->
        <el-form-item prop="user"><el-input placeholder="请输入用户名" v-model="passwordEditForm.user" prefix-icon="el-icon-user-solid"></el-input></el-form-item>
        <!-- 邮箱 -->
        <el-form-item prop="email"><el-input placeholder="请输入绑定的邮箱" v-model="passwordEditForm.email" prefix-icon="el-icon-message"></el-input></el-form-item>
        <el-form-item prop="code">
          <div class="captcha-code">
            <el-input placeholder="请输入验证码" v-model="passwordEditForm.code" prefix-icon="el-icon-key" ref="codeInput" class="code"></el-input>
            <el-button class="send-code" plain @click="sendCode">
              <span v-show="sendCodeBtn">发送验证码</span>
              <span v-show="!sendCodeBtn">{{ second }} s</span>
            </el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="btn"><el-button type="primary" @click="next">下一步</el-button></div>
          <div class="btn">
            <router-link to="/login"><a href="javascript:;">返回登录</a></router-link>
          </div>
        </el-form-item>
      </el-form>

      <!-- 密码修改第二步表单 -->
      <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordFormRules" label-width="0px" class="form" v-show="twoForm">
        <el-form-item prop="password"><el-input type="password" placeholder="请输入密码" v-model="passwordForm.password" prefix-icon="el-icon-lock"></el-input></el-form-item>
        <el-form-item>
          <div class="btn"><el-button type="primary" @click="password">立即重置</el-button></div>
          <div class="btn">
            <router-link to="/login"><a href="javascript:;">返回登录</a></router-link>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <span>Copyright ©2021 {{ title }} v{{ version }} All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
import { validEmail } from '../utils/validate.js';
export default {
  data() {
    return {
      // 网站名称
      title: window.serverConfig.APP_NAME,
      // 系统版本
      version: window.serverConfig.APP_VERSION,
      // 密码修改第一步表单数据绑定对象
      passwordEditForm: {
        user: '',
        email: '',
        code: ''
      },
      // 密码修改第一步表单验证规则
      passwordEditFormRules: {
        user: [{ required: true, message: '请输入用户名', trigger: 'blur' }, { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: validEmail, trigger: 'blur' }]
      },
      // 控制第一步表单显示与隐藏
      oneForm: true,
      // 密码修改第二步表单数据绑定对象
      passwordForm: {
        password: ''
      },
      // 密码修改第二步表单验证规则
      passwordFormRules: {
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }]
      },
      // 控制第二步表单的显示与隐藏
      twoForm: false,
      // 发送验证码按钮初始化
      sendCodeBtn: true,
      // 初始化60秒
      second: 60,
      // 定时器
      timer: null
    };
  },
  created() {},
  methods: {
    /**
     * 发送验证码
     */
    sendCode() {
      this.$refs.passwordEditFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post('sendPassEmailCode', this.passwordEditForm);
        if (res.code !== 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        // 倒计时
        if (!this.timer) {
          this.sendCodeBtn = false;
          this.timer = setInterval(() => {
            if (this.second > 0 && this.second <= 60) {
              this.second--;
            } else {
              this.sendCodeBtn = true;
              // 清除定时器
              clearInterval(this.timer);
              // 恢复60s
              this.second = 60;
              this.timer = null;
            }
          }, 1000);
        }
      });
    },
    /**
     * 下一步操作
     */
    async next() {
      const { data: res } = await this.$http.post('passEditNext', this.passwordEditForm);
      if (res.code !== 200) return this.$message.error(res.msg);
      // 隐藏第一步的表单
      this.oneForm = false;
      // 显示第二步的表单
      this.twoForm = true;
    },

    /**
     * 执行修改密码
     */
    password() {
      this.$refs.passwordFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post('password', this.passwordForm);
        if (res.code !== 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        this.$router.push('/login');
      });
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  display: inline-block;
  background-image: url(../assets/image/background.jpeg);
  position: fixed;
  top: 0;
  left: 0;
  min-width: 1000px;
  z-index: 1;
  background-repeat: no-repeat;
  background-size: cover;
}
.card {
  position: absolute;
  width: 400px;
  height: 550px;
  border-radius: 5px;
  top: 50%;
  left: 50%;
  background-color: #fff;
  transform: translate(-50%, -50%);
  box-shadow: 0px 0px 5px #e2e3e5;
}
.form {
  position: absolute;
  top: 30%;
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
}
.login-top {
  font-size: 36px;
  text-align: center;
  margin-top: 50px;
}
.btn {
  display: flex;
  justify-content: center;
  .el-button {
    width: 370px;
  }
  a {
    margin: 3px;
  }
}
.code {
  width: 50%;
}
.captcha-code {
  display: flex;
  img {
    margin-left: 10px;
  }
}
.send-code {
  margin-left: 10px;
}
.footer {
  position: fixed;
  text-align: center;
  bottom: 5px;
  left: 0;
  right: 0;
  color: #fff;
}
</style>
