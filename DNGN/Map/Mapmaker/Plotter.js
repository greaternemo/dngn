DNGN.Map.Mapmaker.Plotter = function(roomMap) {
    this._init(roomMap);
};

DNGN.Map.Mapmaker.Plotter.prototype._init = function(roomMap) {
    this.roomMap = roomMap;
    this.height = roomMap.length;
    this.width = roomMap[0].length;
    
    var dy = 0;
    var dx = 0;
    for (dy=0; dy<this.height; dy++) {
        for (dx=0; dx<this.width; dx++) {
            this.fillWalls(this.roomMap[dy][dx]);
            this.addDoors(this.roomMap[dy][dx]);
            if (this.roomMap[dy][dx].entry === true) {
                this.roomMap[dy][dx].room.roomLayout[3][4] = "<";
            }
            if (this.roomMap[dy][dx].exit === true) {
                this.roomMap[dy][dx].room.roomLayout[3][4] = ">";
            }
        }
    }
    
};

DNGN.Map.Mapmaker.Plotter.prototype.fillWalls = function(cell) {
    if (cell.walkOrder == "unwalked" && cell.dead === false) {
        cell.room.roomLayout = [
        ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
        ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
        ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
        ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
        ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
        ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
        ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
        ];
    }
};

DNGN.Map.Mapmaker.Plotter.prototype.addDoors = function(cell) {
    var sides = [];
    var x = cell.x;
    var y = cell.y;
    for (var i in cell.sides) {
        if (cell.sides[i] == "open") {
            cell.sides[i] = "wall";
        }
        // we have the direction in which we walked from a given room
        // so we turn that side into a door as well as the matching side
        // from the next room
        if (cell.sides[i] == "walked" || cell.sides[i] == "dead") {
            cell.sides[i] = "door";
            switch (i) {
                case "R":
                    cell.room.roomLayout[2][8] = "+";
                    cell.room.roomLayout[3][8] = "+";
                    cell.room.roomLayout[4][8] = "+";
                    this.roomMap[y][x+1].room.roomLayout[2][0] = "+";
                    this.roomMap[y][x+1].room.roomLayout[3][0] = "+";
                    this.roomMap[y][x+1].room.roomLayout[4][0] = "+";
                    this.roomMap[y][x+1].sides.L = "door";
                    break;
                case "L":
                    cell.room.roomLayout[2][0] = "+";
                    cell.room.roomLayout[3][0] = "+";
                    cell.room.roomLayout[4][0] = "+";
                    this.roomMap[y][x-1].room.roomLayout[2][8] = "+";
                    this.roomMap[y][x-1].room.roomLayout[3][8] = "+";
                    this.roomMap[y][x-1].room.roomLayout[4][8] = "+";
                    this.roomMap[y][x-1].sides.R = "door";
                    break;
                case "T":
                    cell.room.roomLayout[0][3] = "+";
                    cell.room.roomLayout[0][4] = "+";
                    cell.room.roomLayout[0][5] = "+";
                    this.roomMap[y-1][x].room.roomLayout[6][3] = "+";
                    this.roomMap[y-1][x].room.roomLayout[6][4] = "+";
                    this.roomMap[y-1][x].room.roomLayout[6][5] = "+";
                    this.roomMap[y-1][x].sides.B = "door";
                    break;
                case "B":
                    cell.room.roomLayout[6][3] = "+";
                    cell.room.roomLayout[6][4] = "+";
                    cell.room.roomLayout[6][5] = "+";
                    this.roomMap[y+1][x].room.roomLayout[0][3] = "+";
                    this.roomMap[y+1][x].room.roomLayout[0][4] = "+";
                    this.roomMap[y+1][x].room.roomLayout[0][5] = "+";
                    this.roomMap[y+1][x].sides.T = "door";
                    break;
            }
        }
    }
    return sides;
};