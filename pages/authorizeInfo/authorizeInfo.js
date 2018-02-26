var AuthorizeId = '';
var url = getApp().globalData.constUrl + "wxApi/getAuthorizeById.php";
var data;
var authorize;
var GetAuthorize = function (that, id) {
  console.log(id);
  wx.request({
    url: url,
    //method: "POST",
    data: {
      id: id
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
      AuthorizeId: options.id
    });
    GetAuthorize(this, options.id);
  },
})
