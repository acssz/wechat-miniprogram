//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    info: "无效",
    openid: '',
    status: false,
    formData: {
      name: {
        value: "",
        error: false,
        tips: ""
      },
    },
  },

  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid,
      })
    }
    this.formFill()
  },

  // 表单填充
  formFill: function () {
    console.log("加载内容")
    wx.showLoading({
      title: '资料正在加载...',
    })
    wx.cloud.callFunction({
      name: 'membership',
      data: {
        action: 'query',
        openid: this.data.openid,
      },
      success: res => {
        wx.hideLoading()
        wx.showToast({
          title: '资料加载成功',
        })
        console.log('资料加载成功', res.result.data)
        this.setData({"date": res.result.data.date})
        if (res.result.data.status) {
          this.setData({"info": "有效"})
          this.setData({"status": true})
        } else {
          this.setData({"info": "无效"})
          this.setData({"status": false})
        }
        this.setData({"formData.name.value": res.result.data.name})
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '资料加载失败'
        })
        console.error('资料加载失败', err)
      }
    })
  },
})