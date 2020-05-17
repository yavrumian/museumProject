$(document).ready(function(){
    $.get(serverUrl + '/checkLogin',  // url
      function (data, textStatus, jqXHR) {  // success callback
        if (data && data.msg && data.msg == "You're logged in")
        {
           window.location.href = window.location.href + "home.html";
        }
    });
    
    $("#loginForm").submit(function(event) {
        event.preventDefault();
        $("#loginButton").attr("disabled", true);
    
        var usernameVal = $("#loginM").val();
        var passwordVal = $("#passM").val();
    
        if (usernameVal != "" && passwordVal != "")
        {
            $.ajax({
                url: serverUrl + '/login',
                dataType: 'json',
                type: 'post',
                data: {username: usernameVal, pass: passwordVal},
                beforeSend: function(x) {
                  if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                  }
                },
                success: function( data, textStatus, jQxhr ){
                    console.log(data);
                    console.log(textStatus);
                    console.log(jQxhr);
                    window.location.href = window.location.href + "home.html";
                },
                error: function( jqXhr, textStatus, errorThrown ){
                    console.log(textStatus);
                    console.log( errorThrown );
                    $("#loginButton").attr("disabled", false);
                    $("#loginLabel").css("border-bottom-color", "#ff4c4c");
                    $("#passwordLabel").css("border-bottom-color", "#ff4c4c");
                    setTimeout(function() {
                        $("#loginLabel").css("border-bottom-color", "#4C73FF");
                        $("#passwordLabel").css("border-bottom-color", "#4C73FF");
                    }, 2000);
                }
            });
        }
    });
});