var checkClass = '';
var checkClassid = '2';
var checkClass2 = '';
var checkGen = '';
var checkStatus = '';
var checkYear = '';
var checkAddress = '';
var checkRegionPro = '';
var year_url = getApp().globalData.constUrl + "wxApi/getAuthorizeYear.php";
var class_url = getApp().globalData.constUrl + "wxApi/getClassData.php";
var YearData;
var class2_url = getApp().globalData.constUrl + "wxApi/getClass2Data.php";
var address_url = getApp().globalData.constUrl + "wxApi/getAddressData.php";
var regionpro_url = getApp().globalData.constUrl + "wxApi/getRegionProData.php";

var GetAddressData = function (that) {
  wx.request({
    url: address_url,
    //method: "POST",
    data: {
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      console.log(res)
      that.setData({
        AddressDataIndex: 0,
        AddressData: res.data.detail
      });
    }
  });
}
var GetRegionProData = function (that) {
  wx.request({
    url: regionpro_url,
    //method: "POST",
    data: {
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      that.setData({
        RegionProDataIndex: 0,
        RegionProData: res.data.detail
      });
    }
  });
}
var GetClassData = function (that) {
  wx.request({
    url: class_url,
    //method: "POST",
    data: {
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      that.setData({
        ClassData: res.data.detail,
        checkClassid: 2
      });
      checkClass = that.data.ClassData[0].varietyname;
      checkClassid = that.data.ClassData[0].varietyid;
      GetClass2Data(that, checkClassid);
    }
  });
}
var GetClass2Data = function (that, classid) {
  console.log(classid);
  wx.request({
    url: class2_url,
    //method: "POST",
    data: {
      classid: classid
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      console.log(res.data)
      that.setData({
        Class2Data: res.data.detail,
      });
      checkClass2 = that.data.Class2Data[that.data.Class2DataIndex];
    }
  });
}
var GetYearData = function (that) {
  wx.request({
    url: year_url,
    //method: "POST",
    data: {
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      that.setData({
        YearData: res.data.detail,
      });
    }
  });
}
Page({
  data: {
    ClassData: [],
    Class2DataIndex: 0,
    Class2Data: [],
    GenData: ['非转基因', '是转基因'],

    YearData: [],
    CropStatus: ['全部', '已审定', '已登记', '已退出']
  },
  bindClass2PickerChange: function (e) {
    this.setData({
      Class2DataIndex: e.detail.value
    })
    checkClass2 = this.data.Class2Data[this.data.Class2DataIndex];
    console.log(checkClass2);
  },
  bindAddressPickerChange: function (e) {
    this.setData({
      AddressDataIndex: e.detail.value
    })
    checkAddress = this.data.AddressData[this.data.AddressDataIndex];
    console.log(checkAddress);
  },
  bindRegionProPickerChange: function (e) {
    this.setData({
      RegionProDataIndex: e.detail.value
    })
    checkRegionPro = this.data.RegionProData[this.data.RegionProDataIndex];
    console.log(checkRegionPro);
  },
  onLoad: function () {
    checkClass = '';
    checkClassid = '';
    checkClass2 = '';
    checkAddress = '';
    checkRegionPro = '';
    checkGen = '';
    checkStatus = '';
    checkYear = '';
    GetRegionProData(this);
    GetAddressData(this);
    GetYearData(this);
    GetClassData(this);
  },
  menu_search: function () {
    if (checkClass2 == undefined) {
      checkClass2 = '';
    }
    if (checkAddress == undefined) {
      checkAddress = '';
    }
    if (checkRegionPro == undefined) {
      checkRegionPro = '';
    }

    wx.navigateTo({ url: '/pages/conditionCropResult/conditionCropResult?checkClass=' + checkClassid + '&checkGen=' + checkGen + '&checkYear=' + checkYear + '&checkClass2=' + checkClass2 + '&checkAddress=' + checkAddress + '&checkRegionPro=' + checkRegionPro + '&checkStatus=' + checkStatus })
  },
  onclickClassList: function (event) {
    console.log(event.currentTarget.id)
    var p = event.currentTarget.id
    checkClassid = p;
    this.setData({
      checkClassid: checkClassid
    });
    GetClass2Data(this, checkClassid);
  },
  onclickYearList: function (event) {
    var p = event.currentTarget.id
    console.log(p);
    checkYear = p;
    this.setData({
      checkYear: checkYear
    });
  },

  onclickStatusList: function (event) {
    var p = event.currentTarget.id
    console.log(p);
    checkStatus = p;
    this.setData({
      checkStatus: checkStatus
    });
  },
  onclickGenList: function (event) {
    var p = event.currentTarget.id
    console.log(p);
    checkGen = p;
    this.setData({
      checkGen: checkGen
    });
  },
  resetCondition: function () {
    checkClass = '';
    checkClassid = '2';
    checkClass2 = '';
    checkGen = '';
    checkStatus = '';
    checkYear = '';
    checkAddress = '';
    checkRegionPro = '';
    GetClass2Data(this, checkClass);
    this.setData({
      RegionProDataIndex: 0,
      AddressDataIndex: 0,
      checkClass: '',
      checkClass2: '',
      checkClassid: '2',
      checkGen: '',
      checkStatus: '',
      checkYear: ''
    });
  },
})  