var SIGN_IN_VALIDATION_MESSAGE = 'Телефон должен быть заполнен',
    SMS_IS_EMPTY_VALIDATION_MESSAGE = 'Смс-код должен быть заполнен',
    SIGN_UP_VALIDATION_MESSAGE = 'Обращение и телефон должны быть заполнены';

$(function(){
    $("#sign-in-btn").click(function(){

        var phoneNumber = $('#phone-number').val();
        var smsCode = $('#login-sms-code').val();

        if (isInputValueEmpty(phoneNumber, SIGN_IN_VALIDATION_MESSAGE) || isInputValueEmpty(smsCode, SMS_IS_EMPTY_VALIDATION_MESSAGE)){
            return;
        }

        $.ajax({
            type: 'POST',
            url: "/sign_in",
            dataType:'json',
            contentType: "application/json",
            data: JSON.stringify({
                phoneNumber: phoneNumber,
                smsCode: smsCode
            }),
            success: function(data){
                var status = data.status;

                if (status === 200){
                    window.location.reload();
                }else if(status === 500 && data.error != null){
                    showAlert(data.error, 'Ошибка');
                }else {
                    showAlert('Что-то пошло не так :\'(', 'Ошибка');
                }
            },
            error: function(error) {
                console.log(error);
                showAlert('Система не может обработать это действие', 'Ошибка');
            }
        });
    });
});

var loginSMSIntervalFun;
var SMSCodeInterval = -1;
var signUpSMSIntervalFun;

$(function(){
    $("#open-sign-in-form").click(function(){
        $("#sign-in-container").show();
    });
    $("#open-sign-up-form-btn").click(function(){
        $("#sign-up-container").show();
    });
    $("#get-login-sms-code-btn").click(function(){
        if(SMSCodeInterval > 0){
            showAlert('60 секунд до нового кода ещё не прошли.', 'Ошибка');
            return;
        }
        var phoneNumber = $('#phone-number').val();

        if (isInputValueEmpty(phoneNumber, SIGN_IN_VALIDATION_MESSAGE)){
            return;
        }

        $.ajax({
            type: 'POST',
            url: "/get_login_sms_code",
            dataType:'json',
            contentType: "application/json",
            data: JSON.stringify({
                phoneNumber: phoneNumber
            }),
            success: function(data){
                var status = data.status;

                if (status === 200){
                    var timer = $("#login-sms-timer");
                    $("#login-sms-code-label").show();
                    $("#login-sms-code").show();
                    SMSCodeInterval = 60;
                    showElementAsInlineBlock($("#sign-in-btn"));
                    loginSMSIntervalFun = setInterval(function(){
                        timer.text("Код отправлен. Следующий код можно получить через " + SMSCodeInterval + " секунд");
                        SMSCodeInterval--;
                        if(SMSCodeInterval < 0){
                            clearInterval(loginSMSIntervalFun);
                            timer.text("");
                        }
                    }, 1000);
                    showElementAsInlineBlock(timer);
                } else if(status === 500 && data.error != null){
                    showAlert(data.error, 'Ошибка');
                } else {
                    showAlert('Что-то пошло не так :\'(', 'Ошибка');
                }
            },
            error: function(error) {
                console.log(error);
                showAlert('Система не может обработать это действие', 'Ошибка');
            }
        });
    });
    $("#get-sign-up-sms-code-btn").click(function(){
        if(SMSCodeInterval > 0){
            showAlert('60 секунд до нового кода ещё не прошли.', 'Ошибка');
            return;
        }
        var phoneNumber = $('#phone-number-new').val();

        if (isInputValueEmpty(phoneNumber, SIGN_IN_VALIDATION_MESSAGE)){
            return;
        }

        $.ajax({
            type: 'POST',
            url: "/get_sing_up_sms_code",
            dataType:'json',
            contentType: "application/json",
            data: JSON.stringify({
                phoneNumber: phoneNumber
            }),
            success: function(data){
                var status = data.status;

                if (status === 200){
                    $("#sign-up-sms-code-label").show();
                    $("#sign-up-sms-code").show();
                    SMSCodeInterval = 60;
                    showElementAsInlineBlock($("#sign-up-btn"));
                    signUpSMSIntervalFun = setInterval(function(){
                        $("#sign-up-sms-timer").text("Код отправлен. Следующий код можно получить через " + SMSCodeInterval + " секунд");
                        SMSCodeInterval--;
                        if(SMSCodeInterval < 0){
                            clearInterval(signUpSMSIntervalFun);
                            $("#sign-up-sms-timer").text("");
                        }
                    }, 1000);
                    showElementAsInlineBlock($("#sign-up-sms-timer"));
                } else if(status === 500 && data.error != null){
                    showAlert(data.error, 'Ошибка');
                } else {
                    showAlert('Что-то пошло не так :\'(', 'Ошибка');
                }
            },
            error: function(error) {
                console.log(error);
                showAlert('Система не может обработать это действие', 'Ошибка');
            }
        });
    });
    $("#sign-up-btn").click(function(){

        var name = $('#name').val();
        var birthday = $('#birthday').val();
        var phoneNumber = $('#phone-number-new').val();
        var smsCode = $('#sign-up-sms-code').val();

        if (isInputValueEmpty(name, SIGN_UP_VALIDATION_MESSAGE)
            || isInputValueEmpty(phoneNumber, SIGN_UP_VALIDATION_MESSAGE
            || isInputValueEmpty(smsCode, SMS_IS_EMPTY_VALIDATION_MESSAGE))){
            return;
        }

        $.ajax({
            type: 'POST',
            url: "/sign_up",
            dataType:'json',
            contentType: "application/json",
            data: JSON.stringify({
                name: name,
                birthday: birthday,
                phoneNumber: phoneNumber,
                smsCode: smsCode
            }),
            success: function(data){
                var status = data.status;

                if (status === 200){
                    window.location.reload();
                } else if(status === 500 && data.error != null){
                    showAlert(data.error, 'Ошибка');
                } else {
                    showAlert('Что-то пошло не так :\'(', 'Ошибка');
                }
            },
            error: function(error) {
                console.log(error);
                showAlert('Система не может обработать это действие', 'Ошибка');
            }
        });
    });
});