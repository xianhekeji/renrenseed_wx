// pages/companyList/companyList.js
var data;
var list = [];
var url = getApp().globalData.constUrl + "wxApi/getDistributorList.php";
var get_url = getApp().globalData.constUrl + "wxApi/getUserLocationProvince.php";

var new_province = '';
var getPosition = function (that) {

  wx.authorize({
    scope: 'scope.userLocation',
    success() {
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          console.log(res);
          var latitude = res.latitude
          var longitude = res.longitude
          var speed = res.speed
          var accuracy = res.accuracy
          wx.setStorageSync('position', res);
          getUserLocation(that)
        },
        fail: function (res) {
          GetList(that);
        },
        complete: function () {

        }
      })
    },
    fail() {
      GetList(that);
    }
  })

}
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
      if (getApp().globalData.province != res.data.detail) {
        new_province = res.data.detail;
        that.setData({
          qiehuandata: '是否将 ' + getApp().globalData.province + ' 切换到 ' + new_province,
          addresshidden: false
        })
      }
    }
  });
}
var GetList = function (that) {
  wx.showLoading({
    title: '正在加载',
  })
  console.log(that.data.searchPageNum + getApp().globalData.province);
  wx.request({
    url: url,
    data: {
      searchPageNum: that.data.searchPageNum,
      province: getApp().globalData.province
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      console.log(res.data);
      //判断是否有数据，有则取数据 
      if (res.data.detail.length != 0) {
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加 
        that.data.isFromSearch ? list = res.data.detail : list = that.data.list.concat(res.data.detail)
        if (res.data.detail.length < 10) {
          that.setData({
            list: list,
            searchLoadingComplete: true, //把“没有数据”设为true，显示 
            searchLoading: false  //把"上拉加载"的变量设为false，隐藏 
          });
        }
        else {
          that.setData({
            list: list, //获取数据数组  
            searchLoading: true   //把"上拉加载"的变量设为false，显示 
          });
        }
        //没有数据了，把“没有数据”显示，把“上拉加载”隐藏 
      } else {
        that.setData({
          searchLoadingComplete: true, //把“没有数据”设为true，显示 
          searchLoading: false  //把"上拉加载"的变量设为false，隐藏 
        });
      }
    }, complete: function () {
      wx.hideLoading();
      wx.stopPullDownRefresh();
    }
  });
};
Page({
  data: {
    addresshidden: true,
    list: [],
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组 
    searchPageNum: 0,   // 设置加载的第几次，默认是第一次 
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏 
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
    constUrl: getApp().globalData.constUrl
  },
  onLoad: function (options) {
    var that = this

    if (options.scene == 1035) {
      getPosition(this);
    }
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    console.log(wx.getStorageSync('province'));
    getApp().globalData.province = wx.getStorageSync('province') == undefined ? '山东省' : wx.getStorageSync('province');
    if (getApp().globalData.province == undefined || getApp().globalData.province == '') {
      wx.setStorageSync('province', '山东省');
      getApp().globalData.province = '山东省';
    }
    this.setData({
      loaction_city: getApp().globalData.province
    })
    GetList(this);
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
  , search: function () {
    wx.navigateTo({ url: '/pages/searchCompany/searchCompany' })
  },
  onclickList: function (event) {
    var p = event.currentTarget.id
    console.log(p);
    wx.navigateTo({ url: '/pages/companyInfo/companyInfo?Id=' + p })
  },
  makeCall: function (event) {
    var p = event.currentTarget.id;
    wx.makePhoneCall({
      phoneNumber: p
    })
  }, onPullDownRefresh: function () {
    // Do something when pull down.
    console.log('刷新');
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: 0, //每次触发上拉事件，把searchPageNum+1
        isFromSearch: true  //触发到上拉事件，把isFromSearch设为为false
      });
      GetList(this);
    }
  },

  onReachBottom: function () {
    // Do something when page reach bottom.
    console.log('circle 下一页');
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1, //每次触发上拉事件，把searchPageNum+1
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false
      });
      GetList(this);
    }
  }, cancel: function () {
    this.setData({
      addresshidden: true
    });
  },
  confirm: function () {
    this.setData({
      addresshidden: true,
      loaction_city: new_province
    });
    getApp().globalData.province = new_province;
    wx.setStorageSync('province', new_province);
    GetList(this);
  }, resetLocation: function () {

    wx.navigateTo({
      url: '/pages/areaSelect/areaSelect',
    })
    // resetPosition(this)
  }, cancel: function () {
    this.setData({
      addresshidden: true
    });
  }
})