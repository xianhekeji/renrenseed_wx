// pages/alertAvatar/alertAvatar.js
var images = '';
var userInfo = {};
var url = getApp().globalData.constUrl + "wxApi/wxLogin/updateAvatar.php";
var updateAvatar = function (that) {
  console.log(userInfo.UserId);
  wx.uploadFile({
    url: url,
    header: {
      "Content-Type": "multipart/form-data"
    },
    filePath: images,
    name: 'file',
    formData: {
      UserId: userInfo.UserId
    },
    success: function (res) {
      wx.hideLoading();
      that.setData({
        ToastText: JSON.parse(res.data).detail.content,
        hiddenToast: false
      })
      wx.navigateBack({
        delta: 1
      })
      console.log(res.data);
    }
  });
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hiddenToast: true,
    isShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userInfo = JSON.parse(options.userinfo);
    console.log(options.userinfo);
    this.setData({
      UserAvatar: userInfo.UserAvatar
    })
  },
  /**
   *上传新头像 
   */
  alertImg: function () {

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
  alertImg: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#056bb8",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })
  }, chooseWxImage: function (type) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        images = res.tempFilePaths[0];
        that.setData({
          UserAvatar: res.tempFilePaths[0],
          isShow: true
        })
      }
    })
  },
  updateAvatar: function () {
    wx.showLoading({
      title: '正在上传，请稍候。。。',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 30000)
    updateAvatar(this);
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