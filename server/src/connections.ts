import * as io from 'socket.io'
import { PlayerControl } from 'common-entity/player-control'

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
    ROOM: 'room',
    ERROR: 'app-error'
}

export const ERRORS = {
    ROOM_NOT_JOINED: 'err:room-not-joined'
}


export const openTestChannel = (server, nsp = NAMESPACE.TEST) => {
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
    (server, nsp: string = NAMESPACE.CONTROLS_RELAY) => {
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
                console.log(`request to join room name: ${data.roomName}`)
                socket.join(data.roomName, (error) => {
                    if (!error) {
                        socketManager.in(data.roomName)
                            .clients((error, clients: string[]) => {
                                // send to ALL members in room
                                /* socket.nsp.to(data.roomName)
                                    .emit('peers', { peers: clients }) */
                                // cleaner way
                                socketManager.in(data.roomName)
                                    .emit('peers', { peers: clients })
                            })

                    }
                })
            })

            socket.on(EVENTS.CONTROLS, (control: PlayerControl) => {
                console.log('got keydown:')
                console.log(control)
                let rooms:string[] = Object.keys(socket.rooms)
                let room:string|null = null
                if (rooms.length > 1) {
                    room = rooms[1]
                }
                if (room) {
                    socket.broadcast.to(room)
                        .emit(EVENTS.CONTROLS, control)
                } else {
                    socket.emit(GLOBAL_EVENTS.ERROR, {
                        msg: 'Client has not joined any room',
                        code: ERRORS.ROOM_NOT_JOINED
                    })
                }

            })
        })
    }


