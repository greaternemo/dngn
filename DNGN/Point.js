// Yes, I'm creating a class for a point on a grid, because it's a thing I use
// all the bleeding time.

// The Point class is built on a 2D grid, starting with 0,0 in the top left.
// There are no negative values. X increases to the right, Y increases downward.

/*
x,y:

0,0 1,0 2,0 3,0 4,0
0,1 1,1 2,1 3,1 4,1
0,2 1,2 2,2 3,2 4,2
*/

DNGN.Point = function(x, y) {
    this.x = x;
    this.y = y;
};

DNGN.Point.prototype.xKey = function () {
    return this.x+","+this.y;
};
DNGN.Point.prototype.yKey = function() {
    return this.y+","+this.x;
};
