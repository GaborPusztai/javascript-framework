// global variable, dependencyMap object
const depsMap = new Map()
let currentEffect = null
effectsStack = []

// the (fn) variable represents the function() {fetchWeather(state.selectedCity);} function from the 'weather.js'
// and we are creating a function called effect which will be the effect function that is then going to be saved inside of our dependencies map
function createEffect(fn) {
    const effect = function effect(...args) {
        if (effectsStack.indexOf(effect) === -1) {
            try {
                currentEffect = effect
                effectsStack.push(effect)
                fn(...args)
            } finally {
                effectsStack.pop()
                currentEffect = effectsStack[effectsStack.length - 1]
            }
        }
    }
    effect()
}

function render(element, content) {
    const app = document.querySelector(element)
    if (app !== null) {
        app.innerHTML = content
    }
}

function reactive(obj) {
    const keys = Object.keys(obj)
    const reactiveObj = {}

    keys.forEach((key) => {
        let value = obj[key]
        Object.defineProperty(reactiveObj, key, {
            get() {
                console.log(`Getting value, ${value}`)
                track(reactiveObj, key)
                return value
            },
            set(newValue) {
                console.log(`Setting value, ${newValue}`)
                if (newValue !== value) {
                    value = newValue
                    trigger(reactiveObj, key)
                }
            }
        })
    })

    return reactiveObj

}

// Tracking if we dont have any dependencies in the map object than add one
function track(target, key) {
    if (currentEffect) {
    let deps = depsMap.get(target)
    if (!deps) {
        deps = new Map()
        depsMap.set(target, deps)
    }
    dep = deps.get(key)
    if (!dep) {
        dep = new Set()
        deps.set(key, dep)
    }
    dep.add(currentEffect)
  }
}

function trigger(target, key) {
    const deps = depsMap.get(target)
    if (!deps) return;
    const dep = deps.get(key)
    if (dep) {
        const effectsToRun = new Set(dep)
        effectsToRun.forEach(effect => {
            effect()
        })
    }
}