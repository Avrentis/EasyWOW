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
    if (typeof input !== 'undefined' && input.trim() === ''){
        showErrorAlert(message);
        return true;
    }
    return false;
}

function showElementAsInlineBlock(element)
{
    if(element != null)
    {
        if(element.css != null)
        {
            element.css('display', 'inline-block');
        }
        else
        {
            element.style['display'] = 'inline-block';
        }
    }
}