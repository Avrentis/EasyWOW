var log4js = require('log4js');

exports.init = function() {
    log4js.configure({
        appenders: {
            out: { type: 'stdout' },
            app: { type: 'file', filename: 'logs/application.log' }
        },
        categories: {default: { appenders: [ 'out', 'app' ], level: 'all' }}
    });
}

exports.getLogger = function () {
    return log4js.getLogger();
}