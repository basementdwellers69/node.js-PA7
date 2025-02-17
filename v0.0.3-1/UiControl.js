import{scene, meshCtrld, render, camera, onClick} from './main.js';
import {createMesh, Vec, rotate, offset} from './mesh.js';
import {offsetToCenter, getNormal, vecCrossProduct, VecDotProduct, VecminVec} from './render.js';

export let sortedList=[];


/// CONTROLING THE LOAD OBJECT
export function fileHandler(e) {
  let upload = document.getElementById('fileInput');
  
  // Make sure the DOM element exists
  if (upload) 
  {
    upload.addEventListener('change', function() {
      // Make sure a file was selected
      if (upload.files.length > 0) 
      {
        let reader = new FileReader(); // File reader to read the file 
        
        // This event listener will happen when the reader has read the file
        reader.addEventListener('load', function() {
          let result = JSON.parse(reader.result); // Parse the result into an object      
                let model = createMesh(result.obj);
                model.color = "black";
                scene.push(model);
                resetList();
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
    callPaintedLines();

    function callPaintedLines(){
        sortedList=[];
        PaintedLines(obj);
    }
    let data = JSON.stringify({"obj":JSON.stringify(sortedList).replace(/"(x|y|z)": ?/g,'').replace(/{/g,'[').replace(/}/g,']')}).replace(/"/g,'').replace(/obj/i,'"obj"');
    let saveAs = prompt("Save file as","New Mesh");
    if(saveAs != null){
        saveAs = saveAs + ".json";
        download(data, saveAs);
    }
}

function download(data, filename) {
    let file = new Blob([data], {type: "octet/stream"});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        let a = document.createElement("a"),
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
        for(let i = 2; i<=10; i++){
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
    return JSON.stringify(output, null, '<p>').replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\*\+\?\|\"\&])/g,'').replace(/n/g,'').replace("<br>",'');
}

//collect data that is inserted 
export function addli(obj) {
    let objNormal = ((VecDotProduct(getNormal(obj), camera.pos)));
    console.log(objNormal);
    if(ul.children.length === 0){
        let li = document.createElement("li");
        let btn = document.createElement("button");
        btn.className = "delete";
        btn.innerHTML = "X";
        btn.addEventListener("click", (e) => { ifDelLi(e); });
        li.addEventListener("click", choosePoints);
        li.innerHTML = prettyPrintArray(obj) + '<br>' + "Normal : " + objNormal;
        li.value = 0;
        li.onmouseover= function(){hover(this)};
        li.onmouseout= function(){hoverOff(this)};
        liVal++;
        li.appendChild(btn);
        ul.appendChild(li);
        for(let i = 2; i<=10; i++){
            input[i].value = "";
        }
    }
    else
    {
        let li = document.createElement("li");
        let btn = document.createElement("button");
        btn.className = "delete";
        btn.innerHTML = "X";
        btn.addEventListener("click", (e) => { ifDelLi(e); });
        li.addEventListener("click", choosePoints);
        li.innerHTML = prettyPrintArray(obj) + '<br>' + "Normal : " + objNormal;
        li.value = liVal;
        li.onmouseover= function(){hover(this)};
        li.onmouseout= function(){hoverOff(this)};
        liVal++;
        li.appendChild(btn);
        ul.appendChild(li);
        for(let i = 2; i<=10; i++){
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
        if (inputlength(input[2]) > 0 && inputlength(input[3]) > 0 && inputlength(input[4]) > 0 && inputlength(input[5]) > 0 && inputlength(input[6]) > 0 && inputlength(input[7]) > 0 && inputlength(input[8]) > 0 && inputlength(input[9]) > 0 && inputlength(input[10]) > 0) {
          let temp = [new Vec(input[2].value,input[3].value,input[4].value),
                      new Vec(input[5].value,input[6].value,input[7].value),
                      new Vec(input[8].value,input[9].value,input[10].value)];
            scene[meshCtrld].polygons[choosePoly] = temp;
            resetList();
            render(scene, camera);
        }
    }else{
       if (inputlength(input[2]) > 0 && inputlength(input[3]) > 0 && inputlength(input[4]) > 0 && inputlength(input[5]) > 0 && inputlength(input[6]) > 0 && inputlength(input[7]) > 0 && inputlength(input[8]) > 0 && inputlength(input[9]) > 0 && inputlength(input[10]) > 0) {
          let temp = [new Vec(input[2].value,input[3].value,input[4].value),
                      new Vec(input[5].value,input[6].value,input[7].value),
                      new Vec(input[8].value,input[9].value,input[10].value)];
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
    input[2].value = temp[0].x;
    input[3].value = temp[0].y;
    input[4].value = temp[0].z;
    input[5].value = temp[1].x;
    input[6].value = temp[1].y;
    input[7].value = temp[1].z;
    input[8].value = temp[2].x;
    input[9].value = temp[2].y;
    input[10].value = temp[2].z;
    
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
                    scene[meshCtrld].rotation.z += 0.01;;
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

////    SAVE MESH ADDITIONAL FEATURES ///

function round(v) {
    return (v >= 0 || -1) * Math.round(Math.abs(v));
}

let newP = function(obj, t, i, j, k){
    return [
            round((obj[i][j].x) + t*(obj[i][k].x - obj[i][j].x)),
            round(obj[i][j].y + t*(obj[i][k].y - obj[i][j].y)),
            round(obj[i][j].z + t*(obj[i][k].z - obj[i][j].z))
    ];
}

let edge = function(obj, i, j, k, l){;
    return [
            obj[i][j].x - obj[k][l].x, 
            obj[i][j].y - obj[k][l].y, 
            obj[i][j].z - obj[k][l].z
    ];
}

let tObj = function(obj1, normal, obj2){
    this.val = (((obj1[0] * normal[0]) + (obj1[1] * normal[1]) + (obj1[2] * normal[2])) / 
            ((obj2[0] * normal[0]) + (obj2[1] * normal[1]) + (obj2[2] * normal[2])));
    return this.val;
}

let cross = function(obj1, obj2){
    return [
            obj1[1]*obj2[2] - obj1[2]*obj2[1],
            obj1[2]*obj2[0] - obj1[0]*obj2[2],
            obj1[0]*obj2[1] - obj1[1]*obj2[0]
    ];
}
let param = function(obj1, obj2){
    this.val =(obj1[0] * obj2[0] + obj1[1]* obj2[1] + obj1[2]* obj2[2]);
    return this.val;
}

function PaintedLines(listObject){
    let leftList = [];
    let rightList = [];
    if(listObject.length>1){
        let edge1Obj = new edge(listObject,0,1,0,0);
        let edge2Obj = new edge(listObject,0,2,0,1);
        let edge3Obj = new edge(listObject,0,0,0,2);
        let NormalObj = [
            (edge1Obj[1] * edge2Obj[2]) - (edge2Obj[1] * edge1Obj[2]),
            (edge1Obj[2] * edge2Obj[0]) - (edge2Obj[2] * edge1Obj[0]),
            (edge1Obj[0] * edge2Obj[1]) - (edge2Obj[0] * edge1Obj[1])
        ];
        for(let i = 1;i<listObject.length;i++){
            
            let edge1 = new edge(listObject,i,0,0,0);
            let edge2 = new edge(listObject,i,1,0,0);
            let edge3 = new edge(listObject,i,2,0,0);
            let a = round((NormalObj[0] * edge1[0]) +(NormalObj[1] * edge1[1]) +(NormalObj[2] * edge1[2]));
            let b = round((NormalObj[0] * edge2[0]) +(NormalObj[1] * edge2[1]) +(NormalObj[2] * edge2[2]));
            let c = round((NormalObj[0] * edge3[0]) +(NormalObj[1] * edge3[1]) +(NormalObj[2] * edge3[2]));
            
            if(a<=0 && b<=0 && c<=0){
                leftList.push(listObject[i]);
            }else if(a>=0 && b>=0 && c>=0){
                rightList.push(listObject[i]);
            }else if ((a <= 0 && b <= 0 && c > 0) || (a > 0 && b > 0 && c <= 0)){
                let c1 = new edge(listObject,i,2,0,0);
                let c2 = new edge(listObject,i,2,0,1);
                let c3 = new edge(listObject,i,2,0,2);
                let cross1 = new cross(edge1Obj, c1);
                let cross2 = new cross(edge2Obj, c2);
                let cross3 = new cross(edge3Obj, c3);
                let param1 = new param(NormalObj, cross1);
                let param2 = new param(NormalObj, cross2);
                let param3 = new param(NormalObj, cross3);
                
                if(param1.val <= -1 || param2.val <= -1 || param3.val <= -1){
                    
                    leftList.push(listObject[i]);
                    
                }else{
                    let e1 = new edge(listObject,0,0,i,2);
                    let e2 = new edge(listObject,i,0,i,2);
                    let e3 = new edge(listObject,i,1,i,2);
                    let t = new tObj(e1, NormalObj, e2);
                    let t2 = new tObj(e1, NormalObj, e3);
                    let newP1 = new newP(listObject, t.val, i, 2, 0);
                    let newP2 = new newP(listObject, t2.val, i, 2, 1);
                    let newMesh1 = [
                        [listObject[i][2].x,listObject[i][2].y,listObject[i][2].z],
                        newP1,
                        newP2
                    ];
                    let newMesh2 = [
                        [listObject[i][0][0],listObject[i][0][1],listObject[i][0][2]],
                        newP1,
                        [listObject[i][1][0],listObject[i][1][1],listObject[i][1][2]]
                    ];
                    let newMesh3 = [
                        [listObject[i][1][0],listObject[i][1][1],listObject[i][1][2]],
                        newP1,
                        newP2
                    ];
                    if(c > 0){
                        leftList.push(newMesh2);
                        leftList.push(newMesh3);
                    }else{
                        leftList.push(newMesh1);
                    }
                }
                
            }else if ((a <= 0 && c <= 0 && b > 0) || (a > 0 && c > 0 && b <= 0)){
                let c1 = new edge(listObject,i,1,0,0);
                let c2 = new edge(listObject,i,1,0,1);
                let c3 = new edge(listObject,i,1,0,2);
                let cross1 = new cross(edge1Obj, c1);
                let cross2 = new cross(edge2Obj, c2);
                let cross3 = new cross(edge3Obj, c3);
                let param1 = new param(NormalObj, cross1);
                let param2 = new param(NormalObj, cross2);
                let param3 = new param(NormalObj, cross3);

                if(param1.val <= -1 || param2.val <= -1 || param3.val <= -1){
                    leftList.push(listObject[i]);
                }else{
                    let e1 = new edge(listObject,0,0,i,1);
                    let e2 = new edge(listObject,i,2,i,1);
                    let e3 = new edge(listObject,i,0,i,1);
                    let t = new tObj(e1, NormalObj, e2);
                    let t2 = new tObj(e1, NormalObj, e3);
                    let newP1 = new newP(listObject, t.val, i, 1, 2);
                    let newP2 = new newP(listObject, t2.val, i, 1, 0);
                    let newMesh1 = [
                        [listObject[i][1][0],listObject[i][1][1],listObject[i][1][2]],
                        newP1,
                        newP2
                    ];
                    let newMesh2 = [
                        [listObject[i][2].x,listObject[i][2].y,listObject[i][1][2]],
                        newP1,
                        [listObject[i][0][0],listObject[i][0][1],listObject[i][0][2]]
                    ];
                    let newMesh3 = [
                        [listObject[i][0][0],listObject[i][0][1],listObject[i][0][2]],
                        newP1,
                        newP2
                    ];
                    if(b > 0){
                        leftList.push(newMesh2);
                        leftList.push(newMesh3);
                    }else{
                        leftList.push(newMesh1);
                    }
                }
                
            }else if ((b <= 0 && c <= 0 && a > 0) || (b > 0 && c > 0 && a <= 0)){
                let c1 = new edge(listObject,i,0,0,0);
                let c2 = new edge(listObject,i,0,0,1);
                let c3 = new edge(listObject,i,0,0,2);
                let cross1 = new cross(edge1Obj, c1);
                let cross2 = new cross(edge2Obj, c2);
                let cross3 = new cross(edge3Obj, c3);
                let param1 = new param(NormalObj, cross1);
                let param2 = new param(NormalObj, cross2);
                let param3 = new param(NormalObj, cross3);
                
                if(param1.val <= -1 || param2.val <= -1 || param3.val <= -1){
                    leftList.push(listObject[i]);
                }else{
                    let e1 = new edge(listObject,0,0,i,0);
                    let e2 = new edge(listObject,i,1,i,0);
                    let e3 = new edge(listObject,i,2,i,0);
                    let t = new tObj(e1, NormalObj, e2);
                    let t2 = new tObj(e1, NormalObj, e3);
                    let newP1 = new newP(listObject, t.val, i, 0, 1);
                    let newP2 = new newP(listObject, t2.val, i, 0, 2);
                    let newMesh1 = [
                        [listObject[i][0][0],listObject[i][0][1],listObject[i][0][2]],
                        newP1,
                        newP2
                    ];
                    let newMesh2 = [
                        [listObject[i][1][0],listObject[i][1][1],listObject[i][1][2]],
                        newP1,
                        [listObject[i][2].x,listObject[i][2].y,listObject[i][2].z]
                    ];
                    let newMesh3 = [
                        [listObject[i][2].x,listObject[i][2].y,listObject[i][2].z],
                        newP1,
                        newP2
                    ];
                    if(a > 0){
                        leftList.push(newMesh2);
                        leftList.push(newMesh3);
                    }else{
                        leftList.push(newMesh1);
                    }
                }
            }
        }
    }
    if(leftList.length>0){
        PaintedLines(leftList);
        sortedList.push(listObject[0]);
    }else{
        sortedList.push(listObject[0]);
    }
    if(rightList.length>0){
        PaintedLines(rightList);
    }
}
