console.log("Starting up");

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const cors = require("cors");
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const { log } = require('console');

console.log("Finshed imports");

// /*
// * Server setup
// */

// Set up our server so it will listen on the port
const port =  process.env.PORT || 8080;
// const port =  8080;
server.listen(port, function (error) {
    // Checking any error occur while listening on port
    if (error) {
        console.log('Something went wrong', error);
    }else {
        console.log('Server is listening on port ' + port);
    }
});

/*
* Express setup
*/
app.use(express.static(__dirname + '/node_modules'));
app.use(express.static('public')); // use public folder for assets in html
app.use(express.static('public/js')); // use public folder for assets in html

// routes
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});



// /*
// * utilties 
// */ 

// // log something
const logAll = (arr, name = null) => {
    console.log("***");
    if(name) console.log(name);

    if(arr.length){
        arr.forEach( item => {
            console.log(item);
        });
    }
}
// add user to room
const addRoom = id => {
    // check its a new room
    if(socketStat.rooms.indexOf(id) == -1) socketStat.rooms.push(id);
}
// remove room
const removeRoom = id => {
    // get room index and remove
    const index = socketStat.rooms.indexOf(id);
    if (index > -1) socketStat.rooms.splice(index, 1);
}
const addUser = id => {
    socketStat.peers.push(id);
}
const removeUser = user => {
    // remove user from peers array
    const index = socketStat.peers.indexOf(user.id);
    if (index > -1) socketStat.peers.splice(index, 1);

    // decrement user from peers in room
    if(socketStat.roomData.hasOwnProperty(user.data.room)) socketStat.roomData[user.data.room].peers--;
}
const removeAllData = () => {
    logAll(["Tearing down rooms and peers"], "No users")
    socketStat.peers.length = 0;
    socketStat.rooms.length = 0;
}

// log all rooms
const showAllRooms = () => {
    logAll(socketStat.rooms, "Rooms")
}
// log all rooms
const showAllPeers = () => {
    logAll(socketStat.peers, "Peers")
}

async function showAllSockets(){
    const sockets = await io.fetchSockets();
    console.log("***");
    console.log("num of users: ",sockets.length);

    for (const socket of sockets) {
        console.log("id:",socket.id);
        console.log("rooms:",socket.rooms);
        console.log("data:",socket.data);
    }
}

const testPeers = () => {
    // delete rooms if none being used
    if(socketStat.peers.length == 0) removeAllData();
}

const addUserToRoom = (id, roomId) =>{
    
    addUser(id);
    addRoom(roomId);

    if(!socketStat.roomData.hasOwnProperty(roomId)){
        socketStat.roomData[roomId] = {}
        socketStat.roomData[roomId].peers = 1;
    }else{
        socketStat.roomData[roomId].peers++;
    }
}


/*
* Socket stuff
*/

// stat management
const socketStat = {};

socketStat.rooms = [];
socketStat.roomData = {};
socketStat.peers = [];

io.on('connection', function(socket){
    
    // new connect
    console.log('a user connected');

    socket.on("join",(roomId) =>{
        
        socket.join(roomId);
        socket.emit("joined", roomId);
        socket.data.room = roomId;

        addUserToRoom(socket.id, roomId);

        showAllPeers();
        showAllRooms();
        
        socket.to(roomId).emit("peerEnter", socketStat.roomData[roomId].peers);
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
        
        removeUser(socket);
        
        testPeers();
    });

    socket.on('messages', function(msg){
        // send send to room but not self
        socket.to(socket.data.room).emit("updates", msg)
    });    
});

// todo
// track num users in rooms, remove rooms if empty