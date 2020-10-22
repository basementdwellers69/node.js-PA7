export function createMesh(model) {
    return new Mesh(model.map(toPolygon));
}

function toPoint([x, y, z]) {
    return new Vec(x, y, z);
}

function toPolygon(shape) {
    return shape.map(toPoint);
}

// SET SCALE
export function offset(point, position) {
    point.x += position.x;
    point.y += position.y;
    point.z += position.z;
    //console.log("(transform) mesh.offset = x: " + point.x + " , y: " + point.y + " , z: " + point.z);
}

export function rotate(point, rotation) {
    const sin = new Vec(
        Math.sin(rotation.x),
        Math.sin(rotation.y),
        Math.sin(rotation.z));

    const cos = new Vec(
        Math.cos(rotation.x),
        Math.cos(rotation.y),
        Math.cos(rotation.z));

    let temp1, temp2;
    
    // X AXIS ROTATION
    temp1 = cos.x * point.y + sin.x * point.z;
    temp2 = -sin.x * point.y + cos.x * point.z;
    point.y = temp1;
    point.z = temp2;
    //console.log("(transform) rotate.x = y: " + point.y + " , z: " + point.z );
    
    // Y AXIS ROTATION
    temp1 = cos.y * point.x + sin.y * point.z;
    temp2 = -sin.y * point.x + cos.y * point.z;
    point.x = temp1;
    point.z = temp2;
    //console.log("(transform) rotate.y = x: " + point.x + " , z: " + point.z );
    
    // Y AXIS ROTATION
    temp1 = cos.z * point.x + sin.z * point.y;
    temp2 = -sin.z * point.x + cos.z * point.y;
    point.x = temp1;
    point.y = temp2;
    //console.log("(transform) rotate.y = x: " + point.x + " , y: " + point.y );
}

class Mesh {
    constructor(polygons) {
        this.polygons = polygons;
        this.position = new Vec();
        this.rotation = new Vec();
    }

    *[Symbol.iterator] () {
        for (const polygon of this.polygons) {
            yield polygon.map(point => ({...point}));
        }
    }

    transform(point) {
        rotate(point, this.rotation);
        offset(point, this.position);
    }
}

export class Vec {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
