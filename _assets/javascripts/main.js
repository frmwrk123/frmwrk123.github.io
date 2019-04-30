"use strict";

$(function () {
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
    countdown.setFormat({
        singular: " Millisekunde| Sekunde| Minute| Stunde| Tag| Woche| Monat| Jahr| Jahrzehnt| Jahrhundert| Jahrtausend",
        plural: " Millisekunden| Sekunden| Minuten| Stunden| Tage| Wochen| Monate| Jahre| Jahrzehnte| Jahrhunderte| Jahrtausende",
        last: " und ",
        delim: ", "
    });
    let counterID = countdown(function (timestamp) {
            countdownSpan.html(timestamp.toString());
        }, new Date(2019, 4, 26, 18, 0),
        countdown.DAYS |
        countdown.HOURS |
        countdown.MINUTES |
        countdown.SECONDS
    );

    // election map feature
    // v0.1

    let stadtteil_svg = $("#election_map g.stadtteil");

    stadtteil_svg.mouseenter(function (e) {
        const region_data = $(this).data();
        let tooltip = $("<div id='info_panel' class=\"info_panel\"><span class='font-weight-bold'>" + region_data.name + "</span><br>" +
            region_data.platz1 + "<br>" +
            region_data.platz2 + "</div>"
        );

        let mouseX = e.pageX, //X coordinates of mouse
            mouseY = e.pageY; //Y coordinates of mouse
        tooltip.appendTo("body");
        tooltip.css({
            top: mouseY - 60,
            left: mouseX - (tooltip.width() / 2)
        });

    });

    stadtteil_svg
        // deactivate links for now
        /*.click(function (e) {
            e.preventDefault();
            const region_data = $(this).data();
            window.location.href = region_data.link;
        })*/
        .mouseout(function (e) {
            $("#info_panel").remove();
        })
        .mousemove(function (e) {
            let mouseX = e.pageX, //X coordinates of mouse
                mouseY = e.pageY; //Y coordinates of mouse
            let info_panel = $("#info_panel");
            info_panel.css({
                top: mouseY - 60,
                left: mouseX - (info_panel.width() / 2)
            });
        });

});
