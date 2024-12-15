
let state = reactive({message: 'Hello universe'});

// let message = 'Hello Developer'

function renderApp() {
    render('#container', `<h1>${state.message}</h1>`) 
}

renderApp()

setTimeout(() => {
    state.message = 'Hello Deveoper'
}, 1000);