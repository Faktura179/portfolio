var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
    er404 = fs.readFileSync("static/404.html")

var extensions={
    html:"text/html",
    json:"application/json",
    css:"text/css",
    js:"application/javascript",
    jpg:"image/jpg",
    mp3:"audio/mpeg",
    txt:"text/plain",
    png:"image/png",
    pdf:"application/pdf",
    ico:"image/x-icon",
}

function readFiles(req,res){
    fs.readFile(__dirname+"/static"+req.url,function(err,data){
        if(err){
            res.writeHead(404)
            res.write(er404)
            return res.end()
        }
        var ext = req.url.split(".")[req.url.split(".").length-1]
        res.writeHead(200, { "content-type": extensions[ext] })
        res.write(data)
        res.end()
    })
}


var server = http.createServer(function (req, res) {
    if (req.method === 'POST') {
        var body = '';

        req.on('data', function(chunk) {
            body += chunk;
        });

        req.on('end', function() {
            switch(req.url){
                case "/contactme":
                    res.end()
                    break;
            }
        });
    } else {
        if(req.url=="/"){
            req.url="/index.html"
        }
        req.url=decodeURI(req.url)
        readFiles(req,res)
        
    }
});

// Listen on port 3000, IP defaults to 127.0.0.1
server.listen(port);

// Put a friendly message on the terminal
console.log('Server running at http://127.0.0.1:' + port + '/');