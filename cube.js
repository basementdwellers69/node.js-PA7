const Cube = function(x, y, z, size) {

    Point3D.call(this, x, y, z);

    size *= 0.5;

    this.vertices = [new Point3D(x - size, y - size, z - size),
                     new Point3D(x + size, y - size, z - size),
                     new Point3D(x + size, y + size, z - size),
                     new Point3D(x - size, y + size, z - size),
                     new Point3D(x - size, y - size, z + size),
                     new Point3D(x + size, y - size, z + size),
                     new Point3D(x + size, y + size, z + size),
                     new Point3D(x - size, y + size, z + size)];

    this.faces = [[0, 1, 2, 3], [0, 4, 5, 1], [1, 5, 6, 2], [3, 2, 6, 7], [0, 3, 7, 4], [4, 7, 6, 5]];
};

Cube.prototype = {

    rotateX:function(radian) {

        var cosine = Math.cos(radian);
        var sine   = Math.sin(radian);

        for (let index = this.vertices.length - 1; index > -1; -- index) {

            let p = this.vertices[index];

            let y = (p.y - this.y) * cosine - (p.z - this.z) * sine;
            let z = (p.y - this.y) * sine + (p.z - this.z) * cosine;

            p.y = y + this.y;
            p.z = z + this.z;

        }
    },

    rotateY:function(radian) {

        var cosine = Math.cos(radian);
        var sine   = Math.sin(radian);

        for (let index = this.vertices.length - 1; index > -1; -- index) {

            let p = this.vertices[index];

            let x = (p.z - this.z) * sine + (p.x - this.x) * cosine;
            let z = (p.z - this.z) * cosine - (p.x - this.x) * sine;

            p.x = x + this.x;
            p.z = z + this.z;

        }
    }
};


