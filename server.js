/**
 * Created by ipsum on 9/12/15.
 */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var players = [];
var ids = {};

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/'));

io.on('connection', function (socket) {
    console.log('a player connected');
    socket.on('init player', function (user) {
        ids['user ' + socket.id] = user;
        players.push(user);
        console.log(players);

        io.emit('add player', players);
    });


    socket.on('∆', function (player) {

        for (var i in players) {
            if (players[i].name == player.name) {
                player.pSX = players[i].x;
                player.pSY = players[i].y;


                if (player.pA > player.a) {
                    player.x -= player.a * player.speed;
                } else {
                    player.x += player.a * player.speed;
                }
                if (player.pB > player.b) {
                    player.y -= player.b * player.speed;
                } else {
                    player.y += player.b * player.speed;
                }
                players[i] = player;

            }
        }
        socket.on('need players array', function () {
            socket.emit('need players array', players);
        });


        socket.broadcast.emit('∆', player);
    });

    socket.on('disconnect', function () {
        io.emit('destroy player', ids['user ' + socket.id]);
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

