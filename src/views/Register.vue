<template>
  <div class="container">
    <div class="card">
      <div class="login-top">新用户注册</div>
      <!-- 表单区域 -->
      <el-form ref="registerFormRef" :model="registerForm" :rules="registerFormRules" label-width="0px" class="form">
        <!-- 用户名 -->
        <el-form-item prop="user"><el-input placeholder="请输入用户名" v-model="registerForm.user" prefix-icon="el-icon-user-solid"></el-input></el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password"><el-input placeholder="请输入密码" v-model="registerForm.password" prefix-icon="el-icon-lock" type="password"></el-input></el-form-item>
        <!-- 确认密码 -->
        <el-form-item prop="passwords"><el-input placeholder="请输入确认密码" v-model="registerForm.passwords" prefix-icon="el-icon-lock" type="password"></el-input></el-form-item>
        <!-- 验证码 -->
        <el-form-item prop="code">
          <div class="captcha-code">
            <el-input placeholder="验证码" v-model="registerForm.code" prefix-icon="el-icon-key" ref="codeInput" class="code"></el-input>
            <img src="/" ref="code" alt="验证码" width="30%" @click="getCaptcha" />
          </div>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="accepted">我已仔细阅读并同意接受</el-checkbox>
          <a class="serve" href="javascript:;" @click="acceptedDialogVisible = true">《使用条款》</a>
          <div class="btn"><el-button type="primary" @click="register()">注册</el-button></div>
          <div class="btn">
            <router-link to="/login"><a href="javascript:;">返回登录</a></router-link>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <!-- 服务条款 -->
    <el-dialog
      title="服务条款"
      :visible.sync="acceptedDialogVisible"
      width="50%"
      center
      :modal="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <section class="terms">
        <h2>开发者中心用户服务条款</h2>

        <p>欢迎您来到开发者中心（以下简称“本网站”）。</p>
        <p>本网站由木鱼开发团队（以下简称“木鱼”）运行维护。</p>
        <p>
          请您仔细阅读以下条款，如果您对本协议的任何条款表示异议，您可以选择不进入开发者中心。当您注册成功，无论是进入开发者中心，还是在开发者中心上发布任何内容（即「内容」），均意味着您（即「用户」）完全接受本协议项下的全部条款。
        </p>

        <h4>使用规则</h4>
        <p>
          1、用户注册成功后，本网站将给予每个用户一个用户帐号及相应的密码，该用户帐号和密码由用户负责保管，用户不应将账号或密码告知第三方，或者将其帐号、密码转让、出借予他人使用或与第三方共用。如用户发现其帐号遭他人非法使用，应立即通知本网站，因黑客行为或用户的保管疏忽等非本网站原因导致帐号、密码遭他人非法使用或无法正常使用的，本网站不承担任何责任；用户应当对以其用户帐号进行的所有活动和事件负法律责任。
        </p>
        <p>
          2、用户应提供及时、详尽及准确的个人资料，并不断更新注册资料，用户须对在本网站的注册信息的真实性、合法性、有效性承担全部责任，用户不得冒充他人；不得利用他人的名义发布任何信息；不得恶意使用注册帐号导致其他用户误认；否则开发者中心有权立即停止提供服务，收回其帐号并由用户独自承担由此而产生的一切法律责任。
        </p>
        <p>
          3、用户直接或通过各类方式（如RSS源和站外API引用等）间接使用本网站服务和数据的行为，都将被视作已无条件接受本协议全部内容；若用户对本协议的任何条款存在异议，请停止使用开发者中心所提供的全部服务。
        </p>
        <p>
          4、本网站是一个信息分享、传播及获取的平台，用户通过开发者中心发表的信息为公开的信息，其他第三方均可以通过本网站获取用户发表的信息，用户对任何信息的发表即认可该信息为公开的信息，并单独对此行为承担法律责任；任何用户不愿被其他第三人获知的信息都不应该在本网站上进行发表。
        </p>
        <p>5、用户承诺不得以任何方式利用本网站直接或间接从事违反中国法律以及社会公德的行为，本网站有权对违反上述承诺的内容予以删除。</p>
        <p>6、用户不得利用开发者中心服务制作、上载、复制、发布、传播或者转载如下内容：</p>
        <ul>
          <li>反对宪法所确定的基本原则的；</li>
          <li>危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</li>
          <li>损害国家荣誉和利益的；</li>
          <li>煽动民族仇恨、民族歧视，破坏民族团结的；</li>
          <li>破坏国家宗教政策，宣扬邪教和封建迷信的；</li>
          <li>散布谣言，扰乱社会秩序，破坏社会稳定的；</li>
          <li>散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</li>
          <li>侮辱或者诽谤他人，侵害他人合法权益的；</li>
          <li>含有法律、行政法规禁止的其他内容的信息。</li>
        </ul>
        <p>
          7、本网站有权对用户使用本网站的情况进行审查和监督，如用户在使用本网站时违反任何上述规定，本网站或其授权的人有权要求用户改正或直接采取一切必要的措施（包括但不限于更改或删除用户张贴的内容、暂停或终止用户使用本网站的权利），因此产生的全部责任及损失由用户承担。
        </p>

        <h4>知识产权</h4>
        <p>
          本网站是一个信息获取、分享及传播的平台，我们尊重和鼓励本网站用户创作的内容，认识到保护知识产权对开发者中心生存与发展的重要性，承诺将保护知识产权作为本网站运营的基本原则之一。
        </p>
        <p>1、用户在本网站发表的全部原创内容（包括但不仅限于回答、文章和评论），著作权均归用户本人所有。用户可授权第三方以任何方式使用，不需要得到开发者中心的同意。</p>
        <p>
          2、本网站提供的网络服务中包含的标识、版面设计、排版方式、文本、图片、图形等均受著作权法、商标法及其它法律保护，未经相关权利人（含本网站及其他原始权利人）同意，上述内容均不得在任何平台被直接或间接发布、使用、出于发布或使用目的的改写或再发行，或以其他任何法律允许外的方式使用。
        </p>
        <p>
          3、为了促进知识的分享和传播，用户将其在本网站发表的全部内容，授予本网站免费的、不可撤销的、非独家、永久的、全球范围内的使用许可，本网站有权将该内容用于本网站各种形态的产品和服务上，包括但不限于网站以及发表的应用或其他互联网产品。
        </p>
        <p>
          4、除原作者另有说明或法律规定不得转载的情况外，若出于非商业目的，将用户在本网站发表的内容转载在本网站之外的地方，应当在作品的正文开头的显著位置注明原作者姓名（或原作者在本网站使用的帐号名称），给出原始链接，注明「发表于开发者中心」，并不得对作品进行修改演绎。若需要对作品进行修改，或用于商业目的，应当联系用户获得单独授权，按照用户规定的方式使用该内容。
        </p>
        <p>
          5、在本网站上传或发表的内容，用户应保证其为相关权利所有人或已取得合法授权，并且该内容不会侵犯任何第三方的合法权益。如果第三方提出关于著作权等合法权益的异议，本网站有权删除相关内容，且有权追究用户的法律责任。给本网站或任何第三方造成损失的，用户应负责全额赔偿。
        </p>
        <p>
          6、如果任何第三方侵犯了本网站用户相关的权利，用户同意授权开发者中心或其指定的代理人代表开发者中心自身或用户对该第三方提出警告、投诉、发起行政执法、诉讼、进行上诉，或谈判和解，并且用户同意在开发者中心认为必要的情况下参与共同维权。
        </p>
        <p>7、本网站有权但无义务对用户发布的内容进行审核，有权根据相关证据结合《侵权责任法》、《信息网络传播权保护条例》等法律法规及本网站社区指导原则对侵权信息进行处理。</p>

        <h4>个人信息</h4>
        <p>1、用户同意本网站出于以下目的，收集和使用用户的个人信息：</p>
        <ul>
          <li>（1）在用户注册开发者中心账号时，本网站会收集用户的昵称、性别和手机号码；</li>
          <li>（2）本网站会收集用户在完善个人资料时填写的出生日期、居住地区、邮箱、QQ联系、工作职位等个人信息；</li>
          <li>（3）在用户使用开发者中心时，本网站会收集用户的浏览器/移动设备类型、浏览器/移动设备语言、用户IP地址等信息；</li>
          <li>（4）若用户使用开发者中心的“求职/招聘”服务，本网站会收集用户填写的简历信息（包括年龄、性别、手机号、邮箱、项目经历、工作经历、教育经历）；</li>
          <li>（5）若用户使用第三方帐号（微信、QQ、GitHub、Stack Overflow、LinkedIn）登录，本网站会读取并获得用户在该第三方平台上登记、公布、记录的公开信息（包括昵称、头像）；</li>
          <li>（6）开展内部审计、数据分析和研究，改善开发者中心的产品或服务。</li>
        </ul>
        <p>2、开发者中心尊重并保护访问本网站的任何个人的个人信息。对于您提供的非公开的个人信息，本网站不会将其提供给第三方，但下述情况除外：</p>
        <ul>
          <li>（1）事先获得您的明确授权；</li>
          <li>（2）为使用开发者中心的服务所必须的（包括但不限于使用“求职/招聘”服务时本网站向用人单位提供您的简历信息）；</li>
          <li>（3）司法机关、行政机关或其他有关部门要求披露的；</li>
          <li>（4）为维护本网站及木鱼的合法权益、社会公众利益需要披露的；</li>
          <li>（5）本网站与第三方合作向用户提供相关网络服务需要向第三方披露的；</li>
          <li>（6）依照法律法规要求披露的。</li>
        </ul>
        <p>3、以下情形造成的任何个人信息的泄露、丢失、被盗用、被篡改等，本网站及木鱼不承担任何责任：</p>
        <ul>
          <li>（1）由黑客攻击、计算机病毒侵入或发作、政府管制等本网站及奥斯网络不能控制的原因或不可抗力而造成的暂时性关闭等影响网站正常运营的事件所造成的；</li>
          <li>（2）用户将个人密码、账号告知他人或与他人共享注册帐号所造成的；</li>
          <li>（3）与本网站链接的任何其它网站造成的。</li>
        </ul>

        <h4>侵权处理</h4>
        <p>
          用户在开发者中心发表的内容仅表明其个人的立场和观点，并不代表本网站的立场或观点。如果个人或企业发现本网站存在侵犯自身合法权益的内容，可以先尝试与作者取得联系，通过沟通协商解决问题。如您无法联系到作者，或无法通过与作者沟通解决问题，您可通过向开发者中心平台进行投诉。本网站有权直接采取包括但不限于更改或删除用户张贴的内容、暂停或终止用户使用本网站的权利等一切措施，因此产生的全部责任及损失由用户承担。
        </p>
        <p>
          不论本侵权举报内容是否完全属实，用户将承担由此产生的一切法律责任，并承担和赔偿本网站因根据投诉人的通知书对相关帐号的处理而造成的任何损失，包括但不限于本网站因向被投诉方赔偿而产生的损失及开发者中心名誉、商誉损害等。
        </p>

        <h4>免责申明</h4>
        <p>1、开发者中心不能对用户发表的回答或评论的正确性进行保证。</p>
        <p>
          2、用户在本网站发表的内容仅表明其个人的立场和观点，并不代表本网站的立场或观点。作为内容的发表者，需自行对所发表内容负责，因所发表内容引发的一切纠纷，由该内容的发表者承担全部法律及连带责任。本网站不承担任何法律及连带责任。
        </p>
        <p>3、开发者中心不保证网络服务一定能满足用户的要求，也不保证网络服务不会中断，对网络服务的及时性、安全性、准确性也都不作保证。</p>
        <p>4、对于因不可抗力或开发者中心不能控制的原因造成的网络服务中断或其它缺陷，开发者中心不承担任何责任，但将尽力减少因此而给用户造成的损失和影响。</p>

        <h4>协议修改</h4>
        <p>
          1、根据互联网的发展和有关法律、法规及规范性文件的变化，或者因业务发展需要，本网站有权对本协议的条款作出修改或变更，一旦本协议的内容发生变动，本网站将公布修改之后的协议内容，该公布行为视为开发者中心已经通知用户修改内容。开发者中心也可采用电子邮件或私信的传送方式，提示用户协议条款的修改、服务变更、或其它重要事项。
        </p>
        <p>2、如果不同意开发者中心对本协议相关条款所做的修改，用户有权并应当停止使用本网站。如果用户继续使用本网站，则视为用户接受本网站对本协议相关条款所做的修改。</p>
      </section>
      <span slot="footer" class="dialog-footer"><el-button type="primary" @click="acceptedDialogVisible = false">已阅读</el-button></span>
    </el-dialog>
    <div class="footer">
      <span>Copyright ©2021 {{ title }} v{{ version }} All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义验证规则
    var validatePasswords = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致！'));
      } else {
        callback();
      }
    };
    return {
      // 网站名称
      title: window.serverConfig.APP_NAME,
      // 系统版本
      version: window.serverConfig.APP_VERSION,
      // 表单数据绑定对象
      registerForm: {
        user: '',
        password: '',
        passwords: '',
        code: ''
      },
      // 表单验证规则
      registerFormRules: {
        user: [{ required: true, message: '请输入用户名', trigger: 'blur' }, { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }],
        passwords: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' },
          { validator: validatePasswords, trigger: 'blur' }
        ],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      // 服务条款初始化
      accepted: false,
      // 服务条款对话框初始化
      acceptedDialogVisible: false
    };
  },
  created() {
    // 验证码
    this.getCaptcha();
  },
  methods: {
    /**
     * 注册操作
     */
    register() {
      if (this.accepted === false) {
        return this.$message.warning('请选择服务条款！');
      }
      // 前端预验证验证码
      const md5 = window.sessionStorage.getItem('reg_md5');
      if (md5) {
        if (this.$md5(this.registerForm.code) !== md5) {
          // 聚焦
          this.$refs.codeInput.focus();
          return this.$message.error('验证码错误！');
        }
      }
      this.$refs.registerFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post('register', this.registerForm);
        if (res.code !== 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        this.$router.push('/login');
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
      window.sessionStorage.setItem('reg_md5', res.data.md5);
      // 清空验证码输入框
      this.registerForm.code = '';
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
.login-top {
  font-size: 36px;
  text-align: center;
  margin-top: 50px;
}
.form {
  position: absolute;
  top: 30%;
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
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
.captcha-code {
  display: flex;
  img {
    margin-left: 10px;
  }
}
.code {
  width: 50%;
}
.footer {
  position: fixed;
  text-align: center;
  bottom: 5px;
  left: 0;
  right: 0;
  color: #fff;
}
.serve {
  color: #409eff;
}
.terms {
  width: 90%;
  margin: 0 auto;
  padding: 10px 0;
  height: 500px;
  overflow: auto;
}
</style>
