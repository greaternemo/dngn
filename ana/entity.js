function entityEngine() {
}



// The basic entity class we're going to use.
// God help us all.

function entity() {
    //placeholder
    this.id = 0;
}

// Prototypes wooo

entity.prototype.hasPart = function(part) {
    var parts = Object.getOwnPropertyNames(this);
    for (var x in parts) {
        if (parts[x] == part) {
            return true;
        }
    }
    return false;
};

entity.prototype.addPart = function(part, name) {
    this[name] = part;
};

// This will ONLY accept a string in its current form.
entity.prototype.delPart = function(part) {
    if (this.hasPart(part) === true) {
        delete this[part];
    }
};

// This is just an example of how you can add functions.
function talk() {
    return function(val) {
        console.log(val);
    };
}
