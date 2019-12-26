
const util = require('../../utils/util.js')
var app = getApp();
Page({
  data: {
    course_id: "",
    openId:'',
    cdPlayImg: 'https://images.hbwlife.com/staticImg/cd-play.png',
    cdPauseImg: 'https://images.hbwlife.com/staticImg/cd-pause.png', 
    fullImg: 'https://images.hbwlife.com/staticImg/cd-full.png', 
    flag: true,
    modalHidden: true,
    restartPlan: [],
    tabHeader: 0,
    tabLine: 'translate3d(0,0,0)',
    tabContent: 'translate3d(0,0,0)',
    tabHeight: 0,
    tabContentId: '#cd-tabExpirse',
    restartHeight: '105rpx',
    cdLliveTxtHeight: 0,
    cdLiveTimeHeight: 0,
    showCourseData: {},
    showExpertData: {},
    dataId: 'cdDown',
    courseId: '',
    videoSrc: '',
    playDisplay: 'none',
    fullScreenFlag: false,
    orientation: 'vertical',
    lW: '100rpx',
    lH: '100rpx',
    wW: '100%',
    wH: '422rpx',
    courseName:"",
    coursePrice: 0,
    price_discounted:0,
    duration:0,   //课程时长
    payDisplay: 'none',
    showPaln: true,
    expert_id: '',
    liveTime: '',
    systemInfo: {},
    noLoginShowModal: false,     //没有昵称的弹窗组件
    daojishiCount:"",            //倒计时的数字
    showDaojishi: false,          //倒计时显示与否
    iosSystem: false,
    timer:"",
    showRegDialog: false  //点击完授权按钮，弹窗
    // oderStateTips:""
    
  },
  /** 显示弹窗*/
  buttonTap: function() {
    this.setData({
      modalHidden: false
    })
  },

  /*** 点击取消*/
  modalCandel: function() {
    // do something
    this.setData({
      modalHidden: true
    })
  },

  /***  点击确认*/
  modalConfirm: function() {
    // do something
    this.setData({
      modalHidden: true
    })
  },
  
  /*** 生命周期函数--监听页面初次渲染完成*/
  onReady: function() {
    this.ctx = wx.createLivePlayerContext('player')
  },
  /*** 生命周期函数--监听页面显示*/
  onShow: function () {
    //初始页面的数据
    //this.initSystem();
    this.showCourseData();  //初始课程专家信息
    this.checkPayed();      //反查有没有支付过
    this.restartPlay();    //初始重播计划
    this.videoPlay();    //获取视频src
    this.tabHeight();
    this.ininTab();
    this.initSystem()
  }, 
  onLoad: function(options) {
    //获取改页面url参数的course_id，课程id
    this.setData({
      course_id: options.courseId ? options.courseId:"",
      expert_id: options.expertId ? options.expertId : "",
      coursePrice: options.price
    }) 
    console.log(options)
    this.showCourseData(options);  //初始课程专家信息
    this.checkPayed(options);      //反查有没有支付过
    this.restartPlay(options);    //初始重播计划
    this.videoPlay(options);    //获取视频src
    this.tabHeight(options);
    this.ininTab(options);
    this.initSystem(options)
  },
 
  
  onLaunch: function() {
    
  },
  //反查该课程有没有支付
  checkPayed() {
    var self = this;
    var apiUrl = "/wxapp/user/consume/order/get";
    var postData = {
      "course_id": self.data.course_id,
      "userId": wx.getStorageSync("openId")
    };
    var doSuccess = function (data) {
      console.log(data)
      if (data.data.code == 0) {
        console.log("已经支付")
        self.setData({
          payDisplay: "none",
          flag: false
        })
      } else if (data.data.code == -56534) {
        console.log("未购买课程")
        self.setData({
          payDisplay: "block",
          flag: true
        })
       
      } else if (data.data.code == -56001){
        wx.showToast({
          title: '请先登录',
          icon: 'none'
        })
        self.setData({
          payDisplay: "block",
          flag: true
        })
      }else{
        self.setData({
          payDisplay: "block",
          flag: false
        })
      }
    }
    var doFail = function () {

    }
    //调用
    util.requestPost(apiUrl, postData, doSuccess, doFail)
  },

  
  //去确认订单页
  goSubmitOrder(){
    //console.log(this.data.course_id, this.data.expert_id, this.data.coursePrice)
    var expertId = this.data.expert_id
    var courseId = this.data.course_id
    var price = this.data.coursePrice
    //判断登录否、去安卓 or ios 详情页
    //var openId = wx.getStorageSync('openId');
    if (app.globalData.isMember) {
      //console.log(111)
      //判断去订单页ios 还是安卓页
      initSystem();
      function initSystem() {
        var _this = this
        wx.getSystemInfo({
          success: function (res) {
            if (res.platform == "android") {
              wx.navigateTo({
                url: `../submitOrder/submitOrder?courseId=${courseId}&expertId=${expertId}&price=${price}`
              })
            } else if (res.platform == "ios") {
              wx.navigateTo({
                url: `../submitOrderIos/submitOrderIos?courseId=${courseId}&expertId=${expertId}&price=${price}`
              })
            } else {
              wx.navigateTo({
                url: `../submitOrder/submitOrder?courseId=${courseId}&expertId=${expertId}&price=${price}`
               //url: `../submitOrderIos/submitOrderIos?courseId=${courseId}&expertId=${expertId}&price=${price}`
              })
            }
          }
        })
      }
     
    }else{
       //没有昵称的弹窗组件
      this.setData({
        noLoginShowModal: true
      })
    }    
  },
  //点击获取头像按钮
  bindGetUserInfo(e) {
    //wx.setStorageSync('userInfo', e.detail.userInfo)
    var self = this;
    console.log(e)
    self.setData({
      nickName: e.detail.userInfo.nickName,
      avatar_url: e.detail.userInfo.avatarUrl
    })
    if (e.detail.userInfo) {
      wx.request({
        url: 'https://api.hbwlife.com/wxapp/wxaccess/user/getUserInfo',
        method: 'post',
        header: {
          "AUTH_TOKEN": app.globalData.auth_token
        },
        data: {
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData,
          openid: wx.getStorageSync('openId')
        },
        success: function (data) {
          console.log(data)
          if (data.data.code == 0) {
            console.log(data)
            console.log(data.data.data.openid)
            wx.setStorageSync('openId', data.data.data.openid);
            app.globalData.nickName = data.data.data.nickName
            app.globalData.avatar_url = data.data.data.avatar_url
            app.globalData.openId = data.data.data.openid
            app.globalData.isMember = true

            self.setData({
              noLoginShowModal: false,
              showRegDialog: true
            })
           
          } else {
            app.globalData.isMember = false
            wx.showToast({
              title: "注册登录失败，请重新操作",
              icon: 'none',
              duration: 2000
            });
          }
        },
        fail: function () {
          app.globalData.isMember = false
          console.log("注册登录失败，请重新操作")
          wx.showToast({
            title: "注册登录失败，请重新操作",
            icon: 'none',
            duration: 2000
          });
        }
      })
    } else {
      app.globalData.isMember = false
      wx.showToast({
        title: "只有注册登录后才能充值~",
        icon: 'none',
        duration: 2000
      });
    }
  },
 
  // 没有授权的时候弹窗,关闭取消按钮
  iosCloseDialog: function () {
    this.setData({
      noLoginShowModal: false
    })
  },
  
  //初始化tab高度
  tabHeight() {
    var self = this;
    var id = this.data.tabContentId;
    var query = wx.createSelectorQuery();
    query.select(id).boundingClientRect(function(rect) {
      self.setData({
        tabHeight: rect.height + 30
      })
    }).exec();
  },


  //点击live-player蒙层，播放暂停按钮
  cdPause() {
    var playDisplay = this.data.playDisplay;
    if (playDisplay == 'none') {
      this.setData({
        playDisplay: 'block'
      })
    } else {
      this.setData({
        playDisplay: 'none'
      })
    }
  },
  //全屏
  bindFull() {
    var that = this;
    //全屏
    var vidoHeight = wx.getSystemInfoSync().windowHeight;
    var vidoWidth = wx.getSystemInfoSync().windowWidth;
    var fullScreenFlag = that.data.fullScreenFlag;
    if (fullScreenFlag) {
      fullScreenFlag = false;
    } else {
      fullScreenFlag = true;
    }
    if (fullScreenFlag) {
      //全屏
      this.ctx.requestFullScreen({
        success: res => {
          that.setData({
            fullScreenFlag: fullScreenFlag,
            orientation: 'horizontal',
            lW: vidoWidth + 'px',
            lH: vidoHeight + 100 + 'px',
            wW: vidoWidth + 'px',
            wH: vidoHeight + 'px',
            cdPlayImg: 'https://images.hbwlife.com/staticImg/cd-play1.png',
            cdPauseImg: 'https://images.hbwlife.com/staticImg/cd-pause1.png',
            fullImg: 'https://images.hbwlife.com/staticImg/exit-full.png'
          });
        },
        fail: res => {
          console.log('fullscreen fail');
        }
      });

    } else {
      //缩小
      this.ctx.exitFullScreen({
        success: res => {
          console.log('fullscreen success');
          that.setData({
            fullScreenFlag: fullScreenFlag,
            orientation: 'vertical',
            lW: '100rpx',
            lH: '100rpx',
            wW: '100%',
            wH: '400rpx',
            cdPlayImg: 'https://images.hbwlife.com/staticImg/cd-play.png',
            cdPauseImg: 'https://images.hbwlife.com/staticImg/cd-pause.png',
            fullImg: 'https://images.hbwlife.com/staticImg/cd-full.png'
          });
        },
        fail: res => {
          console.log('exit fullscreen success');
        }
      });
    }
  },
  //全屏2
  fullScreen(e) {
    var isFull = e.detail.fullScreen;
    if (isFull == false) {
      console.log(this.ctx)
      this.setData({
        fullScreenFlag: false,
        orientation: 'vertical',
        lW: '100rpx',
        lH: '100rpx',
        wW: '100%',
        wH: '400rpx',
        cdPlayImg: 'https://images.hbwlife.com/staticImg/cd-play.png',
        cdPauseImg: 'https://images.hbwlife.com/staticImg/cd-pause.png',
        fullImg: 'https://images.hbwlife.com/staticImg/cd-full.png'
      });
    }
  },
  //点击播放按钮
  bindPlay() {
    var _this = this;
    var apiUrl = "/wxapp/common/course/info";
    var postData = {
      "course_id": this.data.course_id,
      "userId": wx.getStorageSync("openId")
    };
    var doSuccess = function (data) {
      console.log(data)
      var _showCourseData = data.data.data
      var expert_id = _showCourseData.expert_id
      _this.setData({
        showCourseData: _showCourseData,
        coursePrice: util.moneyTransform(_showCourseData.price_once)
      })
      //播放
      _this.setData({
        payDisplay: "none"
      })
      var flag = _this.data.flag;
      _this.ctx.play({
        success: res => {
          _this.setData({
            flag: !flag,
          })
        },
        fail: res => {
          _this.setData({
            flag: !flag,
          })
        }
      })
      setTimeout(() => {
        _this.setData({
          playDisplay: 'none'
        })
      }, 1500)
    }
    var doFail = function () {
      wx.showToast({
        title: '播放失败',
        icon: 'none'
      })
    }
    //调用
    util.requestPost(apiUrl, postData, doSuccess, doFail)
  },
 

  //点击暂停按钮
  bindPause(e) {
    var flag = this.data.flag;
    this.ctx.pause({
      success: res => {
        this.setData({
          flag: !flag,
        })
      },
      fail: res => {
        this.setData({
          flag: !flag,
        })
      }
    })
    setTimeout(() => {
      this.setData({
        playDisplay: 'none'
      })
    }, 1500)
  },

  //切换
  statechange(e) {
    wx.showToast({
      title: e.detail.code,
      icon: 'fail',
      duration: 2000
    })
  },

  //改变重播计划高度
  changeRestartHeight(e) {
    var dataId = this.data.dataId;
    var showPlan = this.data.showPaln;
    if (dataId == 'cdDown') {
      var self = this;
      var query = wx.createSelectorQuery();
      var id0 = '#cd-liveTxt';
      var id1 = '#cd-liveTime';
      query.select(id0).boundingClientRect(function(rect) {
        self.setData({
          cdLliveTxtHeight: rect.height,
          dataId: 'cdUp'
        })
      }).exec();
      if (showPlan == true) {
        query.select(id1).boundingClientRect(function(rect) {
          self.setData({
            cdLliveTimeHeight: rect.height
          }, function() {
            self.setData({
              restartHeight: self.data.cdLliveTxtHeight + self.data.cdLliveTimeHeight + 20 + 'px',
            })
          })
        }).exec();
      } else {
        self.setData({
          restartHeight: 90 + 'px',
        })
      }

    } else if (dataId == 'cdUp') {
      this.setData({
        restartHeight: '105rpx',
        dataId: 'cdDown'
      })
    }
  },
  initSystem() {
   
    var _this = this
    wx.getSystemInfo({
      success: function (res) {
        if (res.platform == "android") {
          _this.setData({
            iosSystem: false
          })
        } else if (res.platform == "ios") {
          _this.setData({
            iosSystem: true
          })
        } else {
          _this.setData({
            iosSystem: false
          })
        }
      }
    })
  },
  timeFormat(differTime) {
    var h = Math.floor(differTime / 1000 / 60 / 60);
    var m = Math.floor(differTime / 1000 / 60 % 60);
    var s = Math.floor(differTime / 1000 % 60);
    var h = h < 10 ? ("0" + h) : h;
    var m = m < 10 ? ("0" + m) : m;
    var s = s < 10 ? ("0" + s) : s;
    return h + ":" + m + ":" + s;
  },
  // 重播时间表
  restartPlay() {
    var _this = this;
    var apiUrl = "/wxapp/common/course/show/list";
    var postData = {
      "course_id": this.data.course_id
    };
    var doSuccess = function (data) {
      console.log(data)
      if (data.data.code == 0) {
        var _restartPlan = data.data.data.shows
        if (_restartPlan.length == 0) {
          _this.setData({
            showPaln: false
          })
        }
        else {
          _this.setData({
            restartPlan: _restartPlan,
            liveTime: _restartPlan[0].show_time
            // liveTime: _restartPlan[_restartPlan.length - 1].show_time
          })
          //倒计时
          _this.daojishi(_restartPlan)
        }

      } else {
        wx.showToast({
          title: '重播计划加载失败',
          icon: 'none'
        })
        _this.setData({
          showPaln: false
        })
      }
    }
    var doFail = function () {

    }
    //调用
    util.requestPost(apiUrl, postData, doSuccess, doFail)
  },
  //倒计时
  daojishi(_restartPlan){
    var self = this
    clearInterval(self.data.timer);
    // 当前时间戳
    var timestamp = Date.parse(new Date());
    console.log("当前时间戳为：" + timestamp);

    //该课程的时间戳
    //console.log(_restartPlan)
   // var courseTimestamp = _restartPlan[0].show_time_ts
    var courseTime = _restartPlan[0].show_time
    var courseTimestamp;
    //安卓  ios
    if (_restartPlan.length > 0) {
      if (self.data.iosSystem == false) {
        console.log("安卓")
        courseTimestamp = new Date(courseTime).getTime();
      } else if (self.data.iosSystem == true) {
        console.log("ios")
        courseTimestamp = new Date(courseTime.replace(/-/g, '/')).getTime();
      }
    }
    
    //var courseTimestamp = 1573535163 * 1000
    //console.log("课程时间戳为：" + courseTimestamp)

    //相减的时间戳
    var disTimestamp = (courseTimestamp - timestamp) / 1000
    // console.log("相差时间戳为：" + disTimestamp)
    self.data.timer = setInterval(function () {
      var showDisTimestamp = disTimestamp--
      // console.log(showDisTimestamp)
        if (showDisTimestamp <= 120 && showDisTimestamp >= 0) {
          self.setData({
            showDaojishi: true,
            daojishiCount: self.data.iosSystem ? self.timeFormat(showDisTimestamp * 1000) : showDisTimestamp
          })

        }
        if (showDisTimestamp <= 0) {
          self.videoPlay()
          self.setData({
            showDaojishi: false
          })
          clearInterval(self.data.timer);
          //timer = null;
        }
    }.bind(self), 1000)
  
  },
  //页面隐藏
  onHide: function () {
    var self = this
    console.log('页面走了onHide');
    clearInterval(self.data.timer)
  },
  //页面离开
  onUnload: function () {
    var self = this
    console.log('页面走了onUnload');
    clearInterval(self.data.timer)
  },
  //tab切换
  cdTabHeader(e) {
    var self = this;
    var query = wx.createSelectorQuery();
    this.setData({
      tab: e.currentTarget.dataset.item
    }, function() {
      if (this.data.tab == 0) {
        self.setData({
          tabLine: 'translate3d(0,0,0)',
          tabContent: 'translate3d(0,0,0)',
          tabContentId: "#cd-tabExpirse"
        })
        var id = this.data.tabContentId;
        query.select(id).boundingClientRect(function(rect) {
          self.setData({
            tabHeight: rect.height + 60
          })
        }).exec();
      } else {
        self.setData({
          tabLine: 'translate3d(100%,0,0)',
          tabContent: 'translate3d(-50%,0,0)',
          tabContentId: "#cd-tabCourse"
        })
        var id = this.data.tabContentId;
        query.select(id).boundingClientRect(function(rect) {
          self.setData({
            tabHeight: rect.height + 60
          })
        }).exec();
      }
    })
  },
  //初始化tab高度
  ininTab() {
    var id = '#cd-tabExpirse';
    var self = this;
    var query = wx.createSelectorQuery();
    query.select(id).boundingClientRect(function (rect) {
      self.setData({
        tabHeight: rect.height + 60
      })
    }).exec();
  },
  
  //课程信息与专家信息展示
  showCourseData: function(options) {
    //为了分享的打开
    var openId = '';
    var courseId = '';
    if (wx.getStorageSync("openId")){
      openId = wx.getStorageSync("openId")
    }
    else{
      openId = options.openId
      this.setData({
        openId: openId
      })
    }

    if (this.data.course_id != '') {
      courseId = this.data.course_id
    }
    else {
      courseId = options.course_id
      this.setData({
        course_id:courseId
      })
    }

    var _this = this;
    wx.request({
      url: 'https://api.hbwlife.com/wxapp/common/course/info',
      data: {
        "course_id": courseId,
        "userId": openId
      },
      method: 'post',
      success: function(data) {
        var _showCourseData = data.data.data
        var expert_id = _showCourseData.expert_id
        var course_name = _showCourseData.name
        var created_time = _showCourseData.created_time
        var duration = _showCourseData.duration
       
        _this.setData({
          showCourseData: _showCourseData,
          coursePrice: _showCourseData.price_once,
          price_discounted: _showCourseData.price_discounted,
          expert_id: expert_id,
          courseName: course_name,
          duration: util.formatSeconds(_showCourseData.duration / 1000)
        })
        
        //根据专家id 获取专家的expert_id
        wx.request({
          url: 'https://api.hbwlife.com/wxapp/common/expert/info',
          data: {
            "expert_id": _this.data.showCourseData.expert_id,
          },
          method: 'post',
          success: function(data) {
            console.log(data)
            if (data.data.code == 0) {
              var _showExpertData = data.data.data
              _this.setData({
                showExpertData: _showExpertData,
              })
              _this.ininTab();
            } else {
              wx.showToast({
                title: '专家信息加载失败',
                icon: 'none'
              })
            }
          }
        })

      }
    })
  },
  
  //视频src
  videoPlay() {
    var courseId = this.data.course_id;
    var _this = this;
    wx.showLoading({
      title: '加载中',
    })
    var apiUrl = "/wxapp/user/course/show/url";
    var postData = {
      "userId": wx.getStorageSync('openId'),
      "course_id": courseId
    };
    var doSuccess = function (data) {
      console.log(data)
      if (data.data.code == '0') {
        _this.setData({
          videoSrc: data.data.data.show_url
        })
        console.log(_this.data.videoSrc)
        
      }
      wx.hideLoading();
        // if (data.data.code == '0'){
        //   _this.setData({
        //      videoSrc: data.data.data.show_url
        //    })
        // }else if (data.data.code == '-56532') {
        //   console.log(data.data.code + "已支付，未播放")
        // }else if (data.data.code == '-56534') {
        //   console.log(data.data.code +"暂未支付")
        // } else if (data.data.code == '-56001') {
        //   wx.showToast({
        //     title: `您还没有登录,请先登录1`,
        //     icon: 'none',
        //     duration: 2000
        //   })
        // }else{
        //   console.log("其他提示")
        //   //_this.initSystem(false)   //ios
        //   wx.showToast({
        //     title: `其他error:${data.data.code}`,
        //     icon: 'none',
        //     duration: 2000
        //   })
        // }
    }
    var doFail = function () {
      console.log(err)
      wx.showToast({
        title: '该课程暂未支付',
        icon: 'none'
      })
    }
    //调用
    util.requestPost(apiUrl, postData, doSuccess, doFail)
  },
 
  share(){
    this.onShareAppMessage()
  },
  onShareAppMessage() {
    var openId = wx.getStorageSync('openId');
    var course_id = this.data.course_id;
    var expert_id = this.data.expert_id;
    return {
      title: '汉邦智慧给每一个人带来智慧健康的生活!',
      desc: '汉邦智慧',
      path: '/pages/courseDetail/courseDetail?openId=' + openId + '&course_id=' + course_id + '&expert_id=' + expert_id,
      //imageUrl: 'https://images.hbwlife.com/staticImg/share.jpg',
      success:function(res){
        wx.showModal({
          title: '',
          content: JSON.stringify(res),
        })
      }
    }
  },
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.showCourseData(); 
    this.checkPayed();
    this.restartPlay();    
    this.videoPlay();    
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 100);
  },
  // 点击数字水印
  goWaterMark: function(){
    wx.navigateTo({
      url: '/pages/waterMark/waterMark'
    })
  },
  //点击课程留言
  goFeedBackCourse:function(){
    var expertId = this.data.expert_id
    var courseId = this.data.course_id
    console.log(expertId, courseId)
    wx.navigateTo({
      url: `/pages/feedBackCourse/feedBackCourse?courseId=${courseId}&expertId=${expertId}`
    })
  },
  /* 点击完授权按钮，新用户专享弹窗  */
  showRegDialog: function () {
    console.log(this.data.showRegDialog)
    this.setData({
      showRegDialog: false
    })
  },
  

  


})