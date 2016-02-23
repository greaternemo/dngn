// My first RL engine.
// This is where the magic happens.

function gameEngine(scheduler) {
    //placeholder
    this._init(scheduler);
    
    
    
}

// This puts it all together for us.
gameEngine.prototype._init = function(scheduler) {
    this._scheduler = scheduler;
    this._waiting = true;
};


gameEngine.prototype.start = function() {
    return this.resume();
};
gameEngine.prototype.over = function() {
    return this.wait();
};
gameEngine.prototype.wait = function() {
    this._waiting = true;
};
gameEngine.prototype.resume = function() {
    if (this._waiting === false) {
    //log that
    }
    this._waiting = false;
    
    // LOOP TIME, MOTHERFUCKER
    while (this._waiting === false) {
        var actor = null;
        actor = this._scheduler.getNext();
        actor.act();
        // Game.renderEngine.draw();
        
    }
    return this;
};

