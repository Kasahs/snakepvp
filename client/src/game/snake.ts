class Grid {
    private length: number
    private breadth:number
    private cellSize:number
    private canvas: HTMLCanvasElement
    private context: CanvasRenderingContext2D

    constructor(length: number, breadth:number,
        cellSize:number, canvas: HTMLCanvasElement) {

        this.length = length
        this.breadth = breadth
        this.cellSize = cellSize
    }

    fill(gridPos: GridPos, color, size) {
        this.context.fillRect(gridPos.x, gridPos.y, size, size)
    }
}


class GridPos {
    public x:number; y:number


    constructor(x:number, y:number) {
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


class Vector {
    i:number = 0
    j:number = 0

    constructor(i:number, j:number) {
        this.i = i
        this.j = j
    }
}


class Snake {
    private static MAX_SPEEED:number = 240
    private static SNAKE_HEAD_COLOR = 'rgb(0, 200, 0)' // green
    private static DIRECTIONS  = {
        UP: 'UP',
        LEFT: 'LEFT',
        DOWN: 'DOWN',
        RIGHT: 'RIGHT'
    }
    private grid: Grid
    private cubes: SnakeCube[] = []
    private head: SnakeCube = null
    public speed:number = 0

    /**
     * @param {SnakeCube[]}
     * @param {number}
     */
    constructor (grid:Grid , cubes: SnakeCube[], speed: number) {
        this.grid = grid

        if (speed > Snake.MAX_SPEEED) {
            this.speed = Snake.MAX_SPEEED
        } else {
            this.speed = speed
        }
        this.cubes = cubes
        if (cubes.length > 0) {
            this.head = cubes[0]
        }
    }

    /**
     * @param {Vector} indicates the direction in which the snake is moving
     * @returns {Boolean} false if snake dies true if still alive
     */
    move(vector:Vector):Promise<Snake> {

        //Change snake-head grid position and make cubes follow

        let snakeIsAlivePromise  = new Promise((resolve, reject) => {

            let pGridPos = this.head.pos.clone()
            this.head.pos.incr(vector.i * this.speed, vector.j * this.speed)
            this.head.draw(this.grid, this.head.pos, Snake.SNAKE_HEAD_COLOR)
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

class SnakeCube implements Drawable {
    static DEFAULT_COLOR: 'rgb(200, 200, 0)' // yellow

    public pos: GridPos = null
    public size: number = null

    constructor(size:number) {
        this.size = size
    }

    draw(grid:Grid, gridPos: GridPos = null, color: string=null) {
        grid.fill(
            gridPos || this.pos,
            color || SnakeCube.DEFAULT_COLOR, this.size)


    }


}

class Egg implements Drawable {
    private static DEFAULT_COLOR = 'rgb(0, 0, 200)' // blue
    private size:number
    private grid:Grid
    private pos: GridPos
    constructor(size: number, grid: Grid) {
        this.size = size
        this.grid = grid
    }

    draw(grid: Grid=this.grid,
        gridpos:GridPos=this.pos,
        color:string = Egg.DEFAULT_COLOR) {

        grid.fill(gridpos, color, this.size)

    }
}

