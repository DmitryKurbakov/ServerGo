var io = require('socket.io')({
    transports: ['websocket'],
});

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

    if (users.length === 2) {     //users.length === 2

        io.sockets.sockets[users[0]].emit('START');
        io.sockets.sockets[users[1]].emit('START');

        var currentUsers = [];

        currentUsers.push(users[0]);
        currentUsers.push(users[1]);

        users = [];
        roomID++;

        //TODO create room
        createRoom(currentUsers, roomID.toString());
        //TODO---------------------


    }
        //start game

        var turn = 0;

        //io.sockets.sockets[users[0]].emit('START');
        //io.sockets.sockets[users[1]].emit('WAIT');

        // socket.on('POSITION', function (data) {
        //     console.log(data);
        //
        //     type[parseInt(data.row)][parseInt(data.col)] = 1;
        //
        //     //TODO: TEST OF PASS
        //     console.log(type);
        //     captureTest(type, 1, 2);
        //     captureTest(type, 2, 1);
        //     //socket.emit('FINISH_MOVE', );
        //     //console.log(io.sockets.in(roomID));
        //
        //     var k = 0;
        //
        //     var smth = {};
        //     for (var i = 0; i < 9; i++){
        //         for (var j = 0; j < 9; j++){
        //
        //             smth[(k++).toString()] = type[i][j];
        //         }
        //     }
        //
        //     //console.log(smth);
        //     socket.emit('FINISH_MOVE', smth);
            //io.sockets.in(roomID).emit('FINISH_MOVE', JSON.stringify(type));
        //});

        //socket.emit('FINISH_MOVE', "tapappaap");
        //io.sockets.in(roomID).emit('FINISH_MOVE', "tapappaap");


    //}
    // io.sockets.sockets[users[0]].on('beep', function (data) {
    //     console.log(data);
    // })
    //
    // io.sockets.sockets[users[0]].emit('boop',{
    //     name:'1213141'
    // });
    // socket.on('beep', function(data){
    //     console.log(data);
    //     socket.join('room');
    //     //console.log(socket.id);
    //     //console.log(io.sockets.in('room').sockets);
    //     });


});



