import { PlayerControl } from "common-entity/player-control";

export class Grid {
    private static DEFAULT_HEIGHT = 400
    private static DEFAULT_WIDTH = 400
    private static DEFAULT_CELL_SIZE = 10
    private canvas: HTMLCanvasElement
    private context: CanvasRenderingContext2D

    height: number
    width: number
    cellSize: number

    constructor(canvas: HTMLCanvasElement,
        height: number = Grid.DEFAULT_HEIGHT,
        width: number = Grid.DEFAULT_WIDTH,
        cellSize: number = Grid.DEFAULT_CELL_SIZE) {

        this.height = height
        this.width = width
        this.cellSize = cellSize
        canvas.height = this.height
        canvas.width = this.width
        canvas.style.backgroundColor = 'black'
        let ctx = canvas.getContext('2d')
        if (ctx == null) {
            let badRenderingContext =
                `context:CanvasRenderingContext2D cannot be null
            - canvas.getContext('2d') returned null`

            throw new Error(badRenderingContext)
        } else {
            this.context = ctx
        }
    }

    saveContext() {
        this.context.save()
    }

    clear() {
        this.context.clearRect(0, 0, this.width, this.height)
    }

    fill(gridPos: GridPos, color: string, size: number) {
        this.context.fillStyle = color
        this.context.fillRect(gridPos.x, gridPos.y,
            size * this.cellSize, size * this.cellSize)
    }

    getRandomPos(): GridPos {
        let temp = Math.floor(Math.random() * this.width)
        let x = temp - (temp % this.cellSize)
        temp =  Math.floor(Math.random() * this.height)
        let y = temp - (temp %  this.cellSize)
        return new GridPos(x, y)
    }

    restoreContext() {
        this.context.restore()
    }
}


export class GridPos {
    public x: number; y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    clone() {
        return new GridPos(this.x, this.y)
    }

    equals(gridPos: GridPos) {
        if (gridPos.x === this.x && gridPos.y === this.y) {
            return true
        }
        return false
    }

    incr(x: number, y: number) {
        this.x += x
        this.y += y
    }

}


interface Drawable {
    draw(grid?: Grid, gridPos?: GridPos, color?: string)
}


export class Vector {
    i: number = 0
    j: number = 0

    constructor(i: number, j: number) {
        this.i = i
        this.j = j
    }
}


export class Snake implements Drawable {
    /* TODO: update speed method */
    /* TODO: add/remove cubes */
    private static MAX_SPEED: number = 240
    private static DEFAULT_SPEED: number = 100
    // all sizes are in terms of grid cells
    private static DEFAULT_CUBE_SIZE: number = 1
    private static DEFAULT_TAIL_LENGTH: number = 5

    private static SNAKE_HEAD_COLOR = 'rgb(0, 200, 0)' // green
    private static DIRECTIONS = {
        UP: 'UP',
        LEFT: 'LEFT',
        DOWN: 'DOWN',
        RIGHT: 'RIGHT'
    }
    private grid: Grid
    private cubes: SnakeCube[]

    head: SnakeCube
    vector: Vector = new Vector(1,0) //facing right by default
    speed: number

    static getControlsHandler = (snake:Snake) => {

        let controlsHandler = (e:PlayerControl) => {
            
            if(e.isDirection('up')) {
                if(!(snake.vector.j === 1)) {
                    snake.vector.i = 0, snake.vector.j = -1
                }
            }
            if(e.isDirection('left')) {
                if(!(snake.vector.i === 1)) {
                    snake.vector.i = -1, snake.vector.j = 0
                }
            }
            if(e.isDirection('down')) {
                if(!(snake.vector.j === -1)) {
                    snake.vector.i = 0, snake.vector.j = 1
                }
            }
            if(e.isDirection('right')) {
                if(!(snake.vector.i === -1)) {
                    snake.vector.i = 1, snake.vector.j = 0
                }
            }
        }

        return controlsHandler

    }

    /**
     * @param {SnakeCube[]}
     * @param {number}
     */
    constructor(grid: Grid,
        spawnPosition: GridPos,
        tailLength: number = Snake.DEFAULT_TAIL_LENGTH,
        cubeSize: number = Snake.DEFAULT_CUBE_SIZE,
        speed: number = Snake.DEFAULT_SPEED) {

        this.grid = grid

        if (speed > Snake.MAX_SPEED) {
            this.speed = Snake.MAX_SPEED
        } else {
            this.speed = speed
        }

        /* Intialize this.cubes[] based on provided params  */
        this.cubes = []

        for (let i = 1; i <= tailLength; i++) {
            let offset = (tailLength - i) * cubeSize * this.grid.cellSize
            let prevOffset =
                (tailLength - (i+1)) * cubeSize * this.grid.cellSize

            let x = spawnPosition.x + offset
            let px = spawnPosition.x + prevOffset

            let prevPos = new GridPos(px, spawnPosition.y)
            let pos = new GridPos(x, spawnPosition.y)

            let cube = new SnakeCube(pos, prevPos, cubeSize)
            this.cubes.push(cube)
        }

        if (this.cubes.length > 0) {
            this.head = this.cubes[0]
        }
    }

