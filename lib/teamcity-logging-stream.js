var Stream = require('stream');
var util = require('util');
var teamcity = require('./teamcity-message-formatter');

function TeamCityLoggingStream() {
	Stream.call(this);
	this.readable = true;
	this.writable = true;
}

util.inherits(TeamCityLoggingStream, Stream);

TeamCityLoggingStream.prototype.write = function write(data) {
	this.emit('data', teamcity.progress(data));
};

TeamCityLoggingStream.prototype.end = function end(data) {
	this.emit('end', data);
	this.emit('close');
};

module.exports = TeamCityLoggingStream;
