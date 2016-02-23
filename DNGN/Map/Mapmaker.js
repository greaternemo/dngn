DNGN.Map.Mapmaker = function(x, y, floor) {
    var tempMap = [];
    var finalMap = {};
    var dy = 0;
    var dx = 0;
    for (dy=0; dy<y; dy++) {
        tempMap.push([]);
        for (dx=0; dx<x; dx++) {
            tempMap[dy].push("X");
        }
    }
    
    var origin = {
        x: 0,
        y: 0,
    };
    if (floor == 1) {
        origin.x = 2;
        origin.y = 0;
    }
    
    var walker = {
        hasExit: false
    };
    while (walker.hasExit === false) {
        walker = new DNGN.Map.Mapmaker.Walker({
            width: x,
            height: y,
            originX: origin.x,
            originY: origin.y,
            floorMap: tempMap,
        });
    }
    
    var plotter = new DNGN.Map.Mapmaker.Plotter(walker.floorMap);
    
    // building a tile map to expand our smaller room map into our larger visible map
    var tileMap = [];
    var ay = 0;
    var ax = 0;
    var by = 0;
    var bx = 0;
    for (dy=0; dy<y*7; dy++) {
        tileMap.push([]);
        for (dx=0; dx<x*9; dx++) {
            // prepopulate the entire map with wall tiles
            tileMap[dy].push(new DNGN.Map.Tile("wall"));
        }
    }
    var newtype = "";
    for (dy=0; dy<y*7; dy++) {
        by = dy%7;
        if (dy !== 0 && by === 0) {
            ay++;
        }
        ax = 0;
        for (dx=0; dx<x*9; dx++) {
            bx = dx%9;
            if (dx !== 0 && bx === 0) {
                ax++;
            }
            newtype = DNGN.Map.Tile.convert(
                "ch", 
                "type", 
                walker.floorMap[ay][ax].room.roomLayout[by][bx]
            );
            if (newtype != "wall") {
                tileMap[dy][dx].typeFlip(newtype);
            }
            //tileMap[dy].push(
            //    walker.floorMap[ay][ax].room.roomLayout[by][bx]
            //);
        }
    }

    
    var mKey = "";
    for (dy=0; dy<y*7; dy++) {
        for (dx=0; dx<x*9; dx++) {
            mKey = dx+","+dy;
            finalMap[mKey] = tileMap[dy][dx];
        }
    }
    return finalMap;
};