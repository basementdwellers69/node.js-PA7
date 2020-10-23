import {cube, pyramid} from './models.js';
import {createMesh, Vec} from './mesh.js';
import {createWireframeRenderer} from './render.js';
import {addli, resetList, addListAfterClick, input, polyListButton, ul, list, trash, press, fileHandler, backfaceCullingButton, setBackfaceCulling} from './UiControl.js';


const canvas = document.querySelector('canvas');
const canvasWindow = document.querySelector('#canvas');
canvas.width = canvasWindow.clientWidth;
console.log(canvas.width);
canvas.height = canvasWindow.clientHeight;

const mesh1 = createMesh(cube);
mesh1.color = '#000';

export const scene = [mesh1];
export let meshCtrld = 0;



///FILE INPUT HANDLER
window.addEventListener('load',fileHandler);


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

export const camera = new Camera();
camera.pos.z = 300;
camera.zoom = 20;

export const render = createWireframeRenderer(canvas);
render(scene, camera);
function animate(time) {
    //mesh1.position.x = Math.sin(time / 1000) * 100;
    //mesh1.position.z = Math.sin(time / 1200) * 100;
    //mesh1.rotation.x += 0.01;
    mesh1.rotation.y += 0.01;


    render(scene, camera);

    requestAnimationFrame(animate);
}

scene[meshCtrld].polygons.map(addli);


///CHOOSE MESH BUTTON CONTROLS
export const chooseMeshButton = document.querySelector('button');
chooseMeshButton.onclick = function(){
    
    let limit = scene.length-1;
    let value = parseInt(chooseMeshButton.value, 10);
    value = isNaN(value) ? 0 : value;
    
    if (value < limit){
        value++;
        chooseMeshButton.value = value;
        chooseMeshButton.innerHTML = value;
        meshCtrld = value;
        resetList();
    }else{
        value = 0;
        chooseMeshButton.value = value;
        chooseMeshButton.innerHTML = 0;
        meshCtrld = 0;
        resetList();
    }
}

/// BACKFACE CULLING TOGGLE
backfaceCullingButton.addEventListener("click", setBackfaceCulling);

/// ADD POLYGON HANDLER
polyListButton.addEventListener("click", addListAfterClick);

/// KEYBOARD CONTROLS ///
export let onClick = false;
window.addEventListener('mousedown', e2 => {onClick = true;});
window.addEventListener('mouseup', e2 => {onClick = false;});
window.addEventListener('keydown', press);
