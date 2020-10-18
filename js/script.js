function loadScript(script_source) {
    for(i=0; i< script_source.length; i++){
        script = document.createElement('script')
        script.src = script_source[i].source
        script.setAttribute('type', script_source[i].type)
        document.body.appendChild(script)
    }
}
loadScript([
    // {'source' : 'js/states.js', 'type' : 'text/javascript'},
    {'source' : 'js/canvas.js', 'type' : 'text/javascript'},
    {'source' : 'js/main.js', 'type' : 'module'},
    {'source' : 'js/controller.js', 'type' : 'module'}
])

content = document.getElementsByClassName('content')
nav_link = document.getElementsByClassName('nav-link')

var setContent = function(e) {
    function a(r){
        current = document.getElementsByClassName('nav-link__active')
        if(current.length != 0)
            current[0].classList.replace('nav-link__active', 'nav-link__inactive')
        r.classList.replace('nav-link__inactive', 'nav-link__active')
    }
    function b(z){
        current = document.getElementsByClassName('content--active')
        if(current.length != 0)
            current[0].classList.replace('content--active', 'content--inactive')
        z.classList.replace('content--inactive', 'content--active')
    }
    a(e)
    switch(e.text){
        case 'Canvas': 
            b(content['canvas'])
            break
        case 'Tutorial':
            b(content['tutorial'])
            break
        case 'About':
            b(content['about'])
            break
    }
}
document.querySelectorAll('.nav-link').forEach(e => {
    e.classList.add('nav-link__inactive')
    e.addEventListener('click', () => setContent(e), false)
})

document.getElementsByClassName('nav-link')[0].click()