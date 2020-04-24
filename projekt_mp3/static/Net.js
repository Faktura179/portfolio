//console.log("wczytano plik Net.js")



class Net {
    constructor() {
        this.a = 100 // użycie zmiennych
        this.b = 200
        //console.log("konstruktor klasy Net")
        this.albums=[]
        this.init()
    }

    init(){
        $.ajax({
            url: "/first",
            data: {  },
            type: "POST",
            success: function (data) {
                //czytamy odesłane z serwera dane
                var obj = JSON.parse(data)
                net.albums=obj.albums
                ui.albums(obj.albums)
                ui.playlist(obj.songs)
        
            },
            error: function (xhr, status, error) {
                console.log(status,error);
            },
        });
    }

    sendData(album) {
        // tutaj wysłanie danych ajaxem na serwer
        $.ajax({
            url: "/second",
            data: { album:this.albums[album] },
            type: "POST",
            success: function (data) {
                //czytamy odesłane z serwera dane
                var obj = JSON.parse(data)

                ui.playlist(obj.songs)
        
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }
    addToPlaylist(song,album){
        $.ajax({
            url: "/add",
            data: { album:album,song:song },
            type: "POST",
            success: function (data) {
                //czytamy odesłane z serwera dane
                var obj = JSON.parse(data)
        
                
        
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }
    getPlaylist(){
        $.ajax({
            url: "/playlist",
            data: { },
            type: "POST",
            success: function (data) {
                //czytamy odesłane z serwera dane
                var obj = JSON.parse(data)
                
               //console.log(obj)
                ui.playlist(obj)
        
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }
}