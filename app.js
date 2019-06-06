//app.js
// 微剧场（开群申请）
// 18259821655@163.com
// kankan2019
// 原始ID：gh_e8e635f974cc
// AppID：wx85b4ce32d2b60098
// 秘钥：79413a4b190243cd3ba279b3e4461f3c
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    openid: 0,
    // 公共前缀
    // 正式域名
    // WX_user: 'https://plus-api.kankan.com',
    // WX_microvision: 'https://svideo-api.kankan.com',
    // 测试域名
    WX_user: 'https://plus-api.kkstudy.cn',
    WX_microvision:'https://svideo-api.kkstudy.cn',
    // 登陆授权接口
    wx_url_1: '/user/login/miniProEncrypt',
    // 通过微剧id获取剧集信息（微剧播放页面）
    wx_url_2: '/microvision/getSetListByProductId',
    // 通过微剧id获取微剧信息
    wx_url_3: '/author/getAuthorInfoByProductId',
    // 通过微剧id获取微剧信息(标题)
    wx_url_4: '/microvision/getMicrovisionBySetId',
    // 微剧列表（微剧广场）
    wx_url_5: '/microvision/getMicrovisionListForSquare',
    // 点赞接口
    wx_url_6:'/microvision/doLike',
    // 分享文案的图片
    wx_url_7: '/microvision/getShareParas',
    // 获取分享文案的描述
    wx_url_8: '/microvision/getShareParas'

  }
})