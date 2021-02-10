var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

// Handle open external URL
document.addEventListener('click', function (e) {
    handleExtUrl(e);
}, false);

var handleExtUrl = function (e) {
    extralinkRemovePopWindows();

    var href = '';
    if ($(e.target).closest('a') != null) {
        href = $(e.target).closest('a').prop('href');
    }

    if (href && href != '') {

        // check if the link is inside IB
        if (e != null && isInsideIB(e)) {
            return;
        }

        // check if the link is anchor

        else if (href === (window.location.origin + '/#')) {
            e.preventDefault();
            return;
        }

        // check if the link is email
        else if (hasString(href, 'mailto:')) {
            return;
        }

        // check if the link is tel
        else if (hasString(href, 'tel:')) {
            return;
        }

        // check if the link is javascript:;
        else if (hasString(href, 'javascript:;')) {
            return;
        }

        e.preventDefault();

        var isSkipLeaveMessage = true;

        // check if the IB has showLeaveMessage
        if (typeof (showLeaveMessage) != 'undefined') {
            if (showLeaveMessage) {
                isSkipLeaveMessage = false;
            }
        }

        // check if level4 menu disable show leave message
        if ($(e.target).closest('a').attr('showleavemessage') == 'false') {
            isSkipLeaveMessage = true;
        }

        if (!isSkipLeaveMessage) {
            $("#leavemessage a").attr("exturl", href);
            
            handleOpenLeaveMessage(function (e) {
                var href = $(e.target).attr("exturl");

                // callback, clear showLeaveMessage status
                showLeaveMessage = false;

                // logout session
                doSimpleIdentityLogout(function () {
                    $.fancybox.close();
                    handleOpenLightBox(href, e);

                });
            });
        } else {
            handleOpenLightBox(href, e);
        }
    }
}

var handleOpenLeaveMessage = function (callback) {
    $.fancybox.open({
        src: '#leavemessage',
        type: 'inline',
        opts: {
            beforeClose: function (instance, current) {
                // solve safari scrolling issue after close fancybox
                if (isSafari) {
                    $('body').css("height", 10000);
                }
            },
            afterClose: function (instance, current) {
                // force close all fancybox mask
                $('.fancybox-container').hide();

                // solve safari scrolling issue after close fancybox
                if (isSafari) {
                    $('body').css("height", "");
                }
            }
        }
    });
    toggleLeaveMessage = callback;
}

var handleOpenLightBox = function (href, e) {
    // check if the link is in CBK
    if (isInsideCBK(href)) {
        top.window.location.href = href;

        // check if the link is in AEM
    } else if (isInsideAEM(href)) {
        // check if postfix has .html
        if (!hasString(href, '.html') && !hasString(href, '.pdf')) {
            href = href + '.html';
        }

        // check if the link is in external link list
        var isOpenBlank = false;
        var whitelistUrl = [{"url":"www.tentenplus.com.tw"},{"url":"ctbcbank.com"}];
        if (whitelistUrl != null) {
            for (var i in whitelistUrl) {
                if (hasString(href, whitelistUrl[i]['url'])) {
                    console.log('this');
                    isOpenBlank = false;

                }
            }
        }

        // check if the link is in DAM
        if (hasString(href, '/content/dam/twrbo/')) {
            isOpenBlank = true;
        }

        if (isOpenBlank) {
            console.log('135');
            //window.open(href);
        } else {
            // check if the page is in iframe
            if (window.self != window.top && !(window.frameElement && window.frameElement.id == 'ContentFrame')) {
                href = href.replace("\/content\/twrbo\/", "/web/content/twrbo/");
            }
            window.location.href = href;
        }

        // check if the link is an ib link
    } else if (hasString(href, 'twrbc')) {

        // if the link is /twrbc-general/ot006/, open external url
        if (hasString(href, '\/twrbc-general\/ot006\/')) {
            window.open(href)
        } else {
            var taskId = href.split(location.origin)[1];
            console.log('開啟網銀交易，連結： ' + taskId);
            switchToIBByUrl(taskId);
        }
    } else {
        var isSkipLightBox = false;
        // check if the link is in external link list
        var whitelistUrl = [{"url":"localhost"},{"url":"www.tentenplus.com.tw"},{"url":"mailto"},{"url":"ctbcbank.com"}];
        if (whitelistUrl != null) {
            for (var i in whitelistUrl) {
                if (hasString(href, whitelistUrl[i]['url'])) {
                    isSkipLightBox = true;
                }
            }
        }

        if (isSkipLightBox) {
            //console.log('170');
            //window.open(href);
            window.location.href = href;
        } else {
            extralinkShowPopWindows();
            $("#outlink a:first-child").attr("exturl", href);
            $.fancybox.open({
                src: '#outlink',
                type: 'inline',
                opts: {
                    beforeClose: function (instance, current) {
                        // solve safari scrolling issue after close fancybox
                        if (isSafari) {
                            $('body').css("height", 10000);
                        }
                    },
                    afterClose: function (instance, current) {
                        // force close all fancybox mask
                        $('.fancybox-container').hide();

                        // solve safari scrolling issue after close fancybox
                        if (isSafari) {
                            $('body').css("height", "");
                        }
                    }
                }
            });
        }
    }
}


