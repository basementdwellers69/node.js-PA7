var myCanvas = document.getElementById("canvas"),
    context = myCanvas.getContext('2d')
    width = myCanvas.width,
    height = myCanvas.height

trackTransforms(context)

var resizeCanvas = function() {  
    myCanvas.width = window.innerWidth * (82/100)
    myCanvas.height = window.innerHeight * (89/100)
    restoreState()
}
var restoreState = function() {
    // drawShape()
    width = myCanvas.width,
    height = myCanvas.height
}
window.addEventListener('resize', resizeCanvas, true)
// window.addEventListener('resize', restoreState, true)

resizeCanvas()

var lastX = myCanvas.width/2,
    lastY = myCanvas.height/2,
    dragStart, dragged;
 
var onMouseDownCanvas = function(e) {
    document.body.style.mozUserSelect = document.body.style.userSelect = 'none'
    lastX = e.offsetX || (e.pageX - myCanvas.offsetLeft)
    lastY = e.offsetY || (e.pageY - myCanvas.offsetTop)
    dragStart = context.transformedPoint(lastX, lastY)
    dragged = false
}
var onMouseMoveCanvas = function(e) {
    lastX = e.offsetX || (e.pageX - myCanvas.offsetLeft)
    lastY = e.offsetY || (e.pageY - myCanvas.offsetTop)
    dragged = true
    if(dragStart) {
        myCanvas.classList.add('cursor--grab')
        // myCanvas.style.cursor = 'grabbing'
        var pt = context.transformedPoint(lastX, lastY)
        context.translate(pt.x-dragStart.x, pt.y-dragStart.y)
    }
}
var onMouseUpCanvas = function(e) {
    document.body.style.mozUserSelect = document.body.style.userSelect = 'auto'
    myCanvas.classList.remove('cursor--grab')
    dragStart = null
    if(!dragged) zoom(e.shiftKey ? -1:1)
}
var onMouseWheelCanvas = function(e) {
    var delta = e.wheelDelta ? e.wheelDelta/40 : e.detail ? -e.detail : 0
    if (delta) zoom(delta)
    return e.preventDefault() && false
}

myCanvas.addEventListener('mousedown', onMouseDownCanvas)
myCanvas.addEventListener('mousemove', onMouseMoveCanvas)
myCanvas.addEventListener('mouseup', onMouseUpCanvas)
myCanvas.addEventListener('DOMMouseScroll', onMouseWheelCanvas)
myCanvas.addEventListener('mousewheel', onMouseWheelCanvas)

var scaleFactor = 1.1
var zoom = function(clicks) {
    var pt = context.transformedPoint(lastX, lastY)
    context.translate(pt.x, pt.y)
    var factor = Math.pow(scaleFactor, clicks)
    context.scale(factor, factor)
    context.translate(-pt.x, -pt.y)
}

function trackTransforms(context){
    var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
    var xform = svg.createSVGMatrix();
    context.getTransform = function(){ return xform; };
    
    var savedTransforms = [];
    var save = context.save;
    context.save = function(){
        savedTransforms.push(xform.translate(0,0));
        return save.call(context);
    };
    var restore = context.restore;
    context.restore = function(){
        xform = savedTransforms.pop();
        return restore.call(context);
    };

    var scale = context.scale;
    context.scale = function(sx,sy){
        xform = xform.scaleNonUniform(sx,sy);
        return scale.call(context,sx,sy);
    };
    var rotate = context.rotate;
    context.rotate = function(radians){
        xform = xform.rotate(radians*180/Math.PI);
        return rotate.call(context,radians);
    };
    var translate = context.translate;
    context.translate = function(dx,dy){
        xform = xform.translate(dx,dy);
        return translate.call(context,dx,dy);
    };
    var transform = context.transform;
    context.transform = function(a,b,c,d,e,f){
        var m2 = svg.createSVGMatrix();
        m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
        xform = xform.multiply(m2);
        return transform.call(context,a,b,c,d,e,f);
    };
    var setTransform = context.setTransform;
    context.setTransform = function(a,b,c,d,e,f){
        xform.a = a;
        xform.b = b;
        xform.c = c;
        xform.d = d;
        xform.e = e;
        xform.f = f;
        return setTransform.call(context,a,b,c,d,e,f);
    };

    var pt  = svg.createSVGPoint();
    context.transformedPoint = function(x,y){
        pt.x=x; pt.y=y;
        return pt.matrixTransform(xform.inverse());
    }
}