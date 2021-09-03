import Vue from 'vue'
//导入axios
import axios from 'axios'
//导入nprogress的js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
//挂载到原型对象上
Vue.prototype.$http = axios
//配置请求的根路径
axios.defaults.baseURL = window.serverConfig.BASE_API
//axios请求拦截器，给请求头添加一个Authorization，便于授权验证
axios.interceptors.request.use(config => {
  // 不展现进度条的路由
  const blank = [
    'pay/qqpayReturn',
    'pay/alipayReturn',
    'pay/wxpayReturn'
  ];
  // 和数组中的路由匹配失败则展现
  if (blank.indexOf(config.url) === -1) {
    //展现进度条
    NProgress.start();
  }
  config.headers.Authorization = window.sessionStorage.getItem('user_token');
  return config;
})
//axios响应拦截器
axios.interceptors.response.use(config => {
  if (config.headers.authorization !== null && config.headers.authorization !== undefined && config.headers
    .authorization !== '') {
    //保存token值
    window.sessionStorage.setItem('user_token', config.headers.authorization);
  }
  if (config.data.code === 0) {
    // 删除token
    sessionStorage.removeItem('user_token');
    // 刷新
    setTimeout(() => {
      window.location.reload();
    }, 1500)
  }
  //隐藏进度条
  NProgress.done();
  return config;
})
