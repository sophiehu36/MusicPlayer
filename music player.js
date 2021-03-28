//选中audio标签
const a = e('#id-audio-player')

//给菜单栏添加事件
const bindEventMenus = () => {
    const menu = e('#id-ul-menu')
    bindEvent(menu, 'click', event => {
        const target = event.target
        if(target.classList.contains('menuButtons')) {
            //根据点击的按钮获取page
            const page = target.dataset.page
            log('pageName', page)
            //拼接生成对应的div
            let divSelector = '#id-'+ page
            log('divName',divSelector)
            //清除所有div的显示class：'containerActive'
            clearAll('.divContainer', 'containerActive')
            //显示对应的div
            e(divSelector).classList.add('containerActive')
            //清除menu按钮上的样式class
            clearAll('.menuButtons', 'active')
            //生成点击menu按钮的id
            let idOfLi = '#id-'+ page.split('-')[0]
            //给点击的menu加上样式class
            e(idOfLi).classList.add('active')
        }
        //点击favorite时添加歌曲列表
        if (target.id == 'id-favorite') {
            //每次显示歌曲列表前，把页面清空
            //避免重复插入同样的列表
            const songList = es('.song')
            for(let i = 0; i < songList.length; i++) {
                songList[i].remove()
            }
            //插入歌曲列表
            insertSongList(songs)
            //点击歌曲列表切换歌曲
            bindSongChange()
        }
    })
}
//切换上一首/下一首歌曲事件
const bindEventPreviousNext = () => {
    bindEvent(e('.playButtonsContainer'), 'click', event => {
        const target = event.target
        const array = songList(songs)
        //获取当前歌曲在歌曲列表中的下标
        const index = indexOfSong(array)
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
                //隐藏播放图标，显示暂停图标
                hidePlayOrPauseButton('#id-audio-play')
            }
        } else {
            //如果不是随机播放，就按照歌曲列表切换歌曲
            if(target.id == "id-previousButton") {
                var nextIndex = (index - 1 + array.length) % array.length
                a.src = `music/${array[nextIndex]}`
                hidePlayOrPauseButton('#id-audio-play')
            }
            if(target.id == "id-nextButton") {
                var nextIndex = (index + 1) % array.length
                a.src = `music/${array[nextIndex]}`
                hidePlayOrPauseButton('#id-audio-play')
            }
        } 
        //log('currentSrc', a.src.slice(-6))
        bindEventCanplay()
        showSongInfo()    
    })
}
//播放暂停按钮事件
const bindEventPlayOrPause = () => {
    bindEvent(e('.playButtonsContainer'), 'click', event => {
        const target = event.target
        const playButton = e('#id-audio-play')
        const pauseButton = e('#id-audio-pause')
        if (target == playButton) {
            hidePlayOrPauseButton('#id-audio-play')
            a.play() 
            //进度条定时器开始
            showProgress()
        }
        if (target == pauseButton) {
            //隐藏暂停图标，显示播放图标
            hidePlayOrPauseButton('#id-audio-pause')
            a.pause()
            //清除进度条定时器
            clearInterval(showProgress)
        }
    })
}
//时间显示
const bindTimeDisplay = () => {
    a.addEventListener('canplaythrough', () => {
        let total = `${Math.floor(a.duration / 60)}:${Math.floor(a.duration % 60)}`
        let audioDuration = e('#id-audio-duration')
        audioDuration.innerHTML = total
        updateCurrentTime()
    })   
} 
//点击歌名列表切换歌曲
const bindSongChange = () => {
    bindAll('.song', 'click', event => {
        //获取点击的歌曲对象
        let target = event.target
        log('songName', target)
        //获取到data-path属性的值，替换歌曲src
        let newSrc = `music/${target.dataset.path}`
        log(target, newSrc)
        a.src = newSrc
        hidePlayOrPauseButton('#id-audio-play')
        bindEventCanplay()
        showSongInfo()
    })
}

//在歌曲缓存完毕后开始播放
const bindEventCanplay = () => {
    a.addEventListener('canplay', () => {
        a.play()
    })
}

