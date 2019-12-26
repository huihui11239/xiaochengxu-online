const util = require('../../utils/util.js')
var app = getApp();
Page({
  data: {
    url:""

  },
  onLoad: function (options) {
    //console.log(options)
    var userId = wx.getStorageSync("openId")
    var isMember = app.globalData.isMember
    var token = app.globalData.auth_token
    console.log(userId, token,isMember )
    
    //线上版，没有写isMember参数，那俩收藏的页面，没有写token参数
      this.setData({
        url: `https://images.hbwlife.com/wx-h5/payedCouserList.html?userId=${userId}&token=${token}&isMember=${isMember}`
      })
      
   
  },
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    //获取当前时间戳  
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log("当前时间戳为：" + timestamp);
    var userId = wx.getStorageSync("openId")
    this.setData({
      url: `https://images.hbwlife.com/wx-h5/payedCouserList.html?userId=${userId}&timestamp=${timestamp}&token=${token}&isMember=${isMember}`
    })

    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 500);
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})