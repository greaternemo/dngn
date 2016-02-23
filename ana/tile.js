// So this is our new tile class. Tiles will be held in Game.map instead of
// just symbols, so we can add a host of attributes to each coordinate instead
// of making it the task of the renderer to remember the original symbol for
// that tile. Still needs work.

function Tile(point, base) {
    this._init(point, base);
}

Tile.prototype._init = function(point, base) {
    this._x       = point.x;
    this._y       = point.y;
    this._type    = base.type;
    this._sym     = base.sym;
    this._blocked = base.blocked;
    this._mob     = base.mob;
};

Tile.prototype.constructor = Tile;

// This is a clever bit of functionality: We overload the Tile function's default
// toString method so that it returns the _sym value instead of dumping the contents
// of the Tile object. This guaratees a bit of backwards compatibility for anything
// that calls the Tile object expecting it to be a string, like the draw functions.
Tile.prototype.toString = function() {
    return this._sym;
};

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

