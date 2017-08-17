enum VALID_KEYCODES {
    LEFT = 37,
    UP = 38,
    RIGHT = 39,
    DOWN = 40
}

class PlayerControl {
    
    public code:number
    public name:string
    

    public static isValidKeycode = (keyCode) => {
        if(keyCode in VALID_KEYCODES){
            return true
        }
    }
    
    constructor(keyCode:number, keyName:string){
        this.code = keyCode,
        this.name = keyName
    }
}

export {PlayerControl, VALID_KEYCODES}
