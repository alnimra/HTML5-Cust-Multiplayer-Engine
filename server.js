/**
 * Created by ipsum on 9/12/15.
 */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var players = [];
var ids = {};
var userNum = 0;
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/'));

io.on('connection', function (socket) {
    console.log('a player connected');
    /*socket.on('need players array now', function () {
     socket.emit('need players array now', players);
     });*/
    socket.on('init user', function (user) {
        userNum++;
        ids['user ' + socket.id] = user;
        players.push(user);
        console.log(players);

        io.emit('add player', players);
    });

    socket.on('createCanvas', function () {
        socket.emit('createCanvas', players);
    });

    socket.on('fetch array', function () {
        socket.emit('fetch array', players);
    });


    socket.on('∆', function (user) {

        for (var i in players) {
            if (players[i].name == user.name) {
                players[i] = user;

            }
        }
        //console.log('NEW THING\n');
       // console.log(players);


        socket.broadcast.emit('∆', user);
    });

    socket.on('disconnect', function () {
        socket.broadcast.emit('destroy player', ids['user ' + socket.id]);
        userNum--;
        for (var i in players) {
            if (players[i].name == ids['user ' + socket.id].name) {
                players.splice(i, 1);
                console.log('the job has been done...')
            }
        }
        console.log('user disconnected');
    });

})
;

http.listen(3000, function () {
    console.log('listening on *:3000');
});
