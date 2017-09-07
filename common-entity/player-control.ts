enum VALID_KEYCODES {
    LEFT = 37,
    UP = 38,
    RIGHT = 39,
    DOWN = 40
}

class PlayerControl {
    
    public code:number
    public name:string
    

    public static isValidControl = (e:KeyboardEvent) => {
        if(e.keyCode in VALID_KEYCODES){
            return true
        }
    }
    
    constructor(e:KeyboardEvent){
        this.code = e.keyCode,
        this.name = e.code
    }

    

    /**
     * check which direction control is referring to
     * @param {('up'|'down'|'left'|'right')} direction - direction name
     */
    isDirection(direction:string):boolean {
        let isUp = this.code === VALID_KEYCODES.UP && direction === 'up'
        let isDown = this.code === VALID_KEYCODES.DOWN && direction === 'down'
        let isLeft = this.code === VALID_KEYCODES.LEFT && direction === 'left'
        let isRight = this.code === VALID_KEYCODES.RIGHT && direction === 'right'

        if(isUp || isDown || isLeft || isRight){
            return true
        }
        return false
    }
    
    
}

export {PlayerControl, VALID_KEYCODES}
