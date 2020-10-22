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
