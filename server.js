var fs = require('fs'),
	path = require('path'),
	http = require('http'),
	https = require('https'),
	logger = require('morgan'),
	express = require('express'),
	session = require('express-session'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override');

var config = require('./utils/config_utils').getConfig();
require('./utils/logger').init();
var log = require('./utils/logger').getLogger(),
	User = require('./model/User'),
	smsUtils = require("./utils/sms_utils");

var httpServer = http.createServer(function (req, res) {
	var host = req.headers['host'];
	host = host.replace(/:\d+$/, ":"+config.httpsServer.port);

	var destination = ['https://', host, req.url].join('');

	res.writeHead(301, { "Location": destination });
	res.end();
});

httpServer.listen(config.httpServer.port);

var httpsOptions = {
	key: fs.readFileSync(config.httpsServer.keyFile),
	cert: fs.readFileSync(config.httpsServer.certFile)
};

var httpsApp = express();
httpsApp.set('port', config.httpsServer.port);
httpsApp.set('key', fs.readFileSync(config.httpsServer.keyFile));
httpsApp.set('cert', fs.readFileSync(config.httpsServer.certFile));
httpsApp.use(logger('combined'));
httpsApp.use(methodOverride());
httpsApp.use(session(config.httpsServer.session));
httpsApp.use(bodyParser.json());
httpsApp.use(bodyParser.urlencoded({extended: true}));

httpsApp.set('view engine', 'pug');
httpsApp.set('views', __dirname + '/views');

httpsApp.use(express.static(path.join(__dirname, 'public')));

var httpsServer = https.createServer(httpsOptions, httpsApp);
httpsServer.listen(httpsApp.get('port'), function (req, res) {
	require('./utils/db_initializer').init();
	log.debug('Server started on port ' + config.httpsServer.port + '.');
});

httpsApp.get('/', function(req, res){
	try{
		//smsUtils.registerCallback();
		res.render('index', { user: req.session.user, User });
	}catch(err){
		console.log('Cannot open index page.\nError: ' + err.stack);
	}
});

httpsApp.use('/', require('./controllers/user'));
httpsApp.use('/order', require('./controllers/order'));
httpsApp.use('/masters', require('./controllers/masters'));
httpsApp.use('/', require('./controllers/sign_in_out_up'));
httpsApp.use('/', require('./controllers/sms_api'));