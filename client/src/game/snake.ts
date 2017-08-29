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
    private x:number; y:number
    constructor(x:number, y:number) {
        this.x = x
        this.y = y
    }
}



class Snake {
    private DIRECTIONS  = {
        UP: 'UP',
        LEFT: 'LEFT',
        DOWN: 'DOWN',
        RIGHT: 'RIGHT'
    }
    private cubes: SnakeCube[] = []
    private head: SnakeCube = null
    private direction: string = null

    draw = (grid: Grid) => {
        /**
         * TODO for each cube in snake paint it's grid pos with snake color
         */
    }

    move = (direction) => {
        /**
         * TODO change snake head grid position
         * and call follow on every following cube
         */
    }

}

class SnakeCube {
    private posCurrent: GridPos = null

    public length:number = 0
    public breadth:number = 0
    public follows:SnakeCube = null
    constructor(length:number, breadth:number) {
        this.length = length
        this.breadth = breadth
    }

}
