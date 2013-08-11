/******************************************
 * ep_background_notification top frame script
 *
 * @author: Daniel Beard <dryawgmoth@gnail.com>
 * @description:  If you are embedding the pad in an iframe. You need to include this in the top frame to capture and
 *                pass down focus/blur events to tie iframe.
 * @requires: jQuery
 */
$(document).ready(function(){

    //pass the focus and blur events down to the iframe
    $(window).focus(function(){
        $('iframe').filter('.etherpad').each(function(idex,ele){
            ele.contentWindow.postMessage('ep_background_notify_sound:true',ele.src);
        });
    });

    $(window).blur(function(){
        $('iframe').filter('.etherpad').each(function(idex,ele){
            ele.contentWindow.postMessage('ep_background_notify_sound:false',ele.src);
        });
    });
});