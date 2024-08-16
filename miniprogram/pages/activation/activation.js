// pages/activation/activation.js

const app = getApp()
var wxValidate = require('../../assets/js/wxValidate.js').wxValidate;

Page({
  data: {
    step: 1,
    openid: '',
    info: "无效",
    feedback: '无',
    date: '',
    filePath: '',
    status: false,
    uploaded: false,
    submitted: false,
    flowProcessList: ["检查状态", "提交申请", "等待结果"],
    arrayC: ["学士生", "硕士生", "博士生", "博士后", "访问学者"],
    arrayI: ["苏黎世大学", "苏黎世联邦理工学院", "苏黎世应用科技大学", "苏黎世艺术大学", "瑞士保罗谢尔研究所", "瑞士联邦森林、雪和景观研究所", "瑞士联邦材料试验和科研研究所", "瑞士联邦水科学技术研究所"],
    formData: {
      name: {
        value: "",
        error: false,
        tips: ""
      },
      tel: {
        value: "",
        error: false,
        tips: ""
      },
      email: {
        value: "",
        error: false,
        tips: ""
      },
      major: {
        value: "",
        error: false,
        tips: ""
      },
      category: {
        value: "",
        error: false,
        tips: ""
      },
      institution: {
        value: "",
        error: false,
        tips: ""
      },
      fileUpload: {
        value: "",
        error: false,
        tips: ""
      }
    },
    formStatus: {
      submitting: false
    }
  },

  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
    this.wxValidate = new wxValidate({
      //定义规则，必填项和正则判断规则
      rules: {
        name: {
          required: true,
          minlength: 2,
          maxlength: 10
        },
        tel: {
          required: true,
          tel: true
        },
        email: {
          required: true,
          email: true
        },
        major: {
          required: true,
          major: true
        },
        category: {
          required: true,
          minlength: 2,
          maxlength: 30
        },
        institution: {
          required: true,
          minlength: 2,
          maxlength: 10
        },
        fileUpload: {
          required: true,
          minlength: 2,
          maxlength: 10
        }
      },
      tips: {
        name: {
          required: "必填",
          minlength: "输入2~10个字符",
          maxlength: "输入2~10个字符"
        },
        tel: {
          required: "必填",
          tel: "无效的手机号码"
        },
        email: {
          required: "必填",
          email: "无效的电子邮箱"
        },
        major: {
          required: "必填",
          minlength: "输入2~10个字符",
          maxlength: "输入2~10个字符"
        },
        category: {
          required: "必填",
          minlength: "输入2~10个字符",
          maxlength: "输入2~10个字符"
        },
        institution: {
          required: "必填",
          minlength: "输入2~10个字符",
          maxlength: "输入2~10个字符"
        },
        fileUpload: {
          required: "必填",
          minlength: "输入2~10个字符",
          maxlength: "输入2~10个字符"
        }
      }
    });
    this.formFill()
  },

  // 表单数据绑定
  updateFormData: function (e) {
    var name = e.target.dataset.name,
      value = e.detail.value,
      key = "formData." + name + ".value",
      opts = {};
    opts[key] = value;
    this.setData(opts);
  },
  // 更新表单验证结果
  updateErrorData: function (errorData) {
    var key = "formData." + errorData.name,
      opts = {};

    opts[key + '.value'] = errorData.value;
    opts[key + '.error'] = !errorData.valid; // error === !valid
    opts[key + '.tips'] = errorData.tips;

    this.setData(opts);
  },
  // 表单验证
  formCheck: function (e) {
    var result = this.wxValidate.formCheck(e);
    this.updateErrorData(result);
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
        this.setData({"feedback": res.result.data.feedback})
        this.setData({"date": res.result.data.date})
        if (res.result.data.status) {
          this.setData({"info": "有效"})
          this.setData({"status": true})
          this.setData({"feedback": "👌"})
        } else {
          this.setData({"info": "无效"})
          this.setData({"status": false})
        }
        this.setData({"formData.name.value": res.result.data.name})
        this.setData({"formData.tel.value": res.result.data.tel})
        this.setData({"formData.email.value": res.result.data.email})
        this.setData({"formData.major.value": res.result.data.major})
        this.setData({"indexC": this.data.arrayC.indexOf(res.result.data.category)})
        this.setData({"indexI": this.data.arrayI.indexOf(res.result.data.institution)})
        this.setData({"formData.category": res.result.data.category})
        this.setData({"formData.institution": res.result.data.institution})
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
  // 表单提交
  formSubmit: function (e) {
    console.log("表单内容", e)
    var formData = e.detail.value;
    var result = this.wxValidate.formCheckAll(formData);

    console.log("表单提交formData", formData);
    console.log("表单提交result", result)
    wx.showLoading({
      title: '申请正在提交...',
    })
    wx.cloud.callFunction({
      name: 'membership',
      data: {
        action: 'update',
        name: formData.name,
        tel: formData.tel,
        email: formData.email,
        major: formData.major,
        openid: this.data.openid,
        category: this.data.formData.category,
        institution: this.data.formData.institution,
        status: this.data.uploaded,
        feedback: this.data.uploaded? '正在审核': '请上传学生证照片',
      },
      success: res => {
        this.data.submitted = true
        wx.hideLoading()
        wx.showToast({
          title: '提交成功',
        })
        console.log('申请提交成功', res)
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '提交失败，请稍后重试'
        })
        console.error('申请提交失败', err)
      }
    })
    // const db = wx.cloud.database()
    // db.collection('membership').add({
    //   data: {
    //     name: formData.name,
    //     email: formData.email,
    //     category: formData.category,
    //     institution: formData.institution,
    //   },
    //   success: res => {
    //     wx.hideLoading()
    //     console.log('发布成功', res)
    //   },
    //   fail: err => {
    //     wx.hideLoading()
    //     wx.showToast({
    //       icon: 'none',
    //       title: '网络不给力'
    //     })
    //     console.error('发布失败', err)
    //   }
    // })
  },
  wxValidate: null,

  bindPickerC: function (e) {
    try {
      this.setData({
        indexC: e.detail.value
      })
      this.data.formData.category = this.data.arrayC[e.detail.value]
    } catch (e) {
      this.data.formData.category = ""
    }
  },

  bindPickerI: function (e) {
    try {
      this.setData({
        indexI: e.detail.value
      })
      this.data.formData.institution = this.data.arrayI[e.detail.value]
    } catch (e) {
      this.data.formData.institution = ""
    }
  },

  // 上传图片
  doUpload: function () {
    let that = this;
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFileSize = res.tempFiles[0].size;
        if (tempFileSize <= 1000000) {
          wx.showLoading({
            title: '准备上传...',
          })
          that.doUploadReal(res)
        } else {
          wx.showToast({
            icon: 'none',
            title: '上传图片不能大于1M',
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
    const cloudPath = 'membership.' + app.globalData.openid + '.png'
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

  nextStep: function () {
    // 在第一步，需检查是否有 openid，如无需获取
    if (this.data.step === 1 && !this.data.openid) {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          app.globalData.openid = res.result.openid
          this.setData({
            step: 2,
            openid: res.result.openid
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '获取 openid 失败，请检查是否有部署 login 云函数',
          })
          console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err)
        }
      })
    } else {
      const callback = this.data.step !== 6 ? function() {} : function() {
        console.group('数据库文档')
        console.log('https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database.html')
        console.groupEnd()
      }

      this.setData({
        step: this.data.step + 1
      }, callback)
    }
  },

  prevStep: function () {
    this.setData({
      step: this.data.step - 1
    })
  },

  goHome: function() {
    const pages = getCurrentPages()
    if (pages.length === 2) {
      wx.navigateBack()
    } else if (pages.length === 1) {
      wx.redirectTo({
        url: '../index/index',
      })
    } else {
      wx.reLaunch({
        url: '../index/index',
      })
    }
  }

})
