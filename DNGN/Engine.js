/**
* some serious business about what's in here
*/

DNGN.Engine = function (scheduler) {
    this._init(scheduler);
};

DNGN.Engine.prototype._init = function(scheduler) {
    this._scheduler = scheduler;
    this._waiting = true;
};


DNGN.Engine.prototype.start = function() {
    return this.resume();
};
DNGN.Engine.prototype.gameover = function() {
    return this.wait();
};
DNGN.Engine.prototype.wait = function() {
    this._waiting = true;
};
DNGN.Engine.prototype.resume = function() {
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

