import * as io from 'socket.io-client';

const NAMESPACES = {
    TEST: '/test',
    CONTORLS: '/controls-relay'
};

const GLOBAL_EVENTS = {
    LOG: 'log'
};

function connectTestChannel(nsp:string=NAMESPACES.TEST){
    const socket = io(nsp); 
    socket.on(GLOBAL_EVENTS.LOG, function (data) {
        console.log(data);
        //TODO change this event name and make it easier to find remove hard coded strings
        socket.emit('my other event', { my: 'data' });
    });
}

function connectToControlsRelayChannel(nsp=NAMESPACES.CONTORLS){
    const socket = io(nsp);
    socket.on
}

export {connectTestChannel}