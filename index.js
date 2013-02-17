var util = require('util');

module.exports = {
	escapeValue: function escapeValue(value) {
		return value.replace('|', '||').replace('\'', '|\'')
			.replace('\n', '|n').replace('\r', '|r')
			.replace('[', '|[').replace(']', '|]');
	},
	formatMessageProperties: function formatMessageProperties(properties) {
		var self = this;
		var formatted = '';
		Object.keys(properties).forEach(function (key) {
			formatted += util.format(' %s=\'%s\'', key,
				self.escapeValue(properties[key]));
		});
		return formatted;
	},
	formatMessage: function formatMessage(name, valueOrProperties,
										flowId, disableTimestamp) {
		var timestamp = !!disableTimestamp ? '' :
			util.format(' timestamp=\'%s\'', new Date().toISOString());
		flowId = flowId ? util.format(' flowId=\'%s\'', flowId) : '';
		valueOrProperties = (typeof valueOrProperties === 'string') ?
			util.format(' \'%s\'', this.escapeValue(valueOrProperties)) :
			this.formatMessageProperties(valueOrProperties);

		return util.format('##teamcity[%s%s%s%s]',
			name, valueOrProperties, flowId, timestamp);
	},
	openBlock: function openBlock(blockName, flowId, disableTimestamp) {
		return this.formatMessage('blockOpened', {
			name: blockName 
		}, flowId, disableTimestamp);
	},
	closeBlock: function closeBlock(blockName, flowId, disableTimestamp) {
		return this.formatMessage('blockClosed', {
			name: blockName 
		}, flowId, disableTimestamp);
	}

};
