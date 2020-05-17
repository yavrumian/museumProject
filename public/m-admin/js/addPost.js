var langsCanAdd = [];
var audioFileContent = '';
var imageFileContent = '';

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
                langsCanAdd.push(found + ".svg");

                if (i == 0)
                $("#langu").append('<li class="activeLang"><img src="img/lang/' + found + '.svg" alt=""><span id="' + data.langs[i] + '">' + langs[data.langs[i]]['en'] + '</span> <img class="arBtn" src="img/addPost/arrow-bottom.svg" alt=""></li>');
                else
                $("#langu").append('<li><img src="img/lang/' + found + '.svg" alt=""><span id="' + data.langs[i] + '">' + langs[data.langs[i]]['en'] + '</span> <img class="arBtn" src="img/addPost/arrow-bottom.svg" alt=""></li>');
            }

            //  choose language and save that in input
            $('input#lang').chackLang($('#langu li.activeLang > span').attr("id"));
            $('#langu li').on('click', function(event) {
                event.preventDefault();

                if (!$(this).hasClass('activeLang')) {
                    $('#langu li.activeLang').css('order', $(this).css('order'));
                    $(this).css('order', 1);
                    $('#langu li').removeClass('activeLang');
                    $(this).addClass('activeLang');
                    $('#langu li').not(this).fadeOut(200);
                }else{
                    $('#langu li').not(this).fadeToggle(200);
                }
                $('input#lang').chackLang($(this).children('span').attr("id"));
            });
        }
    });


    // choose image and audio file save that in input and make base 64 texts
    let locText = '';
    var handleFileSelect = function(evt, extensionOfFile) {
        var files = evt.target.files;
        var file = files[0];
        if (files && file) {
            var reader = new FileReader();
            console.log(extensionOfFile);
            reader.onload = function(readerEvt) {
                var binaryString = readerEvt.target.result;
                //console.log(btoa(binaryString));//make base64 text file any file
                if (extensionOfFile == "mp3") audioFileContent = btoa(binaryString);
                else if (extensionOfFile == "jpg") imageFileContent = "data:image/jpg;base64," + btoa(binaryString);
                else if (extensionOfFile == "jpeg") imageFileContent = "data:image/jpg;base64," + btoa(binaryString);
                else if (extensionOfFile == "png") imageFileContent = "data:image/png;base64," + btoa(binaryString);
            };

            reader.readAsBinaryString(file);
        }

    };

    $(".addMultiFile > input[type='file']").on("change", function(event) {
        var fileNameParsed = $(this).prop('files')[0].name.split('.');
        var extensionOfFile = fileNameParsed[fileNameParsed.length -1].toLowerCase();

        if ($(this).prop('files')[0].size / 1048576 > 5 && $(this).attr('name') == 'image'){
            alert('Maximum image size 5 MB');
            $(this).val('');
        }else if($(this).prop('files')[0].size / 1048576 > 100 && $(this).attr('name') == 'audio'){
            alert('Maximum audio size 100 MB');
            $(this).val('');
        }else{
            if ($(this).attr('name') == 'image') {
                if(locText.length  == 0){
                    locText = $(this).prop('files')[0].name;
                }else if(/  &  /.test(locText)){
                    locText = locText.split('  &  ');
                    locText.shift();
                    locText = locText.join('');
                    locText += '  &  ' + $(this).prop('files')[0].name;
                }
                handleFileSelect(event, extensionOfFile);//make base64 text file image file,but not give that in server only console log
            }else{
                if(!/  &  /.test(locText)){
                    locText +=  '  &  ' + $(this).prop('files')[0].name;
                }else{
                    locText = locText.split('  &  ');
                    locText.shift();
                    locText = locText.join('');
                    locText += '  &  ' + $(this).prop('files')[0].name;
                }
                handleFileSelect(event, extensionOfFile);//make base64 text file audio file,but not give that in server only console log

            }

            $('.addAudioImgNames').text(locText);

        }
    });


    $("#addPostForm").submit(function(event) {
        event.preventDefault();
        $("#submitButton").attr("disabled", true);

        var titleVal = $("#title").val();
        var idRecordVal = $("#iditi").val();
        var langVal = $("#lang").val();
        var descriptionVal = $("#description").val();

        if (titleVal != "" && idRecordVal != "" && langVal != "" && descriptionVal != "" && imageFileContent != "" && audioFileContent != "")
        {
            console.log('okkkkay');
            $.ajax({
                url: serverUrl + '/record/add',
                dataType: 'json',
                type: 'post',
                data: {title: titleVal, id: idRecordVal, lang: langVal, description: descriptionVal, audio: audioFileContent, image: imageFileContent},
                beforeSend: function(x) {
                  if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/json;charset=UTF-8");
                  }
                },
                success: function( data, textStatus, jQxhr ){
                    console.log(data);
                    console.log(textStatus);
                    console.log(jQxhr);
                    window.location.href = currentUrl + "/success.html";
                },
                error: function( jqXhr, textStatus, errorThrown ){
                    console.log(textStatus);
                    console.log( errorThrown );
                }
            });
        }
    });

    $("#selectAudio").click(function() {
        $("#selectAudio").attr('src', 'img/addPost/volumActive.svg');
        $("#selectImage").attr('src', 'img/addPost/pic.svg');

        $("#imageUploadInput").attr('disabled', 'true');
        $("#imageUploadInput").removeClass('active');
        $("#audioUploadInput").removeAttr('disabled')
        $("#audioUploadInput").addClass('active');

        $(".addAudioImgNames").html("Select audio");
    });

    $("#selectImage").click(function() {
        $("#selectAudio").attr('src', 'img/addPost/volum.svg');
        $("#selectImage").attr('src', 'img/addPost/picActive.svg');

        $("#audioUploadInput").attr('disabled', 'true');
        $("#audioUploadInput").removeClass('active');
        $("#imageUploadInput").removeAttr('disabled')
        $("#imageUploadInput").addClass('active');

        $(".addAudioImgNames").html("Select image");
    });
});
