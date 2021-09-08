<template>
  <el-container class="container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <div class="title">
        <img :src="logo" alt="Logo" width="24px" />
        <a href="/" v-show="isName">{{ title }}</a>
      </div>
      <!-- 侧边菜单 -->
      <el-menu
        unique-opened
        :collapse="isCollapse"
        :collapse-transition="false"
        router
        background-color="#001529"
        text-color="#fff"
        active-text-color="#409EFF"
        :default-active="navUrl"
      >
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-key"></i>
            <span>授权中心</span>
          </template>
          <el-menu-item-group><el-menu-item index="/authorization/list" @click="subNavPath('/authorization/list')">我的授权</el-menu-item></el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-user"></i>
            <span>开发者中心</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/app/list" @click="subNavPath('/app/list')">应用发布</el-menu-item>
            <el-menu-item index="/app/developer" @click="subNavPath('/app/developer')">成为开发者</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-tickets"></i>
            <span>财务管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="3-1">消费明细</el-menu-item>
            <el-menu-item index="3-2">我的钱包</el-menu-item>
            <el-menu-item index="3-3">提现记录</el-menu-item>
            <el-menu-item index="3-4">我的收入</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-s-tools"></i>
            <span>账号管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/account/material">我的资料</el-menu-item>
            <el-menu-item index="4-2">API设置</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <!-- 折叠菜单 -->
        <div class="dislpay-arrow">
          <a href="javascript:void(0);" @click="subCollapse"><i :class="isCollapse ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"></i></a>
        </div>
        <!-- 右上角按钮组 -->
        <div class="btn-array"><el-button type="danger" size="mini" icon="el-icon-switch-button" @click="logout">退出登录</el-button></div>
      </el-header>
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
      <!-- 底部 -->
      <el-footer>Copyright ©2021 {{ title }} v{{ version }} All Rights Reserved.</el-footer>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 控制菜单的展开与折叠
      isCollapse: false,
      // 控制网站名称的显示与隐藏
      isName: true,
      // 网站名称
      title: window.serverConfig.APP_NAME,
      // 网站LOGO
      logo: window.serverConfig.APP_LOGO_URL,
      // 系统版本
      version: window.serverConfig.APP_VERSION,
      // 当前菜单激活的index
      navUrl: ''
    };
  },
  created() {},
  methods: {
    /**
     * 监听菜单的展开与折叠事件
     */
    subCollapse() {
      this.isCollapse = !this.isCollapse;
      this.isName = !this.isName;
    },

    /**
     * 当前菜单激活的index监听事件
     * @param {Object} url 子菜单url
     */
    subNavPath(url) {
      this.navUrl = url;
    },

    /**
     * 退出登录
     */
    async logout() {
      const { data: res } = await this.$http.post('loginOut');
      if (res.code !== 200) return this.$message.error(res.msg);
      // 删除token
      sessionStorage.removeItem('user_token');
      this.$router.push('/login');
      this.$message.success(res.msg);
    }
  }
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-aside {
  background-color: #001529;
}
.title {
  color: #fff;
  background-color: #002140;
  height: 64px;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 550;
  a {
    color: #fff;
    text-decoration: none;
  }
  img {
    margin-right: 5px;
  }
}
.el-menu {
  border-right: none;
  overflow: hidden;
}
.el-header {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  z-index: 10;
  padding: 0 20px 0 0;
}
.el-main {
  background-color: #f0f2f5;
}
.el-footer {
  background-color: #f0f2f5;
  border-top: 1px solid #e8e8e8;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
  font-size: 12px;
}
.dislpay-arrow {
  top: 0;
}
.dislpay-arrow a {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  font-size: 20px;
  width: 60px;
  height: 60px;
  text-decoration: none;
  color: #333;
}
.dislpay-arrow a:hover {
  text-decoration: none;
  background-color: #f9f9fa;
}
.btn-array {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
