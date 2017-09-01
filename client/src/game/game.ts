import * as net from './networking'
import { PlayerControl } from "common-entity/player-control"

const keyDownHandler = (e:KeyboardEvent) => {
    /* TODO ignore all non game keydowns */
    let li = document.createElement('li')
    li.innerHTML = `sent:${e.code}`
    let ul = document.querySelector('ul.actions')
    ul.appendChild(li)
    net.emitClientControls(e)
    // TODO doCanvasPaintForClient();
}


const peerControlsHandler = (control: PlayerControl) => {
    // TODO doCanvasPaintForPeers();
    let li = document.createElement('li')
    li.innerHTML = `recieved:${control.name}`
    // FIXME reduntand DOM selection
    let ul = document.querySelector('ul.actions')
    ul.appendChild(li)
}


const peerConnectionHandler = (peers:string[]) => {
    // TODO
    console.log('peerConnectionHandler')
}


const start = () => {


    /* net.init will fail without this handler */
    net.setPeerControlsHandler(peerControlsHandler)
    net.setPeerConnectionHandler(peerConnectionHandler)
    /**
     * when URL already has a room name automatically join that room.
     * If not show create room wizard and wait for correct input
     */
    if (window.location.hash) {
        // remove the # in front
        net.init(window.location.hash.slice(1))
        document.addEventListener('keydown', keyDownHandler)
    } else {
        let el:Element =  document.querySelector('.create-room-wizard')
        let createRoomBtn = el.querySelector('.create-room.btn')
        el.setAttribute('style', 'display:block')
        createRoomBtn.addEventListener('click', (e:MouseEvent) => {
            let roomNameEl:HTMLInputElement =
                <HTMLInputElement>el.querySelector('.room-name')
            let roomName:string = roomNameEl.value || null
            if (!isNullUndifinedOrEmptyString(roomName)) {
                net.init(roomName)
                document.addEventListener('keydown', keyDownHandler)
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
    /* TODO case where init fails due to unavailability of room name */
}

const isNullUndifinedOrEmptyString = (str:string) => {
    if (str === null || str === undefined || str === "") {
        return true
    } else {return false}
}

export {start}