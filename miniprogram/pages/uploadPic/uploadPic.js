// pages/uploadPic.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  // 上传图片
  doUpload: function () {
    let that = this;
    // 选择图片
    wx.chooseMedia({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFileSize = res.tempFiles[0].size;
        if (tempFileSize <= 10000000) {
          wx.showLoading({
            title: '准备上传...',
          })
          that.doUploadReal(res)
        } else {
          wx.showToast({
            icon: 'none',
            title: '上传图片不能大于10M',
          })
        }
      },
      fail: e => {
        console.error(e)
      }
    })
  },

  // 上传图片
  doUploadReal: function (res) {
    let that = this
    let filePath = res.tempFilePaths[0]
    console.log('[上传文件] filePath1', filePath)
    wx.hideLoading(),
    wx.showLoading({
      title: '正在上传...',
    })
    // 上传图片
    const cloudPath = 'membership_new.' + app.globalData.openid + '.png'
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: res => {
        wx.hideLoading(),
        wx.showToast({
          title: '上传成功',
        })
        that.data.uploaded = true
        console.log('[上传文件] 成功：', res)
        console.log('[上传文件] uploaded', that.data.uploaded)
        app.globalData.fileID = res.fileID
        app.globalData.cloudPath = cloudPath
        app.globalData.imagePath = filePath
        this.setData({
          uploaded: that.data.uploaded
        })
      },
      fail: err => {
        wx.hideLoading(),
        wx.showToast({
          icon: 'none',
          title: '上传失败，请稍后重试',
        })
        console.error('[上传文件] 失败：', err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.doUpload()
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