// Our rendering engine, we're basically writing a new renderer over the one
// that rot.js provides. Game will create a single instance of this and any
// object in Game that needs to draw will talk to the active renderEngine.

function renderEngine(display) {
    //placeholder
    
    // Requires a ROT.Display object as an argument, uses it to draw things.
    this._display = display;
    this._subs = {};
    
    draw = function() {
        //placeholder
    };
    
    redraw = function() {
        //placeholder
    };
    
    // A factory method to create subdisplays within the main display.
    // Returns nothing but adds the new subdisplay to the renderEngine's
    // _subs map.
    // To use this, you feed it the type of subDisplay you want, the top left
    // origin point of the subDisplay in the main display, and the key, which
    // is basically the name you'll refer to it by when you want to draw to it.
    createSubDisplay = function(type, point, key) {
        //placeholder
        var base = _subDisplayBase(type);
        var sub = new subDisplay(point, base, key);
        this._subs[key] = sub;
    };
    
    // A method for our subdisplay factory to get base info by type.
    _subDisplayBase = function(type) {
        var output = null;
        switch(type) {
            case "map":
                output = {
                    //placeholder
                    type: "map",
                };
                break;
            case "stats":
                output = {
                    //placeholder
                    type: "stats",
                };
                break;
            case "log":
                output = {
                    //placeholder
                    type: "log",
                };
                break;
        }
        return output;
    };
    
    
}

// This is our Screen object. Here's the breakdown:
// Each Display can have multiple screens of equivalent size.
// Each Screen can have multiple subScreens.
function Screen() {
    //placeholder
}

// This is a sub-display object that will functionally allow us to create
// smaller displays within a larger one, while internally handling the rendering
// math.
function subScreen(point, base, key) {
    //placeholder
    this._x = point.x;
    this._y = point.y;
    
    this._type = base.type;
    this._key = key;
}

