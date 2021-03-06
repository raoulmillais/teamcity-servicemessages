var assert = require('assert');
var teamcity = require('../lib/teamcity-message-formatter');

describe('Teamcity Message Formatter', function () {

	describe('message formatting', function () {

		it('should format single attribute messages', function () {
			var message = teamcity.formatMessage('messageName', 'value',
				undefined, true);
			assert.equal(message, '##teamcity[messageName \'value\']');
		});

		it('should format multiple attribute messages', function () {
			var message = teamcity.formatMessage('messageName', {
				name1: 'value1',
				name2: 'value2'
			}, undefined, true);
			assert.equal(message, '##teamcity[messageName name1=\'value1\' name2=\'value2\']');
		});

		it('should escape values', function () {
			var message = teamcity.formatMessage('messageName', {
				name1: 'value1',
				name2: 'value2|'
			}, undefined, true);
			assert.equal(message, '##teamcity[messageName name1=\'value1\' name2=\'value2||\']');
		});

		it('should escape all values', function () {
			var message = teamcity.formatMessage('messageName', {
				name1: 'value1',
				name2: 'va|lue2|'
			}, undefined, true);
			assert.equal(message, '##teamcity[messageName name1=\'value1\' name2=\'va||lue2||\']');
		});

		it('should escape simple message values', function () {
			var message = teamcity.formatMessage('messageName', 'value2|',
				undefined, true);
			assert.equal(message, '##teamcity[messageName \'value2||\']');
		});

		it('should add a flowid to messages', function () {
			var message = teamcity.formatMessage('messageName', 'value',
				'flow1', true);
			assert.equal(message, '##teamcity[messageName \'value\' flowId=\'flow1\']');
		});

		// Date is broken in teamcity
		it.skip('should add a timestamp to messages by default', function () {
			var message = teamcity.formatMessage('messageName', 'value');
			assert.ok(/##teamcity\[messageName 'value' timestamp='\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z'\]/.test(message));
		});
	});

	describe('escaping', function () {

		it('should escape apostrophes', function () {
			var escaped = teamcity.escapeValue('\'');
			assert.equal(escaped, '|\'');
		});

		it('should escape newlines', function () {
			var escaped = teamcity.escapeValue('\n');
			assert.equal(escaped, '|n');
		});

		it('should escape carriage returns', function () {
			var escaped = teamcity.escapeValue('\r');
			assert.equal(escaped, '|r');
		});

		it('should escape pipes', function () {
			var escaped = teamcity.escapeValue('\n|');
			assert.equal(escaped, '|n||');
		});

		it('should escape square brackets', function () {
			var escaped = teamcity.escapeValue('[]');
			assert.equal(escaped, '|[|]');
		});

	});

	describe('blocks', function () {

		it('should format a blockOpened message', function () {
			var blockMessage = teamcity.openBlock('block1', undefined, true);
			assert.equal(blockMessage, '##teamcity[blockOpened name=\'block1\']');
		});

		it('should format a blockClosed message', function () {
			var blockMessage = teamcity.closeBlock('block1', undefined, true);
			assert.equal(blockMessage, '##teamcity[blockClosed name=\'block1\']');
		});
	});

	describe('compiler messages', function () {

		it('should format a build message', function () {
			var msg = teamcity.buildMessage('message text', 'error details', 'error',
				undefined, true);
			assert.equal(msg, '##teamcity[message text=\'message text\' errorDetails=\'error details\' status=\'ERROR\']');
		});

		it('should format a build message', function () {
			var msg = teamcity.buildMessage('message text');

			assert.equal("##teamcity[message text='message text']", msg);
		});

		it('should format a compilationStarted message', function () {
			var msg = teamcity.startCompilation('mycc', undefined, true);
			assert.equal(msg, '##teamcity[compilationStarted compiler=\'mycc\']');
		});

		it('should format a compilationFinished message', function () {
			var msg = teamcity.finishCompilation('mycc', undefined, true);
			assert.equal(msg, '##teamcity[compilationFinished compiler=\'mycc\']');
		});

	});

	describe('test messages', function () {

		it('should format a testSuiteStarted message', function () {
			var msg = teamcity.startTestSuite('suite name', undefined, true);
			assert.equal(msg, '##teamcity[testSuiteStarted name=\'suite name\']');
		});

		it('should format a testSuiteFinished message', function () {
			var msg = teamcity.finishTestSuite('suite name', undefined, true);
			assert.equal(msg, '##teamcity[testSuiteFinished name=\'suite name\']');
		});

		it('should format a testStarted message', function () {
			var msg = teamcity.startTest('test name', undefined, true);
			assert.equal(msg, '##teamcity[testStarted name=\'test name\']');
		});

		it('should format a testFinished message', function () {
			var msg = teamcity.finishTest('test name', undefined, true);
			assert.equal(msg, '##teamcity[testFinished name=\'test name\']');
		});

		it('should format a testIgnored message', function () {
			var msg = teamcity.ignoreTest('test name', 'reason', undefined,
				true);
			assert.equal(msg, '##teamcity[testIgnored name=\'test name\' message=\'reason\']');
		});

		it('should format a testStdOut message', function () {
			var msg = teamcity.testOutput('test name', 'stdout', undefined,
				true);
			assert.equal(msg, '##teamcity[testStdOut name=\'test name\' out=\'stdout\']');
		});

		it('should format a testStdErr message', function () {
			var msg = teamcity.testError('test name', 'stderr', undefined,
				true);
			assert.equal(msg, '##teamcity[testStdErr name=\'test name\' out=\'stderr\']');
		});

		it('should format a testFailed message', function () {
			var msg = teamcity.failTest('test name', 'failure message', 'details', undefined,
				true);
			assert.equal(msg, '##teamcity[testFailed name=\'test name\' message=\'failure message\' details=\'details\']');
		});

	});

	describe('publishing artifacts', function () {

		it('should format a publishArtifacts message', function () {
			var msg = teamcity.publishArtifacts('/path/to/artifact');
			assert.equal(msg, '##teamcity[publishArtifacts \'/path/to/artifact\']');
		});

	});

	describe('build progress messages', function () {

		it('should format a progressMessage message', function () {
			var msg = teamcity.progress('progress message', undefined,
				true);
			assert.equal(msg, '##teamcity[progressMessage \'progress message\']');
		});

		it('should format a progressStart message', function () {
			var msg = teamcity.startProgress('progress message', undefined,
				true);
			assert.equal(msg, '##teamcity[progressStart \'progress message\']');
		});

		it('should format a progressFinished message', function () {
			var msg = teamcity.finishProgress('progress message', undefined, true);
			assert.equal(msg, '##teamcity[progressFinish \'progress message\']');
		});

	});

	describe('build status messages', function () {

		it('should format a buildStatus message when failing the build',
																function () {
			var msg = teamcity.failBuild('failure message');
			assert.equal(msg, '##teamcity[buildStatus status=\'FAILURE\' text=\'failure message\']');
		});

		it('should format a buildStatus message when passing the build',
																function () {
			var msg = teamcity.passBuild('success message');
			assert.equal(msg, '##teamcity[buildStatus status=\'SUCCESS\' text=\'success message\']');
		});

	});

	describe('build number message', function () {

		it('should format a buildNumber message', function () {
			var msg = teamcity.setBuildNumber('1.0.42');
			assert.equal(msg, '##teamcity[buildNumber \'1.0.42\']');
		});

	});

	describe('build parameter messages', function () {

		it('should format a setParameter message', function () {
			var msg = teamcity.setParameter('env.FOO', 'bar');
			assert.equal(msg, '##teamcity[setParameter name=\'env.FOO\' value=\'bar\']');
		});

	});

	describe('build statistic messages', function () {

		it('should format a buildStatisticValue message', function () {
			var msg = teamcity.reportBuildStatistic('statKey', 'statValue');
			assert.equal(msg, '##teamcity[buildStatisticValue key=\'statKey\' value=\'statValue\']');
		});

	});

	describe('service message toggling', function () {

		it('should return an enableServiceMessages message', function () {
			var msg = teamcity.enableServiceMessages();
			assert.equal(msg, '##teamcity[enableServiceMessages]');
		});

		it('should return an disableServiceMessages message', function () {
			var msg = teamcity.disableServiceMessages();
			assert.equal(msg, '##teamcity[disableServiceMessages]');
		});

	});
});
