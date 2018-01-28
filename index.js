module.exports = function() {
	var self = {};

	var package = require("./package.json");
	
	self.name = package["name"];
	self.version = package["version"];
	self.dependencies = [
		"cerus-fs"
	];

	var ejs;

	self.init_ = function() {
		ejs = new (require("./lib/ejs"))();
	}

	self.ejs = function() {
		return ejs;
	}

	return self;
}