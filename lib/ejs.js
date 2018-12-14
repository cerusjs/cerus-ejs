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
	}

	delimiter(delimiter) {
		if(delimiter === undefined) return;
		
		return this._defaults.delimiter = delimiter;
	}

	loader(loader) {
		if(loader === undefined) return;
		
		return this._defaults.loader = loader;
	}

	root(root) {
		if(root === undefined) return;
		
		return this._defaults.root = root;
	}

	debug(debug) {
		if(debug === undefined) return;
		
		return this._defaults.debug = debug;
	}

	strict(strict) {
		if(strict === undefined) return;
		
		return this._defaults.strict = strict;
	}

	whitespace(whitespace) {
		if(whitespace === undefined) return;
		
		return this._defaults.whitespace = whitespace;
	}

	escape(escape) {
		if(escape === undefined) return;
		
		return this._defaults.escape = escape;
	}
}

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
