//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    nickName: '苏黎世学联卡',
    userInfo: {},
    hasUserInfo: false,
    logged: false,
    takeSession: false,
    requestResult: '',
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') // 如需尝试获取用户信息可改为false
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../notfound/notfound',
      })
      return
    }
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      })
    }
  },

  getUserProfile() {
    // 推荐使用wx.getUserProfile获取用户信息，每次通过该接口获取用户个人信息均需得到确认
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中
      success: (res) => {
        this.setData({
          avatarUrl: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName,
          userInfo: res.userInfo,
          hasUserInfo: true,
        })
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        nickName: e.detail.userInfo.nickName,
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
      })
    }
  },

  onShowCard: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../vipcard/vipcard',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../notfound/notfound',
        })
      }
    })
  },

  onActivation: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../activation/activation',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../notfound/notfound',
        })
      }
    })
  },

})
