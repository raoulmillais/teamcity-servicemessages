var util = require('util');

module.exports = {
	formatMessageProperties: function formatMessageProperties(properties) {
		var formatted = '';
		Object.keys(properties).forEach(function (key) {
			formatted += util.format(' %s=\'%s\'', key, properties[key]);
		});
		return formatted;
	},
	formatMessage: function formatMessage(name, valueOrProperties) {
		if (typeof valueOrProperties === 'string') {
			return util.format('##teamcity[%s \'%s\']', name, valueOrProperties);
		} else {
			return util.format('##teamcity[%s%s]',
				name, this.formatMessageProperties(valueOrProperties));
		}
	}
};
