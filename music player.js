const a = e('#id-audio-player')

//给菜单栏添加事件
const bindEventMenus = function() {
    var menu = e('#id-ul-menu')
    bindEvent(menu, 'click', function(event) {
        var target = event.target
        if(target.classList.contains('menuButtons')) {
            //根据点击的按钮获取page
            var page = target.dataset.page
            log('pageName', page)
            //拼接生成对应的div
            var divSelector = '#id-'+ page
            log('divName',divSelector)
            //清除所有div的显示class：'containerActive'
            clearAll('.divContainer', 'containerActive')
            //显示对应的div
            e(divSelector).classList.add('containerActive')
            //清除menu按钮上的样式class
            clearAll('.menuButtons', 'active')
            //生成点击menu按钮的id
            var idOfLi = '#id-'+ page.split('-')[0]
            //给点击的menu加上class
            e(idOfLi).classList.add('active')
        }
        //点击favorite时添加歌曲列表
        if (target.id == 'id-favorite') {
            var songList = es('.song')
            for(var i = 0; i < songList.length; i++) {
                songList[i].remove()
            }
            insertSongList(songs)
            //点击歌曲列表切换歌曲
            bindSongChange()
        }
    })
}
//切换上一首/下一首歌曲事件
const bindEventPreviousNext = function() {
    bindEvent(e('.playButtonsContainer'), 'click', function(event) {
        var target = event.target
        var array = songList(songs)
        //获取当前歌曲在歌曲列表中的下标
        var index = indexOfSong(array)
        //根据点击的按钮是上一首/下一首来求出接下来播放的歌曲的下标
        //将播放器src替换为新的下标对应曲名
        //点击上一首/下一首都会触发播放按钮
        //要排除掉随机循环的情况
        const loopButton = e('#id-loopButton')
        const src = loopButton.getAttribute('src').split('/')[1]
        if(src == 'iconfinder_mix.png') {
            //随机播放时，无论点击前/后按钮，都会随机选歌
            if(target.id == "id-nextButton" || target.id == "id-previousButton" ) {
                a.src = `music/${choice(songList())}`
                clearAll('.playOrPause', 'hide')
                e('#id-audio-play').classList.add('hide')
            }
        } else {
            if(target.id == "id-previousButton") {
                var nextIndex = (index - 1 + array.length) % array.length
                a.src = `music/${array[nextIndex]}`
                clearAll('.playOrPause', 'hide')
                e('#id-audio-play').classList.add('hide')
            }
            if(target.id == "id-nextButton") {
                var nextIndex = (index + 1) % array.length
                a.src = `music/${array[nextIndex]}`
                clearAll('.playOrPause', 'hide')
                e('#id-audio-play').classList.add('hide')
            }
        } 
        log('currentSrc', a.src.slice(-6))
        bindEventCanplay()
        showSongInfo()    
    })
}
//播放暂停按钮事件
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
//时间显示
const bindTimeDisplay = function() {
    a.addEventListener('canplaythrough', function(){
        let total = `${Math.floor(a.duration / 60)}:${Math.floor(a.duration % 60)}`
        let audioDuration = e('#id-audio-duration')
        audioDuration.innerHTML = total
        updateCurrentTime()
    })   
} 
//点击歌名列表切换歌曲
const bindSongChange = function() {
    bindAll('.song', 'click', function(event) {
        let target = event.target
        log('songName', target)
        let newSrc = `music/${target.dataset.path}`
        log(target, newSrc)
        a.src = newSrc
        let playButton = e('#id-audio-play')
        clearAll('.playOrPause', 'hide')
        playButton.classList.add('hide')
        bindEventCanplay()
        showSongInfo()
    })
}

const bindEventCanplay = function() {
    a.addEventListener('canplay', function () {
        a.play()
    })
}

//点击按钮切换循环模式
const bindEventLoopImage = function() {
    //选中循环按钮
    const loopButton = e('#id-loopButton')
    //绑定点击事件
    bindEvent(loopButton, 'click', function(event){
        const target = event.target
        const src = target.getAttribute('src').split('/')[1]
        //判断当前循环图片是什么
        //按照随机、列表循环、单曲循环的顺序切换图片
        if(src == 'iconfinder_mix.png') {
            target.setAttribute('src', 'images/iconfinder_refresh.png')
        } else if(src == 'iconfinder_refresh.png') {
            target.setAttribute('src', 'images/iconfinder_iretation.png')
        } else if('iconfinder_iretation.png') {
            target.setAttribute('src', 'images/iconfinder_mix.png')
        }
    })
}

