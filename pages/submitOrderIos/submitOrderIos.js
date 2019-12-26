
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    showShopPopup: false, // 是否显示弹出层
    animationData: {}, // 动画数据
    course_id: "",
    expert_id: "",
    showCourseData: {},
    // coursePrice: "",
    price_once: "",
    price_discounted: "",
    balance: 0,
    iosShowModal: false,    //找他人代付弹窗显示与否
    bangMa:"",
    payBtnTxt:"确定观看"
  },
  onLoad: function (options) {
    console.log(options)
    //获取改页面url参数的course_id，课程id
    this.setData({
      course_id: options.courseId ? options.courseId : "",
      expert_id: options.expertId ? options.expertId : "",
      //coursePrice: options.price
      price_once: options.price
    })
  },
  onShow: function () {
    this.showCourseData()
    this.showBalance()
    this.checkPayed()
  },
  onShareAppMessage() {
    var openId = wx.getStorageSync('openId');
    var bangMa = this.data.bangMa
    return {
      title: '汉邦智慧给每一个人带来智慧健康的生活!',
      desc: '汉邦智慧',
      path: '/pages/recharge/recharge?openId=' + openId + '&bangMa=' + bangMa,
      //imageUrl: 'https://images.hbwlife.com/staticImg/share.jpg',
      success: function (res) {
        wx.showModal({
          title: '',
          content: JSON.stringify(res),
        })
      }
    }
  },
  //显示我的余额
  showBalance() {
    var that = this
    wx.request({
      url: 'https://api.hbwlife.com/wxapp/user/fund/get',
      data: {
        "userId": wx.getStorageSync('openId')
      },
      method: 'post',
      success: function (data) {
        console.log(data)
        var _balance = data.data.data.fund;
        that.setData({
          balance: _balance
        });
      }
    })
  },
  //反查该课程有没有支付
  checkPayed() {
    var self = this;
    var apiUrl = "/wxapp/user/consume/order/get";
    var postData = {
      "course_id": this.data.course_id,
      "userId": wx.getStorageSync("openId")
    };
    var doSuccess = function (data) {
      console.log(data)
      if (data.data.code == 0) {
        self.setData({
          payBtnTxt: "去看视频",
        })
      } else if (data.data.code == -56534) {
        console.log("目前未购买")
        self.setData({
          payBtnTxt: "确定观看",
        })
        // wx.showToast({
        //   title: '为未购买',
        //   icon: 'none'
        // })
      }
    }
    var doFail = function () {

    }
    //调用
    util.requestPost(apiUrl, postData, doSuccess, doFail)
  },

  //优惠券的，从底部打开弹窗
  openPopup() {
    this.showModal();
  },
  showModal() {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      /**
        * http://cubic-bezier.com/ 
        * linear 动画一直较为均匀
        * ease 从匀速到加速在到匀速
        * ease-in 缓慢到匀速
        * ease-in-out 从缓慢到匀速再到缓慢
        * 
        * http://www.tuicool.com/articles/neqMVr
        * step-start 动画一开始就跳到 100% 直到动画持续时间结束 一闪而过
        * step-end 保持 0% 的样式直到动画持续时间结束 一闪而过
        */
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(), // export 方法每次调用后会清掉之前的动画操作。
      showShopPopup: true
    })
    setTimeout(() => {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()  // export 方法每次调用后会清掉之前的动画操作。
      })
      // console.log(this)
    }, 200)
  },
  hideModal() {
    // 优惠券的，隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showShopPopup: false
      })
      // console.log(this)
    }.bind(this), 200)
  },
  //获取课程的信息
  showCourseData() {
    var _this = this;
    var apiUrl = "/wxapp/common/course/info";
    var postData = {
      "course_id": this.data.course_id,
      "userId": wx.getStorageSync("openId")
    };
    var doSuccess = function (data) {
      if (data.data.code == 0) {
        console.log(data)
        var _showCourseData = data.data.data
        _this.setData({
          showCourseData: _showCourseData,
          price_once: _showCourseData.price_once,
          price_discounted: _showCourseData.price_discounted
        })
      } else {
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    }
    var doFail = function () {

    }
    //调用
    util.requestPost(apiUrl, postData, doSuccess, doFail)
  },
  // 跳转到充值页面
  goRecharge() {
    var expertId = this.data.expert_id
    var courseId = this.data.course_id
    var price = this.data.price_discounted
    console.log(expertId, courseId, price)
    wx.navigateTo({
      url: `../recharge/recharge?courseId=${courseId}&expertId=${expertId}&price=${price}`
    });
  },
  //抵扣金币接口
  payFn() {
    var _expertId = this.data.expert_id
    var _courseId = this.data.course_id
    var _price = this.data.price_discounted
    var apiUrl = "/wxapp/user/consume/order";
    var postData = {
      "userId": wx.getStorageSync("openId"),
      "course_id": _courseId,
      "expert_id": _expertId,
      "consume_type": "COURSE",
      "consume_price": _price
    };
    var doSuccess = function (data) {
      console.log(data)
      if (data.data.code == 0) {
        console.log("success")
        //
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000
        })
        //调到详情页
        setTimeout(function () {
          wx.navigateTo({
            url: `../courseDetail/courseDetail?courseId=${_courseId}&expertId=${_expertId}&price=${_price}`
          })
        }, 2000)

      } else if (data.data.code == '-56556') {
        wx.showToast({
          title: `资金不足,请先充值:${data.data.code}`,
          icon: 'none',
          duration: 2000
        })
      } else if (data.data.code == '-56554') {
        wx.showToast({
          title: `您已购买:${data.data.code}`,
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.showToast({
          title: `其他error:${data.data.code}`,
          icon: 'none'
        })
      }
    }
    var doFail = function () {

    }
    //调用
    util.requestPost(apiUrl, postData, doSuccess, doFail)
  },

  //抵消金币弹窗
  showModalPay() {
    var _this = this;
    if (_this.data.payBtnTxt=="确定观看"){
      wx.showModal({
        title: '立即购买？',
        // content: '确认吗？',
        showCancel: true,//是否显示取消按钮
        cancelText: "稍等一下",//默认是“取消”
        cancelColor: '#676a6d',//取消文字的颜色
        confirmText: "立即购买",//默认是“确定”
        confirmColor: '#07c160',//确定文字的颜色
        success: function (res) {
          if (res.cancel) {
            //点击取消,默认隐藏弹框
            wx.navigateTo({
              url: `../submitOrder/submitOrder?courseId=${_courseId}&expertId=${_expertId}&price=${_price}`
            })
          } else {
            console.log("queding")
            //点击确认，调用抵扣金币接口
            _this.payFn()

          }
        },
        fail: function (res) { },//接口调用失败的回调函数
        complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
      })
    }
    
  },
  //抵扣金币接口
  submitConsume() {
    var _expertId = this.data.expert_id
    var _courseId = this.data.course_id
    var _price = this.data.price_discounted
    console.log(_expertId, _courseId, _price)
    var _this = this;
    if (_this.data.payBtnTxt=="去看视频"){
      //调到详情页
      setTimeout(function () {
        wx.navigateTo({
          url: `../courseDetail/courseDetail?courseId=${_courseId}&expertId=${_expertId}&price=${_price}`
        })
      }, 2000)
    }else{
      _this.showModalPay()    //调用上一个接口，弹窗显示扣除金币
    }
    
  },
  // ios找他人代付
  iosSubmit() {
    var self = this
    self.setData({
      iosShowModal: true
    })
    var apiUrl = "/wxapp/user/recharge/applyBehalf";
    var postData = {
      "userId": wx.getStorageSync('openId')
    };
    var doSuccess = function (data) {
      console.log(data)
      var _bangMa = data.data.data.behalf_code
      console.log(_bangMa)
      self.setData({
        bangMa: _bangMa
      })
    }
    var doFail = function () {

    }
    //调用
    util.requestPost(apiUrl, postData, doSuccess, doFail)
  },
  
  preventTouchMove: function () {

  },
  iosCloseDialog: function () {
    var _expertId = this.data.expert_id
    var _courseId = this.data.course_id
    //var _price = this.data.coursePrice
    this.setData({
      iosShowModal: false
    })
    //跳转到详情页
    // setTimeout(function () {
    //   wx.navigateTo({
    //     url: `../courseDetail/courseDetail?courseId=${_courseId}&expertId=${_expertId}&price=${_price}`
    //   })
    // }, 3000)
  },
  //复制
  copy: function (e) {
    var self = this;
    wx.setClipboardData({
      data: self.data.bangMa,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 2000
        })
      }
    });
  },
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();

    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 100);
  }
 







})