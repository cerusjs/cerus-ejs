var fs = require("fs");

var ejs = module.exports = function() {
	this._cache = {};
	this._length = 0;
	this._includes = {};
	this._defaults = new defaults();
	this._includes = new includes();
	this._ejs = require("ejs");

	this._ejs.resolveInclude = function(name) {
		return "include:" + name;
	}.bind(this);

	console.log("Test");

	this._ejs.fileLoader = function(path) {
		if(path.startsWith("include:")) {
			var include = this._includes.get(path.replace("include:", ""));

			if(include === undefined) {
				throw new Error("the include " + path.replace("include:", "") + " deosn't exist");
			}

			return include;
		}

		if(typeof this._defaults._defaults["loader"] === "function") {
			return this._defaults._defaults["loader"](path);
		}
			
		return fs.readFileSync(path);
	}.bind(this);
};

ejs.prototype.defaults = function() {
	return this._defaults;
};

var defaults = function() {
	this._defaults = {
		delimiter: undefined,
		loader: undefined,
		root: undefined,
		debug: false,
		strict: false,
		whitespace: false,
		escape: false
	};

	Object.keys(this._defaults).forEach(function(def) {
		defaults.prototype[def] = function(val) {
			if(val === undefined) {
				this._defaults[def] = val;
			}

			return this._defaults[def];
		};
	}.bind(this));
};

ejs.prototype.template = function(input, opts) {
	return new template(input, opts, this._defaults, this._ejs);
};

var template = function(input, defs, defaults, ejs) {
	this._defaults = {};
	this._input = input;

	if(typeof this._input === "object" && typeof this._input.data === "function") {
		this._input = this._input.data();
	}

	if(typeof this._input !== "string") {
		throw new TypeError("argument input must be a string or file");
	}

	if(defs !== undefined && typeof defs === "object") {
		this._defaults["debug"] = defs["debug"] || defaults.debug();
		this._defaults["delimiter"] = defs["delimiter"] || defaults.delimiter();
		this._defaults["strict"] = defs["strict"] || defaults.strict();
		this._defaults["escape"] = defs["escape"] || defaults.escape();
		this._defaults["whitespace"] = !(defs["whitespace"] || defaults.whitespace());
	}

	this._compiled = ejs.compile(this._input, this._defaults);
};

template.prototype.render = function(data) {
	return this._compiled(data);
};

ejs.prototype.render = function(input, data, defs) {
	return this.template(input, defs).render(data);
};

ejs.prototype.include = function(name) {
	return this.includes().get(name);
};

ejs.prototype.includes = function() {
	return this._includes;
};

var includes = function() {
	this._includes = {};
};

includes.prototype.add = function(key, input) {
	var input_ = input;

	if(typeof input_ === "object" && typeof input_.data === "function") {
		input_ = input_.data();
	}

	if(typeof input_ !== "string") {
		throw new TypeError("argument input must be a string or file");
	}

	this._includes[key] = input_;
};

includes.prototype.has = function(key) {
	if(typeof key !== "string") {
		throw new TypeError("argument key must be a string");
	}

	return this._includes[key] !== undefined;
};

includes.prototype.get = function(key) {
	if(typeof key !== "string") {
		throw new TypeError("argument key must be a string");
	}

	return this._includes[key];
};

includes.prototype.remove = function(key) {
	if(typeof key !== "string") {
		throw new TypeError("argument key must be a string");
	}

	if(!this.has(key)) {
		throw new Error("the specified key doesn't exist");
	}

	delete this._includes[key];
};

includes.prototype.clear = includes.prototype.reset = function() {
	this._includes = {};
};

includes.prototype.list = function() {
	return Object.keys(this._includes);
};

/*
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

*/