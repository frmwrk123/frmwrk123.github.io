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
});