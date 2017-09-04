import * as net from 'game/networking'
import { PlayerControl } from "common-entity/player-control"
import { Grid, GridPos, Snake, Egg } from "game/snake"

const keyDownHandler = (e: KeyboardEvent) => {
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

let getControlsHandler = (snake:Snake) => {
    let KEYCODES = {
        UP: 38,
        LEFT: 37,
        DOWN: 40,
        RIGHT: 39
    }

    let VALID_KEYS:number[] = [38,37,40,39]

    let controlsHandler = (e:KeyboardEvent) => {
        if(VALID_KEYS.indexOf(e.keyCode) <= -1) {
            return
        }
        if(e.keyCode === KEYCODES.UP) {
			snake.vector.i = 0, snake.vector.j = -1
		}
		if(e.keyCode === KEYCODES.LEFT) {
			snake.vector.i = -1, snake.vector.j = 0
		}
		if(e.keyCode === KEYCODES.DOWN) {
			snake.vector.i = 0, snake.vector.j = 1
		}
		if(e.keyCode === KEYCODES.RIGHT ) {
			snake.vector.i = 1, snake.vector.j = 0
		}
    }

    return controlsHandler

}

let init = () => {
    let canvas = <HTMLCanvasElement>document.querySelector('.main-canvas')
    let grid = new Grid(canvas)
    let spawnPosition = new GridPos(0, 0)
    let intialTailLength = 5
    let snake1: Snake = new Snake(grid, spawnPosition, intialTailLength)

}


interface IntervalLoop {
    isOn: boolean
    start: (time?: any) => void
    stop: (cb: () => any) => void
}


let gameloop = (grid: Grid, snakes:Snake[], eggs:Egg[]): IntervalLoop => {
    let stopLoop: boolean = false
    let isOn: boolean = false
    let start = (time?: any) => {
        if (!stopLoop) {
            isOn = true
            grid.saveContext()
            grid.clear()
            snakes.forEach((snake:Snake) => {
                snake.draw()
            })
            eggs.forEach((egg:Egg) => {
                egg.draw()
            })
            grid.restoreContext()
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
        let createRoomWizard: Element =
            <Element>document.querySelector('.create-room-wizard')

        let createRoomBtn =
            <Element>createRoomWizard.querySelector('.create-room.btn')

        createRoomBtn.addEventListener('click', (e: MouseEvent) => {
            getRoomNameFromWizard(createRoomWizard)
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