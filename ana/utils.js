// All utility functions, etc etc

Function.prototype.inheritsFrom = function( parentClassOrObject ) {
    if ( parentClassOrObject.constructor == Function ) {
        //Normal Inheritance
        this.prototype = new parentClassOrObject();
        this.prototype.constructor = this;
        this.prototype.parent = parentClassOrObject.prototype;
    } else {
        //Pure Virtual Inheritance
        this.prototype = parentClassOrObject;
        this.prototype.constructor = this;
        this.prototype.parent = parentClassOrObject;
    }
    return this;
};

// GOD I USE THIS SO MUCH JEEZ
Array.prototype.dL = function() {
    return this.length - 1;
};

var Util = {
    
    // This is a lookup table for directions.
    DIRS4: {
        1: "R",
        2: "L",
        3: "T",
        4: "B",
    },
    
    DIRS8: {
        0: "",
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
        6: "",
        7: "",
        8: "",
    },
    
    
    
    
    
    
    
    
    
    
    
    
    
    
};
