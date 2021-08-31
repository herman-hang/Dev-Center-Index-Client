<template>
  <div class="container">
    <div class="card">
      <div class="login-top">用户登录</div>
      <!-- 表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="form">
        <!-- 用户名 -->
        <el-form-item prop="user"><el-input placeholder="用户名" v-model="loginForm.user" prefix-icon="el-icon-user-solid"></el-input></el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password"><el-input placeholder="密码" v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input></el-form-item>

        <!-- 验证码 -->
        <el-form-item prop="code" v-show="captchaShow">
          <div class="captcha-code">
            <el-input placeholder="验证码" v-model="loginForm.code" prefix-icon="el-icon-key" ref="codeInput" class="code"></el-input>
            <img src="/" ref="code" alt="验证码" width="30%" @click="getCaptcha" />
          </div>
        </el-form-item>
        <el-form-item>
          <div class="register-password">
            <el-checkbox v-model="remember">记住密码</el-checkbox>
            <router-link to="/register"><a href="javascript:;">新用户注册</a></router-link>
          </div>
          <div class="btn"><el-button type="primary" @click="login">登录</el-button></div>
          <div class="password">
            <router-link to="/password"><a href="javascript:;">忘记密码？</a></router-link>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="btn">
            <a href="javascript:;" @click="oauthLogin('weixin')" title="微信登录" v-show="switchForm.qqlogin_switch">
              <img width="30" src="../assets/image/login/weixin.png" alt="微信登录" />
            </a>
            <a href="javascript:;" @click="oauthLogin('qq')" title="QQ登录" v-show="switchForm.weixinlogin_switch">
              <img width="30" src="../assets/image/login/qq.png" alt="QQ登录" />
            </a>
            <a href="javascript:;" @click="oauthLogin('weibo')" title="微博登录" v-show="switchForm.sinalogin_switch">
              <img width="30" src="../assets/image/login/weibo.png" alt="微博登录" />
            </a>
            <a href="javascript:;" @click="oauthLogin('gitee')" title="Gitee登录" v-show="switchForm.giteelogin_switch">
              <img width="30" src="../assets/image/login/gitee.png" alt="Gitee登录" />
            </a>
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
import { getCookie, setCookie } from '@/utils/cookie.js';
import { Base64 } from 'js-base64';
export default {
  data() {
    return {
      // 网站名称
      title: window.serverConfig.APP_NAME,
      // 系统版本
      version: window.serverConfig.APP_VERSION,
      // 记住密码初始化
      remember: false,
      // 表单绑定数据对象
      loginForm: {
        user: '',
        password: '',
        code: ''
      },
      // 第三方登录绑定
      bindLogin: {
        qq: window.serverConfig.BASE_API + 'oauth/login/type/' + 'qq',
        weixin: window.serverConfig.BASE_API + 'oauth/login/type/' + 'weixin',
        weibo: window.serverConfig.BASE_API + 'oauth/login/type/' + 'sina',
        gitee: window.serverConfig.BASE_API + 'oauth/login/type/' + 'gitee'
      },
      //表单数据验证
      loginFormRules: {
        user: [{ required: true, message: '请输入用户名！', trigger: 'blur' }, { min: 5, max: 15, message: '长度在 5 到 15 个字符！', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码！', trigger: 'blur' }, { min: 6, max: 15, message: '长度在 6 到 15 个字符！', trigger: 'blur' }]
      },
      // 控制验证码显示与隐藏
      captchaShow: false,
      // 控制快捷登录的显示与隐藏
      switchForm: {}
    };
  },
  created() {
    // 在页面加载时从cookie获取登录信息
    const user = getCookie('user');
    const password = Base64.decode(getCookie('password'));
    // 如果存在赋值给表单，并且将记住密码勾选
    if (user) {
      this.loginForm.user = user;
      this.loginForm.password = password;
      this.remember = true;
    }
    // 调用判断是否需要输入验证码方法
    this.isCheckCaptcha();
    // 调用获取快捷登录开关
    this.getSwitch();
    // 回车进行登录
    var self = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key === 13) {
        self.login();
      }
    };
  },
  methods: {
    /**
     * 登录监听事件
     */
    login() {
      // 前端预验证验证码
      const md5 = window.sessionStorage.getItem('md5');
      if (md5) {
        if (this.$md5(this.loginForm.code) !== md5) {
          // 聚焦
          this.$refs.codeInput.focus();
          return this.$message.error('验证码错误！');
        }
      }
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post('login', this.loginForm);
        if (res.code === 401) {
          return this.$message.error(res.msg);
        } else if (res.code === 403) {
          window.sessionStorage.setItem('md5', res.data.md5);
          // 密码或验证码错误
          this.$refs.code.setAttribute('src', res.data.base64);
          // 清空验证码输入框
          this.loginForm.code = '';
          // 显示验证码
          this.captchaShow = true;
          return this.$message.error(res.msg);
        } else {
          // 删除验证码的sessionStorage
          sessionStorage.removeItem('md5');
          // 调用记住存储表单信息方法
          this.setUserInfo();
          this.$message.success('登录成功！');
          //保存token值
          window.sessionStorage.setItem('user_token', res.data.Authorization);
          this.$router.push('/home');
        }
      });
    },

    /**
     * 获取验证码
     */
    async getCaptcha() {
      const { data: res } = await this.$http.get('captcha');
      // 刷新验证码
      this.$refs.code.setAttribute('src', res.data.base64);
      // 保存验证码md5
      window.sessionStorage.setItem('md5', res.data.md5);
      // 清空验证码输入框
      this.loginForm.code = '';
      // 聚焦
      this.$refs.codeInput.focus();
    },

    /**
     * 刷新后判断是否需要输入验证码,需要则弹出验证码输入框
     */
    isCheckCaptcha() {
      const chaptcha = window.sessionStorage.getItem('md5');
      if (chaptcha) {
        this.getCaptcha();
        this.captchaShow = true;
      }
    },

    /**
     * 第三方登录
     */
    oauthLogin(type) {
      switch (type) {
        case 'weixin':
          window.open(this.bindLogin.weixin);
          break;
        case 'qq':
          window.open(this.bindLogin.qq);
          break;
        case 'weibo':
          window.open(this.bindLogin.weibo);
          break;
        case 'gitee':
          window.open(this.bindLogin.gitee);
          break;
        case 'github':
          window.open(this.bindLogin.github);
          break;
        default:
          this.$message.error('请求错误！');
      }
      // 通过监听，父页面可以拿到子页面传递的token
      window.addEventListener(
        'message',
        function(e) {
          if (e.data !== '' && e.data.constructor !== Object) {
            const token = window.sessionStorage.getItem('user_token', e.data);
            if (token === '' || token === undefined || token === null) {
              window.sessionStorage.setItem('user_token', e.data);
            }
            window.location.reload();
          }
        },
        false
      );
    },

    /**
     * 快捷登录开关获取
     */
    async getSwitch() {
      const { data: res } = await this.$http.get('getswitch');
      if (res.code !== 200) return this.$message.error(res.msg);
      this.switchForm = res.data;
    },

    /**
     * 记住密码存储表单信息
     */
    setUserInfo() {
      // 判断用户是否勾选记住密码，如果勾选，向cookie中储存登录信息
      if (this.remember) {
        setCookie('user', this.loginForm.user);
        // base64加密密码
        const password = Base64.encode(this.loginForm.password);
        setCookie('password', password);
      } else {
        // 没有勾选记住密码则设置为空
        setCookie('user', '');
        setCookie('password', '');
      }
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
.register-password {
  display: flex;
  justify-content: space-between;
}
.password {
  text-align: center;
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
.footer {
  position: fixed;
  text-align: center;
  bottom: 5px;
  left: 0;
  right: 0;
  color: #fff;
}
</style>
