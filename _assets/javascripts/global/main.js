//= require popper
//= require bootstrap/js/dist/util
//= require bootstrap/js/dist/collapse
//= require bootstrap/js/dist/tooltip

"use strict";
$(function() {
    let mainMenu = $("#mainmenuNavbar");
    mainMenu.on("show.bs.collapse", function () {
        $("#submenuNavbar").addClass("invisible");
    });
    mainMenu.on("hidden.bs.collapse", function () {
        $("#submenuNavbar").removeClass("invisible");
    });

    let backToTop = $("#back-to-top");
    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            backToTop.fadeIn();
        } else {
            backToTop.fadeOut();
        }
    });
    backToTop.click(function () {
        backToTop.tooltip("hide");
        $("body,html").animate({
            scrollTop: 0
        }, 800);
        return false;
    });

    backToTop.tooltip();
});
