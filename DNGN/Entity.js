/**
* actual comments to follow
*/

DNGN.Entity = function() {
    this.id = 0;
    this.states = {};
    this.baseClass = "";
    this.baseKey = "";
};

// These builder functions are based on sets of flyweight information in DNGN.BASE

// builds an object based on its key attribute
DNGN.Entity.prototype.build = function (newKey) {
    for (var baseAttr in DNGN.BASE[this.baseClass][newKey]) {
        this[baseAttr] = DNGN.BASE[this.baseClass][newKey][baseAttr];
    }
};

// basically rebuilds an object based on a change to its key attribute
DNGN.Entity.prototype.rebuild = function (bAttr) {
    this[this.baseKey] = bAttr;
    this.build(bAttr);
};

DNGN.Entity.prototype.rStates = function () {
    return this.states;
};

DNGN.Entity.prototype.hasState = function(aState) {
    return this.states.hasOwnProperty(aState);
};

DNGN.Entity.prototype.uStates = function (nStates) {
    for (var myState in nStates) {
        this[myState] = nStates[myState];
    }
};

DNGN.Entity.prototype.rParts = function () {
    return Object.getOwnPropertyNames(this);
};

DNGN.Entity.prototype.hasPart = function (part) {
    return this.hasOwnProperty(part);
};

// this is dumb, come on
//DNGN.Entity.prototype.addPart = function(part, name) {
//    this[name] = part;
//};

// This will ONLY accept a string in its current form.
//DNGN.Entity.prototype.delPart = function(part) {
//    if (this.hasPart(part) === true) {
//        delete this[part];
//    }
//};

// This is just an example of how you can add functions.
function talk() {
    return function(val) {
        console.log(val);
    };
}
