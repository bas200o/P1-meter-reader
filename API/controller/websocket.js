const config  = require('../config.json');
var io;

var Module = module.exports;
Module.setup = setup;
Module.sendLogMessage = sendLogMessage;

function setup (socketio) {
    io = socketio;

    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('event', (event) => {
            console.log(event);
        });
    });      
}

function sendLogMessage (log) {
    io.emit("log", log);
}


