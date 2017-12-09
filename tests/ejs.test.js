var expect = require("chai").expect;
var cerus = require("cerus")();
var ejs = function() {
	return require("../lib/ejs")();
}
var file = function(path) {
	return cerus.file(path);
}

describe("ejs", function() {
	describe("constructor", function() {
		context("without any parameters", function() {
			it("should throw no errors", function() {
				var func = function() {
					ejs();
				}

				expect(func).to.not.throw();
			});
		});
	});

	describe("#render", function() {
		context("with no parameters", function() {
			it("should throw an error", function() {
				var func = function() {
					ejs().render();
				}

				expect(func).to.throw();
			});
		});

		context("with with a non-string as parameters", function() {
			it("should throw an error", function() {
				var func = function() {
					ejs().render(1234);
				}

				expect(func).to.throw();
			});
		});

		context("with 'test' and no data as parameters", function() {
			it("should return 'test'", function() {
				expect(ejs().render("test")).to.equal("test");
			});
		});

		context("with 'test' and empty data as parameters", function() {
			it("should return 'test'", function() {
				expect(ejs().render("test", {})).to.equal("test");
			});
		});

		context("with '<%- test1 %>' and {test1:'test2'} as parameters", function() {
			it("should return 'test2'", function() {
				expect(ejs().render("<%- test1 %>", {test1:'test2'})).to.equal("test2");
			});
		});

		context("with '<% if(user) { %><%- user.name %><% } %>' and {user: {name: 'test2'}} as parameters" , function() {
			it("should return 'test2'", function() {
				var ejs_ = ejs().render("<% if(user) { %><%- user.name %><% } %>", {user: {name: 'test2'}});
				expect(ejs_).to.equal("test2");
			});
		});

		context("with a file and {user: {name: 'test'}}", function() {
			it("should return 'test'", function(done) {
				file(__dirname + "/views/view1.ejs").read()
				.then(function(file) {
					expect(ejs().render(file, {user: {name: 'test'}})).to.equal("test");
					done();
				});
			});
		});
	});

	describe("include", function() {
		context("with a pre-created include with no data", function() {
			it("should return 'test1'", function() {
				var ejs_ = ejs();
				ejs_.includes().add("test", "test1");
				expect(ejs_.render("<%- include('/test') %>")).to.equal("test1");
			});
		});

		context("with a pre-created include with data", function() {
			it("should return 'test2'", function() {
				var ejs_ = ejs();
				ejs_.includes().add("test", "<%- test1 %>");
				expect(ejs_.render("<%- include('/test', {test1: 'test2'}) %>")).to.equal("test2");
			});
		});
	});
});