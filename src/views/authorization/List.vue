<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>授权中心</el-breadcrumb-item>
      <el-breadcrumb-item>我的授权</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <div slot="header" class="clearfix">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input placeholder="请输入搜索内容" v-model="queryInfo.keywords" clearable @clear="authorization">
              <el-button slot="append" icon="el-icon-search" @click="authorization"></el-button>
            </el-input>
          </el-col>
        </el-row>
      </div>
      <!-- 添加删除按钮组 -->
      <el-row><el-button type="primary" icon="el-icon-plus" @click="addDialog" size="mini">添加</el-button></el-row>
      <!-- 列表表格 -->
      <el-table :data="authorizationListData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="授权站名称"></el-table-column>
        <el-table-column prop="ip" label="授权IP地址" width="180"></el-table-column>
        <el-table-column prop="domain_one" label="授权域名1"></el-table-column>
        <el-table-column prop="auth_temp" label="授权插件(单位:个)"></el-table-column>
        <el-table-column prop="auth_plug" label="授权模板(单位:个)"></el-table-column>
        <el-table-column prop="level" label="授权服务">
          <template slot-scope="scope">
            <span v-if="scope.row.level === '0'">铁牌</span>
            <el-tag type="success" v-if="scope.row.level === '1'">铜牌</el-tag>
            <el-tag type="info" v-else-if="scope.row.level === '2'">银牌</el-tag>
            <el-tag type="warning" v-else-if="scope.row.level === '3'">金牌</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="授权时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | date }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status === '1'">正常</el-tag>
            <el-tag type="danger" v-else>封禁</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip :enterable="false" effect="dark" content="服务升级" placement="top">
              <el-button type="success" icon="el-icon-upload2" size="mini" @click="upgradeDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" effect="dark" content="编辑" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialog(scope.row.id)"></el-button>
            </el-tooltip>
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

      <!-- 添加对话框 -->
      <el-dialog title="添加授权站" :visible.sync="addDialogVisible" width="50%" @close="addFormClose">
        <!-- 主体信息 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item label="授权站名称" prop="name"><el-input placeholder="请输入授权站名称" v-model="addForm.name"></el-input></el-form-item>
          <el-form-item label="授权IP地址" prop="ip"><el-input placeholder="请输入授权IP地址" v-model="addForm.ip"></el-input></el-form-item>
          <el-form-item label="授权域名1" prop="domain_one"><el-input placeholder="请输入授权域名1" v-model="addForm.domain_one"></el-input></el-form-item>
          <el-form-item label="授权域名2" prop="domain_two"><el-input placeholder="请输入授权域名2" v-model="addForm.domain_two"></el-input></el-form-item>
          <el-form-item label="授权域名3" prop="domain_tree"><el-input placeholder="请输入授权域名3" v-model="addForm.domain_tree"></el-input></el-form-item>
          <el-form-item label="授权服务" prop="level">
            <el-radio-group v-model="addForm.level">
              <el-radio :label="0">铁牌</el-radio>
              <el-radio :label="1">铜牌</el-radio>
              <el-radio :label="2">银牌</el-radio>
              <el-radio :label="3">金牌</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="服务价格:">
            <span v-if="addForm.level === 0" class="free">免费</span>
            <span v-else-if="addForm.level === 1" class="money">￥{{ authConfigForm.copper }}</span>
            <span v-else-if="addForm.level === 2" class="money">￥{{ authConfigForm.silver }}</span>
            <span v-else-if="addForm.level === 3" class="money">￥{{ authConfigForm.gold }}</span>
          </el-form-item>
          <el-form-item label="支付方式:" v-if="addForm.level !== 0">
            <el-radio-group v-model="addForm.pay_type">
              <el-radio label="wxpay" size="medium">
                <img class="pay" width="20" src="../../assets/image/wxpay.png" alt="微信支付" />
                微信
              </el-radio>
              <el-radio label="qqpay" size="medium">
                <img class="pay" width="20" src="../../assets/image/qqpay.png" alt="QQ支付" />
                QQ
              </el-radio>
              <el-radio label="alipay" size="medium">
                <img class="pay" width="20" src="../../assets/image/alipay.png" alt="支付宝支付" />
                支付宝
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="服务内容:" v-if="addForm.level !== 0">
            <el-card class="box-card" v-if="addForm.level === 1">
              <div class="text item">{{ authConfigForm.copper_server_content }}</div>
            </el-card>
            <el-card class="box-card" v-else-if="addForm.level === 2">
              <div class="text item">{{ authConfigForm.silver_server_content }}</div>
            </el-card>
            <el-card class="box-card" v-else-if="addForm.level === 3">
              <div class="text item">{{ authConfigForm.gold_server_content }}</div>
            </el-card>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAdd" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑对话框 -->
      <el-dialog title="编辑授权站" :visible.sync="editDialogVisible" width="50%" @close="editFormClose">
        <!-- 主体信息 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
          <el-form-item label="授权站名称" prop="name"><el-input placeholder="请输入授权站名称" v-model="editForm.name"></el-input></el-form-item>
          <el-form-item label="授权IP地址" prop="ip"><el-input placeholder="请输入授权IP地址" v-model="editForm.ip"></el-input></el-form-item>
          <el-form-item label="授权域名1" prop="domain_one"><el-input placeholder="请输入授权域名1" v-model="editForm.domain_one"></el-input></el-form-item>
          <el-form-item label="授权域名2" prop="domain_two"><el-input placeholder="请输入授权域名2" v-model="editForm.domain_two"></el-input></el-form-item>
          <el-form-item label="授权域名3" prop="domain_tree"><el-input placeholder="请输入授权域名3" v-model="editForm.domain_tree"></el-input></el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEdit">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 服务升级对话框 -->
      <el-dialog title="升级授权站" :visible.sync="upgradeDialogVisible" width="50%" @close="upgradeFormClose">
        <!-- 主体信息 -->
        <el-form :model="upgradeForm" :rules="upgradeFormRules" ref="upgradeFormRef" label-width="100px">
          <el-form-item label="授权站名称:" prop="name">
            <span>{{ upgradeForm.name }}</span>
          </el-form-item>
          <el-form-item label="当前服务:" prop="level">
            <span v-if="upgradeForm.level === '0'">铁牌</span>
            <span v-else-if="upgradeForm.level === '1'">铜牌</span>
            <span v-else-if="upgradeForm.level === '2'">银牌</span>
            <span v-else-if="upgradeForm.level === '3'">金牌</span>
          </el-form-item>
          <el-form-item label="升级服务:" prop="upgrade_level">
            <el-radio-group v-model="upgradeForm.upgrade_level" v-if="upgradeForm.level === '0'" @change="isShow">
              <el-radio :label="1">铜牌</el-radio>
              <el-radio :label="2">银牌</el-radio>
              <el-radio :label="3">金牌</el-radio>
            </el-radio-group>
            <el-radio-group v-model="upgradeForm.upgrade_level" v-else-if="upgradeForm.level === '1'" @change="isShow">
              <el-radio :label="2">银牌</el-radio>
              <el-radio :label="3">金牌</el-radio>
            </el-radio-group>
            <el-radio-group v-model="upgradeForm.upgrade_level" v-else-if="upgradeForm.level === '2'" @change="isShow"><el-radio :label="3">金牌</el-radio></el-radio-group>
            <span v-else-if="upgradeForm.level === '3'">您目前是最高服务待遇了哦！</span>
          </el-form-item>
          <el-form-item label="服务价格:" v-show="upgradeIsshow">
            <div v-if="upgradeForm.level === '0'">
              <span v-if="upgradeForm.upgrade_level === 1" class="money">￥{{ authConfigForm.iron_copper }}</span>
              <span v-else-if="upgradeForm.upgrade_level === 2" class="money">￥{{ authConfigForm.iron_silver }}</span>
              <span v-else-if="upgradeForm.upgrade_level === 3" class="money">￥{{ authConfigForm.iron_gold }}</span>
            </div>
            <div v-else-if="upgradeForm.level === '1'">
              <span v-if="upgradeForm.upgrade_level === 2" class="money">￥{{ authConfigForm.copper_silver }}</span>
              <span v-else-if="upgradeForm.upgrade_level === 3" class="money">￥{{ authConfigForm.copper_gold }}</span>
            </div>
            <div v-else-if="upgradeForm.level === '2'">
              <span v-if="upgradeForm.upgrade_level === 3" class="money">￥{{ authConfigForm.silver_gold }}</span>
            </div>
          </el-form-item>
          <el-form-item label="支付方式:" prop="pay_type" v-if="upgradeForm.level !== '3'">
            <el-radio-group v-model="upgradeForm.pay_type">
              <el-radio label="wxpay" size="medium">
                <img class="pay" width="20" src="../../assets/image/wxpay.png" alt="微信支付" />
                微信
              </el-radio>
              <el-radio label="qqpay" size="medium">
                <img class="pay" width="20" src="../../assets/image/qqpay.png" alt="QQ支付" />
                QQ
              </el-radio>
              <el-radio label="alipay" size="medium">
                <img class="pay" width="20" src="../../assets/image/alipay.png" alt="支付宝支付" />
                支付宝
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="服务内容:" v-show="upgradeIsshow">
            <el-card class="box-card" v-if="upgradeForm.upgrade_level === 1">
              <div class="text item">{{ authConfigForm.copper_server_content }}</div>
            </el-card>
            <el-card class="box-card" v-else-if="upgradeForm.upgrade_level === 2">
              <div class="text item">{{ authConfigForm.silver_server_content }}</div>
            </el-card>
            <el-card class="box-card" v-else-if="upgradeForm.upgrade_level === 3">
              <div class="text item">{{ authConfigForm.gold_server_content }}</div>
            </el-card>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="upgradeDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitUpgrade" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { validateIP } from '../../utils/validate.js';
