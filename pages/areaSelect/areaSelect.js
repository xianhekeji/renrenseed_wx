// pages/areaSelect/areaSelect.js
var all_url = getApp().globalData.constUrl + "wxApi/getAllProvince.php";
var hot_url = getApp().globalData.constUrl + "wxApi/getHotProvince.php";
var get_url = getApp().globalData.constUrl + "wxApi/getUserLocationProvince.php";
var getPosition = function (that) {
  wx.authorize({
    scope: 'scope.userLocation',
    success(res) {
      console.log('getpostion1')
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          console.log('getLocation success')
          var latitude = res.latitude
          var longitude = res.longitude
          var speed = res.speed
          var accuracy = res.accuracy
          wx.setStorageSync('position', res);
          getUserLocation(that)
        },
        fail: function (res) {
          console.log('getLocation fail')
          that.setData({
            hidden: false
          })
        },
        complete: function () {
        }
      })
    },
    fail() {
      that.setData({
        hidden: false
      })
      console.log('authorize fail')
    }
  })
}
var getUserLocation = function (that) {
  console.log(get_url)
  console.log(wx.getStorageSync('position').latitude + ',' + wx.getStorageSync('position').longitude)
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
      console.log('old:' + getApp().globalData.province + 'new' + res.data.detail);
      that.setData({
        hidden: true,
        loaction_city: res.data.detail
      })
    }
  });
}



var getAllProvince = function (that) {
  that.setData({
    hiddenLoading1: false
  });
  wx.request({
    url: all_url,
    data: {
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      that.setData({
        allProvinceList: res.data.detail
      });
    },
    complete: function () {
      that.setData({
        hiddenLoading1: true
      });
    }
  });
}
var getHotProvince = function (that) {
  that.setData({
    hiddenLoading1: false
  });
  wx.request({
    url: hot_url,
    data: {
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      that.setData({
        hotProvinceList: res.data.detail
      });
    },
    complete: function () {
      that.setData({
        hiddenLoading1: true
      });
    }
  });
}
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getPosition(this);
    getHotProvince(this);
    getAllProvince(this);
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

  },
  onclickList: function (e) {
    console.log(e.currentTarget.id)
    var new_loc = e.currentTarget.id;
    getApp().globalData.province = new_loc;
    wx.setStorage({
      key: 'province',
      data: new_loc,
    });
    wx.setStorageSync('province', new_loc);
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      loaction_city: new_loc
    })
    wx.navigateBack({

    })
  }, reset: function () {
    getPosition(this);
  }
})