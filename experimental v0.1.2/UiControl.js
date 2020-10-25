import{scene, meshCtrld, render, camera, onClick} from './main.js';
import {createMesh, Vec, rotate, offset} from './mesh.js';
import {offsetToCenter} from './render.js';


/// POLYGON LIST HANDLER
let editPointMode = false;
let liVal = 0;
let choosePolyPoint = 0;
let choosePoly = 0;
let cameraVal;
export let input = document.querySelectorAll('input');
export let polyListButton = document.getElementById("enter");
export let ul = document.querySelector("ul");
export let list = document.getElementsByTagName("li");
export let trash = document.getElementsByClassName("delete");
export let btndelete = document.getElementById("trash");

//For removing items with delete button
Array.prototype.slice.call(trash).forEach(function(item) {
  item.addEventListener("click", function(e) {
    console.log("element deleted");
    e.target.parentNode.remove();
  });
})

///Just to get camera value to process
document.onreadystatechange = function () {
  if(document.readyState == "complete") {
    cameraVal = camera;
  }
}


//toggle between classlist
function choosePoints() {
    switch(choosePolyPoint){
        case 2:
            this.children[1].style.backgroundColor = "#e6e6e6";
            this.children[choosePolyPoint].style.backgroundColor = 'red';
            choosePolyPoint = 0;
            break;
        default:
            switch(this.children[choosePolyPoint-1]){
                case undefined:
                    this.children[2].style.backgroundColor = "#e6e6e6";
                    this.children[choosePolyPoint].style.backgroundColor = 'red';
                    choosePolyPoint++;
                    break;
                default:
                    this.children[choosePolyPoint-1].style.backgroundColor = "#e6e6e6";
                    this.children[choosePolyPoint].style.backgroundColor = 'red';
                    choosePolyPoint++;
                    break;
                    
            }
    }
    choosePoly = this.value;
}

//check the length of the string entered
function inputlength(obj) {return obj.value.length;}

///json formatter
function prettyPrintArray(json) {
    let output = json.map(x=>JSON.stringify(x,null,1));
    return JSON.stringify(output, null, '<p>').replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\"\&])/g,'').replace(/n/g,'').replace("<br>",'');
}

