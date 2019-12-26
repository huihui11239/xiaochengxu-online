// pages/webview/webview.js
var app = getApp();
Page({
  data: {
    url: ""
  },
  onLoad: function (options) {
    var userId = wx.getStorageSync("openId")
    var isMember = app.globalData.isMember
    var token = app.globalData.auth_token
    console.log(userId, token,isMember )

    this.setData({
      url: `https://images.hbwlife.com/wx-h5/expertList.html?userId=${userId}&token=${token}&isMember=${isMember}`
    })
  },

  onReady: function () {

  },
  onShow: function () {
    //获取当前时间戳  
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    
    var userId = wx.getStorageSync("openId")
    var isMember = app.globalData.isMember
    var token = app.globalData.auth_token
    //console.log(userId, isMember, token); 
    this.setData({
      url: `https://images.hbwlife.com/wx-h5/expertList.html?userId=${userId}&timestamp=${timestamp}&token=${token}&isMember=${isMember}`
    })
  },
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
  // 下拉刷新
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    //获取当前时间戳  
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log("当前时间戳为：" + timestamp);
    var userId = wx.getStorageSync("openId")
    this.setData({
      url: `https://images.hbwlife.com/wx-h5/expertList.html?userId=${userId}&timestamp=${timestamp}`
    })
  
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 500);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '汉邦智慧给每一个人带来智慧健康的生活!',
      desc: '汉邦智慧',
      path: '/pages/home/home?openid=' + wx.getStorageSync('openId'), // 路径，传递参数到指定页面。
      imageUrl: 'https://images.hbwlife.com/staticImg/share.jpg',
    }
  },
})