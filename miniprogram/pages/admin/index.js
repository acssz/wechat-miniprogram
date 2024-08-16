// pages/admin/index.js
const fs = wx.getFileSystemManager();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "ChineseName":"",
    "CardCode":"",
    searchCandidate: [
    ],
    jsonList: [],
  },

  previewImage: function(e) {
    wx.previewImage({
      urls: [e.currentTarget.id]
    });
  },

  changeName: function(e) {
    var data = this.data.searchCandidate
    data.forEach((value,index,array)=>{
      if(value._id==e.currentTarget.id){
        value.name = e.detail.value
      }
    })
    this.setData({
      "searchCandidate":data,
    })
  },

  blockUser: function(e){
    var that = this;
    var data = this.data.searchCandidate
    var valueData = NaN;
    data.forEach((value,index,array)=>{
      if(value._id==e.currentTarget.id){
        valueData = value
      }
    })
    wx.cloud.callFunction({
      name: 'membership',
      data: {
        action: 'block',
        openid: valueData._id,
        blockStatus: !valueData.blockStatus,
      },
      success: res => {
        wx.hideLoading()
        if(res.result=="fail"){
          wx.showToast({
            title: "更新失败",
            icon: 'none',
            duration: 3000
          });
        }else{
          wx.showToast({
            title: "更新成功",
            icon: 'none',
            duration: 3000
          });
        }
        console.log(res)
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({
          title: "服务器连接失败",
          icon: 'none',
          duration: 3000
        });
        console.log(err)
        return;
      }
    })
  },

  changeEmail: function(e) {
    var data = this.data.searchCandidate
    data.forEach((value,index,array)=>{
      if(value._id==e.currentTarget.id){
        value.email = e.detail.value
      }
    })
    this.setData({
      "searchCandidate":data,
    })
  },

  changeDate: function(e) {
    var regex = /^\d{4}-\d{2}-\d{2}$/;
    if(regex.test(e.detail.value)==false){
      return
    }
    var data = this.data.searchCandidate
    data.forEach((value,index,array)=>{
      if(value._id==e.currentTarget.id){
        value.date = e.detail.value
      }
    })
    this.setData({
      "searchCandidate":data,
    })
  },

  updateUser: function (e) {
    var that = this;
    var data = this.data.searchCandidate
    var valueData = NaN;
    data.forEach((value,index,array)=>{
      if(value._id==e.currentTarget.id){
        valueData = value
      }
    })
    wx.showModal({
      title: '确定更新数据吗',
      content: '该操作不可取消',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在更新',
          })
          console.log("update",valueData)
          wx.cloud.callFunction({
            name: 'membership',
            data: {
              action: 'updateByAdmin',
              openid: valueData._id,
              name: valueData.name,
              date:valueData.date,
              status:valueData.status,
              email:valueData.email,
            },
            success: res => {
              wx.hideLoading()
              if(res.result=="fail"){
                wx.showToast({
                  title: "更新失败",
                  icon: 'none',
                  duration: 3000
                });
              }else{
                wx.showToast({
                  title: "更新成功",
                  icon: 'none',
                  duration: 3000
                });
              }
              console.log(res)
            },
            fail: err => {
              wx.hideLoading();
              wx.showToast({
                title: "服务器连接失败",
                icon: 'none',
                duration: 3000
              });
              console.log(err)
              return;
            }
          })
        } else if (res.cancel) {
          console.log('cancel');
        }
      }
    })
  },

  delUser: function (e) {
    var that = this;
    wx.showModal({
      title: '确定注销用户吗',
      content: '该操作不可取消',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在注销',
          })
          wx.cloud.callFunction({
            name: 'membership',
            data: {
              action: 'del',
              openid: e.currentTarget.id,
            },
            success: res => {
              wx.hideLoading()
              if(res.result=="fail"){
                wx.showToast({
                  title: "注销失败",
                  icon: 'none',
                  duration: 3000
                });
              }else{
                wx.showToast({
                  title: "注销成功",
                  icon: 'none',
                  duration: 3000
                });
              }
              console.log(res)
            },
            fail: err => {
              wx.hideLoading();
              wx.showToast({
                title: "服务器连接失败",
                icon: 'none',
                duration: 3000
              });
              return;
            }
          })
        } else if (res.cancel) {
          console.log('cancel');
        }
      }
    })
  },

  onToggle: function(e) {
    console.log("click",e.currentTarget.id)
    var data = this.data.searchCandidate
    data.forEach((value,index,array)=>{
      if(value._id==e.currentTarget.id){
        if(value.status==false){
          value.status = true
        }else{
          value.status = false
        }
      }
    })
    this.setData({
      "searchCandidate":data,
    })
  },

  getName(e){
    this.setData({
      "ChineseName":e.detail.value
    })
  },

  getCode(e){
    this.setData({
      "CardCode":e.detail.value
    })
  },

  HashCode: function(input) {
    var hash = 0, i, chr;
    if (input.length === 0) return hash;
    for (i = 0; i < input.length; i++) {
      chr   = input.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    if(hash<0) return -hash;
    return hash;
  },

  searchUser(e){
    var that = this;
    console.log("searching "+this.data.ChineseName+" "+this.data.CardCode)
    wx.showLoading({
      title: '正在查询',
    })
    wx.cloud.callFunction({
      name: 'membership',
      data: {
        action: 'search',
        ChineseName: this.data.ChineseName,
      },
      success: res => {
        wx.hideLoading()
        var data  = res.result.data
        data.forEach((value,index,array)=>{
          value.cardNumber=that.HashCode(value._id).toString().padStart(16, "0");
          value.cardNumberLine1 = value.cardNumber.slice(0,4)+" "+value.cardNumber.slice(4,8);
          value.cardNumberLine2 = value.cardNumber.slice(8,12)+" "+value.cardNumber.slice(12,16);
          if(value.blockStatus==true){
            value.blockWord="移出"
            value.blockStatus=true
          }else{
            value.blockWord="加入"
            value.blockStatus=false
          }
          wx.cloud.getTempFileURL({
            fileList: ['cloud://cloud1-7gi5yqaof9e25fc9.636c-cloud1-7gi5yqaof9e25fc9-1305406957/membership.'+value._id+'.png'],
            success: res => {
              value.imgPath = res.fileList[0]['tempFileURL']
              console.log("path",value.imgPath)
              that.setData({
                "searchCandidate":data,
              })
            },
            fail: res=>{
              console.log(res)
            }
          })
        })
        that.setData({
          "searchCandidate":data,
        })
        if(data.length==0){
          wx.showToast({
            title: "未搜索到用户",
            icon: 'none',
            duration: 3000
          });
        }else{
          wx.showToast({
            title: "共"+data.length+"条结果",
            icon: 'none',
            duration: 3000
          });
        }
        console.log(res.result.data)
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({
          title: "服务器连接失败",
          icon: 'none',
          duration: 3000
        });
        return;
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.loadFontFace({
      family: 'dot',
      source: getApp().globalData.FontTempUrl,
      complete: function(res) { console.log('插入字体'); console.log(res); },
      success: function(res) { console.log('成功'); console.log(res); },
      fail: function(res) { console.log('失败'); console.log(res); },
    })
    wx.showLoading({
      title: '加载合作列表',
    })
    var that = this;
    console.log("load")
    wx.cloud.downloadFile({
      fileID: 'cloud://cloud1-7gi5yqaof9e25fc9.636c-cloud1-7gi5yqaof9e25fc9-1305406957/coop/partner.json',
      success: res => {
        console.log(res)
        var jp = res.tempFilePath
        fs.readFile({
          filePath: jp,
          encoding: 'utf-8',
          success: function (res) {
            var jsonData = JSON.parse(res.data);
            wx.hideLoading()
            console.log(jsonData);
            that.setData({"jsonList":jsonData[0]['items'],"partners":jsonData})
          },
          fail: function (err) {
            console.error('读取失败', err);
          }
        });
      },
      fail: res=>{
        console.log(res)
      }
    })
  },

  // 更新字典中的名称
  updateName: function (e) {
    const { index } = e.currentTarget.dataset;
    const { value } = e.detail;
    const jsonList = this.data.jsonList;
    jsonList[index].name = value;
    this.setData({
      "jsonList":jsonList,
    });
  },

  // 更新字典中的图标
  updateIcon: function (e) {
    const { index } = e.currentTarget.dataset;
    const { value } = e.detail;
    const jsonList = this.data.jsonList;
    jsonList[index].icon = value;
    this.setData({
      "jsonList":jsonList,
    });
  },

  // 更新字典中的喜好
  updateFavorable: function (e) {
    const { index } = e.currentTarget.dataset;
    const { value } = e.detail;
    const jsonList = this.data.jsonList;
    jsonList[index].favorable = value;
    this.setData({
      "jsonList":jsonList,
    });
  },

  // 移除字典项
  removeItem: function (e) {
    const { index } = e.currentTarget.dataset;
    const jsonList = this.data.jsonList;
    jsonList.splice(index, 1);
    this.setData({
      "jsonList":jsonList,
    });
  },

  // 添加新的字典项
  addItem: function () {
    const newItem = {
      name: '',
      icon: '',
      favorable: '',
    };
    const jsonList = this.data.jsonList;
    jsonList.push(newItem);
    this.setData({
      "jsonList":jsonList,
    });
  },

  // 保存 JSON 文件
  saveJson: function () {
    wx.showLoading({
      title: '正在上传',
    })
    if(this.data.jsonList==[]){
      wx.showToast({
        title: "更新失败",
        icon: 'none',
        duration: 3000
      });
      return;
    }
    var partners = this.data.partners;
    partners[0]['items'] = this.data.jsonList;
    var jsonString = JSON.stringify(partners);
    console.log(jsonString);
    const filePath = wx.env.USER_DATA_PATH + '/newPartner.json';
    fs.writeFile({
      filePath: filePath,
      data: jsonString,
      encoding: 'utf8',
      success: function (res) {
        console.log('JSON 文件保存成功');
        wx.cloud.uploadFile({
          cloudPath: './coop/partner.json',
          filePath: filePath, // 文件路径
          success: res => {
            // get resource ID
            wx.showToast({
              title: "更新成功",
              icon: 'none',
              duration: 3000
            });
          },
          fail: err => {
            wx.showToast({
              title: "更新失败",
              icon: 'none',
              duration: 3000
            });
          }
        })
      },
      fail: function (err) {
        wx.showToast({
          title: "更新失败",
          icon: 'none',
          duration: 3000
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})