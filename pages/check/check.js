// pages/check/check.js
const app = getApp()
Page({
  data: {
    fromId: ''
  },
  onLoad: function (options) {
    //分享
    if (typeof (options.fromId) == 'undefined') {
      options.fromId = ''
    }
    this.setData({
      fromId: options.fromId
    })
  },
  onShow:function(){
    //this.initRegester()
    // wx.checkSession({
    //   success: function () {
    //     console.log("在登录状态")
    //     wx.navigateTo({
    //       url: "/pages/home/home"
    //     })
    //     //session_key 未过期，并且在本生命周期一直有效
    //     return;
    //   },
    //   fail: function () {
    //     // session_key 已经失效，需要重新执行登录流程
    //     //this.initLogin()
    //   }
    // })
  },
  //register
  // initRegester(){
  //   if (App.globalData.openId){
  //     console.log("已经登录了")
  //     // wx.navigateTo({
  //     //   url: "/pages/home/home"
  //     // })
  //   }else{
  //     wx.request({
  //       url: 'https://api.hbwlife.com/wxapp/wxaccess/user/login',
  //       method: 'post',
  //       data: {
  //         wxlogin_code: ress.code
  //       },
  //       success: function (data) {
  //         console.log(data)
  //         wx.setStorageSync('openId', data.data.data.openid);
  //         self.globalData.auth_token = data.data.data.auth_token
  //         self.globalData.openId = data.data.data.openId
  //       }
  //     })
  //   }
  // },
  

  //点击【开启智慧生活】按钮
  bindGetUserInfo: function (e) {
    // 获得最新的用户信息
    if (!e.detail.userInfo) {
      return;
    }
    wx.setStorageSync('userInfo', e.detail.userInfo)
    wx.setStorageSync('iv', e.detail.iv)
    wx.setStorageSync('encryptedData', e.detail.encryptedData)
    //console.log(e)
    this.checkSessionAndLogin();
  },
  checkSessionAndLogin: function () {
    let that = this;
    let thisOpenId = wx.getStorageSync('openid');

    // 已经进行了登录，检查登录是否过期
    if (thisOpenId) {
      console.log('have openid')
      wx.checkSession({
        success: function () {
          console.log(this.route)
          //session_key 未过期，并且在本生命周期一直有效
          wx.navigateBack({});

        },
        fail: function () {
          console.log('but session_key expired');
          // session_key 已经失效，需要重新执行登录流程
          wx.removeStorageSync('openid');
          that.checkSessionAndLogin();
        }
      })
    } else {
      // 没有进行登录则先进行登录操作
      //console.log('do not have openid');
      that.loginAndGetOpenid();
    }
  },
  // 执行登录操作并获取用户openId
  loginAndGetOpenid: function () {
    //console.log('do login and get openid');
    let that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: 'https://api.hbwlife.com/wxapp/wxaccess/getUserInfo',
            method: 'post',
            data: {
              wxlogin_code: res.code,
              iv: wx.getStorageSync('iv'),
              encryptedData: wx.getStorageSync('encryptedData'),
              from_user_id: that.data.fromId
            },
            success: function (res) {
              console.log(res)
              // 保存openId，并将用户信息发送给后端
              if (res.data.code === 0) {
                wx.showModal({
                  title: 'set openid',
                  content: res.data.data,
                })
                wx.switchTab({
                  url: '../home/home',
                })
                wx.setStorageSync('openId', res.data.data.openid);
                wx.setStorageSync('isLogin', 'haveLogins');
              } else {
                wx.showModal({
                  title: 'Sorry',
                  content: '用户登录失败~',
                })
              }
            }
          })
        }
      }
    })
  },
  //点击暂不登陆
  noLogingoHome: function (e) {
    wx.setStorageSync('isLogin', 'haveLogins');
    //
    wx.switchTab({
      url: '../my/my',
    })
  }

})