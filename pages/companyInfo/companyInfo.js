// pages/companyInfo/companyInfo.js
var url = getApp().globalData.constUrl + "wxApi/getDistributorInfo.php";
var url_koubei = getApp().globalData.constUrl + "wxApi/getDistributorCommentByDistributorId.php";
var url_croplist = getApp().globalData.constUrl + "wxApi/getCropByEnterprise.php";
var qrcode_url = getApp().globalData.constUrl + "wxApi/getEnterpriseQRCode.php";
let animationShowHeight = 300;
var GetQRCode = function (that) {
  wx.request({
    url: qrcode_url,
    //method: "POST",
    data: {
      CompanyId: that.CompanyId
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      console.log("qrcode:" + res.data.detail);
      that.setData({
        qrcode_url: res.data.detail,
      });
    }
  });
}
var getDistributorInfo = function (that) {
  wx.request({
    url: url,
    data: {
      companyId: that.CompanyId,
      lat: wx.getStorageSync('position').latitude,
      lon: wx.getStorageSync('position').longitude
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      that.setData({
        data: res.data.detail
      });
      that.setData({
        hidden: true
      });
    }
  });
};

var getCropList = function (that) {
  wx.request({
    url: url_croplist,
    //method: "POST",
    data: {
      enid: that.CompanyId
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      console.log(res);
      that.setData({
        cropList: res.data.detail,
      });
    }
  });
}
var GetKoubeiList = function (that) {
  wx.request({
    url: url_koubei,
    //method: "POST",
    data: {
      id: that.CompanyId
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      console.log(res);
      that.setData({
        koubeiList: res.data.detail,
      });
    }
  });
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CompanyId: '',
    constUrl: getApp().globalData.constUrl,
    animationData: "",
    showModalStatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var scene = decodeURIComponent(options.scene)
    console.log("参数：" + scene);
    if (options.scene == undefined) {
      // 页面初始化 options为页面跳转所带来的参数
      this.setData({
        CompanyId: options.Id
      });
      this.CompanyId = options.Id;
    }
    else {
      this.setData({
        CompanyId: scene
      });
      this.CompanyId = scene;
    }


    getDistributorInfo(this);
    GetQRCode(this);
    GetKoubeiList(this);
    getCropList(this);
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
    wx.getSystemInfo({
      success: function (res) {
        animationShowHeight = res.windowHeight;
      }
    })
    GetKoubeiList(this, this.data.CropId);

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
  moreCrop: function () {
    wx.navigateTo({ url: '/pages/moreEnterpriseCrop/moreEnterpriseCrop?id=' + this.CompanyId })
  },
  sendKoubei: function () {
    wx.navigateTo({ url: '/pages/sendDistributorKoubei/sendDistributorKoubei?id=' + this.CompanyId })
  },
  show_more: function () {
    wx.navigateTo({ url: '/pages/moreDistributorKoubei/moreDistributorKoubei?id=' + this.CompanyId })
  },
  onclickList: function (event) {
    console.log(event);
    var p = event.currentTarget.id
    console.log(p);
    wx.navigateTo({ url: '/pages/itemCrop/itemCrop?CropId=' + p })
  },
  makeCall: function (event) {
    console.log(event.currentTarget.id)
    var p = event.currentTarget.id;
    wx.makePhoneCall({
      phoneNumber: p
    })
  },
  onClickKoubeiList: function (e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/sendCompanyKoubei2/sendCompanyKoubei2?id=' + e.currentTarget.id,
    })
  }, onclickQRcode: function (e) {
    // wx.navigateTo({
    //   url: '/pages/showImg/showImg?url=' + e.currentTarget.id,
    // });
    wx.previewImage({
      urls: [e.currentTarget.id],
    })
  },
  onclickJianjie: function (e) {
    wx.navigateTo({
      url: '/pages/companyIntroduce/companyIntroduce?id=' + e.currentTarget.id,
    })
  }, showModal: function () {
    // 显示遮罩层  
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(animationShowHeight).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    // 隐藏遮罩层  
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation;
    animation.translateY(animationShowHeight).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  }, onclickTel: function (e) {
    console.log(e.currentTarget.id)
    var p = e.currentTarget.id;
    if (p == "取消") {
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation;
      animation.translateY(animationShowHeight).step()
      this.setData({
        animationData: animation.export(),
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export(),
          showModalStatus: false
        })
      }.bind(this), 200)
    }
    else {
      wx.makePhoneCall({
        phoneNumber: p.replace(/[^0-9]/ig, "")
      })
    }
  }, onclickImg: function (e) {
    wx.previewImage({
      urls: [e.currentTarget.id],
    })
  }
})