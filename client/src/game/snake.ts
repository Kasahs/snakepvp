export class Grid {
    private static DEFAULT_HEIGHT = 400
    private static DEFAULT_WIDTH = 400
    private static DEFAULT_CELL_SIZE = 20
    private canvas:HTMLCanvasElement
    private context:CanvasRenderingContext2D

    height:number
    width:number
    cellSize:number

    constructor(canvas: HTMLCanvasElement,
        height:number = Grid.DEFAULT_HEIGHT,
        width:number = Grid.DEFAULT_WIDTH,
        cellSize:number = Grid.DEFAULT_CELL_SIZE) {

        this.height = height
        this.width = width
        this.cellSize = cellSize
        canvas.height = this.height
        canvas.width = this.width
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

    fill(gridPos:GridPos, color:string, size:number) {
        this.context.fillRect(gridPos.x, gridPos.y,
            size * this.cellSize, size * this.cellSize)
    }

    getRandomPos():GridPos {
        let x = Math.floor(Math.random() * this.width)
        let y = Math.floor(Math.random() * this.height)
        return new GridPos(x, y)
    }
}


export class GridPos {
    public x:number; y:number

    constructor(x:number, y:number) {
        if (x<0 || y<0) {
            let invalidGridPosition =
            `InvalidGridPosition
            - grid position coordinates cannot be negative`
            throw new TypeError(invalidGridPosition)
        }
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

    incr(x:number, y:number) {
        this.x += x
        this.y += y
    }

}


interface Drawable {
    draw(grid: Grid, gridPos: GridPos, color: string)
}


export class Vector {
    i:number = 0
    j:number = 0

    constructor(i:number, j:number) {
        this.i = i
        this.j = j
    }
}


export class Snake {
    /* TODO: update speed method */
    /* TODO: add/remove cubes */
    private static MAX_SPEED:number = 240
    private static DEFAULT_SPEED:number = 100
    private static DEFAULT_CUBE_SIZE:number = 10
    private static DEFAULT_TAIL_LENGTH:number = 5

    private static SNAKE_HEAD_COLOR = 'rgb(0, 200, 0)' // green
    private static DIRECTIONS  = {
        UP: 'UP',
        LEFT: 'LEFT',
        DOWN: 'DOWN',
        RIGHT: 'RIGHT'
    }
    private grid:Grid
    private cubes:SnakeCube[]
    private head:SnakeCube
    public speed:number

    /**
     * @param {SnakeCube[]}
     * @param {number}
     */
    constructor (grid:Grid,
    spawnPosition:GridPos,
    tailLength:number = Snake.DEFAULT_TAIL_LENGTH,
    cubeSize:number = Snake.DEFAULT_CUBE_SIZE,
    speed:number = Snake.DEFAULT_SPEED) {

        this.grid = grid

        if (speed > Snake.MAX_SPEED) {
            this.speed = Snake.MAX_SPEED
        } else {
            this.speed = speed
        }

        /* Intialize this.cubes[] based on provided params  */
        this.cubes = []
        for(let i=tailLength; i>0; i++) {
            let x = spawnPosition.x + ((tailLength - i)* cubeSize)
            let pos = new GridPos(x, spawnPosition.y)
            let cube = new SnakeCube(pos, cubeSize)
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
    move(vector:Vector):Promise<Snake> {

        //TODO: prevent illegal direction change

        let snakeIsAlivePromise  =
        new Promise<Snake>((resolve, reject) => {
            /* TODO: find a neater way to do this using Array.shift maybe*/
            let pGridPos = this.head.pos.clone()
            this.head.pos.incr(vector.i * this.speed,
                vector.j * this.speed)
            this.head.draw(this.grid,
                this.head.pos, Snake.SNAKE_HEAD_COLOR)

            for (let idx = 1; idx < this.cubes.length; idx++) {
                let temp = this.cubes[idx].pos
                this.cubes[idx].pos = pGridPos
                pGridPos = temp
                this.cubes[idx].draw(this.grid, this.cubes[idx].pos)
                if (this.cubes[idx].pos.equals(this.head.pos)) {
                    reject({
                        collisionIdx: idx,
                        snake: this
                    })
                }
            }

            resolve(this)
        })

        return snakeIsAlivePromise

    }

}

export class SnakeCube implements Drawable {
    static DEFAULT_COLOR: 'rgb(200, 200, 0)' // yellow

    public pos: GridPos
    public size: number

    constructor(pos:GridPos, size:number) {
        this.size = size
        this.pos = pos
    }

    /* TODO: Figure out how to indicate something cannot be null? */
    draw(grid:Grid, gridPos:GridPos = this.pos,
    color:string=SnakeCube.DEFAULT_COLOR) {

        grid.fill(gridPos, color, this.size)
    }


}

export class Egg implements Drawable {
    private static DEFAULT_COLOR = 'rgb(0, 0, 200)' // blue

    private size:number
    private grid:Grid
    private pos: GridPos

    constructor(size: number, grid: Grid, pos: GridPos) {
        this.size = size
        this.grid = grid
        this.pos = pos || grid.getRandomPos()
    }


    draw(grid: Grid=this.grid,
        gridpos:GridPos=this.pos,
        color:string = Egg.DEFAULT_COLOR) {

        grid.fill(gridpos, color, this.size)

    }
}