function createRoom(users, roomID) {

    var scores = [];
    scores.push(0);
    scores.push(0);

    var type = initMatrix();
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

    var blackScores = 0;
    var whiteScores = 0;

    //io.sockets.sockets[users[0]].emit('START');
    //io.sockets.sockets[users[1]].emit('WAIT');

    io.sockets.sockets[users[0]].on('BLACK_PASSED', function () {
        console.log('black passed');
        turn++;
        blackPassed = true;
        io.sockets.sockets[users[1]].emit('PLAY');
        io.sockets.sockets[users[0]].emit('PAUSE');
        if (blackPassed && whitePassed) {
            console.log(finishGame(type));
        }
    });

    io.sockets.sockets[users[1]].on('WHITE_PASSED', function () {
        console.log('white passed');
        turn++;
        whitePassed = true;
        io.sockets.sockets[users[0]].emit('PLAY');
        io.sockets.sockets[users[1]].emit('PAUSE');
        if (blackPassed && whitePassed) {
            console.log(finishGame(type));
        }
    });

    console.log(blackPassed + ' ' + whitePassed);


    for (var i = 0; i < 2; i++) {

        io.sockets.sockets[users[turn % 2 === 0 ? 0 : 1]].emit('PLAY');
        io.sockets.sockets[users[turn % 2 === 0 ? 1 : 0]].emit('PAUSE');


        console.log(i);
        io.sockets.sockets[users[i]].on('POSITION', function (data) {
            console.log(data);

            type[parseInt(data.row)][parseInt(data.col)] = parseInt(data.color) === 1 ? 1 : 2;

            //TODO: TEST OF PASS
            captureTest(type, 1, 2);
            captureTest(type, 2, 1);

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

function captureTest(type, a, b, scores) {

    var eatenList = [];
    //List<int> whiteRocks = new List<int>();

    for (var i = 0; i < 9; i++) {
        var isEatRows = false;
        var eachCol = false;
        var eachRow = false;
        for (var j = 0; j < 9; j++) {
            var k = 0;

            var isEatCols = [];

            //rows
            if (type[i][j] === b) {
                //type[i, j] += 3;

                k = j;

                if (k - 1 === -1 || type[i][k - 1] === a) {
                    while (k < 8 && type[i][k + 1] === b) {
                        k++;
                    }

                    if (k === 8 || type[i][k + 1] === a) {
                        isEatRows = true;
                        eachRow = true;
                        eachCol = true;
                        //cols
                        for (var l = j; l < k + 1; l++) {
                            var m = i;

                            if (m - 1 === -1 || type[m - 1][l] === a) {

                                while (m < 9 && type[m][l] === b) {
                                    var posHor = l;
                                    while (posHor > -1) {
                                        if (type[m][posHor] === b) {
                                            eatenList.push([m, posHor]);
                                            var posVer = m;

                                            while (posVer > -1) {
                                                if (type[posVer][posHor] === b) {
                                                    eatenList.push([posVer, posHor]);
                                                    posVer--;
                                                    continue;
                                                }
                                                if (type[posVer][posHor] === a) {
                                                    break;
                                                }
                                                eatenList = [];
                                                eachCol = false;
                                                break;
                                            }

                                            posVer = m;


                                            while (posVer < 9) {
                                                if (type[posVer][posHor] === b) {
                                                    eatenList.push([posVer, posHor]);
                                                    posVer++;
                                                    continue;
                                                }
                                                if (type[posVer][posHor] === a) {
                                                    break;
                                                }

                                                eatenList = [];
                                                eachCol = false;
                                                break;
                                            }

                                            posHor--;
                                            continue;
                                        }

                                        if (type[m][posHor] === a) {
                                            break;
                                        }
                                        eatenList = [];
                                        eachRow = false;
                                        break;
                                    }

                                    posHor = l;

                                    while (posHor < 9) {
                                        if (type[m][posHor] === b) {
                                            eatenList.push([m, posHor]);
                                            var posVer = m;
                                            while (posVer > -1) {
                                                if (type[posVer][posHor] === b) {
                                                    eatenList.push([posVer, posHor]);
                                                    posVer--;
                                                    continue;
                                                }
                                                if (type[posVer][posHor] === a) {
                                                    break;
                                                }

                                                eatenList = [];
                                                eachCol = false;
                                                break;
                                            }

                                            posVer = m;

                                            while (posVer < 9) {
                                                if (type[posVer][posHor] === b) {
                                                    eatenList.push([posVer, posHor]);
                                                    posVer++;
                                                    continue;
                                                }
                                                if (type[posVer][posHor] === a) {
                                                    break;
                                                }

                                                eatenList = [];
                                                eachCol = false;
                                                break;
                                            }
                                            posHor++;
                                            continue;
                                        }

                                        if (type[m][posHor] === a) {
                                            break;
                                        }

                                        eachRow = false;
                                        break;
                                    }


                                    m++;
                                }

                                if (!eachRow || !eachCol) {
                                    break;
                                }

                                m = m >= 8 ? 8 : m;

                                if (m === 8 || type[m][l] === a) {

                                    isEatCols.push([m === 8 ? 8 : m - 1, true]);
                                }
                                else {
                                    isEatCols = [];
                                    break;
                                }
                            }
                            else {
                                isEatCols = [];
                                break;
                            }
                        }


                        var eat = false;
                        if (isEatCols.length > 0) {
                            eat = true;
                            for (var col = 0; col < isEatCols.length; col++) {
                                if (!isEatCols[col][1]) {
                                    eat = false;
                                    break;
                                }
                            }

                            if (isEatRows && eat && eachRow && eachCol) {
                                console.log("EEEEEEEEEEEEEEEEEEEEEE");

                                for (var l = 0; l < eatenList.length; l++) {
                                    for (var m = l + 1; m < eatenList.length; m++) {
                                        if ((eatenList[l][0] === eatenList[m][0]) &&
                                            (eatenList[l][1] === eatenList[m][1])) {
                                            eatenList.splice(eatenList.indexOf(eatenList[m]), 1);
                                        }
                                    }
                                }

                                for (var l = 0; l < 9; l++) {
                                    for (var m = 0; m < 9; m++) {
                                        for (var n = 0; n < eatenList.length; n++) {
                                            if (l === eatenList[n][0] && m === eatenList[n][1]) {
                                                //PrintMatrix(type);
                                                console.log('eeeeeeeeeeeee');
                                                type[l][m] = 0;
                                                // var mr =
                                                //    GameObject.Find((l * 9 + m).ToString()).GetComponent<SpriteRenderer>();
                                                if (b === 1) {
                                                    scores[1]++;
                                                }
                                                else {
                                                    scores[0]++;
                                                    //GameBoard.game.BlackPlayer.Score++;
                                                }
                                                // mr.enabled = false;

                                                //TODO:Scores for players
                                            }
                                        }
                                    }


                                }
                                eatenList = [];
                                //for (int l = 0; l < isEatCols.Count; l++)
                                //{
                                //    for (int m = i; m < isEatCols[l].col + 1; m++)
                                //    {

                                //        type[m, j + l] = 0;
                                //        var mr = GameObject.Find((m * 9 + j + l).ToString()).GetComponent<SpriteRenderer>();
                                //        mr.enabled = false;
                                //        //TODO:Scores for players

                                //    }
                                //}
                            }


                            //PrintMatrix(type);
                        }

                        else continue;

                    }
                    else continue;

                }


                else continue;

            }
            else continue;


        }
    }
}

function scoring(type, a, b){

    var score = 0;

    for (var i = 0; i < 9; i++){
        for (var j = 0; j < 9; j++){

            var left = true;
            var right = true;
            var up = true;
            var down = true;

            if (type[i][j] === 0){
                var k = j;
                while (--k > 0){
                    if (type[i][k] === b){
                        left = false;
                        break;
                    }
                }
                k = j;
                while (++k < 9){
                    if (type[i][k] === b){
                        right = false;
                        break;
                    }
                }
                k = i;
                while (--k > 0){
                    if (type[k][j] === b){
                        up = false;
                        break;
                    }
                }
                k = i;
                while (++k < 9){
                    if (type[k][j] === b){
                        down = false;
                        break;
                    }
                }
            }

            if (left && right && up && down) score++;
        }
    }

    for (var i = 0; i < 9; i++){
        for (var j = 0; j < 9; j++){
            if (type[i][j] === a) score++;
        }
    }

    return score;
}
// function captureTest(type, a, b) {
//
//     var eatenList = [];
//
//     for (var i = 0; i < 9; i++){
//         var isEatRows = false;
//         var eachCol = false;
//         var eachRow = false;
//
//         for(var j = 0; j < 9; j++){
//             var k = 0;
//             var isEatCols = [];
//
//             if (type[i][j] === b){
//                 k = j;
//                 if (k - 1 === -1 || type[i][k - 1] === a){
//                     while (k < 8 && type[i][k + 1] === b)
//                     {
//                         k++;
//                     }
//
//                     if (k === 8 || type[i][k + 1] === a){
//                         for (var l = j; l < k + 1; l++){
//                             var m = i;
//
//                             if (m - 1 === -1 || type[m - 1][l] === a){
//
//                                 while (m < 9 &&  type[m][l] === b){
//
//                                     var posHor = l;
//                                     while (posHor > -1){
//
//                                         if (type[m][posHor] === b){
//                                             eatenList.push([m, posHor]);
//                                             var posVer = m;
//
//                                             while (posVer > -1) {
//                                                 if (type[posVer][posHor] === b)
//                                                 {
//                                                     eatenList.push([posVer, posHor]);
//                                                     posVer--;
//                                                     continue;
//                                                 }
//                                                 if (type[posVer][posHor] === a)
//                                                 {
//                                                     break;
//                                                 }
//                                                 eatenList = [];
//                                                 eachCol = false;
//                                                 break;
//                                             }
//
//                                             posVer = m;
//
//                                             while (posVer < 9)
//                                             {
//                                                 if (type[posVer][posHor] === b)
//                                                 {
//                                                     eatenList.push([posVer, posHor]);
//                                                     posVer++;
//                                                     continue;
//                                                 }
//                                                 if (type[posVer][posHor] === a)
//                                                 {
//                                                     break;
//                                                 }
//
//                                                 eatenList = [];
//                                                 eachCol = false;
//                                                 break;
//                                             }
//
//                                             posHor--;
//                                             continue;
//                                         }
//
//                                         if (type[m][posHor] === a)
//                                         {
//                                             break;
//                                         }
//                                         eatenList = [];
//                                         eachRow = false;
//                                         break;
//                                     }
//
//                                     posHor = l;
//
//                                     while(posHor < 9){
//                                         if (type[m][posHor] === b){
//                                             eatenList.push([m, posHor]);
//                                             posVer = m;
//
//                                             while (posVer > -1){
//                                                 if (type[posVer][posHor] === b)
//                                                 {
//                                                     eatenList.push([posVer, posHor]);
//                                                     posVer--;
//                                                     continue;
//                                                 }
//                                                 if (type[posVer][posHor] === a)
//                                                 {
//                                                     break;
//                                                 }
//
//                                                 eatenList = [];
//                                                 eachCol = false;
//                                                 break;
//                                             }
//
//                                             posVer = m;
//
//                                             while (posVer < 9) {
//                                                 if (type[posVer][posHor] === b)
//                                                 {
//                                                     eatenList.push([posVer, posHor]);
//                                                     posVer++;
//                                                     continue;
//                                                 }
//                                                 if (type[posVer][posHor] === a)
//                                                 {
//                                                     break;
//                                                 }
//
//                                                 eatenList = [];
//                                                 eachCol = false;
//                                                 break;
//                                             }
//
//                                             posHor++;
//                                             continue;
//                                         }
//
//                                         if (type[m][posHor] === a)
//                                         {
//                                             break;
//                                         }
//
//                                         eachRow = false;
//                                         break;
//                                     }
//
//                                     m++;
//                                 }
//
//                                 if (!eachRow || !eachCol)
//                                 {
//                                     break;
//                                 }
//
//                                 m = m >= 8 ? 8 : m;
//
//                                 if (m === 8 || type[m][l] === a)
//                                 {
//
//                                     var col = [m === 8 ? 8 : m - 1, true];
//                                     isEatCols.push(col);
//                                 }
//                                 else
//                                 {
//                                     isEatCols = [];
//                                     break;
//                                 }
//                             }
//                             else
//                             {
//                                 isEatCols = [];
//                                 break;
//                             }
//                         }
//
//                         var eat = false;
//                         if (isEatCols.length > 0){
//                             eat = true;
//                             for (var ind = 0; ind < isEatCols.length; ind++){
//                                 if (!isEatCols[ind][1])
//                                 {
//                                     eat = false;
//                                     break;
//                                 }
//                             }
//
//                             if (isEatRows && eat && eachRow && eachCol){
//
//                                 for (l = 0; l < eatenList.length; l++)
//                                 {
//                                     for (m = l + 1; m < eatenList.length; m++)
//                                     {
//                                         if ((eatenList[l][0] === eatenList[m][0]) &&
//                                             (eatenList[l][1] === eatenList[m][1])){
//                                             eatenList.splice(eatenList.indexOf(eatenList[m]), 1);
//                                         }
//                                     }
//                                 }
//
//                                 for (l = 0; l < 9; l++) {
//                                     for (m = 0; m < 9; m++) {
//                                         for (var n = 0; n < eatenList.length; n++) {
//                                             if (l === eatenList[n][0] && m === eatenList[n][1]) {
//                                                 //PrintMatrix(type);
//                                                 type[l][m] = 0;
//                                                 // var mr =
//                                                 //    GameObject.Find((l * 9 + m).ToString()).GetComponent<SpriteRenderer>();
//
//                                                 if (b === 1){
//                                                     //GameBoard.game.WhitePlayer.Score++;
//                                                 }
//                                                 else{
//                                                     //GameBoard.game.BlackPlayer.Score++;
//                                                 }
//                                                 // mr.enabled = false;
//
//                                                 //TODO:Scores for players
//                                             }
//                                         }
//                                     }
//
//
//                                 }
//                                 eatenList = [];
//                             }
//
//
//
//                         }
//
//                         //else continue;
//                     }
//                     //else continue;
//                 }
//             }
//         }
//     }
//     return type;
// }

function initMatrix() {
    var type = [];

    for (var i = 0; i < 9; i++) {
        type[i] = [];
        for (var j = 0; j < 9; j++) {
            type[i][j] = 0;
        }
    }

    return type;
}

function finishGame(type){
    console.log('FINISH');

    var blackScores = scoring(type, 1, 2);
    var whiteScores = scoring(type, 2, 1);

    console.log("black " + blackScores);
    console.log("white " + whiteScores);

    return blackScores > whiteScores ? "Black Win!" : "White Win!";
}