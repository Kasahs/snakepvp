import * as io from 'socket.io'
import {PlayerControl} from 'common-entity/player-control'

/**
 * TODO make a common module for these settings
 * so that they can be shared between client and server side code
 */

export const NAMESPACE = {
    TEST: '/test',
    CONTROLS_RELAY: '/controls-relay'
}

export const GLOBAL_EVENTS = {
    LOG: 'log',
    ROOM: 'room'
}


export const openTestChannel = (server, nsp=NAMESPACE.TEST) => {
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
export const openControlsRelayChannel =
    (server, nsp:string=NAMESPACE.CONTROLS_RELAY) => {
    const EVENTS = {
        CONTROLS: 'controls',
        PEER_CONTROLS: 'peer-controls'
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
                    socketManager.clients((error, clients:string[]) => {
                        socket.broadcast.emit('peers', {peers: clients})
                    })
                }
            })
        })

        socket.on(EVENTS.CONTROLS, (control: PlayerControl) => {
            console.log('got keydown:')
            console.log(control)
            socket.broadcast.emit(EVENTS.CONTROLS, control)
        })
    })
}


