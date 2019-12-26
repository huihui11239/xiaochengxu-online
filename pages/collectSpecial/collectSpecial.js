const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    url: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userId = wx.getStorageSync("openId")
    var isMember = app.globalData.isMember
    var token = app.globalData.auth_token
    //console.log(userId, token,isMember )
    this.setData({
      url: `https://images.hbwlife.com/wx-h5/collectSpecial.html?userId=${userId}&token=${token}&isMember=${isMember}`
    })
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