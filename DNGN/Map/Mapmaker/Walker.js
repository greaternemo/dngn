DNGN.Map.Mapmaker.Walker = function(params) {
    this._init(params);
};

DNGN.Map.Mapmaker.Walker.prototype._init = function(params) {
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
    
    var dy = 0;
    var dx = 0;
    for (dy=0; dy<this.height; dy++) {
        for (dx=0; dx<this.width; dx++) {
            this.floorMap[dy][dx] = new DNGN.Map.Mapmaker.Cell({
                x: dx,
                y: dy,
            });
        }
    }
    
    this.walk(12);
};

DNGN.Map.Mapmaker.Walker.prototype.walk = function(steps) {
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

DNGN.Map.Mapmaker.Walker.prototype.currentCell = function() {
    return this.floorMap[
        this.walkPath[this.stepCount].y
    ][
        this.walkPath[this.stepCount].x
    ];
};

DNGN.Map.Mapmaker.Walker.prototype.walkToCell = function(cell, dir) {
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

DNGN.Map.Mapmaker.Walker.prototype.pickSide = function(cell) {
    var liberties = this.canWalk(cell);
    if (liberties.length === 0) {
        return false;
    }
    var chosen = DNGN.Util.rand(0, liberties.length-1);
    return liberties[chosen];
};



DNGN.Map.Mapmaker.Walker.prototype.canWalk = function(cell) {
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