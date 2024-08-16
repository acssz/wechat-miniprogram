import * as THREE from '../../libs/three.weapp.js'
import loadgLTF from './loadgLTF'
import gLTF from '../../jsm/loaders/GLTFLoader'

const scene = new THREE.Scene()
let GLTFLoader = gLTF(THREE);

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

    validStatus:"Valid",

    showIndex:0,

    loadgLTF:null,
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
	
	scrolltxt: function () {
    console.log("滚动")
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
	
	onLoad: function () {
    var that = this;
    try{
      that.setData({
        validDate:getApp().globalData.memberData.date,
        text:getApp().globalData.Ad,
        validStatus:"Valid"
      })
    }catch{
      that.setData({
        validDate:"invalid",
        text:"",
        validStatus:"Invalid"
      })
    }
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
    const loader = new THREE.TextureLoader();
    if(scene.children.length!=0){
      var k = scene.children.length
      for(var i=0;i<k;i++){
        scene.remove(scene.children[scene.children.length-1])
      }
    }
    wx.createSelectorQuery()
      .select('#c')
      .node()
      .exec((res) => {
        const canvas = new THREE.global.registerCanvas(res[0].node)
        that.data.loadgLTF = new loadgLTF(GLTFLoader ,canvas, THREE, scene, loader, "", getApp().globalData.TempJsonFontPath)
        //const bgTexture = loader.load(that.data.jsonPath);
        //scene.background = bgTexture;
        scene.background = new THREE.Color('#ecf0f3');
      })
    wx.createSelectorQuery()
      .select('#card')
      .boundingClientRect()
      .exec((res) => {
        console.log("res",res[0]);
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
