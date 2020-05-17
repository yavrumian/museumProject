function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

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
    
    if (!urlVars.id || isNaN(urlVars.id) || urlVars.id < 0) window.location.href = mainUrl + "/id.html";
    
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
    
    $.get(serverUrl + '/record/' + urlVars.id + '/' + getCookie('lng'),  // url
    function (data, textStatus, jqXHR) {  // success callback\
        console.log(data);
        if (data && data.id && data.id == urlVars.id)
        {
            $("#titleExponat").html(data.title);
            $("#descriptionExponat").html(data.description);
            $("#imageExponat").attr("src", protocolType + data.image);
            $("#audioExponat").attr("src", protocolType + data.audio);
        }
        else
        {
            window.location.href = mainUrl + "/id.html";
        }
    }).fail(function() {
        window.location.href = mainUrl + "/id.html";
    });


    $.get(serverUrl + '/getLangs',  // url
    function (data, textStatus, jqXHR) {  // success callback\
        if (data && data.langs && data.langs.length && data.langs.length > 0)
        {
            for (var i = 0; i < data.langs.length; ++i)
            {
                var lang6391 = langs[data.langs[i]]['639-1'].toUpperCase();                    
                var found = countries.filter(function(item) { return item.code === lang6391; })[0].name;
                $("#langsUl").append('<li><p><img class="langIcons ' + data.langs[i] + '" src="m-admin/img/lang/' + found + '.svg" alt="">' + langs[data.langs[i]]['en'] + '</p><img src="img/exponat/arrow-bottom.svg" alt=""></li>');
            }


            // for safari browser
            if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {   
                $('#exponatUser').css('minHeight', $(window).height()+'px');
            }
                
            // change images src when br is safari
            if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {     
                $(".langIcons").each(function( index ) {
                    var currentLang = $(this).attr('class').split(' ')[1]
                    var lang6391 = langs[currentLang]['639-1'].toUpperCase();                    
                    var found = countries.filter(function(item) { return item.code === lang6391; })[0].name;
                    $(this).attr('src', 'img/lang/' + found + '.png')
                });
            }

            //
            try {
                var sessionText = getCookie('lng');
                var glExpTextLang = '';
                if (sessionText != '') glExpTextLang = langs[sessionText]['en'];

                var i = 0;
                $('#exponatUser .langExpList li').each(function(index) {
                    if($(this).text() == glExpTextLang){
                        $(this).addClass('active');
                        i = 1;
                        $(this).css('order', i);
                    }else{
                        $(this).css('display', 'none');
                    }
                });

                $('#exponatUser .langExpList li').each(function(index) {
                    if($(this).css('order') != 1){
                        i++;
                        $(this).css('order', i);
                    }
                });

                    $('#exponatUser .langExpList li').on('click', function(event) {
                        event.preventDefault();
                        
                    if (!$(this).hasClass('active')) {
                        $('#exponatUser .langExpList li').css('order', $(this).css('order'));
                        $(this).css('order', 1);
                        $('#exponatUser .langExpList li').removeClass('active');
                        $(this).addClass('active');
                        $('#exponatUser .langExpList li').not(this).fadeOut(200); 
                        var glText = $(this).children('p').children('img').attr('class').split(' ')[1];
                        setCookie('lng', glText, 30);
                        location.reload();
                    }else{
                        $('#exponatUser .langExpList li').not(this).fadeToggle(200); 
                    }
                });
            } catch(e) {
                console.log(e);
            }
        }
    });
});