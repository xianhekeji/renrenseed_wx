// sendKoubei2.js
var Util = require('../../utils/util.js');
var url_getPinglun = getApp().globalData.constUrl + "wxApi/getCommentCropByRecordId.php";
var url_getthiskoubei = getApp().globalData.constUrl + "wxApi/getThisKoubeiById.php";
var url_send = getApp().globalData.constUrl + "wxApi/AddNewCommendCrop2Data.php";
var getThisKoubei = function (that) {
  wx.request({
    url: url_getthiskoubei,
    //method: "POST",
    data: {
      id: that.itemid,

    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      console.log(res.data.detail);

      that.setData({
        data: res.data.detail,

      });
    }
  });
}
var GetPinglunList = function (that) {
  console.log('获取评论' + that.itemid);
  that.setData({ hidden: false });
  wx.request({
    url: url_getPinglun,
    //method: "POST",
    data: {
      id: that.itemid,

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
var sendPinglun = function (that) {
  wx.request({
    url: url_send,
    method: "POST",
    data: Util.json2Form({
      UserId: '0',
      RecordId: that.itemid,
      Commend: that.inputText,
    }),
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      console.log(res);
      if (res.data.detail > 0) {
        that.setData({
          ToastText: '评论成功',
          hiddenToast: false
        })
      }
      that.setData({
        tip: res.data.detail.content,
      });
      GetPinglunList(that);
    }
  });
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemid: '',
    hiddenToast: true,
    inputText: '',
    constUrl: getApp().globalData.constUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options);
    this.setData({
      itemid: options.id
    });
    this.itemid = options.id;
    // GetData(this, options.id);
    getThisKoubei(this);
    GetPinglunList(this);

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

  },
  formBindsubmit: function (e) {
    if (e.detail.value.wxInputText.length == 0 || e.detail.value.wxInputText.length == 0) {
    }
    else {
      this.inputText = e.detail.value.wxInputText;
      sendPinglun(this);
    }
  },
  /**
*    toast显示时间到时处理业务 
*/
  toastHidden: function () {
    this.setData({
      hiddenToast: true
    })
  },
  onclickImg: function (e) {
    wx.navigateTo({
      url: '/pages/showImg/showImg?url=' + e.currentTarget.id,
    })
  }
})