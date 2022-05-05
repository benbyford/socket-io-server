console.log("working");
// imports
var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var url = require('url');

// local code
// var receive = require('./receive');


var connection = null;

// stat managemen
var stat = {};


// general err handling
var throwErr = function(err, result){
    if (err) throw err;
    console.log(JSON.stringify(result, null, 2));
}


/*
* Express setup
*/

// use public folder for assets in html
app.use(express.static('public'));

// listen to requests
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

// connection listen
http.listen(3000, function(){
    // log after server start
    console.log('SERVER - Listening on *:3000');
});

/*
* Websocket
*/

// delete all items within table
// r.db('poker').table('games').delete().run();

io.on('connection', function(socket){
  console.log('a user connected');

//   socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });

//   socket.on('message', function(msg){
//       // add data
//       r.db('poker').table('games').insert([
//           {
//               message: msg
//           }
//       ]).run(connection, function(err, result) { throwErr(err, result) });

//       // run game logic after message and
//       // report back to the user message logged

//       var returnMsg = pokerLogic();
//       io.emit('message',returnMsg);

//       console.log('message: ' + msg);
//   });
});