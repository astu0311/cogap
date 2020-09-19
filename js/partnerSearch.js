/**
 * Project: CoGAP Website
 *
 * Copyright © MPM IT UG (haftungsbeschränkt)
 * http://www.mpm-it.com
 *
 * @author MPM IT <info@mpm-it.com>
 */

var partnerSearchApp = {};

partnerSearchApp.texts = {
    noAdviderFound: 'Es wurde kein Berater im gesuchten Umkreis gefunden. Gerne suchen wir für Sie einen geeigneten Berater.',
    oneAdviserInSearchRadius: 'Es wurde ein Berater im Umkreis von {{searchRadius}} km gefunden.',
    moreAdviserInSearchRadius: 'Es wurden {{foundCounter}} Berater im Umkreis von {{searchRadius}} km gefunden.',
    addressNotFound: 'Die eingegebene Adresse wurde nicht gefunden.',
    contactButton: 'Unverbindliche Beratungsanfrage',
    subtextWithPartner: 'Bitte geben Sie Ihre Kontaktdaten und Ihren Wunschtermin an. Alternativ haben Sie auch die Möglichkeit die Gen-Diät MetaCheck per Fernberatung von zuhause aus durchzuführen.<br/><a href="https://cogap.versacommerce.de/products/gendiaet-metacheck-fernberatung-metacheck-bequem-von-zu-hause-aus" target="blank">Hier</a> können Sie das Testset ganz einfach bestellen. Alternativ können Sie uns auch über das Kontaktformular kontaktieren.<br><strong class="partner-search-box__highlight-text">Sie erhalten nach Absenden des Formulars eine E-Mail (Double-Opt-In).<br>Bitte klicken Sie auf den dort enthaltenen Link zur Bestätigung Ihrer Anfrage.</strong>',
    subtextWithoutPartner: '<strong>Es wurde kein Berater in dem von Ihnen gesuchten Umkreis gefunden.</strong><br /><br />Bitte geben Sie Ihre Kontaktdaten ein. Alternativ haben Sie auch die Möglichkeit die Gen-Diät MetaCheck per Fernberatung von zuhause aus durchzuführen.<br/><a href="https://cogap.versacommerce.de/products/gendiaet-metacheck-fernberatung-metacheck-bequem-von-zu-hause-aus" target="blank">Hier</a> können Sie das Testset ganz einfach bestellen. Alternativ können Sie uns auch über das Kontaktformular kontaktieren.<br><strong class="partner-search-box__highlight-text">Sie erhalten nach Absenden des Formulars eine E-Mail (Double-Opt-In).<br>Bitte klicken Sie auf den dort enthaltenen Link zur Bestätigung Ihrer Anfrage.</strong>'
};

partnerSearchApp.templates = {};
partnerSearchApp.map = null;
partnerSearchApp.infoWindow = null;
partnerSearchApp.contactFormHtml = null;

