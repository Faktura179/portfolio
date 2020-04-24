var http = require("http");
var qs = require("querystring")
var fs = require("fs")

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

var users=[]
var pionki=[
    [0,2,0,2,0,2,0,2],
    [2,0,2,0,2,0,2,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,1,0,1,0,1,0,1],
    [1,0,1,0,1,0,1,0]
]

function servResponse(req,res) {
    var allData = "";

    req.on("data", function (data) {
        allData += data;
    })

    req.on("end", function (data) {
        var finishObj = qs.parse(allData)
        res.writeHead(200, { "content-type": extensions["json"]})
        switch (finishObj.action) {
           //dodanie nowego usera
           case "ADD_USER":
              var obj = addUser(finishObj.user);
              res.end(JSON.stringify(obj))
              break;
           //inna akcja
           case "RESET":
                users=[]
                pionki=[
                    [0,2,0,2,0,2,0,2],
                    [2,0,2,0,2,0,2,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,1,0,1,0,1,0,1],
                    [1,0,1,0,1,0,1,0]
                ]
              break;    
            case "WAIT":
                res.end(JSON.stringify({users:users}))
                break;
            case "COMPARE":
                res.end(JSON.stringify({pionki:pionki}))
                break;
            case "UPDATE":
                var nowe = JSON.parse( finishObj.pionki)
                pionki=nowe
                res.end(JSON.stringify({}))
                break;
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
    switch (req.method) {
        case "GET":
            if(req.url=="/"){
                req.url="/index.html"
            }
            req.url=decodeURI(req.url)
            readFiles(req,res,"static","static")
            break;
        case "POST":

            servResponse(req,res)

            break;

    }

})

server.listen(3030, function () {
    console.log("serwer startuje na porcie 3030")
});

//funkcje

function addUser(user){
    var obj={success:true}
    if(users.length==2){
        obj.success=false
        obj.error="TOO_MANY_USERS"
        return obj
    }
    var exists=false
    users.forEach(el=>{
        if(el==user) exists=true
    })
    if(exists){
        obj.success=false
        obj.error="USER_EXISTS"
    }else{
        users.push(user)
        obj.player=users.length
    }
    return obj
}
