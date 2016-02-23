// This one's going to be a monster: my map generator.

function gameMap(height, width) {
    //placeholder
    this._init(height, width);
}



// prototypes go down here

gameMap.prototype.constructor = gameMap;


gameMap.prototype._init = function(height, width) {
    this._ly = height;
    this._lx = width;
    this._ry = height/5;
    this._rx = width/5;
    this._roomMap = [];
    this._fullMap = {};
    // there has to be a better way to do this than with freeCells.
    // we'll get there. just stay the course.
    this._freeCells = [];
    
    this.buildMap();
};

// This builds our basic roomMap and then generates rooms inside it. Wugh.
// Your roomMap, when finished, will be an array containing arrays (y axis),
// containing arrays (x axis), containing arrays (y axis), containing arrays
// (x axis).
gameMap.prototype.buildMap = function() {
    //var rly = this._ry;
    //var rlx = this._rx;
    //var rdy = rly - 1;
    //var rdx = rlx - 1;
    var rMap = {
        ly: this._ry,
        lx: this._rx,
        dy: this._ry - 1,
        dx: this._rx - 1,
    };
    var y = 0;
    var x = 0;
    var temp = [];
    for (y = 0; y < rMap.ly; y++) {
        this._roomMap.push([]);
        temp.push([]);
        for (x = 0; x < rMap.lx; x++) {
            this._roomMap[y].push([]);
            temp[y].push("empty");
        }
    }
    
    // This is where shit gets real.
    var mStat = {
        count: 0,
        bail: 0,
        ready: false,
    };
    var count = 0;
    var bail = 0;
    
    // First, we pick a random point in the roomMap.
    //var sy = rlMath.rand(0, rdy);
    //var sx = rlMath.rand(0, rdx);
    
    // Revamping some of this to use objects instead of just leaving vars
    // hanging all over this mother.
    var oRoom = {
        y: rlMath.rand(0, rMap.dy),
        x: rlMath.rand(0, rMap.dx),
        side: "",
    };
    
    // Then, we create a temp array and a starting room.
    var tr1 = this._createRoom();
    var ready = false;
    while (mStat.ready === false) {
        if (tr1.totalOpenSides() < 2) {
            tr1 = this._createRoom();
        }
        // Alternate version else if
        else if (rlMath.openSides(tr1._layout).R === false) {
            tr1 = this._createRoom();
        }
        else {
            //temp[oRoom.y][oRoom.x] = tr1;
            // Alternate version
            temp[0][0] = tr1;
            mStat.ready = true;
            count++;
        }
    }
    
    // Once that's in the temp array, we start trying to stick rooms onto that
    // first one.
    
    var ty = oRoom.y;
    var tx = oRoom.x;
    var tdy = 0;
    var tdx = 0;
    var tr = null;
    var ltr = tr1;
    //var side = null;
    // Alternate version of side
    var side = "R";
    var delt = null;
    //for (mStat.count; mStat.count < 12; mStat.count++) {
    // Alternate version
    for (y=0; y < rMap.ly; y++) {
        for (x=0; x < rMap.lx-1; x++) {
            mStat.ready = false;
            tr = this._createRoom();
            while (mStat.ready === false) {
                if (rlMath.rand(1, 10) > 5) {
                    tr.randAlt();
                }
                if (tr.totalOpenSides() < 2) {
                    tr = this._createRoom();
                }
                else {
                    //side = ltr.randOpen();
                    // Commented out side for alternate version
                    delt = rlMath.sideToInt(side);
                    tdy = delt.y + ty;
                    tdx = delt.x + tx;
                    //if ((0 <= tdy <= rMap.dy) !== true) {
                    //    ltr.alter("flipT");
                    //}
                    //else if ((0 <= tdx <= rMap.dx) !== true) {
                    //    ltr.alter("flipL");
                    //}
                    //else if (rlMath.matchEdges(
                    if (rlMath.matchEdges(
                      ltr._layout, side, tr._layout) === false) {
                        tr = this._createRoom();
                    }
                    else {
                        //temp[tdy][tdx] = tr;
                        // Alternate version
                        temp[y][x+1] = tr;
                        ltr = tr;
                        mStat.ready = true;
                    }
                }
                //if (mStat.bail == 200) {
                //    break;
                //}
                //mStat.bail++;
            }
        }
    }
    
    // Once that's done, we fill the room map.
    for (y = 0; y < rMap.ly; y++) {
        for (x = 0; x < rMap.lx; x++) {
            if (temp[y][x] == "empty") {
                // Alternate version, changed from FullRoom
                this._roomMap[y][x] = this._createRoom();
            }
            else {
                this._roomMap[y][x] = temp[y][x];
            }
        }
    }
    
    // AND I'LL FORM THE HEAD
    // Building the game map.
    // Note: this section is kinda legacy support as fuck
    var rmy = this._roomMap.length;
    var rmx = this._roomMap[0].length;
    var rfy = 0;
    var rfx = 0;
    var theY = 0;
    var theX = 0;
    var mapKey = "";
    for (y = 0; y < rMap.ly; y++) {
        for (x = 0; x < rMap.lx; x++) {
            for (rfy = 0; rfy < rmy; rfy++) {
                for (rfx = 0; rfx < rmx; rfx++) {
                    theY = (y * 5) + rfy;
                    theX = (x * 5) + rfx;
                    mapKey = theX+","+theY;
                    if (this._roomMap[y][x]._layout[rfy][rfx] == ".") {
                        this._fullMap[mapKey] = Game._createTile(
                          "floor", {x: theX, y: theY});
                        this._freeCells.push(mapKey);
                    }
                }
            }
        }
    }
    
    
};
    
