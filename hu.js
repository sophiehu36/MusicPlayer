var log = function() {
    console.log.apply(console, arguments)
}

var e = function(selector) {
    return document.querySelector(selector)
}

var es = function(selector) {
    return document.querySelectorAll(selector)
}

var appendHtml = function(element, html) {
	element.insertAdjacentHTML('beforeend', html)
}

var bindEvent = function(element, eventName, callback) {
    element.addEventListener(eventName, callback)
}

var toggleClass = function(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
}

const clearAll = function(selector, className) {
    let elements = es(selector)
    for(let i = 0; i < elements.length; i++) {
        if(elements[i].classList.contains(className)){
            elements[i].classList.remove(className)
        }
    }
}
var removeClassAll = function(className) {
    var selector = '.' + className
    var elements = document.querySelectorAll(selector)
    for (var i = 0; i < elements.length; i++) {
        var e = elements[i]
        e.classList.remove(className)
    }
}

var bindAll = function(selector, eventName, callback) {
    var elements = document.querySelectorAll(selector)
    for(var i = 0; i < elements.length; i++) {
        var e = elements[i]
        bindEvent(e, eventName, callback)
    }
}

// find 函数可以查找 element 的所有子元素
var find = function(element, selector) {
    return element.querySelector(selector)
}

var indexOfElement = function(target, elements) {
    for(var i = 0; i < elements.length; i++) {
        if(target == elements[i]) {
            return i
        }
    }
}

var addClass = function(index, selector, className) {
    var elements = es(selector)
    var e = elements[index]
    removeClassAll(className)
    e.classList.add(className)
}