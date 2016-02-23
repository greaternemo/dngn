// So this is our new tile class. Tiles will be held in Game.map instead of
// just symbols, so we can add a host of attributes to each coordinate instead
// of making it the task of the renderer to remember the original symbol for
// that tile. Still needs work.

DNGN.Map.Tile = function(point, type) {
    this.x    = point.x;
    this.y    = point.y;
    this.type = type;
    this.ch   = "";
    this.fg   = "";
    this.bg   = "";
    this.walk = false;
    this.mob  = null;
    
    this.typeFill(type);
};

// This is a clever bit of functionality: We overload the Tile function's default
// toString method so that it returns the _sym value instead of dumping the contents
// of the Tile object. This guaratees a bit of backwards compatibility for anything
// that calls the Tile object expecting it to be a string, like the draw functions.
DNGN.Map.Tile.prototype.toString = function() {
    return this.ch;
};

DNGN.Map.Tile.prototype.typeFill = function(type) {
    for (var opt in DNGN.BASE.Tiles[type]) {
        this[opt] = DNGN.BASE.Tiles[type][opt];
    }
};

DNGN.Map.Tile.prototype.typeFlip = function(type) {
    this.type = type;
    this.typeFill(type);
};

// This is particularly rigid. You pass it a value to convert to, from, and the value
// and it will cross reference them in DNGN.BASE.Tiles and return the value to you
// THIS IS A HELPER FUNCTION THAT YOU HAVE TO CALL BY NAME, NOT A CLASS METHOD
DNGN.Map.Tile.convert = function(valIn, valOut, oldVal) {
    var newVal;
    for (var key in DNGN.BASE.Tiles) {
        if (DNGN.BASE.Tiles[key][valIn] == oldVal) {
            newVal = DNGN.BASE.Tiles[key][valOut];
        }
    }
    return newVal;
};

/*
Tile.prototype.setX       = function(val) { this._x = val; };
Tile.prototype.setY       = function(val) { this._y = val; };
Tile.prototype.setType    = function(val) { this._type = val; };
Tile.prototype.setSym     = function(val) { this._sym = val; };
Tile.prototype.setBlocked = function(val) { this._blocked = val; };
Tile.prototype.setMob     = function(val) { this._mob = val; };

Tile.prototype.getX       = function() { return this._x; };
Tile.prototype.getY       = function() { return this._y; };
Tile.prototype.getType    = function() { return this._type; };
Tile.prototype.getSym     = function() { return this._sym; };
Tile.prototype.getBlocked = function() { return this._blocked; };
Tile.prototype.getMob     = function() { return this._mob; };
*/
