import * as io from 'socket.io-client'
import * as $ from 'jquery'

const NAMESPACES = {
    TEST: '/test',
    CONTORLS: '/controls-relay'
}

const GLOBAL_EVENTS = {
    LOG: 'log',
    ROOM: 'room'
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
    CONTROLS: 'controls'
}

/**
 * Set default peerControlsHandler.
 * All subsequent HANDLERS will also be added to this obj
 */
const HANDLERS = {
    peerControlsHandler: (data) => {
        console.log('recieved controls input')
        console.dir(data)
    }
}

let controlsChannel:SocketIOClient.Socket = null

/**
 * set handler for responding to input recieved from other players(peers)
 * @param handler
 */
const setPeerControlsHandler = (handler) => {
    if (handler instanceof Function) {
        HANDLERS.peerControlsHandler = handler
    }
}

/**
 * Initialize the controls relay namespace socket io connection.
 * @param nsp namespace of the channel
 */
const initControlsChannel = (roomName=null, nsp=NAMESPACES.CONTORLS) => {

    // start socket io connection with namespace
    controlsChannel = io(nsp)
    controlsChannel.on(GLOBAL_EVENTS.LOG, (data) => {
        console.log(data)

    })

    controlsChannel.emit(GLOBAL_EVENTS.ROOM, {roomName: roomName})


    controlsChannel.on(EVENTS.CONTROLS, HANDLERS.peerControlsHandler)

    return controlsChannel

}

/**
 * emit user's controls to server
 * @param event Keyboard event for controls pressed by user
 */
const emitClientControls = (event:KeyboardEvent) => {
    if (controlsChannel == null) {
        let errMsg = `controlsChannel Not Initialized
         - please call init before emitClientControls is called.`
        throw new Error(errMsg)
    }

    controlsChannel.emit(EVENTS.CONTROLS, event)
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
    initTestChannel(roomName)
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
    initControlsChannel,
    emitClientControls,
    init
}
