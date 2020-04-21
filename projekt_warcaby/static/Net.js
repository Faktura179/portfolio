class Net{
    constructor(){
        this.name=null
        this.player=null
        this.interval
        this.intComp
    }
    wait(){
        var that = this
        $.ajax({
            url:"/",
            data: {
                action: "WAIT",              
            },
            type:"POST",
            success:function(data){
                if(data.users.length==2){
                    $("#window").css("display","none")
                    if(that.player==1)
                        $("#status").text("Witaj "+ that.name + "! Grasz bialymi. Dolaczyl gracz "+data.users[1])
                    else{
                        $("#move").css("display","block")
                        that.intComp = setInterval(that.compare.bind(that),500)
                    }
                    clearInterval(that.interval)

                }
            },
            error:function(){
                console.log("Error")
            }
            }) 
    }
    login(user){
        var that = this
        $.ajax({
            url:"/",
            data: {
                action: "ADD_USER",
                user: user,                
            },
            type:"POST",
            success:function(data){
                if(data.success){
                    $("#login").css("display","none")
                    $("#waiting").css("display","block")
                    that.name=user
                    that.player=data.player
                    game.setPieces()
                    if(data.player==2){
                        game.camera.position.set(0,320,-520)
                        game.camera.lookAt(0,0,0)
                        $("#status").text("Witaj "+ user + "! Grasz czarnymi")
                        $("#move").css("display","block")
                    }else{
                        $("#status").text("Witaj "+ user + "! Grasz bialymi")
                    }
                    that.interval=setInterval(that.wait.bind(that),500)
                }else{
                    $("#status").text(data.error)
                }
                
            },
            error:function(){
                console.log("Error")
            }
            }) 
    }
    reset(){
        $.ajax({
            url:"/",
            data: {
                action: "RESET",              
            },
            type:"POST",
            success:function(data){
                console.log("zresetowany")
            },
            error:function(){
                console.log("Error")
            }
            }) 
    }
    compare(){
        var that = this
        $.ajax({
            url:"/",
            data: {
                action: "COMPARE",              
            },
            type:"POST",
            success:function(data){
                
                if(JSON.stringify(data.pionki)!=JSON.stringify(game.pionki)){
                   
                    game.pionki=data.pionki
                    game.setPieces()
                    $("#move").css("display","none")
                    clearInterval(that.intComp)
                }
            },
            error:function(){
                console.log("blad przy odbieraniu info")
            }
        }) 
    }
    update(){
        $("#move").css("display","block")
        var that= this
        $.ajax({
            url:"/",
            data: {
                action: "UPDATE", 
                pionki:JSON.stringify( game.pionki )            
            },
            type:"POST",
            success:function(data){
                that.intComp =  setInterval(that.compare.bind(that),500)
                
            },
            error: function (request, status, error) {
                console.log("blad przy ruszaniu sie",request,status,error)
            }
        }) 
    }
}