Page({
	data: {
		//for text rolling
		text: "",
		marqueePace: 2,//滚动速度
		marqueeDistance: 0,//初始滚动距离
		marquee_margin: 500,
		size:15,
		interval: 20, // 时间间隔

		ballBottom: 0, 
		ballRight: 120,
		screenHeight: 0, 
		screenWidth: 0, 
		bo1:"drop-shadow",
		bo3:"drop-shadow",
		bo4:"drop-shadow",
		modelName:"",
		modelPath:"",
		jsonPath:"",
    fontPath:"",
    animation_card_canvas:"",
    display_card_canvas:"block",
    //butClass:"neumorphic-btn",
    UrlAcssz:"",
    UrlBg:"",
    chineseName:"",
    chinesePY:"",
    validDateBis:"",
    openidHashLine1:"",
    openidHashLine2:"",

    validStatus:"Valid",

    showIndex:0,

    loadgLTF:null,
  },

  description: function(e) {
    wx.navigateTo({
      url: '../description/index',
    })
  },
  
  coopList: function(e) {
    wx.navigateTo({
      url: '../coop/coop',
    })
    /*
    if(this.data.butClass=="neumorphic-btn"){
      this.setData({
        animation_card_canvas:"animation:shrink 1s ease 1 forwards;",
        display_card_canvas:"none",
        showIndex:3,
        butClass:"neumorphic-btn-active"
      })
      this.data.loadgLTF.makeSwitchRoute(new THREE.Vertex(0,0,0), new THREE.Vertex(0,0,-8), new THREE.Vertex(0,-3,0), 50);
    }else{
      this.setData({
        animation_card_canvas:"animation:turn_off_shrink 1s ease 1 forwards;",
        display_card_canvas:"block",
        showIndex:3,
        butClass:"neumorphic-btn"
      })
      this.data.loadgLTF.makeSwitchRoute(new THREE.Vertex(-1,0,0), new THREE.Vertex(2,0,5), new THREE.Vertex(0,0,0), 50);
    }
    */
  },
	
	onShow: function () {
		var that = this;

		wx.getSystemInfo({ 
			success: function (res) { 
				that.setData({ 
					screenHeight: res.windowHeight, 
					screenWidth: res.windowWidth, 
				});
			} 
    });
    let pages = getCurrentPages();
    console.log(pages)
    let currentPage = pages[pages.length - 1];
    currentPage.setData({
      'enableBack': false
    });
	},
	
	onLoad: function () {
    var that = this;
    try{
      that.setData({
        validDate:getApp().globalData.memberData.date,
        text:getApp().globalData.Ad,
        validStatus:"Valid",
        UrlAcssz:getApp().globalData.acsszTempUrl,
        UrlBg:getApp().globalData.bgcardTempUrl,
        chineseName:getApp().globalData.chineseName,
        chinesePY:getApp().globalData.chinesePY
      })
      getApp().globalData.strangeBack = true
    }catch{
      that.setData({
        text:"",
        validStatus:"Invalid"
      })
    }
    var validDateBis = getApp().globalData.memberData.date;
    validDateBis = validDateBis.split("-");
    validDateBis = validDateBis[1]+"/"+(parseInt(validDateBis[0].slice(-2))+1).toString();
    var openidHash = getApp().globalData.openidHash.padStart(16, "0");
    that.setData(
      {
        validDateBis:validDateBis,
        openidHashLine1:openidHash.slice(0,4)+" "+openidHash.slice(4,8),
        openidHashLine2:openidHash.slice(8,12)+" "+openidHash.slice(12,16),
      }
    )
    console.log("ad",getApp().globalData.Ad)
		wx.cloud.init();
		wx.getSystemInfo({ 
			success: function (res) { 
				that.setData({ 
				screenHeight: res.windowHeight, 
				screenWidth: res.windowWidth, 
				ballRight:0,
				ballBottom: 50
				});
			} 
    });
    wx.loadFontFace({
      family: 'dot',
      source: getApp().globalData.FontTempUrl,
      complete: function(res) { console.log('插入字体'); console.log(res); },
      success: function(res) { console.log('成功'); console.log(res); },
      fail: function(res) { console.log('失败'); console.log(res); },
    })
	},
	onUnload: function () {
		//THREE.global.clearCanvas()
	},
	touchStart(e) {
		THREE.global.touchEventHandlerFactory('canvas', 'touchstart')(e)
	},
	touchMove(e) {
		THREE.global.touchEventHandlerFactory('canvas', 'touchmove')(e)
	},
	touchEnd(e) {
		THREE.global.touchEventHandlerFactory('canvas', 'touchend')(e)
	},
	touchCancel(e) {
		// console.log('canvas', e)
	},
	longTap(e) {
		// console.log('canvas', e)
	},
	tap(e) {
		// console.log('canvas', e)
	},
	reLoadModel: function(name){
		var that = this;
		if(name!=that.data.modelName){
			that.setData({
				modelName : name
			})
			scene.remove(scene.children[scene.children.length-1])
			const gltfLoader = new GLTFLoader();
			gltfLoader.load(that.data.modelPath, (gltf) => {
				const root = gltf.scene;
				scene.add(root);
				root.traverse((obj) => {
					if (obj.castShadow !== undefined) {
						obj.castShadow = true;
						obj.receiveShadow = true;
					}
				});
				root.updateMatrixWorld();
			})
		}
	},
})
