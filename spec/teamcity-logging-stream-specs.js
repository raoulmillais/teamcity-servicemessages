var TeamcityLoggingStream = require('../lib/teamcity-logging-stream');
var assert = require('assert');

describe('Teamcity Logging Stream', function () {

	it('wrap each data event in a progress message', function (done) {
		var teamcityLoggingStream = new TeamcityLoggingStream();

		// output
		teamcityLoggingStream.on('data', function (message) {
			assert.ok("##teamcity[progressMessage 'some message']", message);
		});

		teamcityLoggingStream.on('close', function () {
			done();
		});

		// input
		teamcityLoggingStream.write('some message');
		teamcityLoggingStream.end();
	});

});
