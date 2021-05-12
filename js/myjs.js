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
            // $('.issue-step .step-dot li').eq(_pIndex + 1).click();
            changeStep(_pIndex + 1);
            changeStepDot(_pIndex + 1);
            return false;
        }
    })

    // 點擊dot，顯示對應的題目內容
    // $('.issue-step .step-dot li').click(function() {
    //     let _dotIndex = $(this).index();
    //     changeStep(_dotIndex);
    //     changeStepDot(_dotIndex);
    // })

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
    // 用問題一跟問題三的編號組合數值來當作查詢條件
    $('.step3 li').click(function() {
        _step3 = $(this).attr('data-value');
        // console.log(_step3);
        let i = '' + _step1 + _step3;
        let $ir = '';
        if (i >= 11 && i <= 17 || i >= 31 && i <= 37) {
            $ir = '.ir-1';
        }
        if (i >= 21 && i <= 23) {
            $ir = '.ir-2';
        }
        if (i >= 24 && i <= 27 || i >= 51 && i <= 57 || i >= 71 && i <= 77) {
            $ir = '.ir-3';
        }
        if (i >= 61 && i <= 67) {
            $ir = '.ir-4';
        }
        if (i >= 41 && i <= 47 || i >= 81 && i <= 87) {
            $ir = '.ir-5';
        }
        let st = 0;
        irShow($ir);// 顯示解決方案，關閉問題
        changeStep(st);// 重新設定問題到步驟1
        changeStepDot(st);// 重新設定問題到步驟1
        goIssueTop();//控制視窗捲軸位置
        return false;
    })
    // 顯示解決方案，關閉問題
    function irShow($ir) {
        $('.issue-step').addClass('hide');
        $('.issue .mv').addClass('hide');
        $($ir).addClass('show');
        irHide($ir);
    }
    // 解決方案關閉鈕作用
    function irHide($ir) {
        $('.issue-result .main-more .btn-basic').click(function() {
            $('.issue-step').removeClass('hide');
            $('.issue .mv').removeClass('hide');
            $($ir).removeClass('show');
            goIssueTop();
            return false;
        })
    }
    //控制手機捲軸位置
    function goIssueTop(xx){
        if( $(window).width() < 768 ){
            let xx = $('.issue-topic').offset().top;
            $('html,body').scrollTop(xx);
        }
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

    // 訂閱成功視窗-了解按鈕 檢核失敗
    function showSubscribeFailBox() {
        if ($('.box-success').length) {
            $('.box-success').remove();
        }
        $('.subscribe form').after('<div class="box-success"><p>請確認閱讀並同意個資運用聲明書</p><button class="btn-success-close">了解</button></div>');
    }

    // 訂閱成功視窗-了解按鈕 送出失敗
    function showSubscribeSendFailBox() {
         if ($('.box-success').length) {
             $('.box-success').remove();
         }
         $('.subscribe form').after('<div class="box-success"><p>請輸入您的聯絡郵件</p><button class="btn-success-close">了解</button></div>');
    }

    // 訂閱成功視窗-了解按鈕 送出失敗
        function showSubscribeValidatorFail() {
             if ($('.box-success').length) {
                 $('.box-success').remove();
             }
             $('.subscribe form').after('<div class="box-success"><p>您輸入的聯絡郵件格式有誤</p><button class="btn-success-close">了解</button></div>');
        }

    $('.subscribe .btn-subscribe').on('click', function(e) {
        let inputEmail = $('#subscribe-email').val();

        if(!$('#accept-subscribe').is(":checked")) {
            e.preventDefault();
            showSubscribeFailBox();
        }else if($('#subscribe-email').val()==""){
            e.preventDefault();
            showSubscribeSendFailBox();
        }else if(validateByReg('email', inputEmail) === false){
            //檢核E-mail須符合E-mail XXX@OOO格式
            e.preventDefault();
            showSubscribeValidatorFail();
        }else{
            subscribe();
            e.preventDefault();
            showSubscribeSuccessBox();
        }
    });

    function validateByReg(validField, validText) {
        let filter;
        if (validField === 'email'){
            // ^\w+：@ 之前必須以一個以上的文字&數字開頭，例如 abc
            // ((-\w+)：@ 之前可以出現 1 個以上的文字、數字或「-」的組合，例如 -abc-
            // (\.\w+))：@ 之前可以出現 1 個以上的文字、數字或「.」的組合，例如 .abc.
            // ((-\w+)|(\.\w+))*：以上兩個規則以 or 的關係出現，並且出現 0 次以上 (所以不能 –. 同時出現)
            // @：中間一定要出現一個 @
            // [A-Za-z0-9]+：@ 之後出現 1 個以上的大小寫英文及數字的組合
            // (\.|-)：@ 之後只能出現「.」或是「-」，但這兩個字元不能連續時出現
            // ((\.|-)[A-Za-z0-9]+)*：@ 之後出現 0 個以上的「.」或是「-」配上大小寫英文及數字的組合
            // \.[A-Za-z]+$/：@ 之後出現 1 個以上的「.」配上大小寫英文及數字的組合，結尾需為大小寫英文
            filter = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
        }
        if (filter.test(validText)) {
            return true;
        } else {
            return false;
        }
    }

    $('.subscribe').on('click', '.box-success .btn-success-close', function(e) {
        e.preventDefault();
        $('.box-success').fadeOut();
        resetSubscribe();
    });

    function resetSubscribe(){
        Array.prototype.forEach.call(document.querySelectorAll('.subscribe input'), function (x) {
            x.value = '';
            x.checked = false;
          });
    }

    function subscribe(){

            var edata = {
                epaper  : $.base64.btoa(unescape(encodeURIComponent($("#subscribe-email").val())))
            };
            $.ajax({
                     url : '/api/subscription',
                     type: 'POST',
                     contentType: 'application/json',
                     data: JSON.stringify(edata),
                     dataType: 'text',
                     cache: false,
                     complete: function(data){
                        console.log(data);
                     },
                     success: function(data) {
                        console.log(data);
//                        alert('申請成功 ');
                     },
                     error: function(data,type,err) {
                        console.log(data);
//                        alert('申請有誤 ' + data.responseText);
                     },
                     timeout: 15000
                });
    }

    $('.captcha-item .fa-redo').on('click', function(e) {
           refreshCaptchaImageOnLoad();
    });

    function refreshCaptchaImageOnLoad() {
         $('#captchaImage').attr('src', '/api/image?' + new Date().getTime());
         $('#captcha').val('');
    }
})