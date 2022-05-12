console.log("Starting up");

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cors = require("cors");
const { log } = require('console');

console.log("Finshed imports");

// /*
// * Server setup
// */

// Set up our server so it will listen on the port
const port =  process.env.PORT || 8080;
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
app.use(cors());

// routes
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});



// /*
// * utilties 
// */ 

// // log something
// const logAll = (arr, name = null) => {
//     console.log("***");
//     if(name) console.log(name);

//     if(arr.length){
//         arr.forEach( (item) => {
//             console.log(item);
//         });
//     }
// }
// // add user to room
// const addRoom = id => {
//     // check its a new room
//     if(socketStat.rooms.indexOf(id) == -1) socketStat.rooms.push(id);
// }
// const addUser = id => {
//     socketStat.peers.push(id);
// }
// const removeUser = id => {
//     socketStat.peers.pop(id);
// }
// // log all rooms
// const showAllRooms = () => {
//     logAll(socketStat.rooms, "Rooms")
// }


// /*
// * Socket stuff
// */

// // stat management
const socketStat = {};

socketStat.rooms = [];
socketStat.peers = [];

io.on('connection', function(socket){
    console.log('a user connected');

//     socket.on("join",(roomId) =>{
//         socket.join(roomId);
//         socket.emit("joined", roomId);
//         socket.data.room = roomId;

//         addUser(socket.id);
//         addRoom(roomId);

//         showAll();
//         showAllRooms();
        
//         socket.to(roomId).emit("enter", "peer entered")
//     });

//     socket.on('disconnect', function(){
//         console.log('user disconnected');
//     });

//     socket.on('messages', function(msg){
//         // add data
//         socket.to(socket.data.room).emit("updates", msg)
//     });    
});

// // todo
// // track num users in rooms, remove rooms if empty



// async function showAll(){
//     const sockets = await io.fetchSockets();
//     console.log("***");
//     console.log("num of users: ",sockets.length);

//     for (const socket of sockets) {
//         console.log("id:",socket.id);
//         console.log("rooms:",socket.rooms);
//         console.log("data:",socket.data);
//     }
// }