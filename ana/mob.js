function Mob () {
    this._init = function(point, base) {
        this._x  = point.x;
        this._y  = point.y;

        this._type  = base.type;
        this._name  = base.name;
        this._maxHP = base.maxHP;
        this._curHP = base.maxHP;
        this._sym   = base.sym;
        this._color = base.color;
        this._speed = base.speed;
        this._nrg   = base.nrg;
    };

    // We don't want to draw until after assignment.
    // this._draw();

    // Public interface methods

    this.setX     = function(val) { this._x = val; };
    this.setY     = function(val) { this._y = val; };
    this.setType  = function(val) { this._type = val; };
    this.setName  = function(val) { this._name = val; };
    this.setMaxHP = function(val) { this._maxHP = val; };
    this.setCurHP = function(val) { this._curHP = val; };
    this.setSym   = function(val) { this._sym = val; };
    this.setColor = function(val) { this._color = val; };
    this.setSpeed = function(val) { this._speed = val; };
    this.setNrg   = function(val) { this._nrg = val; };

    this.getX     = function() { return this._x; };
    this.getY     = function() { return this._y; };
    this.getType  = function() { return this._type; };
    this.getName  = function() { return this._name; };
    this.getMaxHP = function() { return this._maxHP; };
    this.getCurHP = function() { return this._curHP; };
    this.getSym   = function() { return this._sym; };
    this.getColor = function() { return this._color; };
    this.getSpeed = function() { return this._speed; };
    this.getNrg   = function() { return this._nrg; };
    
    // Additional interface methods
    
    this.getXY = function() { return this._x+","+this._y; };

    //This needs to be refactored, it's copied from Player.getHP().
    //getHP = function() {
    //    return this._curHP+"/"+this._maxHP;
    //};

    // This needs to be refactored, it's copied from Player._draw().
    //this._draw = function() {
    //    Game.display.draw(_x, _y, _sym, _color);
    //    Game.display.drawText(0, 26, this.getStats());
    //};

    //this._redraw = function(x, y) {
        // placeholder
    //};

    //this._drawStats = function() {
        //placeholder
    //};

}

// All of our Mob subclasses!

Player.prototype = new Mob();
Player.prototype.constructor = Player;

Pedro.prototype = new Mob();
Pedro.prototype.constructor = Pedro;

function Player (point, base) {
    // placeholder
    this._init(point, base);
    this._draw();

    //this.act = function() {
        // etc
    //};

    // etc
}
    
Player.prototype.getHP =  function() {
    return " "+this._curHP+"/"+this._maxHP;
};

Player.prototype.act = function() {
    //Game.engine.lock();
    Game.engine.wait();
    // wait for user input; do stuff when user hits a key
    window.addEventListener("keydown", this);
};

Player.prototype.getStats = function() {
    var someStats = [];
    someStats.push(this.getName());
    someStats.push(this.getHP());
    var formattedStats = someStats.toString();
    //var formattedStats = "";
    //for (var txt in someStats) {
    //    formattedStats += txt+" ";
    //}
    return formattedStats;
};

Player.prototype.wipeMessage = function() {
    var wipe = 0;
    for (i=0; i<80; i++) {
        Game.display.draw(wipe, 27, " ");
        wipe++;
    }
};

Player.prototype.handleEvent = function(e) {
    // process user input
    
    // ROT.DIRS[4] uses a weird array to bind keys to directions. It didn't make
    // sense to me at first until I realized that when the map is drawn,
    // *****THE Y AXIS IS INVERTED*****.
    // So ROT.DIRS[4] looks like this:
    // 0: [0,-1] (up, because the Y axis is inverted)
    // 1: [1,0]  (right, 1 space along the X axis)
    // 2: [0,1]  (down, because the Y axis is inverted)
    // 3: [-1,0] (left, 1 space back on the X axis)
    // Here are som JS keycodes for quick reference:
    // in order, they go LEFT, UP, RIGHT, DOWN
    // left arrow:  37 (ROT.DIRS[4][3])
    // up arrow:    38 (ROT.DIRS[4][0])
    // right arrow: 39 (ROT.DIRS[4][1])
    // down arrow:  40 (ROT.DIRS[4][2])
    var keyMap = {
        38: 0,
        33: 1,
        39: 2,
        34: 3,
        40: 4,
        35: 5,
        37: 6,
        36: 7,
    };

    var code = e.keyCode;

    if (code == 13 || code == 32) {
        this._checkBox();
        return;
    }

    if (!(code in keyMap)) { return; }

    var diff = ROT.DIRS[8][keyMap[code]];
    var newX = this._x + diff[0];
    var newY = this._y + diff[1];

    var newKey = newX + "," + newY;
    if (!(newKey in Game.map)) { return; } // can't move in this direction

    Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y]);
    this._x = newX;
    this._y = newY;
    this._draw();
    window.removeEventListener("keydown", this);
    //Game.engine.unlock();
    Game.engine.resume();
};

Player.prototype._checkBox = function() {
    var key =  this.getXY();
    if (Game.map[key] != "*") {
       Game.updateLog("There is no box at ["+this._x+", "+this._y+"]!");
    } else if (key == Game.ananas) {
        Game.updateLog("Hooray! You found an ananas and won this game.");
        //Game.engine.lock();
        Game.engine.over();
        window.removeEventListener("keydown", this);
    } else {
        Game.updateLog("The box at ["+this._x+", "+this._y+"] is empty! D:");
    }
};

Player.prototype._draw = function() {
    Game.display.draw(this._x, this._y, this._sym, this._color);
    Game.display.drawText(0, 26, this.getStats());
};


function Pedro (point, base) {
    // placeholder
    this._init(point, base);
    this._draw();

    //this.act = function() {
        // etc
    //};

    // etc
    
}

Pedro.prototype._draw = function() {
    Game.display.draw(this._x, this._y, this._sym, this._color);
    Game.display.drawText(0, 26, Game.player.getStats());
};

Pedro.prototype.act = function() {
    var x = Game.player.getX();
    var y = Game.player.getY();
    var passableCallback = function(x, y) {
        return (x+","+y in Game.map);
    };
    var astar = new ROT.Path.AStar(x, y, passableCallback, {topology:4});

    var path = [];
    var pathCallback = function(x, y) {
        path.push([x, y]);
    };
    astar.compute(this._x, this._y, pathCallback);

    path.shift();
    if (path.length == 1) {
        //Game.engine.lock();
        Game.engine.over();
        Game.updateLog("Game over - you were captured by Pedro!");
    } else {
        x = path[0][0];
        y = path[0][1];
        Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y]);
        this._x = x;
        this._y = y;
        this._draw();
    }
};

