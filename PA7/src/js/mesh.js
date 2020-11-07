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
    
    // Y AXIS ROTATION
    temp1 = cos.y * point.x + sin.y * point.z;
    temp2 = -sin.y * point.x + cos.y * point.z;
    point.x = temp1;
    point.z = temp2;
    
    // Y AXIS ROTATION
    temp1 = cos.z * point.x + sin.z * point.y;
    temp2 = -sin.z * point.x + cos.z * point.y;
    point.x = temp1;
    point.y = temp2;
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

export class Camera {
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
