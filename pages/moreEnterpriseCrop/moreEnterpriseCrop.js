// pages/moreEnterpriseCrop/moreEnterpriseCrop.js
//itemNew.js
var url_crop = getApp().globalData.constUrl + "wxApi/getMoreCropByEnterpriseId.php";
var data;
var list = [];
var new_list = [];
var pinpai_url = getApp().globalData.constUrl + "wxApi/getPinpaiCondition.php";
var leibie_url = getApp().globalData.constUrl + "wxApi/getLeibieCondition.php";
var paixu_url = getApp().globalData.constUrl + "wxApi/getPaixuCondition.php";
var checkPinpai;
var checkLeibie;
var checkPaixu;

var GetPinpaiData = function (that) {
  wx.request({
    url: pinpai_url,
    //method: "POST",
    data: {
      companyid: that.data.classid
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      console.log(res)
      that.setData({
        PinpaiDataIndex: 0,
        PinpaiData: res.data.detail
      });
      checkPinpai = that.data.PinpaiData[that.data.PinpaiDataIndex];
    }
  });
}
var GetLeibieData = function (that) {
  wx.request({
    url: leibie_url,
    //method: "POST",
    data: {
      companyid: that.data.classid
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      console.log(res)
      that.setData({
        LeibieDataIndex: 0,
        LeibieData: res.data.detail
      });
      checkLeibie = that.data.LeibieData[that.data.LeibieDataIndex];
    }
  });
}
var GetPaixuData = function (that) {
  wx.request({
    url: paixu_url,
    //method: "POST",
    data: {
      companyid: that.data.classid
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      console.log(res)
      that.setData({
        PaixuDataIndex: 0,
        PaixuData: res.data.detail
      });
      checkPaixu = that.data.PaixuData[that.data.PaixuDataIndex];
    }
  });
}
var GetList = function (that) {

  that.setData({
    hiddenLoading: false
  });
  wx.request({
    url: url_crop,
    data: {
      searchPageNum: that.data.searchPageNum,
      enid: that.data.classid,
      checkPinpai: checkPinpai = checkPinpai == undefined ? '' : checkPinpai,
      checkLeibie: checkLeibie = checkLeibie == undefined ? '' : checkLeibie,
      checkPaixu: checkPaixu = checkPaixu == undefined ? '' : checkPaixu
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      console.log(res)
      //判断是否有数据，有则取数据 
      if (res.data.detail.length != 0) {
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加 
        that.data.isFromSearch ? list = res.data.detail : list = that.data.list.concat(res.data.detail)
        if (res.data.detail.length < 20) {
          var last = '';
          for (var i = 0; i < list.length; i++) {
            if (last == '') {
              last = list[i]['category_2'];
              list[i]['isshow'] = true;
            }
            else if (last == list[i]['category_2']) {
              list[i]['isshow'] = false;
            }
            else {
              last = list[i]['category_2'];
              list[i]['isshow'] = true;
            }
          }
          console.log(list);
          that.setData({
            list: list,
            searchLoadingComplete: true, //把“没有数据”设为true，显示 
            searchLoading: false  //把"上拉加载"的变量设为false，隐藏 
          });
        }
        else {
          var last = '';
          for (var i = 0; i < list.length; i++) {
            if (last == '') {
              last = list[i]['category_2'];
              list[i]['isshow'] = true;
            }
            else if (last == list[i]['category_2']) {
              list[i]['isshow'] = false;
            }
            else {
              last = list[i]['category_2'];
              list[i]['isshow'] = true;
            }
          }
          console.log(list);
          that.setData({
            list: list, //获取数据数组  
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
    },
    complete: function () {
      that.setData({
        hiddenLoading: true
      });
    }
  });
};
Page({
  data: {
    list: [],
    classid: '',
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组 
    searchPageNum: 0,   // 设置加载的第几次，默认是第一次 
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏 
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏 
    lastCategory: '',
    constUrl: getApp().globalData.constUrl
  },
  onclickList: function (event) {
    console.log(event);
    var p = event.currentTarget.id
    console.log(p);
    wx.navigateTo({ url: '/pages/itemCrop/itemCrop?CropId=' + p })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      classid: options.id,
      isFromSearch: true,  //第一次加载，设置true
      searchLoading: true,  //把"上拉加载"的变量设为true，显示 
      searchLoadingComplete: false //把“没有数据”设为false，隐藏 
    });
    this.classid = options.id;
    var that = this
    console.log('getlist');
    GetPinpaiData(this);
    GetLeibieData(this);
    GetPaixuData(this);
    GetList(this)

  },
  search: function () {
    wx.navigateTo({ url: '/pages/searchCrop/searchCrop' })
  },
  onShow: function (options) {
  }, onPullDownRefresh: function () {
    // Do something when pull down.
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: 0, //每次触发上拉事件，把searchPageNum+1
        isFromSearch: true  //触发到上拉事件，把isFromSearch设为为false
      });
      GetList(this);
    }
  },

  onReachBottom: function () {
    // Do something when page reach bottom.
    console.log('circle 下一页');
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1, //每次触发上拉事件，把searchPageNum+1
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false
      });
      GetList(this);
    }
  }, bindPinpaiPickerChange: function (e) {
    this.setData({
      PinpaiDataIndex: e.detail.value
    })
    checkPinpai = this.data.PinpaiData[this.data.PinpaiDataIndex];
    console.log(checkPinpai);
    GetList(this);
  }, bindLeibiePickerChange: function (e) {
    this.setData({
      LeibieDataIndex: e.detail.value
    })
    checkLeibie = this.data.LeibieData[this.data.LeibieDataIndex];
    console.log(checkLeibie);
    GetList(this);
  }, bindPaixuPickerChange: function (e) {
    this.setData({
      PaixuDataIndex: e.detail.value
    })
    checkPaixu = this.data.PaixuData[this.data.PaixuDataIndex];
    console.log(checkPaixu);
  }
})