var CropId;
var CropName;
var imgs = [];
var photos;
var currentTab;
var enlist;
var koubeiList = [];
var list = [];
let animationShowHeight = 300;
var url = getApp().globalData.constUrl + "wxApi/getCropById.php";
var authorize_url = getApp().globalData.constUrl + "wxApi/getAuthorizeByCropId.php";
var url_koubei = getApp().globalData.constUrl + "wxApi/getCropCommentByCropId.php";
var url_koubei_main = getApp().globalData.constUrl + "wxApi/getCropMainCommentByCropId.php";
var url_distributor = getApp().globalData.constUrl +
  "wxApi/getDistributorListByCropId.php";
var url_enterprise = getApp().globalData.constUrl +
  "wxApi/getEnterpriseListByCropId.php";
var url_Article = getApp().globalData.constUrl +
  "wxApi/getArticleByCrop.php";
var url_Brand = getApp().globalData.constUrl +
  "wxApi/getBrandByCropId.php";
var url_photo = getApp().globalData.constUrl +
  "wxApi/getCropPhotos.php";
var qrcode_url = getApp().globalData.constUrl + "wxApi/getCropQRCode.php";
var Util = require('../../utils/util.js');
var data;
var authorize;

var thisCropId;
var GetData = function (that, CropId) {
  wx.request({
    url: url,
    //method: "POST",
    data: {
      CropId: CropId,
      province: getApp().globalData.province
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      console.log("品种名称" + res.data.detail.VarietyName)
      CropName = res.data.detail.VarietyName;
      var imgs_tmp = res.data.detail.img;
      imgs = [];
      var i = 0;
      var top = '';
      if (res.data.detail.isCrop == 1) {
        top = getApp().globalData.constUrl + 'files/cropImgs/';
      }
      else {
        top = getApp().globalData.constUrl + 'files/cropImgs/';
      }
      for (i; i < res.data.detail.img.length; i++) {
        imgs.unshift(top + imgs_tmp[i]);
      }
      console.log(res.data.detail)
      data = res.data.detail;
      that.setData({
        data: res.data.detail,
        imgs: imgs
      });
      GetArticle(that);
      GetKoubeiList(that);
    }
  });
}

