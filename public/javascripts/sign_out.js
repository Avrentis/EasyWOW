$(function(){
    $("#sign-out-btn").click(function(){

        $.ajax({
            type: 'POST',
            url: "/sign_out",
            dataType:'json',
            contentType: "application/json",
            success: function(data){
                var status = data.status;

                if (status === 200){
                    window.location = '/';
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
