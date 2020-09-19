/**
 * Project: CoGAP Website
 *
 * Copyright © MPM IT UG (haftungsbeschränkt)
 * http://www.mpm-it.com
 *
 * @author MPM IT <info@mpm-it.com>
 */

(function ($, undefined) {

    // Functions that need a selector
    // example: $('#div1').showSlidingInfo(....);
    $.fn.extend({

        showSlidingInfo: function (str, designClasses, showOptions, callback) {

            var slidingInfo = $(this),
                startDelay = 50,
                checkDelay = 500,
                closeImmediatly = false,
                showOptions = $.extend(showOptions, {});

            if (showOptions.showTime == undefined || showOptions.showTime <= 3000) showOptions.showTime = (function (inString) {
                var newString = inString.replace(/[^A-Z a-z$-]/g, '');

                return newString.length * 150;
            } (str));


            var suppressDoubleInfoInterval = setInterval(function () {

                // suppress double info
                if (slidingInfo.text() == str) {
                    clearInterval(suppressDoubleInfoInterval);
                    return slidingInfo;
                }

                if (slidingInfo.html() == undefined || $.trim(slidingInfo.html()) == '') {
                    if (typeof designClasses !== 'undefined' && typeof designClasses.slidingInfoBox === 'string') {
                        slidingInfo
                            .addClass(designClasses.slidingInfoBox);
                    }

                    var infoText = $('<p />')
                        .css('float', 'left')
                        .append(str);

                    if (typeof designClasses !== 'undefined' && typeof designClasses.infoText === 'string') {
                        infoText
                            .addClass(designClasses.infoText);
                    }

                    var closeButton = $('<input />')
                        .prop('type', 'button')
                        .css('float', 'right')
                        .prop('value', showOptions.buttonCloseText || unescape("Schlie%DFen"))
                        .bind('click', function () {

                            closeImmediatly = true;
                        });


                    if (typeof designClasses !== 'undefined' && typeof designClasses.closeButton === 'string') {
                        closeButton
                            .addClass(designClasses.closeButton);
                    }

                    var content = $('<div />')
                        .append(infoText)
                        .append(closeButton);

                    var marginLeft = ($('body').width() / 2) - 345;

                    slidingInfo
                        .css('margin-left', marginLeft + 'px')
                        .delay(startDelay)
                        .append(content)
                        .slideDown('slow');

                    var elapsedTime = 0;

                    var closeImmediatlyInterval = setInterval(function () {

                        if (closeImmediatly == true || elapsedTime >= showOptions.showTime) {

                            slidingInfo
                                .slideUp('slow', function () {

                                    slidingInfo.html('');
                                    if (callback) callback();
                                })

                            clearInterval(closeImmediatlyInterval);
                        }

                        if (elapsedTime % 1000 == 0) {

                            var remainingOpenTime = Math.round((showOptions.showTime - elapsedTime) / 1000);
                            var buttonTextRemainTime = (showOptions.buttonCloseText || unescape("Schlie%DFen")) + ' (' + remainingOpenTime + ')';
                            closeButton.prop('value', buttonTextRemainTime);
                        }

                        elapsedTime += 250;

                    }, 250);

                    clearInterval(suppressDoubleInfoInterval);
                }
            }, checkDelay);

            return slidingInfo;
        }
    });

    // Functions that don't need a selector
    // example: $.isValidEmailaddress(....);
    $.extend({

        sanitizeName: function (str) {

            var sanitizedString = ''

            if (str.length > 0) {

                var first = str.toLowerCase();
                var second = first.replace(RegExp("[^a-zA-Z\u00e4\u00fc\u00f6\u00df\u00fa\u00f9\u00fb\u00e1\u00e0\u00e2\u00f3\u00f2\u00f4. -]", 'g'), '');
                var third = second.replace(RegExp(" {2,}", 'g'), ' ');
                sanitizedString = third.replace(RegExp("^(\\w{0,1})|-(\\w{0,1})| (\\w{0,1})", 'g'), function (a) {

                    return (a != undefined ? a.toUpperCase() : '');
                });
            }

            return sanitizedString;
        },

        sanitizeCode: function (str) {

            var sanitizedString = ''

            if (str.length > 0) {

                sanitizedString = str.replace(RegExp('[^a-zA-Z0-9]', 'g'), '');
            }

            sanitizedString = sanitizedString.toUpperCase();

            return sanitizedString;
        },

        sanitizePhoneNumber: function (str) {

            var sanitizedString = ''

            if (str.length > 0) {

                var first = str.replace(RegExp('^\\+{1}', 'g'), '00');
                var second = first.replace(RegExp('^(0049){1}', 'g'), '0');
                sanitizedString = second.replace(RegExp('[^0-9]+', 'g'), '');
            }

            return sanitizedString;
        },

        sanitizeEmailaddress: function (str) {

            var sanitizedString = '';

            str = $.trim(str);

            if (str.indexOf('@') > 0) {

                var strsplit = str.split('@');

                var first1 = strsplit[0].toLowerCase();
                var second1 = first1.replace(RegExp('[^_a-z0-9!#$%&\\\'*+\-\/=?^_`.{|}~]'), '');
                sanitizedString = second1;

                var first2 = strsplit[1].toLowerCase();
                var second2 = first2.replace(RegExp('[^a-z0-9\.-]'), '');

                sanitizedString += '@' + second2;
            }
            else {

                var first = str.toLowerCase()
                var second = first.replace(RegExp('[^_a-z0-9!#$%&\\\'*+\-\/=?^_`.{|}~]'), '');
                sanitizedString = second;
            }


            return sanitizedString;
        },

        replaceLocation: function (newLocation) {

            location.replace(newLocation);
        },

        openNewWindow: function (destinationUrl, destinationWindowName, destinationWidth, destinationHeight, destinationToolbar, destinationDirectories, destinationStatus, destinationScrollbars, destinationResize, destinationMenubar, location) {

            var options = "toolbar=" + destinationToolbar + ",width=" + destinationWidth + ",height=" + destinationHeight + ",directories=" + destinationDirectories + ",status=" + destinationStatus + ",scrollbars=" + destinationScrollbars + ",resizable=" + destinationResize + ",menubar=" + destinationMenubar + ",location=" + location;
            return window.open(destinationUrl, destinationWindowName, options);
        },

        sanitizeSpamProtectedEmailaddress: function (emailaddress) {

            return emailaddress.replace('(-at-)', '@');
        },

        isEmailValid: function (email)
        {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },

        wordwrap: function (str, width, brk, cut) {
            brk = brk || '\n';
            width = width || 64;
            cut = cut || false;

            if (!str) { return str; }

            var regex = '.{1,' + width + '}(\\s|$)' + (cut ? '|.{' + width + '}|.+$' : '|\\S+?(\\s|$)');

            return str.match(RegExp(regex, 'g')).join(brk);
        },

        timestampToDate: function (timestamp) {
            var d = new Date(timestamp * 1000);

            var day = (d.getDate() < 10 ? '0' + d.getDate() : d.getDate());
            var month = (Number(d.getMonth() + 1) < 10 ? '0' + String(Number(d.getMonth() + 1)) : Number(d.getMonth() + 1));
            var year = d.getFullYear();

            return day + '.' + month + '.' + year;
        },

        twoDigits: function (number) {
            return (number < 10 ? "0" : "") + number.toString();
        },

        roundWith2decimalPlaces: function (x) {
            return (Math.round(x * 100) / 100).toString();
        },

        dateDiff: function (uts) {
            var ago = Math.abs(Math.floor(new Date().getTime() / 1000) - uts),
				label = ago == 1 ? "Sekunde" : "Sekunden";

            if (ago > 60) {
                ago = Math.floor(ago / 60);
                label = ago == 1 ? "Minute" : "Minuten";
            }

            if (ago > 60) {
                ago = (ago / 60).toFixed(0);
                label = ago == 1 ? "Stunde" : "Stunden";
            }

            if (ago > 24) {
                ago = (ago / 24).toFixed(0);
                label = ago == 1 ? "Tag" : "Tagen";
            }

            return ago + " " + label;
        },

        utf8encode: function (string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }

            return utftext;
        },

        utf8decode: function (str) {
            var string = "",
				i = 0,
				c = c1 = c2 = 0;

            while (i < str.length) {
                c = str.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if (c > 191 && c < 224) {
                    c2 = str.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = str.charCodeAt(i + 1);
                    c3 = str.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }

            return string;
        },

        base64encode: function (input) {
            var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

				output = "",
				chr1, chr2, chr3, enc1, enc2, enc3, enc4,
				i = 0;

            input = $.utf8encode(input);

            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
						keyStr.charAt(enc1) + keyStr.charAt(enc2) +
						keyStr.charAt(enc3) + keyStr.charAt(enc4);
            }

            return output;
        },

        base64decode: function (str) {
            var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

				output = "",
				chr1, chr2, chr3 = "",
				enc1, enc2, enc3, enc4 = "",
				i = 0,

				invalidMatch = /[^A-Za-z0-9\+\/\=]/g;

            str = str.replace(invalidMatch, "");

            do {
                enc1 = keyStr.indexOf(str.charAt(i++));
                enc2 = keyStr.indexOf(str.charAt(i++));
                enc3 = keyStr.indexOf(str.charAt(i++));
                enc4 = keyStr.indexOf(str.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }

                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < str.length);

            return $.utf8decode(unescape(output));
        },

        nl2br: function (str) {
            return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br />' + '$2');
        },

        getRandom: function (min, max) {
            if (min === null)
                min = 0;
            if (max === null)
                max = 1;
            return Math.floor(Math.random() * (max + 1)) + min;
        },

        animate: function (options, callback) {
            options = $.extend({
                step: function () { },
                form: 0,
                to: 1
            }, options);

            if (!options.duration) {
                options.duration = $.fx.speeds._default;
            }

            if (!options.easing || !$.isFunction($.easing[options.easing])) {
                options.easing = $.easing.swing;
            } else {
                options.easing = $.easing[options.easing];
            }

            var start = new Date().getTime(),
				diff = options.to - options.from,

				running = true,

				timerId = setInterval(function () {
				    var now = new Date().getTime();

				    options.step(options.easing(null, now - start, options.from, diff, options.duration));

				    if (now - start >= options.duration) {
				        options.step(options.to);

				        if ($.isFunction(callback)) {
				            callback();
				        }

				        running = false;
				        clearInterval(timerId);
				    }
				}, 13);

            return {
                stop: function () {
                    if (!running) {
                        return;
                    }

                    clearInterval(timerId);
                    if ($.isFunction(callback)) {
                        callback();
                    }
                }
            };
        }
    });

    $.extend($.event.special, {
        mousedownoutside: {
            add: function (handleObj) {
                var elem = this,
					handler = handleObj.handler;

                handleObj.handler = function (event) {
                    if ($(event.target).parents().andSelf().filter(elem).length == 0) {
                        return handler.apply(elem, arguments);
                    }
                };

                $("body").bind("mousedown." + handleObj.guid, handleObj.handler);
            },

            remove: function (handleObj) {
                $("body").unbind("." + handleObj.guid);
            },

            setup: $.noop,
            teardow: $.noop
        }
    });
} (jQuery));