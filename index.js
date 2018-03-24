module.exports = function() {
	var plugin = {};
	var ejs;
	var package = require("./package.json");

	plugin.name = package["name"];
	plugin.version = package["version"];
	plugin.dependencies = [];

	plugin._init = function() {
		ejs = new (require("./lib/ejs"))();
	}

	plugin.ejs = function() {
		return ejs;
	}

	return plugin;
}