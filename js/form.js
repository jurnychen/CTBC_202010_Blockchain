(function($){
    var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    //個人資料運用告知聲明
    $('[data-action-target="#popupTips"]').on('click', function() {
        $.fancybox.open({
            src: '#popupTips',
            type: 'inline',
            opts : {
                beforeShow: function( instance, current ) {
                    //  calculate the height again
                    if (isSafari){
                        $('.fancybox-container').css("height", $('body').height());
                    }
                },
                beforeClose: function( instance, current ) {
                    // solve safari scrolling issue after close fancybox
                    if (isSafari){
                        $('body').css("height", 10000);
                    }
                },
                afterClose: function( instance, current ) {
                    // force close all fancybox mask
                    $('.fancybox-container').hide();
                    $('body').removeClass("fancybox-active compensate-for-scrollbar");

                    // solve safari scrolling issue after close fancybox
                    if (isSafari){
                        $('body').css("height", "");
                    }
                }
            }
        });
    });

    $('#companyphone, #contact__form :input[type="text"], #contact__form :input[type="hidden"], #contact__form textarea').on('change', function(){
        if($(this).val().length > 0) {
            $(this).removeClass('valid__error');
            $(this).siblings('span[data-inputid]').removeClass('show');
        }
    });

    $('#agree, #agreereceivemail').on('change', function(){
        if(this.checked) {
            $(this).removeClass('valid__error');
            $(this).siblings('span[data-inputid]').removeClass('show');
        }
    });

    $('#sendBtn').on('click', function(){
       if(validateUserForm()){
           apply();
       }
    });
})(jQuery);

function resetall(){
    // 將所有input、checkbox及textarea清空，下拉選單改回初始值
    // input[type="text"], input[type="hidden"], textarea
    $('#contact__form :input[type="text"], #contact__form :input[type="hidden"], #contact__form textarea').each(function(){
        $(this).val('');
    });
    // input[type="checkbox"]
    $('#contact__form :input[type="checkbox"]').each(function(){
        $(this).prop('checked', false);
    });
}

function apply(){
    //將所有input、checkbox disabled設為true
    $('#contact__form :input[type="text"], #contact__form textarea').each(function(){
        $(this).prop('disabled', true);
    });
    $('#contact__form :input[type="checkbox"]').each(function(){
        $(this).prop('disabled', true);
        $(this).parent().addClass('disabled');
    });
    //送出成功導頁至首頁
    $('#contact__form').submit();
    //將所有input、checkbox disabled設為false
}

function validErrorDOMHandle(targetDom){
    $('span[data-inputid="' + targetDom + '"]').addClass('show');
    $('#' + targetDom).addClass('valid__error');
}
function validateUserForm(){
    $('span[data-inputid]').removeClass('show');
    $('.valid__error').removeClass('valid__error');
    let validateCount = 0;

    //檢核姓名為必填
    let inputName = $('#name').val();
    if (inputName.length === 0) {
        validErrorDOMHandle('name');
        validateCount++;
    }

    //檢核公司名稱為必填
    let inputCompanyname = $('#companyname').val();
    if (inputCompanyname.length === 0) {
        validErrorDOMHandle('companyname');
        validateCount++;
    }

    //檢核部門及職稱為必填(不用)
    // let inputDept = $('#companydept').val();
    // if (inputDept.length === 0) {
    //     validErrorDOMHandle('companydept');
    //     validateCount++;
    // }

    //檢核聯絡電話為必填
    let inputCompanyphone = $('#companyphone').val();
    if (inputCompanyphone.length === 0){
        validErrorDOMHandle('companyphone');
        validateCount++;
    }

    //檢核行動電話為必填(不用)
    // let inputPhone = $('#phone').val();
    // if (inputPhone.length === 0){
    //     validErrorDOMHandle('phone');
    //     validateCount++;
    // }

    //檢核E-mail為必填
    let inputEmail = $('#email').val();
    if (inputEmail.length === 0){
        validErrorDOMHandle('email');
        validateCount++;
    }

    //檢核E-mail須符合E-mail XXX@OOO格式
    if (validateByReg('email', inputEmail) === false){
        validErrorDOMHandle('email');
        validateCount++;
    }

    //檢核感興趣服務為必選
    let selectServiceArray = new Array();
    $('input:checkbox[name="selectservice"]').each(function(i) {
        selectServiceArray[i] = $(this).is(':checked');
    });
    if (selectServiceArray.filter(function(value){ return value === false; }).length === selectServiceArray.length){
        validErrorDOMHandle('selectservice');
        validateCount++;
    }

    //檢核需求說明是否有填寫(不用)
    // let inputMessage = $('#message').val();
    // if (inputMessage.length === 0){
    //     validErrorDOMHandle('message');
    //     validateCount++;
    // }

    //檢核驗證碼為必填
    let inputCaptcha = $('#captcha').val();
    if (inputCaptcha.length === 0){
        validErrorDOMHandle('captcha');
        validateCount++;
    }

    //檢核驗證碼為僅輸入數字
    if (validateByReg('captcha', inputCaptcha) === false){
        validErrorDOMHandle('captcha');
        validateCount++;
    }

    //檢核同意個人資料是否有勾選
    let statusAgree = $('#agree').is(':checked');
    if (!statusAgree){
        validErrorDOMHandle('agree');
        validateCount++;
    }

    //檢核同意Email是否有勾選
    let statusAgreeEmail = $('#agreereceivemail').is(':checked');
    if (!statusAgreeEmail){
        validErrorDOMHandle('agreereceivemail');
        validateCount++;
    }

    return validateCount > 0 ? false : true;
}

function validateByReg(validField, validText) {
    let filter;
    if (validField === 'phone'){
        filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
    } else if (validField === 'email'){
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
    } else if (validField = 'captcha'){
        filter = /^[0-9]*$/;
    }
    
    if (filter.test(validText)) {
        return true;
    } else {
        return false;
    }
}