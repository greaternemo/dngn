var Game = {
    intv: (1000 / 30),
    fader: 0.125,
    can: {
        w: 400,
        h: 400
    },
    gly: {
        '#': "wall",
        '+': "door",
        '.': "floor",
        '~': "void",
    },
    roomBase: [
        ["~", "~", "~", "~", "~", "#", ".", "#", "~", "~", "~", "~", "~"],
        ["~", "#", "#", "#", "#", "#", ".", "#", "#", "#", "#", "#", "~"],
        ["~", "#", ".", ".", ".", ".", ".", ".", ".", ".", ".", "#", "~"],
        ["~", "#", ".", ".", ".", ".", ".", ".", ".", ".", ".", "#", "~"],
        ["~", "#", ".", ".", ".", ".", ".", ".", ".", ".", ".", "#", "~"],
        ["#", "#", ".", ".", ".", ".", ".", ".", ".", ".", ".", "#", "#"],
        [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
        ["#", "#", ".", ".", ".", ".", ".", ".", ".", ".", ".", "#", "#"],
        ["~", "#", ".", ".", ".", ".", ".", ".", ".", ".", ".", "#", "~"],
        ["~", "#", ".", ".", ".", ".", ".", ".", ".", ".", ".", "#", "~"],
        ["~", "#", ".", ".", ".", ".", ".", ".", ".", ".", ".", "#", "~"],
        ["~", "#", "#", "#", "#", "#", ".", "#", "#", "#", "#", "#", "~"],
        ["~", "~", "~", "~", "~", "#", ".", "#", "~", "~", "~", "~", "~"]
    ],
    tinyRoomBase: [
        ["#", "#", ".", "#", "#"],
        ["#", "#", "+", "#", "#"],
        [".", "+", ".", "+", "."],
        ["#", "#", "+", "#", "#"],
        ["#", "#", ".", "#", "#"]
    ],
    spr: {
        img: new Image(),
        iw: 16,
        ih: 16,
        ow: 16,
        oh: 16,
        wall: {
            x: 0,
            y: 0,
            pass: {
                walk: false,
            },
            gly: "#",
        },
        void: {
            x: 0,
            y: 0,
            pass: {
                walk: false,
            },
            gly: "~",
        },
        floor: {
            x: 16,
            y: 0,
            pass: {
                walk: true,
            },
            gly: ".",
        },
        door: {
            x: 16,
            y: 0,
            pass: {
                walk: true,
            },
            gly: "+",
        },
        man: {
            x: 32,
            y: 0
        },
        cultist: {
            x: 48,
            y: 0
        },
        orb: {
            x: 64,
            y: 0
        }
    },
    dWalls: {
        size: {
            w: 25,
            h: 25,
        },
        rows: [0, 24],
        cols: [0, 24],
    },
};

Game.Sprite = function() {
    this.x;
    this.y;
    this.img;
    this.kind;
}

Game.Mob = function(params) {
    this.spr = new Game.Sprite();
    this.loc = {
        x: 0,
        y: 0,
    };

    this.init(params);
};

Game.Mob.prototype.init = function(params) {
    this.loc.x = params.loc.x;
    this.loc.y = params.loc.y;
    this.spr.kind = params.kind;
    this.spr.x = Game.spr[params.kind].x;
    this.spr.y = Game.spr[params.kind].y;
    this.spr.img = Game.spr.img;
};

Game.Tile = function(params) {
    this.spr = new Game.Sprite();
    this.pass = {
        walk: null,
    };
    this.gly = "";
    this.loc = {
        x: 0,
        y: 0,
    };
    this.mob = null;
    this.item = null;

    this.init(params);
}

Game.Tile.prototype.init = function(params) {
    this.loc.x = params.loc.x;
    this.loc.y = params.loc.y;
    this.kind = params.kind;
    this.spr.x = Game.spr[params.kind].x;
    this.spr.y = Game.spr[params.kind].y;
    this.spr.img = Game.spr.img;
    this.pass.walk = Game.spr[params.kind].pass.walk;
    this.gly = Game.spr[params.kind].gly;
};

Game.init = function() {
    var canvas = document.getElementById('playArea').getContext('2d');
    var mobArea = document.getElementById('mobArea');
    var mArea = mobArea.getContext('2d');
    var aRow = 0;
    var cRow = 0;
    var dRow = 0;
    var aCol = 0;
    var cCol = 0;
    var dCol = 0;
    var here = {
        x: 1,
        y: 1,
    };

    Game.spr.img.onload = function() {
        // draw floor tiles on the whole thing
        for (aCol = 0; aCol < Game.dWalls.size.w; aCol++) {
            for (aRow = 0; aRow < Game.dWalls.size.h; aRow++) {
                canvas.drawImage(Game.spr.img,
                    Game.spr.floor.x, Game.spr.floor.y,
                    Game.spr.iw, Game.spr.ih,
                    (aCol * Game.spr.ow), (aRow * Game.spr.oh),
                    Game.spr.ow, Game.spr.oh);
            }
        }
        for (cRow = 0; cRow < Game.dWalls.rows.length; cRow++) {
            for (dRow = 0; dRow < Game.dWalls.size.w; dRow++) {
                canvas.drawImage(Game.spr.img,
                    Game.spr.wall.x, Game.spr.wall.y,
                    Game.spr.iw, Game.spr.ih,
                    (Game.dWalls.rows[cRow] * Game.spr.ow), (dRow * Game.spr.oh),
                    Game.spr.ow, Game.spr.oh);
            }
        }
        for (cCol = 0; cCol < Game.dWalls.cols.length; cCol++) {
            for (dCol = 0; dCol < Game.dWalls.size.h; dCol++) {
                canvas.drawImage(Game.spr.img,
                    Game.spr.wall.x, Game.spr.wall.y,
                    Game.spr.iw, Game.spr.ih,
                    (dCol * Game.spr.ow), (Game.dWalls.cols[cCol] * Game.spr.oh),
                    Game.spr.ow, Game.spr.oh);
            }
        }
        mArea.drawImage(Game.spr.img,
            Game.spr.man.x, Game.spr.man.y,
            Game.spr.iw, Game.spr.ih,
            (here.x * Game.spr.ow), (here.y * Game.spr.oh),
            Game.spr.ow, Game.spr.oh);
        canvas.drawImage(mobArea,
            0, 0,
            Game.can.w, Game.can.h,
            0, 0,
            Game.can.w, Game.can.h);
        window.addEventListener('keydown', Game.spr.img);
    };

    Game.spr.img.src = 'sheet.png';

    Game.spr.img.handleEvent = function(e) {
        var dx = 0;
        var dy = 0;
        //var fh = 1;
        //var ft = 0;
        var frCnt = 0;
        var mVect = {
            x: (here.x * Game.spr.ow),
            y: (here.y * Game.spr.oh),
        };
        var there = {
            x: 0,
            y: 0
        };
        var mFlag = false;

        var moveIntv;

        function moveMob() {
            //setInterval(redraw, Game.intv);
            redraw();
        }

        function moveDone() {
            clearTimeout(moveIntv);
            mFlag = false;
            window.addEventListener('keydown', Game.spr.img);
        }


        function redraw() {
            // Clear the tile we moved from and redraw it empty
            //mArea.clearRect(mVect.x, mVect.y,
            //    Game.spr.ow, Game.spr.oh);
            mArea.clearRect((here.x * Game.spr.ow), (here.y * Game.spr.oh),
                            Game.spr.ow, Game.spr.oh);
            mArea.clearRect((there.x * Game.spr.ow), (there.y * Game.spr.oh),
                            Game.spr.ow, Game.spr.oh);
            
            // Move the mVect for our frame
            mVect.x += dx;
            mVect.y += dy;

            // Redraw the floor tile we're moving to and the floor tile we're moving from
            canvas.drawImage(Game.spr.img,
                Game.spr.floor.x, Game.spr.floor.y,
                Game.spr.iw, Game.spr.ih,
                (here.x * Game.spr.ow), (here.y * Game.spr.oh),
                Game.spr.ow, Game.spr.oh);
            canvas.drawImage(Game.spr.img,
                Game.spr.floor.x, Game.spr.floor.y,
                Game.spr.iw, Game.spr.ih,
                (there.x * Game.spr.ow), (there.y * Game.spr.oh),
                Game.spr.ow, Game.spr.oh);

            // Redraw the player sprite at the new postiion and then WE'RE DONE HERE
            /*
            mArea.drawImage(Game.spr.img,
                Game.spr.man.x, Game.spr.man.y,
                Game.spr.iw, Game.spr.ih,
                mVect.x, mVect.y,
                Game.spr.ow, Game.spr.oh);
            */
            frCnt += 1;
            
            mArea.globalAlpha = (frCnt * Game.fader);
            mArea.drawImage(Game.spr.img,
                Game.spr.man.x, Game.spr.man.y,
                Game.spr.iw, Game.spr.ih,
                (here.x * Game.spr.ow), (here.y * Game.spr.oh),
                Game.spr.ow, Game.spr.oh);
            canvas.drawImage(mobArea,
                0, 0,
                Game.can.w, Game.can.h,
                0, 0,
                Game.can.w, Game.can.h);
            
            mArea.globalAlpha = 1 - (frCnt * Game.fader);
            mArea.drawImage(Game.spr.img,
                Game.spr.man.x, Game.spr.man.y,
                Game.spr.iw, Game.spr.ih,
                (there.x * Game.spr.ow), (there.y * Game.spr.oh),
                Game.spr.ow, Game.spr.oh);

            canvas.drawImage(mobArea,
                0, 0,
                Game.can.w, Game.can.h,
                0, 0,
                Game.can.w, Game.can.h);


            // Break the loop if we're done moving
            //if (((here.x * Game.spr.ow) == mVect.x) && ((here.y * Game.spr.oh) == mVect.y)) {
            if (frCnt == 8) {
                moveDone();
            } else {
                setTimeout(redraw, Game.intv);
            }
        }

        // DON'T YOU DO A FUCKING THING UNTIL I TELL YOU WE'RE DONE HERE
        window.removeEventListener('keydown', Game.spr.img);
        console.log(e);
        there.x += here.x;
        there.y += here.y;

        // Update the here coordinates to the new position based on the input we get
        switch (e.code) {
            case "ArrowUp":
                if (here.y > 1) {
                    dy = -1;
                    mFlag = true;
                } else {
                    console.log("can't move up");
                }
                break;
            case "ArrowRight":
                if (here.x < 23) {
                    dx = 1;
                    mFlag = true;
                } else {
                    console.log("can't move right");
                }
                break;
            case "ArrowDown":
                if (here.y < 23) {
                    dy = 1;
                    mFlag = true;
                } else {
                    console.log("can't move down");
                }
                break;
            case "ArrowLeft":
                if (here.x > 1) {
                    dx = -1;
                    mFlag = true;
                } else {
                    console.log("can't move left");
                }
                break;
        }
        if (mFlag === true) {
            here.x += dx;
            here.y += dy;
            dx *= (Game.spr.oh / 8);
            dy *= (Game.spr.oh / 8);
            moveMob();
        } else {
            window.addEventListener('keydown', Game.spr.img);
        }
    }
};