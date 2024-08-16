//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    info: "无效",
    openid: '',
    date: '',
  },

  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid,
      })
    }
  },
})