export default {
  data() {
    return {
      //查询的参数
      queryInfo: {
        //搜索关键字
        keywords: '',
        //当前页码
        current_page: 1,
        //每页显示多少条数据
        per_page: 25,
        // 总页数
        total: 0
      },
      // 列表表格数据绑定
      authorizationListData: [],
      // 添加授权表单数据绑定
      addForm: {
        name: '',
        ip: '',
        domain_one: '',
        domain_two: '',
        domain_tree: '',
        level: 0,
        pay_type: ''
      },
      // 编辑对话框数据表单绑定
      editForm: {},
      // 添加表单验证规则
      addFormRules: {
        name: [{ required: true, message: '请输入授权站名称', trigger: 'blur' }],
        ip: [{ required: true, message: '请输入授权IP地址', trigger: 'blur' }, { validator: validateIP, trigger: 'blur' }],
        domain_one: [{ required: true, message: '请输入授权域名1', trigger: 'blur' }],
        user_id: [{ required: true, message: '请输入用户ID', trigger: 'blur' }],
        level: [{ required: true, message: '请选择选择授权服务', trigger: 'change' }]
      },
      // 编辑表单验证规则
      editFormRules: {
        name: [{ required: true, message: '请输入授权站名称', trigger: 'blur' }],
        ip: [{ required: true, message: '请输入授权IP地址', trigger: 'blur' }, { validator: validateIP, trigger: 'blur' }],
        domain_one: [{ required: true, message: '请输入授权域名1', trigger: 'blur' }]
      },
      // 添加对话框初始化
      addDialogVisible: false,
      // 编辑对话框初始化
      editDialogVisible: false,
      // 授权的配置信息表单
      authConfigForm: {},
      // 加载图标初始化
      fullscreenLoading: false,
      // 服务升级对话框初始化
      upgradeDialogVisible: false,
      // 服务升级表单数据绑定
      upgradeForm: {
        upgrade_level: ''
      },
      // 服务升级表单验证规则
      upgradeFormRules: {
        upgrade_level: [{ required: true, message: '请选择升级服务', trigger: 'blur' }],
        pay_type: [{ required: true, message: '请选择支付类型', trigger: 'blur' }]
      },
      // 控制服务升级对话框中的价格显示与隐藏
      upgradeIsshow: false
    };
  },
  created() {
    this.authorization();
    // 回车进行搜索
    var self = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key === 13) {
        self.authorization();
      }
    };
  },
  methods: {
    /**
     * 获取数据
     */
    async authorization() {
      const { data: res } = await this.$http.get('authorization/list', { params: this.queryInfo });
      if (res.code !== 200) return this.$message.error(res.msg);
      this.queryInfo.total = res.data.total;
      res.data.data.forEach(item => {
        // 统计授权的模板数量
        if (item.auth_temp !== null) {
          item.auth_temp = item.auth_temp.split(',').length;
        } else {
          item.auth_temp = 0;
        }
        // 统计授权的插件数量
        if (item.auth_plug !== null) {
          item.auth_plug = item.auth_plug.split(',').length;
        } else {
          item.auth_plug = 0;
        }
      });
      this.authorizationListData = res.data.data;
    },

    /**
     * 添加对话框绑定事件
     */
    async addDialog() {
      const { data: res } = await this.$http.get('Authorization/queryConfig');
      if (res.code !== 200) return this.$message.error(res.msg);
      this.authConfigForm = res.data;
      // 显示添加对话框
      this.addDialogVisible = true;
    },

    /**
     * 添加提交
     */
    submitAdd() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        // 显示加载图标
        this.fullscreenLoading = true;
        const { data: res } = await this.$http.post('authorization/add', this.addForm);
        this.goPay(res);
      });
    },

    /**
     * 跳转到支付页面并完成回调逻辑
     * @param {Object} res 服务器返回的数据
     */
    goPay(res) {
      if (res.code === 200) {
        // 易支付通道
        if (res.data.epay_url !== null && res.data.epay_url !== undefined && res.data.epay_url !== '') {
          window.open(res.data.epay_url);
          // 通过监听，父页面可以拿到子页面传递的token
          window.addEventListener('message', this.success, false);
          return;
        }
        // 支付宝官方通道
        if (res.data.alipay_url !== null && res.data.alipay_url !== undefined && res.data.alipay_url !== '') {
          window.open(res.data.alipay_url);
          // 通过监听，父页面可以拿到子页面传递的token
          window.addEventListener('message', this.success, false);
          return;
        }
        // 其他支付通道
        switch (res.data.pay_type) {
          case 'wxpay':
            this.$router.push({ name: 'wxpay', params: { data: res.data } });
            break;
          case 'qqpay':
            // 关闭加载图标
            this.fullscreenLoading = false;
            this.$router.push({ name: 'qqpay', params: { data: res.data } });
            break;
          case 'alipay': // 当面付通道
            // 关闭加载图标
            this.fullscreenLoading = false;
            this.$router.push({ name: 'alipay', params: { data: res.data } });
            break;
          default:
            return 0;
        }
      } else if (res.code === 201) {
        this.$message.success(res.msg);
        // 关闭添加对话框
        this.addDialogVisible = false;
        // 关闭加载图标
        this.fullscreenLoading = false;
        // 刷新列表
        return this.authorization();
      } else if (res.code === 403) {
        // 关闭加载图标
        this.fullscreenLoading = false;
        return this.$message.error(res.msg);
      }
    },

    /**
     * 服务升级提交
     */
    submitUpgrade() {
      this.$refs.upgradeFormRef.validate(async valid => {
        if (!valid) return;
        // 显示加载图标
        this.fullscreenLoading = true;
        // 发起请求
        const { data: res } = await this.$http.put('authorization/updateService', this.upgradeForm);
        this.goPay(res);
      });
    },

    /**
     * 服务升级对话框
     */
    async upgradeDialog(id) {
      const { data: res } = await this.$http.get(`authorization/query/${id}`);
      if (res.code !== 200) return this.$message.error(res.msg);
      this.upgradeForm = res.data;
      const { data: result } = await this.$http.get('Authorization/queryConfig');
      if (result.code !== 200) return this.$message.error(res.msg);
      this.authConfigForm = result.data;
      // 显示服务升级对话框
      this.upgradeDialogVisible = true;
    },

    /**
     * 支付成功回调
     * @param {Object} e 回调数据
     */
    success(e) {
      // 关闭加载图标
      this.fullscreenLoading = false;
      if (e.data.code === '201') {
        // 关闭添加对话框
        this.addDialogVisible = false;
        this.upgradeDialogVisible = false;
        // 刷新列表
        this.authorization();
        this.$message.success(e.data.msg);
      } else {
        this.$message.error(e.data.msg);
      }
    },

    /**
     * 编辑对话框绑定事件
     * @param {Object} id 授权站ID
     */
    async editDialog(id) {
      const { data: res } = await this.$http.get(`authorization/query/${id}`);
      if (res.code !== 200) return this.$message.error(res.msg);
      this.editForm = res.data;
      // 显示编辑对话框
      this.editDialogVisible = true;
    },

    /**
     * 编辑提交
     */
    submitEdit() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put('authorization/edit', this.editForm);
        if (res.code !== 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        // 关闭编辑对话框
        this.editDialogVisible = false;
        // 刷新列表
        this.authorization();
      });
    },

    /**
     * 每页显示多少条信息监听事件
     * @param {Object} val
     */
    handleSizeChange(val) {
      this.queryInfo.per_page = val;
      // 刷新列表
      this.authorization();
    },

    /**
     * 当前页监听事件
     * @param {Object} val
     */
    handleCurrentChange(val) {
      this.queryInfo.current_page = val;
      // 刷新列表
      this.authorization();
    },

    /**
     * 添加对话框关闭
     */
    addFormClose() {
      // 重置所有表单项
      this.$refs.addFormRef.resetFields();
      this.addForm.pay_type = '';
    },

    /**
     * 编辑对话框关闭
     */
    editFormClose() {
      // 重置所有表单项
      this.$refs.editFormRef.resetFields();
    },

    /**
     * 升级服务对话框关闭
     */
    upgradeFormClose() {
      // 重置所有表单项
      this.$refs.upgradeFormRef.resetFields();
      this.upgradeIsshow = false;
    },

    /**
     * 控制服务升级对话框中的价格显示与隐藏
     */
    isShow() {
      if (this.upgradeForm.upgrade_level !== '') {
        this.upgradeIsshow = true;
      } else {
        this.upgradeIsshow = false;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.money {
  font-weight: 600;
  color: red;
}
.free {
  color: limegreen;
}
.box-card {
  max-width: 450px;
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
.pay {
  margin-bottom: -5px;
}
</style>
