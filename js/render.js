import {Vec} from './mesh.js';
let backfaceCulling = false;
let camera = new Vec(0,0,100);

/// BACKFACE CULLING
c17.addEventListener('click', function(){
    if(this.value === "0"){
        backfaceCulling = true;
        this.value = "1";
    }else{
       backfaceCulling = false;
    }
});
function drawMesh(mesh, camera, context) {
    context.strokeStyle = mesh.color;

    mesh.polygons.forEach(polygon => {
        const projectedPolygon = polygon.map(point => ({...point}));

        projectedPolygon.forEach(point => {
            mesh.transform(point);
            camera.project(point);
        });

        drawPolygon(projectedPolygon, context);
    });
}

function drawPolygon(polygon, context) {
    if ((VecDotProduct(getNormal(polygon), camera)) > 0 && backfaceCulling === true){
        return;
    }
    polygon.forEach(point => {
        offsetToCenter(point, context.canvas);
    });

    context.beginPath();

    const first = polygon[0];
    context.moveTo(first.x, first.y);
    for (const point of polygon) {
        context.lineTo(point.x, point.y);
    }
    context.lineTo(first.x, first.y);

    context.stroke();
}

function vecCrossProduct(vecA, vecB){
    let res = new Vec();
    res.x = (vecA.x * vecB.z) - (vecA.z * vecB.y);
    res.y = (vecA.z * vecB.x) - (vecA.x * vecB.z);
    res.z = (vecA.x * vecB.y) - (vecA.y * vecB.x);
    return res;
}
function VecDotProduct(VecA, VecB){
    return (VecA.x * VecB.x) + (VecA.y * VecB.y) + (VecA.z * VecB.z);
}

function VecminVec(vecA, vecB){
    let res = new Vec();
    res.x = vecA.x - vecB.x;
    res.y = vecA.y - vecB.y;
    res.z = vecA.z - vecB.z;
    return res;
}

function getNormal(polygon){
    return vecCrossProduct((VecminVec(polygon[1], polygon[0])), (VecminVec(polygon[2], polygon[0])));
}

function offsetToCenter(point, canvas) {
    point.x += canvas.width / 2;
    point.y += canvas.height / 2;
}

export function createWireframeRenderer(canvas) {
    const context = canvas.getContext('2d');

    return function render(scene, camera) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        scene.forEach(mesh => {
            drawMesh(mesh, camera, context);
        });
    }
}
