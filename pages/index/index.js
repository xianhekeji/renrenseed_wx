// pages/userinfo/userinfo.js
var hot_url = getApp().globalData.constUrl + "wxApi/getHotCropList.php";
var get_url = getApp().globalData.constUrl + "wxApi/getUserLocationProvince.php";
var zuixin_url = getApp().globalData.constUrl + "wxApi/getZuixinCropList.php";
var tuijian_url = getApp().globalData.constUrl + "wxApi/getTuijianCropList.php";
var new_province = '';
var resetPosition = function (that) {
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
          wx.openSetting({
            success: (res) => {
            }
          })
        },
        complete: function () {
        }
      })
    },
    fail() {
      console.log('authorize fail')
      wx.openSetting({
        success: (res) => {
        }
      })
    }
  })
}
var getFirsetData = function (that) {
  getHot(that);
  getTuijian(that);
  getZuixin(that);

}
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
          // getHot(that);
          // getTuijian(that);
          // getZuixin(that);
        },
        complete: function () {
        }
      })
    },
    fail() {
      console.log('authorize fail')
      getHot(that);
      getTuijian(that);
      getZuixin(that);
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
      if (getApp().globalData.province != res.data.detail) {
        new_province = res.data.detail;
        that.setData({
          qiehuandata: '定位您的位置是 ' + getApp().globalData.province + ' 是否切换到 ' + new_province,
          addresshidden: false
        })
      }
      else {
        that.setData({
          loaction_city: res.data.detail
        })
        getHot(that);
        getTuijian(that);
        getZuixin(that);
      }


    }
  });
}
var getHot = function (that) {
  that.setData({
    hiddenLoading1: false
  });
  wx.request({
    url: hot_url,
    data: {
      province: getApp().globalData.province
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      that.setData({
        hot_list: res.data.detail
      });
    },
    complete: function () {
      that.setData({
        hiddenLoading1: true
      });
      wx.stopPullDownRefresh();
    }
  });
}

var getTuijian = function (that) {
  that.setData({
    hiddenLoading2: false
  });
  wx.request({
    url: tuijian_url,
    data: {
      province: getApp().globalData.province
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      that.setData({
        tuijian_list: res.data.detail
      });
    },
    complete: function () {
      that.setData({
        hiddenLoading2: true
      });
    }
  });
}

var getZuixin = function (that) {
  that.setData({
    hiddenLoading3: false
  });
  wx.request({
    url: zuixin_url,
    data: {
      province: getApp().globalData.province
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      that.setData({
        zuixin_list: res.data.detail
      });
    },
    complete: function () {
      that.setData({
        hiddenLoading3: true
      });
    }
  });
}
var app = getApp()
Page({
  data: {
    addresshidden: true,
    constUrl: getApp().globalData.constUrl
  },
  search: function () {
    wx.navigateTo({ url: '/pages/searchCrop/searchCrop' })
  },
  onclickMore: function (event) {
    console.log(event);
    var p = event.currentTarget.id
    wx.navigateTo({ url: '/pages/cropList/cropList?Class=' + p })
  },
  onclickList: function (event) {
    console.log(event);
    var p = event.currentTarget.id
    console.log(p);
    wx.navigateTo({ url: '/pages/itemCrop/itemCrop?CropId=' + p })
  },
  onShow: function () {
    getApp().globalData.province = wx.getStorageSync('province') == undefined ? '山东省' : wx.getStorageSync('province');
    if (getApp().globalData.province == undefined || getApp().globalData.province == '') {
      wx.setStorageSync('province', '山东省');
      getApp().globalData.province = '山东省';
    }
    this.setData({
      loaction_city: getApp().globalData.province
    })
    getFirsetData(this);
  },
  onLoad: function () {
    var that = this
    getPosition(this);
  }, onPullDownRefresh: function () {
    // Do something when pull down.
    var that = this;
    getHot(that);
    getTuijian(that);
    getZuixin(that);
  }, resetLocation: function () {

    wx.navigateTo({
      url: '/pages/areaSelect/areaSelect',
    })
    // resetPosition(this)
  }, cancel: function () {
    this.setData({
      addresshidden: true
    });
  },
  confirm: function () {
    this.setData({
      addresshidden: true
    });
    getApp().globalData.province = new_province;
    wx.setStorageSync('province', new_province);
    this.setData({
      loaction_city: new_province
    })
    getHot(this);
    getTuijian(this);
    getZuixin(this);
    console.log("clicked confirm");
  }, onShareAppMessage: function (res) {

    if (res.from === 'button') {
      //   // 来自页面内转发按钮
      title: '数万品种汇聚于此'
    }
    return {
      title: '数万品种汇聚于此'
    }
  }
})