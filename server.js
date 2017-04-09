var io = require('socket.io')({
    transports: ['websocket'],
});

var logic = require('./logic');

var shortid = require('shortid');

var users = [];

var roomID = shortid.generate();

io.attach(8080);


io.on('connection', function(socket) {

    socket.join(roomID);

    users.push(socket.id);

    console.log(users);

    if (users.length === 1){
        socket.emit('WAIT');
    }

    socket.on('disconnect', function () {
        console.log(socket.id + ' disconnect');
        users.splice(users.indexOf(socket.id), 1);
    });

    if (users.length === 2) {
        //socket.join(roomID);
        //console.log()

        var currentUsers = [];

        currentUsers.push(users[0]);
        currentUsers.push(users[1]);

        var currentRoomID = roomID;
        roomID = shortid.generate();
        users = [];
        //TODO create room
        createRoom(currentUsers, currentRoomID);
        //TODO---------------------
    }
});


function createRoom(users, roomID) {

    var scores = [];
    scores.push(0);
    scores.push(0);

    io.sockets.sockets[users[0]].on('disconnect', function () {
        console.log(0);
        io.to(roomID).emit("OPPONENT_DISCONNECT");
    });

    io.sockets.sockets[users[1]].on('disconnect', function () {
        console.log(1);
        io.to(roomID).emit("OPPONENT_DISCONNECT");
    });

    io.to(roomID).emit('START_GAME');

    var type = logic.initMatrix();
    io.sockets.sockets[users[0]].emit('START_ATTRIBUTES',{
        name:'black',
        color:1,
        scores:0
        });
    io.sockets.sockets[users[1]].emit('START_ATTRIBUTES',{
        name:'white',
        color:2,
        scores:0
    });

    //start game

    var turn = 0;
    var whitePassed = false;
    var blackPassed = false;

    io.sockets.sockets[users[0]].on('BLACK_PASSED', function () {
        console.log('black passed');
        turn++;
        blackPassed = true;
        io.sockets.sockets[users[1]].emit('PLAY');
        io.sockets.sockets[users[0]].emit('PAUSE');
        if (blackPassed && whitePassed) {
            var winner = finishGame(type, scores);
            console.log(winner);

            io.to(roomID).emit('END_OF_GAME', {
                winner: winner.toString(),
                black: scores[0].toString(),
                white: scores[1].toString()
            });
        }
    });

    io.sockets.sockets[users[1]].on('WHITE_PASSED', function () {
        console.log('white passed');
        turn++;
        whitePassed = true;
        io.sockets.sockets[users[0]].emit('PLAY');
        io.sockets.sockets[users[1]].emit('PAUSE');
        if (blackPassed && whitePassed) {
            var winner = finishGame(type, scores);
            console.log(winner);

            io.to(roomID).emit('END_OF_GAME', {
                winner: winner.toString(),
                black: scores[0].toString(),
                white: scores[1].toString()
            });
        }
    });

    console.log(blackPassed + ' ' + whitePassed);


    for (var i = 0; i < 2; i++) {

        io.sockets.sockets[users[turn % 2 === 0 ? 0 : 1]].emit('PLAY');
        io.sockets.sockets[users[turn % 2 === 0 ? 1 : 0]].emit('PAUSE');


        console.log(i);
        io.sockets.sockets[users[i]].on('POSITION', function (data) {
            console.log(data);

            type[parseInt(data.row)][parseInt(data.col)] =
                parseInt(data.color) === 0 ? 0 : parseInt(data.color) === 1 ? 1 : 2;

            if (logic.isFree(1) || logic.isFree(2)){

                var winner = finishGame(type, scores);
                console.log(winner);

                io.to(roomID).emit('END_OF_GAME', {
                    winner: winner.toString(),
                    black: scores[0].toString(),
                    white: scores[1].toString()
                });
            }

            logic.captureTest(type, 1, 2, scores);
            logic.captureTest(type, 2, 1, scores);

            console.log(type);
            var k = 0;
            var smth = {};
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {

                    smth[(k++).toString()] = type[i][j];
                }
            }

            //console.log(smth);
            io.to(roomID).emit('FINISH_MOVE', smth);
            turn++;
            whitePassed = false;
            blackPassed = false;
            io.sockets.sockets[users[turn % 2 === 0 ? 0 : 1]].emit('PLAY');
            io.sockets.sockets[users[turn % 2 === 0 ? 1 : 0]].emit('PAUSE');
            //io.sockets.sockets[users[i === 0 ? 1 : 0]].emit('WAIT');

        });
    }
}

function finishGame(type, scores){
    console.log('FINISH');

    scores[0] += logic.scoring(type, 1, 2);
    scores[1] += logic.scoring(type, 2, 1);

    console.log("black " + scores[0]);
    console.log("white " + scores[1]);

    //1 - black, 2 - white
    return scores[0] > scores[1] ? 1 : 2;
}
