/******************************************
 * ep_background_notification client script
 *
 * @author: Daniel Beard <dryawgmoth@gnail.com>
 * @description: Client library that will alert the user is something changed while they weren't looking at the pad
 * @requires: jQuery
 */
exports.played_sound_within_limit=false;
exports.documentReady = function(){
        exports.is_active = true; //is this document the one that user is looking at?
        exports.parent_url = window.location;



        //if we're not in an iframe, everything is simple
        if(window.top == window)
        {
             $(window).focus(function(){exports.is_active = true});
             $(window).blur(function(){exports.is_active = false});
        }
        else
        {
             $(window).focus(function(){
                 parent.postMessage("ep_background_notify_flash_title_stop","*");
                 exports.is_active = true}
             );
            //ONLY blur when the parent tells us to
             //$(window).blur(function(){exports.is_active = false});

            //if we're in an iframe, we need the parent window to be able to communicate focus and blur events to us
            //use cross document messaging for that http://en.wikipedia.org/wiki/Cross-document_messaging
            window.addEventListener('message', function(event){
                if(event.data == 'ep_background_notify_set_is_active:true') exports.is_active = true;
                else if(event.data == 'ep_background_notify_set_is_active:false') exports.is_active = false;
            }, false);
        }

        //add an audio tag to the body
        $('body').append($("<audio id='ep_background_notify_sound' src='/static/plugins/ep_background_notify/static/media/notify.wav' preload />"));



};

exports.handleClientMessage_NEW_CHANGES = function(){
    //the reason we have to || it here is because the parent window [if we're in an iframe] will report
    // a blur event when focus goes to the iframe. There's no way to figure out if the blur event was because of us
    // or someone else. So assume we're active, if we (the iframe) have focus, even if the parent window says otherwise
    if(document.hasFocus() || exports.is_active) return []; // don't care if we're active

    //so we're not too annoying and playing the sound for every keystroke limit it to once every x seconds
    if(!exports.played_sound_within_limit)
    {
        $('#ep_background_notify_sound')[0].play();
        exports.played_sound_within_limit = true;
        //change it back in x seconds
        setTimeout(function(){
           exports.played_sound_within_limit = false;
        },10000); //TODO: make this a setting in settings.json
    }

    //tell the parent window to flash the title bar
    parent.postMessage("ep_background_notify_flash_title","*");
};




