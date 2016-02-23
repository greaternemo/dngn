DNGN.Map = function(x, y) {
    this._init(x, y);
    this._generateMap();
};

DNGN.Map.prototype._init = function(x, y) {
    this.fullMap = {};
    this.x = x;
    this.y = y;
    this.floor = 1;
};

DNGN.Map.prototype._generateMap = function() {
    this.fullMap = DNGN.Map.Mapmaker(this.x, this.y, this.floor);
};

