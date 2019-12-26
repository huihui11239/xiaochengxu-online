const util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var userId = wx.getStorageSync("openId")
    var token = app.globalData.auth_token
    var isMember = app.globalData.isMember
    var courseId = options.courseId
    var expertId = options.expertId
    console.log(userId, token, isMember, courseId, expertId)

    this.setData({
      url: `https://images.hbwlife.com/wx-h5/feedBack-course.html?userId=${userId}&token=${token}&isMember=${isMember}&courseId=${courseId}&expertId=${expertId}`
    })


  },
  onPullDownRefresh: function () {

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