$(function () {

    var ignorableKeyCodes = [8, 13, 16, 18, 17, 33, 34, 35, 36, 37, 39, 45, 46];

    // -- EVENT HANDLER --
    $(document).on('keyup', '#start-address', function (e) {

        if (e.keyCode == 13) {
            partnerSearchApp.searchInRadius();
        }

        if ($(this).val().length >= 2) {
            $('#search-button')
                .removeAttr('disabled')
                .removeClass('partner-search-box__search-button--disabled');
        }
        else {
            $('#search-button')
                .attr('disabled', 'disabled')
                .addClass('partner-search-box__search-button--disabled');
        }
    });

    $(document).on('click', '#search-button', function () {

        partnerSearchApp.initialize();
        partnerSearchApp.searchInRadius();
    });

    $(document).on('click', '.contact-button', function () {
        partnerSearchApp.openContactForm(
            $(this).attr('data-partner-id'),
            $(this).attr('data-partner-name')
        );
    });

    $(document).on('click', '#contact-form-agree-terms, #contact-form-agree-privacy-policy', function () {

        partnerSearchApp.clickAgreements();
    });

    $(document).on('click', '#contact-form-submit-button', function () {
        partnerSearchApp.submitContactForm();
    });

    $(document).on('click', '#close-contact-form-button', function () {

        partnerSearchApp.closeContactForm();
    });

    // -- SANITIZE --
    $(document).on('#contact-form-firstname, #contact-form-lastname', 'keyup', function (e) {

        if ($.inArray(e.which, ignorableKeyCodes) === -1) {

            $(this).val($.sanitizeName($(this).val()));
        }
    });

    $(document).on('#contact-form-phone', 'keyup', function (e) {

        if ($.inArray(e.which, ignorableKeyCodes) === -1) {

            $(this).val($.sanitizePhoneNumber($(this).val()));
        }
    });

    $(document).on('#contact-form-email', 'keyup', function (e) {

        if ($.inArray(e.which, ignorableKeyCodes) === -1) {

            $(this).val($.sanitizeEmailaddress($(this).val()));
        }
    });

    // -- BOOTSTRAP --
    partnerSearchApp.getDeviceType();
    partnerSearchApp.generateLegend();
    partnerSearchApp.initialize();
    partnerSearchApp.setUndefinedLatLng();
    partnerSearchApp.loadTemplates(function () {
        partnerSearchApp.showAll();
        partnerSearchApp.checkForDirectSearch();
    });
});

// -- CONTACT FORM --
partnerSearchApp.closeContactForm = function () {

    $.fancybox.close();
};

partnerSearchApp.openContactForm = function (partnerId, partnerName) {

    var contactForm = $(partnerSearchApp.templates.contactForm).clone();

    var jqContactFormHtml = $('<div/>')
        .append(contactForm);

    if (partnerId > 0) {
        jqContactFormHtml
            .find('#subtext')
            .append(partnerSearchApp.texts.subtextWithPartner);
        jqContactFormHtml
            .find('#contact-form')
            .attr('data-partner-id', partnerId);
        jqContactFormHtml
            .find('#contact-dialog-partner-name')
            .text(partnerName);
    }
    else {
        jqContactFormHtml
            .find('#subtext')
            .append(partnerSearchApp.texts.subtextWithoutPartner);
    }

    $('#contact-form-submit-button').show();
    $('#contact-form-submit-wait').hide();

    $.fancybox(jqContactFormHtml.html(), {
        maxWidth: 600,
        maxHeight: 700,
        fitToView: true,
        width: '70%',
        height: '70%',
        autoSize: true,
        closeClick: false,
        openEffect: 'fade',
        closeEffect: 'fade'
    });
};

partnerSearchApp.clickAgreements = function () {

    if ($('#contact-form-agree-terms').is(":checked") &&
        $('#contact-form-agree-privacy-policy').is(":checked")) {

        $('#contact-form-submit-button')
            .removeClass('partner-search-box__contact-submit-button--disabled')
            .removeProp('disabled')
            .removeAttr('disabled');
    }
    else {
        $('#contact-form-submit-button')
            .addClass('partner-search-box__contact-submit-button--disabled')
            .prop('disabled', 'disabled')
            .attr('disabled', 'disabled');
    }
};

