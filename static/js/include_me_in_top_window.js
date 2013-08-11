/******************************************
 * ep_background_notification top frame script
 *
 * @author: Daniel Beard <dryawgmoth@gnail.com>
 * @description:  If you are embedding the pad in an iframe. You need to include this in the top frame to capture and
 *                pass down focus/blur events to tie iframe.
 * @requires: jQuery
 */

var ep_background_notify_original_title = ""
var ep_background_notify_flash_title_interval = undefined;
//TODO: HTML notification http://www.html5rocks.com/en/tutorials/notifications/quick/


$(document).ready(function(){

    //pass the focus and blur events down to the iframe
    $(window).focus(function(){
        document.title = ep_background_notify_original_title;
        clearInterval(ep_background_notify_flash_title_interval);
        ep_background_notify_flash_title_interval = undefined;

        $('iframe').filter('.etherpad').each(function(idex,ele){
            ele.contentWindow.postMessage('ep_background_notify_set_is_active:true',ele.src);
        });
    });

    $(window).blur(function(){
        $('iframe').filter('.etherpad').each(function(idex,ele){
            ele.contentWindow.postMessage('ep_background_notify_set_is_active:false',ele.src);
        });
    });
    //flash the title
    window.addEventListener("message", function(event){
        if(event.data=='ep_background_notify_flash_title')
        {
            if(ep_background_notify_flash_title_interval == undefined)
            {
                ep_background_notify_original_title = document.title
                ep_background_notify_flash_title_interval = setInterval(function(){
                        document.title = document.title == ep_background_notify_original_title ? "***********" : ep_background_notify_flash_title_interval
                },500);
            }
        }
        else if(event.data=='ep_background_notify_flash_title_stop')
        {
            document.title = ep_background_notify_original_title;
            clearInterval(ep_background_notify_flash_title_interval);
            ep_background_notify_flash_title_interval = undefined;
        }
    },false);
});