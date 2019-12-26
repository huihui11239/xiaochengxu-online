//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    banners: [
      {
        id: 1,
        img: 'https://images.hbwlife.com/course/CUR20191016122841_750x270.jpg',
        name: ''
      },
      {
        id: 2,
        img: 'https://images.hbwlife.com/course/CUR20191016122841_750x270.jpg',
        name: ''
      },
      {
        id: 3,
        img: 'https://images.hbwlife.com/course/CUR20191016122841_750x270.jpg',
        name: ''
      },
      {
        id: 4,
        img: 'https://images.hbwlife.com/course/CUR20191016122841_750x270.jpg',
        name: ''
      }
    ],
    autoplay: true,//是否自动切换
    indicatorDots: true,//是否显示圆点
    interval: 5000,//自动切换间隔
    duration: 500, //滑动动画时长
    indicatorColor: "#676a6d",//滑动圆点颜色
    indicatorActiveColor: "#0ac167", //当前圆点颜色
    current: 0, //当前所在页面的 index
    circular: true,  //是否采用衔接滑动
    authToken: '',
    loginFlag: app.globalData.loginFlag,
    curWrapShow: true,
    willWrapShow: true,
    bannerImgs: [],
    willshowData: [],
    curImgUrls: [],
    historyJson: [],
    showNoData: false,
    haveWillShow:false,
    page:1,
    isShow:true,
    increaseCount:2,
    reachBottom:false,
    showPayed:true,      //是否已经支付,待接口返回，再改成false
    iosSystem:false,
    willDataAllShow:false   //底部查看全部，等数据加载出来再显示
     // daojishiCount: "",     //倒计时秒数
    // showDaojishi: false,   //显示倒计时
    // longTimer: "",
    // timer:''

  },
  onLoad() {
    
  },
  onShow() {
    var self = this;
    setTimeout(function(){
      self.initBanner();    //banner
      self.initShowing();   //正在播放
      self.initWillshow();  //即将播放
    },200)

    // if (app.checkSession_key){
    //   console.log(1)
    //   self.initBanner();    //banner
    //   self.initShowing();   //正在播放
    //   self.initWillshow();  //即将播放
    // }else{
    //   app.callback()
    // }  
  },

  onShareAppMessage() {
    return {
      title: '汉邦智慧给每一个人带来智慧健康的生活!',
      desc: '汉邦智慧',
      path: '/pages/home/home?openid=' + wx.getStorageSync('openId'),
      imageUrl: 'https://images.hbwlife.com/staticImg/share.jpg',
    }
  },
  swiperClick: function (e) {//点击图片触发事件
    console.log(e)
     var swiperId = this.data.banners[e.target.dataset.id].id;
    var userId = wx.getStorageSync("openId")
    var isMember = app.globalData.isMember
    var token = app.globalData.auth_token
    console.log(swiperId)
   
    wx.navigateTo({
      url: `../activity/activity?swiperId=${swiperId}&userId=${userId}&token=${token}&isMember=${isMember}`
    })
  },
   //点击，正在播放
  curGoCourse(e) {
    //console.log(e)
    var courseId = e.currentTarget.dataset.courseid;
    var expertId = e.currentTarget.dataset.expertid;
    var price = e.currentTarget.dataset.price;
    var liveTime = e.currentTarget.dataset.showtime;
    wx.navigateTo({
      url: `../courseDetail/courseDetail?courseId=${courseId}&expertId=${expertId}&price=${price}&liveTime=${liveTime}`
    })
  },
  //点击，即将播放
  hisGoCourse(e) {
    //console.log(e)
    var courseId = e.currentTarget.dataset.courseid;
    var expertId = e.currentTarget.dataset.expertid;
    var price = e.currentTarget.dataset.price;
    var liveTime = e.currentTarget.dataset.showtime;
    wx.navigateTo({
      url: `../courseDetail/courseDetail?courseId=${courseId}&expertId=${expertId}&price=${price}&liveTime=${liveTime}`
    })
  },
  //点击即将播放，查看全部
  goWillLiveMore() {
    wx.navigateTo({
      url: `../willLive/willLive`
    })
  },
  //如果没有数据重新刷新
  showNoData() {
    this.setData({
      showNoData: true
    })
  },
  
  //banner
  initBanner() {
    var self = this;
    var apiUrl = "/wxapp/common/banner/image/list";
    var postData = {
      count: 4
    };
    var doSuccess = function (data) {
      console.log(data)
      var _bannerImgs = data.data.data.images;
      self.setData({
        bannerImgs: _bannerImgs
      })
    }
    var doFail = function (data) {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
    //调用
    util.requestPost(apiUrl, postData, doSuccess, doFail)
  },

  //正在直播
  initShowing() {
    var self = this;
    var _userId = app.globalData.isMember ? wx.getStorageSync("openId") : '';
    wx.showLoading({
      title: '加载中'
    })
    var apiUrl = "/wxapp/common/course/list/showing";
    var postData = {
      count: 20,
      "userId": _userId
    };
    var doSuccess = function (data) {
      console.log(data)
      wx.hideLoading();
      if (data.data.data.shows.length == 0) {
        self.setData({
          curWrapShow: false
        })
      } else {
        var _showListData = data.data.data.shows;
        self.setData({
          curWrapShow: true,
          curImgUrls: _showListData
        })
      }
    }
    var doFail = function () {
     console.log("加载失败")
    }
    //调用
    util.requestPost(apiUrl, postData, doSuccess, doFail)
  },
  // 请求倒计时 10s一次
  // requestTime() {
  //   var self = this;
  //   clearInterval(timer)
  //   timer = null
  //   var timer = setInterval(function(){
  //     self.initWillshow()
  //   },15000)
  //   self.setData({
  //     longTimer : timer
  //   })  
  // },

  //即将播放
  initWillshow() {
      var self = this;
      var _userId = app.globalData.isMember ? wx.getStorageSync("openId") : ''
      var apiUrl = "/wxapp/common/course/list/willshow/bycourse";
      var postData = {
        count: 10,
        "userId": _userId
      };
      var doSuccess = function (data) {
        console.log(app.globalData.isMember, wx.getStorageSync("openId"))
        var _willshowData = data.data.data.courses;
        if (_willshowData.length == 0) {
          self.setData({
            haveWillShow: false
          })
        } else {
          self.setData({
            haveWillShow: true,
            willshowData: _willshowData,
            willDataAllShow:true
          })
        }
      }
      var doFail = function (data) {
        console.log("加载失败")
      }
      //调用
      util.requestPost(apiUrl, postData, doSuccess, doFail)
  },
  //倒计时
  // daojishiFn(willshowData) {
  //   var self = this
  //   clearInterval(self.data.shortTimer)
  //   self.data.shortTimer=null;
    
  //   // 当前时间戳
  //   var timestamp = Date.parse(new Date());
  //   // 最近课程的时间戳
  //   if (willshowData.length > 0) {
  //     var latelyTime = willshowData[0].shows[0]
  //     var latelyTimestamp;
  //     //安卓  ios
  //     if(self.data.iosSystem == false){
  //       //console.log("安卓")
  //       latelyTimestamp = new Date(latelyTime).getTime();
  //     } else if (self.data.iosSystem == true){
  //       //console.log("ios")
  //       latelyTimestamp = new Date(latelyTime.replace(/-/g, '/')).getTime();
  //     }
  //   }
  //   //var latelyTimestamp = 1573535163 * 1000
  //   //console.log("最近课程时间戳" + latelyTimestamp)

  //   //相减的时间戳
  //   var disTimestamp = (latelyTimestamp - timestamp) / 1000
  //   //console.log("相减的时间戳" + disTimestamp)
  //   //定时器
  //   self.data.shortTimer = setInterval(function () {
  //     var showDisTimestamp = disTimestamp--
  //     console.log("相减的时间戳" + showDisTimestamp)
  //     if (showDisTimestamp <= 120 && showDisTimestamp >= 0) {
  //       self.setData({
  //         showDaojishi: true,
  //         daojishiCount: self.data.iosSystem ? self.timeFormat(showDisTimestamp * 1000):showDisTimestamp
  //       })
        
  //       if (showDisTimestamp == 0) {
  //         self.setData({
  //           showDaojishi: false
  //         })
  //         //timer = null;
  //         clearInterval(self.data.shortTimer);
  //        //clearInterval(this.data.longTimer);
         
  //         self.initShowing()           //正在播放  
  //         //self.initWillshow();          //即将播放
  //         self.requestTime(); 
  //         self.willshowDaojishi()   //即将播放倒计时函数
  //       }
  //     }
  //     if (showDisTimestamp < 0) {
  //       clearInterval(self.data.shortTimer);
  //     }

  //   }.bind(self), 1000)
  // },

  //即将播放倒计时函数
  // willshowDaojishi() {
  //   var self = this;
  //   var openid = wx.getStorageSync("openId")
  //   var _userId = app.globalData.isMember ? wx.getStorageSync("openId") : ''
  //   var postData = {
  //     count: 100,
  //     "userId": _userId
  //   };
  //   wx.request({
  //     url: "https://api.hbwlife.com/wxapp/common/course/list/willshow/bycourse",
  //     header: {
  //       "AUTH_TOKEN": openid + "|" + app.globalData.auth_token
  //     },
  //     method:'post',
  //     data:postData,
  //     success:function(data){
  //       console.log(data)
  //       if (data.code == "-56506") {
  //         wx.request({
  //           url: 'https://api.hbwlife.com/wxapp/wxaccess/user/login',
  //           method: 'post',
  //           data: {
  //             "openid": wx.getStorageSync('openId')
  //           },
  //           success: function (data) {
  //             app.globalData.auth_token = data.data.data.auth_token
  //             app.globalData.openId = data.data.data.openid
  //           }
  //         })
  //       }
  //       else{
  //        var _willshowData = data.data.data.courses;
  //        if (_willshowData.length == 0) {
  //          self.setData({
  //            haveWillShow: false
  //         })
  //        } else {
  //         self.setData({
  //            haveWillShow: true,
  //            willshowData: _willshowData
  //          })
  //        }
  //       }
  //     },
  //     error:function(err){
  //       console.log("加载失败")
  //     }
  //   })
  // },
  //页面隐藏
  // onHide: function () {
  //   var self = this
  //   console.log('页面走了onHide');
  // },
  //页面离开
  // onUnload: function () {
  //   var self = this
  //   console.log('页面走了onUnload');
  // },
  // 下拉刷新
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.initBanner();
    this.initShowing();
    this.initWillshow();
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 100);
  }




  
})






