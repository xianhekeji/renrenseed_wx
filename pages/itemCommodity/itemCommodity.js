// pages/itemCommodity/itemCommodity.js
var Util = require('../../utils/util.js');
var url = getApp().globalData.constUrl + "mobileinterface/api/getCommodityByID.php";
var getData = function (that) {
  that.setData({ hidden: false });
  wx.request({
    url: url,
    //method: "POST",
    data: {
      id: that.CommodityId,

    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      console.log(res.data.detail);

      that.setData({
        data: res.data.detail,

      });
      that.setData({
        hidden: true
      });
    }
  });
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
  CommodityId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      CommodityId: options.Id
    });
    this.CommodityId = options.Id;
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  }
})