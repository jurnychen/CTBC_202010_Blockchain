$(function() {
    $('.nav-list li').click(function() {
        $(this).addClass('active').siblings('.active').removeClass('active');
    })

    let _step1 = 0;
    let _step2 = 0;
    let _step3 = 0;


    $('.step-item-list li').click(function() {
        let _dataValue = $(this).attr('data-value');
        let _pIndex = $(this).parents('.step-item').index();
        let _pLength = $(this).parents('.step-group').children('.step-item').length - 1;


        if (_pIndex < _pLength) {
            // 跳到下一個頁簽
            $('.issue-step .step-dot li').eq(_pIndex + 1).click();
            return false;
        }
    })
    $('.issue-step .step-dot li').click(function() {
        let _dotIndex = $(this).index();
        changeStep(_dotIndex);
        changeStepDot(_dotIndex);
    })

    function changeStep(st) {
        $('.issue-step .step-item')
            .removeClass('active');
        $('.issue-step .step-item')
            .eq(st)
            .addClass('active')
    }

    function changeStepDot(st) {
        $('.issue-step .step-dot li')
            .eq(st)
            .addClass('active')
            .prevAll()
            .removeClass('active')
            .addClass('visited')
            .end()
            .nextAll()
            .removeClass('active visited');
    }

    $('.step1 li').click(function() {
        _step1 = $(this).attr('data-value');
        // console.log(_step1);
    })

    // 首頁問券，第三步驟結果顯示判斷
    $('.step3 li').click(function() {
        _step3 = $(this).attr('data-value');
        // console.log(_step3);
        let i = '' + _step1 + _step3;
        let $ir = '';
        if (i >= 11 && i <= 17) {
            $ir = '.ir-1';
            irShow($ir)
        }
        if (i >= 21 && i <= 23) {
            $ir = '.ir-2';
            irShow($ir)
        }
        if (i >= 24 && i <= 27 || i >= 41 && i <= 47 || i >= 51 && i <= 57 || i >= 71 && i <= 77) {
            $ir = '.ir-3';
            irShow($ir)
        }
        if (i >= 61 && i <= 67) {
            $ir = '.ir-4';
            irShow($ir)
        }
        if (i >= 31 && i <= 37 || i >= 81 && i <= 87) {
            $ir = '.ir-5';
            irShow($ir);
        }
        return false;
    })

    function irShow($ir) {
        $('.issue-step').addClass('hide');
        $('.issue .mv').addClass('hide');
        $($ir).addClass('show');
        irHide($ir);
    }

    function irHide($ir) {
        $('.issue-result .main-more .btn-basic').click(function() {
            $('.issue-step').removeClass('hide');
            $('.issue .mv').removeClass('hide');
            $($ir).removeClass('show');
        })
        let st = 0;
        changeStep(st);
        changeStepDot(st);
    }


    // SVG 圖示撥放控制
    function svgAni() {
        if ($('.slider-advantage').length != 0) {
            let icon_top = $('.slider-advantage').offset().top;
            let winTop = 0;
            let winH = $(window).height();
            $(window).scroll(function() {
                winTop = $(this).scrollTop();
                icon_top = $('.slider-advantage').offset().top;
                // console.log(winTop);
                // console.log(icon_top);
                if (winTop >= icon_top - winH / 3 * 2) {
                    $('.svg-icon').addClass('play').removeClass('paused');
                }
            })
        }
    }
    svgAni();


    function newsListPagi() {
        let _pice = 8; //預設每頁顯示數量
        let _pages = 0; //預設頁數為0
        let _nowPageIndex = 1; //目前頁面索引
        let _liHTML = '';
        let _prevHTML = '<li class="prev"><a href="javascript:;">«</a></li>'
        let _nextHTML = '<li class="next"><a href="javascript:;">»</a></li>'
        let showClass = 'p' + 1;
        if ($('.news-list').length) {
            let _contentLength = $('.content-group .content').length;
            for (let i = 0; i < _contentLength; i++) {
                _liHTML = '';
                let _itemLength = $('.content-group .content')
                    .eq(i)
                    .find('.item')
                    .length;
                // console.log(i);
                // console.log(itemLength);

                //判斷item數量，若為0則頁數等於商數
                if (_itemLength % _pice === 0) {
                    _pages = parseInt(_itemLength / 8);
                    // console.log('頁數剛好是' + _pages + '頁');
                } else {
                    //判斷item數量，不為0則頁數等於商數+1
                    _pages = parseInt(_itemLength / 8 + 1);
                    // console.log('頁數是' + _pages + '頁，最後一頁不滿8個項目');
                }
                //產出頁碼HTML
                for (let j = 0; j < _pages; j++) {
                    _liHTML += '<li><a href="javascript:;">' + (j + 1) + '</a></li>'
                        // console.log(j);
                }
                _liHTML = _prevHTML + _liHTML + _nextHTML;
                console.log(_liHTML);
                // console.log(i);
                //分頁HTML寫入
                $('.news-list .content-group .content')
                    .eq(i).find('.pagination')
                    .html(_liHTML);
                $('.news-list .content-group .content')
                    .eq(i).addClass('p1');
                $('.news-list .content-group .content')
                    .eq(i).find('.pagination li:nth-child(2)').addClass('active');
            }
            // 頁碼按鈕按了的動作
            $('.news-list .content-group .content .pagination li:nth-child(n+2):nth-last-child(n+2)').click(function() {
                    _nowPageIndex = $(this).index();
                    showClass = 'p' + _nowPageIndex;
                    $(this).addClass('active').siblings('.active').removeClass('active');
                    $(this).parents('.content').removeClass('p1 p2 p3 p4').addClass(showClass);
                    // console.log(_nowPageIndex);
                })
                // 上一頁的動作
            $('.news-list .content-group .content .pagination .prev').click(function() {
                _nowPageIndex = $(this).siblings('.active').index();
                if (_nowPageIndex > 1) {
                    $(this).siblings('.active').prev().click();
                }
            })
            $('.news-list .content-group .content .pagination .next').click(function() {
                _nowPageIndex = $(this).siblings('.active').index();
                _myIndex = $(this).index();
                // console.log(_myIndex);
                if (_nowPageIndex < _myIndex - 1) {
                    $(this).siblings('.active').next().click();
                }
            })

        }
    }
    newsListPagi();


    // 訂閱成功視窗-了解按鈕
    function showSubscribeSuccessBox() {
        if ($('.box-success').length) {
            $('.box-success').remove();
        }
        $('.subscribe form').after('<div class="box-success"><p>您已經完成訂閱</p><button class="btn-success-close">了解</button></div>');
    }

    $('.subscribe .btn-subscribe').on('click', function(e) {
        e.preventDefault();
        showSubscribeSuccessBox();
    });

    $('.subscribe').on('click', '.box-success .btn-success-close', function(e) {
        e.preventDefault();
        $('.box-success').fadeOut();
    });
})