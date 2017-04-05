module.exports = {

    captureTest: function (type, a, b, scores) {

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
                                                    console.log('eeeeeeeeeeeee');
                                                    type[l][m] = 0;

                                                    if (b === 1) {
                                                        scores[1]++;
                                                    }
                                                    else {
                                                        scores[0]++;
                                                    }

                                                    //TODO:Scores for players
                                                }
                                            }
                                        }


                                    }
                                    eatenList = [];

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
    },


    scoring: function (type, a, b) {

        var score = 0;

        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {

                var left = false;
                var right = false;
                var up = false;
                var down = false;

                if (type[i][j] === 0) {
                    var k = j;
                    while (--k > 0) {
                        if (type[i][k] === a) {
                            left = true;
                            break;
                        }
                    }
                    k = j;
                    while (++k < 9) {
                        if (type[i][k] === a) {
                            right = true;
                            break;
                        }
                    }
                    k = i;
                    while (--k > 0) {
                        if (type[k][j] === a) {
                            up = true;
                            break;
                        }
                    }
                    k = i;
                    while (++k < 9) {
                        if (type[k][j] === a) {
                            down = true;
                            break;
                        }
                    }
                }

                if (left && right && up && down) score++;
            }
        }

        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                if (type[i][j] === a) score++;
            }
        }

        return score;
    },

    initMatrix: function () {
    var type = [];

    for (var i = 0; i < 9; i++) {
        type[i] = [];
        for (var j = 0; j < 9; j++) {
            type[i][j] = 0;
        }
    }

    return type;
    }

};