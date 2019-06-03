var AppUrl = getApp();
// 声明定义接口地址 通过微剧ID获取剧集信息（微剧播放页面）
var miniProUrl_5 = AppUrl.globalData.WX_microvision + getApp().globalData.wx_url_5;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    default_state: true,
    update_state: false,
    view_state: false,
    lises_state: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    // 函数执行 请求微剧列表 第一个参数为排序类型 第二个参数为起始id 第三个参数为每页显示条数
    _this.MicroList(1, 0, 40)
  },
  // 函数定义 请求微剧列表
  MicroList(sort_Type, start_Id, page_Size) {
    let _this = this
    // 排序类型 1-默认 2-更新 3-观看 4-喜欢
    let sortType = sort_Type
    // 起始ID
    let startId = start_Id
    // 每页条数
    let pageSize = page_Size
    let params = {
      sortType: sortType,
      startId: startId,
      pageSize: pageSize
    }
    const newparams = Object.assign(params);
    wx.request({
      url: miniProUrl_5,
      data: newparams,
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        // 声明返回数据
        let resData = res.data.data
        let micro_list = []
        for (let i in resData) {
          // 微剧ID
          let micro_id = resData[i].id
          // 微剧名称
          let micro_name = resData[i].name
          // 微剧观看数
          let play_count = resData[i].playCount;
          if (play_count >= 10000) {
            var micro_play_count = (play_count / 10000).toFixed(2) + 'W'
          } else {
            var micro_play_count = resData[i].playCount
          }
          // 微剧点赞数
          let like_count = resData[i].likeCount
          if (like_count >= 10000) {
            var micro_like_count = (like_count / 10000).toFixed(2) + 'W'
          } else {
            var micro_like_count = resData[i].likeCount
          }
          // 微剧展示图
          let micro_screens_hot_url = resData[i].screensHotUrl
          // 微剧更新状态
          let update_status = resData[i].updateStatus
          // 微剧更新集数
          let set_num = resData[i].setNum
          if (update_status == 0) {
            var micro_set_num = "更新至" + set_num + "集"
          } else if (update_status == 1) {
            var micro_set_num = "已完结"
          }
          // 集合得到的参数
          let temp = {
            micro_id: micro_id,
            micro_name: micro_name,
            micro_play_count: micro_play_count,
            micro_like_count: micro_like_count,
            micro_screens_hot_url: micro_screens_hot_url,
            micro_set_num: micro_set_num
          }
          micro_list.push(temp)
        }
        _this.setData({
          micro_list: micro_list
        })
      }
    })
  },
  // 函数定义 点击跳转到播放页面
  Microplay(e) {
    // 微剧ID
    let id = e.currentTarget.dataset.id
    wx.setStorage({
      key: "movieId",
      data: id
    })
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  // 函数定义 点击默认排序所执行函数
  defaultSort() {
    let _this = this;
    // 函数执行 请求微剧列表 第一个参数为排序类型 第二个参数为起始id 第三个参数为每页显示条数
    _this.MicroList(1, 0, 40)
    // 改变排序按钮箭头的状态
    _this.setData({
      default_state: true,
      update_state: false,
      view_state: false,
      lises_state: false
    })
  },
  // 函数定义 点击更新排序所执行函数
  updateSort() {
    let _this = this;
    // 函数执行 请求微剧列表 第一个参数为排序类型 第二个参数为起始id 第三个参数为每页显示条数
    _this.MicroList(2, 0, 40)
    // 改变排序按钮箭头的状态
    _this.setData({
      default_state: false,
      update_state: true,
      view_state: false,
      lises_state: false
    })
  },
  // 函数定义 点击观看排序所执行函数
  viewSort() {
    let _this = this;
    // 函数执行 请求微剧列表 第一个参数为排序类型 第二个参数为起始id 第三个参数为每页显示条数
    _this.MicroList(3, 0, 40)
    // 改变排序按钮箭头的状态
    _this.setData({
      default_state: false,
      update_state: false,
      view_state: true,
      lises_state: false
    })
  },
  // 函数定义 点击喜欢排序所执行函数
  likesSort() {
    let _this = this;
    // 函数执行 请求微剧列表 第一个参数为排序类型 第二个参数为起始id 第三个参数为每页显示条数
    _this.MicroList(4, 0, 40)
    // 改变排序按钮箭头的状态
    _this.setData({
      default_state: false,
      update_state: false,
      view_state: false,
      lises_state: true
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})