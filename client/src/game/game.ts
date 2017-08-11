import * as net from './networking'
import 'window'
import 'document'

const keyDownHandler = (e:KeyboardEvent) => {
    /* TODO ignore all no game keydowns */
    net.emitClientControls(e)
    // TODO doCanvasPaintForClient();
}


const peerControlsHandler = (event) => {
    // TODO doCanvasPaintForPeers();
}


const start = () => {
    document.addEventListener('keydown', keyDownHandler)

    /* net.init will fail without this handler */
    net.setPeerControlsHandler(peerControlsHandler)
    /**
     * when URL already has a room name automatically join that room.
     * If not show create room wizard and wait for correct input
     */
    if (!isNullUndifinedOrEmptyString(window.location.hash)) {
        net.init(window.location.hash)
    } else {
        let el:Element =  document.querySelector('.create-room-wizard')
        let createRoomBtn = el.querySelector('.create-room.btn')
        el.setAttribute('style', 'display:block')
        createRoomBtn.addEventListener('click', (e:MouseEvent) => {
            let roomNameEl:Element = el.querySelector('.room-name')
            let roomName:string = roomNameEl.getAttribute('val') || null
            if (!isNullUndifinedOrEmptyString(roomName)) {
                net.init(roomName)
            } else {
                console.error('Room name cannot be empty')
            }
        })
    }
    /* TODO show invite url to user once connection to room established */
    /**
     * TODO handle the case when peer joins room
     * when he joins show play with peer button
     * just see if each client is recieving each other's controls
     */
    /* TODO Handle case where room name is empty */
    /* TODO handle case where init fails due to unavailability of room name */
}

const isNullUndifinedOrEmptyString = (str:string) => {
    if (str === null || str === undefined || str === "") {
        return true
    } else {return false}
}