window.addEventListener("load", function () {
    "use strict";
    
    var w = 1920, h = 1080;
   

    var container = document.getElementById("canvasID"); 
    var renderer = new THREE.WebGLRenderer( { canvas: container, antialias: true });
    renderer.setSize(w, h);
    //var view = document.getElementById("view");
    //view.appendChild(renderer.domElement);
    
    var camera = new THREE.PerspectiveCamera(45, w / h, 1, 10000);
    camera.position.set(2000, -2000, 2000);
    camera.up.set( 0, 0, 1 );
    //camera.lookAt(100, 2000, 500);  

    var controls = new THREE.TrackballControls(camera, view);
  
    // http://stackoverflow.com/questions/18581225/orbitcontrol-or-trackballcontrol 

    /*// set controls*/
    //controls.position0.set( 0, 0, 10 ); // set a new desired position

    // heaps ewww
    controls.target.set( 0, 700, 700 ); // set a new target 

    /*controls.up0.set( 0, 0, 1);*/
 
    var scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0x666666));
    
    var light1 = new THREE.DirectionalLight(0xffffff);
    light1.position.set(0, 2000, 2000);
    scene.add(light1);
    
    var light2 = new THREE.DirectionalLight(0xffffff);
    light2.position.set(0, -100, -100);
    scene.add(light2);

 
    var mat = new THREE.MeshPhongMaterial({
        color: 0x339900, ambient: 0x339900, specular: 0x030303,
    });
    var obj = new THREE.Mesh(new THREE.Geometry(), mat);
    scene.add(obj);
   
    // ---------------------------------- 
    // load in STL geometry from url (?)
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'service-built-in.stl', true);
    xhr.responseType = 'blob';
    xhr.onload = function(e) {
      if (this.status == 200) {
        var myBlob = this.response;
       
        var arrayBuffer;
        var fileReader = new FileReader();
        fileReader.onload = function() {
            arrayBuffer = this.result;
            var geom = loadStl(arrayBuffer);
            obj = new THREE.Mesh(geom, mat);
            scene.add(obj);
        };
        fileReader.readAsArrayBuffer(myBlob);
 
        // myBlob is now the blob that the object URL pointed to.
      }
    };
    xhr.send(); 
    // i hate myself
    // ---------------------------------- 
    
    var loop = function loop() {
        requestAnimationFrame(loop);
        //obj.rotation.z += 0.05;
        controls.update();
        renderer.clear();
        renderer.render(scene, camera);
    };
    loop();
    
    // file load
    var openFile = function (file) {
        var reader = new FileReader();
        reader.addEventListener("load", function (ev) {
            var buffer = ev.target.result;
            var geom = loadStl(buffer);
            scene.remove(obj);
            obj = new THREE.Mesh(geom, mat);
            scene.add(obj);
        }, false);
        reader.readAsArrayBuffer(file);
    };
    
    // file input button
    var input = document.getElementById("file");
    input.addEventListener("change", function (ev) {
        var file = ev.target.files[0];
        openFile(file);
    }, false);
    
    // dnd
    view.addEventListener("dragover", function (ev) {
        ev.stopPropagation();
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "copy";
    }, false);
    view.addEventListener("drop", function (ev) {
        ev.stopPropagation();
        ev.preventDefault();
        var file = ev.dataTransfer.files[0];
        openFile(file);
    }, false);
}, false);
