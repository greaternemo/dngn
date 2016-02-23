DNGN.Map.Mapmaker.Cell = function(params) {
    this._init(params);
};

// Cell.sides can be:
// "open"
// "walked"
// "wall"
// "bound"
// "door"
// "dead"

DNGN.Map.Mapmaker.Cell.prototype._init = function(params) {
    this.x = params.x;
    this.y = params.y;
    this.sides = {
        R: "open",
        L: "open",
        T: "open",
        B: "open",
    };
    this.flags = []; // ???
    this.entry = false;
    this.exit = false;
    this.dead = false;
    this.walkOrder = "unwalked";
    this.room = new DNGN.Map.Mapmaker.Room({
        roomType: "plain",
        roomStyle: "debug",
        roomGlyph: ".",
    });
    this.tempGlyph = ".";
    
    // if you're smart, you'll refactor those x and y lengths to pull from a variable
    if (this.x === 0) {
        this.sides.L = "bound";
    }
    if (this.x == 4) {
        this.sides.R = "bound";
    }
    if (this.y === 0) {
        this.sides.T = "bound";
    }
    if (this.y == 3) {
        this.sides.B = "bound";
    }
    
};