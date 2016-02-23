// This is my event handler. Right now, it kinda makes sense to me in concept,
// so hopefully I can get it to do a thing.

// class definition first for the handler
function eventHub() {
    //placeholder as fuck

}

// prototypes
eventHub.prototype.init_ = function() {
    // you know, that stuff you need

    // So this might be overkill? idk. I'll keep a list of channels designated
    // by a unique identifier. Each channel will contain all the listeners for
    // that channel. I might not need multiple channels, we'll see.
    this.channels = {};

    // This is just our event queue. SEEMS SIMPLE ENOUGH RIGHT? WHAT COULD GO
    // WRONG??
    this.queue = [];
};

eventHub.prototype.addChannel = function() {};

eventHub.prototype.delChannel = function() {};

eventHub.prototype.addEars = function() {};

eventHub.prototype.delEars = function() {};

eventHub.prototype.processNext = function() {};

eventHub.prototype.report = function() {};

// more placeholder

// This is going to be our subject class, the one that provides the notify
// method to everyone who needs to be heard.
function eventNavi() {
    // HEY LISTEN
    // I'll probably rename this later, idk

    this.init_();
}

// prototypes

eventNavi.prototype.init_ = function() {
    // placeholder
    this.notify = function() {
        // Send the notification data to the game's eventHub
    };
};

// more placeholder