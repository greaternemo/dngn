var rlMath = {
    rand: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
};

var Game = {
    display: null,
    map: {},
    // UNIMPLEMENTED: Map tiles that need to be redrawn
    _dirtyMap: [],
    // UNIMPLEMENTED: Current floor as an int
    //currentFloor: 0,
    // UNIMPLEMENTED: All floors
    //floors: [],
    // Gonna need that action engine
    //actionEngine: new actionEngine(),
    // Our message log
    // We can extend the shit out of this later to save an entire game's log.
    //log: [" ", " ", " ", " ", " "],

    init: function() {
        this.display = new ROT.Display({
            width: 45,
            height: 28,
        });
        document.body.appendChild(this.display.getContainer());

        this._generateMap();
    },

    _generateMap: function() {
        var newMap = new Game.Map(5, 4);
        this.map = newMap.fullMap;

        this._drawWholeMap();
    },

    // Private method that redraws the whole map
    _drawWholeMap: function() {
        var fg = "";
        for (var key in this.map) {
            var point = this.clean("xy", key);
            switch (this.map[key]) {
                case ".":
                    fg = "darkkhaki";
                    break;
                case "#":
                    fg = "black";
                    break;
                case "+":
                    fg = "chocolate";
                    break;
                case "<":
                    fg = "green";
                    break;
                case ">":
                    fg = "red";
                    break;
            }
            this.display.draw(point.x, point.y, this.map[key], fg);
        }
    },
    
    // This is a helper function to automate splitting up coordinates of the
    // form 0,0, which are commonly used as keys in this implementation.
    clean: function(type, payload) {
        var output;
        switch (type) {
            case "xy":
                var point = payload.split(",");
                var getCoords = function(point) {
                    var myPoint = {
                        x: parseInt(point[0]),
                        y: parseInt(point[1]),
                    };
                    return myPoint;
                };
                output = getCoords(point);
                break;
        }
        return output;
    },

};

Game.Engine = function(scheduler) {
    //placeholder
    this._init(scheduler);
};

Game.Engine.prototype._init = function(scheduler) {
    this._scheduler = scheduler;
    this._waiting = true;
};


Game.Engine.prototype.start = function() {
    return this.resume();
};
Game.Engine.prototype.over = function() {
    return this.wait();
};
Game.Engine.prototype.wait = function() {
    this._waiting = true;
};
Game.Engine.prototype.resume = function() {
    if (this._waiting === false) {
    //log that
    }
    this._waiting = false;
    
    while (this._waiting === false) {
        var actor = null;
        actor = this._scheduler.getNext();
        actor.act();        
    }
    return this;
};

Game.Map = function(x, y) {
    this._init(x, y);
    this._generateMap();
};

Game.Map.prototype._init = function(x, y) {
    this.fullMap = {};
    this.x = x;
    this.y = y;
    this.floor = 1;
};

Game.Map.prototype._generateMap = function() {
    this.fullMap = Game.Map.Mapmaker(this.x, this.y, this.floor);
};

Game.Map.Mapmaker = function(x, y, floor) {
    var tempMap = [];
    var finalMap = {};
    var dy = 0;
    var dx = 0;
    for (dy=0; dy<y; dy++) {
        tempMap.push([]);
        for (dx=0; dx<x; dx++) {
            tempMap[dy].push("X");
        }
    }
    
    var origin = {
        x: 0,
        y: 0,
    };
    if (floor == 1) {
        origin.x = 2;
        origin.y = 0;
    }
    
    var walker = {
        hasExit: false
    };
    while (walker.hasExit === false) {
        walker = new Game.Map.Mapmaker.Walker({
            width: x,
            height: y,
            originX: origin.x,
            originY: origin.y,
            floorMap: tempMap,
        });
    }
    
    var plotter = new Game.Map.Mapmaker.Plotter(walker.floorMap);
    
    var tileMap = [];
    var ay = 0;
    var ax = 0;
    var by = 0;
    var bx = 0;
    for (dy=0; dy<y*7; dy++) {
        tileMap.push([]);
        by = dy%7;
        if (dy !== 0 && by === 0) {
            ay++;
        }
        ax = 0;
        for (dx=0; dx<x*9; dx++) {
            bx = dx%9;
            if (dx !== 0 && bx === 0) {
                ax++;
            }
            tileMap[dy].push(
                walker.floorMap[ay][ax].room.roomLayout[by][bx]
            );
        }
    }

    
    var mKey = "";
    for (dy=0; dy<y*7; dy++) {
        for (dx=0; dx<x*9; dx++) {
            mKey = dx+","+dy;
            // remember to refactor out the tempGlyph
            finalMap[mKey] = tileMap[dy][dx];
        }
    }
    return finalMap;
};

Game.Map.Mapmaker.Walker = function(params) {
    this._init(params);
};

Game.Map.Mapmaker.Walker.prototype._init = function(params) {
    this.width = params.width;
    this.height = params.height;
    this.originX = params.originX;
    this.originY = params.originY;
    this.floorMap = params.floorMap;
    this.walkPath = [];
    this.walkLength = 0;
    this.stepCount = 0;
    this.dirPath = [];
    this.hasExit = false;
    
    for (dy=0; dy<this.height; dy++) {
        for (dx=0; dx<this.width; dx++) {
            this.floorMap[dy][dx] = new Game.Map.Mapmaker.Cell({
                x: dx,
                y: dy,
            });
        }
    }
    
    this.walk(12);
};

