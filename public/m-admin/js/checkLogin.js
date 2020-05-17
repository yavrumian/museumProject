$(document).ready(function(){
    $.get(serverUrl + '/checkLogin',  // url
      function (data, textStatus, jqXHR) {  // success callback
        if (data && data.msg && data.msg == "You're not logged in")
        {
           window.location.href = currentUrl;
        }
    });    
});