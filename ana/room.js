// Rooms! Rooms are basically going to be our puzzle pieces for mapmaking.
// HERE'S HOW IT IS:

// Rooms will be 5x5 for starters:
//  baseLayout = [
//      "# # # + #",
//      "# . . . #",
//      "+ . . # #",
//      "# . . . #",
//      "# # # + #",
//  ];
// I can take that and run it through a converter to build actual arrays
// for the room objects:
//  this._layout = [];
//  this._builder = function(base) {
//      var len = base.length;
//      for (var i = 0; i < len; i++) {
//          this._layout.push(base[i].split(" "));
//      }
//  }

// I'll need to differentiate between wall, door, and floor on the edges.
// I can use a function to check the types, that will give me more room
// to breathe when matching them together like a puzzle, I won't have to
// save all that info in the objects if I can just return that in a method.

function Room(base) {
    this._init(base);
}

Room.prototype.constructor = Room;

Room.prototype._init = function(base) {
    this._layout = [];
    this._openSides = null;
    this._build(base);
};

Room.prototype._build = function(base) {
    var ly = base.length;
    for (var y = 0; y < ly; y++) {
        this._layout.push(base[y].split(" "));
    }
    this._processStats();
};

Room.prototype._processStats = function() {
    this._openSides = rlMath.openSides(this._layout);
};

Room.prototype.totalOpenSides = function() {
    var total = 0;
    for (var i in this._openSides) {
        if (this._openSides[i] === true) {
            total++;
        } 
    }
    return total;
};

Room.prototype.showMe = function() {
    var ly = this._layout.length;
    for (var y = 0; y < ly; y++) {
        var output = "";
        var lx = this._layout[y].length;
        for (var x = 0; x < lx; x++) {
            output += this._layout[y][x];
        }
        console.log(output);
    }
};

Room.prototype.randOpen = function() {
    var temp = [];
    for (var i in this._openSides) {
        if (this._openSides[i] === true) {
            temp.push(i);
        }
    }
    var seed = rlMath.rand(1, temp.length-1);
    return temp[seed];
};

Room.prototype.randAlt = function() {
    var seed = rlMath.rand(1, 9);
    switch(seed) {
        case "1":
            this.alter("flipY");
            break;
        case "2":
            this.alter("flipX");
            break;
        case "3":
            this.alter("mirrorR");
            break;
        case "4":
            this.alter("mirrorL");
            break;
        case "5":
            this.alter("mirrorT");
            break;
        case "6":
            this.alter("mirrorB");
            break;
        case "7":
            this.alter("turn90");
            break;
        case "8":
            this.alter("turn180");
            break;
        case "9":
            this.alter("turn270");
            break;
    }
};

Room.prototype.alter = function(how) {
    var output = null;
    switch(how) {
        case "flipY": 
            rlMath.flipY(this._layout);
            break;
        case "flipX":
            rlMath.flipX(this._layout);
            break;
        case "mirrorR":
            rlMath.mirrorR(this._layout);
            break;
        case "mirrorL":
            rlMath.mirrorL(this._layout);
            break;
        case "mirrorT":
            rlMath.mirrorT(this._layout);
            break;
        case "mirrorB":
            rlMath.mirrorB(this._layout);
            break;
        case "turn90":
            output = rlMath.turn90(this._layout);
            break;
        case "turn180":
            rlMath.turn180(this._layout);
            break;
        case "turn270":
            output = rlMath.turn270(this._layout);
            break;
    }
    if (output) {
        this._layout = output;
    }
    this._processStats();
};