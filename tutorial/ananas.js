//Ananas aus Caracas rot.js tutorial game
//aka Babby's first internet RL
var Player = function(x, y) {
    this._x = x;
    this._y = y;
    this._draw();
}

Player.prototype._draw = function() {
    Game.display.draw(this._x, this._y, "@", "#ff0");
}

Player.prototype.act = function() {
    Game.engine.lock();
    // wait for user input; do stuff when user hits a key
    window.addEventListener("keydown", this);
}

Player.prototype.getX = function() { return this._x }
Player.prototype.getY = function() { return this._y }

Player.prototype.handleEvent = function(e) {
    // process user input
    var keyMap = {
        38: 0,
        33: 1,
        39: 2,
        34: 3,
        40: 4,
        35: 5,
        37: 6,
        36: 7,
    };

    var code = e.keyCode;

    if (code == 13 || code == 32) {
        this._checkBox();
        return;
    }

    if (!(code in keyMap)) { return; }

    var diff = ROT.DIRS[8][keyMap[code]];
    var newX = this._x + diff[0];
    var newY = this._y + diff[1];

    var newKey = newX + "," + newY;
    if (!(newKey in Game.map)) { return; } // can't move in this direction

    Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y]);
    this._x = newX;
    this._y = newY;
    this._draw();
    window.removeEventListener("keydown", this);
    Game.engine.unlock();
}

Player.prototype._checkBox = function() {
    var key =  this._x + "," + this._y;
    if (Game.map[key] != "*") {
        alert("There is no box here!");
    } else if (key == Game.ananas) {
        alert("Hooray! You found an ananas and won this game.");
        Game.engine.lock();
        window.removeEventListener("keydown", this);
    } else {
        alert("This box is empty D:");
    }
}

var Pedro =  function(x, y) {
    this._x = x;
    this._y = y;
    this._draw();
}

Pedro.prototype._draw = function() {
    Game.display.draw(this._x, this._y, "P", "red");
}

Pedro.prototype.act = function() {
    var x = Game.player.getX();
    var y = Game.player.getY();
    var passableCallback = function(x, y) {
        return (x+","+y in Game.map);
    }
    var astar = new ROT.Path.AStar(x, y, passableCallback, {topology:4});

    var path = [];
    var pathCallback = function(x, y) {
        path.push([x, y]);
    }
    astar.compute(this._x, this._y, pathCallback);

    path.shift();
    if (path.length == 1) {
        Game.engine.lock();
        alert("Game over - you were captured by Pedro!");
    } else {
        x = path[0][0];
        y = path[0][1];
        Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y]);
        this._x = x;
        this._y = y;
        this._draw();
    }
}

var Game = {
    // The assignment syntax here uses : instead of = because everything
    // is being assigned as key: value pairs in a map instead of defining
    // them outside of the Game object. That's also why there are commas
    // after everything important.

    // The display is going to be our visible play area.
    // The map is our visible map, defined in... a map.
    display: null,
    map: {},
    engine: null,
    ananas: null,

    // The init function just fires up our primary behavior for the Game
    // object. I don't think it has to be called 'init'.
    init: function() {

        // We create a new display here, then we add it to the body of the
        // file in which the script is called as a child element.
        this.display = new ROT.Display();
        document.body.appendChild(this.display.getContainer());

        // Then we generate the map.
        this._generateMap();

        var scheduler = new ROT.Scheduler.Simple();
        scheduler.add(this.player, true);
        scheduler.add(this.pedro, true);
        this.engine = new ROT.Engine(scheduler);
        this.engine.start();
    },

    // This is our internal function to generate a new map in our newly-
    // created display.
    _generateMap: function() {

        // We create a new digger, which I presume is a map generator, then
        // we create an empty array to hold our empty cells as strings with
        // x,y coordinates.
        var digger = new ROT.Map.Digger();
        var freeCells = [];

        // Here, we create our callback function to pass to the digger. The
        // digger will use this to generate our map. The callback tells the
        // digger how to handle each coordinate pair in the map.
        var digCallback = function(x, y, value) {

            // If there is already a value assigned to x,y, we just return.
            // This ensures a floor tile will return itself and a wall tile
            // that runs through the digger will be turned into floor.
            if (value) { return; } /* do not store walls */

            // The value of key here is a string in the form "10,10". Then
            // we assign a floor tile, ".", to that coordinate in the map.
            // Then we take that key and push it into the freeCells array
            // so we know it's a floor tile for when we place our boxes.
            var key = x+","+y;
            this.map[key] = ".";
            freeCells.push(key);
        }

        // This binds our digCallback function to the values of the object in
        // which it was originally defined. So when the digger calls it, it
        digger.create(digCallback.bind(this));

        this._generateBoxes(freeCells);

        this._drawWholeMap();

        this.player = this._createBeing(Player, freeCells);
        this.pedro = this._createBeing(Pedro, freeCells);
    },

    _generateBoxes: function(freeCells) {
        for (var i=0;i<10;i++) {
            var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
            var key = freeCells.splice(index, 1)[0];
            this.map[key] = "*";
            // First box contains an ananas. This checks to see if i is false,
            // which will only be true on the first iteration, while i = 0.
            if (!i) { this.ananas = key; }
        }
    },

    _drawWholeMap: function() {
        for (var key in this.map) {
            var parts = key.split(",");
            var x = parseInt(parts[0]);
            var y = parseInt(parts[1]);
            this.display.draw(x, y, this.map[key]);
        }
    },

    _createBeing: function(what, freeCells) {
        var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
        var key = freeCells.splice(index, 1)[0];
        var parts = key.split(",");
        var x = parseInt(parts[0]);
        var y = parseInt(parts[1]);
        return new what(x, y);
    }
};

// I don't have to call Game.init() here if I call it in the HTML file.
