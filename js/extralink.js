var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

// Handle open external URL
document.addEventListener('click', function (e) {
    handleExtUrl(e);
}, false);

var handleExtUrl = function (e) {

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
        var whitelistUrl = [{"url":"/content/twrbo/zh_tw/inv_index/inv_fund/inv_fund_search.html?prodNo"},{"url":"/content/twrbo/zh_tw/inv_index/inv_investmentproducts/inv_investmentproducts_SNoverview/inv_investmentproducts_SNsearch/inv_investmentproducts_SNsearch_SNdetail.html?prodNo"},{"url":"/content/twrbo/zh_tw/inv_index/inv_etf/inv_etf_search.html?prodNo"}];
        if (whitelistUrl != null) {
            for (var i in whitelistUrl) {
                if (hasString(href, whitelistUrl[i]['url'])) {
                    isOpenBlank = true;
                }
            }
        }

        // check if the link is in DAM
        if (hasString(href, '/content/dam/twrbo/')) {
            isOpenBlank = true;
        }

        if (isOpenBlank) {
            window.open(href);
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
        var whitelistUrl = [{"url":"mailto"},{"url":"/content/dam/ctbc-ib/zh_rb/structural-products/sn-products/"},{"url":"ctbcbank.com"},{"url":"ctbc-mortgage.com"},{"url":"ctbcbank.moneydj.com"},{"url":"www.ctbc-retirement.com/support"},{"url":"ctbcbank.talk.tw"},{"url":"ecorp.chinatrust.com.tw"},{"url":"www.ctbcholding.com"},{"url":"www.ctbcfoundation.org"},{"url":"ecash.ctbcbank.com"},{"url":"corporate.ctbcbank.com"},{"url":"m.ctbcbank.com"},{"url":"ctbc.tw"}];
        if (whitelistUrl != null) {
            for (var i in whitelistUrl) {
                if (hasString(href, whitelistUrl[i]['url'])) {
                    isSkipLightBox = true;
                }
            }
        }

        if (isSkipLightBox) {
            window.open(href);
        } else {
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