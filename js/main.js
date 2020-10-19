import {cube, pyramid} from '/js/models.js';
import {createMesh, Vec} from '/js/mesh.js';
import {createWireframeRenderer} from '/js/render.js';


// const canvas = document.querySelector('canvas');
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

var myCanvas = document.getElementById('canvas')

const mesh1 = createMesh(cube);
mesh1.color = '#000';

const scene = [mesh1];
let meshCtrld = 0;

window.addEventListener('load', function() {
  var upload = document.getElementById('fileInput');

  var c1 = document.getElementById('input-file'),
      c6 = document.getElementById('load-file'),
      c7 = document.getElementById('file-name'),
      c8 = document.getElementById('select-mesh'),
      c9 = document.getElementById('msg-select-mesh'),
      file = null;
  
  // Make sure the DOM element exists
  if (c1) {
    //   console.log(c1)
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
    c8.addEventListener('click', function() {
        let limit = scene.length-1,
            value = parseInt(c9.innerText, 10)

        value = isNaN(value) ? 0 : value
        if(value<limit) {
            value++;
            c9.innerHTML = value
            meshCtrld = value
        }else {
            value = 0
            c9.innerHTML = 0
            meshCtrld = 0
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

var resizeCanvas = function() {  
    myCanvas.width = window.innerWidth * (82/100)
    myCanvas.height = window.innerHeight * (89/100)
    render(scene, camera)
}
window.addEventListener('resize', resizeCanvas)

resizeCanvas()
/// KEYBOARD CONTROLS ///
let onClick = false;

window.addEventListener('mousedown', e2 => {
    onClick = true;
});
window.addEventListener('mouseup', e2 => {
    onClick = false;
});
window.addEventListener('keydown', e => press(e));

var press = function(e){
    if(currentStateElement != null){
        switch(currentStateElement.id){
            case 'add-polygon':
                // c14.style.display = 'inline-flex'
                break
            case 'edit-polygon':
                // c15.style.display = 'inline-flex'
                break
            case 'delete-polygon':
                // c16.style.display = 'inline-flex'
                break
            case 'zoom-mesh':
                console.log(currentStateElement.id)
                if(e.keyCode == 90 /* z */){
                    scene[meshCtrld].position.z -= 1;
                    render(scene, camera);
                }else if(e.keyCode == 88 /* x */){
                    scene[meshCtrld].position.z += 1;
                    render(scene, camera);
                }
                break
            case 'rotate-mesh':
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
                break
            case 'move-mesh':
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
                break
        }
    }
}