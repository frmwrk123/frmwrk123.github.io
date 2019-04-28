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

    echo.init({
        offset: 500,
        throttle: 250,
        unload: false
    });

    let countdownSpan = $("#countdown");
    countdown.setFormat({singular: " Millisekunde| Sekunde| Minute| Stunde| Tag| Woche| Monat| Jahr| Jahrzehnt| Jahrhundert| Jahrtausend",
                        plural: " Millisekunden| Sekunden| Minuten| Stunden| Tage| Wochen| Monate| Jahre| Jahrzehnte| Jahrhunderte| Jahrtausende",
                        last: " und ",
                        delim: ", "});
    let counterID = countdown(function(timestamp) {
            countdownSpan.innerText = timestamp.toLocaleString();
        }, new Date(2019, 5, 26, 18, 0),
        countdown.DAYS |
        countdown.HOURS |
        countdown.MINUTES |
        countdown.SECONDS
    );

});
