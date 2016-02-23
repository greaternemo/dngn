/**
 * Sets prototype of this function to an instance of parent function
 * @param {function} parent
 */
Function.prototype.extend = Function.prototype.extend || function(parent) {
	this.prototype = Object.create(parent.prototype);
	this.prototype.constructor = this;
	return this;
};

// This is basically straight jacked from rot.js until I find something that works better