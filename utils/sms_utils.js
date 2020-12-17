var request = require('request'),
    log = require('../utils/logger').getLogger();

const API_ID="6626876E-B53F-58A9-5DAF-C9C793432EA0";
const SEND_SMS_I = "https://sms.ru/sms/send?api_id=";
const TO = "&to=";
const MSG = "&msg=";
const SEND_SMS_II = "&json=1";

exports.createAndSendSmsCode = function (phone) {

    var code = Math.trunc(Math.random() * 10000);
    while (code < 1000 && code > 9999){
        code = Math.trunc(Math.random() * 10000);
    }

    sendSMS(phone, "Easy WOW sms code: " + code);

    return code;
}

function sendSMS(phone, message) {

    log.debug("Send sms \"" + message + "\" to phone " + phone);
    let url = SEND_SMS_I + API_ID + TO + phone + MSG + message + SEND_SMS_II;
    log.debug("url = " + url);
    request(url,function (error, response, body) {
        log.debug("sms.ru error: " + error);
        log.debug("sms.ru response: " + JSON.stringify(response));
        log.debug("sms.ru body: " + JSON.stringify(body));
    });
}