//单曲循环播放
const bindEventLoopAction = function() {
    const loopButton = e('#id-loopButton')
    const src = loopButton.getAttribute('src').split('/')[1]
    //随机循环
    if(src == 'iconfinder_mix.png') {
        bindEventLoopRandom()
    //列表循环
    } else if (src == 'iconfinder_refresh.png') {
        bindEventLoopList()
    //单曲循环
    } else if (src == 'iconfinder_iretation.png') {
        bindEventLoopSingle()
    }
}
//随机循环
const bindEventLoopRandom = function() {
    bindEvent(a, 'ended', function(){
        a.src = `music/${choice(songList())}`
        bindEventCanplay()
        showSongInfo()
    })
}
//列表循环
const bindEventLoopList = function() {
    bindEvent(a, 'ended', function() {
        let array = songList()
        let index = indexOfSong(array)
        let nextIndex = (index + 1) % array.length
        log(nextIndex)
        a.src = `music/${array[nextIndex]}`
        bindEventCanplay()
        showSongInfo()
    })
}
//单曲循环
const bindEventLoopSingle = function() {
    bindEvent(a, 'ended', function(){
        a.currentTime = 0
        a.play()
    })
}


//获取当前播放进度
const updateCurrentTime = function() {
    let currentTime = `${Math.floor(a.currentTime / 60)}:${Math.floor(a.currentTime % 60)}`
    let audioCurrentTime = e('#id-audio-currentTime')
    audioCurrentTime.innerHTML = currentTime
}
//刷新播放时间
const showAudioTime = function() {
    setInterval(updateCurrentTime, 1000);
}
//获取歌曲列表
const songList = function() {
    var array = []
    for(let i = 0; i < songs.length; i++) {
        let s = songs[i].path
        array.push(s)
    }
    log(array)
    return array
}
//获取当前歌曲对应下标
const indexOfSong = function(array) {
    let element = a.getAttribute('src').split('/')[1]
    let index = indexOfElement(element, array)
    return index
}
//获取随机选择的歌曲
const choice = function(songList) {
    const length = songList.length
    // 1. 得到  0 - 1 之间的小数 a
    // 2. 把 a 转成 0 - array.length 之间的小数
    // 3. 得到 0 - array.length - 1 之间的整数作为下标
    let index = Math.floor(Math.random()*length)
    // 4. 得到 array 中的随机元素
    return songList[index]
}
//显示当前播放歌曲的信息
//1.用一个数组保存当前歌曲的信息
const songs = [
    {
    songName: '夏花',
    singer: "juju",
    path: '01.mp3'
    },
    {
    songName: 'Destiny',
    singer: "岛谷瞳",
    path: '02.mp3'
    },
    {
    songName: 'Love Song',
    singer: "西野加奈",
    path: '03.mp3'
    },
    {
    songName: 'Unknown',
    singer: "佚名",
    path: '04.mp3'
    }
]
//2.把歌曲列表插入到页面中
const insertSongList = function(dataList) {
    var songList = e('#id-songList')
    for(var i = 0; i < dataList.length; i++) {
        var t = songListTemplate(dataList[i])
        appendHtml(songList, t)
    }
}
const songListTemplate = function(data) {
    var t = `
    <li class="song" data-path=${data.path} data-singer=${data.singer}>${data.songName}</li>
    `
    return t
}
//3.获取当前歌曲的信息显示到页面中
const showSongInfo = function() {
    //获取当前播放歌曲的src
    let currentSong = a.getAttribute('src').split('/')[1]
    let name = e('.songName')
    let singerName = e('.singer')
    //遍历歌曲列表，找到当前歌曲对应的数组项
    for(let i = 0; i < songs.length; i++) {
        let s = songs[i]
        let p = s.path
        if(currentSong == p) {
            //替换显示的歌曲信息
            name.innerHTML = s.songName
            singerName.innerHTML = s.singer
        }
    }
    //let songName = songs[index].songName
    //let singer = songs[index].singer
    //log('songName', songName, 'singer', singer)
}

const _main = function() {
    bindTimeDisplay()
    showAudioTime()
    bindEventPreviousNext()
    bindEventPlayOrPause ()
    bindEventMenus()
    bindEventLoopImage()
    bindEventLoopAction()
}

_main()
