var fs = require('fs');

var config;

exports.getConfig = function()
{
	if(!config) config = JSON.parse(fs.readFileSync('./config/config.json', 'utf8'));
	return config;
}