var SIGN_VALIDATION_MESSAGE = 'Подтвердите, пожалуйста, согласие на обработку персональных данных',
    FIELDS_VALIDATION_MESSAGE = 'Обращение, телефон и описание должны быть заполнены';

$(function(){
    $("#send-request-btn").click(function(){

        var name = $('#customer-name').val();
        var phoneNumber = $('#customer-contacts').val();
        var description = $('#request-text').val();
        var master = $('#master').val();
        var date = $('#request-date').val();
        var time = $('#request-time').val();

        if (isInputValueEmpty(name, FIELDS_VALIDATION_MESSAGE) || isInputValueEmpty(description, FIELDS_VALIDATION_MESSAGE)
            || isInputValueEmpty(phoneNumber, FIELDS_VALIDATION_MESSAGE) || isInputValueEmpty(date, FIELDS_VALIDATION_MESSAGE)
            || isInputValueEmpty(time, FIELDS_VALIDATION_MESSAGE)){
            return;
        }

        if(!$("#agreement-checkbox")[0].checked){
            showErrorAlert(SIGN_VALIDATION_MESSAGE);
            return;
        }

        $.ajax({
            type: 'POST',
            url: "/order",
            dataType:'json',
            contentType: "application/json",
            data: JSON.stringify({
                name: name,
                description: description,
                phoneNumber: phoneNumber,
                master: master,
                date: date,
                time: time
            }),
            success: function(data){
                var status = data.status;

                if (status === 200){
                    showAlert('Заявка успешно отправлена!', "Готово!");
                    $('#request-text').val('');
                }else if(status === 500 && data.error != null){
                    showErrorAlert(data.error);
                }else {
                    showErrorAlert('Логин неверен');
                }
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
});