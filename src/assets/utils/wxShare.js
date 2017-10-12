import insertRefererInUrl from '~assets/utils/insertRefererInUrl'
import { dealSrc } from './directives/ting-src/directive'

const share = function (shareLink, subject, introduction, num, shareImage, friendCircleTitle) {
  shareImage = 'https:' + dealSrc(shareImage || 'https://o4a7cbihz.qnssl.com/cover/4586b006-9ca3-4232-a93e-22af3a1af040')
  num = num || 0

  let title = subject
  if (num >= 10000) {
    let num1 = Number(num / 10000).toFixed(1)
    let num2 = Math.floor(num / 10000).toFixed(1)
    if (num1 === num2) {
      num1 = Math.floor(num / 10000)
    }
    title = subject + '（' + num1 + 'w人已参与）'
  }

  shareLink = insertRefererInUrl(shareLink)

  window.wx.ready(function () {
    let shareData = {
      title: title,
      desc: introduction,
      link: shareLink,
      imgUrl: shareImage,
      success: null,
      cancel: null
    }
    // 分享到朋友圈
    window.wx.onMenuShareTimeline({
      title: friendCircleTitle || title,
      link: shareLink,
      imgUrl: shareImage,
      success: null,
      cancel: null
    })
    // 分享给朋友
    window.wx.onMenuShareAppMessage({
      title: title,
      desc: introduction,
      link: shareLink,
      imgUrl: shareImage,
      type: 'link',
      dataUrl: '',
      success: null,
      cancel: null
    })
    // 分享到QQ
    window.wx.onMenuShareQQ(shareData)
    // 分享到QQ空间
    window.wx.onMenuShareQZone(shareData)
    // 分享到腾讯微博
    window.wx.onMenuShareWeibo(shareData)
  })
}

export default share
