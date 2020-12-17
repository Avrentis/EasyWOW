var EMPTY_FIELDS_MESSAGE = 'Обращение и телефон должны быть заполнены';

$(function(){
    $("#save-btn").click(function(){

        var name = $('#name').val();
        var birthday = $('#birthday').val();

        if (isInputValueEmpty(name, EMPTY_FIELDS_MESSAGE)){
            return;
        }

        $.ajax({
            type: 'POST',
            url: "/save-profile",
            dataType:'json',
            contentType: "application/json",
            data: JSON.stringify({
                userID: userID,
                name: name,
                birthday: birthday
            }),
            success: function(data){
                var status = data.status;

                if (status === 200){
                    window.location = "/profile";
                }else if(status === 500 && data.error != null){
                    showAlert(data.error, 'Ошибка');
                }else {
                    showAlert('Номер телефона неверен', 'Ошибка');
                }
            },
            error: function(error) {
                console.log(error);
                showAlert('Система не может обработать это действие', 'Ошибка');
            }
        });
    });
});