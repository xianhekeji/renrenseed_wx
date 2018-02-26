// pages/conditionCropResult/conditionCropResult.js
var checkClass = '';
var checkGen = '';
var checkYear = '';
var checkStatus = '';
var checkClass2 = '';
var checkAddress = '';
var checkRegionPro = '';
var list = [];
var url = getApp().globalData.constUrl + "wxApi/getConditionSearchData.php";
var YearData;
var new_province = '';
var Util = require('../../utils/util.js');
var get_url = getApp().globalData.constUrl + "wxApi//getUserLocationProvince.php";
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
          getSearchData(this);
        },
        complete: function () {

        }
      })
    },
    fail() {
      getSearchData(this);
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
var getSearchData = function (that) {
  console.log(checkStatus)
  that.setData({
    hiddenLoading: false,

  });
  wx.request({
    url: url,
    // method: "POST",
    data: {
      checkClass: checkClass,
      checkGen: checkGen,
      checkStatus: checkStatus,
      checkYear: checkYear,
      checkTwoClass: checkClass2,
      checkAddress: checkAddress,
      checkRegionPro: checkRegionPro,
      province: getApp().globalData.province,
      searchPageNum: that.data.searchPageNum,
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
      that.setData({
        hiddenLoading: true
      });
    }
  });
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组 
    searchPageNum: 0,   // 设置加载的第几次，默认是第一次 
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏 
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏 
    addresshidden: true,
    constUrl: getApp().globalData.constUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    checkClass = options.checkClass;
    checkGen = options.checkGen;
    checkYear = options.checkYear;
    checkClass2 = options.checkClass2;
    checkAddress = options.checkAddress;
    checkStatus = options.checkStatus;
    checkRegionPro = options.checkRegionPro;
    this.setData({
      classid: options.id,
      isFromSearch: true,  //第一次加载，设置true
      searchLoading: true,  //把"上拉加载"的变量设为true，显示 
      searchLoadingComplete: false //把“没有数据”设为false，隐藏 
    });
    getApp().globalData.province = wx.getStorageSync('province');
    console.log('getposition');
    getSearchData(this);
    //getPosition(this);
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
  onclickList: function (event) {
    console.log(event);
    var p = event.currentTarget.id
    console.log(p);
    wx.navigateTo({ url: '/pages/itemCrop/itemCrop?CropId=' + p })
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
      getSearchData(this);
    }
  },
  onPullDownRefresh: function () {
    // Do something when pull down.
    console.log('刷新');
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: 0, //每次触发上拉事件，把searchPageNum+1
        isFromSearch: true  //触发到上拉事件，把isFromSearch设为为false
      });
      getSearchData(this);
    }
  }, resetLocation: function () {
    resetPosition(this)
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
    getSearchData(this);
  }
})