// pages/description/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    adminList:['otiNb49DglOp7rmTrYtdtNn7JfVo',
    'otiNb49BzJMPyOuTS59nx7YhQKos',
    'otiNb4_PXScZjXyE3nrgVPVCszA8',
    'otiNb4-gGh0bNEBKaO0Fyd8Gk8WY',
    'otiNb40vNDMCUkzYBvvYE76tggSo',
    'otiNb43EMHwXkLsxtJFfv2NuEM3Q',
    'otiNb49dyY5Fdho7gTrXEVQn5-DE',
    'otiNb4_5yaxYjL-wLi5CF8F9QQe8'],
    showAdmin:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(this.data.adminList.includes(getApp().globalData.openid)){
      this.setData({
        showAdmin:1
      })
    }
  },

  toAdmin: function(e) {
    if(this.data.showAdmin==1){
      wx.navigateTo({
        url: '../admin/index',
      })
    }
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