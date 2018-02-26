// /pages/searchCompany/searchCompany.js
var WxSearch = require('../../wxSearch/wxSearch.js')
var url = getApp().globalData.constUrl + "wxApi/getSearchCompanyMindKeys.php";
var search_url = getApp().globalData.constUrl + "wxApi/getSearchDistributorList.php";
var list;
var variety_data;
var input_text = '';
var getData = function (that) {
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
var getDataList = function (that) {
  console.log("开始查询")
  that.setData({
    hiddenLoading: false
  });
  wx.request({
    url: search_url,
    //method: "POST",
    data: {
      text: input_text == undefined ? '' : input_text,
      searchPageNum: that.data.searchPageNum
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      console.log(res.data);
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
    hiddenLoading: true,
    searchPageNum: 0,
    constUrl: getApp().globalData.constUrl
  },
  onLoad: function () {
    console.log('onLoad')
    //初始化的时候渲染wxSearchdata
    var that = this
    WxSearch.init(that, 43, ['商河县万家丰种业', '玫瑰镇姜国农资']);
    WxSearch.initMindKeys(['玉米', '水稻', '小麦', '棉花', '谷子']);

    WxSearch.wxSearchInput(e, that);
    getData(that);
  },
  onclickList: function (event) {
    var p = event.currentTarget.id
    wx.navigateTo({ url: '/pages/companyInfo/companyInfo?Id=' + p })
  },
  wxSearchFn: function (e) {
    var that = this
    this.data.searchPageNum = 0;
    // WxSearch.wxSearchAddHisKey(that);
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