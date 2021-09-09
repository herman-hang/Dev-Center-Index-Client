<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>账号管理</el-breadcrumb-item>
      <el-breadcrumb-item>我的资料</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <div slot="header" class="clearfix"><strong>我的资料</strong></div>
      <!-- 主体信息 -->
      <el-form :model="materialForm" :rules="materialFormRules" ref="materialFormRef" label-width="100px">
        <el-form-item label="用户名" prop="user">
          <span>{{ materialForm.user }}</span>
        </el-form-item>
        <el-form-item label="头像" prop="photo">
          <!-- 头像上传 -->
          <el-upload
            accept=".jpg,.jpeg,.png,.bmp"
            class="avatar-uploader"
            :action="updateUrl"
            :headers="headers"
            :show-file-list="false"
            :on-success="handleAvatarSuccessAddPhoto"
            :before-upload="beforeAvatarUpload"
            name="image"
          >
            <img v-if="materialForm.photo" :src="materialForm.photo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname"><el-input placeholder="请输入昵称" v-model="materialForm.nickname"></el-input></el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="materialForm.sex" placeholder="请选择性别">
            <el-option label="女" value="0"></el-option>
            <el-option label="男" value="1"></el-option>
            <el-option label="保密" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age"><el-input placeholder="请输入年龄" v-model.number="materialForm.age"></el-input></el-form-item>
        <el-form-item label="地区" prop="region"><el-input placeholder="请输入地区" v-model="materialForm.region"></el-input></el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <span>{{ materialForm.mobile }}</span>
          <span class="bind">
            <a @click="mobile('1')" href="javascript:;" v-if="materialForm.mobile == ''">立即绑定</a>
            <a @click="mobile('2')" href="javascript:;" v-else>解除绑定</a>
          </span>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <span>{{ materialForm.email }}</span>
          <span class="bind">
            <a @click="email('1')" href="javascript:;" v-if="materialForm.email == ''">立即绑定</a>
            <a @click="email('2')" href="javascript:;" v-else>解除绑定</a>
          </span>
        </el-form-item>
        <el-form-item label="QQ号码" prop="qq"><el-input placeholder="请输入QQ号码" v-model="materialForm.qq"></el-input></el-form-item>
        <el-form-item label="简介" prop="introduction"><el-input type="textarea" placeholder="请输入简介" v-model="materialForm.introduction"></el-input></el-form-item>
        <el-form-item><el-button type="primary" icon="el-icon-edit" @click="materialEdit">提交</el-button></el-form-item>
      </el-form>

      <!-- 绑定/解除手机号码 -->
      <el-dialog :title="bindMobileForm.title" :visible.sync="bindMobileDialogVisible" width="30%" @close="mobileFormClose">
        <el-form :model="bindMobileForm" :rules="bindMobileFormRules" ref="mobileFormRef" label-width="100px">
          <el-form-item label="手机号码" prop="mobile"><el-input placeholder="请输入手机号码" v-model="bindMobileForm.mobile"></el-input></el-form-item>
          <el-form-item label="验证码" prop="code">
            <div class="captcha-code">
              <el-input placeholder="请输入验证码" v-model="bindMobileForm.code" prefix-icon="el-icon-key" ref="codeInput" class="code"></el-input>
              <el-button class="send-code" plain @click="sendCode('1')">
                <span v-show="sendCodeBtn">发送验证码</span>
                <span v-show="!sendCodeBtn">{{ second }} s</span>
              </el-button>
            </div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="bindMobileDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitMobile">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 绑定/解除邮箱 -->
      <el-dialog :title="bindEmailForm.title" :visible.sync="bindEmailDialogVisible" width="30%" @close="emailFormClose">
        <el-form :model="bindEmailForm" :rules="bindEmailFormRules" ref="emailFormRef" label-width="100px">
          <el-form-item label="邮箱" prop="email"><el-input placeholder="请输入邮箱" v-model="bindEmailForm.email"></el-input></el-form-item>
          <el-form-item label="验证码" prop="code">
            <div class="captcha-code">
              <el-input placeholder="请输入验证码" v-model="bindEmailForm.code" prefix-icon="el-icon-key" ref="codeInput" class="code"></el-input>
              <el-button class="send-code" plain @click="sendCode('2')">
                <span v-show="sendCodeBtn">发送验证码</span>
                <span v-show="!sendCodeBtn">{{ second }} s</span>
              </el-button>
            </div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="bindEmailDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEmail">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { validatePhone, validEmail } from '../../utils/validate.js';
