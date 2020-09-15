function showErrorAlert(text, callback) {
    showAlert(text, 'Ошибка', callback);
}

function showAlert(text, title, callback){
    $("#alert-text")[0].innerHTML = text;
    $("#dialog-message").dialog({
        title: title,
        dialogClass: "dialog-container",
        modal: true,
        width: 450,
        height: 300,
        buttons: {
            OK: function() {
                $(this).dialog("close");
                if (callback){
                    callback();
                }
            }
        }
    });
}

function isInputValueEmpty(input, message){
    if (input && input.trim() === ''){
        showErrorAlert(message);
        return true;
    }
    return false;
}