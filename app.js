//app.js
App({
  onLaunch: function () {
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
    // WX_user:'https://plus-api.kankan.com',
    // Wx_rebate:'https://rebate-api.kkstudy.cn',
    // 测试域名
    WX_user: 'https://plus-api.kkstudy.cn',
    Wx_rebate: 'https://rebate-api.kkstudy.cn',
    // 登陆授权接口
    wx_url_1: '/user/login/miniProEncrypt',
    // 电影列表接口
    wx_url_2: '/user/shop/getMySpreadListByUserId',
    // 支付接口
    wx_url_3: '/order/unifiedOrder',
    // 支付状态接口
    wx_url_4: '/order/queryOrderDetails',
    // 获取用户信息接口
    wx_url_5: '/base/user/getUserNameById',
    // 获取小店累计收入函数
    wx_url_6: '/rebate/user/getUserAccumulatedIncomeNoLogin',
    // 获取视频地址
    wx_url_7: '/base/movie/getMovieTicketForMini',
    //小程序分享
    wx_url_8: '/weixin/share/miniPro',
    //请求推广
    wx_url_9: '/user/shop/getOfficialRecommendation',
    // 获取指定人的推广
    wx_url_10: '/user/shop/getMySpreadListByUserId',
    // 获取指定人的待推广
    wx_url_11: '/user/shop/getMyNoSpreadListNoLogin'
  }

})