// click button on external link light box
var toggleExternalLink = function (e) {
    var exturl = $(e.target).attr("exturl");
    if (exturl != null) {
        window.open(exturl);
        closeFancybox();
    }
}

// close all the fancyboxs opened
var closeFancybox = function (e) {
    // force close all fancybox mask
    $.fancybox.close();

    // solve safari scrolling issue after close fancybox
    if (isSafari) {
        $('body').css("height", "");
    }
}

// Menu L0 back to IB
var backToIB = function () {

    var isSkipLeaveMessage = true;

    // check if the IB has showLeaveMessage
    if (typeof (showLeaveMessage) != 'undefined') {
        if (showLeaveMessage) {
            isSkipLeaveMessage = false;
        }
    }

    if (!isSkipLeaveMessage) {
        handleOpenLeaveMessage(function (e) {

            // callback, clear showLeaveMessage status
            showLeaveMessage = false;

            // logout session
            doSimpleIdentityLogout(function (rsData) {
                $.fancybox.close();
                switchToIB(null, {
                    reload: true
                });
                return false;
            });
        });
    } else {
        switchToIB();
        return false;
    }
}

var isInsideCBK = function (href) {
    return hasString(href, '/content/twcbo/');
}

var isInsideIB = function (e) {
    return $(e.target).parents('app').length > 0 || $(e.target).attr('appopen');
}

var isInsideAEM = function (href) {
    return hasString(href, '/content/twrbo/') || hasString(href, window.location.origin + '/twrbo') ;
}

var hasString = function (content, key) {
    return content.indexOf(key) > -1;
}

function extralinkShowPopWindows() {
    $('body').append('<div id="outlink" class="extralink__popup extralink__popup--md">\n' +
        '        <div class="extralink__popup-title">確認訊息</div>\n' +
        '        <div class="extralink__popup-content" data-element="scrollbar">\n' +
        '            <p>您即將離開中國信託官網/網路銀行，請確認是否執行？</p>\n' +
        '        </div>\n' +
        '        <div class="extralink__popup-actions">\n' +
        '            <a exturl="" onclick="toggleExternalLink(event)" target="_blank" href="javascript:;" class="actions__btn actions__btn-primary">確認</a>\n' +
        '            <button onclick="closeFancybox()" class="actions__btn actions__btn-secondary">取消</button>\n' +
        '        </div>\n' +
        '    </div>');
}

function extralinkRemovePopWindows() {
    if ($('#outlink').length) {
        $('#outlink').remove();
    }
}