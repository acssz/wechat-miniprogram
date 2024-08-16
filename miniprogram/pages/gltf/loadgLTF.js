import { OrbitControls } from '../../jsm/controls/OrbitControls'
//import { FBXLoader } from '../../jsm/loaders/FBXLoader.js';

export default function (GLTFLoader,canvas, THREE, scene, loader, modelPath, jsonPath) {
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.shadowMap.enabled = false;
  renderer.setSize(canvas.width*2, canvas.height*2, false); //ELE

  const fov = 20;
  const aspect = 1;  // the canvas default
  const near = 0.1;
  const far = 10;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(5, -1, 2); //ELE
  camera.lookAt({
    x:0,
    y:0,
    z:0
  });

  camera.aspect = canvas.width / canvas.height; //ELE
  camera.updateProjectionMatrix();

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0.5, 0); //ELE
  controls.update();

  function addLines(oPoint,v0,v1) {
    let m1 = getExpand(oPoint,v0,v1)
    let curve = new THREE.CatmullRomCurve3([v0, m1, v1]);
    return {
        curve: curve,
    };
  }
  
  function getExpand(oPoint,v0,v1){
    let om1 = (oPoint.distanceTo(v0) + oPoint.distanceTo(v1))/2;
    let m0 = new THREE.Vertex((v0.x+v1.x)/2,(v0.y+v1.y)/2,(v0.z+v1.z)/2);
    let om0 = oPoint.distanceTo(m0);
    let scale = om1 / om0;
    let m1 = new THREE.Vertex(scale*(m0.x-oPoint.x)+oPoint.x,scale*(m0.y-oPoint.y)+oPoint.y,scale*(m0.z-oPoint.z)+oPoint.z);
    return m1
  }

  scene.background = new THREE.Color('#ecf0f3'); //ELE #ecf0f3

  {
    const planeSize = 40;

    const texture = loader.load('../../res/3d/checker.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    //scene.add(mesh);
  }

  {
    const skyColor = 0xB1E1FF;  // light blue
    const groundColor = 0xB97A20;  // brownish orange
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
  }

  {
    const color = 0xFFFFFF; //ELE
    const intensity = 1; //ELE
    const light = new THREE.DirectionalLight(color, intensity);
    light.castShadow = true;
    light.position.set(500, 1000, 1000);
    light.target.position.set(-500, -1000, -1000);

    light.shadow.bias = -0.004;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;

    scene.add(light);
    scene.add(light.target);
    const cam = light.shadow.camera;
    cam.near = 1;
    cam.far = 2000;
    cam.left = -1500;
    cam.right = 1500;
    cam.top = 1500;
    cam.bottom = -1500;

    const cameraHelper = new THREE.CameraHelper(cam);
    scene.add(cameraHelper);
    cameraHelper.visible = false;
    const helper = new THREE.DirectionalLightHelper(light, 100);
    scene.add(helper);
    helper.visible = false;

    function updateCamera() {
      // update the light target's matrixWorld because it's needed by the helper
      light.updateMatrixWorld();
      light.target.updateMatrixWorld();
      helper.update();
      // update the light's shadow camera's projection matrix
      light.shadow.camera.updateProjectionMatrix();
      // and now update the camera helper we're using to show the light's shadow camera
      cameraHelper.update();
    }
    updateCamera();

  }

  function createBoxWithRoundedEdges( width, height, depth, radius0, smoothness ) {
    let shape = new THREE.Shape();
    let eps = 0.00001;
    let radius = radius0 - eps;
    shape.absarc( eps, eps, eps, -Math.PI / 2, -Math.PI, true );
    shape.absarc( eps, height -  radius * 2, eps, Math.PI, Math.PI / 2, true );
    shape.absarc( width - radius * 2, height -  radius * 2, eps, Math.PI / 2, 0, true );
    shape.absarc( width - radius * 2, eps, eps, 0, -Math.PI / 2, true );
    let geometry = new THREE.ExtrudeBufferGeometry( shape, {
      amount: depth - radius0 * 2,
      bevelEnabled: true,
      bevelSegments: smoothness * 2,
      steps: 1,
      bevelSize: radius,
      bevelThickness: radius0,
      curveSegments: smoothness
    });
    
    geometry.center();
    
    return geometry;
  }

  //var meshMaterial_depth = new THREE.MeshDepthMaterial()

  var meshMaterial = new THREE.MeshNormalMaterial({
      flatShading: THREE.FlatShading,
      transparent: true,
      opacity: 0.9
  });
  var mesh = new THREE.Mesh(createBoxWithRoundedEdges(0.85,1.4,0.02,0.1,100), meshMaterial);
  mesh.scale.set(1,1,0.3);
  mesh.position.set(0, 0, 0);
  scene.add(mesh);

  var loader = new THREE.FontLoader();

  console.log("loading 3d font..")
  loader.load(jsonPath, function ( font ) {
    console.log("load 3d font succ")
    try{
      //var cardText = getApp().globalData.memberData.email.split("@")[0]
      var cardText = getApp().globalData.chinesePY
    }catch{
      var cardText = "Error"
    }
    var geometry = new THREE.TextGeometry(cardText, {
      font: font,
      size: 0.1,
      height: 0.02,
      curveSegments: 0.01,
      //bevelEnabled: true,
      //bevelThickness: 0.0001,
      //bevelSize: 0.001,
      //bevelSegments: 0.001
    });
    var fontMaterial = new THREE.MeshLambertMaterial({
      color: 0xDDDDDD
    });
    var fontModel = new THREE.Mesh(geometry,fontMaterial);
    fontModel.position.set(-0.21, -0.55, 0.001);
    fontModel.rotation.set(0, 0, 1.57);
    scene.add(fontModel);
  })

  new THREE.TextureLoader().load("../../images/acssz.png",
    (texture) => {
        const SIZE = 1;
        const img = texture.image;
        let height = (img && img.height) || SIZE;
        let width = (img && img.width) || SIZE;
        height = (SIZE / width) * height;
        width = SIZE;
        const mat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true });
        const geom = new THREE.PlaneGeometry(width, height);
        const mesh = new THREE.Mesh(geom, mat);
        mesh.rotation.set(0, 3.1416, 0);
        mesh.position.set(0, 0, -0.03);
        scene.add(mesh);
    }
  );

  new THREE.TextureLoader().load("../../res/bg-card.png",
    (texture) => {
        const SIZE = 1;
        const img = texture.image;
        let height = (img && img.height) || SIZE;
        let width = (img && img.width) || SIZE;
        height = (SIZE / width) * height;
        width = SIZE;
        const mat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true ,opacity:0.3});
        const geom = new THREE.PlaneGeometry(width, height);
        const mesh = new THREE.Mesh(geom, mat);
        mesh.rotation.set(0, 0, 1.57);
        mesh.position.set(0, 0, 0.01);
        mesh.scale.set(1.2,1.2,1.2);
        scene.add(mesh);
    }
  );

  // model
  /*
  const FBXloader = new FBXLoader();
  FBXloader.load(modelPath, function ( object ) {
    mixer = new THREE.AnimationMixer( object );
    const action = mixer.clipAction( object.animations[ 0 ] );
    action.play();
    object.traverse( function ( child ) {
      if ( child.isMesh ) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    } );
    scene.add( object );
  } );
  */

  //use card model
  /*{
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(modelPath, (gltf) => {
      const root = gltf.scene;
      scene.add(root);

      root.traverse((obj) => {
        if (obj.castShadow !== undefined) {
          obj.castShadow = true;
          obj.receiveShadow = true;
        }
      });

      root.updateMatrixWorld();
    }, (e) => {
      console.log('loading')
    });

  }*/

  //const cars = [];

  // create 2 Vector3s we can use for path calculations
  //const carPosition = new THREE.Vector3();
  //const carTarget = new THREE.Vector3();

  //make switch curve route

  function makeSwitchRoute(centerPos,camPos,aimPos,indexAmount){
    let camPoints=addLines(centerPos,camera.position,camPos).curve.getPoints(indexAmount);
    let aimPoints=addLines(centerPos,controls.target,aimPos).curve.getPoints(indexAmount);
    return {
      cam: camPoints,
      aim: aimPoints
    };
  }

  var routes = makeSwitchRoute(new THREE.Vertex(-1,0,0), new THREE.Vertex(2,0,5), new THREE.Vertex(0,0,0), 50)

  var index = 0;

  function render(time) {
    time *= 0.001;  // convert to seconds
    {
      const pathTime = time * .01;
      const targetOffset = 0.01;
      if(index<50){
        camera.position.set(routes.cam[index].x,routes.cam[index].y,routes.cam[index].z);
        controls.target.set(routes.aim[index].x,routes.aim[index].y,routes.aim[index].z);
        controls.update();
        index++;
      }
    }
    renderer.render(scene, camera);
    canvas.requestAnimationFrame(render);
  }

  canvas.requestAnimationFrame(render);

  this.reloadAni = function(){
    index = 0;
  };
  this.makeSwitchRoute = function(centerPos,camPos,aimPos,indexAmount){
    routes = makeSwitchRoute(centerPos,camPos,aimPos,indexAmount);
    index = 0;
  };
}