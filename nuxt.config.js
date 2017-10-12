const path = require('path')
module.exports = {
  srcDir: 'src/',
  /*
  ** 缓存静态文件
  */
  cache: false,
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1, minimum-scale=1, user-scalable=no' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'format-detection', content: 'email=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '//o4a7cbihz.qnssl.com/cover/4a45adda-d3e7-4726-bdd5-8e03b9485b52' }
    ],
    script: [
      { src: '//o3pvuu23u.qnssl.com/ssr/js/ssr-index-baidu-hm.js' }
    ]
  },
  /**
   * [将vue插件加载到全部页面中，不用在页面写if (process.BROWSER_BUILD) { ...]
   * @type {Array}
   */
  plugins: [
    {
      src: '~plugins/swiper.js',
      ssr: false
    }
  ],
  css: [
    'swiper/dist/css/swiper.css'
  ],
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#0145FF' },
  /*
  ** 环境变量配置
  */
  env: {
    BUILD_ENV: process.env.BUILD_ENV
  },
  /*
  ** Build 配置
  */
  build: {
    publicPath: '//ofe0v4nhm.qnssl.com/',
    vendor: [
      'axios',
      'vue-awesome-swiper'
    ],
    /*
    ** webpack配置
    */
    extend (config, ctx) {
      config.resolve.alias['~assets'] = path.join(__dirname, 'src/assets')
      config.resolve.alias['~components'] = path.join(__dirname, 'src/components')
      config.resolve.alias['~pages'] = path.join(__dirname, 'src/pages')
      config.resolve.alias['~plugins'] = path.join(__dirname, 'src/plugins')
      config.resolve.alias['~static'] = path.join(__dirname, 'src/static')
      config.resolve.alias['~store'] = path.join(__dirname, 'src/store')
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
