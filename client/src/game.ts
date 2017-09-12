import * as net from './networking'
import { PlayerControl } from "common-entity/player-control"
import { Grid, GridPos, Snake, Egg } from "./snake"

const keyDownRelayHandler = (e: KeyboardEvent) => {
    /* TODO ignore all non game keydowns */
    /* let li = document.createElement('li')
    li.innerHTML = `sent:${e.code}`
    let ul: Element = <Element>document.querySelector('ul.actions')
    if (ul) {
        ul.appendChild(li)
    } */
    net.emitClientControls(e)
    // TODO: doCanvasPaintForClient()
}


const peerControlsHandler = (control: PlayerControl) => {
    // TODO doCanvasPaintForPeers();
   /*  let li = document.createElement('li')
    li.innerHTML = `recieved:${control.name}`
    // FIXME redundant DOM selection
    let ul: Element | null = document.querySelector('ul.actions')
    if (ul) {
        ul.appendChild(li)
    } */
}


const peerConnectionHandler = (peers: string[]) => {
    console.log('peerConnectionHandler')
}

interface AnimationLoop {
    isOn: boolean
    start: (time?: any) => void
    stop: (cb?: () => any) => void
}

interface CollsionReport {
    collisionHasOccurred: boolean
    snakes: Snake[]
    eggs?: Egg[]
}

let checkSnakeEggCollision = (snakes: Snake[],
    eggs: Egg[], grid: Grid): CollsionReport => {

    let collisionHasOccurred: boolean = false
    snakes.forEach((snake) => {
        for (let idx = 0; idx < eggs.length; idx++) {
            if (eggs[idx].pos.equals(snake.head.pos)) {
                collisionHasOccurred = true
                eggs[idx] = new Egg(grid, grid.getRandomPos())
                snake.grow()
            }
        }
    })
    return {
        collisionHasOccurred,
        snakes,
        eggs
    }
}

let getGameLoop = (grid: Grid,
    snakes: Snake[], eggs: Egg[]): AnimationLoop => {

    let stopLoop: boolean = false
    let isOn: boolean = false
    let start = (time?: any) => {
        if (!stopLoop) {
            isOn = true
            grid.saveContext()
            grid.clear()
            let eggCollisionReport =
                checkSnakeEggCollision(snakes, eggs, grid)

            /* if (eggCollisionReport.collisionHasOccurred) {
                snakes = eggCollisionReport.snakes
                eggs = <Egg[]>eggCollisionReport.eggs
            } */


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

let addSnake = (grid: Grid, snakes: Snake[], spawnPos: GridPos) => {

}



let initGame = () => {
    let canvas = <HTMLCanvasElement>document.querySelector('.main-canvas')
    let grid = new Grid(canvas)

    let snakes: Snake[] = []
    let eggs: Egg[] = []

    let snake: Snake = new Snake(grid, new GridPos(0, 0))
    snakes.push(snake)

    let egg = new Egg(grid, grid.getRandomPos())
    eggs.push(egg)

    let startGameBtn: Element | null =
        document.querySelector('.start-game.btn')

    if (!startGameBtn) {
        throw new Error('ElementNotFound: .start-game.btn')
    }

    startGameBtn.addEventListener('click', (e: MouseEvent) => {
        let gameLoop = getGameLoop(grid, snakes, eggs)
        gameLoop.start()

        let controlsHandler = Snake.getControlsHandler(snakes[0])
        document
            .addEventListener('keydown', (e: KeyboardEvent) => {
                if (PlayerControl.isValidControl(e)) {
                    controlsHandler(new PlayerControl(e))
                }
            })
        document.addEventListener('keydown', keyDownRelayHandler)
        //TODO: add peer controls handler

        snakes.forEach((snake) => {
            snake.setMovementInterval(window)
        })
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