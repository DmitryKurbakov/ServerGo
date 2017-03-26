

function captureTest(type, a, b) {

    var eatenList = [];

    for (var i = 0; i < 9; i++){
        var isEatRows = false;
        var eachCol = false;
        var eachRow = false;

        for(var j = 0; j < 9; j++){
            var k = 0;
            var isEatCols = [];

            if (type[i][j] === b){
                k = j;
                if (k - 1 === -1 || type[i][k - 1] === a){
                    while (k < 8 && type[i][k + 1] === b)
                    {
                        k++;
                    }

                    if (k === 8 || type[i][k + 1] === a){
                        for (var l = j; l < k + 1; l++){
                            var m = i;

                            if (m - 1 === -1 || type[m - 1][l] === a){

                                while (m < 9 &&  type[m][l] === b){

                                    var posHor = l;
                                    while (posHor > -1){

                                        if (type[m][posHor] === b){
                                            eatenList.push([m, posHor]);
                                            var posVer = m;

                                            while (posVer > -1) {
                                                if (type[posVer][posHor] === b)
                                                {
                                                    eatenList.push([posVer, posHor]);
                                                    posVer--;
                                                    continue;
                                                }
                                                if (type[posVer][posHor] === a)
                                                {
                                                    break;
                                                }
                                                eatenList = [];
                                                eachCol = false;
                                                break;
                                            }

                                            posVer = m;

                                            while (posVer < 9)
                                            {
                                                if (type[posVer][posHor] === b)
                                                {
                                                    eatenList.push([posVer, posHor]);
                                                    posVer++;
                                                    continue;
                                                }
                                                if (type[posVer][posHor] === a)
                                                {
                                                    break;
                                                }

                                                eatenList = [];
                                                eachCol = false;
                                                break;
                                            }

                                            posHor--;
                                            continue;
                                        }

                                        if (type[m][posHor] === a)
                                        {
                                            break;
                                        }
                                        eatenList = [];
                                        eachRow = false;
                                        break;
                                    }

                                    posHor = l;

                                    while(posHor < 9){
                                        if (type[m][posHor] === b){
                                            eatenList.push([m, posHor]);
                                            posVer = m;

                                            while (posVer > -1){
                                                if (type[posVer][posHor] === b)
                                                {
                                                    eatenList.push([posVer, posHor]);
                                                    posVer--;
                                                    continue;
                                                }
                                                if (type[posVer][posHor] === a)
                                                {
                                                    break;
                                                }

                                                eatenList = [];
                                                eachCol = false;
                                                break;
                                            }

                                            posVer = m;

                                            while (posVer < 9) {
                                                if (type[posVer][posHor] === b)
                                                {
                                                    eatenList.push([posVer, posHor]);
                                                    posVer++;
                                                    continue;
                                                }
                                                if (type[posVer][posHor] === a)
                                                {
                                                    break;
                                                }

                                                eatenList = [];
                                                eachCol = false;
                                                break;
                                            }

                                            posHor++;
                                            continue;
                                        }

                                        if (type[m][posHor] === a)
                                        {
                                            break;
                                        }

                                        eachRow = false;
                                        break;
                                    }

                                    m++;
                                }

                                if (!eachRow || !eachCol)
                                {
                                    break;
                                }

                                m = m >= 8 ? 8 : m;

                                if (m === 8 || type[m][l] === a)
                                {

                                    var col = [m === 8 ? 8 : m - 1, true];
                                    isEatCols.push(col);
                                }
                                else
                                {
                                    isEatCols = [];
                                    break;
                                }
                            }
                            else
                            {
                                isEatCols = [];
                                break;
                            }
                        }

                        var eat = false;
                        if (isEatCols.length > 0){
                            eat = true;
                            for (var ind = 0; ind < isEatCols.length; ind++){
                                if (!isEatCols[ind][1])
                                {
                                    eat = false;
                                    break;
                                }
                            }

                            if (isEatRows && eat && eachRow && eachCol){

                                for (l = 0; l < eatenList.length; l++)
                                {
                                    for (m = l + 1; m < eatenList.length; m++)
                                    {
                                        if ((eatenList[l][0] === eatenList[m][0]) &&
                                            (eatenList[l][1] === eatenList[m][1])){
                                            eatenList.splice(eatenList.indexOf(eatenList[m]), 1);
                                        }
                                    }
                                }

                                for (l = 0; l < 9; l++) {
                                    for (m = 0; m < 9; m++) {
                                        for (var n = 0; n < eatenList.length; n++) {
                                            if (l === eatenList[n][0] && m === eatenList[n][1]) {
                                                //PrintMatrix(type);
                                                type[l][m] = 0;
                                                // var mr =
                                                //    GameObject.Find((l * 9 + m).ToString()).GetComponent<SpriteRenderer>();
                                                type[l][m] = 0;
                                                if (b === 1){
                                                    //GameBoard.game.WhitePlayer.Score++;
                                                }
                                                else{
                                                    //GameBoard.game.BlackPlayer.Score++;
                                                }
                                                // mr.enabled = false;

                                                //TODO:Scores for players
                                            }
                                        }
                                    }


                                }
                                eatenList = [];
                            }



                        }

                        //else continue;
                    }
                    //else continue;
                }
            }
        }
    }

    return type;
}

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