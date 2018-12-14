const expect = require("chai").expect;
const cerus = require("cerus")();
const ejs = () => {
	return new (require("../lib/ejs"))();
};
const file = path => {
	return cerus.file(path);
};

describe("ejs", () => {
	describe("#render", () => {
		context("with 'test' and no data as parameters", () => {
			it("should return 'test'", () => {
				expect(ejs().render("test")).to.equal("test");
			});
		});

		context("with 'test' and empty data as parameters", () => {
			it("should return 'test'", () => {
				expect(ejs().render("test", {})).to.equal("test");
			});
		});

		context("with '<%- test1 %>' and {test1:'test2'} as parameters", () => {
			it("should return 'test2'", () => {
				expect(ejs().render("<%- test1 %>", {test1:'test2'})).to.equal("test2");
			});
		});

		context("with '<% if(user) { %><%- user.name %><% } %>' and {user: {name: 'test2'}} as parameters" , () => {
			it("should return 'test2'", () => {
				const _ejs = ejs().render("<% if(user) { %><%- user.name %><% } %>", {user: {name: 'test2'}});

				expect(_ejs).to.equal("test2");
			});
		});

		context("with a file and {user: {name: 'test'}}", () => {
			it("should return 'test'", done => {
				file(__dirname + "/views/view1.ejs").read()
				.then(file => {
					expect(ejs().render(file.data(), {user: {name: 'test'}})).to.equal("test");
					done();
				});
			});
		});
	});

	describe("#template", () => {
		context("create a template and call it without data", () => {
			it("should work perfectly", () => {
				const template = ejs().template("test1");

				expect(template.render()).to.equal("test1");
			});
		});

		context("create a template and call it with data", () => {
			it("should work perfectly", () => {
				const template = ejs().template("<%- test %>");

				expect(template.render({test: "test1"})).to.equal("test1");
			});
		});
	});

	describe("#includes", () => {
		context("try using a non-existant include", () => {
			it("should throw a TypeError", () => {
				const func = () => {
					ejs().render("<%- include('/test') %>");
				};

				expect(func).to.throw();
			});
		});

		describe("#add", () => {
			context("with a pre-created include with no data", () => {
				it("should return 'test1'", () => {
					const _ejs = ejs();

					_ejs.includes().add("test", "test1");
					expect(_ejs.render("<%- include('/test') %>")).to.equal("test1");
				});
			});

			context("with a pre-created include with data", () => {
				it("should return 'test2'", () => {
					const _ejs = ejs();

					_ejs.includes().add("test", "<%- test1 %>");
					expect(_ejs.render("<%- include('/test', {test1: 'test2'}) %>")).to.equal("test2");
				});
			});
		});

		describe("#has", () => {
			context("with no pre-created include", () => {
				it("should return false", () => {
					const _ejs = ejs();

					expect(_ejs.includes().has("test")).to.deep.equal(false);
				});
			});

			context("with a pre-created include", () => {
				it("should return true", () => {
					const _ejs = ejs();

					_ejs.includes().add("test", "<%- test1 %>");
					expect(_ejs.includes().has("test")).to.deep.equal(true);
				});
			});
		});

		describe("#remove", () => {
			context("with an include that doesn't exist", () => {
				it("should throw an error", () => {
					const func = () => {
						ejs().includes().remove("test");
					};

					expect(func).to.throw();
				});
			});

			context("with an existant include", () => {
				it("should have 0 includes left", () => {
					const _ejs = ejs();

					_ejs.includes().add("test", "test1");
					_ejs.includes().remove("test");
					expect(_ejs.includes().list().length).to.equal(0);
				});
			});
		});
	});
});