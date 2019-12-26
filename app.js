//app.js
App({
  data: {
    fromId: ''
  },
  onLoad: function (options) {
    if (typeof (options.fromId) == 'undefined') {
      options.fromId = ''
    }
    this.setData({
      fromId: options.fromId
    })
  },
  onLaunch: function () {
    //云开发环境初始化
    // wx.cloud.init({
    //   env: "hanbang-live-23as0"
    // });
    var self = this;
    self.checkSession_key();   
  },
  checkSession_key(){
    //checkSession
    var self = this;
    wx.checkSession({
      success: function () {
        console.log("session_key 没有失效，登录")
        self.initLogin();
      },
      fail: function () {
        console.log("session_key 已经失效，注册登录")
        self.initRegister()
      }
    })
  },
  initRegister() {
    var self = this;
    wx.login({
      success: function (ress) {
        console.log(ress)
        //register
        wx.request({
          url: 'https://api.hbwlife.com/wxapp/wxaccess/user/register',
          method: 'post',
          data: {
            wxlogin_code: ress.code
          },
          success: function (data) {
            console.log(data)
            if (data.data.code == 0) {
              console.log(data)
              wx.setStorageSync('openId', data.data.data.openid);
              self.globalData.auth_token = data.data.data.auth_token
              self.globalData.openId = data.data.data.openId

              if (data.data.data.nickName) {
                console.log("regis-name")
                self.globalData.nickName = data.data.data.nickName
                self.globalData.avatar_url = data.data.data.avatar_url
                self.globalData.isMember = true
              }
              console.log("register--token是：" + self.globalData.auth_token)
              console.log("register--nickName是：" + self.globalData.nickName)
              console.log("register--isMember是：" + self.globalData.isMember)
              wx.navigateTo({
                url: "/pages/home/home"
              })
            } else {
              console.log("系统错误，退出小程序")
            }
          },
          fail: function () {
            console.log("网络错误，退出小程序")
          }
        })
      }
    })
  },
  initLogin() {
    var self = this
    if (wx.getStorageSync('openId')) {
      wx.request({
        url: 'https://api.hbwlife.com/wxapp/wxaccess/user/login',
        method: 'post',
        data: {
          "openid": wx.getStorageSync('openId')
        },
        success: function (data) {
          console.log(data)
          if (data.data.code == 0) {
            wx.setStorageSync('openId', data.data.data.openid);
            self.globalData.auth_token = data.data.data.auth_token
            self.globalData.openId = data.data.data.openid

            if (data.data.data.nickName) {
              console.log("login-name")
              self.globalData.nickName = data.data.data.nickName
              self.globalData.avatar_url = data.data.data.avatar_url
              self.globalData.isMember = true
            }
            console.log("login--token是：" + self.globalData.auth_token)
            console.log("login--nickName是：" + self.globalData.nickName)
            console.log("register--isMember是：" + self.globalData.isMember)
            wx.navigateTo({
              url: "/pages/home/home"
            })
          } else {
            self.initRegister()
            console.log("openid没有")
          }
        }
      })
    }
  },
  globalData: {
    openId:"",
    auth_token:"",
    nickName: "",
    avatar_url: "",
    isMember:false
  }
})