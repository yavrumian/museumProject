console.log(langs['eng']);

function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
      textbox.addEventListener(event, function() {
        if (inputFilter(this.value)) {
          this.oldValue = this.value;
          this.oldSelectionStart = this.selectionStart;
          this.oldSelectionEnd = this.selectionEnd;
        } else if (this.hasOwnProperty("oldValue")) {
          this.value = this.oldValue;
          this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
        }
      });
    });
}

function openInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
}

function checkTokens()
{
    $.get(serverUrl + '/token/active',  // url
    function (data, textStatus, jqXHR) {  // success callback
        if (data && data.active)
        {
            $("#activeTokensSpan").html(data.active);
        } else $("#activeTokensSpan").html('0');
    }).fail(function() {
        $("#activeTokensSpan").html('0');
    });
}

$(document).ready(function() {
    checkTokens();

    $(".logout").click(function() {
        $.get(serverUrl + '/logout',  // url
        function (data, textStatus, jqXHR) {  // success callback
            if (data)
            {
                location.reload();
            }
        });
    });

    setInputFilter(document.getElementById("newTokenInput"), function(value) {
        return /^\d*$/.test(value);
    });
    
    $("#printButton").click(function() {
        var count = $("#newTokenInput").val();
        if (!isNaN(count) && count > 0)
        {
            $.get(serverUrl + '/token/create?count=' + count,  // url
            function (data, textStatus, jqXHR) {  // success callback
                console.log(textStatus);
                console.log(data);
                if (data && data.urlToPDF)
                {
                    checkTokens();
                    console.log(data.urlToPDF);
                    openInNewTab(data.urlToPDF);
                }
            });
        }
    });

    $.get(serverUrl + '/record/all',  // url
      function (data, textStatus, jqXHR) {  // success callback
        console.log(textStatus);
        console.log(data.length);
        console.log(data);

        if (data && data.length > 0)
        {
            for (var i = 0; i < data.length; ++i)
            {
                var d = new Date(data[i].createdAt);
                var createdAtThis = ("00" + d.getDate()).slice(-2) + "/" + ("00" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear() + " " + ("00" + d.getHours()).slice(-2) + ":" + ("00" + d.getMinutes()).slice(-2);
                var e = $('<tr><td>' + data[i].id + '</td><td>' + data[i].title + '</td><td>' + langs[data[i].lang].en + '</td><td>' + createdAtThis + '</td><td><div class="btns-req"><button recordId="' + data[i].id +'" recordLang="' + data[i].lang +'" class="editButton ' + data[i].id + '" type="button"><img src="img/homeUI/edit.svg" alt=""></button><button path="' + data[i].id + '/' + data[i].lang +'" class="deleteButton" type="button"><img src="img/homeUI/delete.svg" alt=""></button></div></td></tr>');
                $("#tableBody").append(e);
            }

            $(".editButton").click(function() {
                window.location.href = currentUrl + "/edit.html?id=" + $(this).attr('recordId') + "&lang=" + $(this).attr('recordLang');
            });
            
            $(".deleteButton").click(function() {
                $.get(serverUrl + '/record/delete/' + $(this).attr('path'),  // url
                function (data, textStatus, jqXHR) {  // success callback
                    console.log(textStatus);
                    console.log(data);
                    if (data && data.id)
                    {
                        console.log(data.id);
                        location.reload();
                    }
                });
            });
        }
    }).fail(function() {
        
    });
});



