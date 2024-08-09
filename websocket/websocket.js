// websocket.js
const socketIo = require('socket.io');

let io;

function init(server) {
    io = socketIo(server);
    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });

        // Additional socket event handlers can be added here
    });
}

function notifyMatchFound(match) {
    io.emit('matchFound', match);
}

function notifyMatchUpdated(match) {
    io.emit('matchUpdated', match);
}

module.exports = {
    init,
    notifyMatchFound,
    notifyMatchUpdated
};
