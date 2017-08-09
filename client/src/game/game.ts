import * as net from './networking';


function keyDownHandler(e:KeyboardEvent){
    /* TODO ignore all no game keydowns */
    net.emitClientControls(e);
    // TODO doCanvasPaintForClient();
}


function peerControlsHandler(event){
    // TODO doCanvasPaintForPeers();
}


function start(){
    document.addEventListener('keydown', keyDownHandler);
    net.setPeerControlsHandler(peerControlsHandler);
    net.init();
}
