import {cube, pyramid} from '/js/models.js';
import {createMesh, Vec} from '/js/mesh.js';

import {createWireframeRenderer} from '/js/render.js';


// const canvas = document.querySelector('canvas');
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

const mesh1 = createMesh(cube);
mesh1.color = '#000';

const scene = [mesh1];
let meshCtrld = 0;

window.addEventListener('load', function() {
  var upload = document.getElementById('fileInput');

  var c1 = document.getElementById('input-file'),
      c6 = document.getElementById('load-file'),
      c7 = document.getElementById('file-name'),
      file = null;
  
  // Make sure the DOM element exists
  if (c1) {
      console.log(c1)
    c1.addEventListener('change', function() {
      // Make sure a file was selected
      if (this.files.length > 0) {
          file = this.files
          var tmp = ""
          for(i=0; i<this.files.length; i++){
              tmp += this.files[i].name;
              if(i === this.files.length-1)continue;
              tmp += '; ';
          }
          c7.innerHTML = tmp;
          c6.disabled = false;
      }else {
          c6.disabled = true
      }
    });
    c6.addEventListener('click', function() {
        console.log(file)
        if(file){
            var reader = new FileReader() // File reader to read the file
            // This event listener will happen when the reader has read the file
            reader.addEventListener('load', function(){
                var result = JSON.parse(reader.result) // Parse the result into an object
                var model = createMesh(result.obj)
                model.color = 'red'
                scene.push(model)
                render(scene, camera)
            })
            // this only support 1 file input.
            reader.readAsText(file[0])// Read the uploaded file
            c6.disabled = true
            file = null
            c1.files = null
            c1.value = ""
            c7.innerHTML = 'Choose File'
            document.getElementById('modal-close').click()
        }
    })
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

const render = createWireframeRenderer(myCanvas);
render(scene, camera);
function animate(time) {
    //mesh1.position.x = Math.sin(time / 1000) * 100;
    //mesh1.position.z = Math.sin(time / 1200) * 100;
    //mesh1.rotation.x += 0.01;
    mesh1.rotation.y += 0.01;


    render(scene, camera);

    requestAnimationFrame(animate);
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
                mesh1.rotation.x += 0.01;
                render(scene, camera);
            }
            else if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */){
                mesh1.rotation.y -= 0.01;
                render(scene, camera);
            }
            else if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */){
                mesh1.rotation.x -= 0.01;
                render(scene, camera);
            }
            else if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */ || e.keyCode === 81 /* q */){
                mesh1.rotation.y += 0.01;
                render(scene, camera);
            }
            else if(e.keyCode === 90 /* z */){
                mesh1.position.z -= 1;
                render(scene, camera);
            }
            else if(e.keyCode === 88 /* z */){
                mesh1.position.z += 1;
                render(scene, camera);
            }
        }
        else if(onClick===false){
            if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */){
              mesh1.position.y -= 1;
              render(scene, camera);
            }
            else if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */){
              mesh1.position.x += 1;
              render(scene, camera);
            }
            else if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */){
              mesh1.position.y += 1;
            render(scene, camera);
            }
            else if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */){
              mesh1.position.x -= 1;
              render(scene, camera);
            }
            else if(e.keyCode === 90 /* z */){
                mesh1.position.z -= 1;
                render(scene, camera);
            }
            else if(e.keyCode === 88 /* x */){
                mesh1.position.z += 1;
                render(scene, camera);
            }
        }
     
    }