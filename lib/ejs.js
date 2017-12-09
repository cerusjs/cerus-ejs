module.exports = function() {
	var self = {};

	var ejs = require("ejs");
	var cache = {};
	var length = 0;
	var includes = {};
	var loader = undefined;

	ejs.resolveInclude = function(name, filename, dir) {
		return "include:" + name;
	}

	ejs.fileLoader = function(path) {
		if(path.startsWith("include:")) {
			return includes[path.replace("include:", "")];
		}

		if(typeof loader === "function") {
			return loader(path);
		}
		else {
			return fs.readFileSync(path);
		}
	}

	self.delimiter = function(delimiter) {
		if(delimiter !== undefined) {
			ejs.delimiter = delimiter;
		}

		return ejs.delimiter;
	}

	self.loader = function(loader_) {
		if(loader !== undefined) {
			loader_ = loader_;
		}

		return loader;
	}

	self.template = function(input, opts) {
		var self_ = {};

		if(typeof input === "object" && typeof input.data === "function") {
			input = input.data();
		}
		if(typeof input !== "string") {
			throw new TypeError("argument input must be a string or file");
		}

		var options = undefined;

		if(opts !== undefined && typeof opts === "object") {
			options["debug"] = opts["debug"] || false;
			options["delimiter"] = opts["delimiter"] || undefined;
			options["strict"] = opts["strict"] || false;
			options["escape"] = opts["escape"] || false;
			options["whitespace"] = !(opts["whitespace"] || false);
		}

		var compiled = ejs.compile(input, options);

		self_.render = function(data) {
			return compiled(data);
		}

		return self_;
	}

	self.render = function(input, data, opts) {
		if(typeof input === "object" && typeof input.data === "function") {
			input = input.data();
		}
		else if(typeof input !== "string") {
			throw new TypeError("argument input must be a string or file");
		}

		var options = undefined;

		if(opts !== undefined && typeof opts === "object") {
			options["debug"] = opts["debug"] || false;
			options["delimiter"] = opts["delimiter"] || undefined;
			options["strict"] = opts["strict"] || false;
			options["escape"] = opts["escape"] || false;
			options["whitespace"] = !(opts["whitespace"] || false);
		}

		return ejs.render(input, data, options);
	}

	self.includes = function() {
		var self_ = {};

		self_.add = function(key, input) {
			if(typeof key !== "string") {
				throw new TypeError("argument key must be a string");
			}
			if(typeof input === "object" && typeof input.data === "function") {
				input = input.data();
			}
			if(typeof input !== "string") {
				throw new TypeError("argument input must be a string or file");
			}

			includes[key] = input;
		}

		self_.has = function(key) {
			if(typeof key !== "string") {
				throw new TypeError("argument key must be a string");
			}

			return includes[key] !== undefined;
		}

		self_.get = function(key) {
			if(typeof key !== "string") {
				throw new TypeError("argument key must be a string");
			}

			return includes[key];
		}

		self_.remove = function(key) {
			if(typeof key !== "string") {
				throw new TypeError("argument key must be a string");
			}

			delete includes[key];
		}

		self_.clear = function() {
			includes = {};
		}

		self_.list = function() {
			return includes;
		}

		return self_;
	}

	self.cache = function() {
		var self_ = {};

		self_.set = function(key, value) {
			if(typeof key !== "string") {
				throw new TypeError("argument key must be a string");
			}

			length += cache[key] === undefined ? 0 : 1;
			cache[key] = value;
		}

		self_.get = function(key) {
			if(typeof key !== "string") {
				throw new TypeError("argument key must be a string");
			}

			return cache[key];
		}

		self_.has = function(key) {
			if(typeof key !== "string") {
				throw new TypeError("argument key must be a string");
			}

			return cache[key] !== undefined;
		}

		self_.remove = function(key) {
			if(typeof key !== "string") {
				throw new TypeError("argument key must be a string");
			}

			if(cache[key] !== undefined) {
				length -= 1;
				delete cache[key];
			}
		}

		self_.reset = function() {
			cache = {};
			length = 0;
		}

		self_.length = function() {
			return length;
		}

		self_.list = function() {
			return cache;
		}

		return self_;
	}

	ejs.cache = self.cache();

	return self;
}