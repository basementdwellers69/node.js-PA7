import{scene, meshCtrld, render, camera, onClick} from './main.js';
import {createMesh, Vec, rotate, offset} from './mesh.js';
import {offsetToCenter} from './render.js';


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

/// SAVE AS CONTROLLER
export function saveMeshObj(){
    let obj = new Array();
   scene.forEach(function(mesh){
       let curMesh = new Array();
       let pos = mesh.position;
       let rot = mesh.rotation;
       mesh.polygons.map(e=>curMesh.push(e));
       curMesh.map(e=>e.map(f=>rotate(f, rot)));
       curMesh.map(e=>e.map(f=>offset(f, pos)));
       curMesh.map(e=>obj.push(e));
   });
    let data = JSON.stringify({"obj":JSON.stringify(obj).replace(/"(x|y|z)": ?/g,'').replace(/{/g,'[').replace(/}/g,']')}).replace(/"/g,'').replace(/obj/i,'"obj"');
    let saveAs = prompt("Save file as","New Mesh");
    if(saveAs != null){
        saveAs = saveAs + ".json";
        download(data, saveAs);
    }
}

function download(data, filename) {
    var file = new Blob([data], {type: "octet/stream"});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

export let backfaceCullingButton = document.querySelector("#bCulling");
export let backfaceCullingIsTrue = false;

export function setBackfaceCulling(){
    console.log(backfaceCullingButton.value);
    if(backfaceCullingButton.value === "0"){
        backfaceCullingIsTrue = true;
        backfaceCullingButton.value = "1";
        backfaceCullingButton.innerHTML = "ON";
        render(scene, camera);
    }else if(backfaceCullingButton.value === "1"){
        backfaceCullingButton.value = "0";
        backfaceCullingIsTrue = false;
        backfaceCullingButton.innerHTML = "OFF";
        render(scene, camera);
    }
}


/// POLYGON LIST HANDLER
let editPointMode = false;
let liVal = 0;
let choosePoly = 0;
export let input = document.querySelectorAll('input');
export let polyListButton = document.getElementById("enter");
export let ul = document.querySelector("ul");
export let list = document.getElementsByTagName("li");
export let trash = document.getElementsByClassName("delete");

//For removing items with delete button
Array.prototype.slice.call(trash).forEach(function(item) {
  item.addEventListener("click", function(e) {
    console.log("element deleted");
    e.target.parentNode.remove();
  });
})


//toggle between classlist
function choosePoints() {
    if(editPointMode === false){
        editPointMode = true;
        updateInputOnClick(this);
        polyListButton.innerHTML = "Update Polygon";
    }else{
        editPointMode = false;
        for(let i = 1; i<=9; i++){
            input[i].value = "";
            polyListButton.innerHTML = "Enter";
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
    for(let i = 1; i<=9; i++){
                console.log(inputlength(input[i]));
            }
    if(editPointMode === true){
        if (inputlength(input[1]) > 0 && inputlength(input[2]) > 0 && inputlength(input[3]) > 0 && inputlength(input[4]) > 0 && inputlength(input[5]) > 0 && inputlength(input[6]) > 0 && inputlength(input[7]) > 0 && inputlength(input[8]) > 0 && inputlength(input[9]) > 0) {
          let temp = [new Vec(input[1].value,input[2].value,input[3].value),
                      new Vec(input[4].value,input[5].value,input[6].value),
                      new Vec(input[7].value,input[8].value,input[9].value)];
            scene[meshCtrld].polygons[choosePoly] = temp;
            resetList();
            render(scene, camera);
        }
    }else{
        if (inputlength(input[1]) > 0 && inputlength(input[2]) > 0 && inputlength(input[3]) > 0 && inputlength(input[4]) > 0 && inputlength(input[5]) > 0 && inputlength(input[6]) > 0 && inputlength(input[7]) > 0 && inputlength(input[8]) > 0 && inputlength(input[9]) > 0) {
          let temp = [new Vec(input[1].value,input[2].value,input[3].value),
                      new Vec(input[4].value,input[5].value,input[6].value),
                      new Vec(input[7].value,input[8].value,input[9].value)];
            scene[meshCtrld].polygons.push(temp);
            addli(temp);
            render(scene, camera);
        }
    }

    editPointMode = false;
    polyListButton.innerHTML = "Enter";
}

function updateInputOnClick(element){
    let temp = scene[meshCtrld].polygons[element.value];
    input[1].value = temp[0].x;
    input[2].value = temp[0].y;
    input[3].value = temp[0].z;
    input[4].value = temp[1].x;
    input[5].value = temp[1].y;
    input[6].value = temp[1].z;
    input[7].value = temp[2].x;
    input[8].value = temp[2].y;
    input[9].value = temp[2].z;
    
}

///CHANGE POLYGON COLOR ON <LI> HOVER///
function hover(element) {
    switch(editPointMode){
        case false:
            scene[meshCtrld].polygons[element.value].color="red";
            element.style.backgroundColor = "#e6e6e6";
            break;
        case true:
            scene[meshCtrld].polygons[element.value].color="red";
            (element.value === choosePoly) ? element.style.backgroundColor = "#e6e6e6" : element.style.backgroundColor = "white";
            break;
    }
    render(scene,camera);
}

function hoverOff(element) {
    switch(editPointMode){
        case false:
            element.style.backgroundColor = "white";
            delete scene[meshCtrld].polygons[element.value].color;
            break;
        case true:
            if (element.value === choosePoly){
                element.style.backgroundColor = "#e6e6e6";
                scene[meshCtrld].polygons[element.value].color="red";
            }else{
                element.style.backgroundColor = "white";
                delete scene[meshCtrld].polygons[element.value].color;
            }
            break;
    }
    render(scene,camera);

}


//KEYBOARD CONTROL (ZOOM MOVE AND SHIT)

export function press(e){
    switch(onClick){
        case true:
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
                case 69:
                    scene[meshCtrld].rotation.z -= 0.01;
                    render(scene, camera);
                    break;
                case 81:
                    scene[meshCtrld].rotation.z += 0.01;
                    render(scene, camera);
                    break;
                case 88:
                    scene[meshCtrld].position.z += 1;
                    render(scene, camera);
                    break;
                case 90:
                    scene[meshCtrld].position.z -= 1;
                    render(scene, camera);
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
                case 69:
                    scene[meshCtrld].rotation.z -= 0.01;
                    render(scene, camera);
                    break;
                case 81:
                    scene[meshCtrld].rotation.z += 0.01;
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
                }
            break;
    } 
}
