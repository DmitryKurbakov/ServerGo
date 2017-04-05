var io = require('socket.io')({
    transports: ['websocket'],
});

var logic = require('./logic');

var shortid = require('shortid');

var users = [];

var roomID = 0;

io.attach(1337);


io.on('connection', function(socket) {

    users.push(socket.id);
    //socket.join(roomID.toString());

    console.log(users);

    if (users.length === 1){
        socket.emit('WAIT');
    }

    socket.on('disconnect', function () {
        console.log(socket.id + ' disconnect');
        users.splice(users.indexOf(socket.id), 1);
    });

    if (users.length === 2) {

        var currentUsers = [];

        currentUsers.push(users[0]);
        currentUsers.push(users[1]);

        users = [];
        roomID++;

        //TODO create room
        createRoom(currentUsers, roomID.toString());
        //TODO---------------------
    }
});


function createRoom(users, roomID) {

    var scores = [];
    scores.push(0);
    scores.push(0);

    io.sockets.sockets[users[0]].emit('START_GAME');
    io.sockets.sockets[users[1]].emit('START_GAME');

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

            io.sockets.sockets[users[1]].emit('END_OF_GAME', {
                winner: winner.toString()
            });
            io.sockets.sockets[users[0]].emit('END_OF_GAME',{
                winner: winner.toString()
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

            io.sockets.sockets[users[1]].emit('END_OF_GAME', {
                winner: winner.toString()
            });
            io.sockets.sockets[users[0]].emit('END_OF_GAME',{
                winner: winner.toString()
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

            //TODO: TEST OF PASS
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
            io.sockets.sockets[users[0]].emit('FINISH_MOVE', smth);
            io.sockets.sockets[users[1]].emit('FINISH_MOVE', smth);
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

    var blackScores = logic.scoring(type, 1, 2) + scores[0];
    var whiteScores = logic.scoring(type, 2, 1) + scores[1];

    console.log("black " + blackScores);
    console.log("white " + whiteScores);

    //1 - black, 2 - white
    return blackScores > whiteScores ? 1 : 2;
}