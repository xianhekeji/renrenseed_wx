//itemNew.js
var Util = require('../../utils/util.js');
var url = getApp().globalData.constUrl +"mobileinterface/api/getNewByID.php";
var url_send = getApp().globalData.constUrl +"mobileinterface/api/CommentNew.php";

var url_getPinglun = getApp().globalData.constUrl +"mobileinterface/api/GetCommentByNewId.php";
var data;
var GetData = function (that, itemid) {
  console.log('获取' + itemid);
  that.setData({ hidden: false });
  wx.request({
    url: url,
    //method: "POST",
    data: {
      itemid: itemid,

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
var GetPinglunList = function (that, itemid) {
  console.log('获取评论' + itemid);
  that.setData({ hidden: false });
  wx.request({
    url: url_getPinglun,
    //method: "POST",
    data: {
      id: itemid,

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
var sendPinglun = function (that)
{
  console.log(that.inputText + that.itemid);
  wx.request({
    url: url_send,
    method: "POST",
    data: {
      UserId: '0',
      Comment: that.inputText,
      CommentFromNewId: that.itemid,
      CommentFromUser: '0'
    },
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      console.log(res.data.detail);
      if (res.data.detail>0)
      {
        wx.showToast({
          title: '评论成功！',
        })
      }
      that.setData({
        tip: res.data.detail.content,
      });
    }
  });
}
Page({
  data: {
    // text:"这是一个页面" 
    itemid: '',
    hiddenToast: true,
    inputText:'',
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      itemid: options.id
    });
    this.itemid = options.id;
    GetData(this, options.id);
    GetPinglunList(this,options.id);
  },
  formBindsubmit: function (e) {
    if (e.detail.value.wxInputText.length == 0 || e.detail.value.wxInputText.length == 0) {
    }
    else
    {
      this.inputText = e.detail.value.wxInputText;
      sendPinglun(this);
    }
  },
  onclickList: function (event) {
    console.log(event);
    var p = event.currentTarget.id
    console.log(p);
    wx.navigateTo({ url: '/pages/comment2List/comment2List?id=' + p })
  },
  /**
 *    toast显示时间到时处理业务 
 */
  toastHidden: function () {
    this.setData({
      hiddenToast: true
    })
  }
})