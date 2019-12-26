Page({

  data: {
    showModal: true
  },

  submit: function () {
    this.setData({
      showModal: true
    })
  },

  preventTouchMove: function () {

  },


  closeDialog: function () {
    this.setData({
      showModal: false
    })
    // wx.navigateTo({
    //   url: "/pages/my/my"
    // })
 
  }

})