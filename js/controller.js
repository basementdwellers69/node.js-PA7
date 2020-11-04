import { 
    setMeshColor, 
    inputMeshFile, 
    loadMeshFile, 
    selectMesh, 
    saveMeshObj, 
    deleteMesh, 
    resizeCanvas,
    onKeyDownListener,
    setBFC,
    enterPolygon
} from "./main.js"

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
        case 'zoom-mesh':
            c11.style.display = 'inline-flex'
            break
        case 'rotate-mesh':
            c12.style.display = 'inline-flex'
            break
        case 'move-mesh':
            c13.style.display = 'inline-flex'
            break
        case 'change-color-mesh':
            c19.style.display = 'inline-flex'
            // force to get the mesh color
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
            case 'zoom-mesh':
                c11.style.display = 'none'
                break
            case 'rotate-mesh':
                c12.style.display = 'none'
                break
            case 'move-mesh':
                c13.style.display = 'none'
                break
            case 'change-color-mesh':
                c19.style.display = 'none'
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
                    case 'zoom-mesh':
                        c11.style.display = 'none'
                        break
                    case 'rotate-mesh':
                        c12.style.display = 'none'
                        break
                    case 'move-mesh':
                        c13.style.display = 'none'
                        break
                    case 'change-color-mesh':
                        c19.style.display = 'none'
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
c17.addEventListener('change', setBFC)

let cz = document.getElementsByClassName('bnb-item')
for(i=0; i < cz.length; i++){
    // console.log(cz[i])
    if(cz[i].id == "") continue
    cz[i].style.display = 'none'
}
c5.addEventListener('click', hideBNB)

c1.addEventListener('change', inputMeshFile)
c2.addEventListener('click', saveMeshObj)
c6.addEventListener('click', loadMeshFile)
c8.addEventListener('click', selectMesh)
c10.addEventListener("click", deleteMesh)
c20.addEventListener('input', setMeshColor)
c24.addEventListener('click', enterPolygon)
window.addEventListener('resize', resizeCanvas)
window.addEventListener('keydown', onKeyDownListener)

setMeshColor()