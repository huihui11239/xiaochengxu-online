var app = getApp();

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//金额转换，分-->元
const moneyTransform = function (val) {
  var str = (val / 100).toFixed(2) + '';
  var intSum = str.substring(0, str.indexOf(".")).replace(/\B(?=(?:\d{3})+$)/g, ',');//取到整数部分
  var dot = str.substring(str.length, str.indexOf("."))//取到小数部分搜索
  var ret = intSum + dot;
  return ret;
}

//秒-->时间
const formatSeconds = function (value){
   var theTime = parseInt(value);// 秒
    var middle = 0;// 分
    var hour = 0;// 小时

  if (theTime > 60) {
    middle = parseInt(theTime / 60);
    theTime = parseInt(theTime % 60);
    if (middle > 60) {
      hour = parseInt(middle / 60);
      middle = parseInt(middle % 60);
    }
  }
  var result = "" + parseInt(theTime) + "秒";
  if (middle > 0) {
    result = "" + parseInt(middle) + "分" + result;
  }
  if (hour > 0) {
    result = "" + parseInt(hour) + "小时" + result;
  }
  return result;

}


//封装请求
const requestPost = function (apiUrl, postData, doSuccess, doFail) {
  var openid = wx.getStorageSync("openId")
  wx.request({
    url: "https://api.hbwlife.com" + apiUrl,
    header: {
      "AUTH_TOKEN": openid+"|"+app.globalData.auth_token
    },
    data: postData,
    method: 'POST',
    success: function (res) {
      console.log(res)

     //tocken超时
      if (res.data.code == "-56506") {
        wx.request({
          url: 'https://api.hbwlife.com/wxapp/wxaccess/user/login',
          method: 'post',
          data: JSON.stringify({
            "openid": wx.getStorageSync('openId')
          }),
          success: function (data) {
            console.log(data)
            // wx.showToast({
            //   title: 'token失效，重新调用login接口',
            //   icon: 'none',
            //   duration: 5000
            // })
            app.globalData.auth_token = data.data.data.auth_token
            app.globalData.openId = data.data.data.openid
            console.log(data.data.data.auth_token)
          }
        })
      }
      //成功的函数
      doSuccess(res);
      // if (res.data.code == 0) {
      //   doSuccess(res);
      // }
    },
    fail: function () {
      doFail();
    },
  })
}





module.exports = {
  formatTime: formatTime,
  moneyTransform: moneyTransform,
  requestPost: requestPost,
  formatSeconds


}
