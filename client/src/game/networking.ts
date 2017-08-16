import * as io from 'socket.io-client'
import * as $ from 'jquery'
import { PlayerControl } from 'common-entity/player-control'

const NAMESPACES = {
    TEST: '/test',
    CONTORLS: '/controls-relay'
}

const GLOBAL_EVENTS = {
    LOG: 'log',
    ROOM: 'room',
    PEERS: 'peers'
}


const initTestChannel = (roomName=null, nsp:string=NAMESPACES.TEST) => {
    const socket = io(nsp)
    socket.on(GLOBAL_EVENTS.LOG, (data) => {
        console.log(data)
        //TODO change this event name
        // make it easier to find remove hard coded strings
        socket.emit('my other event', { my: 'data' })
    })
    socket.emit(GLOBAL_EVENTS.ROOM, {roomName: roomName})
    return socket
}


/**
 * All Events required for pvp
 */
const EVENTS = {
    CONTROLS: 'controls',
}

/**
 * Set default peerControlsHandler.
 * All subsequent HANDLERS will also be added to this obj
 */
const HANDLERS = {
    peerControlsHandler: (control:PlayerControl) => {
        console.log('recieved controls input')
        console.dir(control)
    },

    peerConnectionHandler: (peers:string[]) => {
        console.log('recieved list of peers')
        console.dir(peers)
    }
}

let controlsChannel:SocketIOClient.Socket = null

/**
 * set handler for responding to input recieved from other players(peers)
 * @param handler
 */
const setPeerControlsHandler = (handler: (e:PlayerControl) => any) => {
    HANDLERS.peerControlsHandler = handler
}

const setPeerConnectionHandler = (handler: (peers:string[]) => any) => {
    HANDLERS.peerControlsHandler
}

/**
 * Initialize the controls relay namespace socket io connection.
 * @param nsp namespace of the channel
 */
const initControlsChannel = (roomName=null, nsp=NAMESPACES.CONTORLS) => {
    // start socket io connection with namespace
    // TODO do proper error handling
    try {
        controlsChannel = io(nsp)
    } catch(e) {
        console.log(e)
    }
    controlsChannel.on(GLOBAL_EVENTS.LOG, (data) => {
        console.log(data)

    })

    controlsChannel.emit(GLOBAL_EVENTS.ROOM, {roomName: roomName})
    controlsChannel.on(GLOBAL_EVENTS.PEERS, (data) => {
        HANDLERS.peerConnectionHandler(data.peers)
    })


    controlsChannel.on(EVENTS.CONTROLS, HANDLERS.peerControlsHandler)

    return controlsChannel

}

const enum CONTROLS {
    LEFT = 37,
    UP = 38,
    RIGHT = 39,
    DOWN = 40
}

/**
 * emit user's controls to server
 * @param event Keyboard event for controls pressed by user
 */
const emitClientControls = (event:KeyboardEvent) => {
    if (controlsChannel == null) {
        let errMsg = `controlsChannel Not Initialized
         - please call net.init before emitClientControls is called.`
        throw new Error(errMsg)
    }

    let validKeys:number[] = [
        CONTROLS.UP, CONTROLS.LEFT,
        CONTROLS.RIGHT, CONTROLS.DOWN
    ]
    // do somethingonly if keypress is valid
    if (validKeys.indexOf(event.keyCode) > -1) {
        console.log(event)
        let control = new PlayerControl(event.keyCode, event.code)
        controlsChannel.emit(EVENTS.CONTROLS, control)
    }

}

/**
 * to confirm if room with given name is available
 * @param roomName name of the rame user wants
 */
const getRoom = (roomName:string): Promise<any> => {
    let promise = new Promise( (resolve, reject) => {
        $.get('/api/getroom?room=' + roomName).done((res) => {
            console.log(res)
            if (res.status === 200) {
                resolve(res.data)
            }
        }, (res) => {
            reject(res)
        })
    })

    return promise
}

const init = (roomName) => {
    // initTestChannel(roomName)
    initControlsChannel(roomName)
    /* TODO check room availability */
    /* getRoom(roomName).then(function(data:any){
        let roomName = null, roomUrl = null;
        roomName = data.roomName || roomName;
        roomUrl = data.roomUrl || roomUrl;
        initTestChannel(roomName);
        initControlsChannel(roomName);
    }, function(data){
        console.error('Could not join a room, can not initialize game');
    }); */
}

export {
    EVENTS,
    NAMESPACES,
    GLOBAL_EVENTS,
    initTestChannel,
    controlsChannel,
    setPeerControlsHandler,
    setPeerConnectionHandler,
    initControlsChannel,
    emitClientControls,
    init
}
