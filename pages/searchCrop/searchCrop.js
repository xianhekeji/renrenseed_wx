//获取应用实例
var WxSearch = require('../../wxSearch/wxSearch.js')
var url = getApp().globalData.constUrl + "wxApi/getSearchMindKeys.php";
var search_url = getApp().globalData.constUrl + "wxApi/getSearchCropList.php";
var list = [];
var variety_data;
var input_text = '';
var getData = function (that) {
  wx.request({
    url: url,
    data: {
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      variety_data = res.data.detail;
      WxSearch.initMindKeys(variety_data);
      that.setData({
        variety_data: res.data.detail,
      });
    }
  });
}
var getDataList = function (that) {

  console.log(search_url + '?' + input_text);
  that.setData({
    hiddenLoading: false
  });
  wx.request({
    url: search_url,
    //method: "POST",
    data: {
      text: input_text,
      province: getApp().globalData.province,
      searchPageNum: that.data.searchPageNum
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      console.log(res);
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
    },
    complete: function () {
      that.setData({
        hiddenLoading: true
      });
    }
  });
}
Page({
  data: {
    list: [],
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组 
    searchPageNum: 0,   // 设置加载的第几次，默认是第一次 
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏 
    searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏 
    hiddenLoading: true,
    constUrl: getApp().globalData.constUrl
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //初始化的时候渲染wxSearchdata
    WxSearch.init(that, 43, ['玉米', '水稻', '小麦', '棉花', '谷子']);
    WxSearch.initMindKeys(['玉米', '水稻', '小麦', '棉花', '谷子']);
    var that = this
    WxSearch.wxSearchInput(e, that);
    getData(that);
  },
  onclickList: function (event) {
    console.log(event);
    var p = event.currentTarget.id
    console.log(p);
    wx.navigateTo({ url: '/pages/itemCrop/itemCrop?CropId=' + p })
  },
  wxSearchFn: function (e) {
    var that = this
    this.data.searchPageNum = 0;
    WxSearch.wxSearchAddHisKey(that);
    //getDataList();
    var text = that.data.wxSearchData.value;
    console.log("input:" + text);
    input_text = that.data.wxSearchData.value;
    this.setData({
      isFromSearch: true,  //第一次加载，设置true
      searchLoading: true,  //把"上拉加载"的变量设为true，显示 
      searchLoadingComplete: false //把“没有数据”设为false，隐藏 
    });
    getDataList(that);
  },
  wxSearchInput: function (e) {
    var that = this
    WxSearch.wxSearchInput(e, that);
  },
  wxSerchFocus: function (e) {
    var that = this
    WxSearch.wxSearchFocus(e, that);
    WxSearch.wxSearchBlur(e, that);
  },
  wxSearchBlur: function (e) {
    var that = this
    WxSearch.wxSearchBlur(e, that);
  },
  wxSearchKeyTap: function (e) {
    var that = this
    WxSearch.wxSearchKeyTap(e, that);
  },
  wxSearchDeleteKey: function (e) {
    var that = this
    WxSearch.wxSearchDeleteKey(e, that);
  },
  wxSearchDeleteAll: function (e) {
    var that = this;
    WxSearch.wxSearchDeleteAll(that);
  },
  wxSearchTap: function (e) {
    var that = this
    WxSearch.wxSearchHiddenPancel(that);
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
      getDataList(this);
    }
  }
})