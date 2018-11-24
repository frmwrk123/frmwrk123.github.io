//= require popper
//= require bootstrap/util
//= require bootstrap/collapse

"use strict";
$(function() {
    let mainMenu = $('#mainmenuNavbar');
    mainMenu.on('show.bs.collapse', function (e) {
        $('#submenuNavbar').addClass('invisible');
    });
    mainMenu.on('hidden.bs.collapse', function (e) {
        $('#submenuNavbar').removeClass('invisible');
    });

    let backToTop = $('#back-to-top');
    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            backToTop.fadeIn();
        } else {
            backToTop.fadeOut();
        }
    });
    backToTop.click(function() {
        backToTop.tooltip('hide');
        $('body,html').animate({
            scrollTop: 0
        }, 800);
        return false;
    });

    backToTop.tooltip();
});