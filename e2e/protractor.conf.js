// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/docs/referenceConf.js

const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
	allScriptsTimeout: 11000,
	specs: [
		'**/*.e2e-spec.ts'
	],
	capabilities: {
		browserName: 'chrome'
	},
	SELENIUM_PROMISE_MANAGER: false,
	directConnect: true,
	baseUrl: 'http://localhost:4200/',
	framework: 'jasmine',
	jasmineNodeOpts: {
		showColors: true,
		defaultTimeoutInterval: 30000,
		print() { }
	},
	useAllAngular2AppRoots: true,
	beforeLaunch() {
		require('ts-node').register({
			project: 'e2e/tsconfig.json'
		});
	},
	async onPrepare() {
		jasmine.getEnv().addReporter(new SpecReporter());
	}
};
