function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
    function(m,key,value) {
      vars[key] = value;
    });
    return vars;
}

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
    var urlVars = getUrlVars();
    console.log(urlVars);
    $.get(serverUrl + '/checkToken',  // url
    function (data, textStatus, jqXHR) {  // success callback\
        console.log(data);
        if (data && data.msg && data.msg == "You're logged in with token")
        {
            if (getCookie('lng') == '')
            {
                window.location.href = mainUrl + "/lang.html";
            }
            else
            {
                window.location.href = mainUrl + "/id.html";
            }
        }
    });

    if (urlVars.t)
    {
        console.log(urlVars.t);
        $.get(serverUrl + '/token/?token=' + urlVars.t,  // url
        function (data, textStatus, jqXHR) {  // success callback
            console.log(textStatus);
            console.log(data);
            if (data && data.token && data.token == urlVars.t)
            {
                console.log("s");
                window.location.href = mainUrl + "/lang.html";
            }
        });
    }
});

$("#formId").submit(function(event) {
    event.preventDefault();
    $.get(serverUrl + '/token/?token=' + $("#tokenInput").val(),  // url
        function (data, textStatus, jqXHR) {
            // success callback
            console.log(data);
            console.log(textStatus);
            if (data && data.token && data.token == $("#tokenInput").val())
            {
                console.log('hey');
                window.location.href = mainUrl + "/lang.html";
            }
            else
            {
                $(".inp").effect("shake");
            }
    }).fail(function() {
        $(".inp").effect("shake");
    });
});
