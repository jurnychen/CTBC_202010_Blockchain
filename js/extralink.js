let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

// Handle open external URL
document.addEventListener('click', function (e) {
    handleExtUrl(e);
}, false);

let handleExtUrl = function (e) {
    extralinkRemovePopWindows();

    let href = '', target = '';
    if ($(e.target).closest('a') != null) {
        href = $(e.target).closest('a').prop('href');
        target = $(e.target).closest('a').prop('target');
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

        // check if the link is javascript:; 並停止在瀏覽器預設開啟空白視窗
        else if (hasString(href, 'javascript:;')) {
            e.preventDefault();
            return;
        }

        e.preventDefault();

        let isSkipLeaveMessage = true;

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
                let href = $(e.target).attr("exturl");

                // callback, clear showLeaveMessage status
                showLeaveMessage = false;

                // logout session
                doSimpleIdentityLogout(function () {
                    $.fancybox.close();
                    handleOpenLightBox(href, target, e);

                });
            });
        } else {
            handleOpenLightBox(href, target, e);
        }
    }
}

let handleOpenLeaveMessage = function (callback) {
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

let handleOpenLightBox = function (href, target, e) {
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
        let isOpenBlank = false;
        let whitelistUrl = [{"url":"www.tentenplus.com.tw"},{"url":"ctbcbank.com"}];
        if (whitelistUrl != null) {
            for (let i in whitelistUrl) {
                if (hasString(href, whitelistUrl[i]['url'])) {
                    //console.log('this');
                    isOpenBlank = false;
                }
            }
        }

        // check if the link is in DAM
        if (hasString(href, '/content/dam/twrbo/')) {
            isOpenBlank = true;
        }

        if (isOpenBlank) {
            //console.log('line:139');
            window.open(href);
        } else {
            // check if the page is in iframe
            if (window.self != window.top && !(window.frameElement && window.frameElement.id == 'ContentFrame')) {
                href = href.replace("\/content\/twrbo\/", "/web/content/twrbo/");
            }
            //console.log('line:146');
            window.location.href = href;
        }

        // check if the link is an ib link
    } else if (hasString(href, 'twrbc')) {
        // if the link is /twrbc-general/ot006/, open external url
        if (hasString(href, '\/twrbc-general\/ot006\/')) {
            //console.log('line:155');
            window.open(href)
        } else {
            let taskId = href.split(location.origin)[1];
            //console.log('line:159,開啟網銀交易，連結： ' + taskId);
            switchToIBByUrl(taskId);
        }
    } else {
        let isSkipLightBox = false;
        // check if the link is in external link list
        let whitelistUrl = [{"url":"localhost"},{"url":"www.tentenplus.com.tw"},{"url":"mailto"},{"url":"ctbcbank.com"}];
        if (whitelistUrl != null) {
            for (let i in whitelistUrl) {
                if (hasString(href, whitelistUrl[i]['url'])) {
                    isSkipLightBox = true;
                }
            }
        }

        if (isSkipLightBox) {
            //console.log('line:175');
            if (target==='_blank') {
                window.open(href);
            } else {
                window.location.href = href;
            }
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
let toggleExternalLink = function (e) {
    let exturl = $(e.target).attr("exturl");
    if (exturl != null) {
        window.open(exturl);
        closeFancybox();
    }
}

// close all the fancyboxs opened
let closeFancybox = function (e) {
    // force close all fancybox mask
    $.fancybox.close();

    // solve safari scrolling issue after close fancybox
    if (isSafari) {
        $('body').css("height", "");
    }
}

// Menu L0 back to IB
let backToIB = function () {

    let isSkipLeaveMessage = true;

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

let isInsideCBK = function (href) {
    return hasString(href, '/content/twcbo/');
}

let isInsideIB = function (e) {
    return $(e.target).parents('app').length > 0 || $(e.target).attr('appopen');
}

let isInsideAEM = function (href) {
    return hasString(href, '/content/twrbo/') || hasString(href, window.location.origin + '/twrbo') ;
}

let hasString = function (content, key) {
    return content.indexOf(key) > -1;
}

function extralinkShowPopWindows() {
    $('body').append('<div id="outlink" class="extralink__popup extralink__popup--md">\n' +
        '        <div class="extralink__popup-title">確認訊息</div>\n' +
        '        <div class="extralink__popup-content" data-element="scrollbar">\n' +
        '            <p><span>您即將前往非中國信託之網頁</span><span class="visible-lg">，</span><span>請確認是否執行?</span></p>\n' +
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