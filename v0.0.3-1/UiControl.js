import{scene, meshCtrld, render, camera, onClick} from './main.js';
import {createMesh, Vec} from './mesh.js';


/// POLYGON LIST HANDLER
var liVal = 0;
export var input = document.querySelectorAll('input');
export var polyListButton = document.getElementById("enter");
export var ul = document.querySelector("ul");
export var list = document.getElementsByTagName("li");
export var trash = document.getElementsByClassName("delete");
export var btndelete = document.getElementById("trash");

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
export function addli(obj) {
    if(ul.children.length === 0){
        var li = document.createElement("li");
        var btn = document.createElement("button");
        btn.className = "delete";
        btn.innerHTML = "X";
        btn.addEventListener("click", (e) => { ifDelLi(e); });
        li.addEventListener("click", strikeout);
        li.innerHTML = prettyPrintArray(obj);
        li.value = 0;
        li.onmouseover= function(){hover(this)};
        li.onmouseout= function(){hoverOff(this)};
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
        li.onmouseover= function(){hover(this)};
        li.onmouseout= function(){hoverOff(this)};
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
export function resetList(){
    liVal=0;
    ul.innerHTML = '';
    scene[meshCtrld].polygons.map(addli);
}

function updateLi(){
    for(let i = 0; i <= ul.children.length-1; i++){
        ul.children[i].value = i;
    }
}

//this will add a new list item after click 
export function addListAfterClick() {
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
export function addListKeyPress(event) {
  if (inputlength(input[1]) > 0 && inputlength(input[2]) > 0 && inputlength(input[3]) > 0 && inputlength(input[4]) > 0 && inputlength(input[5]) > 0 && inputlength(input[6]) > 0 && inputlength(input[7]) > 0 && inputlength(input[8]) > 0 && inputlength(input[9]) > 0 || event.which === 13){
    let temp = [new Vec(input[1].value,input[2].value,input[3].value),
                  new Vec(input[4].value,input[5].value,input[6].value),
                  new Vec(input[7].value,input[8].value,input[9].value)];
    scene[meshCtrld].polygons.push(temp);
    addli(temp);
    render(scene, camera);
  }
}

///CHANGE POLYGON COLOR ON <LI> HOVER///
function hover(element) {
    element.style.backgroundColor = "#e6e6e6";
    scene[meshCtrld].polygons[element.value].color="red";
    render(scene,camera);
}
function hoverOff(element) {
    element.style.backgroundColor = "white";
    delete scene[meshCtrld].polygons[element.value].color;
    render(scene,camera);
}

//KEYBOARD CONTROL (ZOOM MOVE AND SHIT)
export function press(e){
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

/// CONTROLING THE LOAD OBJECT
export function fileHandler(e) {
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
                model.color = "blue";
                scene.push(model);
                render(scene, camera);
        });
        
        reader.readAsText(upload.files[0]); // Read the uploaded file
      }
    });
  }
}
