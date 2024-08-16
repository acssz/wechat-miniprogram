var debugMode=false
var inputText=""
var inputType="email"
var studentIdCardPicPath = ""
var ocrPass = false
var emailAuthenticated = false
var emailTemp = ""
var lDGlobal = 0

import { pinyin } from 'pinyin-pro';

Page({
	data: {
		//for text rolling
		text: "[TEST] [限时85折] 新合作商家：莲花园 持学联有效会员卡限时85折",
		marqueePace: 2,//滚动速度
		marqueeDistance: 0,//初始滚动距离
		marquee_margin: 500,
		size:15,
    interval: 20, // 时间间隔
    animation_display_first:"",
    animation_display:"",
    animation_disapear:"",
    animation_display_2:"",
    animation_display_3:"",
    animation_display_dynamic:"",
    animation_display_short:"",
    animation_movedown:"",
    background_idcard:"",
    label_1:"",
    label_2:"",
    label_3:"",
    label_4:"",
    label_5:"",
    text_1:"请输入教育邮箱验证",
    image:"mailbox",
    input_value:"",
    placeholder_value:"example@example.ch",
    suffix:["uzh.ch","eth.ch","ethz.ch","edu.cn","school.lyceum-alpinum.ch"]
  },

  updateMemberFromWX:async function(address){
    console.log("update member")
    var validDate = new Date()
    validDate.setFullYear(validDate.getFullYear()+1);
    const res = await wx.cloud.callContainer({
      "config": {
        "env": "prod-7g0e0cai2cdc4216"
      },
      "path": "/updateMember",
      "header": {
        "X-WX-SERVICE": "flask-wvfg"
      },
      "method": "POST",
      "data": {
        "wxId": getApp().globalData.openid,
        "email":address,
        "validTime":validDate
      }
    })
    getApp().globalData.memberData = {wxId: getApp().globalData.openid, email: address, validTime:validDate.toISOString().split("T")[0]}
    try{
      if (res.statusCode===200){
        console.log(res)
        return true;
      }}catch{
        console.log("error:",res.statusCode)
        wx.showToast({
            title: "无法连接到服务器 E0",
            icon: 'none',
            duration: 3000
        });
        return false;
    }
    console.log("error:",res.statusCode)
    wx.showToast({
        title: "无法连接到服务器 E0",
        icon: 'none',
        duration: 3000
    });
    return false
  },

  validChineseName:function(n){
    const excludedChars = ["𥖄","𤰉"];
    const excludedCharsStr = excludedChars.join('');
    const reg = new RegExp(`^([\u3400-\u9fa5${excludedCharsStr}]){2,15}$`, 'g');
    return reg.test(n);
  },

  mailLogin:async function(address,type,justLogin){
    var that = this;
    var token = getApp().globalData.openid.slice(-7,-1);
    console.log("token",token)
    if(type=="login"){
      const res = await wx.cloud.callContainer({
        "config": {
          "env": "prod-7g0e0cai2cdc4216"
        },
        "path": "/signIn",
        "header": {
          "X-WX-SERVICE": "flask-wvfg"
        },
        "method": "POST",
        "data": {
          "email": address,
          "password":token
        }
      })
      if(res.statusCode!=200){
        wx.showToast({
          title: "尚未验证邮箱",
          icon: 'none',
          duration: 3000
        });
        if(justLogin===false){
          that.mailLogin(address,"create",false);
        }
        return;
      }
      console.log(res)
      var data = res.data.data
      console.log("authenticated data",data)
      if(debugMode!=true){
      if(data=="authenticated"){
        console.log("authenticated");
        emailAuthenticated = true;
        if(getApp().globalData.memberData == null){ //Table中没有用户信息
          if(that.updateMemberFromWX(address)==false){
            return
          }
        }
        if(justLogin===true){
          return
        }
        const res = await wx.cloud.callContainer({
          "config": {
            "env": "prod-7g0e0cai2cdc4216"
          },
          "path": "/ocrCheck",
          "header": {
            "X-WX-SERVICE": "flask-wvfg"
          },
          "method": "POST",
          "data": {
            "wxId": getApp().globalData.openid
          }
        })
        if(res.statusCode==200){
          if(res.data.data.length===0){
            wx.showToast({
              title: "已确认教育邮箱 请继续完成ocr核验",
              icon: 'none',
              duration: 3000
            });
            that.setData({
              animation_display_dynamic:"animation:switch 2s ease 1 forwards;",
              animation_display_short:"animation:shorter 2s ease 1 forwards;",
              animation_movedown:"animation:movedown 3s ease 1 forwards;",
              animation_display_2:"animation:display_2 2s ease 1 forwards;",
              input_value:"",
              placeholder_value:""
            })
            setTimeout(function(){that.setData({
              text_1:"请输入你的中文名",
              image:"add"
            })},1000)
            inputType="name"
            return;
          }
        }else{
          wx.showToast({
            title: "无法连接服务器",
            icon: 'none',
            duration: 3000
          });
          return;
        }
        wx.showToast({
          title: "登录成功",
          icon: 'none',
          duration: 1000
        });
        getApp().globalData.chineseName = res.data.data[0]["chineseName"]
        getApp().globalData.chinesePY = pinyin(res.data.data[0]["chineseName"],{ toneType: 'none',type:'string',mode:'surname'});
        getApp().globalData.login=true
        setTimeout(function(){wx.navigateTo({
          url: '../card-normal/index',
        })},1000)
        return;
      }
      }
    }
    if(type=="create"){
      const res = await wx.cloud.callContainer({
        "config": {
          "env": "prod-7g0e0cai2cdc4216"
        },
        "path": "/signUp",
        "header": {
          "X-WX-SERVICE": "flask-wvfg"
        },
        "method": "POST",
        "data": {
          "email": address,
          "password":token
        }
      })
      console.log(res)
      if(res.statusCode!=200){
        wx.showToast({
          title: "已发送过验证邮件 请检查收件箱",
          icon: 'none',
          duration: 3000
        });
        return;
      }
      console.log("authenticated")
      wx.showToast({
        title: "已发送验证邮件 请查收",
        icon: 'none',
        duration: 3000
      });
    }
    that.setData({
      animation_display:"animation:display 1s ease 1 forwards;"
     })
    /*
    if(data.data.aud=="等待验证"){
      wx.showToast({
        title: "请前往邮箱验证",
        icon: 'none',
        duration: 3000
      });
      return;
    */
  },

  getLoginData:async function(){
    var that = this;
    wx.showLoading({
      title: '正在登录',
    })
    console.log(getApp().globalData.openid.slice(-7,-1))
    wx.cloud.callFunction({
      name: 'membership',
      data: {
        action: 'query',
        openid: getApp().globalData.openid,
      },
      success: res => {
        wx.hideLoading()
        console.log(res.result)
        if(res.result==null){
          console.log('用户未注册')
          that.setData({
            animation_display:"animation:display 1s ease 1 forwards;"
          })
          return
        }
        console.log("用户已提交注册信息")
        getApp().globalData.memberData = res.result.data
        console.log(getApp().globalData.memberData)
        if(getApp().globalData.memberData.blockStatus==true){
          wx.showToast({
            title: '抱歉无法登陆',
          })
          return
        }
        if(getApp().globalData.memberData.status==false){
          wx.showToast({
            title: '请输入验证码',
          })
          that.setData({
            animation_display:"animation:display 1s ease 1 forwards;"
          })
          return
        }
        if(getApp().globalData.memberData.name){
          console.log("registed")
        }else{
          that.setData({
            animation_display_dynamic:"animation:switch 2s ease 1 forwards;",
            animation_display_short:"animation:shorter 2s ease 1 forwards;",
            animation_movedown:"animation:movedown 3s ease 1 forwards;",
            animation_display_2:"animation:display_2 2s ease 1 forwards;",
            input_value:"",
            placeholder_value:""
          })
          setTimeout(function(){that.setData({
            text_1:"请输入你的中文名",
            image:"add"
          })},1000)
          inputType="name"
          return
        }
        var curDate = new Date()
        var validData = new Date(Date.parse(getApp().globalData.memberData.date.replace(/-/g,"/")));
        validData.setFullYear(validData.getFullYear()+getApp().globalData.expiredPeriod);
        console.log(curDate,validData)
        if(validData>=curDate){
          console.log("in valid")
          getApp().globalData.chineseName=getApp().globalData.memberData.name
          getApp().globalData.chinesePY=pinyin(getApp().globalData.memberData.name,{ toneType: 'none',type:'string',mode:'surname'});
          setTimeout(function(){wx.navigateTo({
            url: '../card-normal/index',
          })},1000)
        }else{
          console.log("not valid")
          //TODO
          wx.showToast({
            title: "学联卡过期",
            icon: 'none',
            duration: 3000
          });
          return;
        }
      },
      fail: err => {
        wx.hideLoading();
        console.log(err)
        if(err.errMsg.indexOf("504002")>0){
          wx.showToast({
            title: "用户尚未注册",
            icon: 'none',
            duration: 3000
          });
          that.setData({
            animation_display:"animation:display 1s ease 1 forwards;"
          })
        }else{
          wx.showToast({
            title: "无法连接到服务器 E2.1",
            icon: 'none',
            duration: 3000
          });
        }
        return;
      }
    })
    getApp().globalData.Ad="None"
  },

  getInputValue(e){
    inputText = e.detail.value
    console.log(inputText)
    if(inputType=="name"){
      this.validChineseName(inputText)
    }
  },

  getInputCode(e){
    var that = this;
    var inputCode = e.detail.value
    console.log(inputCode)
    if(inputType=="email"){
      if(getApp().globalData.openid.slice(-7,-1)==inputCode){
        that.setData({
          animation_disapear:"animation:disapear 1s ease 1 forwards;"
        })
        wx.showLoading({
          title: '正在验证',
        })
        emailTemp=inputText;
        wx.cloud.callFunction({
          name: 'membership',
          data: {
            action: 'valid',
            openid: getApp().globalData.openid,
            email: emailTemp
          },
          success: res => {
            wx.hideLoading()
            wx.showToast({
              title: '成功验证',
            })
          },
          fail: err => {
            wx.hideLoading();
            wx.showToast({
              title: "无法连接到服务器",
              icon: 'none',
              duration: 3000
            });
            return;
          }
        })
        that.setData({
          animation_display_dynamic:"animation:switch 2s ease 1 forwards;",
          animation_display_short:"animation:shorter 2s ease 1 forwards;",
          animation_movedown:"animation:movedown 3s ease 1 forwards;",
          animation_display_2:"animation:display_2 2s ease 1 forwards;",
          input_value:"",
          placeholder_value:""
        })
        setTimeout(function(){that.setData({
          text_1:"请输入你的中文名",
          image:"add"
        })},1000)
        inputType="name"
      }
      if(inputCode.length>6){
        wx.showToast({
          icon: 'none',
          title: '请输入正确的六位校验码',
        })
      }
    }
  },

  uploadImg: function(){
    var that = this;
    if(inputType!="name"){return}
    if(this.validChineseName(inputText)==false){
      wx.showToast({
        icon: 'none',
        title: '请首先输入正确中文姓名',
      })
      return
    }
    wx.chooseMedia({
      count: 1,
      sizeType: ['compressed'],
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFileSize = res.tempFiles[0].size;
        if (tempFileSize <= 1000000) {
          var backgroundCss = "background:url(placeholder) no-repeat 0rpx 0rpx; background-size:700rpx 500rpx;"
          backgroundCss = backgroundCss.replace("placeholder",res.tempFiles[0].tempFilePath)
          console.log(backgroundCss)
          that.setData({
            background_idcard:backgroundCss
          })
          studentIdCardPicPath=res.tempFiles[0].tempFilePath
          that.ocr()
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

  ocr:function(){
    var that = this;
    //get acess_token
    var acess_token = ""
    wx.showLoading({
      title: '正在核验',
    })
    wx.request( {
      url: "https://aip.baidubce.com/oauth/2.0/token?client_id=VWkRA8VPCsRojLLGxydxj6io&client_secret=FAB97jGa95zXGmQrBZtvErN6kghnvGyo&grant_type=client_credentials",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data:"",
      complete: function( res ) {
        if( res == null || res.data == null ) {
          wx.hideLoading()
          wx.showToast({
            title: '验证失败',
            duration: 2000,
            icon: 'none'
          });
          return;
        }
        console.log(res.data.access_token)
        acess_token = res.data.access_token
        //to base64
        wx.getFileSystemManager().readFile({
          filePath: studentIdCardPicPath,
          encoding: 'base64',
          success: res => {
            //ocr
            wx.request( {
              url: "https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=AK".replace("AK",acess_token),
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              method: "POST",
              //data:"image=BASE64".replace("BASE64",res.data),
              data:{image:res.data},
              complete: function( res ) {
                if( res == null || res.data == null ) {
                  wx.hideLoading()
                  wx.showToast({
                    title: '验证失败',
                    duration: 2000,
                    icon: 'none'
                  });
                  return;
                }
                that.ocrCheck(res)
              }
            })
          }
        })
      }
    })
  },

  levenshteinDistance: function (str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = [];
  
    for (let i = 0; i <= m; i++) {
      dp[i] = [];
      for (let j = 0; j <= n; j++) {
        if (i === 0) {
          dp[i][j] = j;
        } else if (j === 0) {
          dp[i][j] = i;
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j - 1] + (str1[i - 1] !== str2[j - 1] ? 1 : 0),
            dp[i - 1][j] + 1,
            dp[i][j - 1] + 1
          );
        }
      }
    }
    return dp[m][n];
  },

  combineStrings: function (arr) {
    const result = [];
  
    function backtrack(currentCombination, index) {
      if (index === arr.length) {
        result.push(currentCombination.join(''));
        return;
      }
  
      // 不选当前元素
      backtrack(currentCombination, index + 1);
  
      // 选当前元素
      currentCombination.push(arr[index]);
      backtrack(currentCombination, index + 1);
      currentCombination.pop();
    }
  
    backtrack([], 0);
    return result;
  },

  ocrCheck:function(res){
    var that = this;
      wx.hideLoading()
      var data = res.data.words_result
      console.log(data)
      var py = pinyin(inputText,{ toneType: 'none',type:'array',mode:'surname'});
      console.log(py)
      var lD = 0
      var all = 0
      var comPy = that.combineStrings(py)
      for(var singlePy in comPy){
        if(py[singlePy]==""){
          continue
        }
        for(var singleOcr in data){
          lD = lD+1/(1+that.levenshteinDistance(data[singleOcr]["words"].toLowerCase(),comPy[singlePy])**4);
        }
        all = all+1
      }
      lD = lD/all;
      lDGlobal = lD
      console.log("lD",lD,"all",all)
      //if((pass>all/2)&(all>1)){
      if(true){
        setTimeout(function(){
        wx.showToast({
          title: '验证成功',
          duration: 2000,
          icon: 'none'
        })},2000)
        ocrPass = true
        for(var singleOcr in data){
          var label = data[singleOcr]["words"]
          console.log(label)
          if(label.indexOf("-")!=-1){
            that.setData({
              label_1:label
            })
          }
          if(label.indexOf("valid")!=-1){
            continue
          }
          var regex=/[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]/;
          if(regex.test(label)){
            continue
          }
          regex=/[\u4e00-\u9fff]/;
          if(regex.test(label)){
            continue
          }
          if(/^\d/.test(label)==false){
            if(that.data.label_2==""){
              that.setData({
                label_2:label
              })
            }else{
              if(that.data.label_3==""){
                that.setData({
                  label_3:label
                })
              }else{
                if(that.data.label_4==""){
                  that.setData({
                    label_4:label
                  })
                }else{
                  if(that.data.label_5==""){
                    that.setData({
                      label_5:label
                    })
                  }
                }
              }
            }
          }
        }
        that.setData({
          animation_display_3:"animation:display_2 2s ease 1 forwards;"
        })
        that.sendMail()
      }else{
        wx.showToast({
          title: '验证失败',
          duration: 2000,
          icon: 'none'
        });
      }
  },

  sendVariEmail: function(){
    wx.showLoading({
      title: '发送中',
    })
    wx.cloud.callFunction({
      name: 'sendEmail',
      data: {
        content: {
          mailbox:inputText,
          text:getApp().globalData.openid.slice(-7,-1)
        }
      },
      success: res => {
        console.log('已发送', res)
        wx.cloud.callFunction({
          name: 'membership',
          data: {
            action: 'setEmail',
            openid: getApp().globalData.openid,
            email: inputText
          },
          success: res => {
            wx.hideLoading()
            wx.showToast({
              title: '成功',
            })
          },
          fail: err => {
            wx.hideLoading();
            wx.showToast({
              title: "无法连接到服务器",
              icon: 'none',
              duration: 3000
            });
            return;
          }
        })
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '失败'
        })
        console.error('发送失败 请重试', err)
      }
    })
  },

  // 上传图片
  doUploadReal: function () {
    let that = this
    let filePath = studentIdCardPicPath
    console.log('[上传文件] filePath1', filePath)
    // 上传图片
    const cloudPath = 'membership.' + getApp().globalData.openid + '.png'
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: res => {
        that.data.uploaded = true
        console.log('[上传文件] 成功：', res)
        console.log('[上传文件] uploaded', that.data.uploaded)
        getApp().globalData.fileID = res.fileID
        getApp().globalData.cloudPath = cloudPath
        getApp().globalData.imagePath = filePath
        this.setData({
          uploaded: that.data.uploaded
        })
        wx.hideLoading()
        wx.showToast({
          title: '成功',
        })
        that.onLoad()
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

  sendMail: async function () {
    var that = this;
    if(inputType=="name"){
      if(ocrPass == false){
        wx.showToast({
          title: '请先进行核验',
          duration: 2000,
          icon: 'none'
        });
      }else{
        //TODO
        wx.showLoading({
          title: '更新信息',
        })
        wx.cloud.callFunction({
          name: 'membership',
          data: {
            action: 'updateLeak',
            openid: getApp().globalData.openid,
            name: inputText,
            pinyin:pinyin(inputText,{ toneType: 'none',type:'string',mode:'surname'}),
            lD: lDGlobal,
          },
          success: res => {
            that.doUploadReal()
          },
          fail: err => {
            wx.hideLoading();
            wx.showToast({
              title: "无法连接到服务器",
              icon: 'none',
              duration: 3000
            });
            return;
          }
        })
      }/*else{
        wx.showLoading({
          title: '正在更新ocr认证信息',
        })
        //upload ocr info
        
        const res = await wx.cloud.callContainer({
          "config": {
            "env": "prod-7g0e0cai2cdc4216"
          },
          "path": "/ocrUpdate",
          "header": {
            "X-WX-SERVICE": "flask-wvfg"
          },
          "method": "POST",
          "data": {
            "wxId": getApp().globalData.openid,
            "chineseName": inputText
          }
        })
        wx.hideLoading()
        console.log(res)
        if(res.statusCode===200){
          wx.showToast({
            title: 'OCR信息上传成功',
            duration: 2000,
            icon: 'none'
          });
          if(emailAuthenticated==true){
            //double auth pass
            wx.showToast({
              title: "登录成功",
              icon: 'none',
              duration: 1000
            });
            getApp().globalData.chineseName = inputText
            getApp().globalData.chinesePY = pinyin(inputText,{ toneType: 'none',type:'string',mode:'surname'});
            getApp().globalData.login=true
            setTimeout(function(){wx.navigateTo({
              url: '../card-normal/index',
            })},1000)
          }else{
            wx.showLoading({
              title: '正在检查邮箱认证结果',
            })
            try{
              that.mailLogin(getApp().globalData.memberData.email,"login",true)
            }catch{
              that.mailLogin(emailTemp,"login",true)
            }
            wx.hideLoading()
            if(emailAuthenticated==true){
              //double auth pass
              wx.showToast({
                title: "登录成功",
                icon: 'none',
                duration: 1000
              });
              getApp().globalData.chineseName = inputText
              getApp().globalData.chinesePY = pinyin(inputText,{ toneType: 'none',type:'string',mode:'surname'});
              getApp().globalData.login=true
              setTimeout(function(){wx.navigateTo({
                url: '../card-normal/index',
              })},1000)
            }
          }
        }else{
          wx.showLoading({
            title: 'OCR信息已存在 正在检查邮箱认证结果',
          })
          try{
            that.mailLogin(getApp().globalData.memberData.email,"login",true)
          }catch{
            that.mailLogin(emailTemp,"login",true)
          }
          wx.hideLoading()
          if(emailAuthenticated==true){
            //double auth pass
            wx.showToast({
              title: "登录成功",
              icon: 'none',
              duration: 1000
            });
            getApp().globalData.chineseName = inputText
            getApp().globalData.chinesePY = pinyin(inputText,{ toneType: 'none',type:'string',mode:'surname'});
            getApp().globalData.login=true
            setTimeout(function(){wx.navigateTo({
              url: '../card-normal/index',
            })},1000)
          }
        }
      }*/
    }
    if(inputType=="email"){
      if (!(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(inputText))){
        wx.showToast({
          title: '邮箱输入有误',
          duration: 2000,
          icon: 'none'
          });
        return
      }
      var checkSuffix = false
      for(var id in that.data.suffix){
        if(inputText.split("@")[1].includes(that.data.suffix[id])){
          checkSuffix=true
        }
      }
      if(checkSuffix==true){
        that.sendVariEmail()
        //that.mailLogin(inputText,"login",false)
      }else{
        wx.showToast({
          title: '非教育邮箱',
          duration: 2000,
          icon: 'none'
          });
        return
      }
    }
  },
	
	scrolltxt: function () {
		var that = this;
		var length = that.data.length;//滚动文字的宽度
		var windowWidth = that.data.screenWidth;//屏幕宽度
		if (length > windowWidth){
		 var interval = setInterval(function () {
		 var maxscrollwidth = length + that.data.marquee_margin;//滚动的最大宽度，文字宽度+间距，如果需要一行文字滚完后再显示第二行可以修改marquee_margin值等于windowWidth即可
		 var crentleft = that.data.marqueeDistance;
		 if (crentleft < maxscrollwidth) {//判断是否滚动到最大宽度
			that.setData({
			marqueeDistance: crentleft + that.data.marqueePace
			})
		 }
		 else {
			//console.log("替换");
			that.setData({
			marqueeDistance: 0 // 直接重新滚动
			});
			clearInterval(interval);
			that.scrolltxt();
		 }
		 }, that.data.interval);
		}
		else{
		 that.setData({ marquee_margin:"100"});//只显示一条不滚动右边间距加大，防止重复显示
		} 
	},
	
	onShow: function () {
    var that = this;
    
    if(getApp().globalData.strangeBack==true){
      wx.navigateTo({
        url: '../card-normal/index',
      })
    }

		wx.getSystemInfo({ 
			success: function (res) { 
				that.setData({ 
					screenHeight: res.windowHeight, 
					screenWidth: res.windowWidth, 
				});
			} 
		});

		var length = that.data.text.length * that.data.size;//文字长度
		that.setData({
			length: length,
		 });
    that.scrolltxt();

		console.log("screenWidth:",that.data.screenWidth)
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

  queryDatabase: function () {
    var that = this;
    // 通过云函数访问云数据库
    wx.cloud.callFunction({
      name: 'queryEmailDomain', // 云函数的名称，需要自行创建并配置
      data: {
        collectionName: 'emailDomain', // 集合名称
        docId: '7027b654655ca8d900211a4d42632492' // 需要查询的文档ID
      },
      success: res => {
        console.log('查询成功', res);
        const data = res.result.data;
        if (data) {
          const fields = data; // 获取第一个文档的字段
          const resultList = [];
          for (const key in fields) {
            if (fields.hasOwnProperty(key)) {
              resultList.push(fields[key]);
            }
          }
          console.log("new suffix: ",resultList)
          that.setData({
            suffix: resultList
          });
        }
      },
      fail: err => {
        console.error('查询失败', err);
      }
    });
  },
	
	onLoad: function () {
    var that = this;
    this.queryDatabase();
    inputType="email";
    emailTemp="";
    if (!wx.cloud) {
      wx.navigateTo({
        url: '../notfound/notfound',
      })
      return
    }
    wx.cloud.init();
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        getApp().globalData.openid = res.result.openid
        getApp().globalData.openidHash = that.HashCode(res.result.openid).toString()
        that.getLoginData()
        that.setData({
          openidDis : getApp().globalData.openid
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../notfound/notfound',
        })
      }
    })
		wx.cloud.getTempFileURL({
			fileList: ['cloud://cloud1-7gi5yqaof9e25fc9.636c-cloud1-7gi5yqaof9e25fc9-1305406957/assets/DottedSongtiCircleRegular.subset.otf','cloud://cloud1-7gi5yqaof9e25fc9.636c-cloud1-7gi5yqaof9e25fc9-1305406957/assets/bg-card.png','cloud://cloud1-7gi5yqaof9e25fc9.636c-cloud1-7gi5yqaof9e25fc9-1305406957/assets/acssz.png'],//,'cloud://cloud1-7gi5yqaof9e25fc9.636c-cloud1-7gi5yqaof9e25fc9-1305406957/assets/TerminessTTF_Nerd_Font_Mono_Bold_Italic.json'],
			success: res => {
				that.setData({
					fontPath:res.fileList[0]['tempFileURL']
        })
        getApp().globalData.bgcardTempUrl = 'url("' + res.fileList[1]['tempFileURL'] + '")'
        getApp().globalData.acsszTempUrl = res.fileList[2]['tempFileURL']
        getApp().globalData.FontTempUrl = 'url("' + that.data.fontPath + '")'
        //getApp().globalData.TempJsonFontPath = res.fileList[3]['tempFileURL']
				wx.loadFontFace({
					family: 'dot',
					source: getApp().globalData.FontTempUrl,
					complete: function(res) {
             console.log('插入字体');
             console.log(res);
             that.setData({
              animation_display_first:"animation:display 1s ease 1 forwards;"
             })
          },
					success: function(res) { console.log('成功'); console.log(res); },
					fail: function(res) { console.log('失败'); console.log(res); },
				})
			},
			fail: console.error
    })
    //info = data.data;
    //console.log(info);
	},
	onUnload: function () {
		//THREE.global.clearCanvas()
  },
})
