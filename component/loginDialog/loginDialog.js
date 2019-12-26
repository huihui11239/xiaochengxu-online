// template/myDialog/myDialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    noLoginShowModal: false   //如果登录了，弹窗不显示
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //点击获取头像按钮
    bindGetUserInfo(e) {
      //wx.setStorageSync('userInfo', e.detail.userInfo)
      var self = this;
      console.log(e)
      self.setData({
        nickName: e.detail.userInfo.nickName,
        avatar_url: e.detail.userInfo.avatarUrl,
        login: false
      })
      if (e.detail.userInfo) {
        wx.login({
          success: function (ress) {
            console.log(ress)
            wx.request({
              url: 'https://api.hbwlife.com/wxapp/wxaccess/getUserInfo',
              method: 'post',
              header: {
                "AUTH_TOKEN": app.globalData.auth_token
              },
              data: {
                iv: e.detail.iv,
                wxlogin_code: ress.code,
                encryptedData: e.detail.encryptedData
              },
              success: function (data) {
                console.log(data)
                wx.setStorageSync('openId', data.data.data.openid);
                self.setData({
                  login: false,
                  noLoginShowModal: false
                })


              },
            })
          }
        })
      } else {
        // wx.showToast({
        //   title: "为了您更好的体验,请先同意授权",
        //   icon: 'none',
        //   duration: 2000
        // });
      }
    },
    // 没有授权的时候弹窗,关闭按钮
    iosCloseDialog: function () {
      this.setData({
        noLoginShowModal: false
      })
    }

  }
})
