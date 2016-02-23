// I should've known better than to think I could get away with trying to write
// a roguelike without some complicated damn math happening. This may be a bit
// much, but I'm pulling some of the heavy lifting out now so I can use it in
// more of a widespread way. (SPOILER: IT TURNED OUT NOT TO BE A BIT MUCH.)

DNGN.Util = {

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
    
    // This is a function to parse deltas, because lord only knows that's a thing
    // that will be done a lot.
    

    
    rand: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    // Most of what I have in here right now is shape math, used to alter two-
    // dimensional arrays.
    
    flipY: function(val) {
        return val.reverse();
    },
    
    flipX: function(val) {
        var ly = val.length;
        for (y = 0; y < ly; y++) {
            val[y].reverse();
        }
    },

    // turn90 is nasty and great care must be taken to use it properly.
    // Most of the other math functions, the simpler ones, take advantage
    // of Array.prototype.reverse(), which modifies the array in place. Since
    // the array itself is modified, you don't have to return it: you just
    // changed the one you had in the first place. turn90 doesn't do that. 
    // Since it transposes the elements of the array you pass in, it builds an
    // entirely new array and sends that back to you. 
    turn90: function(val) {
        var temp = [];
        var ly = val.length;
        var dy = ly-1;
        var lx = val[0].length;
        var dx = lx-1;
        for (i = lx; i > 0; i--) {
            temp.push([]);
        }
        for (y = 0; y < ly; y++) {
            for (x = dx; x > -1; x--) {
                temp[x][dy] = val[y][x];
            }
            dy--;
        }
        return temp;
    },

    turn180: function(val) {
        var ly = val.length;
        val.reverse();
        for (y = 0; y < ly; y++) {
            val[y].reverse();
        }
    },

    // This basically works the same way as turn90, just in the opposite
    // direction. It was WAY EASIER to figure this one out than turn90. ^___^;;

    turn270: function(val) {
        var temp = [];
        var ly = val.length;
        var dy = ly-1;
        var lx = val[0].length;
        var dx = lx-1;
        for (i = lx; i > 0; i--) {
            temp.push([]);
        }
        for (y = 0; y < ly; y++) {
            for (x = 0; x < lx; x++) {
                temp[dx][y] = val[y][x];
                dx--;
            }
            dx = lx-1;
        }
        return temp;
    },
    
    mirrorL: function(val) {
        var ly = val.length;
        var lx = val[0].length;
        var dx = lx-1;
        var mod = lx % 2;
        var half = (lx - mod) / 2;
        var hx = half + mod;
        for (y = 0; y < ly; y++) {
            for (x = 0; x < hx; x++) {
                val[y][dx-x] = val[y][x];
            }
        }
        
    },

    mirrorR: function(val) {
        var ly = val.length;
        var lx = val[0].length;
        var dx = lx-1;
        var mod = lx % 2;
        var half = (lx - mod) / 2;
        var hx = half + mod;
        for (y = 0; y < ly; y++) {
            for (x = 0; x < hx; x++) {
                val[y][x] = val[y][dx-x];
            }
        }
        
    },
    
    mirrorT: function(val) {
        var ly = val.length;
        var lx = val[0].length;
        var dy = ly-1;
        var mod = ly % 2;
        var half = (ly - mod) / 2;
        var hy = half + mod;
        for (y = 0; y < hy; y++) {
            for (x = 0; x < lx; x++) {
                val[dy-y][x] = val[y][x];
            }
        }
        
    },
    
    mirrorB: function(val) {
        var ly = val.length;
        var lx = val[0].length;
        var dy = ly-1;
        var mod = ly % 2;
        var half = (ly - mod) / 2;
        var hy = half + mod;
        for (y = 0; y < hy; y++) {
            for (x = 0; x < lx; x++) {
                val[y][x] = val[dy-y][x];
            }
        }
        
    },
    
    mirrorTL: function(val) {
        //placeholder
    },
    
    mirrorTR: function(val) {
        //placeholder
    },
    
    mirrorBL: function(val) {
        //placeholder
    },
    
    mirrorBR: function(val) {
        //placeholder
    },
    
    // DON'T FORGET TO FIX THIS
    // YOU ALSO NEED TO ACCOUNT FOR DIFFERING OCTANTS
    plot: function(y, x) {
        this._layout[y][x] = "X";
    },

    // This is my implementation of Bresenham's line algorithm. I still need to
    // update it to work for other octants. Right now it's only written to work
    // with lines that proceed from 0,0 down-right with a greater x value.
    bestLine: function(y0, x0, y1, x1) {
        var dx = x1 - x0;
        var dy = y1 - y0;

        var dif = 2*dy - dx;
        // DON'T FORGET TO FIX THIS BIT
        this.plot(y0, x0);
        var y = y0;

        for (x = x0+1; x < x1; x++) {
            if (diff > 0) {
                y += 1;
                this.plot(y, x);
                diff += (2*dy-2*dx);
            }
            else {
                this.plot(y, x);
                diff += 2*dy;
            }
        }
        
    },
    
    matchEdges: function(room1, side, room2) {
        var r1ly = room1.length;
        var r1lx = room1[0].length;
        var r1dy = r1ly - 1;
        var r1dx = r1lx - 1;
        var r2ly = room2.length;
        var r2lx = room2[0].length;
        var r2dy = r2ly - 1;
        var r2dx = r2lx - 1;
        var y = 0;
        var x = 0;
        var output = null;
        var results = {};
        
        switch(side) {
            case "R":
                for (y = 0; y < r1ly; y++) {
                    if (room1[y][r1dx] == room2[y][0]) {
                        if (room1[y][r1dx] == ".") {
                            results[y] = ".";
                        }
                        else {
                            results[y] = "#";
                        }
                    }
                    else {
                        results[y] = false;
                    }
                }
                break;
            case "L":
                for (y = 0; y < r1ly; y++) {
                    if (room1[y][0] == room2[y][r2dx]) {
                        if (room1[y][0] == ".") {
                            results[y] = ".";
                        }
                        else {
                            results[y] = "#";
                        }
                    }
                    else {
                        results[y] = false;
                    }
                }
                break;
            case "T":
                for (x = 0; x < r1lx; x++) {
                    if (room1[0][x] == room2[r2dy][x]) {
                        if (room1[0][x] == ".") {
                            results[x] = ".";
                        }
                        else {
                            results[x] = "#";
                        }
                    }
                    else {
                        results[x] = false;
                    }
                }
                break;
            case "B":
                for (x = 0; x < r1lx; x++) {
                    if (room1[r1dy][x] == room2[0][x]) {
                        if (room1[r1dy][x] == ".") {
                            results[x] = ".";
                        }
                        else {
                            results[x] = "#";
                        }
                    }
                    else {
                        results[x] = false;
                    }
                }
                break;
        }
        for (var num in results) {
            if (results[num] == ".") {
                return true;
            }
            else if (results[num] == "#") {
                output++;
            }
        }
        num = 0;
        for (num in results) {
            num++;
        }
        if (output == num) {
            return true;
        }
        else {
            return false;
        }
    },
    
    sideToInt: function(side) {
        switch(side) {
            case "R":
                return {
                    y: 0,
                    x: 1,
                };
            case "L":
                return {
                    y: 0,
                    x: -1,
                };
            case "T":
                return {
                    y: -1,
                    x: 0,
                };
            case "B":
                return {
                    y: 1,
                    x: 0,
                };
        }
    },
    
    openSides: function(room) {
        var ly = room.length;
        var dy = ly - 1;
        var y = 0;
        var lx = room[0].length;
        var dx = lx - 1;
        var x = 0;
        var output = {
            R: false,
            L: false,
            T: false,
            B: false,
        };
        // test right
        for (y = 0; y < ly; y++) {
            if (room[y][dx] == ".") {
                output.R = true;
            }
        }
        // test left
        for (y = 0; y < ly; y++) {
            if (room[y][0] == ".") {
                output.L = true;
            }
        }
        // test top
        for (x = 0; x < lx; x++) {
            if (room[0][x] == ".") {
                output.T = true;
            }
        }
        // test bottom
        for (x = 0; x < lx; x++) {
            if (room[dy][x] == ".") {
                output.B = true;
            }
        }
        return output;
    },
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        

};