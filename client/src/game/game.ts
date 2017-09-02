import { Snake } from './snake'
import * as net from 'game/networking'
import { PlayerControl } from "common-entity/player-control"
import { Grid, GridPos } from "game/snake"

const keyDownHandler = (e:KeyboardEvent) => {
    /* TODO ignore all non game keydowns */
    let li = document.createElement('li')
    li.innerHTML = `sent:${e.code}`
    let ul:Element = <Element>document.querySelector('ul.actions')
    if(ul) {
        ul.appendChild(li)
    }
    net.emitClientControls(e)
    // TODO doCanvasPaintForClient();
}


const peerControlsHandler = (control: PlayerControl) => {
    // TODO doCanvasPaintForPeers();
    let li = document.createElement('li')
    li.innerHTML = `recieved:${control.name}`
    // FIXME reduntand DOM selection
    let ul:Element|null = document.querySelector('ul.actions')
    if(ul) {
        ul.appendChild(li)
    }
}


const peerConnectionHandler = (peers:string[]) => {
    // TODO
    console.log('peerConnectionHandler')
    gameloop().start()

}

let init = () => {
    let canvas = <HTMLCanvasElement>document.querySelector('.main-canvas')
    let grid = new Grid(canvas)
    let spawnPosition = new GridPos(0, 0)
    let intialTailLength = 5
    let snake1:Snake = new Snake(grid, spawnPosition, intialTailLength)

}

let gameloop = ():object => {
    let stopLoop:Boolean = false
    let isOn:Boolean = false
    let start = (time) => {
        if(!stopLoop) {
            isOn = true
            window.requestAnimationFrame(start)
        } else {
            stopLoop = false
        }
    }

    let stop = (cb) => {
        stopLoop = true
        isOn = false
        cb()
    }

    return {
        start,
        stop,
        isOn
    }
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
        let createRoomWizard:Element =
            <Element>document.querySelector('.create-room-wizard')

        let createRoomBtn =
            <Element>createRoomWizard.querySelector('.create-room.btn')

        createRoomBtn.addEventListener('click', (e:MouseEvent) => {
            let roomNameEl:HTMLInputElement =
                <HTMLInputElement>createRoomWizard
                .querySelector('.room-name')

            let roomName:string = roomNameEl.value
            if (!roomName) {
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

export {start}