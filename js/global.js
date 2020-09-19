/**
 * Project: CoGAP Website
 *
 * Copyright © MPM IT UG (haftungsbeschränkt)
 * http://www.mpm-it.com
 *
 * @author MPM IT <info@mpm-it.com>
 */

window.$ = jQuery;

$(function () {

    window.project = {};

    project.showBlocker = function () {
        project.resizeHeight();
        project.blocker.css("display", "block");
    };

    project.hideBlocker = function () {
        project.blocker.css("display", "none");
    };

    project.messageBox = function (message) {
        $('.message-box').css('top', $(window).height() * 0.4);
        $('.message-box').css('left', $(window).width() * 0.3);

        $('.message-box .heading').html('Hinweis');
        $('.message-box .content').html(message);
        $('.message-box').fadeIn();

        setTimeout(function () {
            $('.message-box').fadeOut(function () {
                $('.message-box').remove();
            });
        }, 3000);
    };

    project.showDialog = function (element) {
        $(element).dialog({
            draggable: false,
            width: 677,
            show: {effect: "clip", duration: 200},
            hide: {effect: "clip", duration: 200},
            buttons: [
                {
                    text: "Schließen",
                    click: function () {
                        $(this).dialog("close");
                    }
                }
            ]
        });
    };

    project.numberWithCommas = function (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };


    //initialize swiper when document ready
    project.swiperPresenter = new Swiper('.swiper-container--presenter', {
        direction: 'horizontal',
        loop: true,
        speed: $('body').data('device-type') === 'phone' ? 500 : 1500,
        autoplay: 4000,
        autoheight: true,
        simulateTouch: ($('body').data('device-type') === 'phone'),
        pagination: '.swiper-container--presenter__pagination',
        paginationClickable: true,
        nextButton: '.swiper-container--presenter__button--next',
        prevButton: '.swiper-container--presenter__button--prev',
        slidesPerView: 1,
        slidesPerGroup: 1,
        lazyLoading: true
    });

    project.swiperTestimonials = new Swiper('.swiper-container--testimonials', {
        direction: 'horizontal',
        loop: false,
        speed: $('body').data('device-type') === 'phone' ? 500 : 1500,
        autoheight: true,
        simulateTouch: ($('body').data('device-type') === 'phone'),
        nextButton: '.swiper-container--testimonials__button--next',
        prevButton: '.swiper-container--testimonials__button--prev',
        slidesPerView: $('body').data('device-type') !== 'phone' ? 1 : 1.2,
        slidesPerGroup: 1,
    });

    project.swiperTicker = new Swiper('.swiper-container--ticker', {
        direction: 'horizontal',
        loop: false,
        speed: $('body').data('device-type') === 'phone' ? 500 : 1500,
        autoheight: true,
        simulateTouch: ($('body').data('device-type') === 'phone'),
        nextButton: '.swiper-container--ticker__button--next',
        prevButton: '.swiper-container--ticker__button--prev',
        slidesPerView: $('body').data('device-type') !== 'phone' ? 1 : 1.35,
        slidesPerGroup: 1,
        lazyLoading: true
    });

    project.createCookie = function (name, value, days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        }
        else var expires = "";
        document.cookie = name + "=" + value + expires + "; path=/";
    };

    project.readCookie = function (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    };

    project.deleteCookie = function (name) {
        createCookie(name, "", -1);
    };


    $(document).on('click', '.faq__list__question', function () {

        var answer = $(this).next('.faq__list__answer');
        if (answer.data('is-open') === 'true') {
            return false;
        }

        $('.faq__list__answer').each(function (index, item) {
            $(item).hide().data('is-open', 'false');
        });

        answer.fadeIn('fast');
        answer.data('is-open', 'true');
    });


    $(document).on('click', '[data-video-id]', function () {

        var videoModal = $('#video-modal');

        var videoId = $(this).data('video-id');
        var playerWidth = $(this).data('player-width');
        var playerHeight = $(this).data('player-height');

        if (playerWidth === 'auto' && playerWidth === 'auto') {

            factor = 0.9; // 90% width

            playerWidth = $(window).width() * factor;
            playerHeight = (playerWidth / 16) * 9;
        }

        var modalOptions = {
            'opacity': 75,
            'maxWidth': playerWidth,
            'maxHeight': playerHeight,
            'closeHTML': false,
            'onShow': function () {

                project.ytPlayer = new YT.Player('yt-video-placeholder', {
                    height: playerHeight,
                    width: playerWidth,
                    videoId: videoId,
                    events: {
                        'onReady': function () {
                            project.ytPlayer.playVideo();
                        }
                    }
                });
            }
        };

        if ($('body').data('device-type') === 'phone') {
            modalOptions.position = ["25%", "0"];
        }

        videoModal
            .show()
            .modal(modalOptions);
    });

    $(document).on('click', '.close-modal', function () {
        $.modal.close();
        $('#video-modal').hide();
    });

    $(document).on('click', '.js-close-sticky-bottom-info', function () {
        $('.js-sticky-bottom-info').hide();
        project.createCookie('cogap-sticky-gutflora', 'false', 2);
    });

    $('[data-js-action]').each(function () {
        var jsAction = $(this).data('js-action');

        switch (jsAction) {

            case 'handle-email-address':
                var emailAddressString = $(this).text();
                emailAddressString = emailAddressString
                    .replace('[_at_]', '@')
                    .replace('[_dot_]', '.');
                $(this)
                    .attr('href', 'mailto:' + emailAddressString)
                    .text(emailAddressString);
        }
        ;
    });

    // Check for sticky bottom info cookie
    (function () {
        cookieValue = project.readCookie('cogap-sticky-gutflora');
        if (cookieValue === 'false') {
            $('.js-sticky-bottom-info').hide();
        }
    }());
});
