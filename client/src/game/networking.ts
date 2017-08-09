
import * as io from 'socket.io-client'

const NAMESPACES = {
    TEST: '/test',
    CONTORLS: '/controls-relay'
}

const GLOBAL_EVENTS = {
    LOG: 'log'
}


function initTestChannel(nsp:string=NAMESPACES.TEST){
    const socket = io(nsp) 
    socket.on(GLOBAL_EVENTS.LOG, function (data) {
        console.log(data)
        //TODO change this event name and make it easier to find remove hard coded strings
        socket.emit('my other event', { my: 'data' })
    })

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
    peerControlsHandler: function(data){
        console.log('recieved controls input')
        console.dir(data)
    }
}

var controlsChannel:SocketIOClient.Socket = null

/**
 * set the handler which will respond to controls input recieved from other players(peers)
 * @param handler 
 */
function setPeerControlsHandler(handler){
    if (handler instanceof Function){
        HANDLERS.peerControlsHandler = handler
    }    
}

/**
 * Initialize the controls relay namespace socket io connection.
 * @param nsp namespace of the channel
 */
function initControlsChannel(nsp=NAMESPACES.CONTORLS){

    // start socket io connection with namespace
    controlsChannel = io(nsp)
    controlsChannel.on(GLOBAL_EVENTS.LOG, function(data){
        console.log(data)

    })

    controlsChannel.on(EVENTS.CONTROLS, HANDLERS.peerControlsHandler)
    

    return controlsChannel
    
}

/**
 * emit user's controls to server
 * @param event Keyboard event for controls pressed by user
 */
function emitClientControls(event:KeyboardEvent){
    if (controlsChannel == null){
        throw new Error('controlsChannel Not Initialized - please call init before emitClientControls is called.')        
    }

    controlsChannel.emit(EVENTS.CONTROLS, event)
}

function init(){
    initTestChannel();
    initControlsChannel();
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

