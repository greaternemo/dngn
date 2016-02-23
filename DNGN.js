/**
* @namespace
* Global DNGN namespace
*/

var DNGN = {
    /*
    // Constants
    
    // Variables to maintain
    engine: null,
    scheduler: null,
    display: null,
    map: null,
    log: null,
    
    
};

DNGN.init = function() {
    
}; */

    engine: null,
    scheduler: null,
    display: null,
    map: {},
    // UNIMPLEMENTED: Map tiles that need to be redrawn
    //_dirtyMap: [],
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
        
        this.scheduler = new DNGN.Scheduler();
        this.scheduler.addMob(this.player);
        this.engine = new DNGN.Engine(this.scheduler);
        this.engine.start();

    },

    _generateMap: function() {
        var newMap = new DNGN.Map(5, 4);
        this.map = newMap.fullMap;

        this._drawWholeMap();
        //this.player = this._createMob(Player, freeCells);
        this.player = this._createMob();
    },

    // Private method that redraws the whole map
    _drawWholeMap: function() {
        //var fg = "";
        for (var key in this.map) {
            var point = DNGN.Util.clean("xy", key);
            /*switch (this.map[key]) {
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
            }*/
            this.display.draw(point.x, point.y, this.map[key].ch, this.map[key].fg);
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
    //_createMob: function(type, freeCells) {
    _createMob: function() {
        //var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
        //var key = freeCells.splice(index, 1)[0];
        // shortcutting this for now, forcing start point
        var point = DNGN.Util.clean("xy", "22,3");
        //var base = this._newMobBase(type.prototype.constructor.name);
        // shortcutting this for now, forcing Player type
        return new DNGN.Mob.Player(point, this._newMobBase("Player"));
    },

    /*
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
    */

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

    /*
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
    */
};