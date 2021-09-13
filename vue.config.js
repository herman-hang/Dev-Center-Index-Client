module.exports = {
  chainWebpack: config => {
    //发布模式模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')
      //使用externals设置排除项
      config.set('externals', {
        vue: 'Vue',
        axios: 'axios',
        'vue-router': 'VueRouter',
        lodash: '_',
        nprogress: 'NProgress',
        'mavon-editor': 'MavonEditor'
      })
      //自定义首页标题作条件
      config.plugin('html').tap(args => {
        args[0].isProd = true;
        return args;
      })
    })

    //开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
      //自定义首页标题作条件
      config.plugin('html').tap(args => {
        args[0].isProd = false;
        return args;
      })
    })
  }
}
