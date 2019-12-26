const util = require('../../utils/util.js')
var app=getApp();
Page({
  data: {
    openId:"",
    bbm:"",
    nickName:"",
    rechargeMoneyArr:[], 
    course_id: "",
    expert_id: "",
    coursePrice:"",
    balance: 0,
    selMoney:0,
    currentItem:"",
    switchChecked:false,
    inputLen: 6,//隐藏输入框最大位数，也是验证码输入框wx:for循环值
    iptValue: "",//验证码输入框值，利用str[index]来控制每个输入框显示的值（验证码的值）
    isFocus: true,//刚开始没有聚焦到隐藏输入框
    allIptVal:"", //输入的6位邦邦码
    showRegDialog: false,  //点击完授权按钮，弹窗
    showPaybtn:false
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      course_id: options.courseId ? options.courseId : "",
      expert_id: options.expertId ? options.expertId : "",
      coursePrice: options.price ? options.price : ""
    })
    //初始，显示面额
    this.getShowMoney()
    //初始判断isMember
    if (app.globalData.isMember) {
      this.setData({
        nickName: app.globalData.nickName,
        showPaybtn:true
      })
      //初始我的余额
      this.showBalance()
    } else {
      wx.showToast({
        title: '请先注册登录',
        icon: '',
        image: '',
        duration: 2000
      })
    }
    // 分享来的页面的bbm
    if(options.bbm){
      wx.showToast({
        title: options.bbm,
        icon: '',
        image: '',
        duration: 5000
      })
    }
  },
  onShow: function () {
  }, 

  //显示我的余额
  showBalance() {
    //为了分享的打开
    var openId = '';
    if (wx.getStorageSync("openId")) {
      openId = wx.getStorageSync("openId")
    }
    else {
      openId = options.openId
      this.setData({
        openId: openId
      })
    }

    var that = this
    var apiUrl = "/wxapp/user/fund/get";
    var postData = {
      "userId": openId
    };
    var doSuccess = function (data) {
      console.log(data)
      var _balance = data.data.data.fund;
      that.setData({
        balance: _balance
      });
    }
    var doFail = function () {

    }
    //调用
    util.requestPost(apiUrl, postData, doSuccess, doFail)
  },
  //获取充值面额
  getShowMoney() {
    var that = this
    var apiUrl = "/wxapp/common/recharge/denomination";
    var postData = {}
    var doSuccess = function (data) {
      console.log(data)
      var _rechargeMoneyArr = data.data.data.denominations;
      that.setData({
        rechargeMoneyArr: _rechargeMoneyArr
        // rechargeMoneyArr: [
        //   { id: 1, show: "1000币", rmb: 0.01 },
        //   { id: 2, show: "2000币", rmb: 20 },
        //   { id: 3, show: "5500币", rmb: 50 },
        //   { id: 4, show: "12000币", rmb: 100 },
        //   { id: 5, show: "25000币", rmb: 200 },
        //   { id: 6, show: "65000币", rmb: 500 }
        // ]
      });
    }
    var doFail = function () {

    }
    //调用
    util.requestPost(apiUrl, postData, doSuccess, doFail)
  },
  //选择要充值的金额
  selMoney(e){
    //console.log(e)
    var selMoney = e.currentTarget.dataset.realmoney * 100;
    var id = e.currentTarget.dataset.id;
    //console.log(id)
    this.setData({
      selMoney: selMoney,
      currentItem: id
    })
  },
  //自动扣除金币
  submitConsume() {
    var _expertId = this.data.expert_id
    var _courseId = this.data.course_id
    var _price = this.data.coursePrice
    console.log(_expertId, _courseId, _price)
    var _this = this;
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
        wx.showToast({
          title: '充值成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(function () {
          //调到详情页
          wx.navigateTo({
            url: `../courseDetail/courseDetail?courseId=${_courseId}&expertId=${_expertId}&price=${_price}`
          })

        }, 2000)
      } else if (data.data.code == '-56556') {
        wx.showToast({
          title: `资金不足:${data.data.code}`,
          icon: 'none',
          duration: 2000
        })
      } else if (data.data.code == '-56554') {
        wx.showToast({
          title: `已经购买此:${data.data.code}`,
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.showToast({
          title: `其他error:${data.data.code}`,
          icon: 'none',
          duration: 2000
        })
      }
    }
    var doFail = function () {

    }
    //调用
    util.requestPost(apiUrl, postData, doSuccess, doFail)
  },
  //弹窗
  showModalPay() {
    var _expertId = this.data.expert_id
    var _courseId = this.data.course_id
    var _price = this.data.coursePrice
    var _this = this;
    wx.showModal({
      title: '立即购买本次？',
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
          _this.submitConsume()
                  
        }
      },
      fail: function (res) { },//接口调用失败的回调函数
      complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
    })
  },
  
  
  //当点击验证码框，聚焦到隐藏输入框
  onFocus: function (e) {
    var that = this;
    that.setData({ isFocus: true });
  },
  //利用输入框bindinput事件，将输入框中的值复制到iptValue中，这样每个输入框根据对应下标index，显示对应内容
  setValue: function (e) {
    console.log(e.detail.value);
    var that = this;
    console.log(e.detail.value)
    that.setData({ iptValue: e.detail.value });
    console.log(this.data.iptValue)
    if (this.data.iptValue.length == 6) {
      that.setData({
        allIptVal: that.data.iptValue
      })
      // wx.showToast({
      //   title: this.data.allIptVal,
      //   icon: 'fail',
      //   duration: 2000
      // })
    }

  },
  //付款码开关
  listenerSwitch: function (e) {
    console.log('switch类型开关当前状态-----', e.detail.value);
    if (e.detail.value == true) {
      console.log(1111)
      this.setData({
        switchChecked: true,
        isFocus: true
      })
    } else {
      console.log(2222)
      this.setData({
        switchChecked: false,
        isFocus: false
      })
      //当输入完邦邦码，再关闭开关的话，将码置空，相当于为自己充值
      this.setData({
        allIptVal:""
      })
      console.log(this.data.allIptVal)

      // wx.showToast({
      //   title: this.data.allIptVal,
      //   icon: 'none',
      //   duration: 4000
      // })

    }
  },
  //立即充值
  pay() {
    var course_id = this.data.course_id;
    var expert_id = this.data.expert_id;
    var price = this.data.selMoney;
    var _this = this;
    var apiUrl = "/wxapp/user/recharge/order";
    var postData = {
      "userId": wx.getStorageSync('openId'),
      "order_price": _this.data.selMoney,
      "behalf_code": _this.data.allIptVal ? _this.data.allIptVal:""
    };
    var doSuccess = function (data) {
      console.log(data)
      //正常支付
      if (_this.data.selMoney) {
        if (data.data.code == 0) {
          //微信提供的
          wx.requestPayment({
            timeStamp: data.data.data.timeStamp,
            nonceStr: data.data.data.nonceStr,
            package: data.data.data.package,
            signType: data.data.data.signType,
            paySign: data.data.data.paySign,
            success(datas) {
              console.log(datas)
              var orderId = data.data.data.order_id;

              //弹窗,显示抵扣金币
              //判断当前页面地址
              let pages = getCurrentPages();
              let prevpage = pages[pages.length - 2];
              console.log(prevpage.route)
              //如果是【我的】页面跳转过来，就提示充值成功
              if (prevpage.route == "pages/my/my") {
                wx.showToast({
                  title: '充值成功！',
                  icon: 'success',
                  duration: 2000
                })

                //刷新显示余额
                _this.showBalance()
               
                
                //如果是【详情】页面跳转过来，就继续支付
              } else if (prevpage.route == "pages/submitOrder/submitOrder") {
                _this.showModalPay()
              }
            },
            fail(datas) {
              var orderId = data.data.data.order_id;
              if (datas.errMsg == 'requestPayment:fail cancel') {
                wx.showToast({
                  title: '取消充值',
                  icon: 'none'
                })
              }
            }
          })
        }else if (data.data.code == '-56560') {
          console.log(data.data)
          wx.showToast({
            title: '邦邦码不正确',
            icon: 'none',
            duration: 2000
          })
        }else{
          wx.showToast({
            title: 'other error' + data.data.data.code,
            icon: 'none',
            duration:2000
          })
        }
      }else{
        wx.showToast({
          title: '请选择要充值的金额',
          icon: 'none',
          duration: 3000
        })
      }
    }
    var doFail = function (err) {
      wx.showToast({
        title: 'other error',
        icon: 'none',
        duration: 3000
      })
    }
    //调用
    util.requestPost(apiUrl, postData, doSuccess, doFail)
  },

  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();

    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 100);
  },
  //点击获取头像按钮
  bindGetUserInfo(e) {
    var self = this;
    console.log(e)
    self.setData({
      nickName: e.detail.userInfo.nickName
    })
    //getUserInfo
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
          if (data.data.data.nickName) {
            app.globalData.nickName = data.data.data.nickName
            app.globalData.avatar_url = data.data.data.avatar_url
            app.globalData.isMember = true
          } 
          //我的金币
          self.showBalance(app.globalData.isMember)
          self.setData({
            showRegDialog: true,
            showPaybtn:true
          })
          
        } else {
          app.globalData.isMember = false
          wx.showToast({
            title: "注册登录失败，请重新操作",
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: function () {
        app.globalData.isMember = false
        console.log("注册登录失败，请重新操作")
        wx.showToast({
          title: "注册登录失败，请重新操作",
          icon: 'none',
          duration: 2000
        });
      }
    })
  },
  /* 点击完授权按钮，新用户专享弹窗  */
  showRegDialog: function () {
    console.log(this.data.showRegDialog)
    this.setData({
      showRegDialog: false
    })
  },
})