var myCanvas = document.getElementById("canvas"),
    context = myCanvas.getContext('2d')

function resizeCanvas() {  
    myCanvas.width = window.innerWidth * (82/100)
    myCanvas.height = window.innerHeight * (89/100)
    restoreState()
}
function restoreState() {
    // drawShape()
}
window.addEventListener('resize', resizeCanvas, true)
// window.addEventListener('resize', restoreState, true)

resizeCanvas()
// just an example
function drawShape() {
    c.fillStyle = 'rgb(200, 0, 0)';
    c.fillRect(10, 10, 50, 50);
    
    c.fillStyle = 'rgba(0, 0, 200, 0.5)';
    c.fillRect(30, 30, 50, 50);
    c.fillStyle = 'green'
    c.fillRect(20,20,20,100)
    
    // Just a basic line
    c.beginPath()
    c.moveTo(40, 250)
    c.lineTo(200, 500)
    c.strokeStyle = 'red'
    c.stroke()
    
    // Draw the letter M
    c.beginPath()
    c.moveTo(1500, 700)
    c.lineTo(1600, 450)
    c.lineTo(1700, 700)
    c.lineTo(1800, 450)
    c.lineTo(1900, 700)
    c.strokeStyle = 'blue'
    c.stroke()
    
    // Let's now draw a house
    c.lineWidth = 10
    c.strokeStyle = 'red'
    c.fillStyle = 'red'
    
    // Walls
    c.strokeRect(800, 500, 300, 200)
    
    // Door
    c.fillRect(925, 600, 50, 100)
    
    // Roof
    c.beginPath()
    c.moveTo(700, 500)
    c.lineTo(1200, 500)
    c.lineTo(950, 300)
    c.lineTo(700, 500)
    c.stroke()

    console.log(c)
}