partnerSearchApp.submitContactForm = function () {

    var searchAddress = $('#start-address').val();
    var searchRadius = $('#search-radius').val();

    var errorMessages = [];
    $('#error-messages-contact-form').empty();

    var partnerId = $('#contact-form').attr('data-partner-id');

    var gender = $('#contact-form-gender').find(":selected").val();

    if (gender !== 'f' && gender !== 'm') {
        errorMessages.push('Anrede fehlerhaft.');
    }

    var firstname = $('#contact-form-firstname').val();
    if (firstname.length <= 2) {
        errorMessages.push('Vorname fehlerhaft. Mind. 3 Zeichen.');
    }

    var lastname = $('#contact-form-lastname').val();
    if (lastname.length <= 2) {
        errorMessages.push('Nachname fehlerhaft. Mind. 3 Zeichen.');
    }

    var phone = $('#contact-form-phone').val();
    if (phone.length < 7) {
        errorMessages.push('Telefonnummer fehlerhaft. Mind. 7 Zeichen.');
    }

    var email = $('#contact-form-email').val();
    var emailReenter = $('#contact-form-email-reenter').val();

    if (!$.isEmailValid(email)) {
        errorMessages.push('E-Mail-Adresse fehlerhaft.');
    }

    if (email !== emailReenter) {
        errorMessages.push('Wiederholung der E-Mail-Adresse fehlerhaft.');
    }

    var message = $('#contact-form-message').val();

    if (errorMessages.length > 0) {
        $.each(errorMessages, function (index, item) {
            $('#error-messages-contact-form')
                .append($('<li/>')
                    .addClass('partner-search-box__contact-form-error')
                    .append(item));
        });
        return;
    }

    $('#contact-form-submit-button').hide();
    $('#contact-form-submit-wait').show();

    var hasAgreedForNewsletter = !!$('#contact-form-agree-newsletter').is(":checked");

    var postData = {
        partnerId: partnerId || -1,
        gender: gender,
        firstname: firstname,
        lastname: lastname,
        phone: phone,
        email: email,
        message: message,
        searchAddress: searchAddress,
        searchRadius: searchRadius,
        hasAgreedForNewsletter: hasAgreedForNewsletter
    };

    $.ajax({
        type: "POST",
        url: "/api/submit-partner-search-contact-request",
        data: postData,
        dataType: "json"
    })
        .success(function (jsonResponse) {

            if (jsonResponse.result === 'success') {

                $('#form-wrapper').slideUp(function () {
                    $('#contact-request-number').append(jsonResponse.no);
                    $('#success-wrapper').slideDown();
                });
            }
        });
};

// -- HELPER --
partnerSearchApp.getDeviceType = function () {
    partnerSearchApp.deviceType = $('#partner-search-box').data('device-type');
}

partnerSearchApp.loadTemplates = function (callback) {

    var loadMarker = function (callback) {
        $.ajax({
            url: '/templates/marker-template.html',
            type: "GET",
            dataType: "html",
            success: function (content) {
                partnerSearchApp.templates.marker = content;
                callback();
            }
        });
    };

    var loadPartnerRow = function (callback) {
        $.ajax({
            url: '/templates/partner-row-template.html',
            type: "GET",
            dataType: "html",
            success: function (content) {
                partnerSearchApp.templates.partnerRow = content;
                callback();
            }
        });
    };

    var loadContactForm = function (callback) {
        $.ajax({
            url: '/templates/contact-form-template.html',
            type: "GET",
            dataType: "html",
            success: function (content) {
                partnerSearchApp.templates.contactForm = content;
                callback();
            }
        });
    };

    // Load all
    loadMarker(function () {
        loadPartnerRow(function () {
            loadContactForm(function () {
                callback();
            });
        });
    });
};

partnerSearchApp.checkForDirectSearch = function () {

    if ($('#start-address').val().length >= 2) {
        $('#search-button')
            .removeClass('partner-search-box__search-button--disabled');
        partnerSearchApp.searchInRadius();

        if (partnerSearchApp.deviceType !== 'phone') {
            setTimeout(function () {
                $('html, body').animate({
                    scrollTop: $("#partner-search-box").offset().top
                }, 2000);
            }, 1000);
        }
    }
    else {
        $('#search-button')
            .addClass('partner-search-box__search-button--disabled');
    }
};

// -- MAPS --

partnerSearchApp.generateLegend = function () {

    $.ajax({
        type: "POST",
        url: "/api/get-all-categories",
        dataType: "json"
    })
        .success(function (jsonResponse) {

            var legend = $('<div />')

            $.each(jsonResponse, function () {

                var category = this;

                var legendMarkerColumn = $('<div />')
                    .addClass('partner-search-box__legend-item');
                var legendMarker = $('<img/>')
                    .addClass('partner-search-box__legend-marker-icon')
                    .attr('src', category.marker_icon);

                var legendTitleColumn = $('<span/>').text(category.title);

                legendMarkerColumn.append(legendMarker);
                legendMarkerColumn.append(legendTitleColumn);

                legend.append(legendMarkerColumn);
            });

            $('#legend-line').append(legend);
        });
};


