//itemNew.js
var Util = require('../../utils/util.js');
var url_crop = getApp().globalData.constUrl + "wxApi/getCropListByVariety.php";
var list = [];

var new_province = '';
var get_url = getApp().globalData.constUrl + "wxApi/getUserLocationProvince.php";
var getPosition = function (that) {
  wx.authorize({
    scope: 'scope.userLocation',
    success() {
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
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
  console.log(that.data.searchPageNum);
  that.setData({ hiddenLoading: false });
  wx.request({
    url: url_crop,
    //method: "POST",
    data: {
      searchPageNum: that.data.searchPageNum,
      variety_name: that.variety_name,
      province: getApp().globalData.province
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      //判断是否有数据，有则取数据 
      if (res.data.detail.length != 0) {
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加 
        that.data.isFromSearch ? list = res.data.detail : list = that.data.list.concat(res.data.detail)
        if (res.data.detail.length < 20) {
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
      that.setData({ hiddenLoading: true });
    }
  });
};

Page({
  data: {
    // text:"这是一个页面" 
    navbar: [],
    currentTab: 0,
    list: [],
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组 
    searchPageNum: 0,   // 设置加载的第几次，默认是第一次 
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏 
    searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏 
    addresshidden: true,
    constUrl: getApp().globalData.constUrl
  },
  onclickList: function (event) {
    console.log(event);
    var p = event.currentTarget.id
    console.log(p);
    wx.navigateTo({ url: '/pages/itemCrop/itemCrop?CropId=' + p })
  },
  onLoad: function (options) {

    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      variety_name: options.variety_name,
      isFromSearch: true,  //第一次加载，设置true
      searchLoading: true,  //把"上拉加载"的变量设为true，显示 
      searchLoadingComplete: false //把“没有数据”设为false，隐藏 

    });
    this.variety_name = options.variety_name
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    console.log('getposition');
    //GetList(that);
    //getPosition(that);
  },
  navbarTap: function (e) {
    this.setData({ currentTab: e.currentTarget.dataset.idx })
  },
  onShow: function () {
    //  在页面展示之后先获取一次数据  
    var that = this;
    GetList(that);
  },
  bindDownLoad: function () {
    //  该方法绑定了页面滑动到底部的事件   
    var that = this;
    GetList(that);
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
      addresshidden: true
    });
    getApp().globalData.province = new_province;
    wx.setStorageSync('province', new_province);
    GetList(this);
  }
})