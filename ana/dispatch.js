// This is the new dispatch engine that will handle communication between
// engines: game(maybe), renderer, action.

function actEngine() {
    //placeholder
    this._init();



}



actEngine.prototype._init = function() {
    //placeholder
    this._listeners = {};
    this._ignored = {};
};

actEngine.prototype.hear = function() {
    //placeholder
};

actEngine.prototype.listen = function(key, listener) {
    //placeholder
    this._listeners[key] = listener;
};

actEngine.prototype.ignore = function(key) {
    //placeholder
    var clone = {};
    for (var oldKey in this._listeners) {
        if (oldKey !== key) {
            clone[oldKey] = this._listeners[oldKey];
        }
    }
    this._listeners = clone;
};

actEngine.prototype.relay = function() {
    //placeholder
};

