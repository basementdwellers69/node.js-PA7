import {createMesh, Vec, rotate, offset} from './mesh.js';
import {createWireframeRenderer, VecDotProduct, getNormal} from './render.js';

scene = new Array()
meshCtrld = 0
sortedList=[]

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

camera = new Camera();
camera.pos.z = 300;
camera.zoom = 20;
var adjustCanvasSize = function() {
    myCanvas.width = window.innerWidth * (65/100)
    myCanvas.height = window.innerHeight * (89/100)
}
// RESIZE CANVAS
export var resizeCanvas = function() {  
    adjustCanvasSize()
    render(scene, camera)
}
adjustCanvasSize()

render = createWireframeRenderer(myCanvas);
render(scene, camera);

function newMesh() {
    console.log("no Mesh detected. create new Mesh")
    let temp = createMesh(new Array())
    scene.push(temp)
}

(scene[meshCtrld] === undefined || scene[meshCtrld].length < 0) ? 
    newMesh() : scene[meshCtrld].polygons.map(addLi);
    
// KEYBOARD CONTROLLER
export var onKeyDownListener = function(e){
    if(currentStateElement != null){
        switch(currentStateElement.id){
            case 'zoom-mesh':
                // console.log(currentStateElement.id)
                 if(e.code === 'KeyZ'){
                    scene[meshCtrld].position.z -= 1;
                    render(scene, camera);
                }else if(e.code === 'KeyX'){
                    scene[meshCtrld].position.z += 1;
                    render(scene, camera);
                }
                break
            case 'rotate-mesh':
                if (e.code === 'ArrowUp' || e.code === 'KeyW'){
                    scene[meshCtrld].rotation.x += 0.02;
                    render(scene, camera);
                }
                else if (e.code === 'ArrowRight' || e.code === 'KeyD'){
                    scene[meshCtrld].rotation.y -= 0.02;
                    render(scene, camera);
                }
                else if (e.code === 'ArrowDown' || e.code === 'KeyS'){
                    scene[meshCtrld].rotation.x -= 0.02;
                    render(scene, camera);
                }
                else if (e.code === 'ArrowLeft' || e.code === 'KeyA'){
                    scene[meshCtrld].rotation.y += 0.02;
                    render(scene, camera);
                }
                else if(e.code === 'KeyQ'){
                    scene[meshCtrld].rotation.z += 0.02;
                    render(scene, camera);
                }
                else if(e.code === 'KeyE'){
                    scene[meshCtrld].rotation.z -= 0.02;
                    render(scene, camera);
                }
                break
            case 'move-mesh':
                if (e.code === 'ArrowUp' || e.code === 'KeyW'){
                    scene[meshCtrld].position.y -= 1;
                    render(scene, camera);
                  }
                  else if (e.code === 'ArrowRight' || e.code === 'KeyD'){
                    scene[meshCtrld].position.x += 1;
                    render(scene, camera);
                  }
                  else if (e.code === 'ArrowDown' || e.code === 'KeyS'){
                    scene[meshCtrld].position.y += 1;
                  render(scene, camera);
                  }
                  else if (e.code === 'ArrowLeft' || e.code === 'KeyA'){
                    scene[meshCtrld].position.x -= 1;
                    render(scene, camera);
                  }
                break
        }
    }
}
//SAVE MESH
export var saveMeshObj = function(){
    function callPaintedLines(){
        sortedList=[];
        PaintedLines(obj);
    }
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

    let data = JSON.stringify({"obj":JSON.stringify(sortedList)
        .replace(/"(x|y|z)": ?/g,'')
        .replace(/{/g,'[').replace(/}/g,']')}
        ).replace(/"/g,'').replace(/obj/i,'"obj"');
    let saveAs = prompt("Save file as","New Mesh");
    if(saveAs != null){
        saveAs = saveAs + ".json";
        download(data, saveAs);
    }
}
// DELETE MESH
export var deleteMesh = function(){
    scene.splice(meshCtrld, 1);
    meshCtrld = 0;
    render(scene, camera);
    selectMesh()
}
// INPUT FILE
export var inputMeshFile = function() {
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
}
// LOAD FILE
export var loadMeshFile = function() {
    if(file){
        var reader = new FileReader() // File reader to read the file
        // This event listener will happen when the reader has read the file
        reader.addEventListener('load', function(){
            var result = JSON.parse(reader.result) // Parse the result into an object
            var model = createMesh(result.obj)
            model.color = c20.value
            scene.push(model)
            render(scene, camera)
            resetList()
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
}
// SELECT MESH
export var selectMesh = function() {
    let limit = scene.length-1,
        value = parseInt(c9.innerText, 10)

    value = isNaN(value) ? 0 : value
    if(value<limit) {
        value++;
        c9.innerHTML = value
        meshCtrld = value
        resetList()
    }else {
        value = 0
        c9.innerHTML = 0
        meshCtrld = 0
        resetList()
    }
    //set current selected mesh color
    if(scene[meshCtrld] !== undefined || scene.length > 0){
        selectedMeshColor = scene[meshCtrld].color
        c20.value = selectedMeshColor
    }
}
// SET MESH COLOR
export var setMeshColor = function() {
    // default value for meshColor is #333
    var meshColor = selectedMeshColor = c20.value
    console.log(meshColor)
    if(scene[meshCtrld] === undefined || scene.length == 0)return
    scene[meshCtrld].color = meshColor;
    render(scene, camera);
}
export var setBFC = function() {
    var changeMessage = function(tmp, msg) {
        c3.innerHTML = 'BFC ' + msg;
        setTimeout(handler => {
            c3.innerHTML = document.title;
        }, 1500)
    }
    if(c17.checked){
        c17.value = "1"
        console.log('BFC is enabled')
        c17.parentElement.getElementsByTagName('span')[0].innerHTML = 'Enabled'
        changeMessage(c3.innerText, 'enabled')
        isBFCEnabled = true
        render(scene,camera)
    }else{
        c17.value = "0"
        console.log('BFC is disabled');
        c17.parentElement.getElementsByTagName('span')[0].innerHTML = 'Disabled';
        changeMessage(c3.innerText, 'disabled');
        isBFCEnabled = false
        render(scene,camera)
    }
    //PREVENT FOCUS STYLE BY BOOTSTRAP.
    c17.parentElement.classList.remove('focus')
}

//POLYGON LIST
liVal = 0, choosePoly = 0
var clone = function() {
    var temp = new Array()
    for (let index = 0; index < c22.length; index++) {
        temp.push(c22[index].value)
    }
    return temp
}
prevPolygonPoints = clone()
export var enterPolygon = function() {
    var isPointChanged = false;
    // check if there is any differences with previous
    for(i=0; i<prevPolygonPoints.length; i++){
        // console.log('prevpoint['+i+'] : '+ prevPolygonPoints[i] + ', c22['+i+'] : '+ c22[i].value)
        if(prevPolygonPoints[i] != c22[i].value){
            isPointChanged = true;
            break;
        }
    }

    if(isPointChanged){
        let temp = [new Vec(c22[0].value,c22[1].value,c22[2].value),
                    new Vec(c22[3].value,c22[4].value,c22[5].value),
                    new Vec(c22[6].value,c22[7].value,c22[8].value)];

        if(isPolygonPointUpdate){
            scene[meshCtrld].polygons[choosePoly] = temp;
            resetList();
            render(scene, camera);
        }else {
            scene[meshCtrld].polygons.push(temp);
            addLi(temp);
            render(scene, camera);
        }
    }else{
        alert('none of Polygon Points changed.')
    }
}
var addLi = function(obj) {
    let objNormal = ((VecDotProduct(getNormal(obj), camera.pos)));

    let li = document.createElement("li");
    let btn = document.createElement("input");
    btn.setAttribute('type', 'button')
    btn.setAttribute('value', 'Delete Point')
    btn.classList.add('btn')
    btn.classList.add('btn-outline-dark')
    btn.classList.add('btn-sm')
    btn.addEventListener("click",deletePolygon);
    li.classList.add('cursor--pointer')
    li.addEventListener("click", choosePoints);
    li.addEventListener('mouseenter', onMouseEnterPolygonList)
    li.addEventListener('mouseleave', onMouseLeavePolygonList)
    li.innerHTML = buildList(obj);
    // + "<small>Normal : " + objNormal + "</small>"
    li.value = liVal;
    // li.classList.add('ac')
    liVal++;
    li.appendChild(btn);
    c23.appendChild(li);
    for(i=0; i<c22.length; i++){
        c22[i].value = "";
    }
}

// ADDITIONAL FUNCTION TO CERTAIN FEATURES.
function deletePolygon(){
    var val = parseInt(this.parentElement.value);
    if(val === null || val === 0){
        scene[meshCtrld].polygons.splice(0,1);
        this.parentElement.remove();
    }else{
        scene[meshCtrld].polygons.splice(val,1);
        this.parentElement.remove();
    }
    updateLi();
    render(scene, camera);
}
function choosePoints() {
    switch(isPolygonPointUpdate){
        case true:
            isPolygonPointUpdate = false;
            for(i=0; i<c22.length; i++){
                c22[i].value = "";
                c24.value = "Enter Polygon";
            }
            prevPolygonPoints = clone()
            break
        case false:
            isPolygonPointUpdate = true;
            updateTextInputPolygon(this);
            c24.value = "Edit Polygon";
    }
    choosePoly = this.value;
}
function onMouseEnterPolygonList(){
    var element = this
    // console.log(e)
    switch(isPolygonPointUpdate){
        case false:
            scene[meshCtrld].polygons[element.value].color= selectedMeshColor;
            element.style.backgroundColor = "#e6e6e6";
            break;
        case true:
             scene[meshCtrld].polygons[element.value].color= selectedMeshColor;
            (element.value === choosePoly) ? element.style.backgroundColor = "#e6e6e6" : element.style.backgroundColor = "white";
            break;
    }
    render(scene,camera);
}
function onMouseLeavePolygonList(){
    var element = this
    // console.log(e)
    switch(isPolygonPointUpdate){
        case false:
            element.style.backgroundColor = "white";
            delete scene[meshCtrld].polygons[element.value].color;
            break;
        case true:
            if (element.value === choosePoly){
                element.style.backgroundColor = "#e6e6e6";
                scene[meshCtrld].polygons[element.value].color= selectedMeshColor;
            }else{
                element.style.backgroundColor = "white";
                delete scene[meshCtrld].polygons[element.value].color;
            }
            break;
    }
    render(scene,camera);
}
function updateLi() {
    for(let i = 0; i <= c23.children.length-1; i++){
        c23.children[i].value = i;
    }
}
function updateTextInputPolygon(e) {
    let temp = scene[meshCtrld].polygons[e.value];
    c22[0].value = temp[0].x;
    c22[1].value = temp[0].y;
    c22[2].value = temp[0].z;
    c22[3].value = temp[1].x;
    c22[4].value = temp[1].y;
    c22[5].value = temp[1].z;
    c22[6].value = temp[2].x;
    c22[7].value = temp[2].y;
    c22[8].value = temp[2].z;
    prevPolygonPoints = clone()
}
function resetList(){
    liVal=0;
    c23.innerHTML = '';
    scene[meshCtrld].polygons.map(addLi);
}
function buildList(json) {
    let output = json.map(x=>JSON.stringify(x,null,1));
    return JSON.stringify(output, null, '<p>')
        .replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\*\+\?\|\"\&])/g,'')
        .replace(/n/g,'')
        .replace("<br>",'');
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