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
            c3.innerHTML = 'BFC ' + msg;
            setTimeout(handler => {
                c3.innerHTML = document.title;
            }, 1500)
        }
        if(el.checked) {
            el.parentElement.childNodes[1].value = "1";        
            console.log('BFC is enabled');
            el.parentElement.getElementsByTagName('span')[0].innerHTML = 'Enabled';
            changeMessage(c3.innerText, 'enabled');
        }else {
            el.parentElement.childNodes[1].value = "0";
            console.log('BFC is disabled');
            el.parentElement.getElementsByTagName('span')[0].innerHTML = 'Disabled';
            changeMessage(c3.innerText, 'disabled');
        }
    })
})

let cz = document.getElementsByClassName('bnb-item')
for(i=0; i < cz.length; i++){
    // console.log(cz[i])
    if(cz[i].id == "") continue
    cz[i].style.display = 'none'
}
c5.addEventListener('click', hideBNB)
