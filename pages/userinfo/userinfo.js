// pages/userinfo/userinfo.js
var location;
var app = getApp()
var get_url = getApp().globalData.constUrl + "wxApi/getUserLocation.php";
var alertname_url = getApp().globalData.constUrl + "wxApi/alertUserName.php";
var get_userinfo = getApp().globalData.constUrl + "wxApi/wxLogin/getLastUserinfo.php";
var new_name = '';
var alertUserName = function (that) {
  console.log(new_name);
  console.log(that.data.userInfo.UserId);
  wx.request({
    url: alertname_url,
    // method: "POST",
    data: {
      userid: that.data.userInfo.UserId,
      new_name: new_name
    },
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      console.log(res)
      that.setData({
        ToastText: res.data.detail.content,
        hiddenToast: false
      })
    }
  });
}
var getLastUserInfo = function (that) {
  console.log(that.data.userInfo)
  wx.request({
    url: get_userinfo,
    data: {
      userid: that.data.userInfo.UserId
    },
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      console.log('更新个人信息');
      wx.setStorageSync('userData', res.data.detail);
      app.globalData.userData = res.data.detail;
      that.setData({
        userInfo: app.globalData.userData
      })
    }
  });
}
var getPosition = function (that) {
  that.setData({
    hiddenLoading: false
  });
  wx.authorize({
    scope: 'scope.userLocation',
    success() {
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          //  console.log(res);
          var latitude = res.latitude
          var longitude = res.longitude
          var speed = res.speed
          var accuracy = res.accuracy
          wx.setStorageSync('position', res);
          getUserLocation(that)
        },
        fail: function (res) {
          that.setData({
            location: res.data
          })
        },
        complete: function () {
          that.setData({
            hiddenLoading: true
          });
        }
      })
    },
    fail() {

    }
  })
}
var getUserLocation = function (that) {
  wx.request({
    url: get_url,
    data: {
      lat: wx.getStorageSync('position').latitude,
      lon: wx.getStorageSync('position').longitude
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      wx.setStorageSync('address', res.data.detail);
      that.setData({
        location: res.data.detail
      })
    }
  });
}
Page({
  data: {
    motto: '人人种品种大全',
    userInfo: {},
    hiddenLoading: true,
    hiddenToast: true,
    addresshidden: true
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.setData({
      location: wx.getStorageSync('address')
    })
    // // console.log('onLoad')
    // var that = this
    // //调用应用实例的方法获取全局数据
    // app.getUserData(function (userData) {
    //   // console.log(userData);
    //   that.setData({
    //     userInfo: userData
    //   })
    //   new_name = userData.UserName;
    // })
    // getLastUserInfo(this);
  },
  reset_loc: function () {
    var that = this;
    getPosition(that);
  }
  , alertAvatar: function () {
    console.log(this.data.userInfo);
    wx.navigateTo({
      url: '/pages/alertAvatar/alertAvatar?userinfo=' + JSON.stringify(this.data.userInfo)
    })
  }
  , onChange: function (e) {
    console.log(e.detail.value)
    new_name = e.detail.value;
  }
  , alertUserName: function () {
    this.setData({
      qiehuandata: '确认修改昵称为' + new_name + '?',
      addresshidden: false
    })

  },
  /**
*    toast显示时间到时处理业务 
*/
  toastHidden: function () {
    this.setData({
      hiddenToast: true
    })
  }, cancel: function () {
    this.setData({
      addresshidden: true,
      userInfo: this.data.userInfo
    });
  },
  confirm: function () {
    this.setData({
      addresshidden: true
    });
    alertUserName(this);
  },  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      location: wx.getStorageSync('address')
    })
    // console.log('onLoad')
    var that = this
    app.getUserData(function (userData) {
       console.log(userData);
      that.setData({
        userInfo: userData
      })
    })
    getLastUserInfo(this);
  }
})