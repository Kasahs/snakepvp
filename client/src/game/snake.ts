class Grid {
    private length: number
    private breadth:number
    private cellSize:number
    private canvas: HTMLCanvasElement = null

    constructor(length: number, breadth:number,
        cellSize:number, canvas: HTMLCanvasElement) {

        this.length = length
        this.breadth = breadth
        this.cellSize = cellSize
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
    draw(grid: Grid, gridPos: GridPos)
}


class Vector {
    i:number = 0
    j:number = 0

    constructor(i:number, j:number) {
        this.i = i
        this.j = j
    }
}


class Snake implements Drawable {
    private static MAX_SPEEED:number = 240

    private DIRECTIONS  = {
        UP: 'UP',
        LEFT: 'LEFT',
        DOWN: 'DOWN',
        RIGHT: 'RIGHT'
    }

    private cubes: SnakeCube[] = []
    private head: SnakeCube = null
    public speed:number = 0

    /**
     * @param {SnakeCube[]}
     * @param {number}
     */
    constructor (cubes: SnakeCube[], speed: number) {
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

    draw(grid: Grid, gridPos: GridPos) {
        /**
         * TODO for each cube in snake paint it's grid pos with snake color
         */
    }

    /**
     * @param {Vector} indicates the direction in which the snake is moving
     * @returns {Boolean} false if snake dies true if still alive
     */
    move(vector:Vector) {
        /**
         * TODO change snake head grid position
         * and call follow on every following cube
         */
        let pGridPos = this.head.pos.clone()
        this.head.pos.incr(vector.i * this.speed, vector.j * this.speed)

        for (let idx = 1; idx < this.cubes.length; idx++) {
            let temp = this.cubes[idx].pos
            this.cubes[idx].pos = pGridPos
            pGridPos = temp
            if (this.cubes[idx].pos.equals(this.head.pos)) {
                return false
            }
        }

        return true
    }

}

class SnakeCube {
    public pos: GridPos = null

    public size: number = null
    public follows:SnakeCube = null
    constructor(size:number) {
        this.size = size
    }

}

