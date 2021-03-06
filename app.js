var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
    qs= require("querystring"),
    er404 = fs.readFileSync("static/404.html"),
    nodemailer = require('nodemailer'),
    pass = require("./password")

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
    gif:"image/gif",
    bmp:"image/bmp",
    ttf:"application/x-font-ttf",
    
}
var transporter = nodemailer.createTransport({
    host: 'rafalfatula.com',
    auth: {
      user: 'contact@rafalfatula.com',
      pass: pass.pass
    },
    port:587
  });
  
  

function readFiles(req,res){
    var ext = req.url.split(".")[req.url.split(".").length-1]
    if(ext == req.url){
        req.url+=".html"
        ext="html"
    }
    fs.readFile(__dirname+"/static"+req.url,function(err,data){
        if(err){
            res.writeHead(404)
            res.write(er404)
            return res.end()
        }
        
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
            var json = JSON.parse(body) 
            switch(req.url){
                case "/contactme":
                    var mailOptions = {
                        from: 'contact@rafalfatula.com',
                        to: 'fatula.rafal@gmail.com',
                        subject: 'Wiadomość od '+json.name,
                        text: json.message +'\n'+"Wysłane od: "+json.email
                      };
                      transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                          console.log(error);
                          res.end()
                        } else {
                          console.log('Email sent: ' + info.response);
                          res.end()
                        }
                      }); 
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