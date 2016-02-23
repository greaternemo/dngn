//dngn: the rl
//based on Ananas aus Caracas rot.js tutorial game

// Here's something to think about:
// How much polyfill are you willing to write because you're afraid to use the
// functions in the ECMAScript documentation with the little Erlenmeyer flasks
// next to them to mark them as experiemental?
// As of 15 July 15, a lot.

var Game = {
    // The assignment syntax here uses : instead of = because everything
    // is being assigned as key: value pairs in a map instead of defining
    // them outside of the Game object. That's also why there are commas
    // after everything important.

    // Common variable definitions.

    // The display is going to be our visible play area.
    display: null,

    // Our visible map
    map: {},

    // UNIMPLEMENTED: Map tiles that need to be redrawn
    _dirtyMap: [],

    // UNIMPLEMENTED: Current floor as an int
    //currentFloor: 0,

    // UNIMPLEMENTED: All floors
    //floors: [],

    // The game engine
    engine: null,

    // Our mcguffin
    ananas: null,
    
    // Moving our scheduler to outside of init, God help us
    scheduler: null,
    
    // Gonna need that action engine
    //actionEngine: new actionEngine(),

    // Our message log
    // We can extend the shit out of this later to save an entire game's log.
    log: [" ", " ", " ", " ", " "],

    init: function() {

        this.display = new ROT.Display({
            width: 80,
            height: 33
        });
        document.body.appendChild(this.display.getContainer());

        this._generateMap();

        //var scheduler = new ROT.Scheduler.Simple();
        //scheduler.add(this.player, true);
        //scheduler.add(this.pedro, true);
        //this.engine = new ROT.Engine(scheduler);
        //this.engine.start();

        // TIME TO TAKE THIS NEW ENGINE FOR A SPIN
        this.scheduler = new actScheduler();
        this.scheduler.addMob(this.player);
        this.scheduler.addMob(this.pedro);
        this.engine = new gameEngine(this.scheduler);
        this.engine.start();
    },

    // This is our internal function to generate a new map in our newly-
    // created display.
    _generateMap: function() {

        // We create a new digger, which I presume is a map generator, then
        // we create an empty array to hold our empty cells as strings with
        // x,y coordinates.
        //var digger = new ROT.Map.Digger(80, 25);
        //var freeCells = [];

        // Here, we create our callback function to pass to the digger. The
        // digger will use this to generate our map. The callback tells the
        // digger how to handle each coordinate pair in the map.
        //var digCallback = function(x, y, value) {

        // If there is already a value assigned to x,y, we just return.
        // This ensures a floor tile will return itself and a wall tile
        // that runs through the digger will be turned into floor.
        // For the digger, 0 is a floor tile and 1 is a wall.
        //if (value == 1) { return; }

        // The value of key here is a string in the form "10,10". Then
        // we assign a floor tile, ".", to that coordinate in the map.
        // Then we take that key and push it into the freeCells array
        // so we know it's a floor tile for when we place our boxes.
        //var key = x+","+y;
        //var point = this.clean("xy", key);
        //this.map[key] = this._createTile("floor", point);
        //freeCells.push(key);
        //};

        // This binds our digCallback function to the values of the object in
        // which it was originally defined. 
        //digger.create(digCallback.bind(this));

        // THAT NEW SHIT
        var newMap = new gameMap(25, 80);
        // coming soon: 8x8 rooms
        // var newMap = new gameMap(24, 80);
        var freeCells = newMap._freeCells;
        this.map = newMap._fullMap;

        this._generateBoxes(freeCells);

        this._drawWholeMap();

        this.player = this._createMob(Player, freeCells);
        this.pedro = this._createMob(Pedro, freeCells);
    },

    _generateBoxes: function(freeCells) {
        for (var i = 0; i < 10; i++) {
            var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
            var key = freeCells.splice(index, 1)[0];
            this.map[key].setSym("*");
            // First box contains an ananas. This checks to see if i is false,
            // which will only be true on the first iteration, while i = 0.
            if (!i) {
                this.ananas = key;
            }
        }
    },

    // Private method that redraws the whole map
    _drawWholeMap: function() {
        for (var key in this.map) {
            var point = this.clean("xy", key);
            //var parts = key.split(",");
            //var x = parseInt(parts[0]);
            //var y = parseInt(parts[1]);
            //var x = this.map[key].getX();
            //var y = this.map[key].getY();
            this.display.draw(point.x, point.y, this.map[key]);
        }
    },

    // Private method that redraws only tiles marked to be redrawn
    _drawDirtyMap: function() {
        //placeholder
    },

    // Old _createMob function, mostly untouched from the tutorial.
    //_createMob: function(type, maxHP, freeCells) {
    //    var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
    //    var key = freeCells.splice(index, 1)[0];
    //    var parts = key.split(",");
    //    var x = parseInt(parts[0]);
    //    var y = parseInt(parts[1]);
    //    var HP = parseInt(maxHP);
    //    return new type(x, y, HP);
    //},

    // Updated _createMob function, this is going to be our factory method that
    // will make a Mob for us of the specified type and then send it back.
    _createMob: function(type, freeCells) {
        var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
        var key = freeCells.splice(index, 1)[0];
        var point = this.clean("xy", key);
        var base = this._newMobBase(type.prototype.constructor.name);
        return new type(point, base);
    },

    // This is our factory method that accepts the type of Tile and the x,y point
    // where it's located and returns a new Tile of the specified type.
    _createTile: function(type, point) {
        var base = this._newTileBase(type);
        return new Tile(point, base);
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

    // This is a function that _createMob will use. It accepts a Mob type
    // as its only argument and returns the relevant dataset to create a new
    // Mob object of that type.
    _newMobBase: function(type) {
        var output;
        switch (type) {
            case "Player":
                output = {
                    type: "player",
                    name: "Player",
                    sym: "@",
                    color: "#ff0",
                    maxHP: 5,
                    speed: 15,
                    nrg: 0,
                };
                break;
            case "Pedro":
                output = {
                    type: "pedro",
                    name: "Pedro",
                    sym: "P",
                    color: "red",
                    maxHP: 1,
                    speed: 10,
                    nrg: 0,
                };
                break;
        }
        return output;
    },

    // This is a function that _createTile will use. It accepts a Tile type
    // as its only argument and returns the relevant dataset to create a new
    // Tile object of that type.
    _newTileBase: function(type) {
        var output;
        switch (type) {
            case "floor":
                output = {
                    type: "floor",
                    sym: ".",
                    blocked: false,
                    mob: null,
                };
                break;
        }
        return output;
    },

    // This is the public method that the other _draw methods will use
    // to send messages to the scrolling log.
    updateLog: function(message) {
        var total = this.log.unshift(message);
        if (total == 6) {
            this.log.pop();
        }
        this._drawLog();
    },

    // This is the private method that updateLog uses to actually write
    // the log to the screen in a neat scrolling fashion.
    _drawLog: function() {
        for (var i = 0; i < 5; i++) {
            this.display.drawText(0, 28 + i, this.log[i]);
        }
    },    
    
};

// I don't have to call Game.init() here if I call it in the HTML file.