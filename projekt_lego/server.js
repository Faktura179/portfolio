var express = require("express")
var app = express();
var http = require('http').createServer(app);
var socketio = require('socket.io')(http);

app.use(express.static("static"))

var actions = []
var id=0

socketio.on('connection', function (client) {
    console.log("klient się podłączył " + client.id)
    // client.id - unikalna nazwa klienta generowana przez socket.io
    actions.forEach(el=>{
        socketio.to(client.id).emit(el.action,el.data)
    })
    
    client.on("disconnect", function () {
        console.log("klient się rozłącza")
    })

    client.on("create",function (data){
        client.broadcast.emit("create",{position:data.position, id:id})
        actions.push({action:"create",data:{position:data.position, id:id}})
        socketio.to(client.id).emit("name",{id:id})
        id++
    })

    client.on("edit",function(data){
        client.broadcast.emit("edit",{edit:data.edit,id:data.id})
        actions.push({action:"edit",data:{edit:data.edit,id:data.id}})
    })
});

http.listen(3010, function () {
    console.log('listening on 3000');
});

