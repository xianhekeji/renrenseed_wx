// pages/ArticleInfo/ArticleInfo.js
var disCode = require('../../wxParse/wxDiscode.js');
var WxParse = require('../../wxParse/wxParse.js');
var url = getApp().globalData.constUrl +
  "wxApi/getArticleById.php";
var getData = function (that) {
  wx.request({
    url: url,
    //method: "POST",
    data: {
      Id: that.data.ArtId,
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      console.log(disCode.strDiscode(res.data.detail.ArticleContent));
      var article = disCode.strDiscode(res.data.detail.ArticleContent);
      /**
      * WxParse.wxParse(bindName , type, data, target,imagePadding)
      * 1.bindName绑定的数据名(必填)
      * 2.type可以为html或者md(必填)
      * 3.data为传入的具体数据(必填)
      * 4.target为Page对象,一般为this(必填)
      * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
      */
      WxParse.wxParse('article', 'html', article, that, 5);



      that.setData({
        data: res.data.detail,
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
    console.log(options.id);
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      ArtId: options.id
    });
    getData(this);
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
  
  }
})