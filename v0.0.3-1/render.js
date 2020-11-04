import {Vec} from './mesh.js';
import {backfaceCullingIsTrue as backfaceCulling} from './UiControl.js';

let camera = new Vec(0,0,100);
function drawMesh(mesh, camera, context) {
    mesh.polygons.forEach(polygon => {
        if(polygon.color!= null){
            context.strokeStyle = polygon.color;
            context.lineWidth = 4;
        }else{
            context.strokeStyle = mesh.color;
            context.lineWidth = 1;
        }
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
    } ;
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

export function vecCrossProduct(vecA, vecB){
    let res = new Vec();
    res.x = (vecA.x * vecB.z) - (vecA.z * vecB.y);
    res.y = (vecA.z * vecB.x) - (vecA.x * vecB.z);
    res.z = (vecA.x * vecB.y) - (vecA.y * vecB.x);
    return res;
}
export function VecDotProduct(VecA, VecB){
    return (VecA.x * VecB.x) + (VecA.y * VecB.y) + (VecA.z * VecB.z);
}

export function VecminVec(vecA, vecB){
    let res = new Vec();
    res.x = vecA.x - vecB.x;
    res.y = vecA.y - vecB.y;
    res.z = vecA.z - vecB.z;
    return res;
}

export function getNormal(polygon){
    return vecCrossProduct((VecminVec(polygon[1], polygon[0])), (VecminVec(polygon[2], polygon[0])));
}

export function offsetToCenter(point, canvas) {
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
