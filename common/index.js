"use strict";
jQuery(document).ready(function () {

    jQuery('body').on('click', '.fa-redo', function (event) {
        refreshCaptchaImageOnLoad();
    });

   jQuery('body').on('click', '#sendBtn', function (event) {
        $('.rsform-input-box').attr('disabled',true);
        $('.rsform-text-box').attr('disabled',true);
        $('input[name=selectService]').attr('disabled',true);
        apply();
        $('.rsform-input-box').attr('disabled',false);
        $('.rsform-text-box').attr('disabled',false);
        $('input[name=selectService]').attr('disabled',false);
    });

    jQuery('body').on('click', '#epapersend', function (event) {
            epaperapply();
    });

});

function resetAll() {
  Array.prototype.forEach.call(document.querySelectorAll('.form-content input,.form-content textarea'), function (x) {
    x.value = '';
    x.checked = false;
  });
  $("#captchaImage").attr('src', '/api/image?' + new Date().getTime());
}

function resetEpaper(){
    Array.prototype.forEach.call(document.querySelectorAll('.epaper-content input'), function (x) {
        x.value = '';
        x.checked = false;
      });
}

function refreshCaptchaImage() {
    $('#captchaImage').attr('src', '/api/image');
    $('#captcha').val('');
}

function refreshCaptchaImageOnLoad() {
        $('#captchaImage').attr('src', '/api/image?' + new Date().getTime());
        $('#captcha').val('');
}

function epaperapply(){
    if(!$('#epaperaggre').is(":checked")) {
            alert('請確認閱讀並同意隱私權保護政策');
            return;
    }

    var edata = {
        epaper  : $.base64.btoa(unescape(encodeURIComponent($("#epaper").val())))
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
                alert('資料已送出 ');
                resetEpaper();
             },
             error: function(data,type,err) {
                alert('申請有誤 ' + data.responseText);
             },
             timeout: 15000
        });

}

function apply() {
    if (!$('#agree').is(":checked")) {
        alert('請確認閱讀並同意條款');
        return;
    }
    var user = {
        name        : $.base64.btoa(unescape(encodeURIComponent($("#name").val()))),
        companyName : $('#companyname').val(),
        title1      : $('#title1').val(),
        title2      : $('#title2').val(),
        phone       : $.base64.btoa($("#phone").val()),
        email       : $.base64.btoa(unescape(encodeURIComponent($("#email").val()))),
        receive     : $('#receive').is(":checked"),
        message     : $('#message').val(),
        captcha     : $('#captcha').val()
    };
    if ($('input[name=selectService]').is(":checked")) {
        var selectService = $("input[name=selectService]:checked").map(function(){
              return $(this).attr('id');
        }).get();
        user["selectService"] = selectService;
    }
    $.ajax({
         url : '/api/send',
         type: 'POST',
         contentType: 'application/json',
         data: JSON.stringify(user),
         dataType: 'text',
         cache: false,
         complete: function(data){
            console.log(data);
         },
         success: function(data) {
            alert('資料已送出，後續將由專人與您聯繫 ');
            resetAll();
         },
         error: function(data,type,err) {
            alert('申請有誤 ' + data.responseText);
            refreshCaptchaImage();
         },
         timeout: 15000
    });
}


function validateUserForm() {
    $('#applyForm').validate({
            onsubmit: false,
            rules: {
                name: {
                    required: true
                },
                companyname: {
                    required: true
                },
                phone: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                },
                captcha: {
                    required: true,
                    number: true,
                    minlength: 4,
                    maxlength: 4
                }
            },
            messages: {
                name: '請輸入您的姓名',
                companyname: '請輸入您的公司名稱',
                phone: '請輸入您的聯絡電話',
                email: '請輸入您的電子郵件信箱',
                captcha: {
                    required: '請輸入正確的驗證碼',
                    minlength: '至少輸入4碼',
                    maxlength: '至少輸入4碼'
                }
            },
            errorPlacement: function(error, element) {
                // console.log('err element is ' + element.attr('id') + ' '+ element.attr('name'));
                $('.' + element.attr('id')).append(error);
            },
            errorElement: "span"
        });
}