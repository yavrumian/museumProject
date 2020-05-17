function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

$(document).ready(function() {
    $.get(serverUrl + '/getLangs',  // url
    function (data, textStatus, jqXHR) {  // success callback
        //console.log(textStatus);
        //console.log(data);
        if (data && data.langs && data.langs.length && data.langs.length > 0)
        {
            for (var i = 0; i < data.langs.length; ++i)
            {
                var lang6391 = langs[data.langs[i]]['639-1'].toUpperCase();                    
                var found = countries.filter(function(item) { return item.code === lang6391; })[0].name;
                $("#langsUl").append('<li><p><img class="langIcons ' + data.langs[i] + '" src="m-admin/img/lang/' + found + '.svg" alt="">' + langs[data.langs[i]]['en'] + '</p><img src="img/lang/choose.svg" alt=""></li>');
            }
            
            // for safari browser
            if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {   
                $('#langUser').css('minHeight', $(window).height()+'px');
            }
            // change images src when br is safari
            if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
                $('#langUser .logoLangSf').attr('src', 'img/lang/langLogoS.PNG');
                $(".langIcons").each(function( index ) {
                    var currentLang = $(this).attr('class').split(' ')[1]
                    var lang6391 = langs[currentLang]['639-1'].toUpperCase();                    
                    var found = countries.filter(function(item) { return item.code === lang6391; })[0].name;
                    $(this).attr('src', 'img/lang/' + found + '.png')
                });
            }
            //  choose language and save that in input
            $('#langUser form li').on('click', function(event) {
                event.preventDefault();
                
                if (!$(this).hasClass('active')) {
                    $('#langUser form li').removeClass('active');
                    $(this).addClass('active');
                }

                $('#langUser input#lang').val($(this).children('p').children('img').attr('class').split(' ')[1]);
            });
            // create seccionStorige for Language
            $('#langUser form').submit(function(event) {
                var sessionText =  $('#langUser input#lang').val();
                setCookie('lng', sessionText, 30);
                //var language = sessionStorage.setItem('lang', sessionText); // in sessionStorage browser I save lang for using
            });
        }
    });


});