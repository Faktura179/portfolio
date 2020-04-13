var btn = document.getElementById("send")
    btn.onclick = function(){
        var name = document.getElementById("imie")
        var email = document.getElementById("mail")
        var msg = document.getElementById("wiad")

        if(/\S+@\S+\.\S+/.test(email.value)){
            var json = {
                name: name.value,
                email:email.value,
                message:msg.value
            }

            $.ajax({
                type: "POST",
                url: "/contactme",
                data: JSON.stringify(json),
                success: function(){
                    name.value=""
                    email.value=""
                    msg.value=""
                }
            });
        }else{
            document.getElementById("contpopup").style.opacity="1"
            setTimeout(function(){
                document.getElementById("contpopup").style.opacity="0"
            },3000)
        }
    }