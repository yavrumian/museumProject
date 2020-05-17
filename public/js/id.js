function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

$(document).ready(function() {
    $.get(serverUrl + '/checkToken',  // url
    function (data, textStatus, jqXHR) {  // success callback\
        console.log(data);
        if (data && data.msg && data.msg == "You're logged in with token")
        {
            // logged in
        }
        else
        {
            window.location.href = mainUrl;
        }
    }).fail(function() {
        window.location.href = mainUrl;
    });
});

$("#sendIdForm").submit(function(event) {
    event.preventDefault();
    $.get(serverUrl + '/record/' + $("#exponatId").val() + '/' + getCookie('lng'),  // url
        function (data, textStatus, jqXHR) {  // success callback
            console.log(textStatus);
            console.log(data);
            if (data && data.id && data.id == $("#exponatId").val())
            {
                console.log("s");
                window.location.href = mainUrl + "/exponat.html?id=" + $("#exponatId").val();
            }
            else
            {
                $(".inp").effect("shake");
            }
    }).fail(function() {
        $(".inp").effect("shake");
    });
});