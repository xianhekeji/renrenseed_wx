// pages/sendDistributorKoubei/sendDistributorKoubei.js
var Util = require('../../utils/util.js');
var CompanyId = '';
var level = 0;
var images = [];
var i = 0;
var new_id = '';
var UserId = '';
var inputContent = {};
let app = getApp();
var url = app.globalData.constUrl + "wxApi/addNewDistributorKoubei.php";
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
var AddNewData = function (that) {
  console.log('input:' + inputContent['input_content'] + 'CommentLevel' + level * 2 + 'CompanyId' + CompanyId + 'user' + getApp().globalData.userData.UserId);
  if (images.length > 0) {
    wx.uploadFile({
      url: url,
      header: {
        "Content-Type": "multipart/form-data"
      },
      filePath: images[i],
      name: 'file',
      formData: {
        new_id: new_id,
        Comment: inputContent['input_content'],
        CommentLevel: level * 2,
        CompanyId: CompanyId,
        UserId: getApp().globalData.userData.UserId,
        imageid: i
      },
      success: function (res) {
        console.log(res)
        if (JSON.parse(res.data).detail.status == 1) {
          wx.hideLoading();
          that.setData({
            ToastText: JSON.parse(res.data).detail.content,
            hiddenToast: false
          })
        }
        else {
          console.log(res.data);
          new_id = JSON.parse(res.data).detail.new_id;
          i = i + 1;
          if (i < images.length) {
            AddNewData(that);
          }
          else {
            if (new_id > 0) {
              that.setData({
                ToastText: '发布成功！',
                hiddenToast: false
              })
              wx.hideLoading();
              images = [];
              that.setData({
                tempFilePaths: [],
              })
              wx.navigateBack({
                delta: 1
              })
            }
          }
        }
      }
    });
  }
  else {
    console.log('upload');
    wx.request({
      url: url,
      method: "POST",
      data: Util.json2Form({
        Comment: inputContent['input_content'],
        CommentLevel: level * 2,
        CompanyId: CompanyId,
        UserId: getApp().globalData.userData.UserId,
        imageid: 0
      }),
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.detail.status == 1) {
          // wx.hideLoading();
          that.setData({
            ToastText: res.data.detail.content,
            hiddenToast: false
          })
        }
        else {
          if (res.data.detail > 0) {
            that.setData({
              ToastText: '发布成功！',
              hiddenToast: false
            })
            // wx.hideLoading();
          }
          wx.navigateBack({
            delta: 1
          })
        }
      }
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
    CompanyId: '',
    hiddenToast: true,
    tempFilePaths: [],
    inputContent: {},

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id);
    // 页面初始化 options为页面跳转所带来的参数
    images = [];
    i = 0;
    new_id = '';
    this.setData({
      CompanyId: options.id
    });
    CompanyId = options.id;
    if (UserId == '') {
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
    console.log('click button' + inputContent.input_content);
    console.log(this.wetoast)
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
      this.setData({
        tip: '',
      });
      if (getApp().globalData.userData == null || getApp().globalData.userData == undefined) {
        console.log('userid is null');
        GetUser();
      }
      else {
        console.log('1');
        UserId = getApp().globalData.userData.UserId; console.log('add');

        wx.showLoading({
          title: '正在上传，请稍候。。。',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 30000)
        AddNewData(this);
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
    if (images.length < 7) {
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
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        if (images.length + res.tempFilePaths.length < 7) {
          for (var j = 0; j < res.tempFilePaths.length; j++) {
            images.push(res.tempFilePaths[j]);
          }
          console.log(images.length);
          that.setData({
            tempFilePaths: images,
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
  }
})