partnerSearchApp.showAll = function () {

    $('#partner-box').hide();

    $('.partner-result-column').each(function () {
        $(this).remove();
    });

    $.ajax({
        type: "POST",
        url: "/api/get-all-partners-with-categories",
        dataType: "json"
    })
        .success(function (jsonResponse) {

            var geocoder = new google.maps.Geocoder();

            $.each(jsonResponse, function () {

                var partner = this;

                var position = new google.maps.LatLng(
                    partner.lat,
                    partner.lng
                );

                var marker = new google.maps.Marker({
                    map: partnerSearchApp.map,
                    position: position,
                    icon: partner.marker_icon
                });

                var markerText = $(partnerSearchApp.templates.marker).clone();
                markerText.css('display', 'block');
                markerText.find(".partner-name").prepend(partner.name);
                markerText.find(".category-name").prepend(partner.title);
                markerText.find(".address").prepend(partner.address);

                if (typeof partner.phone === 'string' && partner.phone.length > 2) {
                    markerText.find(".phone").prepend(partner.phone);
                }
                else {
                    markerText.find(".phone").remove();
                }

                if (typeof partner.email === 'string' && partner.email.length > 2) {
                    partner.email = partner.email.replace('(at)', '@');
                    markerText.find(".email").attr("href", "mailto:" + partner.email).prepend(partner.email.length <= 25 ? partner.email : partner.email.substr(0, 25) + '...');
                }
                else {
                    markerText.find(".email").remove();
                }

                if (typeof partner.homepage === 'string' && partner.homepage.length > 2) {
                    markerText.find(".homepage").attr("href", "http://" + partner.homepage).prepend(partner.homepage.length <= 25 ? partner.homepage : partner.homepage.substr(0, 25) + '...');
                }
                else {
                    markerText.find(".homepage").remove();
                }

                markerText.find(".contact-button")
                    .prepend(partnerSearchApp.texts.contactButton)
                    .attr('data-partner-id', partner.id)
                    .attr('data-partner-name', partner.name);

                google.maps.event.addListener(marker, 'click', function () {
                    var scrollTopElement = $("tr[data-partner-id=" + partner.id + "]");

                    if (scrollTopElement.length !== 1) {
                        return;
                    }

                    $('html, body').animate({
                        scrollTop: $(scrollTopElement).offset().top - 120
                    }, 1500, 'swing', function () {
                        var scrollTopElementColumns = $(scrollTopElement).find('td');

                        scrollTopElementColumns.addClass('partner-search-box__partner-result-col--glow');
                    });
                });
            });
        });
};

