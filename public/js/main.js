
window.onload = function (e) {

    // cheek all pages inputs // PS tanks Safari #''>....
    {
        var form = document.querySelector('form'); 
        form.noValidate = true;
        form.addEventListener('submit', function(event) { 
                if (!event.target.checkValidity()) {
                    event.preventDefault(); 
                    alert('Please, choose or fill inputs!'); 
                }
            }, false);
    }

	// login (user) html script // index html
    {

        jQuery('#loginUser .col > label > input').on({
            focus: function(event) {
                event.preventDefault();
                jQuery(this).parent('label').addClass('active');
                jQuery('#loginUser .col > label > input').not(this).parent('label').removeClass('active');
            },
            blur: function(event){
                event.preventDefault();
                jQuery(this).parent('label').removeClass('active');
            },
            change: function(event){
                event.preventDefault();
                jQuery(this).parent('label').css('borderBottomColor', '#4C73FF');
                jQuery(this).prev('img').css('opacity', '1');
                if(!jQuery(this).val()){                    
                    jQuery(this).parent('label').removeAttr('style');
                    jQuery(this).prev('img').removeAttr('style');
                }
            }
        });
    }

	// token html
    {
        // for safari browser
        if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {   
            $('#tokenUser').css('minHeight', $(window).height()+'px');
        }
    }
    // lang html
    {

    }

    // idinty html
    {
        // for safari browser
        if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {   
            $('#idintyUser').css('minHeight', $(window).height()+'px');
        }
    }

    //exponat html
    {
        
       
    }

    // all buttons color in safari
    {
        if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {   
            $('input[type="submit"]').css('background', '#4C73FF linear-gradient(#4C73FF,#4C73FF)');
        }
    }
}