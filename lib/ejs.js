var fs = require("fs");

class ejs {
	constructor() {
		this._defaults = new defaults();
		this._includes = new includes();
		this._ejs = require("ejs");

		this._ejs.resolveInclude = name => {
			return "include:" + name;
		};

		this._ejs.fileLoader = path => {
			if(path.startsWith("include:")) {
				let include = this._includes.get(path.replace("include:", ""));

				if(include === undefined) throw new Error(`the include ${path.replace("include:", "")} doesn't exist`);

				return include;
			}

			if(typeof this._defaults.loader() === "function") {
				return this._defaults.loader()(path);
			}
				
			return fs.readFileSync(path);
		};
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

class template {
	constructor(input, options, defaults, ejs) {
		const _defaults = Object.assign({}, defaults._defaults, options);
		
		this._compiled = ejs.compile(input, _defaults);
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
		this._includes[key] = input;
	}

	has(key) {
		return Object.keys(this._includes).includes(key);
	}

	get(key) {
		return this._includes[key];
	}

	remove(key) {
		if(!this.has(key)) throw new Error("the specified key doesn't exist");

		delete this._includes[key];
	}

	clear() {
		this._includes = {};
	}
	
	list() {
		return Object.keys(this._includes);
	}
}
