// pages/sendKoubei/sendKoubei.js
var Util = require('../../utils/util.js');
var CropId = '';
var level = 0;
var i = 0;
var new_id = '';
var UserId = '';
var inputContent = {};
var upload_imgs = [];
var imgs = [];
var imgs_min = [];
var url = getApp().globalData.constUrl + "wxApi/addNewKoubei.php";
var add_url = getApp().globalData.constUrl + "wxApi/addNewKoubeiNew.php";
var img_url = getApp().globalData.constUrl + "wxApi/addKoubeiImgs.php";

var addNew = function (that) {
  wx.request({
    url: add_url,
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: Util.json2Form({
      Comment: inputContent['input_content'],
      CommentLevel: level * 2,
      CropId: CropId,
      UserId: getApp().globalData.userData.UserId,
      imgs: imgs,
      imgs_min: imgs_min,
    }),
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    success: function (res) {
      console.log(res.data)
      if (res.data.detail.status == 0) {
        wx.showModal({
          title: '点评成功',
          content: res.data.detail.content,
          showCancel: false,
          confirmText: "确定",
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
        upload_imgs = [];
        that.setData({
          tempFilePaths: [],
        })

      }
      else {
        wx.showModal({
          title: '点评失败',
          content: res.data.detail.content,
          showCancel: false,
          confirmText: "确定",
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              
              // wx.navigateBack({
              //   delta: 1
              // })
            }
          }
        })
      }
    },
    fail: function () {
      // fail
      // wx.hideToast();
    },
    complete: function () {
      // complete
      wx.hideLoading();
    }
  })
}

