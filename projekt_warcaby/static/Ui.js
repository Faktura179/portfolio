class UI{
    constructor(){
        this.clicks()
        setInterval(this.tablica, 200)
    }

    clicks(){
        $("#loguj").click(function(){
            net.login($("#nick").val())
        })
        $("#reset").click(function(){
            net.reset()
        })
    }
    tablica(){
        $("#tablica").text(JSON.stringify(game.pionki,null,0).replace(/\],/g,"\],\n"));
    }
}