var SIGN_IN_VALIDATION_MESSAGE = 'Логин должен быть заполнен',
    SIGN_UP_VALIDATION_MESSAGE = 'Логин, обращение и телефон должны быть заполнены';

$(function(){
    $("#sign-in-btn").click(function(){

        var login = $('#login').val();

        if (isInputValueEmpty(login, SIGN_IN_VALIDATION_MESSAGE)){
            return;
        }

        $.ajax({
            type: 'POST',
            url: "/sign_in",
            dataType:'json',
            contentType: "application/json",
            data: JSON.stringify({
                login: login
            }),
            success: function(data){
                var status = data.status;

                if (status === 200){
                    window.location.reload();
                }else if(status === 500 && data.error != null){
                    showAlert(data.error, 'Ошибка');
                }else {
                    showAlert('Логин неверен', 'Ошибка');
                }
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
});

$(function(){
    $("#open-sign-up-form-btn").click(function(){
        $("#sign-up-container").show();
    });
    $("#sign-up-btn").click(function(){

        var login = $('#login-sign-up').val();
        var name = $('#name').val();
        var birthday = $('#birthday').val();
        var phoneNumber = $('#phone-number').val();

        if (isInputValueEmpty(login, SIGN_UP_VALIDATION_MESSAGE) || isInputValueEmpty(name, SIGN_UP_VALIDATION_MESSAGE)
            || isInputValueEmpty(phoneNumber, SIGN_UP_VALIDATION_MESSAGE)){
            return;
        }

        $.ajax({
            type: 'POST',
            url: "/sign_up",
            dataType:'json',
            contentType: "application/json",
            data: JSON.stringify({
                login: login,
                name: name,
                birthday: birthday,
                phoneNumber: phoneNumber
            }),
            success: function(data){
                var status = data.status;

                if (status === 200){
                    window.location.reload();
                }else if(status === 500 && data.error != null){
                    showAlert(data.error, 'Ошибка');
                }else {
                    showAlert('Логин неверен', 'Ошибка');
                }
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
});