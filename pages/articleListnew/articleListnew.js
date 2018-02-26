// pages/articleListnew/articleListnew.js
var url = getApp().globalData.constUrl + "wxApi/getArticleListByType.php";
var url_hot = getApp().globalData.constUrl + "wxApi/getArticleHotLabel.php";

var classid = 1;
var list = [];
var GetClass = function (that) {
  wx.request({
    url: url_hot,
    data: {
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      console.log(res.data.detail)
      that.setData({
        classid: classid,
        hot_list: res.data.detail
      })
    }

  });
};
var GetList = function (that) {
  wx.showLoading({
    title: '正在加载',
  })
  wx.request({
    url: url,
    data: {
      searchPageNum: that.data.searchPageNum,
      classid: classid
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
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
    }
    , complete: function () {
      wx.hideLoading();
      wx.stopPullDownRefresh();
    }
  });
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组 
    searchPageNum: 0,   // 设置加载的第几次，默认是第一次 
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏 
    searchLoadingComplete: false  //“没有数据”的变量，默认false，隐藏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isFromSearch: true,  //第一次加载，设置true
      searchLoading: true,  //把"上拉加载"的变量设为true，显示 
      searchLoadingComplete: false //把“没有数据”设为false，隐藏 
    });
    GetClass(this);
    GetList(this)
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
    var p = event.target.id
    console.log(event);
    wx.navigateTo({ url: '/pages/ArticleInfo/ArticleInfo?id=' + p })
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
  }, onPullDownRefresh: function () {
    // Do something when pull down.
    var that = this;
    this.setData({
      searchPageNum: 0,
      isFromSearch: true,  //第一次加载，设置true
      searchLoading: true,  //把"上拉加载"的变量设为true，显示 
      searchLoadingComplete: false //把“没有数据”设为false，隐藏 
    })
    GetList(this);
  },
  onclickClassList: function (event) {
    classid = event.currentTarget.id
    this.setData({
      classid: classid,
      searchPageNum: 0,
      isFromSearch: true,  //第一次加载，设置true
      searchLoading: true,  //把"上拉加载"的变量设为true，显示 
      searchLoadingComplete: false //把“没有数据”设为false，隐藏 
    })
    GetList(this);
  }
})