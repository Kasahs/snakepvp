import * as io from 'socket.io'

/**
 * TODO make a common module for these settings
 * so that they can be shared between client and server side code
 */

const NAMESPACE = {
    TEST: '/test',
    CONTROLS_RELAY: '/controls-relay'
}

const GLOBAL_EVENTS = {
    LOG: 'log',
    ROOM: 'room'
}


const openTestChannel = (server, nsp=NAMESPACE.TEST) => {
    const socketManager = io(server).of(nsp)
    socketManager.on('connection', (socket) => {
        socket.emit(GLOBAL_EVENTS.LOG, {
            message: 'TestConnection Established',
            nsp: nsp
        })
        socket.on('my other event', (data) => {
            console.log(data)
        })

        socket.on(GLOBAL_EVENTS.ROOM, (data) => {
            socket.join(data.roomName)
        })
    })

}

/**
 * Makes a socket io connection over given namespace,
 * which handles all game inter-client communication.
 * @param server NodeHttp server to attach to
 * @param nsp Namespace to connect to
 */
const openControlsRelayChannel =
    (server, nsp:string=NAMESPACE.CONTROLS_RELAY) => {
    const EVENTS = {
        CONTROLS: 'controls'
    }
    const socketManager = io(server).of(nsp)

    socketManager.on('connection', (socket) => {
        socket.emit(GLOBAL_EVENTS.LOG, {
            message: 'ControlsRelayConnection Established',
            nsp: nsp
        })

        socket.on(GLOBAL_EVENTS.ROOM, (data) => {
            socket.join(data.roomName, (error) => {
                if(!error) {
                    socketManager.clients((error, clients) => {
                        socket.emit('peers', {peers: clients})
                    })
                }
            })
        })

        socket.on(EVENTS.CONTROLS, (data) => {
            socket.broadcast.emit(data)
        })
    })
}
