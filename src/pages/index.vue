<style lang="less">
  @import '~assets/styles/index';
</style>

<template>
<div class="tinfinite-body">
  <div class="tinfinite-header">
    <div class="tinfinite-header-main">
      <div class="tinfinite-logo"><a href="/"></a></div>
      <div class="tinfinite-header-button" :class="showMenu ? 'close' : ''" @click="showMenu = !showMenu"></div>
      <ul class="tinfinite-header-nav">
        <li v-for="(item, i) of menuArr" :class="{active: showMenuIndex === i}" @click="showMenuIndex = i"><a :href="item.href" :target="i === 3 ? '_blank' : ''">{{item.title}}</a></li>
      </ul>
      <ul class="tinfinite-header-menu" :style="`display: ${showMenu ? 'block' : 'none'}`">
        <li v-for="(item, i) of menuArr" :class="{active: showMenuIndex === i}" @click="showMenu = !showMenu; showMenuIndex = i"><a :href="item.href">{{item.title}}</a></li>
      </ul>
    </div>
  </div>
  <div class="tinfinite-main">
    <div class="tinfinite-banner" id="banner">
      <div v-swiper:mySwiper="swiperOption">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="banner in banners">
            <a :href="banner.adUrl"><img :src="banner.imageUrl" :alt="banner.subject"></a>
          </div>
        </div>
        <div class="swiper-pagination swiper-pagination-bullets"></div>
      </div>
    </div>

    <div class="tinfinite-ranking" id="ranking">
      <div class="tinfinite-title"><span class="title">一块听听</span><span class="link"><a href="//live.tinfinite.com/" target="_blank">进入商城 <i class="fa fa-angle-right"></i> </a></span></div>
      <ul class="tinfinite-ranking-menu" v-show="showTips">
        <li v-for="(ranks, i) of data" :key="ranks._id"  @click="showRank(i)" :class="{'active': rankShow === i }">{{ranks.subject}}</li>
      </ul>
      <div class="ranking" :class="{'first': i === 0, 'show': rankShow === i}" v-for="(ranks, i) of data" :key="ranks._id">
        <div class="ranking-title">{{ranks.subject}} <i class="fa fa-angle-down" @click="showRank(i)"></i></div>
        <div class="ranking-item" v-for="(item, index) of ranks.items" :key="item._id">
          <a :href="initHost(item._id)" target="_blank">
            <span class="item-icon" :class="index < 3 ? `item-icon${index}` : ''"></span>
            <span class="item-img">
              <img :src="qnCDN(item.speakerImgUrl)" :alt="item.subject">
            </span>
            <span class="item-title">
              {{item.subject}}
              <span>{{item.speakerName}}</span>
            </span>
          </a>
        </div>
      </div>
      <div class="clearfix"></div>
      <div class="rank-link"><a href="//live.tinfinite.com">进入商城 <i class="fa fa-angle-right"></i> </a></div>
    </div>

    <div class="tinfinite-contact" id="contact">
      <div class="tinfinite-title"><span class="title">联系我们</span></div>
      <ul>
        <li @mouseenter="showQrCode(i)" @click="showQrCode(i, true)" v-for="(item, i) of contacts" :alt="item.title">
          <div class="tinfinite-contact-qrCode" :class="{'active': showQrCodeIndex === i}">
            <div v-if="item.qrCode"><h4>{{item.title}}</h4><img :src="item.qrCode" :alt="item.title"></div>
            <div v-if="item.html" v-html="item.html" class="text" :class="{qrCodeHtml: item.qrCode}"></div>
          </div>
          <div class="tinfinite-contact-icon" :class="{'active': showQrCodeIndex !== i}"><img :src="item.icon" :alt="item.title">{{item.title}}</div>
        </li>
      </ul>
    </div>
  </div>
  <div class="tinfinite-footer">
    <div class="tinfinite-footer-main">
      <span>© 情非得已（北京）科技有限公司 <a href="https://www.lagou.com/gongsi/j116183.html" target="_blank">加入我们</a></span>
      <a href="javascript:;" @click="showWeChart = !showWeChart"><img src="//ofe0v4nhm.qnssl.com/live/icon/weixin-icon.png" alt="一块听听微信"></a>
      <a href="//weibo.com/u/6034607459" target="_blank"><img src="//ofe0v4nhm.qnssl.com/live/icon/weibo-icon.png" alt="一块听听微博"></a>
    </div>
  </div>
  <div class="tinfinite-weChart" v-show="showWeChart" @click="showWeChart = !showWeChart"><img src="//ofe0v4nhm.qnssl.com/live/icon/tingting-qrcode.jpg" alt="商务合作"></div>
</div>
</template>

