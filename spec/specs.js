var assert = require('assert');
var teamcity = require('../');

describe('Teamcity Service Messages', function () {

	it('should format single attribute messages', function () {
		var message = teamcity.formatMessage('messageName', 'value');
		assert.equal(message, '##teamcity[messageName \'value\']');
	});

	it('should format multiple attribute messages', function () {
		var message = teamcity.formatMessage('messageName', {
			name1: 'value1',
			name2: 'value2'
		});
		assert.equal(message, '##teamcity[messageName name1=\'value1\' name2=\'value2\']');
	});
});
