var AppUrl = getApp();
// 声明定义接口地址 通过微剧ID获取剧集信息（微剧播放页面）
var miniProUrl_2 = AppUrl.globalData.WX_microvision + getApp().globalData.wx_url_2;
// 声明定义接口地址 通过微剧id获取微剧信息
var miniProUrl_3 = AppUrl.globalData.WX_microvision + getApp().globalData.wx_url_3;
// 声明定义接口地址 通过微剧id获取微剧信息（标题）
var miniProUrl_4 = AppUrl.globalData.WX_microvision + getApp().globalData.wx_url_4;
// 声明定义接口地址 通过GCID获取视频的URL播放地址
var GcidUrl = "http://mp4.cl.kankan.com/getCdnresource_flv"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 自定义标题栏的高度
    statusBarHeight: AppUrl.globalData.statusBarHeight,
    // 微剧ID
    movieId: '133',
    // 微剧子集ID
    setId: '1838',
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
    videoAddress: '',
    // 缓存进度
    video_cache: '0',
    // 播放进度
    video_play: '0',
    // 播放按钮的状态
    suspend_state: 'display:block',
    // 播放结束按钮的状态
    finish_state: 'display:none',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this
    if (options.movieId) {
      console.log(options.movieId)
      // 获取上个页面获取到的微剧ID
      var movie_Id = options.movieId
      // 获取上个页面获取到的子集ID
      var set_Id = options.setId
      _this.setData({
        movieId: movie_Id,
        setId: set_Id
      })
    }
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
    let setId = _this.data.setId || ''
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
        // 如果data中的子集id为空，则把微剧第一集的子集id传到data
        if (resData != '' && setId == '') {
          let set_id = resData[0].setId || ''
          _this.setData({
            setId: set_id
          })
        }
        // 100毫秒之后执行函数（目的是等待续集ID存入data之后执行）
        var timeOut = setTimeout(function() {
          // 声明续集列表
          let sequelList = []
          for (var i in resData) {
            if (resData[i].setId == _this.data.setId) {
              console.log(resData[i])
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
          // 函数执行 通过微剧ID获取微剧的介绍信息（微剧播放页面）
          _this.MicroInfoTitle()
          // 函数执行 通过微剧ID获取微剧的介绍信息（标题）
          _this.MicroInfoTitleForm()
          // 函数执行 获取视频信息（使用GCID获取url地址）
          _this.GcidVideoInfoList(moviesSetScreenList)
        }, 100)

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
      setId: setId,
      // 播放按钮的状态
      suspend_state: 'display:block',
      // 播放结束按钮的状态
      finish_state: 'display:none',
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
  // 函数定义 获取视频信息（此处为请求接口）
  GcidVideoInfoList(res) {
    var _this = this
    let GCID = res;
    let params = {
      gcid: GCID,
      bid: 21
    }
    const newparams = Object.assign(params);
    wx.request({
      url: GcidUrl,
      data: newparams,
      method: "GET",
      header: {
        'content-type': 'application/josn'
      },
      success: res => {
        let resData = res.data
        // 查找"["开始位索引
        let star_indexes = resData.indexOf("[")
        // 查找"]"结束位索引
        let end_indexes = resData.indexOf("]")
        // 获取"[]"中的内容
        let resnum = resData.substring(star_indexes, end_indexes)
        // 获取IP地址的正则表达式
        var ip = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
        // MP4的Ip地址
        var Iptext = ip.exec(resnum)[0];
        // MP4的端口号
        var port = "8080"
        // URL路径开始位索引
        let star_url = resnum.indexOf("/")
        // URL路径结束位索引
        let end_url = resnum.indexOf("mp4")
        // MP4的Url路径内容
        let url_resnum = resnum.substring(star_url, end_url + 3)
        // MP4完整地址
        let video_address = "http://" + Iptext + url_resnum

        // 把视频地址放入data中
        _this.setData({
          videoAddress: video_address
        })
      }
    })
  },
  // 函数定义 视频播放PLAY 暂时 需修改
  videoPlay() {
    let _this = this
    // 创建video实例
    var videoplay = wx.createVideoContext('videoNode')
    // 使视频播放
    videoplay.play()
    // 设置播放按钮不再显示
    _this.setData({
      suspend_state: 'display:none',
      finish_state: 'display:none'
    })
    // 函数执行 播放中函数，查看当前播放时间和比例 进度条
    _this.bindtimeupdate()
  },
  // 函数定义  暂停播放
  videoPause() {
    let _this = this
    // 创建video实例
    var videoplay = wx.createVideoContext('videoNode')
    // 使视频暂停
    videoplay.pause()
    _this.setData({
      suspend_state: 'display:block',
    })
  },
  // 函数定义 播放结束
  bindend: function() {
    let _this = this
    _this.setData({
      finish_state: 'display:block'
    })
  },
  // 函数定义 播放中函数，查看当前播放时间和比例 进度条
  bindtimeupdate: function(res) {
    var _this = this
    // 当前视频播放时间
    let videoPlay = res.detail.currentTime
    // 视频总时长
    let inner_time = res.detail.duration
    // 当前播放占全部时长的比例
    let video_ratio = (videoPlay / inner_time) * 100
    this.setData({
      video_play: video_ratio,
      video_cache: "100"
    })
  },
  // 函数定义 用GCID请求视频
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let _this = this
    if (_this.data.movieId == '') {
      wx.getStorage({
        key: 'movieId',
        success: function(res) {
          var movie_Id = res.data
          var set_Id = ''
          _this.setData({
            movieId: movie_Id,
            setId: set_Id
          })
        }
      })
    }
    // 100毫秒之后执行函数（目的是等待续集ID存入data之后执行）
    var timeOut = setTimeout(function() {
      // 函数执行 通过微剧ID获取剧集信息（微剧播放页面）
      _this.MicroDramaInformation()
    }, 100)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    wx.removeStorage({
      key: 'movieId',
      success: function (res) {
        console.log(res)
      }
    })
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