var GetPhotos = function (that, CropId) {
  wx.request({
    url: url_photo,
    //method: "POST",
    data: {
      CropId: CropId
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      photos = res.data.detail;
      that.setData({
        photos: res.data.detail,
      });
    }
  });
}
var GetQRCode = function (that, CropId) {
  wx.request({
    url: qrcode_url,
    //method: "POST",
    data: {
      CropId: CropId
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      that.setData({
        qrcode_url: res.data.detail,
      });
    }
  });
}
var GetBrand = function (that, CropId) {
  wx.request({
    url: url_Brand,
    //method: "POST",
    data: {
      CropId: CropId,
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      console.log(res.data)
      that.setData({
        BrandList: res.data.detail,
      });
    }
  });
}
var GetArticle = function (that) {
  console.log(data.VarietyName + data.CropCategoryName1 + data.CropCategoryName2)
  wx.request({
    url: url_Article,
    data: {
      searchPageNum: that.data.searchPageNum,
      cropname: data.VarietyName,
      CropCategoryName1: data.CropCategoryName1,
      CropCategoryName2: data.CropCategoryName2
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      console.log(res.data.detail)
      if (res.data.detail.length != 0) {
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加 
        that.data.isFromSearch ? list = res.data.detail : list = list.concat(res.data.detail)
        if (res.data.detail.length < 5) {
          that.setData({
            articleList: list,
            searchLoadingComplete: true, //把“没有数据”设为true，显示 
            searchLoading: false  //把"上拉加载"的变量设为false，隐藏 
          });
        }
        else {
          that.setData({
            articleList: list, //获取数据数组  
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
    }, complete: function () {
      wx.hideLoading();
      wx.stopPullDownRefresh();
    }
  });
}
var GetEnterprise = function (that, CropId) {
  wx.request({
    url: url_enterprise,
    //method: "POST",
    data: {
      cropid: CropId,
      lat: wx.getStorageSync('position').latitude,
      lon: wx.getStorageSync('position').longitude
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      enlist = res.data.detail,
        that.setData({
          enterpriseList: res.data.detail,
          novip: res.data.resultNote
        });
    }
  });
}
var GetDistributor = function (that, CropId) {
  wx.request({
    url: url_distributor,
    //method: "POST",
    data: {
      cropid: CropId,
      lat: wx.getStorageSync('position').latitude,
      lon: wx.getStorageSync('position').longitude
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {

      that.setData({
        distributorList: res.data.detail,
      });
    }
  });
}
var GetKoubeiList = function (that) {
  console.log("num" + that.data.koubei_searchPageNum)
  wx.request({
    url: url_koubei,
    //method: "POST",
    data: {
      searchPageNum: that.data.koubei_searchPageNum,
      id: data.CropId
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      console.log(res.data.detail)
      if (res.data.detail.length != 0) {
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加 
        that.data.koubei_isFromSearch ? koubeiList = res.data.detail : koubeiList = that.data.koubeiList.concat(res.data.detail)
        if (res.data.detail.length < 5) {
          that.setData({
            koubeiList: koubeiList,
            koubei_searchLoadingComplete: true, //把“没有数据”设为true，显示 
            koubei_searchLoading: false  //把"上拉加载"的变量设为false，隐藏 
          });
        }
        else {
          that.setData({
            koubeiList: koubeiList, //获取数据数组  
            koubei_searchLoading: true   //把"上拉加载"的变量设为false，显示 
          });
        }
        //没有数据了，把“没有数据”显示，把“上拉加载”隐藏 
      } else {
        that.setData({
          koubei_searchLoadingComplete: true, //把“没有数据”设为true，显示 
          koubei_searchLoading: false  //把"上拉加载"的变量设为false，隐藏 
        });
      }
    }, complete: function () {
      wx.hideLoading();
      wx.stopPullDownRefresh();
    }
  });
}
var GetMainKoubeiList = function (that, CropId) {
  wx.request({
    url: url_koubei_main,
    //method: "POST",
    data: {
      id: CropId
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {

      that.setData({
        koubeiMainList: res.data.detail,
      });
    }
  });
}
var GetAuthorize = function (that, CropId) {
  that.setData({ crop_info_hidden: false });
  wx.request({
    url: authorize_url,
    //method: "POST",
    data: {
      CropId: CropId
    },
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      that.setData({
        authorize: res.data.detail,
        crop_info_hidden: true
      });
    }
  });
}
Page({
  data: {
    navbar: ['综合', '口碑', '文章', '企商', '图库'],
    currentTab: 0,
    crop_info_hidden: true,
    img_hidden: false,
    authorize: [],
    CropId: '',
    constUrl: getApp().globalData.constUrl,
    isshow: 1,
    showModalStatus: false,
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组 
    searchPageNum: 0,   // 设置加载的第几次，默认是第一次 
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏 
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
    koubei_isFromSearch: true,
    koubei_searchPageNum: 0,   // 设置加载的第几次，默认是第一次 
    koubei_searchLoading: false,
    koubei_searchLoadingComplete: false,

  },
  showView: function (event) {

    if (event.target.id = "button_1") {
      this.setData({ crop_info_hidden: true, img_hidden: false });
    }
    if (event.target.id = "button_2") {
      this.setData({ crop_info_hidden: false, img_hidden: true });
    }
  },
  onclickKoubeiList: function (event) {
    var p = event.currentTarget.id
    wx.navigateTo({ url: '/pages/sendKoubei2/sendKoubei2?id=' + p })
  },
  onclickList: function (event) {
    var p = event.currentTarget.id
    wx.navigateTo({ url: '/pages/authorizeInfo/authorizeInfo?id=' + p })
  },
  dengjiXX: function () {
    wx.navigateTo({ url: '/pages/dengjiInfo/dengjiInfo?cropid=' + this.CropId })
  },
  sendKoubei: function () {
    wx.navigateTo({ url: '/pages/sendKoubei/sendKoubei?id=' + this.CropId })
  },
  show_more: function () {
    this.setData({
      currentTab: 1
    });
    //wx.navigateTo({ url: '/pages/allKoubei/allKoubei?id=' + this.CropId })
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: '品种详情' })
    wx.getSystemInfo({
      success: function (res) {
        this.setData({
          windowWidth: res.windowWidth / 4,
        })
        var windowWidth = res.windowWidth;
        var windowHeight = res.windowHeight;
      }
    })

    // 页面初始化 options为页面跳转所带来的参数
    var scene = decodeURIComponent(options.scene)
    if (options.scene == undefined) {
      this.setData({
        CropId: options.CropId
      });
      this.CropId = options.CropId;
      CropId = options.CropId;
    }
    else {
      this.setData({
        CropId: scene
      });
      this.CropId = scene;
      CropId = scene;
    }
    GetData(this, this.CropId);
    GetQRCode(this, this.CropId);
    GetBrand(this, this.CropId);
    GetAuthorize(this, this.CropId);

    GetMainKoubeiList(this, this.CropId);
    GetDistributor(this, this.CropId);
    GetEnterprise(this, this.CropId);
    GetPhotos(this, this.CropId);
  },
  navbarTap: function (e) {
    currentTab = e.currentTarget.dataset.idx;
    this.setData({ currentTab: e.currentTarget.dataset.idx })
  },
  onClickKoubeiList: function (e) {
    wx.navigateTo({
      url: '/pages/sendKoubei2/sendKoubei2?id=' + e.currentTarget.id,
    })
  },
  onShow: function () {
    GetMainKoubeiList(this, this.data.CropId);
  },
  onclickDisList: function (e) {
    var p = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/companyInfo/companyInfo?Id=' + p,
    })
  },
  onclickBrand: function (e) {
    var p = e.currentTarget.id;
    wx.makePhoneCall({
      phoneNumber: p
    })
  },
  callThis: function (event) {
    var p = event.target.id;
    wx.makePhoneCall({
      phoneNumber: p.replace(/[^0-9]/ig, "")
    })
  }, onclickArticleList: function (event) {
    var p = event.currentTarget.id;
    wx.navigateTo({
      url: '/pages/ArticleInfo/ArticleInfo?id=' + p,
    })
  }
  , onShareAppMessage: function (res) {
    if (res.from === 'button') {
      //   // 来自页面内转发按钮
    }
    return {
      title: CropName,
      path: '/pages/itemCrop/itemCrop?CropId=' + this.CropId,
      desc: '人人种品种大全',
      success: function (res) {
        // 转发成功
        console.log(res);
      },
      fail: function (res) {
        // 转发失败
        console.log(res);
      }
    }
  }, onclickImg: function (e) {
    // wx.navigateTo({
    //   url: '/pages/showImg/showImg?url=' + e.currentTarget.id,
    // })
    wx.previewImage({
      urls: [e.currentTarget.id],
    })
  }, onclickQRcode: function (e) {
    // wx.navigateTo({
    //   url: '/pages/showImg/showImg?url=' + e.currentTarget.id,
    // })
    wx.previewImage({
      urls: [e.currentTarget.id],
    })
  }, showItemCropImgs: function (e) {
    console.log(e.currentTarget.id)
    wx.previewImage({
      current: e.currentTarget.id,
      urls: photos,
    })
  }, showCropImgs: function (e) {
    this.setData({
      currentTab: 4
    });
    // wx.previewImage({
    //   urls: imgs,
    // })
  }, unVipShow: function () {
    this.setData({
      isshow: 1
    })
  }, VipShow: function () {
    this.setData({
      isshow: 0
    })
  }, showModal: function (e) {
    console.log(e)
    // 显示遮罩层  
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(animationShowHeight).step()
    var aa = e.currentTarget.id.split(";");
    aa.push("取消");
    this.setData({
      animationData: animation.export(),
      showModalStatus: true,
      Telephone: aa
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
  }, onReachBottom: function () {
    // Do something when page reach bottom.
    console.log('circle 下一页' + currentTab);
    let that = this;
    if (currentTab == 1) {
      if (that.data.koubei_searchLoading && !that.data.koubei_searchLoadingComplete) {
        that.setData({
          koubei_searchPageNum: that.data.koubei_searchPageNum + 1, //每次触发上拉事件，把searchPageNum+1
          koubei_isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false: false  //触发到上拉事件，把isFromSearch设为为false
        });
        GetKoubeiList(this);
      }
    } else if (currentTab == 2) {
      if (that.data.searchLoading && !that.data.searchLoadingComplete) {
        that.setData({
          searchPageNum: that.data.searchPageNum + 1, //每次触发上拉事件，把searchPageNum+1
          isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false
        });

        GetArticle(this);
      }
    }
  }, onPullDownRefresh: function () {
    // Do something when pull down.
    console.log(currentTab)
    var that = this;

    if (currentTab == 1) {
      this.setData({
        koubei_searchPageNum: 0,
        koubei_isFromSearch: true,  //第一次加载，设置true
        koubei_searchLoading: true,  //把"上拉加载"的变量设为true，显示 
        koubei_searchLoadingComplete: false //把“没有数据”设为false，隐藏 
      })
      GetKoubeiList(this);
    }
    else if (currentTab == 2) {
      this.setData({
        searchPageNum: 0,
        isFromSearch: true,  //第一次加载，设置true
        searchLoading: true,  //把"上拉加载"的变量设为true，显示 
        searchLoadingComplete: false //把“没有数据”设为false，隐藏 
      })
      GetArticle(this);
    }

  }
})
