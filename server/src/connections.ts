import * as io from 'socket.io';

/* 
TODO make a common module for these settings 
so that they can be shared between client and server side code 
*/
const NAMESPACE = {
    TEST: '/test',
    CONTROLS_RELAY: '/controls-relay'
};

const GLOBAL_EVENTS = {
    LOG: 'log'
};

/* 

const CONTROLS = {
    UP: 'move-up',
    DOWN: 'move-down',
    LEFT: 'move-left',
    RIGHT: 'move-right'
}
 
*/

function openTestChannel(server, nsp=NAMESPACE.TEST) {
    const socket = io(server).of(nsp);
    socket.on('connection', function (socket) {
        socket.emit(GLOBAL_EVENTS.LOG, { 
            message: 'TestConnection Established', 
            nsp: nsp 
        })
        socket.on('my other event', function (data) {
            console.log(data);
        });
    });

}

// Simply relay all data from a single method and let clients handle controls
function openControlsRelayChannel(server, nsp=NAMESPACE.CONTROLS_RELAY) {
    const EVENTS = {
        CONTROLS: 'controls'
    }
    const socket = io(server).of(nsp);

    socket.on('connection', function (socket) {
        socket.emit(GLOBAL_EVENTS.LOG, { 
            message: 'ControlsRelayConnection Established', 
            nsp: nsp 
        })
        socket.on(EVENTS.CONTROLS, function (data) {
            socket.broadcast.emit(data);
        });
    });
}
