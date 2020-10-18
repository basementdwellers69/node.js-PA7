import {cube, pyramid} from './models.js';
import {createMesh, Vec} from './mesh.js';
import {createWireframeRenderer} from './render.js';


const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mesh1 = createMesh(cube);
mesh1.color = '#000';

const scene = [mesh1];
let meshCtrld = 0;

window.addEventListener('load', function() {
  var upload = document.getElementById('fileInput');
  
  // Make sure the DOM element exists
  if (upload) 
  {
    upload.addEventListener('change', function() {
      // Make sure a file was selected
      if (upload.files.length > 0) 
      {
        var reader = new FileReader(); // File reader to read the file 
        
        // This event listener will happen when the reader has read the file
        reader.addEventListener('load', function() {
          var result = JSON.parse(reader.result); // Parse the result into an object      
                var model = createMesh(result.obj);
                model.color = "red";
                scene.push(model);
                render(scene, camera);
        });
        
        reader.readAsText(upload.files[0]); // Read the uploaded file
      }
    });
  }
});


class Camera {
    constructor() {
        this.pos = new Vec(0, 0, 100);
        this.zoom = 8;
    }

    project(point) {
        perspective(point, this.pos.z);
        zoom(point, this.zoom);
    }
}

function perspective(point, distance) {
    const fov = point.z + distance;
    point.x /= fov;
    point.y /= fov;
}

function zoom(point, factor) {
    const scale = Math.pow(factor, 2);
    point.x *= scale;
    point.y *= scale;
}

const camera = new Camera();
camera.pos.z = 300;
camera.zoom = 20;

const render = createWireframeRenderer(canvas);
render(scene, camera);
function animate(time) {
    //mesh1.position.x = Math.sin(time / 1000) * 100;
    //mesh1.position.z = Math.sin(time / 1200) * 100;
    //mesh1.rotation.x += 0.01;
    mesh1.rotation.y += 0.01;


    render(scene, camera);

    requestAnimationFrame(animate);
}

console.log(mesh1);

///CHOOSE MESH BUTTON CONTROLS
const chooseMeshButton = document.querySelector('button');

chooseMeshButton.onclick = function(){
    
    let limit = scene.length-1;
    let value = parseInt(chooseMeshButton.value, 10);
    value = isNaN(value) ? 0 : value;
    
    if (value < limit){
        value++;
        chooseMeshButton.value = value;
        chooseMeshButton.innerHTML = value;
        meshCtrld = value;
    }else{
        value = 0;
        chooseMeshButton.value = value;
        chooseMeshButton.innerHTML = 0;
        meshCtrld = 0;
    }
}



/// KEYBOARD CONTROLS ///
let onClick = false;

window.addEventListener('mousedown', e2 => {
    onClick = true;
});
window.addEventListener('mouseup', e2 => {
    onClick = false;
});
window.addEventListener('keydown', press);
    function press(e){
        if(onClick===true){
            if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */){
                scene[meshCtrld].rotation.x += 0.01;
                render(scene, camera);
            }
            else if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */){
                scene[meshCtrld].rotation.y -= 0.01;
                render(scene, camera);
            }
            else if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */){
                scene[meshCtrld].rotation.x -= 0.01;
                render(scene, camera);
            }
            else if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */ || e.keyCode === 81 /* q */){
                scene[meshCtrld].rotation.y += 0.01;
                render(scene, camera);
            }
            else if(e.keyCode === 90 /* z */){
                scene[meshCtrld].position.z -= 1;
                render(scene, camera);
            }
            else if(e.keyCode === 88 /* z */){
                scene[meshCtrld].position.z += 1;
                render(scene, camera);
            }
        }
        else if(onClick===false){
            if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */){
              scene[meshCtrld].position.y -= 1;
              render(scene, camera);
            }
            else if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */){
              scene[meshCtrld].position.x += 1;
              render(scene, camera);
            }
            else if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */){
              scene[meshCtrld].position.y += 1;
            render(scene, camera);
            }
            else if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */){
              scene[meshCtrld].position.x -= 1;
              render(scene, camera);
            }
            else if(e.keyCode === 90 /* z */){
                scene[meshCtrld].position.z -= 1;
                render(scene, camera);
            }
            else if(e.keyCode === 88 /* x */){
                scene[meshCtrld].position.z += 1;
                render(scene, camera);
            }
        }
     
    }
