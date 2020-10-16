const Point2D = function(x, y) { this.x = x; this.y = y; };
const Point3D = function(x, y, z) { this.x = x; this.y = y; this.z = z; };

var pointer = new Point2D(0, 0);

var cube = new Cube(0, 0, 400, 300);

var height = document.documentElement.clientHeight;
var width = document.documentElement.clientWidth;

function project(points3d, width, height) {

    var points2d = new Array(points3d.length);

    var focal_length = 200;

    for (let index = points3d.length - 1; index > -1; -- index) {

      let p = points3d[index];

      let x = p.x * (focal_length / p.z) + width * 0.5;
      let y = p.y * (focal_length / p.z) + height * 0.5;

      points2d[index] = new Point2D(x, y);

    }

    return points2d;

}

function loop() {
    window.requestAnimationFrame(loop);

    height = document.documentElement.clientHeight;
    width = document.documentElement.clientWidth;

    context.canvas.height = height;
    context.canvas.width  = width;

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);

    context.strokeStyle = "#000";

    cube.rotateX(pointer.y * 0.0001);
    cube.rotateY(-pointer.x * 0.0001);

     context.globalAlpha = 0.5;
    var vertices = project(cube.vertices, width, height);

    for (let index = cube.faces.length - 1; index > -1; -- index) {

      let face = cube.faces[index];


        context.beginPath();
        context.moveTo(vertices[face[0]].x, vertices[face[0]].y);
        context.lineTo(vertices[face[1]].x, vertices[face[1]].y);
        context.lineTo(vertices[face[2]].x, vertices[face[2]].y);
        context.lineTo(vertices[face[3]].x, vertices[face[3]].y);
        context.closePath();
        context.stroke();


    }

}

loop();

window.addEventListener("keydown", press);
function press(e){

  if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */ || e.keyCode === 90 /* z */){
    pointer.y = -30;
  }
  if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */){
    pointer.x = 30;
  }
  if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */){
    pointer.y = 30;
  }
  if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */ || e.keyCode === 81 /* q */){
    pointer.x = -30;
  }
}