function upload_img_server(that, img_path, i) {
  const uploadTask = wx.uploadFile({
    url: img_url, //仅为示例，非真实的接口地址
    filePath: img_path,
    name: 'file',
    formData: {
      UserId: getApp().globalData.userData.UserId,
      imageid: i
    },
    success: function (res) {
      var data = res.data
      console.log(JSON.parse(res.data).detail.status)
      if (JSON.parse(res.data).detail.status == 0) {
        imgs.push(JSON.parse(res.data).detail.img);
        imgs_min.push(JSON.parse(res.data).detail.imgmin);
        upload_imgs[i].serverurl = JSON.parse(res.data).detail.img;
        upload_imgs[i].serverurl_min = JSON.parse(res.data).detail.img;
        upload_imgs[i].pro = "上传成功"
        that.setData({
          tempFilePaths: upload_imgs,
        })
      }
      else {
        upload_imgs[i].pro = JSON.parse(res.data).detail.content
        that.setData({
          tempFilePaths: upload_imgs,
        })
      }
    }
  })

  uploadTask.onProgressUpdate((res) => {
    upload_imgs[i].pro = res.progress + "%"
    console.log('上传进度', res.progress)
    console.log('已经上传的数据长度', res.totalBytesSent)
    console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
    that.setData({
      tempFilePaths: upload_imgs,
    })
  })
}
var GetUser = function () {
  //调用应用实例的方法获取全局数据
  getApp().getUserData(function (userData) {
    console.log(userData);
    if (getApp().globalData.userData == null || getApp().globalData.userData == undefined) {
      wx.openSetting({
        success: (res) => {
          res.authSetting = {
            "scope.userInfo": true,
            "scope.userLocation": true
          }
          getApp().OnLogin();
        }
      })
    }
    else {
      UserId = getApp().globalData.userData.UserId;
    }
  })
}
var SetStar = function (that, key) {
  if (key == 5 || key == 4.5) {
    that.setData({
      star_text: '非常推荐'
    });
  }
  else if (key == 4 || key == 3.5) {
    that.setData({
      star_text: '推荐'
    });
  }
  else if (key == 3 || key == 2.5) {
    that.setData({
      star_text: '较好'
    });
  }
  else if (key == 2 || key == 1.5) {
    that.setData({
      star_text: '一般'
    });
  }
  else if (key == 1 || key == 0.5 || key == 0) {
    that.setData({
      star_text: '不推荐'
    });
  }
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../images/normal.png',
    selectedSrc: '../../images/selected.png',
    halfSrc: '../../images/half.png',
    key: 0,//评分
    CropId: '',
    hiddenToast: true,
    tempFilePaths: [],
    inputContent: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id);
    upload_imgs = []; imgs_min = [];
    imgs = [];
    i = 0;
    new_id = '';
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      CropId: options.id,
      tempFilePaths: null
    });
    CropId = options.id;
    UserId = getApp().globalData.userData.UserId
    if (UserId == undefined || UserId == '') {
      console.log('userid is null');
      GetUser();
    }

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
    // this.setData({
    //   tempFilePaths: []
    // });
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
  //点击右边,半颗星
  selectLeft: function (e) {
    console.log(e);
    var key = e.currentTarget.dataset.key
    console.log(key);
    if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
      //只有一颗星的时候,再次点击,变为0颗
      key = 0;
    }
    console.log("得" + key + "分")
    this.setData({
      key: key
    });
    level = key;
    SetStar(this, key);
  },
  //点击左边,整颗星
  selectRight: function (e) {
    console.log(e);
    var key = e.currentTarget.dataset.key
    console.log(key);
    console.log("得" + key + "分")
    this.setData({
      key: key
    });

    level = key;
    SetStar(this, key);
  },
  addnew: function () {
    //调用应用实例的方法获取全局数据
    if (inputContent['input_content'] == '' || inputContent['input_content'] == undefined) {
      wx.showToast({
        title: '标题和内容不能为空！',
        image: '../../images/cross.png',
        icon: 'success',
        duration: 2000
      })
    }
    else if (level < 0.5) {
      wx.showToast({
        title: '您还未评分！',
        image: '../../images/cross.png',
        icon: 'success',
        duration: 2000
      })
    } else {
      if (getApp().globalData.userData == null || getApp().globalData.userData == undefined) {
        console.log('userid is null');
        this.setData({
          ToastText: '请登录后再发表',
          hiddenToast: false
        })
        GetUser();
      }
      else {
        UserId = getApp().globalData.userData.UserId; console.log('add');
        // wx.showLoading({
        //   title: '正在上传，请稍候。。。',
        // })
        // setTimeout(function () {
        //   wx.hideLoading()
        // }, 30000)
        wx.showLoading({
          title: '正在发布',
        })
        var isCG = true;
        for (var i = 0; i < upload_imgs.length; i++) {
          if (upload_imgs[i].pro != "上传成功")
          { isCG = false; }
        }
        if (isCG) { addNew(this); }
        else {
          wx.showToast({
            title: '请等待图片上传完成！',
          })
        }
      }
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
  chooseimage: function () {
    var that = this;
    if (upload_imgs.length < 7) {
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
    }
    else {
      that.setData({
        ToastText: '最多选择6张图片！',
        hiddenToast: false
      })
    }
  }, chooseWxImage: function (type) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        if (upload_imgs.length + res.tempFilePaths.length < 7) {
          for (var i = 0; i < res.tempFilePaths.length; i++) {
            var cou = upload_imgs.length + i;
            var arrStr = { "id": cou, "url": res.tempFilePaths[i], "pro": 0, "serverurl": '', "serverurl_min": '' };
            upload_imgs.push(arrStr);
            upload_img_server(that, res.tempFilePaths[i], cou);
          }
          that.setData({
            tempFilePaths: upload_imgs,
          })
        }
        else {
          that.setData({
            ToastText: '最多选择6张图片！',
            hiddenToast: false
          })
        }
      }
    })
  },
  previewImg: function (e) {
    wx.previewImage({
      current: e.target.id, // 当前显示图片的http链接
      urls: images // 需要预览的图片http链接列表
    })
  }, bindChange: function (e) {
    console.log(e);
    inputContent[e.currentTarget.id] = e.detail.value
  },
  xuzhi: function () {
    wx.navigateTo({ url: '/pages/xuzhiInfo/xuzhiInfo' })
  }, delImg: function (e) {
    var id = e.target.id;
    console.log(id)
    var index = Util.getIndex(upload_imgs, "id", id);
    Util.remove(imgs, upload_imgs[index]["serverurl"]);
    Util.removeByValue(upload_imgs, "id", id);
    console.log(upload_imgs)
    this.setData({
      tempFilePaths: upload_imgs,
    })
  }
})