partnerSearchApp.searchInRadius = function () {

    $('#partner-box').hide();

    $('.partner-result-column').each(function () {
        $(this).remove();
    });

    $('#error-message').text('');

    $('#search-button').attr("disabled", "true");
    $('#search-button').val("Bitte warten");


    var searchRadius = $('#search-radius').val();
    var searchAddress = $('#start-address').val();
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode(
        {
            address: searchAddress
        },
        function (results, status) {

            if (status == google.maps.GeocoderStatus.OK) {

                $.ajax({
                    type: "POST",
                    url: "/api/get-all-partners-with-categories",
                    dataType: "json"
                })
                    .success(function (jsonResponse) {

                        var bounds = new google.maps.LatLngBounds();
                        var startPosition = results[0].geometry.location;
                        var foundCounter = 0;
                        var evenOddCounter = 0;

                        $('#partner-in-radius-table')
                            .empty();

                        // Sort by id
                        jsonResponse.sort(function (a, b) {
                            return a.id - b.id;
                        });

                        // Sort by highest prio
                        jsonResponse.sort(function (a, b) {
                            return b.prio - a.prio;
                        });

                        $.each(jsonResponse, function () {

                            var partner = this;

                            var destinationPosition = new google.maps.LatLng(
                                partner.lat,
                                partner.lng
                            );

                            var distance = google.maps.geometry.spherical.computeDistanceBetween(
                                destinationPosition,
                                startPosition
                            );

                            if (distance < searchRadius) {

                                var marker = new google.maps.Marker({
                                    map: partnerSearchApp.map,
                                    position: destinationPosition,
                                    icon: partner.marker_icon
                                });

                                if (partnerSearchApp.deviceType === 'desktop') {

                                    var markerText = $(partnerSearchApp.templates.marker).clone();
                                    markerText.find(".partner-name").prepend(partner.name);
                                    markerText.find(".category-name").prepend(partner.title);
                                    markerText.find(".address").prepend(partner.address);

                                    if (typeof partner.phone === 'string' && partner.phone.length > 2) {
                                        markerText.find(".phone").prepend(partner.phone);
                                    }
                                    else {
                                        markerText.find(".phone").remove();
                                    }

                                    if (typeof partner.email === 'string' && partner.email.length > 2) {
                                        partner.email = partner.email.replace('(at)', '@');
                                        markerText.find(".email").attr("href", "mailto:" + partner.email).prepend(partner.email.length <= 25 ? partner.email : partner.email.substr(0, 25) + '...');
                                    }
                                    else {
                                        markerText.find(".email").remove();
                                    }

                                    if (typeof partner.homepage === 'string' && partner.homepage.length > 2) {
                                        markerText.find(".homepage").attr("href", "http://" + partner.homepage).prepend(partner.homepage.length <= 25 ? partner.homepage : partner.homepage.substr(0, 25) + '...');
                                    }
                                    else {
                                        markerText.find(".homepage").remove();
                                    }

                                    markerText.find(".contact-button")
                                        .prepend(partnerSearchApp.texts.contactButton)
                                        .attr('data-partner-id', partner.id)
                                        .attr('data-partner-name', partner.name);

                                    google.maps.event.addListener(marker, 'click', function () {
                                        partnerSearchApp.infoWindow.setContent(markerText.html());
                                        partnerSearchApp.infoWindow.open(partnerSearchApp.map, marker);
                                    });
                                }
                                else {
                                    google.maps.event.addListener(marker, 'click', function () {
                                        var scrollTopElement = $("tr[data-partner-id=" + partner.id + "]");

                                        if (scrollTopElement.length !== 1) {
                                            return;
                                        }

                                        $('html, body').animate({
                                            scrollTop: $(scrollTopElement).offset().top - 100
                                        }, 1500, 'swing', function () {
                                            var scrollTopElementColumns = $(scrollTopElement).find('td');

                                            scrollTopElementColumns.addClass('partner-search-box__partner-result-col--glow');

                                            setTimeout(function () {
                                                scrollTopElementColumns.removeClass('partner-search-box__partner-result-col--glow');
                                            }, 5000)
                                        });
                                    });
                                }

                                var partnerRow = $(partnerSearchApp.templates.partnerRow).clone();
                                partnerRow.attr('data-partner-id', partner.id);
                                partnerRow.find('td').addClass(evenOddCounter % 2 ? 'even' : 'odd');
                                partnerRow.find(".partner-name").prepend(partner.name);
                                partnerRow.find(".category-name").prepend(partner.title);
                                partnerRow.find(".address").prepend(partner.address);

                                if (typeof partner.phone === 'string' && partner.phone.length > 2) {
                                    partnerRow.find(".phone").prepend(partner.phone);
                                }
                                else {
                                    partnerRow.find(".phone").remove();
                                }

                                if (typeof partner.email === 'string' && partner.email.length > 2) {
                                    partner.email = partner.email.replace('(at)', '@');
                                    partnerRow.find(".email").attr("href", "mailto:" + partner.email).prepend(partner.email.length <= 25 ? partner.email : partner.email.substr(0, 25) + '...');
                                }
                                else {
                                    partnerRow.find(".email").remove();
                                }

                                if (typeof partner.homepage === 'string' && partner.homepage.length > 2) {
                                    partnerRow.find(".homepage").attr("href", "http://" + partner.homepage).prepend(partner.homepage.length <= 25 ? partner.homepage : partner.homepage.substr(0, 25) + '...');
                                }
                                else {
                                    partnerRow.find(".homepage").remove();
                                }

                                partnerRow.find(".contact-button")
                                    .prepend(partnerSearchApp.texts.contactButton)
                                    .attr('data-partner-id', partner.id)
                                    .attr('data-partner-name', partner.name);

                                $('#partner-in-radius-table')
                                    .append(partnerRow)
                                    .append('<tr><td colspan="3"><br /></td></tr>');

                                bounds.extend(destinationPosition);
                                foundCounter++;
                                evenOddCounter++;
                            }
                        });

                        $('#map-wrapper').css('display', 'block');
                        $('#fake-map').css('display', 'none');
                        google.maps.event.trigger(partnerSearchApp.map, 'resize');
                        $('#distance').empty();

                        switch (foundCounter) {
                            case 0:
                                partnerSearchApp.openContactForm(
                                    -1,
                                    ''
                                );
                                break;
                            case 1:
                                partnerSearchApp.map.fitBounds(bounds);
                                partnerSearchApp.map.setZoom(7);
                                $('#distance').html(partnerSearchApp.texts.oneAdviserInSearchRadius.replace("{{searchRadius}}", Math.floor(searchRadius / 1000)));
                                $('#partner-result-box').show();
                                break;
                            default:
                                partnerSearchApp.map.fitBounds(bounds);
                                $('#distance').html(partnerSearchApp.texts.moreAdviserInSearchRadius.replace("{{foundCounter}}", foundCounter).replace("{{searchRadius}}", Math.floor(searchRadius / 1000)));
                                $('#partner-result-box').show();
                                break;
                        }
                    });
            }
            else {

                $('#error-message').html(partnerSearchApp.texts.addressNotFound);
            }

            setTimeout("$('#search-button').val('Suchen')", 1500);
            setTimeout("$('#search-button').removeAttr('disabled')", 1500);
        });
};


