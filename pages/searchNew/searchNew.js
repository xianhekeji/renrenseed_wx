//获取应用实例
var WxSearch = require('../../wxSearch/wxSearch.js')
var url = getApp().globalData.constUrl +"mobileinterface/api/getSearchMindKeys.php";
var search_url = getApp().globalData.constUrl +"mobileinterface/api/getDynamic.php";
var list;
var variety_data;
var getData = function (that) {
  console.log(text);
  that.setData({ hidden: false });
  wx.request({
    url: url,
    //method: "POST",
    data: {
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      console.log(res.data.detail);
      variety_data = res.data.detail;
      WxSearch.initMindKeys(variety_data);
      that.setData({
        variety_data: res.data.detail,
      });
      that.setData({
        hidden: true
      });
    }
  });
}
var getDataList = function (that,text) {
  that.setData({ hidden: false });
  wx.request({
    url: search_url,
    //method: "POST",
    data: {
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      console.log(res.data.detail);
      that.setData({
        list: res.data.detail,
      });
      that.setData({
        hidden: true
      });
    }
  });
}
Page({
  data: {
    list:[]
    // wxSearchData:{
    //   view:{
    //     isShow: true
    //   }
    // }
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //初始化的时候渲染wxSearchdata
    WxSearch.init(that, 43, ['玉米', '水稻', '小麦', '棉花', '谷子']);
    WxSearch.initMindKeys(['玉米', '水稻', '小麦', '棉花', '谷子']);
    GetData(that);
  },
  wxSearchFn: function (e) {
    var that = this
    WxSearch.wxSearchAddHisKey(that);
    //getDataList();
    var text = that.data.wxSearchData.value;
    console.log(text);
    getDataList(that, text);
  },
  wxSearchInput: function (e) {
    var that = this
    WxSearch.wxSearchInput(e, that);
  },
  wxSerchFocus: function (e) {
    var that = this
    WxSearch.wxSearchFocus(e, that);
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
  }
})