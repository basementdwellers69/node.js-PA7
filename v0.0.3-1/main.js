import {cube, pyramid} from './models.js';
import {createMesh, Vec, offset, rotate} from './mesh.js';
import {createWireframeRenderer} from './render.js';
import {addli, resetList, addListAfterClick, input, polyListButton, ul, list, trash, press, fileHandler, backfaceCullingButton, setBackfaceCulling, saveMeshObj} from './UiControl.js';


const canvas = document.querySelector('canvas');
const canvasWindow = document.querySelector('#canvas');
canvas.width = canvasWindow.clientWidth;
canvas.height = canvasWindow.clientHeight;

export const scene = new Array();
export let meshCtrld = 0;

console.log(scene[meshCtrld]);

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

(scene[meshCtrld] === undefined || scene[meshCtrld].length < 0) ? console.log("no mesh loaded!") : scene[meshCtrld].polygons.map(addli) ;

///CHOOSE MESH BUTTON CONTROLS
export const chooseMeshButton = document.querySelector('button');
chooseMeshButton.onclick = function(){
    const colorInput = document.querySelector('#colorInput');
    console.log(colorInput);
    let limit = scene.length-1;
    let value = parseInt(chooseMeshButton.value, 10);
    value = isNaN(value) ? 0 : value;
    
    if (value < limit){
        value++;
        chooseMeshButton.value = value;
        chooseMeshButton.innerHTML = value;
        meshCtrld = value;
        colorInput.value = scene[meshCtrld].color;
        resetList();
    }else{
        value = 0;
        chooseMeshButton.value = value;
        chooseMeshButton.innerHTML = 0;
        meshCtrld = 0;
        colorInput.value = scene[meshCtrld].color;
        resetList();
    }
}

///  SAVE BUTTON HANDLER
document.querySelector('#saveMesh').addEventListener("click", saveMeshObj);

/// DEL MESH BUTTON HANDLER
document.querySelector('#delMesh').addEventListener("click", function(){
    scene.splice(meshCtrld, 1);
    meshCtrld = 0;
    render(scene, camera);
});

/// CHANGE MESH COLOR HANDLER
document.querySelector('#color').addEventListener("click", function(){
    scene[meshCtrld].color = colorInput.value;
    render(scene, camera);
})

/// BACKFACE CULLING TOGGLE
backfaceCullingButton.addEventListener("click", setBackfaceCulling);

/// ADD POLYGON HANDLER
polyListButton.addEventListener("click", addListAfterClick);

/// KEYBOARD CONTROLS ///
export let onClick = false;
window.addEventListener('mousedown', e2 => {onClick = true;});
window.addEventListener('mouseup', e2 => {onClick = false;});
window.addEventListener('keydown', press);
