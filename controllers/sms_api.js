var express = require('express');
var router = express.Router(),
    log = require('../utils/logger').getLogger();

module.exports = router;

router.post('/callback', function(req, res){

    try{
        log.debug("sms.ru response: " + JSON.stringify(res.body));

        res.send(JSON.stringify({
                status: "OK", // Запрос выполнен успешно (нет ошибок в авторизации)
                status_code: 100, // Успешный код выполнения
                callback: [ // Список добавленных callback
                    "https://easy-wow.ru/callback"
                ]
            })
        );
    }catch(err){
        log.error('Cannot open order page.\nError: ' + err.stack);
        res.send('Something went wrong ...');
    }
});