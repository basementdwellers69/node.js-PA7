function loadScript(script_source) {
    for(i=0; i< script_source.length; i++){
        script = document.createElement('script')
        script.src = script_source[i]
        script.setAttribute('type', 'text/javascript')
        document.body.appendChild(script)
    }
}
loadScript([
    'js/canvas.js',
    'js/cube.js',
    'js/main.js'
])

content = document.getElementsByClassName('content')
nav_link = document.getElementsByClassName('nav-link')
// console.log(content)
// console.log(content['canvas'])

function setContent(e){
    function a(r){
        current = document.getElementsByClassName('nav-link__active')
        if(current.length != 0)
            current[0].classList.replace('nav-link__active', 'nav-link__inactive')
        r.classList.replace('nav-link__inactive', 'nav-link__active')
    }
    function b(r){
        current = document.getElementsByClassName('content--active')
        if(current.length != 0)
            current[0].classList.replace('content--active', 'content--inactive')
        r.classList.replace('content--inactive', 'content--active')
    }

    // console.log('clicked : '+e.text)
    // current = document.getElementsByClassName('nav-link__active')
    // if(current.length != 0){
    //     current[0].classList.replace('nav-link__active', 'nav-link__inactive')
    // }
    // e.classList.replace('nav-link__inactive', 'nav-link__active')
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

// force click Canvas's nav at first load.
document.getElementsByClassName('nav-link__inactive')[0].click()