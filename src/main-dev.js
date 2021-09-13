import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 全局配置文件
import '../public/config.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/icons/iconfont.css'
// 请求拦截器和响应器
import './utils/request.js'
// 时间过滤器
import './utils/filter.js'
// 加载MD5加密算法
import md5 from 'js-md5';
// 富文本编辑器
import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
// 预防xss攻击，使用教程http://www.zlxvip.cn/index.php/archives/6/
import xss from 'xss'
Object.defineProperty(Vue.prototype, '$xss', {
  value: xss
})
Vue.use(mavonEditor)
// 挂载到vue原型上
Vue.prototype.$md5 = md5;
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