partnerSearchApp.setUndefinedLatLng = function () {

    $.ajax({
        type: "POST",
        url: "/api/get-all-partners-for-geocoding",
        dataType: "json"
    })
        .success(function (jsonResponse) {

            var geocoder = new google.maps.Geocoder();

            $.each(jsonResponse, function () {

                var partner = this;

                geocoder.geocode(
                    {
                        address: partner.address
                    },
                    function (results, status) {

                        if (status == google.maps.GeocoderStatus.OK) {

                            var latlng = results[0].geometry.location.toString();
                            var endPosition = latlng.indexOf(")");
                            var latlng = latlng.substr(1, endPosition - 1);

                            console.log(partner);

                            $.ajax({
                                type: "POST",
                                url: "/api/update-geocoding",
                                data: {
                                    partnerId: partner.id,
                                    latlng: latlng
                                },
                                dataType: "json"
                            })
                                .fail(function (error) {

                                    console.warn(JSON.stringify(error));
                                    alert('Unser Server ist zur Zeit ausgelastet. Bitte probieren Sie es in ein paar Minuten erneut.');
                                });
                        }
                    }
                );

            });
        })
        .fail(function (error) {

            console.warn(JSON.stringify(error));
            alert('Unser Server ist zur Zeit ausgelastet. Bitte probieren Sie es in ein paar Minuten erneut.');
        });
};

partnerSearchApp.initialize = function () {

    var position = new google.maps.LatLng(51.095649, 10.270549);

    var myOptions = {
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: position
    };

    partnerSearchApp.map = new google.maps.Map(
        $('#map-canvas').get(0),
        myOptions
    );

    partnerSearchApp.infoWindow = new google.maps.InfoWindow();
};
