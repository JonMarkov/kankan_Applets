// 声明全局
var AppUrl = getApp();
// 声明定义接口地址 通过微剧ID获取剧集信息（微剧播放页面）
var miniProUrl_2 = AppUrl.globalData.WX_microvision + getApp().globalData.wx_url_2;
// 声明定义接口地址 通过微剧id获取微剧信息
var miniProUrl_3 = AppUrl.globalData.WX_microvision + getApp().globalData.wx_url_3;
// 声明定义接口地址 通过微剧id获取微剧信息（标题）
var miniProUrl_4 = AppUrl.globalData.WX_microvision + getApp().globalData.wx_url_4;
// 声明定义接口 点赞功能
var miniProUrl_6 = AppUrl.globalData.WX_microvision + getApp().globalData.wx_url_6;
// 声明定义接口 分享所需要的数据
var miniProUrl_7 = AppUrl.globalData.WX_microvision + getApp().globalData.wx_url_7;
// 声明定义接口地址 通过GCID获取视频的URL播放地址
var GcidUrl = "http://mp4.cl.kankan.com/getCdnresource_flv"
Page({
  // 数据DATA 页面的初始数据
  data: {
    // 自定义标题栏的高度
    statusBarHeight: AppUrl.globalData.statusBarHeight,
    // 微剧ID
    movieId: '',
    // 微剧子集ID
    setId: '',
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
    suspend_state: 'display:none',
    // 播放结束按钮的状态
    finish_state: 'display:none',
    // 点赞状态
    likeStatus: false,
    // 滚动条当前偏移位置
    scrollLeft: '',
    // 滑动开始的距离
    touchStartingY:'',
    // 滑动进行中距离
    touchMoveingY:''
  },
  // 内置函数 生命周期函数--监听页面加载
  onLoad: function(options) {
    var _this = this
    if (options.movieId) {
      // 获取上个页面获取到的微剧ID
      var movie_Id = options.movieId
      // 获取上个页面获取到的子集ID
      var set_Id = options.setId
      _this.setData({
        movieId: movie_Id,
        setId: set_Id
      })
    }
    // 获取缓存 用户id数据
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        _this.setData({
          userInfo: res.data
        })
      },
    })

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
    let user_id = _this.data.userInfo.userId
    // 微剧ID
    let movieId = _this.data.movieId;
    // 微剧子集ID
    let setId = _this.data.setId || ''
    let params = {
      userid: user_id,
      productId: movieId
    }
    const newparams = Object.assign(params);
    wx.request({
      url: miniProUrl_2,
      data: newparams,
      method: "GET",
      header: {
        'content-type': 'application/json',
        'ticket': _this.data.userInfo.ticket,
        'terminal': 'MINIPROVJ'
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
              var goodsName = resData[i].goodsName || ''
              // 视频的GCID地址
              var moviesSetScreenList = resData[i].moviesSetScreenList[1].mp4Gcid;
              // 当前播放续集
              var setNum = resData[i].setNum;
              var likeStatus = resData[i].likeStatus
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
            likeStatus: likeStatus,
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
          //函数执行 调用分享需要的接口
          _this.GetShareParas()
          // 定位滚动条位置
          _this.OnScroll()
        }, 50)

      }
    })
  },
  // 函数定义 通过微剧ID获取微剧的介绍信息（微剧播放页面）
  MicroInfoTitle() {
    let _this = this
    let user_id = _this.data.userInfo.userId
    // 微剧ID
    let movieId = _this.data.movieId;
    // 微剧子集ID
    let setId = _this.data.setId
    let params = {
      userid: user_id,
      productId: movieId,
      setId: setId
    }
    const newparams = Object.assign(params);
    wx.request({
      url: miniProUrl_3,
      data: newparams,
      method: "GET",
      header: {
        'content-type': 'application/json',
        'ticket': _this.data.userInfo.ticket,
        'terminal': 'MINIPROVJ'
      },
      success: res => {
        // 声明返回数据
        let resData = res.data.data
        // 发布者头像
        let headPic = resData.headPic
        // 发布者昵称
        let nickName = "@" + resData.nickName
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
    let user_id = _this.data.userInfo.userId
    // 微剧ID
    let movieId = _this.data.movieId;
    // 微剧子集ID
    let setId = _this.data.setId
    let params = {
      userid: user_id,
      setId: setId
    }
    const newparams = Object.assign(params);
    wx.request({
      url: miniProUrl_4,
      data: newparams,
      method: "GET",
      header: {
        'content-type': 'application/json',
        'ticket': _this.data.userInfo.ticket,
        'terminal': 'MINIPROVJ'
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
      suspend_state: 'display:none',
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
      // 定位滚动条位置
      _this.OnScroll()
    }, 50)
  },
  // 函数定义，去除 HTML标签
  DelHtmlTag(str) {
    return str.replace(/<[^>]+>/g, "");
  },
  // 函数定义 获取视频信息，GCID（此处为请求接口）
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
        'content-type': 'application/josn',
        'ticket': _this.data.userInfo.ticket,
        'terminal': 'MINIPROVJ'
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
    let video_play = _this.data.video_play
    if (video_play > 1) {
      // 创建video实例
      var videoplay = wx.createVideoContext('videoNode')
      // 使视频暂停
      videoplay.pause()
      _this.setData({
        suspend_state: 'display:block',
      })
    }
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
    if (res == undefined) {} else {
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
    }

  },
  // 函数定义 点赞
  likeCountFn() {
    var _this = this
    // 获取点赞状态
    var like_status = _this.data.likeStatus
    var productId = _this.data.movieId
    var setId = _this.data.setId
    if (like_status) {
      var type = 0
      // 函数执行 取消点赞
      _this.doLikeFn(productId, setId, type)
      _this.setData({
        likeStatus: false
      })
    } else {
      var type = 1
      // 函数执行 点赞
      _this.doLikeFn(productId, setId, type)
      _this.setData({
        likeStatus: true
      })
    }
  },
  // 函数定义 点赞或是取消点赞执行
  doLikeFn(productId, setId, type) {
    var _this = this
    let user_id = _this.data.userInfo.userId
    let params = {
      userid: user_id,
      productId: productId,
      setId: setId,
      type: type,
    }
    const newparams = Object.assign(params);
    wx.request({
      url: miniProUrl_6,
      data: newparams,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'ticket': _this.data.userInfo.ticket,
        'terminal':'MINIPROVJ'
      },
      success: res => {
        _this.setData({
          likeCount: res.data.data.likeCount
        })
      }
    })
  },
  // 函数定义 分享需要的信息
  GetShareParas() {
    var _this = this
    let user_id = _this.data.userInfo.userId
    let productId = _this.data.movieId
    let setId = _this.data.setId

    let params = {
      userid: user_id,
      productId: productId,
      setId: setId,
    }
    const newparams = Object.assign(params);
    wx.request({
      url: miniProUrl_7,
      data: newparams,
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'ticket': _this.data.userInfo.ticket,
        'terminal': 'MINIPROVJ'
      },
      success: res => {
        // 分享所需标题
        let share_title = res.data.data.title
        // 分享所需描述
        let share_des = res.data.data.des;
        // 分享所需图片
        let share_img = res.data.data.friendsSharePic
        _this.setData({
          share_des: share_des,
          share_img: share_img
        })
      }
    })
  },
  // 函数定义 定位滚动条位置
  OnScroll() {
    let _this = this
    let deviceWidth = wx.getSystemInfoSync().windowWidth
    console.log(deviceWidth)
    // 当前播放集数
    let set_num = _this.data.setNum
    if (set_num < 8) {
      var scrollLeft = set_num * 0
    } else if (set_num < 10) {
      var scrollLeft = set_num * 45
    } else {
      var scrollLeft = set_num * 48
    }
    // 把数据存入data
    _this.setData({
      scrollLeft: scrollLeft
    })
  },
  // 滑动开始
  touchStart(e) {
    console.log('开始')
    console.log(e)
    let _this = this;
    let touchStartingY = e.touches[0].clientY
    this.setData({
      touchStartingY: touchStartingY
    })
  },
  // 滑动进行
  touchMove(e) {
    console.log('进行')
      console.log(e)
    let _this = this;
    let touchMoveingY = e.touches[0].clientY
    this.setData({
      touchMoveingY: touchMoveingY
    })
  },
  // 滑动结束
  touchEnd(e) {
    console.log('结束')
    console.log(e)
    let _this =this
    // 开始
    let touchStartingY = _this.data.touchStartingY
    // 结束
    let touchMoveingY = _this.data.touchMoveingY
    if (touchStartingY > touchMoveingY){
      console.log('向上')
    }
    if (touchStartingY < touchMoveingY){
      console.log('向下')
    }

  },


  touchEndHandler(e) {
    let touchStartingY = this.data.touchStartingY
    console.log(touchStartingY)
    console.log(e.changedTouches[0].clientY)
    let deltaY = e.changedTouches[0].clientY - touchStartingY
    console.log('deltaY ', deltaY)

    let index = this.data.videoIndex
    console.log(index, 'indexindexindexindex')
    if (deltaY > 100 && index !== 0) {
      // 更早地设置 animationShow
      this.setData({
        animationShow: true
      }, () => {
        console.log('-1 切换')
        this.data.commentList = [] //滑动上一个视频清除评论列表
        this.createAnimation(-1, index).then((res) => {
          console.log(res)
          this.setData({
            animation: this.animation.export(),
            videoIndex: res.index,
            currentTranslateY: res.currentTranslateY,
            percent: 1
          }, () => {
            event.emit('updateVideoIndex', res.index)
          })
        })
      })
    } else if (deltaY < -100 && index !== (this.data.videos.length - 1)) {
      this.setData({
        animationShow: true
      }, () => {
        console.log('+1 切换')
        console.log(index)
        this.data.commentList = [] //滑动下一个视频清除评论列表
        this.createAnimation(1, index).then((res) => {
          this.setData({
            animation: this.animation.export(),
            videoIndex: res.index,
            currentTranslateY: res.currentTranslateY,
            percent: 1
          }, () => {
            event.emit('updateVideoIndex', res.index)
          })
        })
      })
    }
  },

  touchCancel(e) {
    console.log('------touchCancel------')
    console.log(e)
  },
  // 内置函数 生命周期函数--监听页面初次渲染完成
  onReady: function() {
  },
  // 内置函数 生命周期函数--监听页面显示
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

    }, 50)
  },
  // 内置函数 生命周期函数--监听页面隐藏
  onHide: function() {},
  // 内置函数 生命周期函数--监听页面卸载
  onUnload: function() {
  },
  // 内置函数 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function() {
  },
  // 内置函数 页面上拉触底事件的处理函数
  onReachBottom: function() {
    console.log('触底')
  },
  // 内置函数 用户点击右上角分享
  onShareAppMessage: function() {
    // 分享描述
    let share_des = this.data.share_des
    // 分享的图片
    let share_img = this.data.share_img
    // 分享的本剧的微剧集ID
    let movieId = this.data.movieId;
    // 分享的本剧的子集ID
    let setId = this.data.setId;
    // 分享的URL路径
    let path = 'pages/login/login?movieId=' + movieId + "&setId=" + setId
    return {
      title: share_des,
      path: path,
      imageUrl: share_img
    }
  }
})