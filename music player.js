const a = e('#id-audio-player')

const bindEventPreviousNext = function() {
    bindEvent(e('.playButtonsContainer'), 'click', function(event) {
        var target = event.target
        var array = songList()
        var index = indexOfSong(array)
        if(target.id == "id-previousButton") {
            var nextIndex = (index - 1 + array.length) % array.length
            a.src = `music player/music/${array[nextIndex]}`
            clearAll('.playOrPause', 'hide')
            e('#id-audio-play').classList.add('hide')
        }
        if(target.id == "id-nextButton") {
            var nextIndex = (index + 1) % array.length
            a.src = `music player/music/${array[nextIndex]}`
            clearAll('.playOrPause', 'hide')
            e('#id-audio-play').classList.add('hide')
        }
        bindEventCanplay()

    })
}

const bindEventPlayOrPause = function() {
    bindEvent(e('.playButtonsContainer'), 'click', function(event){
        var target = event.target
        var playButton = e('#id-audio-play')
        var pauseButton = e('#id-audio-pause')
        if (target == playButton) {
            clearAll('.playOrPause', 'hide')
            playButton.classList.add('hide')
            a.play() 
        }
        if (target == pauseButton) {
            clearAll('.playOrPause', 'hide')
            pauseButton.classList.add('hide')
            a.pause()
        }
    })
}

const bindTimeDisplay = function() {
    a.addEventListener('canplaythrough', function(){
        let total = `${Math.floor(a.duration / 60)}:${Math.floor(a.duration % 60)}`
        let audioDuration = e('#id-audio-duration')
        audioDuration.innerHTML = total
        updateCurrentTime()
    })   
} 

const bindSongChange = function() {
    bindAll('.song', 'click', function(event) {
        let target = event.target
        let newSrc = `music player/music/${target.dataset.path}`
        a.src = newSrc
        let playButton = e('#id-audio-play')
        clearAll('.playOrPause', 'hide')
        playButton.classList.add('hide')
        bindEventCanplay()
    })
}

const bindEventCanplay = function() {
    a.addEventListener('canplay', function () {
        a.play()
    })
}

const bindEventCycle = function() {
    bindEvent(a, 'ended', function(){
        a.currentTime = 0
        a.play()
    })
}

const bindEventNext = function() {
    bindEvent(a, 'ended', function() {
        let array = songList()
        let index = indexOfSong(array)
        let nextIndex = (index + 1) % array.length
        log(nextIndex)
        a.src = `music player/music/${array[nextIndex]}`
        bindEventCanplay()
    })
}

const bindEventRandom = function() {
    bindEvent(a, 'ended', function(){
        a.src = `music player/music/${choice(songList())}`
        bindEventCanplay()
    })
}

const updateCurrentTime = function() {
    let currentTime = `${Math.floor(a.currentTime / 60)}:${Math.floor(a.currentTime % 60)}`
    let audioCurrentTime = e('#id-audio-currentTime')
    audioCurrentTime.innerHTML = currentTime
}

const showAudioTime = function() {
    setInterval(updateCurrentTime, 1000);
}

const songList = function() {
    var array = []
    let songs = es('.song')
    for(let i = 0; i < songs.length; i++) {
        let s = songs[i]
        let p = s.dataset.path
        array.push(p)
    }
    return array
}

const indexOfSong = function(array) {
    let element = a.getAttribute('src')
    let index = indexOfElement(element, array)
    return index
}

const choice = function(songList) {
    const length = songList.length
    // 1. 得到  0 - 1 之间的小数 a
    // 2. 把 a 转成 0 - array.length 之间的小数
    // 3. 得到 0 - array.length - 1 之间的整数作为下标
    let index = Math.floor(Math.random()*length)
    // 4. 得到 array 中的随机元素
    return songList[index]
}

const _main = function() {
    bindSongChange()
    bindTimeDisplay()
    showAudioTime()
    bindEventNext()
    bindEventPreviousNext()
    bindEventPlayOrPause ()
    
}

_main()
