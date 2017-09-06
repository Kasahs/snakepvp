import * as net from './networking'
import { PlayerControl } from "common-entity/player-control"
import { Grid, GridPos, Snake, Egg } from "./snake"

const keyDownRelayHandler = (e: KeyboardEvent) => {
    /* TODO ignore all non game keydowns */
    let li = document.createElement('li')
    li.innerHTML = `sent:${e.code}`
    let ul: Element = <Element>document.querySelector('ul.actions')
    if (ul) {
        ul.appendChild(li)
    }
    net.emitClientControls(e)
    // TODO: doCanvasPaintForClient()
}


const peerControlsHandler = (control: PlayerControl) => {
    // TODO doCanvasPaintForPeers();
    let li = document.createElement('li')
    li.innerHTML = `recieved:${control.name}`
    // FIXME redundant DOM selection
    let ul: Element | null = document.querySelector('ul.actions')
    if (ul) {
        ul.appendChild(li)
    }
}


const peerConnectionHandler = (peers: string[]) => {
    console.log('peerConnectionHandler')
}

interface IntervalLoop {
    isOn: boolean
    start: (time?: any) => void
    stop: (cb?: () => any) => void
}


let getGameLoop = (grid: Grid,
    snakes: Snake[], eggs: Egg[]): IntervalLoop => {

    let stopLoop: boolean = false
    let isOn: boolean = false
    let start = (time?: any) => {
        if (!stopLoop) {
            isOn = true
            grid.saveContext()
            grid.clear()
            snakes.forEach((snake: Snake) => {
                snake.draw()
            })
            eggs.forEach((egg: Egg) => {
                egg.draw()
            })
            grid.restoreContext()
            window.requestAnimationFrame(start)
        } else {
            stopLoop = false
        }
    }

    let stop = (cb?: () => any) => {
        stopLoop = true
        isOn = false
        if (cb) {
            cb()
        }
    }

    return {
        start,
        stop,
        isOn
    }
}

let initGame = () => {
    let canvas = <HTMLCanvasElement>document.querySelector('.main-canvas')
    let grid = new Grid(canvas)

    let snakes: Snake[] = []
    let eggs: Egg[] = []

    let spawnPosition = new GridPos(0, 0)
    let snake1: Snake = new Snake(grid, spawnPosition)
    let egg = new Egg(grid, grid.getRandomPos())
    snakes.push(snake1)
    eggs.push(egg)

    let startGameBtn: Element | null =
        document.querySelector('.start-game.btn')

    if (!startGameBtn) {
        throw new Error('ElementNotFound: .start-game.btn')
    }

    startGameBtn.addEventListener('click', (e: MouseEvent) => {
        let gameLoop = getGameLoop(grid, snakes, eggs)
        gameLoop.start()
        document
            .addEventListener('keydown', Snake.getControlsHandler(snake1))
        document.addEventListener('keydown', keyDownRelayHandler)
        //TODO: add peer controls handler

        let snake1MoveInterval = window.setInterval(() => {
            snake1.move().then((snake) => {
                //TODO: check if egg eaten
                // check if snakes collided
                for (let i = 0; i < eggs.length; i++) {
                    if (eggs[i].pos.equals(snake1.head.pos)) {
                        snake1.grow()
                        eggs[i] = new Egg(grid, grid.getRandomPos())
                    }
                }
            }, () => {
                gameLoop.stop()
                window.clearInterval(snake1MoveInterval)
            })
        }, snake1.speed)
    })


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
        initGame()
    } else {
        let createRoomWizard: Element =
            <Element>document.querySelector('.create-room-wizard')

        let createRoomBtn =
            <Element>createRoomWizard.querySelector('.create-room.btn')

        createRoomBtn.addEventListener('click', (e: MouseEvent) => {
            let roomName = getRoomNameFromWizard(createRoomWizard)
            net.init(roomName)
            initGame()
        })
    }
}



let getRoomNameFromWizard = (createRoomWizard: Element): string => {

    let createRoomBtn =
        <Element>createRoomWizard.querySelector('.create-room.btn')

    let roomNameEl: HTMLInputElement =
        <HTMLInputElement>createRoomWizard
            .querySelector('.room-name')

    if (!roomNameEl.value) {
        throw new Error('InvalidRoomName: undefined|null|empty')
    } else {
        return roomNameEl.value
    }

}


export { start }