var AppUrl = getApp();
// 声明定义接口地址 通过微剧ID获取剧集信息（微剧播放页面）
var miniProUrl_2 = AppUrl.globalData.WX_microvision + getApp().globalData.wx_url_2
// 声明定义接口地址 通过微剧id获取微剧信息
var miniProUrl_3 = AppUrl.globalData.WX_microvision + getApp().globalData.wx_url_3
// 声明定义接口地址 通过微剧id获取微剧信息（标题）
var miniProUrl_4 = AppUrl.globalData.WX_microvision + getApp().globalData.wx_url_4
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 视频地址
    video_address: '',
    // 自定义标题栏的高度
    statusBarHeight: AppUrl.globalData.statusBarHeight,
    // 微剧ID
    movieId: '47',
    // 微剧子集ID
    setId: '66',
    // 续集列表
    sequelList: [],
    // 观看数
    playCount: '',
    // 点赞数
    likeCount: '',
    // 剧集描述
    des: '',
    // 商品的标题
    goodsName: '',
    // 视频的GCID地址
    moviesSetScreenList: '',
    // 发布者头像
    headPic: '',
    // 发布者昵称
    nickName: '',
    // 微剧标题
    Name: '',
    // 视频地址
    videoAddress: 'https://static.yximgs.com/s1/videos/home-2.mp4',
    // 缓存进度
    video_cache: '0',
    // 播放进度
    video_play: '0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this
    // 100毫秒之后执行函数（目的是等待续集ID存入data之后执行）
    var timeOut = setTimeout(function() {
      // 函数执行 通过微剧ID获取剧集信息（微剧播放页面）
      _this.MicroDramaInformation()
      // 函数执行 通过微剧ID获取微剧的介绍信息（微剧播放页面）
      _this.MicroInfoTitle()
      // 函数执行 通过微剧ID获取微剧的介绍信息（标题）
      _this.MicroInfoTitleForm()
    }, 100)
  },
  // 函数定义 跳转视频列表页面
  JumpVideoList() {
    wx.navigateTo({
      url: '/pages/videoList/videoList',
    })
  },
  // 函数定义 通过微剧ID获取剧集信息（微剧播放页面）
  MicroDramaInformation() {
    let _this = this
    // 微剧ID
    let movieId = _this.data.movieId;
    // 微剧子集ID
    let setId = _this.data.setId
    let params = {
      productId: movieId
    }
    const newparams = Object.assign(params);
    wx.request({
      url: miniProUrl_2,
      data: newparams,
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        // 声明返回数据
        let resData = res.data.data
        // 声明续集列表
        let sequelList = []
        for (var i in resData) {
          if (resData[i].setId == setId) {
            // 观看数
            if (resData[i].playCount >= 10000) {
              // 截取保留一位小数
              let play_count = (resData[i].playCount / 10000).toFixed(1)
              // 最终显示形式 点赞数量拼接
              var playCount = play_count + 'W'
            } else {
              var playCount = resData[i].playCount;
            }
            // 点赞数
            if (resData[i].likeCount >= 10000) {
              // 截取保留一位小数
              let like_count = (resData[i].likeCount / 10000).toFixed(1)
              // 最终显示形式 点赞数量拼接
              var likeCount = like_count + 'W'
            } else {
              var likeCount = resData[i].likeCount;
            }
            // 剧集描述
            var des = _this.DelHtmlTag(resData[i].des)
            // 广告标题
            var goodsName = resData[i].goodsName
            // 视频的GCID地址
            var moviesSetScreenList = resData[i].moviesSetScreenList[1].mp4Gcid;
            // 当前播放续集
            var setNum = resData[i].setNum
          }
          // 各个的子集ID
          let sequel_id = resData[i].setId
          // 各个子集的序号
          let sequel = ++i
          let seq_temp = {
            sequel: sequel,
            sequel_id: sequel_id
          }
          // 放入续集列表中
          sequelList.push(seq_temp)
        }
        // 把数据更新到data中
        _this.setData({
          sequelList: sequelList,
          playCount: playCount,
          likeCount: likeCount,
          des: des,
          goodsName: goodsName,
          moviesSetScreenList: moviesSetScreenList,
          setNum: setNum
        })
      }
    })
  },
  // 函数定义 通过微剧ID获取微剧的介绍信息（微剧播放页面）
  MicroInfoTitle() {
    let _this = this
    // 微剧ID
    let movieId = _this.data.movieId;
    // 微剧子集ID
    let setId = _this.data.setId
    let params = {
      productId: movieId,
      setId: setId
    }
    const newparams = Object.assign(params);
    wx.request({
      url: miniProUrl_3,
      data: newparams,
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        // 声明返回数据
        let resData = res.data.data
        // 发布者头像
        let headPic = resData.headPic
        // 发布者昵称
        let nickName = resData.nickName
        // 把数据存入data
        _this.setData({
          headPic: headPic,
          nickName: nickName
        })
      }
    })
  },
  // 函数定义 通过微剧ID获取微剧的介绍信息（标题）
  MicroInfoTitleForm() {
    let _this = this
    // 微剧ID
    let movieId = _this.data.movieId;
    // 微剧子集ID
    let setId = _this.data.setId
    let params = {
      setId: setId
    }
    const newparams = Object.assign(params);
    wx.request({
      url: miniProUrl_4,
      data: newparams,
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        // 声明返回数据
        let resData = res.data.data
        // 微剧标题
        let name = resData.name
        // 把数据存入data
        _this.setData({
          Name: name
        })
      }
    })
  },
  // 函数定义 切换续集
  PitchSequel(e) {
    let _this = this;
    // 当前点击续集ID
    let setId = e.currentTarget.dataset.pitch_sequel
    // 存入本地data中
    _this.setData({
      setId: setId
    });
    // 100毫秒之后执行函数（目的是等待续集ID存入data之后执行）
    var timeOut = setTimeout(function() {
      // 函数执行 通过微剧ID获取剧集信息（微剧播放页面）
      _this.MicroDramaInformation()
      // 函数执行 通过微剧ID获取微剧的介绍信息（微剧播放页面）
      _this.MicroInfoTitle()
      // 函数执行 通过微剧ID获取微剧的介绍信息（标题）
      _this.MicroInfoTitleForm()
    }, 100)
  },
  // 函数定义，去除 HTML标签
  DelHtmlTag(str) {
    return str.replace(/<[^>]+>/g, "");
  },
  // 函数定义 获取视频信息（此处为请求接口）-----未完成
  VideoInfoList() {
    console.log(this.data.videoAddress)
  },
  // 函数定义 操作获取到的视频信息
  VideoInfo() {

  },
  // 函数定义 视频播放PLAY 暂时 需修改
  videoPlay() {
    console.log('开始播放')
    var videoplay = wx.createVideoContext('videoNode')
    videoplay.play()
    this.bindtimeupdate()
  },
  // bindplay: function () {//开始播放按钮或者继续播放函数
  //   console.log("开始播放")
  // },
  // bindpause: function () {//暂停播放按钮函数
  //   console.log("停止播放")
  // },
  // bindend: function () {//播放结束按钮函数
  //   console.log("播放结束")
  // },
  //播放中函数，查看当前播放时间等--暂时，需修改
  bindtimeupdate: function(res) {
    let videoPlay = res.detail.currentTime
    this.setData({
      video_play: videoPlay
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let _this = this;
    // 函数执行 获取视频信息（此处为请求接口）
    _this.VideoInfoList()
    // 100毫秒之后执行函数（目的是获取到视频地址之后执行）
    var timeOut = setTimeout(function() {
      // 函数执行 视频信息（获取到视频之后操作）
      _this.VideoInfo()
    }, 100)
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