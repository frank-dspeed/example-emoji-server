class EventEmitter{
    constructor(){
        this.callbacks = {}
    }

    on(event, cb){
        if(!this.callbacks[event]) {this.callbacks[event] = [];}
        this.callbacks[event].push(cb)
    }

    emit(event, data){
        const cbs = this.callbacks[event]
        if(cbs){
            cbs.forEach(cb => cb(data))
        }
    }
}

export const io = () => {
    const socket = new EventEmitter();
    // Register server events
    return socket;
}