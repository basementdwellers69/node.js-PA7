import {cube, pyramid} from './models.js';
import {createMesh, Vec} from './mesh.js';
import {createWireframeRenderer} from './render.js';


const canvas = document.querySelector('canvas');
const canvasWindow = document.querySelector('#canvas');
canvas.width = canvasWindow.clientWidth;
canvas.height = canvasWindow.clientHeight;

const mesh1 = createMesh(cube);
mesh1.color = '#000';

const scene = [mesh1];
let meshCtrld = 0;

///FILE INPUT HANDLER
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


/// POLYGON LIST HANDLER
var liVal = 0;
var input = document.querySelectorAll('input');
var polyListButton = document.getElementById("enter");
var ul = document.querySelector("ul");
var list = document.getElementsByTagName("li");
var trash = document.getElementsByClassName("delete");
var btndelete = document.getElementById("trash");

//For removing items with delete button
Array.prototype.slice.call(trash).forEach(function(item) {
  item.addEventListener("click", function(e) {
    console.log("element deleted");
    e.target.parentNode.remove();
  });
})

//loop for to strikeout the list 
for (var i = 0; i < list.length; i++) {
  list[i].addEventListener("click", strikeout);
}

//toggle between classlist
function strikeout() {
  this.classList.toggle("done");
}

//check the length of the string entered
function inputlength(obj) {return obj.value.length;}

///json formatter
function prettyPrintArray(json) {
    let output = json.map(x=>JSON.stringify(x,null,1));
    return JSON.stringify(output, null, '<br>').replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\"\&])/g,'').replace(/n/g,'');
}

//collect data that is inserted 
function addli(obj) {
    if(ul.children.length === 0){
        var li = document.createElement("li");
        var btn = document.createElement("button");
        btn.className = "delete";
        btn.innerHTML = "X";
        btn.addEventListener("click", (e) => { ifDelLi(e); });
        li.addEventListener("click", strikeout);
        li.innerHTML = prettyPrintArray(obj);
        li.value = 0;
        liVal++;
        li.appendChild(btn);
        ul.appendChild(li);
        for(let i = 1; i<=9; i++){
            input[i].value = "";
        }
    }
    else
    {
        var li = document.createElement("li");
        var btn = document.createElement("button");
        btn.className = "delete";
        btn.innerHTML = "X";
        btn.addEventListener("click", (e) => { ifDelLi(e); });
        li.addEventListener("click", strikeout);
        li.innerHTML = prettyPrintArray(obj);
        li.value = liVal;
        liVal++;
        li.appendChild(btn);
        ul.appendChild(li);
        for(let i = 1; i<=9; i++){
            input[i].value = "";
        }
    }
    
}

function ifDelLi(e){
    let val = parseInt(e.target.parentNode.value);
    if(val === null || val === 0){
        scene[meshCtrld].polygons.splice(0,1);
        e.target.parentNode.remove();
    }else{
        scene[meshCtrld].polygons.splice(val,1);
        e.target.parentNode.remove();
    }
    updateLi();
    render(scene, camera);
}
function resetList(){
    liVal=0;
    temp=0;
    delCount=0;
    ul.innerHTML = '';
    scene[meshCtrld].polygons.map(addli);
}

function updateLi(){
    for(let i = 0; i <= ul.children.length-1; i++){
        ul.children[i].value = i;
    }
}

//this will add a new list item after click 
function addListAfterClick() {
  if (inputlength(input[1]) > 0 && inputlength(input[2]) > 0 && inputlength(input[3]) > 0 && inputlength(input[4]) > 0 && inputlength(input[5]) > 0 && inputlength(input[6]) > 0 && inputlength(input[7]) > 0 && inputlength(input[8]) > 0 && inputlength(input[9]) > 0) {
      let temp = [new Vec(input[1].value,input[2].value,input[3].value),
                  new Vec(input[4].value,input[5].value,input[6].value),
                  new Vec(input[7].value,input[8].value,input[9].value)];
    scene[meshCtrld].polygons.push(temp);
    addli(temp);
    render(scene, camera);
  }
}

//this will add a new list item with keypress
function addListKeyPress(event) {
  if (inputlength(input[1]) > 0 && inputlength(input[2]) > 0 && inputlength(input[3]) > 0 && inputlength(input[4]) > 0 && inputlength(input[5]) > 0 && inputlength(input[6]) > 0 && inputlength(input[7]) > 0 && inputlength(input[8]) > 0 && inputlength(input[9]) > 0 || event.which === 13){
    let temp = [new Vec(input[1].value,input[2].value,input[3].value),
                  new Vec(input[4].value,input[5].value,input[6].value),
                  new Vec(input[7].value,input[8].value,input[9].value)];
    scene[meshCtrld].polygons.push(temp);
    addli(temp);
    render(scene, camera);
  }
}

//this will check for the event/keypress and create new list item
input[1].addEventListener("keypress", addListKeyPress);

//this will check for a click event and create new list item
polyListButton.addEventListener("click", addListAfterClick);


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

scene[meshCtrld].polygons.map(addli);


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
        resetList();
    }else{
        value = 0;
        chooseMeshButton.value = value;
        chooseMeshButton.innerHTML = 0;
        meshCtrld = 0;
        resetList();
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