//collect data that is inserted 
export function addli(obj) {
    if(ul.children.length === 0){
        var li = document.createElement("li");
        var btn = document.createElement("button");
        btn.className = "delete";
        btn.innerHTML = "X";
        btn.addEventListener("click", (e) => { ifDelLi(e); });
        li.addEventListener("click", choosePoints);
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
        li.addEventListener("click", choosePoints);
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


///CHANGE POLYGON COLOR ON <LI> HOVER///
function hover(element) {
    let color = "#e6e6e6";
    switch(editPointMode){
        case false:
            scene[meshCtrld].polygons[element.value].color="red";
            element.style.backgroundColor = color;
            updateColor(element, color);
            break;
        case true:
            (element.value === choosePoly) ? updateColor2(choosePolyPoint, element): updateColor(element, "white");
            break;
    }
    render(scene,camera);
}
function hoverOff(element) {
    let color = "white";
    switch(editPointMode){
        case false:
            updateColor(element, color);
            element.style.backgroundColor = color;
            delete scene[meshCtrld].polygons[element.value].color;
            break;
        case true:
            (element.value === choosePoly) ? updateColor2(choosePolyPoint, element): updateColor(element, "white");
            break;
        
    }
    render(scene,camera);

}
function updateColor(element, color){
    element.style.backgroundColor = color;
    element.children[0].style.backgroundColor = color;
    element.children[1].style.backgroundColor = color;
    element.children[2].style.backgroundColor = color;
    return;
}
function updateColor2(choosePolyPoint, element){
    switch(choosePolyPoint){
        case 0:
            element.children[2].style.backgroundColor = "#e6e6e6";
            element.children[choosePolyPoint].style.backgroundColor = "red";
            break;
        default:
            element.children[choosePolyPoint].style.backgroundColor = "red";
            element.children[choosePolyPoint+1].style.backgroundColor = "#e6e6e6";
            element.children[choosePolyPoint-1].style.backgroundColor = "#e6e6e6";
            break;
    }
}

/// GET MOUSE POSITION ///
let canvasCoorX;
let canvasCoorY;
let getMousePositionEnable = false;
export function getMousePosition(canvas, event) {
    switch(getMousePositionEnable){
        case true:
            let rect = canvas.getBoundingClientRect(); 
            let x = event.clientX - rect.left; 
            let y = event.clientY - rect.top;
            console.log(x + ", " + y);
            canvasCoorX = x;
            canvasCoorY = y;
            getMousePositionEnable = false;
            break;
        default:
            break;
    }
    
}

let scale = 400;
function reOffsetObj(obj){
    let fov = obj.z + cameraVal.pos.z;
    console.log(fov);
    let temp = obj;
    temp.x -= (406.5);
    temp.y -= (324.5);
    temp.x /= scale;
    temp.y /= scale;
    temp.x *= fov;
    temp.y *= fov;
    temp.x = Math.round(temp.x, 2);
    temp.y = Math.round(temp.y, 2);
    return temp;
    
}
//KEYBOARD CONTROL (ZOOM MOVE AND SHIT)

export function press(e){
console.log(getMousePositionEnable, editPointMode);
    switch(onClick){
        case true:
            console.log("onclick true");
            switch(e.keyCode){
                case 38:
                case 87:
                    scene[meshCtrld].rotation.x += 0.01;
                    render(scene, camera);
                    break;
                case 39:
                case 68:
                    scene[meshCtrld].rotation.y -= 0.01;
                    render(scene, camera);
                    break;
                case 40:
                case 83:
                    scene[meshCtrld].rotation.x -= 0.01;
                    render(scene, camera);
                    break;
                case 37:
                case 65:
                    scene[meshCtrld].rotation.y += 0.01;
                    render(scene, camera);
                    break;
                case 90:
                    scene[meshCtrld].position.z -= 1;
                    render(scene, camera);
                    break;
                case 88:
                    scene[meshCtrld].position.z += 1;
                    render(scene, camera);
                    break;
                case 192:
                    switch(editPointMode){
                        case false:
                            render(scene, camera);
                            editPointMode = true;
                            break;
                        default:
                            editPointMode = true;
                            let temp = scene[meshCtrld].polygons[choosePoly][choosePolyPoint];
                            
                            if(canvasCoorX === undefined && canvasCoorY === undefined){
                                console.log("test");
                                scene[meshCtrld].polygons[choosePoly][choosePolyPoint] = temp;
                            }else{
                                console.log("touch here");
                                getMousePositionEnable = true;
                                let tempZ = temp.z;
                                console.log(temp);
                                temp = {x: canvasCoorX, y: canvasCoorY, z: tempZ};
                                reOffsetObj(temp);
                                console.log(temp);
                                scene[meshCtrld].polygons[choosePoly][choosePolyPoint] = temp;
                                render(scene, camera);
                                resetList();
                            }
                            
                            render(scene, camera);
                            editPointMode = false;
                            break;
                    }
                    break;
                default:
                    break;
            }
            break;
        case false:
            switch(e.keyCode){
                case 38:
                case 87:
                    scene[meshCtrld].position.y -= 1;
                    render(scene, camera);
                    break;
                case 39:
                case 68:
                    scene[meshCtrld].position.x += 1;
                    render(scene, camera);
                    break;
                case 40:
                case 83:
                    scene[meshCtrld].position.y += 1;
                    render(scene, camera);
                    break;
                case 37:
                case 65:
                    scene[meshCtrld].position.x -= 1;
                    render(scene, camera);
                    break;
                case 90:
                    scene[meshCtrld].position.z -= 1;
                    render(scene, camera);
                    break;
                case 88:
                    scene[meshCtrld].position.z += 1;
                    render(scene, camera);
                    break;
                case 192:
                    switch(editPointMode){
                        case false:
                            getMousePositionEnable = true;
                            render(scene, camera);
                            editPointMode = true;
                            break;
                        default:
                            getMousePositionEnable = false;
                            render(scene, camera);
                            editPointMode = true;
                            break;
                    }
                    break;
                default:
                    break;
            }
            break;   
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
