(function($) {
  $.fn.inputFilter = function(inputFilter) {
    return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function() {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      }
    });
  };

   $.fn.chackLang = function(textLang){
        let glText = textLang;
        /*
        if(textLang == "English"){
            glText = "eng";
        }else if(textLang == "Armenian"){
            glText = "arm";
        }else if(textLang == "Russian"){
            glText = "ru";
        }
        */
        return $(this).val(glText);
    }
}(jQuery));


jQuery(document).ready(function($) {

    // homeUI html script
    {
        // Print modal window
        $('ul.buttons > li>a.print').on('click', function(event) {
            event.preventDefault();
            $('#modalPrint').addClass('anime');
        });

        $('#modalPrint').on('click',function(event) {
            event.preventDefault();
            if (event.target.id == 'modalPrint') {
                $(this).removeClass('anime');
            }

        });

        // table body choose event
        $('#mainTable table > tbody > tr').on('click', function(event) {
            event.preventDefault();
            $('#mainTable table > tbody > tr').not(this).removeClass('active');
            $(this).toggleClass('active');
        });
    }


    // addPost html script
    {
        // id only number
        $('input#iditi').inputFilter(function(value) {
            return /^\d*$/.test(value);
        });



        // post form submit in server
        $('form[name="postsMU"]').submit(function(event) {
            $('input').removeAttr('disabled');
        });
    }

    // login (admin) html script // index html
    {
        $('#login .col > label > input').on({
            focus: function(event) {
                event.preventDefault();
                $(this).parent('label').addClass('active');
                $('#login .col > label > input').not(this).parent('label').removeClass('active');
            },
            blur: function(event){
                event.preventDefault();
                $(this).parent('label').removeClass('active');
            },
            change: function(event){
                event.preventDefault();
                $(this).parent('label').css('borderBottomColor', '#4C73FF');
                $(this).prev('img').css('opacity', '1');
                if(!$(this).val()){                    
                    $(this).parent('label').removeAttr('style');
                    $(this).prev('img').removeAttr('style');
                }
            }
        });
    }

});