DNGN.Map.Mapmaker.Room = function(params) {
    this._init(params);
};

DNGN.Map.Mapmaker.Room.prototype._init = function(params) {
    this.roomType = params.roomType;
    this.roomStyle = params.roomStyle;
    this.roomGlyph = params.roomGlyph;
    this.roomLayout = [
        ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
        ["#", ".", ".", ".", ".", ".", ".", ".", "#"],
        ["#", ".", ".", ".", ".", ".", ".", ".", "#"],
        ["#", ".", ".", ".", ".", ".", ".", ".", "#"],
        ["#", ".", ".", ".", ".", ".", ".", ".", "#"],
        ["#", ".", ".", ".", ".", ".", ".", ".", "#"],
        ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ];
};