<script>
  import request from '~assets/utils/request'

  export default {
    /**
     * 服务端渲染数据
     * `this` 无法指向 vm 实例，有context.store._vm，但是获取不到vm实例
     * return之后的数据和 vm 实例是绑定的，methods中的this是可以访问到当前返回的数据。
     */
    asyncData (context) {
      var data = {
        swiperOption: {
          pagination: '.swiper-pagination',
          centeredSlides: true,
          initialSlide: 0,
          autoplay: 5000,
          loop: true
        },
        /**
         * 缓存context部分属性
         * context无法全部赋值到data上
         * context.store实例是全局对象，没办法赋值给子对象
         */
        context: {
          isDev: context.isDev,
          params: context.params
        },
        menuArr: [
          {
            title: '首页',
            href: '#'
          },
          {
            title: '一块听听',
            href: '#ranking'
          },
          {
            title: '联系我们',
            href: '#contact'
          },
          {
            title: '帮助与反馈',
            href: '//live.tinfinite.com/help-feedback.html'
          }
        ],
        contacts: [{
          html: '<h4>商务合作</h4><br>请发送邮件至<br>business@tinfinite.com',
          icon: '//ofe0v4nhm.qnssl.com/live/icon/concat.png',
          title: '商务合作'
        }, {
          qrCode: '//ofe0v4nhm.qnssl.com/live/icon/tingting-qrcode.jpg',
          html: '微信扫一扫<br>添加好友洽谈',
          icon: '//o3pvuu23u.qnssl.com/ssr/index/img/2.png',
          title: '商户咨询'
        }, {
          qrCode: '//ofe0v4nhm.qnssl.com/live/icon/tingting-qrcode.jpg',
          html: '微信扫一扫<br>添加好友反馈',
          icon: '//o3pvuu23u.qnssl.com/ssr/index/img/3.png',
          title: '联系客服'
        }, {
          html: '<h4>其他</h4><br>联系电话<br>010-59002311',
          icon: '//o3pvuu23u.qnssl.com/ssr/index/img/4.png',
          title: '其他'
        }],
        showWeChart: false,
        showMenu: false,
        showTips: false,
        rankShow: 0,
        showQrCodeIndex: false,
        showQrCodeClickNum: 0,
        showMenuIndex: 0,
        banners: [],
        data: []
      }
      return request.all({
        requests: [
          {
            method: 'get',
            url: `like/active`,
            data: { location: 2 },
            context: context
          },
          {
            method: 'get',
            url: `topic/pc`,
            data: { displayLocations: 'W' },
            context: context
          }
        ],
        done (banner, topic) {
          data.banners = banner.data.data.records
          data.swiperOption.autoplay = banner.data.data.records.length > 1 ? 5000 : 0
          data.data = topic.data.data.records
          return data
        }
      })
    },
    head () {
      return {
        title: '情非得已-让一部分知识分子先富起来',
        meta: [
          { hid: 'keywords', name: 'keywords', content: '情非得已,情非得已官网,一块听听,最新课程,知识付费,知识商城,音频' },
          { hid: 'description', name: 'description', content: '情非得已（北京）科技有限公司官方网站，公司产品一块听听知识商城，让你听到全世界的好知识。' }
        ]
      }
    },
    mounted () {
      window.addEventListener('scroll', (e) => {
        let win = window
        let scrollY = win.scrollY
        let h = win.innerHeight + scrollY < (document.getElementById('ranking').clientHeight + 480)

        if (scrollY < 410) {
          this.showMenuIndex = 0
        } else if (h) {
          this.showMenuIndex = 1
        } else {
          this.showMenuIndex = 2
        }
      }, false)
      window.addEventListener('resize', (e) => {
        this.initHeight()
      }, false)
      this.initHeight()
    },
    methods: {
      initHost (id) {
        let env = {
          'test': '-dev',
          'stage': '-stg',
          'production': ''
        }
        return `//live${env[process.env.BUILD_ENV]}.tinfinite.com/live-detail.html?liveshowId=${id}`
      },
      initHeight () {
        let icon = document.querySelectorAll('.tinfinite-contact-icon')
        let code = document.querySelectorAll('.tinfinite-contact-qrCode')
        let height = icon[1].clientHeight || icon[1].offsetHeight
        for (var i = code.length - 1; i >= 0; i--) {
          code[i].style.height = height + 'px'
        }
      },
      showRank (num) {
        this.rankShow = num
        this.showTips = !this.showTips
      },
      showQrCode (index, bool) {
        this.showQrCodeClickNum += 1
        if (this.showQrCodeClickNum > 1) {
          this.showQrCodeClickNum -= 1
          return false
        }
        this.showQrCodeIndex = bool && typeof this.showQrCodeIndex === 'number' ? false : index
        setTimeout(() => {
          this.showQrCodeClickNum -= 1
        }, 100)
      },
      qnCDN (url) {
        if (!url) return '//o4a7cbihz.qnssl.com/cover/57d07227-3203-42d9-ac3c-465849b4c609'
        let bool = url.indexOf('//') > -1
        return bool ? url : '//qncdn-live.tinfinite.com/' + url
      }
    }
  }
</script>
