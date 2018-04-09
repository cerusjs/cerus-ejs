var fs = require("fs");

class ejs {
	constructor() {
		this._cache = {};
		this._length = 0;
		this._includes = {};
		this._defaults = new defaults();
		this._includes = new includes();
		this._ejs = require("ejs");

		this._ejs.resolveInclude = function(name) {
			return "include:" + name;
		}.bind(this);

		this._ejs.fileLoader = function(path) {
			if(path.startsWith("include:")) {
				var include = this._includes.get(path.replace("include:", ""));

				if(include === undefined) {
					throw new Error("the include " + path.replace("include:", "") + " doesn't exist");
				}

				return include;
			}

			if(typeof this._defaults._defaults["loader"] === "function") {
				return this._defaults._defaults["loader"](path);
			}
				
			return fs.readFileSync(path);
		}.bind(this);
	}

	defaults() {
		return this._defaults;
	}

	template(input, opts) {
		return new template(input, opts, this._defaults, this._ejs);
	}

	render(input, data, defs) {
		return this.template(input, defs).render(data);
	}

	include(name) {
		return this.includes().get(name);
	}

	includes() {
		return this._includes;
	}
}

module.exports = ejs;

class defaults {
	constructor() {
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
	}
}

class template {
	constructor(input, defs, defaults, ejs) {
		this._defaults = {};
		this._input = input;

		if(typeof this._input === "object" && typeof this._input.data === "function") {
			this._input = this._input.data();
		}

		if(typeof this._input !== "string" || !Buffer.isBuffer(this._input)) {
			throw new TypeError("argument input must be a string, file or buffer");
		}

		if(defs !== undefined && typeof defs === "object") {
			this._defaults["debug"] = defs["debug"] || defaults.debug();
			this._defaults["delimiter"] = defs["delimiter"] || defaults.delimiter();
			this._defaults["strict"] = defs["strict"] || defaults.strict();
			this._defaults["escape"] = defs["escape"] || defaults.escape();
			this._defaults["whitespace"] = !(defs["whitespace"] || defaults.whitespace());
		}

		this._compiled = ejs.compile(this._input, this._defaults);
	}
	
	render(data) {
		return this._compiled(data);
	}
}

class includes {
	constructor() {
		this._includes = {};
	}

	add(key, input) {
		var input_ = input;

		if(typeof input_ === "object" && typeof input_.data === "function") {
			input_ = input_.data();
		}

		if(typeof input_ !== "string") {
			throw new TypeError("argument input must be a string or file");
		}

		this._includes[key] = input_;
	}

	has(key) {
		if(typeof key !== "string") {
			throw new TypeError("argument key must be a string");
		}

		return this._includes[key] !== undefined;
	}

	get(key) {
		if(typeof key !== "string") {
			throw new TypeError("argument key must be a string");
		}

		return this._includes[key];
	}

	remove(key) {
		if(typeof key !== "string") {
			throw new TypeError("argument key must be a string");
		}

		if(!this.has(key)) {
			throw new Error("the specified key doesn't exist");
		}

		delete this._includes[key];
	}

	clear() {
		this._includes = {};
	}

	reset() {
		this.clear();
	}

	list() {
		return Object.keys(this._includes);
	}
}