Game.Map.Mapmaker.Walker.prototype.walk = function(steps) {
    this.walkLength = steps;
    
    var nextDir = "";
    var lastDir = [];
    var badCell = {};
    
    this.walkPath.push({
        x: this.originX,
        y: this.originY,
    });    
    
    // add the origin room to the walkPath and mark it walked
    this.currentCell().entry = true;
    this.currentCell().walked = true;
    
    while (this.walkPath.length < this.walkLength) {
        // save the last direction we moved in
        // unless the last move attempt was a dead end
        //if (nextDir !== false) {
        //    lastDir.push(nextDir);
        //}
        // pick a new random direction
        nextDir = this.pickSide(this.currentCell());
        // if it's a dead end, handle that appropriately
        // afaik it is literally impossible for you to hit a dead end before
        // your third step
        if (nextDir === false) {
            // pop off the dead end cell, we're not walking there
            this.currentCell().tempGlyph = "*";
            this.currentCell().dead = true;
            badCell = this.walkPath.pop();
            
            // back up a step
            this.stepCount--;
            // failure case
            if (this.stepCount == -1) {
                break;
            }

            // mark the dead end
            this.currentCell().sides[lastDir.pop()] = "dead";
            // I THINK THAT'S IT, WUUUUGH
        }
        else {
            // you picked a valid side, let's update everything
            // mark the current cell as walked
            this.currentCell().sides[nextDir] = "walked";
            lastDir.push(nextDir);
            this.currentCell().walkOrder = this.stepCount;
            // add the next cell to the end of the walkPath
            this.walkToCell(this.currentCell(), nextDir);
            // only increment the stepCount after you add an element
            // to the walkPath
            this.stepCount++;
            
        }
    }
    if (this.stepCount !== -1) {
        this.hasExit = true;
        this.currentCell().exit = true;
        this.currentCell().walkOrder = this.stepCount;
        this.currentCell().tempGlyph = "X";
    }
    this.dirPath = lastDir;
};

Game.Map.Mapmaker.Walker.prototype.currentCell = function() {
    return this.floorMap[
        this.walkPath[this.stepCount].y
    ][
        this.walkPath[this.stepCount].x
    ];
};

Game.Map.Mapmaker.Walker.prototype.walkToCell = function(cell, dir) {
    var next = {
        x: 0,
        y: 0,
    };
    // the tempGlyph lines in here are for debugging.
    switch (dir) {
        case "R":
            next.x = cell.x+1;
            next.y = cell.y;
            cell.tempGlyph = ">";
            break;
        case "L":
            next.x = cell.x-1;
            next.y = cell.y;
            cell.tempGlyph = "<";
            break;
        case "T":
            next.x = cell.x;
            next.y = cell.y-1;
            cell.tempGlyph = "A";
            break;
        case "B":
            next.x = cell.x;
            next.y = cell.y+1;
            cell.tempGlyph = "V";
            break;
    }
    this.walkPath.push(next);
};

Game.Map.Mapmaker.Walker.prototype.pickSide = function(cell) {
    var liberties = this.canWalk(cell);
    if (liberties.length === 0) {
        return false;
    }
    var chosen = rlMath.rand(0, liberties.length-1);
    return liberties[chosen];
};



Game.Map.Mapmaker.Walker.prototype.canWalk = function(cell) {
    var sides = [];
    var x = cell.x;
    var y = cell.y;
    for (var i in cell.sides) {
        if (cell.sides[i] == "open") {
            switch (i) {
                case "R":
                    if (this.floorMap[y][x+1].walkOrder == "unwalked") {
                        sides.push("R");
                    }
                    break;
                case "L":
                    if (this.floorMap[y][x-1].walkOrder == "unwalked") {
                        sides.push("L");
                    }
                    break;
                case "T":
                    if (this.floorMap[y-1][x].walkOrder == "unwalked") {
                        sides.push("T");
                    }
                    break;
                case "B":
                    if (this.floorMap[y+1][x].walkOrder == "unwalked") {
                        sides.push("B");
                    }
                    break;
            }
        }
    }
    return sides;
};

Game.Map.Mapmaker.Plotter = function(roomMap) {
    this._init(roomMap);
};

Game.Map.Mapmaker.Plotter.prototype._init = function(roomMap) {
    this.roomMap = roomMap;
    this.height = roomMap.length;
    this.width = roomMap[0].length;
    
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

Game.Map.Mapmaker.Plotter.prototype.fillWalls = function(cell) {
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

Game.Map.Mapmaker.Plotter.prototype.addDoors = function(cell) {
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


Game.Map.Mapmaker.Cell = function(params) {
    this._init(params);
};

// Cell.sides can be:
// "open"
// "walked"
// "wall"
// "bound"
// "door"
// "dead"

Game.Map.Mapmaker.Cell.prototype._init = function(params) {
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
    this.room = new Game.Map.Mapmaker.Room({
        roomType: "plain",
        roomStyle: "debug",
        roomGlyph: ".",
    });
    this.tempGlyph = ".";
    
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

Game.Map.Mapmaker.Room = function(params) {
    this._init(params);
};

Game.Map.Mapmaker.Room.prototype._init = function(params) {
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

// I don't have to call Game.init() here if I call it in the HTML file.