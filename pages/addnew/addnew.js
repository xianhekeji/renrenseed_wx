var latitude = '';
var longitude = '';
var images = [];
var new_id = '';
var i = 0;
var url = getApp().globalData.constUrl + "mobileinterface/api/send_WordAndImg.php";


var Util = require('../../utils/util.js');
var AddNewData = function (that) {
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
        input_title: that.input_title,
        input_content: that.input_content,
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        new_id = JSON.parse(res.data).detail.new_id;
        if (i < images.length) {
          AddNewData(that);
          i = i + 1;
        }
        else {
          if (new_id > 0) {
            wx.hideToast();
            wx.showToast({
              title: '发布成功！',
              icon: 'success',
              duration: 2000
            })
            images = [];
            that.setData({
            tempFilePaths: [],
            })
          }
        }
      }
    });
  }
  else {
    wx.request({
      url: url,
      method: "POST",
      data: Util.json2Form({
        input_title: that.input_title,
        input_content: that.input_content,
        latitude: latitude,
        longitude: longitude
      }),
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res.data.detail);
        wx.hideToast();
        wx.showToast({
          title: '发布成功！',
          icon: 'success',
          duration: 2000
        });
        images = [];
        that.setData({
          tempFilePaths: [],
        })

      }
    });
  }

}
Page({
  data: {
    // text:"这是一个页面" 
    latitude: '',
    longitude: '',
    input_title: '',
    input_content: '',
    tempFilePaths: []
  },
  onLoad: function (options) {
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        latitude = res.latitude
        longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        console.log(latitude + '|' + longitude)
      }
    })
  },
  formBindsubmit: function (e) {
    if (e.detail.value.input_title.length == 0 || e.detail.value.input_content.length == 0) {
      this.setData({
        tip: '提示：标题和内容不能为空！'
      })
    } else {
      this.setData({
        tip: '',
      });
      this.input_title = e.detail.value.input_title,
        this.input_content = e.detail.value.input_content,
        wx.showToast({
          title: '正在发布！',
          icon: 'loading',
          duration: 10000
        });
      AddNewData(this)
    }
  },
  chooseimage: function () {
    var that = this;
    if (images.length < 6) {
      wx.showActionSheet({
        itemList: ['从相册中选择', '拍照'],
        itemColor: "#CED63A",
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
      this.setData({
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
        console.log(res);
        images.push(res.tempFilePaths[0]);
        that.setData({
          tempFilePaths: images,
        })
      }
    })
  },
})