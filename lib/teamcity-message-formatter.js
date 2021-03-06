var util = require('util');

module.exports = {
	escapeValue: function escapeValue(value) {
		return value.replace(/\|/g, '||').replace(/\'/g, '|\'')
			.replace(/\n/g, '|n').replace(/\r/g, '|r')
			.replace(/\[/g, '|[').replace(/\]/g, '|]');
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
		/* currently broken in teamcity
		var timestamp = !!disableTimestamp ? '' :
			util.format(' timestamp=\'%s\'', new Date().toISOString());
		*/
		var timestamp = '';

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
	},
	buildMessage: function buildMessage(text, error, status, flowId,
										disableTimestamp) {
		if (error) {
			return this.formatMessage('message', {
				text: text,
				errorDetails: error,
				status: status.toUpperCase()
			}, flowId, disableTimestamp);
		} else {
			return this.formatMessage('message', { text: text }, flowId, disableTimestamp);
		}
	},
	startCompilation: function startCompilation(compilerName, flowId,
												disableTimestamp) {
		return this.formatMessage('compilationStarted', {
			compiler: compilerName
		}, flowId, disableTimestamp);
	},
	finishCompilation: function finishCompilation(compilerName, flowId,
												disableTimestamp) {
		return this.formatMessage('compilationFinished', {
			compiler: compilerName
		}, flowId, disableTimestamp);
	},
	startTestSuite: function startTestSuite(name, flowId, disableTimestamp) {
		return this.formatMessage('testSuiteStarted', {
			name: name
		}, flowId, disableTimestamp);
	},
	finishTestSuite: function finishTestSuite(name, flowId, disableTimestamp) {
		return this.formatMessage('testSuiteFinished', {
			name: name
		}, flowId, disableTimestamp);
	},
	startTest: function startTest(name, flowId, disableTimestamp) {
		return this.formatMessage('testStarted', {
			name: name
		}, flowId, disableTimestamp);
	},
	finishTest: function finishTest(name, flowId, disableTimestamp) {
		return this.formatMessage('testFinished', {
			name: name
		}, flowId, disableTimestamp);
	},
	ignoreTest: function ignoreTest(name, reason, flowId, disableTimestamp) {
		return this.formatMessage('testIgnored', {
			name: name,
			message: reason
		}, flowId, disableTimestamp);
	},
	testOutput: function testOutput(name, output, flowId, disableTimestamp) {
		return this.formatMessage('testStdOut', {
			name: name,
			out: output
		}, flowId, disableTimestamp);
	},
	testError: function testError(name, error, flowId, disableTimestamp) {
		return this.formatMessage('testStdErr', {
			name: name,
			out: error
		}, flowId, disableTimestamp);
	},
	failTest: function failTest(name, message, details, flowId,
								disableTimestamp) {
		return this.formatMessage('testFailed', {
			name: name,
			message: message,
			details: details
		}, flowId, disableTimestamp);
	},
	publishArtifacts: function publishArtifacts(path) {
		return this.formatMessage('publishArtifacts', path, undefined, true);
	},
	progress: function progress(message, flowId, disableTimestamp) {
		return this.formatMessage('progressMessage', message, flowId,
			disableTimestamp);
	},
	startProgress: function startProgress(message, flowId, disableTimestamp) {
		return this.formatMessage('progressStart', message, flowId,
			disableTimestamp);
	},
	finishProgress: function finishProgress(message, flowId, disableTimestamp) {
		return this.formatMessage('progressFinish', message, flowId,
			disableTimestamp);
	},
	failBuild: function failBuild(message) {
		return this.formatMessage('buildStatus', {
			status: 'FAILURE',
			text: message
		}, undefined, true);
	},
	passBuild: function passBuild(message) {
		return this.formatMessage('buildStatus', {
			status: 'SUCCESS',
			text: message
		}, undefined, true);
	},
	setBuildNumber: function setBuildNumber(num) {
		return this.formatMessage('buildNumber', num, undefined, true);
	},
	setParameter: function setParameter(name, value) {
		return this.formatMessage('setParameter', {
			name: name,
			value: value
		}, undefined, true);
	},
	reportBuildStatistic: function reportBuildStatistic(name, value) {
		return this.formatMessage('buildStatisticValue', {
			key: name,
			value: value
		}, undefined, true);
	},
	enableServiceMessages: function enableServiceMessages() {
		return '##teamcity[enableServiceMessages]';
	},
	disableServiceMessages: function disableServiceMessages() {
		return '##teamcity[disableServiceMessages]';
	}

};
