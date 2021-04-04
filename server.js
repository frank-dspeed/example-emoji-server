import { express, app, io } from './server-module.js';
import { faces } from './emoj-data.js'

const { log } = process.env.DEBUG ? console : { log: ()=> {/* noOp */}};
const model = faces.reduce((resultingModel,face) => (resultingModel[face.Codes] = 0) || resultingModel,{})

const Transactiona = (chars, socketId, timestamp) => ({ chars, socketId, timestamp })
const TransactionalModel = [];

const updateTransactions = (chars, socketId )=> {
    // Server side transactional Model
    TransactionalModel.push(Transactiona(chars, socketId, new Date().toISOString()))
    // When ever we remove a transactionModel Entry we simply add to model
    // as there can be never a race condition in a single TH
    // You need always the Model and the TransactionalModel To get a Complet view.
    // To simulate async transactions we delay this operation
    Promise.resolve().then(x=>x).then(()=>TransactionalModel.forEach(() => {
        const t = TransactionalModel.pop();
        model[t.chars] += 1;
    }));
    //This promise will call resolve on the first process.thick and then call undefined return undefined
    // so we delay by 3 cycels every 3 cpu cycles we process there are better backpresure algos
    // this demonstrates only our intend to do so
}

// Emit welcome message on connection
io.on('connection', (socket) => {
    // Use socket to communicate with this particular client only, sending it it's own id
    socket.emit('welcome', ()=>('S')); //{ message: 'Welcome!', id: socket.id }
    socket.emit('get:emojis', model);
    
    socket.on('get:emojis', (data,callback) => {
        //The Client in this case will combine the transactional model to reflect values on the model.
        if (data.filter) {
            return callback(null, model[data.filter])
        }
        callback(null,{
            model,
            TransactionalModel
        })
    })
    
    socket.on('update:emoji', (data,callback) => {
        const emojiPointer = model[data];
        
        log('update:emoji', emojiPointer);
        if (emojiPointer || emojiPointer === 0) {
            if (io.of('/').adapter.sids.length > 100) {
                updateTransactions(data, socket.id);
            } else {
                // if less then 100 Users
                model[data] += 1;
                // Other Clients can now Process the update while they could also debounce
                // and call get:emojis to batch update data that highly depends on the 
                // Total client and update count for example the twitch chat gets batched to 
                // update and send a chat diff each 2 sec. 
                // In Chats and Complex States you can use a transactional data model
            } 
            socket.broadcast.emit("emoji:update", data);
            callback(null,true); // We Signal that we Successfull Updated
        }
    });

});

app.use('/favicon.ico', express.static('public/favicon.ico'))

//Implement NameSpace with operations for later expansion
io.of("/api/emojis").on("connection", (socket) => {
    socket.on("emoji:list", () => {});
    socket.on("emoji:create", () => {});
    socket.on("emoji:update", () => {
        socket.to("/api/emojis").emit("emoji:update", { });
    });
    
});

// Unused RestAPI Endpoint 
app.use('/api/emojis',req => {    
    const { res } = req;
    res.json(model);
})

app.use(express.static('public'));

app.use(req => {
    const { res } = req;
    res.status(404)   
    res.setHeader('content-type', 'text/html; charset=utf-8')
    res.send(`<h1>404</h1>`)
})

app.use((err,req) => {
    log(err);
    const { res } = req;
    res.status(500)
    res.setHeader('content-type', 'text/html; charset=utf-8')
    res.send(`<h1>500</h1>`)
})

//http://unicode.org/Public/emoji/1.0/emoji-data.txt
//const utfEmojis = [14.0, 13.1,13.0,12.1,12.0,11.0,5.0,4.0,3.0,2.0,1.0]