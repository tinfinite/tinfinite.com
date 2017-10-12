import Request from '~assets/utils/request'

const jsApiList = [
  'onMenuShareTimeline',
  'onMenuShareAppMessage',
  'onMenuShareQQ',
  'onMenuShareWeibo',
  'onMenuShareQZone',
  'startRecord',
  'stopRecord',
  'onVoiceRecordEnd',
  'playVoice',
  'pauseVoice',
  'stopVoice',
  'onVoicePlayEnd',
  'uploadVoice',
  'downloadVoice',
  'chooseImage',
  'previewImage',
  'uploadImage',
  'downloadImage',
  'translateVoice',
  'getNetworkType',
  'openLocation',
  'getLocation',
  'hideOptionMenu',
  'showOptionMenu',
  'hideMenuItems',
  'showMenuItems',
  'hideAllNonBaseMenuItem',
  'showAllNonBaseMenuItem',
  'closeWindow',
  'scanQRCode',
  'chooseWXPay',
  'openProductSpecificView',
  'addCard',
  'chooseCard',
  'openCard'
]

const setJsConfig = (cxt, success, fail) => { // 获取JSSDK接口注入权限验证配置
  let isWeixin = /micromessenger/.test(navigator.userAgent.toLowerCase())
  if (!isWeixin) {
    return
  }
  window.wx = require('weixin-js-sdk')
  const Cookie = require('fe-utils/cookie')
  const userToken = Cookie.getCookie('_utoken')
  Request.post(cxt, {
    url: '/wechat/jsConfig',
    data: {
      debug: false,
      url: window.location.href,
      jsApiList,
      userToken
    }
  }).then((res) => {
    if (res.data.err) {
      fail && fail()
      return
    }
    configureWx(res.data.data, success, fail)
  }).catch((err) => {
    console && console.log(err)
  })
}

const configureWx = (data, success, fail) => {
  if (!window.wx) { return }

  window.wx.config(data)

  window.wx.error(function (res) {
    fail && fail()
    if (!window.location.port) {
      window.bughd('微信配置项出问题', res)
    }
  })

  window.wx.ready(function () {
    success && success()
  })
}

export default setJsConfig
