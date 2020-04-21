class Song{
    constructor(name, album, i, size=0){
        this.name=name
        this.i=i
        this.album=album
        this.size=size
        this.htmlElement
        this.createElement()
        this.htmlElement.onmouseover=this.mouseOver.bind(this)
        this.htmlElement.onmouseout=this.mouseOut.bind(this)
        this.htmlElement.onclick=this.click.bind(this)
    } 
    createElement(){
        var div = document.createElement("div")
        div.classList.add("song")
        var alb = document.createElement("div")
        var title = document.createElement("div")
        var weight = document.createElement("div")
        var buttons = document.createElement("div")
        var controls = document.createElement("div")
        var playlist = document.createElement("div")
        alb.innerText=this.album
        alb.classList.add("inner_song")
        title.innerText=this.name
        title.classList.add("inner_song")
        weight.innerText=" MB"
        weight.classList.add("inner_song")
        controls.classList.add("inner_song")
        controls.style.backgroundImage="url(/obrazki/pause.png)"
        controls.style.width="50px"
        controls.style.height="50px"
        controls.classList.add("play_pause")
        controls.onclick=this.play
        playlist.classList.add("add_to_playlist")
        playlist.onclick=this.addToPlaylist.bind(this)
        buttons.classList.add("btns")
        buttons.append(controls)
        buttons.append(playlist)
        div.append(alb)
        div.append(title)
        div.append(weight)
        div.append(buttons)
        this.htmlElement=div
    }
    click(){
        $("#audio_src")[0].src="/mp3/"+this.htmlElement.childNodes[0].innerText+"/"+this.htmlElement.childNodes[1].innerText
        music.load()
        music.audioContext.resume()
        music.song.style.backgroundColor="white"
        if(music.song.childNodes.length>3)
            music.song.childNodes[3].style.display="none"
        music.song=this.htmlElement
        music.currentSong=this.i
        //console.log(music.currentSong, music.songs.length)
        $("#info").text(this.htmlElement.childNodes[0].innerText+"/ "+this.htmlElement.childNodes[1].innerText);
        this.htmlElement.style.backgroundColor="blue"
        this.htmlElement.childNodes[3].style.display="inline-flex"
        $(".play_pause").toArray().forEach((el)=>{
            el.style.backgroundImage="url(/obrazki/pause.png)"
        })
    }
    mouseOver(){
        this.htmlElement.style.backgroundColor="blue"
    }
    mouseOut(){
        if(!music.song.isSameNode(this.htmlElement))
                this.htmlElement.style.backgroundColor="white"
    }
    addToPlaylist(){
        console.log(this.name,this.album)
        net.addToPlaylist(this.name,this.album)
    }
    play(e){
        e.stopPropagation()
        //console.log(music.isPlaying)
        if(music.isPlaying){
            music.pause()
            $(".play_pause").toArray().forEach((el)=>{
                el.style.backgroundImage="url(/obrazki/play.png)"
            })
            
        }else{
            music.play()
            $(".play_pause").toArray().forEach((el)=>{
                el.style.backgroundImage="url(/obrazki/pause.png)"
            })
        }
    }
}