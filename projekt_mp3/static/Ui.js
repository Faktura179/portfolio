//console.log("wczytano plik Ui.js")

class Ui {

    constructor() {
        this.clicks()
    }

    //obsługa kliknięć w Ui

    clicks() {

        $("#albums").click(function (e) {
            var children = $(e.currentTarget).children()
            children.each(function(index, element){
                if(element.isSameNode(e.target)){
                    net.sendData(index);
                }
            })
        })
        $("#prev").on("click",function(){
            music.playPrevious()
        })
        $("#next").on("click",function(){
            music.playNext()
        })
        $("#audio").on("timeupdate",function(){
            //console.log($("#audio").prop("currentTime"),$("#audio").prop("duration"))
            var currTime=Math.floor(Math.floor( $("#audio").prop("currentTime"))/60)+":"+(Math.floor( $("#audio").prop("currentTime"))%60)
            var durr=Math.floor(Math.floor($("#audio").prop("duration"))/60)+":"+(Math.floor( $("#audio").prop("duration"))%60)
            var percent = ($("#audio").prop("currentTime")/$("#audio").prop("duration"))*100
            //console.log(percent)
            $("#progress").css("width",percent*2)
            $("#time").text(currTime+"/"+durr)
        })
        $("#playlist").click(function(e){
            net.getPlaylist()
        })
        $(".play_pause").toArray().forEach((el)=>{
            $(el).off("click")
            $(el).on("click",function(e){
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
            })
        })
        $("#visual").click(function(e){
            $("#root").css("display","block")
            visual.render()
        })
        $("#normal").click(function(e){
            $("#root").css("display","none")
            cancelAnimationFrame(visual.animationFrame)
        })
    }

    albums(albums){
        var container = document.getElementById("albums")
        albums.forEach(el => {
            var img = document.createElement("img")
            img.src="/mp3/"+el+"/Cover.jpg"
            img.classList.add("img")
            container.append(img)
        });
    }

    songClick(){
    }

    playlist(items){
        var container = document.getElementById("songs")
        $(container).empty()
        music.songs=[]
        items.forEach((el,index)=>{
            var song = new Song(el.song,el.album,index)
            music.songs.push(song)
            container.append(song.htmlElement)
        })
    }

}
