import { createMesh } from "/js/mesh.js"

var 
    // c1 = document.getElementById('input-file'),
    c2 = document.getElementById('save-mesh'),
    c3 = document.getElementById('message'),
    c4 = document.getElementById('bottom-nav-bar'),
    c5 = document.getElementById('close'),
    // c6 = document.getElementById('load-file'),
    // c7 = document.getElementById('file-name'),
    c11 = document.getElementById('bnb-zoom'),
    c12 = document.getElementById('bnb-rotate'),
    c13 = document.getElementById('bnb-move'),
    c14 = document.getElementById('bnb-add'),
    c15 = document.getElementById('bnb-edit'),
    c16 = document.getElementById('bnb-delete'),
    file = null,
    currentStateElement = null

var showBNB = function(e) {
    switch(e.id) {
        case 'add-polygon':
            c14.style.display = 'inline-flex'
            break
        case 'edit-polygon':
            c15.style.display = 'inline-flex'
            break
        case 'delete-polygon':
            c16.style.display = 'inline-flex'
            break
        case 'zoom-canvas':
            c11.style.display = 'inline-flex'
            break
        case 'rotate-canvas':
            c12.style.display = 'inline-flex'
            break
        case 'move-canvas':
            c13.style.display = 'inline-flex'
            break
    }
    c4.classList.add('animate-slide-in')
    c4.style.display = 'flex'
}

var hideBNB = function(){
    c4.classList.replace('animate-slide-in', 'animate-slide-out')
    currentStateElement.parentElement.classList.remove('active')
    setTimeout(() => {
        c4.style.display = 'none'
        c4.classList.remove('animate-slide-out')

        switch(currentStateElement.id) {
            case 'add-polygon':
                c14.style.display = 'none'
                break
            case 'edit-polygon':
                c15.style.display = 'none'
                break
            case 'delete-polygon':
                c16.style.display = 'none'
                break
            case 'zoom-canvas':
                c11.style.display = 'none'
                break
            case 'rotate-canvas':
                c12.style.display = 'none'
                break
            case 'move-canvas':
                c13.style.display = 'none'
                break
        }
        currentStateElement = null
        c3.innerHTML = document.title
    }, 100)
}

document.getElementsByName('states').forEach(el => {
    el.addEventListener('click', () => {
        if(el.checked) {
            // to handle user press multiple button without exiting states.
            if(currentStateElement != null) {
                currentStateElement.parentElement.classList.remove('active')
                switch(currentStateElement.id) {
                    case 'add-polygon':
                        c14.style.display = 'none'
                        break
                    case 'edit-polygon':
                        c15.style.display = 'none'
                        break
                    case 'delete-polygon':
                        c16.style.display = 'none'
                        break
                    case 'zoom-canvas':
                        c11.style.display = 'none'
                        break
                    case 'rotate-canvas':
                        c12.style.display = 'none'
                        break
                    case 'move-canvas':
                        c13.style.display = 'none'
                        break
                }
                currentStateElement.checked = false
                currentStateElement = null
            }
            console.log('clicked :'+el.id)
            el.parentElement.classList.add('active')
            c3.innerHTML = el.id
            currentStateElement = el
            showBNB(currentStateElement)
        }
    })
})

document.getElementsByName('bfc-states').forEach(el => {
    el.addEventListener('change', () => {
        var changeMessage = function(tmp, msg) {
            c3.innerHTML = 'BFC ' + msg
            setTimeout(handler => {
                c3.innerHTML = tmp
            }, 2000)
        }
        if(el.checked) {
            console.log(el.parentElement)
            console.log('BFC is enabled')
            el.parentElement.getElementsByTagName('span')[0].innerHTML = 'Enabled'
            changeMessage(c3.innerText, 'enabled')
        }else {
            console.log('BFC is disabled')
            el.parentElement.getElementsByTagName('span')[0].innerHTML = 'Disabled'
            changeMessage(c3.innerText, 'disabled')
        }
    })
})

// c1.addEventListener('change', function(){
//     // console.log(this)
//     if(this.files.length > 0){
//         file = this.files
//         var tmp = ""
//         for(i=0; i < this.files.length; i++){
//             tmp += this.files[i].name
//             if(i == this.files.length-1) {
//                 continue
//             }
//             tmp += '; '
//         }
//         c7.innerHTML = tmp
//         c6.disabled = true
//     }else {
//         c6.disabled = false
//     }
// })

// c6.addEventListener('click', function(){
//     console.log(file)
//     if(file)
//     var reader = new FileReader()
//     reader.addEventListener('load', function(){
//         var result = JSON.parse(reader.result)
//         var model = createMesh(resut.obj)
//         model.color = 'red'
//         screen.push(model)
//         render(scene, camera)
//     })
// })


let cz = document.getElementsByClassName('bnb-item')
for(i=0; i < cz.length; i++){
    console.log(cz[i])
    if(cz[i].id == "") continue
    cz[i].style.display = 'none'
}
c5.addEventListener('click', hideBNB)