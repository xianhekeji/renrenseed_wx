//app.js
var openid = '';
var API_URL = "https://www.renrenseed.com/wxApi/wxLogin/wxLoginNew.php";
var login_count = 0;
var Login = function Login(code, encryptedData, iv, that) {
  // console.log('code=' + code + '&encryptedData=' + encryptedData + '&iv=' + iv);
  //创建一个dialog
  wx.showToast({
    title: '正在登录...',
    icon: 'loading',
    duration: 10000
  });
  //请求服务器
  wx.request({
    url: API_URL,
    data: {
      code: code,
      encryptedData: encryptedData,
      iv: iv
    },
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: {
      'content-type': 'application/json'
    }, // 设置请求的 header
    success: function (res) {
      console.log(res)
      if ((res.data.detail == undefined || res.data.detail == '') && login_count < 3) {
        console.log(login_count);
        OnLogin(that);
      }
      else {
        console.log('更新个人信息');
        wx.setStorageSync('userData', res.data.detail);
        that.globalData.userData = res.data.detail;
        console.log(that.globalData.userData);
      }
      // success
      wx.hideToast();
    },
    fail: function () {
      // fail
      // wx.hideToast();
    },
    complete: function () {
      // complete
    }
  })
}
var OnLogin = function (that) {
  login_count = login_count + 1;
  wx.login({//login流程
    success: function (res) {//登录成功
      if (res.code) {
        var code = res.code;
        wx.getUserInfo({//getUserInfo流程
          success: function (res2) {//获取userinfo成功
            //console.log(res2);
            var encryptedData = res2.encryptedData;//一定要把加密串转成URI编码
            var iv = res2.iv;
            //请求自己的服务器
            Login(code, encryptedData, iv, that);
          }
        })
      } else {
        console.log('获取用户登录态失败！' + res.errMsg)
      }
    }
  });
}
App({
  onLaunch: function (options) {
    // wx.clearStorage();
    console.log(options)
    if (options.scene == 1035) {
      wx.setStorageSync('isLocation', false);
    }
    else { wx.setStorageSync('isLocation', true); }
    OnLogin(this);
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserData: function (cb) {
    var that = this
    if (this.globalData.userData) {
      typeof cb == "function" && cb(this.globalData.userData)
    } else {
      //调用登录接口
      wx.getStorage({
        //获取数据的key
        key: 'userData',
        success: function (res) {
          that.globalData.userData = res.data
          typeof cb == "function" && cb(that.globalData.userData)
        },
        /**
         * 失败会调用
         */
        fail: function (res) {
          console.log(res)
          typeof cb == "function" && cb(null)
        }
      })
    }
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  OnLogin: function () {
    console.log('OnLogin');
    OnLogin(this);
  },
  globalData: {
    userInfo: null,
    userData: null,
    constUrl: "https://www.renrenseed.com/",
    province: '山东省',
    address: null
  }
})