//点击按钮切换循环模式
const bindEventLoopImage = () => {
    //选中循环按钮
    const loopButton = e('#id-loopButton')
    //绑定点击事件
    bindEvent(loopButton, 'click', event => {
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
const bindEventLoopAction = () => {
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
const bindEventLoopRandom = () => {
    bindEvent(a, 'ended',  () => {
        //歌曲播放完毕后，随机替换src
        a.src = `music/${choice(songList())}`
        bindEventCanplay()
        //显示对应的歌曲信息
        showSongInfo()
    })
}
//列表循环
const bindEventLoopList = () => {
    bindEvent(a, 'ended', () => {
        //获取歌曲列表
        let array = songList()
        //计算当前歌曲对应的下标
        let index = indexOfSong(array)
        //计算下一首歌曲对应的下标
        let nextIndex = (index + 1) % array.length
        log(nextIndex)
        //变更歌曲src
        a.src = `music/${array[nextIndex]}`
        bindEventCanplay()
        //显示歌曲信息
        showSongInfo()
    })
}
//单曲循环
const bindEventLoopSingle = () => {
    //歌曲播放完以后，把currentTime设置为0，从头开始播放
    bindEvent(a, 'ended', () => {
        a.currentTime = 0
        a.play()
    })
}
//隐藏播放或暂停图标
const hidePlayOrPauseButton = selector => {
    //去掉暂停播放上的hide样式
    clearAll('.playOrPause', 'hide')
    //给播放键对应图片添加hide,显示暂停的图片
    // const playButton = e('#id-audio-play')
    // const pauseButton = e('#id-audio-pause')
    e(selector).classList.add('hide')
}
//获取当前播放进度
const updateCurrentTime = () => {
    let currentTime = `${Math.floor(a.currentTime / 60)}:${Math.floor(a.currentTime % 60)}`
    let audioCurrentTime = e('#id-audio-currentTime')
    audioCurrentTime.innerHTML = currentTime
}
//每秒刷新播放时间
const showAudioTime = () => {
    setInterval(updateCurrentTime, 1000);
}
//获取歌曲列表
const songList = () => {
    const array = []
    for(let i = 0; i < songs.length; i++) {
        let s = songs[i].path
        array.push(s)
    }
    log(array)
    return array
}
//获取当前歌曲对应下标
const indexOfSong = array => {
    let element = a.getAttribute('src').split('/')[1]
    let index = indexOfElement(element, array)
    return index
}
//获取随机选择的歌曲
const choice = songList => {
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
    songName: 'ナツノハナ',
    singer: "juju",
    path: '01.mp3'
    //待插入歌曲图片
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
const insertSongList = dataList => {
    //选中歌曲列表的div
    const songList = e('#id-songList')
    //把歌曲信息用模板插入到div里面
    for(let i = 0; i < dataList.length; i++) {
        let t = songListTemplate(dataList[i])
        appendHtml(songList, t)
    }
}
//歌曲列表的模板，参数是一个object
const songListTemplate = data => {
    let t = `
    <li class="song" data-path=${data.path} data-singer=${data.singer}>${data.songName}</li>
    `
    return t
}
//3.获取当前歌曲的信息显示到页面中
const showSongInfo = () => {
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

//进度条宽度随歌曲播放时间变化
const progressingBar = () => {
    //通过当前歌曲播放时长除以总时长得到播放比例，乘以100，取到一位小数点
    const progress = `${((a.currentTime/a.duration)*100)}`.slice(0,4)
    //选中变化的进度条
    const bar = e('#id-audio-progressingBar')
    const w = progress + '%'
    //把进度条的宽度设置为当前的百分比
    bar.style.width = w
}

const showProgress = () => {
    //设置定时，每100毫秒更新一次进度条宽度
    setInterval(progressingBar, 100)
}

const _main = () => {
    bindTimeDisplay()
    showAudioTime()
    bindEventPreviousNext()
    bindEventPlayOrPause ()
    bindEventMenus()
    bindEventLoopImage()
    bindEventLoopAction()
    
}

_main()
