var assert = require('assert');
var teamcity = require('../');

describe('Teamcity Service Messages', function () {

	describe('formatMessage', function () {

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

		it('should add a timestamp to messages by default', function () {
			var message = teamcity.formatMessage('messageName', 'value');
			assert.ok(/##teamcity\[messageName 'value' timestamp='\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z'\]/.test(message));
		});
	});

	describe('escapeValue', function () {

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

});
