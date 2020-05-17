var langsCanAdd = [];
var audioFileContent = '';
var imageFileContent = '';
var defaultTitle = '';
var defaultDescription = '';

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
    function(m,key,value) {
      vars[key] = value;
    });
    return vars;
}

$(document).ready(function() {
    var urlVars = getUrlVars();
    console.log(urlVars);
    
    var lang6391 = langs[urlVars.lang]['639-1'].toUpperCase();
    var found = countries.filter(function(item) { return item.code === lang6391; })[0].name;
    $("#langu").append('<li class="activeLang"><img id="counryIcon" src="img/lang/' + found + '.svg" alt=""><span id="' + urlVars.lang + '">' + langs[urlVars.lang]['en'] + '</span> <img class="arBtn" src="img/addPost/arrow-bottom.svg" alt=""></li>');
    $("#iditi").val(urlVars.id);
    
    $.get(serverUrl + '/record/' + urlVars.id + "/" + urlVars.lang,  // url
    function (data, textStatus, jqXHR) {  // success callback
        console.log(textStatus);
        console.log(data);
        if (data && data.title && data.description)
        {
            $("#title").val(data.title);
            $("#description").val(data.description);

            defaultDescription = data.description;
            defaultTitle = data.title;
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
            /*
            $(this).attr('disabled', 'true');
            $(this).removeClass('active');
            $(".addMultiFile > input[type='file']").not(this).removeAttr('disabled')
            $(".addMultiFile > input[type='file']").not(this).addClass('active');
            */
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

        var objectToSend = {};
    
        var titleVal = $("#title").val();
        var descriptionVal = $("#description").val();
        var hasChanges = false;

        if (titleVal != defaultTitle) { objectToSend.title = titleVal; hasChanges = true; }
        if (descriptionVal != defaultDescription) { objectToSend.description = descriptionVal; hasChanges = true; }
        if (imageFileContent != "") { objectToSend.image = imageFileContent; hasChanges = true; }
        if (audioFileContent != "") { objectToSend.audio = audioFileContent; hasChanges = true; }
    
        if (hasChanges)
        {
            $.ajax({
                url: serverUrl + '/record/edit/' + urlVars.id + "/" + urlVars.lang,
                dataType: 'json',
                type: 'post',
                data: objectToSend,
                beforeSend: function(x) {
                  if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                  }
                },
                success: function( data, textStatus, jQxhr ){
                    console.log(data);
                    console.log(textStatus);
                    console.log(jQxhr);
                    window.location.href = currentUrl + "/successEdit.html";
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