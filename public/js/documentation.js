const divClasses = element('classes')
const divEvents = element('events')
const divPreview = element('preview')

const classes = {}

// classes
// seems counter-productive to do all this...
addClass('Player', [{
    'SetHealth': {
        params: [{
            name: 'health',
            type: 'float'
        }]
    }
}])

// events
addEvent('OnGameInit')
addEvent('OnGameUpdate')



function addClass(name, methods)
{
    classes['Player'] = 'Player'

    const element = createLink(name);
    element.addEventListener('click', () => {
        setPreviewClass(classes[name])
    })
    divClasses.appendChild(element)
}

function addEvent(name)
{
    divEvents.appendChild(createLink(name))
}

function setPreviewClass(name)
{
    divPreview.innerHTML = ''
    divPreview.appendChild(createText(classes[name]))
}

// Utility functions
function createLink(text)
{
    const div = document.createElement('div')
    div.id = 'link'
    div.appendChild(createText(text))

    return div
}

function createText(text)
{
    const p = document.createElement('p')
    p.appendChild(document.createTextNode(text))
    return p
}

function element(id)
{
    return document.getElementById(id)
}