export default {
  data() {
    return {
      // 表单数据绑定
      materialForm: {},
      // 表单验证规则
      materialFormRules: {
        sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        age: [{ type: 'number', min: 0, max: 120, message: '年龄只能是0到120岁之间', trigger: 'blur' }],
        qq: [{ min: 5, max: 11, message: 'QQ号码只能是5到11位之间', trigger: 'blur' }]
      },
      // 上传图片URL
      updateUrl: window.serverConfig.BASE_API + 'base/upload',
      // 图片上传请求头
      headers: {
        Authorization: window.sessionStorage.getItem('user_token')
      },
      // 初始化绑定/解除手机对话框
      bindMobileDialogVisible: false,
      // 初始化绑定/解除邮箱对话框
      bindEmailDialogVisible: false,
      // 绑定/解除表单数据绑定
      bindMobileForm: {
        title: '',
        mobile: '',
        code: '',
        type: ''
      },
      // 绑定/解除邮箱表单数据绑定
      bindEmailForm: {
        title: '',
        mobile: '',
        code: '',
        type: ''
      },
      // 绑定/解除手机表单验证规则
      bindMobileFormRules: {
        mobile: [{ required: true, message: '请输入手机号码', trigger: 'blur' }, { validator: validatePhone, trigger: 'blur' }],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      // 绑定/解除邮箱表单验证规则
      bindEmailFormRules: {
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: validEmail, trigger: 'blur' }],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      // 发送验证码按钮初始化
      sendCodeBtn: true,
      // 初始化60秒
      second: 60,
      // 定时器
      timer: null
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
      this.materialForm = res.data;
    },

    /**
     * 资料编辑
     */
    materialEdit() {
      this.$refs.materialFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put('Account/materialEdit', this.materialForm);
        if (res.code !== 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        this.material();
      });
    },

    /**
     * 绑定/解除手机对话框
     * @param {Object} type 1为立即绑定 2为解除绑定
     */
    mobile(type) {
      if (type === '1') {
        this.bindMobileForm.title = '绑定手机号码';
        this.bindMobileForm.type = '1';
      } else if (type === '2') {
        this.bindMobileForm.title = '解除手机号码';
        this.bindMobileForm.type = '0';
      }
      this.bindMobileDialogVisible = true;
    },

    /**
     * 绑定/解除邮箱对话框
     * @param {Object} type 1为立即绑定 2为解除绑定
     */
    email(type) {
      if (type === '1') {
        this.bindEmailForm.title = '绑定邮箱';
        this.bindEmailForm.type = '1';
      } else if (type === '2') {
        this.bindEmailForm.title = '解除邮箱';
        this.bindEmailForm.type = '0';
      }
      this.bindEmailDialogVisible = true;
    },

    /**
     * 发送验证码
     */
    async sendCode(type) {
      if (type === '1') {
        // 发送手机验证码
        if (this.bindMobileForm.mobile === '') {
          return this.$message.error('手机号码不能为空！');
        }
        const { data: res } = await this.$http.post('Account/bindMobileSendCode', this.bindMobileForm);
        if (res.code !== 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
      } else if (type === '2') {
        // 发送邮箱验证码
        if (this.bindEmailForm.email === '') {
          return this.$message.error('邮箱不能为空！');
        }
        const { data: res } = await this.$http.post('Account/bindEmailSendCode', this.bindEmailForm);
        if (res.code !== 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
      }
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
    },

    /**
     * 手机提交请求
     */
    submitMobile() {
      this.$refs.mobileFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post('Account/bindMobile', this.bindMobileForm);
        if (res.code !== 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        this.bindMobileDialogVisible = false;
        this.material();
      });
    },

    /**
     * 邮箱提交请求
     */
    submitEmail() {
      this.$refs.emailFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post('Account/bindEmail', this.bindEmailForm);
        if (res.code !== 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        this.bindEmailDialogVisible = false;
        this.material();
      });
    },

    /**
     * 绑定/解除手机对话框关闭
     */
    mobileFormClose() {
      // 重置所有表单项
      this.$refs.mobileFormRef.resetFields();
    },

    /**
     * 绑定/解除邮箱对话框关闭
     */
    emailFormClose() {
      // 重置所有表单项
      this.$refs.emailFormRef.resetFields();
    },

    /**
     * 头像上传成功时的钩子
     * @param {Object} res 返回数据
     * @param {Object} file 文件对象
     */
    handleAvatarSuccessAddPhoto(res, file) {
      if (res.code !== 200) return this.$message.error(res.msg);
      this.materialForm.photo = res.data[0];
      this.$message.success(res.msg);
    },

    /**
     * 上传头像之前的钩子
     * @param {Object} file 上传的文件
     */
    beforeAvatarUpload(file) {
      const isImage = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp';
      // 上传的图片最大不能超过10M
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isImage) {
        this.$message.error('上传的图片只能是 JPG JPEG PNG BMP格式!');
        return false;
      }
      if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 10MB!');
        return false;
      }
      return isImage && isLt10M;
    }
  }
};
</script>

<style lang="less" scoped>
.bind {
  margin-left: 5px;
  a {
    color: #409eff;
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
</style>
