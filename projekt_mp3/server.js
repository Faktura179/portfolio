var http = require("http");
var qs = require("querystring")
var fs = require("fs")

// var static = []
// fs.readdir(__dirname+"/static",function(err,files){
//     if(err){
//         return console.log(err)
//     }
//     files.forEach(element => {
//         static.push(element)
//     });
//     //console.log(static)
// })
var albums=[]
var playlist=[]
fs.readdir(__dirname+"/static/mp3",function(err,files){
    if(err){
        return console.log(err)
    }
    files.forEach(element => {
        albums.push(element)
    });
    //console.log(albums)
})
var extensions={
    html:"text/html",
    json:"application/json",
    css:"text/css",
    js:"application/javascript",
    jpg:"image/jpg",
    mp3:"audio/mpeg",
    txt:"text/plain",
    png:"image/png",
}

function servResponse(req,res) {
    var allData = "";

    //kiedy przychodzą dane POSTEM, w postaci pakietów,
    //łącza się po kolei do jednej zmiennej "allData"
    // w poniższej funkcji nic nie modyfikujemy

    req.on("data", function (data) {
       // console.log("data: " + data)
        allData += data;
    })

    //kiedy przyjdą już wszystkie dane
    //parsujemy je do obiektu "finish"
    //i odsyłamy do przeglądarki

    req.on("end", function (data) {
        var finish = qs.parse(allData)
        if(req.url=="/first"){
            finish.songs=[]
            finish.albums=albums
            finish.album=albums[0]
            fs.readdir(__dirname+"/static/mp3/"+albums[0],function(err,files){
                if(err){
                    return res.end()
                }
                files.forEach(el=>{
                    if(el.split(".")[el.split(".").length-1]=="mp3")
                    finish.songs.push({song:el,album:albums[0]})
                })
                res.writeHead(200, { "content-type": extensions["txt"] })
                res.end(JSON.stringify(finish))
                //console.log(finish)
            })
        }else if(req.url=="/second"){
            finish.songs=[]
            fs.readdir(__dirname+"/static/mp3/"+finish.album,function(err,files){
                if(err){
                    return res.end()
                }
                files.forEach(el=>{
                    if(el.split(".")[el.split(".").length-1]=="mp3")
                    finish.songs.push({song:el,album:finish.album})
                })
                res.writeHead(200, { "content-type": extensions["txt"] })
                res.end(JSON.stringify(finish))
                //console.log(finish)
            })
        }else if(req.url=="/add"){
            var item ={}
            item.album = finish.album
            item.song = finish.song
            playlist.push(item)
            console.log(item)
            res.writeHead(200, { "content-type": extensions["txt"] })
            res.end("{}")
        }else if(req.url=="/playlist"){
            res.writeHead(200, { "content-type": extensions["txt"] })
            res.end(JSON.stringify(playlist))
        }
    })
}

function readFiles(req,res,dir,remove=""){
    fs.readdir(__dirname+"/"+dir,function(err,files){
        if(err){
            return res.end()
        }
        files.forEach((file)=>{
            fs.stat(__dirname+"/"+dir+"/"+file,function(err,f){
                if(err){
                    return res.end()
                }
                if(f.isDirectory()){
                    readFiles(req,res,dir+"/"+file,remove)
                }else{
                    fs.readFile(__dirname+"/"+dir+"/"+file,function(err,data){
                        if(err){
                            return res.end()
                        }
                        var ext = file.split(".")[file.split(".").length-1]
                        if(req.url==(dir+"/"+file).replace(remove,"")){
                            res.writeHead(200, { "content-type": extensions[ext] })
                            res.write(data)
                            res.end()
                        }
                    })
                }
            })
        })
    })
}

var server = http.createServer(function (req, res) {
    // parametr res oznacza obiekt odpowiedzi serwera (response)
    // parametr req oznacza obiekt żądania klienta (request)
    switch (req.method) {
        case "GET":
            // tu wykonaj załadowanie statycznej strony z formularzem
            var sent=false
            if(req.url=="/"){
                req.url="/index.html"
            }
            req.url=decodeURI(req.url)
            readFiles(req,res,"static","static")
            break;
        case "POST":
            // wywołanie funkcji "servResponse", która pobierze dane przesłane 
            // w formularzu i odpowie do przeglądarki 
            // (uwaga - adres żądania się nie zmienia)

            servResponse(req,res)

            break;

    }

})

server.listen(3020, function () {
    console.log("serwer startuje na porcie 3020")
});