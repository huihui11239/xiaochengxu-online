//logs.js
const util = require('../../utils/util.js')
var app=getApp();
Page({
  data: {
    auth_token: "",
    nickName: "",
    avatar_url: "",
    myloginBtn:'none',
    openId: wx.getStorageSync('openId'),
    buyCount:0,
    collectionCount:0,
    login:false,    //对授权按钮的判断
    integral: 0,
    balance:0,
    noLoginShowModal: false,   //如果登录了，弹窗不显示
    showRegDialog: false  //点击完授权按钮，弹窗

  },
  onLoad: function (options) {
    
    
  },
  onShow:function(){ 
    if (app.globalData.isMember){
      //console.log(111)
      this.setData({
        nickName: app.globalData.nickName,
        avatar_url: app.globalData.avatar_url,
        login: false,
        noLoginShowModal: false
      })
      //我的金币
      this.showBalance();
      //我的积分
      this.showIntegral()
    }else{
      //console.log(222)
      this.setData({
        login: true,
        noLoginShowModal: true
      })
    }

  },  
  //点击，注册登录按钮
  bindGetUserInfo(e) {
    var self = this;
    console.log(e)
    if (e.detail.userInfo) {
      app.globalData.nickName = e.detail.userInfo.nickName
      self.setData({
        nickName: e.detail.userInfo.nickName,
        avatar_url: e.detail.userInfo.avatarUrl,
        login: false
      })
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
            app.globalData.openId = data.data.data.openid
            if (data.data.data.nickName){
              app.globalData.nickName = data.data.data.nickName
              app.globalData.avatar_url = data.data.data.avatar_url
              app.globalData.isMember = true
            }
           
            self.setData({
              showRegDialog: true,
              login: false,
              noLoginShowModal: false
            })
           
            //我的金币
            self.showBalance();
            //我的积分
            self.showIntegral()

            const pages = getCurrentPages()
            const perpage = pages[pages.length - 1]
            perpage.onLoad() 
          } else {
            app.globalData.isMember = false
            wx.showToast({
              title: "注册登录失败，请重新操作",
              icon: 'none',
              duration: 2000
            });
          }
        },
        fail:function(){
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
      self.globalData.isMember = false
      wx.showToast({
        title: "只有注册登录后才能充值~",
        icon: 'none',
        duration: 2000
      });

    }
  },
 
  //显示，我的金币数
  showBalance(){
    var that = this;
    var apiUrl = "/wxapp/user/fund/get";
    var postData = {
        "userId": wx.getStorageSync('openId')
      };
    var doSuccess = function (data){
      console.log(data)
      var _balance = data.data.data.fund;
      that.setData({
        balance: _balance
      });
    }
    var doFail = function (err) {
      console.log(err)
    }

    util.requestPost(apiUrl, postData, doSuccess, doFail)
  },

  
  //显示，积分总数
  showIntegral() {
    var that = this;
    var apiUrl = "/wxapp/user/score/get";
    var postData = {
      "userId": wx.getStorageSync('openId')
    };
    var doSuccess = function (data) {
      console.log(data)
      var _integral = data.data.data.score;
      that.setData({
        integral: _integral
      });
    }
    var doFail = function (err) {
      console.log(err)
    }

    util.requestPost(apiUrl, postData, doSuccess, doFail)
  },

  //点击，签到有礼
  goSign(){
    if (!app.globalData.isMember) {
      wx.showToast({
        title: "为了您更好的体验,请先注册登录",
        icon: 'none',
        duration: 2000
      });
    }else{
      //等做完再解开
      // wx.navigateTo({
      //   url: `../dialog/dialog`
      // })
      wx.navigateTo({
        url: `../integral/integral`
      })
    }
    
  },
  initSystem: function () {
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
  },
   //点击，我的金币
  goRecharge(){
    if (!app.globalData.isMember) {
      wx.showToast({
        title: "为了您更好的体验,请先注册登录",
        icon: 'none',
        duration: 2000
      });
    }else{
      wx.getSystemInfo({
        success: function (res) {
          if (res.platform == "android") {
            wx.navigateTo({
              url: `../recharge/recharge`
            })
          } else if (res.platform == "ios") {
            // wx.navigateTo({
            //   url: `../recharge/recharge`
            // })
            return
          } else {
            wx.navigateTo({
              url: `../recharge/recharge`
            })
          }
        }
      })  
    }
  },
  //点击，我的积分
  goIntegral() {
    if (!app.globalData.isMember) {
      wx.showToast({
        title: "为了您更好的体验,请先注册登录",
        icon: 'none',
        duration: 2000
      });
    } else {
      wx.navigateTo({
        url: `../integral/integral`
      })
    }
  },
  //点击，收藏的课程
  gocollectCourse() {
    if (!app.globalData.isMember) {
      wx.showToast({
        title: "为了您更好的体验,请先注册登录",
        icon: 'none',
        duration: 2000
      });
    } else {
      console.log(222) 
      wx.navigateTo({
        url: `../collectCourse/collectCourse`
      })
    }
  },
  //点击，收藏的专家
  gocollectExpert() {
    if (!app.globalData.isMember) {
      wx.showToast({
        title: "为了您更好的体验,请先注册登录",
        icon: 'none',
        duration: 2000
      });
    } else {
      wx.navigateTo({
        url: `../collectExpert/collectExpert`
      })
    }

  }, 
   //点击，收藏的专题
  gocollectSpecial() {
    if(!app.globalData.isMember) {
      wx.showToast({
        title: "为了您更好的体验,请先注册登录",
        icon: 'none',
        duration: 2000
      });
    } else {
      wx.navigateTo({
        url: `../collectSpecial/collectSpecial`
      })
    }
  }, 
  //点击，我购买的课程
  gopayedCourseList() {
    if (!app.globalData.isMember) {
      wx.showToast({
        title: "为了您更好的体验,请先注册登录",
        icon: 'none',
        duration: 2000
      });
    } else {
      wx.navigateTo({
        url: `../payedCourseList/payedCourseList`
      })
    }
  },
  //点击，我购买的专题
  gopayedSpecial() {
    if (!app.globalData.isMember) {
      wx.showToast({
        title: "为了您更好的体验,请先注册登录",
        icon: 'none',
        duration: 2000
      });
    } else {
      wx.navigateTo({
        url: `../payedSpecial/payedSpecial`
      })
    }

  },
  //点击，积分有礼
  goJifenShop() {
    if (!app.globalData.isMember) {
      wx.showToast({
        title: "为了您更好的体验,请先注册登录",
        icon: 'none',
        duration: 2000
      });
    } else {
      wx.navigateTo({
        url: `../integralShop/integralShop`
      })
    }
  }, 
   //点击，意见反馈
  goFeedBackHb() {
    if(!app.globalData.isMember) {
      wx.showToast({
        title: "为了您更好的体验,请先注册登录",
        icon: 'none',
        duration: 2000
      });
    } else {
      wx.navigateTo({
        url: `../feedBackHb/feedBackHb`
      })
    }
  }, 
  // 没有授权的弹窗,关闭按钮
  iosCloseDialog: function () {
    this.setData({
      noLoginShowModal: false
    })
  },
  /* 点击完授权按钮，新用户专享弹窗  */
  showRegDialog:function(){
    console.log(this.data.showRegDialog)
    this.setData({
      showRegDialog: false
    })
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.showBalance();
    this.showIntegral()
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 100);
  }

})
