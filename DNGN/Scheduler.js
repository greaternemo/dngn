// This is going to be our new action scheduler. Since I don't really want to mess
// with the internals of ROT.Scheduler, I'm writing my own so I can consolidate
// the task of drawing and redrawing the screen in a way that is independent
// of Mob behavior. The scheduler can just run the dang renderer after each action
// is processed so that way I can just have the individual actions interact with
// the tiles on the map.

DNGN.Scheduler = function() {
    //placeholder
    this._init();
};

DNGN.Scheduler.prototype._init = function() {
    this._counter = 0;
    this._mobs = [];
    this._next = false;

};

DNGN.Scheduler.prototype.getNext = function() {
    this._next = false;
    //this is causing the whole thing to eat shit right now i think
    this._process();
    return this._next;

    // This is a REALLY quick and dirty fix in the meantime, woah.
    //var len = this._mobs.length;
    //len--;
    //var nextMob = this._mobs.shift();
    //this._mobs.push(nextMob);
    //return nextMob;
};

DNGN.Scheduler.prototype._process = function() {
    var cnt = this._counter;
    var len = this._mobs.length;
    while (this._next === false) {
        for (cnt; cnt < len; cnt++) {
            this._mobs[cnt]._nrg += this._mobs[cnt]._speed;
            if (this._mobs[cnt]._nrg >= 30) {
                this._mobs[cnt]._nrg -= 30;
                this._next = this._mobs[cnt];
                cnt++;
                this._counter = cnt;
                break;
            }
        }
        if (cnt == len) {
            cnt = 0;
        }
        // this is just to watch it go :3
        //Game.player.wipeMessage();
        //Game.display.drawText(0, 27, this._gimmeNrg());
    }
};

// This is just to crunch my debug output a bit.
/*
DNGN.Scheduler.prototype._gimmeNrg = function() {
    var name1 = Game.player.getName();
    var nrg1 = Game.player.getNrg();
    var name2 = Game.pedro.getName();
    var nrg2 = Game.pedro.getNrg();
    var filler = ": Energy=";
    var output = name1 + filler + nrg1 + " " + name2 + filler + nrg2;
    return output;
}; */

DNGN.Scheduler.prototype.addMob = function(val) {
    this._mobs.push(val);
};

DNGN.Scheduler.prototype.delMob = function(val) {
    var len = this._mobs.length;
    for (var index = 0; index < len; index++) {
        if (val === this._mobs[index]) {
            this._mobs.splice(index, 1);
            if (index < this._counter) {
                this._counter--;
            }
            break;
        }
    }
};