gameMap.prototype._checkBounds = function(room, ty, tx, dy, dx) {
    var output = {
        R: "",
        L: "",
        T: "",
        B: "",
    };
    for (var dir in output) {
        //placeholder
        if (0 <= (rlMath.sideToInt(dir).y+ty) <= dy) {
            if (0 <= rlMath.sideToInt(dir).x+tx <= dx) {
                if (rlMath.openSides(room)[dir] === true) {
                    output[dir] = true;
                }
            }
        }
        else {
            output[dir] = false;
        }
    }
};

gameMap.prototype._createRoom = function() {
    var seed = rlMath.rand(1, 20);
    var base = this._newRoomBase(seed.toString());
    return new Room(base);
};

gameMap.prototype._createFullRoom = function() {
    var full = [
        "# # # # #",
        "# # # # #",
        "# # # # #",
        "# # # # #",
        "# # # # #",
    ];
    return new Room(full);
};

// premade rooms, yesssssssss

gameMap.prototype._newRoomBase = function(type) {
    // oh lord we gona die, jesus take the wheel
    var output = null;
    switch(type) {
        case "1": 
            output = [
                "# # . # #",
                ". . . . .",
                ". . # . .",
                ". . . . .",
                "# # . # #"
            ];
            break;
        case "2": 
            output = [
                ". . . # .",
                ". # . # .",
                ". . . # .",
                "# # # # .",
                ". . . . ."
            ];
            break;
        case "3": 
            output = [
                ". . . . #",
                ". . # . #",
                ". # # . #",
                ". . . . #",
                "# # # # #"
            ];
            break;
        case "4": 
            output = [
                "# # . # #",
                ". # . . .",
                ". . . . .",
                ". # . . .",
                "# # . # #"
            ];
            break;
        case "5": 
            output = [
                "# . # # #",
                "# . # # #",
                ". . . . #",
                "# # # . #",
                "# # # . ."
            ];
            break;
        case "6":
            output = [
                "# # # # #",
                "# # # # #",
                ". . . . .",
                "# # # # .",
                "# # # # #"
            ];
            break;
        case "7":
            output = [
                "# # . # #",
                ". . . . .",
                ". # # # #",
                ". # # # #",
                "# # # # #"
            ];
            break;
        case "8": 
            output = [
                ". . . . .",
                "# # . # #",
                "# # . # #",
                ". . . . .",
                "# # # # #"
            ];
            break;
        case "9": 
            output = [
                ". . . . .",
                ". # . . .",
                ". # # # .",
                ". . . # .",
                ". . . . ."
            ];
            break;
        case "10": 
            output = [
                ". . . . .",
                ". . # . .",
                ". # # # .",
                ". . # . .",
                ". . . . ."
            ];
            break;
        case "11": 
            output = [
                "# # . # #",
                "# # . # #",
                "# . . . #",
                ". . . . .",
                "# # . # #"
            ];
            break;
        case "12": 
            output = [
                "# # . . #",
                ". # # . #",
                ". # # . .",
                ". . . . .",
                "# # . # #"
            ];
            break;
        case "13": 
            output = [
                "# # . . #",
                "# # # . .",
                ". . # # .",
                "# . . # #",
                "# # . # #"
            ];
            break;
        case "14": 
            output = [
               "# # . # #",
               ". . . . .",
               ". # # # .",
               ". # # # .",
               "# # # # #"
            ];
            break;
        case "15": 
            output = [
                "# # # # #",
                ". . . . .",
                "# # . . .",
                ". . . . .",
                "# # # # #"
            ];
            break;
        case "16": 
            output = [
                "# # . . .",
                ". . . # #",
                ". . . . .",
                ". # # # .",
                "# # # # ."
            ];
            break;
        case "17": 
            output = [
                "# . # . #",
                ". . . . .",
                "# . # . #",
                ". . . . .",
                "# . # . #"
            ];
            break;
        case "18": 
            output = [
                ". . . . .",
                ". . . . .",
                ". . . . .",
                ". . . . .",
                "# # # # #"
            ];
            break;
        case "19": 
            output = [
                "# # . # #",
                ". . . . .",
                "# # # # #",
                ". . . . .",
                "# # . # #"
            ];
            break;
        case "20": 
            output = [
                "# # . # #",
                "# . . # .",
                "# . # # .",
                "# . . . .",
                "# # . # #"
            ];
            break;
        
        
            
            
            
            
            
    }
    return output;
};

gameMap.prototype._newNEWRoomBase = function(type) {
    // oh lord we gona die, jesus take the wheel
    var output = null;
    switch(type) {
        case "1": 
            output = [
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
            ];
            break;
        case "2": 
            output = [
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
            ];
            break;
        case "3": 
            output = [
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
            ];
            break;
        case "4": 
            output = [
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
            ];
            break;
        case "5": 
            output = [
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
            ];
            break;
        case "6":
            output = [
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
            ];
            break;
        case "7":
            output = [
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
            ];
            break;
        case "8": 
            output = [
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
            ];
            break;
        case "9": 
            output = [
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
            ];
            break;
        case "10": 
            output = [
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
            ];
            break;
        case "11": 
            output = [
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
            ];
            break;
        case "12": 
            output = [
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
            ];
            break;
        case "13": 
            output = [
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
            ];
            break;
        case "14": 
            output = [
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
            ];
            break;
        case "15": 
            output = [
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
            ];
            break;
        case "16": 
            output = [
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
            ];
            break;
        case "17": 
            output = [
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
            ];
            break;
        case "18": 
            output = [
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
            ];
            break;
        case "19": 
            output = [
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
            ];
            break;
        case "20": 
            output = [
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
                "........",
            ];
            break;
        
        
            
            
            
            
            
    }
    return output;
};