    /**
     * Move snake head in direction implied by given vector
     * Make each snake cube follow
     * @param vector
     * @returns Promise<Snake>
     */
    move(vector: Vector = this.vector): Promise<Snake> {

        //TODO: prevent illegal direction change
        let moveExecutor = (resolve, reject) => {
            /* TODO: find a neater way to do this using Array.shift maybe*/

            this.head.prevPos = this.head.pos.clone()

            let exceedsRightBoundary =
                this.head.pos.x > this.grid.width - this.grid.cellSize
            let exceedsLeftBoundary = this.head.pos.x < 0
            let exceedsBottomBoundary =
                this.head.pos.y > this.grid.height - this.grid.cellSize
            let exceedsTopBoundary = this.head.pos.y < 0

            if (exceedsRightBoundary) {
                this.head.pos.x = 0
            } else if (exceedsLeftBoundary) {
                this.head.pos.x = this.grid.width - this.grid.cellSize
            } else if (exceedsBottomBoundary) {
                this.head.pos.y = 0
            } else if (exceedsTopBoundary) {
                this.head.pos.y = this.grid.height - this.grid.cellSize
            } else {
                this.head.pos.incr(vector.i * this.grid.cellSize,
                    vector.j * this.grid.cellSize)
            }

            for (let idx = 1; idx < this.cubes.length; idx++) {
                this.cubes[idx].prevPos = this.cubes[idx].pos.clone()
                this.cubes[idx].pos = this.cubes[idx - 1].prevPos
                if (this.cubes[idx].pos.equals(this.head.pos)) {
                    reject({
                        collisionIdx: idx,
                        snake: this
                    })
                }
            }

            resolve(this)
        }

        let snakeIsAlivePromise = new Promise<Snake>(moveExecutor)

        return snakeIsAlivePromise

    }

    grow(cubes?:SnakeCube[]) {
        let pos = this.cubes[this.cubes.length - 1].prevPos.clone()
        /**
         * FIXME: assigning default value cause gridpos cannot be null
         * we can make [pos] and [prevPos] of type GridPos|null
         * then they can be assigned to each other and be null too
         * However, we will then have to check for null values
         * when performing operations on them, which sucks
         */
        let prevPos = new GridPos(-1,-1)
        let cube = new SnakeCube(pos, prevPos, Snake.DEFAULT_CUBE_SIZE)
        this.cubes.push(cube)
    }

    draw(grid: Grid = this.grid, gridPos?: GridPos, color?: string) {
        this.cubes.forEach((cube: SnakeCube, idx: number) => {
            if (idx === 0) {
                cube.draw(grid, cube.pos, Snake.SNAKE_HEAD_COLOR)
            } else {
                cube.draw(this.grid, cube.pos)
            }
        })
    }


}

export class SnakeCube implements Drawable {
    static DEFAULT_COLOR: 'rgb(200, 200, 0)' // yellow
    public prevPos: GridPos
    public pos: GridPos
    public size: number

    constructor(pos: GridPos, prevPos: GridPos, size: number) {
        this.size = size
        this.pos = pos
        this.prevPos = prevPos
    }

    /* TODO: Figure out how to indicate something cannot be null? */
    draw(grid: Grid, gridPos: GridPos = this.pos,
        color: string = SnakeCube.DEFAULT_COLOR) {

        grid.fill(gridPos, color, this.size)
    }


}

export class Egg implements Drawable {
    private static DEFAULT_COLOR:string = 'rgb(0, 0, 200)' // blue
    private static DEFAULT_SIZE:number = 1

    private size: number
    private grid: Grid
    pos: GridPos


    constructor(grid: Grid,
        pos: GridPos, size: number = Egg.DEFAULT_SIZE) {

        this.size = size
        this.grid = grid
        this.pos = pos
    }


    draw(grid: Grid = this.grid,
        gridpos: GridPos = this.pos,
        color: string = Egg.DEFAULT_COLOR) {

        grid.fill(gridpos, color, this.size)

    }
}
