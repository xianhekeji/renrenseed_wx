// pages/dengjiInfo/dengjiInfo.js
var AuthorizeId = '';
var url = getApp().globalData.constUrl + "mobileinterface/api/getDengjiInfoByCropId.php";
var data;
var authorize;
var GetAuthorize = function (that, CropId) {
  wx.request({
    url: url,
    //method: "POST",
    data: {
      id: CropId
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      console.log(res.data);
      that.setData({
        data: res.data.detail,
      });
    }
  });
}
Page({
  data: {
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      CropId: options.cropid
    });
    GetAuthorize(this, options.cropid);
  },
})
