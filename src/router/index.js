import Vue from 'vue'
import VueRouter from 'vue-router'
//路由赖加载
const Login = () => import( /* webpackChunkName: "login_register_password" */ '../views/Login.vue')
const Register = () => import( /* webpackChunkName: "login_register_password" */ '../views/Register.vue')
const Password = () => import( /* webpackChunkName: "login_register_password" */ '../views/Password.vue')
const Error404 = () => import( /* webpackChunkName: "404" */ '../views/404.vue')
const Home = () => import( /* webpackChunkName: "home_welcome" */ '../views/Home.vue')
const AuthorizationList = () => import( /* webpackChunkName: "authorizationlist" */ '../views/authorization/List.vue')
const Alipay = () => import( /* webpackChunkName: "pay" */ '../views/pay/Alipay.vue')
const Qqpay = () => import( /* webpackChunkName: "pay" */ '../views/pay/Qqpay.vue')
const Wxpay = () => import( /* webpackChunkName: "pay" */ '../views/pay/Wxpay.vue')

Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/login'
}, {
  path: '/login',
  component: Login
}, {
  path: '/register',
  component: Register
}, {
  path: '/password',
  component: Password
}, {
  path: '/home',
  component: Home,
  redirect: '/authorization/list',
  children: [{
    path: '/authorization/list',
    component: AuthorizationList
  }]
}, {
  name: 'alipay',
  path: '/pay/alipay',
  component: Alipay
}, {
  name: 'qqpay',
  path: '/pay/qqpay',
  component: Qqpay
}, {
  name: 'wxpay',
  path: '/pay/wxpay',
  component: Wxpay
}, {
  path: '/404',
  component: Error404
}, {
  path: '*',
  redirect: '/404'
}]

const router = new VueRouter({
  mode: 'history', //去掉url中的'#'号
  routes
})

//判断登录状态，挂载路由导航守卫 to:将要访问的路径  from:从那个路径跳转而来  next:放行
router.beforeEach((to, from, next) => {
  // 定义不需要检测登录的路由
  const noNeedLogin = [
    '/register',
    '/password',
    '/404'
  ]
  //获取token
  const token = window.sessionStorage.getItem('user_token');
  if (to.path === '/login') {
    //存在token直接重定向到后台首页
    if (token) {
      return next('/home');
    }
    return next();
  }
  if (!token) {
    if (noNeedLogin.indexOf(to.path) === -1) {
      return next('/login');
    }
  }
  next();
});
export default router
