var expect = require("chai").expect;
var cerus = require("cerus")();
var ejs = function() {
	return new (require("../lib/ejs"))();
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
			it("should throw a TypeError", function() {
				var func = function() {
					ejs().render();
				}

				expect(func).to.throw();
			});
		});

		context("with a non-string as parameters", function() {
			it("should throw a TypeError", function() {
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

	describe("#template", function() {
		context("with no parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					ejs().template();
				}

				expect(func).to.throw();
			});
		});

		context("with incorrect parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					ejs().template(1234);
				}

				expect(func).to.throw();
			});
		});

		context("create a template and call it without data", function() {
			it("should work perfectly", function() {
				var ejs_ = ejs();
				var class_ = ejs_.template("test1");
				expect(class_.render()).to.equal("test1");
			});
		});

		context("create a template and call it with data", function() {
			it("should work perfectly", function() {
				var ejs_ = ejs();
				var class_ = ejs_.template("<%- test %>");
				expect(class_.render({test:"test1"})).to.equal("test1");
			});
		});
	});

	describe("#includes", function() {
		context("try using a non-existant include", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					var ejs_ = ejs();
					ejs_.render("<%- include('/test') %>");
				}

				expect(func).to.throw();
			});
		});

		describe("#add", function() {
			context("with no parameters", function() {
				it("should throw a TypeError", function() {
					var func = function() {
						ejs().includes().add();
					}

					expect(func).to.throw;
				});
			});

			context("with incorrect parameters", function() {
				it("should throw a TypeError", function() {
					var func = function() {
						ejs().includes().add(123, 123);
					}

					expect(func).to.throw;
				});
			});
			
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

		describe("#has", function() {
			context("with no parameters", function() {
				it("should throw a TypeError", function() {
					var func = function() {
						ejs().includes().has();
					}

					expect(func).to.throw;
				});
			});

			context("with incorrect parameters", function() {
				it("should throw a TypeError", function() {
					var func = function() {
						ejs().includes().has(123);
					}

					expect(func).to.throw;
				});
			});
			
			context("with no pre-created include", function() {
				it("should return false", function() {
					var ejs_ = ejs();
					expect(ejs_.includes().has("test")).to.deep.equal(false);
				});
			});

			context("with a pre-created include", function() {
				it("should return true", function() {
					var ejs_ = ejs();
					ejs_.includes().add("test", "<%- test1 %>");
					expect(ejs_.includes().has("test")).to.deep.equal(true);
				});
			});
		});

		describe("#remove", function() {
			context("with no parameters", function() {
				it("should throw a TypeError", function() {
					var func = function() {
						ejs().includes().has();
					}

					expect(func).to.throw;
				});
			});

			context("with incorrect parameters", function() {
				it("should throw a TypeError", function() {
					var func = function() {
						ejs().includes().has(123);
					}

					expect(func).to.throw;
				});
			});

			context("with an include that doesn't exist", function() {
				it("should throw an error", function() {
					var func = function() {
						var ejs_ = ejs();
						ejs_.includes().remove("test");
					}

					expect(func).to.throw();
				});
			});

			context("with an existant include", function() {
				it("should have 0 includes left", function() {
					var ejs_ = ejs();
					ejs_.includes().add("test", "test1");
					ejs_.includes().remove("test");
					expect(ejs_.includes().list().length).to.equal(0);
				});
			});
		});

		describe("#clear", function() {
			context("with no pre-created includes", function() {
				it("should have no includes left", function() {
					var ejs_ = ejs();
					ejs_.includes().clear();
					expect(ejs_.includes().list().length).to.equal(0);
				});
			});

			context("with one pre-created include", function() {
				it("should have no includes left", function() {
					var ejs_ = ejs();
					ejs_.includes().add("test1", "test");
					ejs_.includes().clear();
					expect(ejs_.includes().list().length).to.equal(0);
				});
			});

			context("with multiple pre-created includes", function() {
				it("should have no includes left", function() {
					var ejs_ = ejs();
					ejs_.includes().add("test1", "test");
					ejs_.includes().add("test2", "test");
					ejs_.includes().clear();
					expect(ejs_.includes().list().length).to.equal(0);
				});
			});
		});

		describe("#list", function() {
			context("with no pre-created includes", function() {
				it("should return an empty array", function() {
					var ejs_ = ejs();
					expect(ejs_.includes().list()).to.deep.equal([]);
				});
			});

			context("with one pre-created include", function() {
				it("should return ['test1']", function() {
					var ejs_ = ejs();
					ejs_.includes().add("test1", "test");
					expect(ejs_.includes().list()).to.deep.equal(["test1"]);
				});
			});

			context("with multiple pre-created includes", function() {
				it("should return ['test1', 'test2']", function() {
					var ejs_ = ejs();
					ejs_.includes().add("test1", "test");
					ejs_.includes().add("test2", "test");
					expect(ejs_.includes().list()).to.deep.equal(["test1", "test2"]);
				});
			});
		});
	});
});