// DNGN.BASE is going to be a collection of flywheel objects for assembly.


DNGN.BASE = {
    // These are all instances of DNGN.Map.Tile, keyed by type
    Tiles: {
        wall: {
            type: "wall",
            ch: "#",
            fg: "black",
            bg: "black",
            walk: false,
        },
        floor: {
            type: "floor",
            ch: ".",
            fg: "darkkhaki",
            bg: "black",
            walk: true,            
        },
        door: {
            type: "door",
            ch: "+",
            fg: "chocolate",
            bg: "black",
            walk: true,
        },
        stairup: {
            type: "stairup",
            ch: "<",
            fg: "green",
            bg: "black",
            walk: true,
        },
        stairdn: {
            type: "stairdn",
            ch: ">",
            fg: "red",
            bg: "black",
            walk: true,
        },
        
    },
    
    
};