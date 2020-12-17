$(function(){
    $(".expand-description").click(function (event) {
        event.target.innerHTML = event.target.getAttribute('secondPart');
        event.target.classList = ['second-part-description'];
    });

    $(".change-order-status-btn").click(function (event) {
        $.ajax({
            type: 'POST',
            url: "/order/change/status",
            dataType: 'json',
            contentType: "application/json",
            data: JSON.stringify({
                orderID: event.target.getAttribute('orderID'),
                action: event.target.getAttribute('action')
            }),
            success: function(data){
                if (data.status === 200){
                    if(event.target.getAttribute('action') === 4){
                        window.location = '/order/completed';
                    } else if(event.target.getAttribute('action') === 5 ||
                        event.target.getAttribute('action') === 3){
                        window.location = '/order/cancelled';
                    } else {
                        window.location = '/order/list';
                    }
                }else if(data.status === 500 && data.error != null){
                    showAlert(data.error, 'Ошибка');
                }else {
                    showAlert('Система не может обработать это действие', 'Ошибка');
                }
            },
            error: function(error) {
                console.log(error);
                showAlert('Система не может обработать это действие', 'Ошибка');
            }
        });
    });
});