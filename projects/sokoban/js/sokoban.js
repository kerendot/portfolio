'use strict';
console.log('sokoban');

//TODO: enhancements:
//change the cursor when pointing to a valid dest
//implement ctrl+z
//support keyboard arrows control
//simplify "move" function and create seperate functions for bonuses and obstacles

var ARROW_LEFT = 37;
var ARROW_UP = 38;
var ARROW_RIGHT = 39;
var ARROW_DOWN = 40;

var gGameData = {
    boxesNum: 7,
    rowsNum: 9,
    colsNum: 8
}

var gBoard;

//global vars to be reset every game:
var gBoxesOnTarget = 1;
var gStepsCount = 0;
var gPlayerPos = { i: 2, j: 2 };
var gGamePaused = false;
var gBonusClockInterval;
var gStepsNotCounted = 0;

//game input for each level:
var gInitialBoxesCoords = [{ i: 2, j: 3 }, { i: 3, j: 4 }, { i: 4, j: 4 }, { i: 6, j: 1 }, { i: 6, j: 3 }, { i: 6, j: 4 }, { i: 6, j: 5 }];
var gTargetCoords = [{ i: 2, j: 1 }, { i: 3, j: 5 }, { i: 4, j: 1 }, { i: 5, j: 4 }, { i: 6, j: 6 }, { i: 7, j: 4 }, { i: 6, j: 3 }];
var gWallCoords = [{ i: 0, j: 2 }, { i: 0, j: 3 }, { i: 0, j: 4 }, { i: 0, j: 5 }, { i: 0, j: 6 },
{ i: 1, j: 0 }, { i: 1, j: 1 }, { i: 1, j: 2 }, { i: 1, j: 6 },
{ i: 2, j: 0 }, { i: 2, j: 6 },
{ i: 3, j: 0 }, { i: 3, j: 1 }, { i: 3, j: 2 }, { i: 3, j: 6 },
{ i: 4, j: 0 }, { i: 4, j: 2 }, { i: 4, j: 3 }, { i: 4, j: 6 },
{ i: 5, j: 0 }, { i: 5, j: 2 },
{ i: 5, j: 6 }, { i: 5, j: 7 },
{ i: 6, j: 0 }, { i: 6, j: 7 },
{ i: 7, j: 0 }, { i: 7, j: 7 }, { i: 8, j: 0 },
{ i: 8, j: 1 }, { i: 8, j: 2 }, { i: 8, j: 3 }, { i: 8, j: 4 }, { i: 8, j: 5 }, { i: 8, j: 6 }, { i: 8, j: 7 }];
var gNoneCoords = [{ i: 0, j: 0 }, { i: 0, j: 1 }, { i: 0, j: 7 }, { i: 1, j: 7 }, { i: 2, j: 7 }, { i: 3, j: 7 }, { i: 4, j: 7 }];
var gGlueCoords = [{ i: 5, j: 3 }];
var gWaterCoords = [{ i: 5, j: 1 }];

function initGame() {
    resetGame();
    gBoard = buildBoard();
    gBonusClockInterval = setInterval(addBonusClock, 10000);

    renderBoard(gBoard, '.game-board', '.steps-counter > span');
    printBoardToConsole(gBoard);

    document.onkeydown = onKeyPressed;
}

function resetGame() {
    gBoxesOnTarget = 1;
    gStepsCount = 0;
    gPlayerPos = { i: 2, j: 2 };
    gGamePaused = false;
    clearInterval(gBonusClockInterval);
    gBonusClockInterval = undefined;
    gStepsNotCounted = 0;
}

function buildBoard() {
    //create empty board
    var board = [];
    for (var i = 0; i < gGameData.rowsNum; i++) {
        var row = [];
        for (var j = 0; j < gGameData.colsNum; j++) {
            var emptyCell = {
                type: 'FLOOR',
                hasBox: false,
                hasPlayer: false,
                obstacle: '',
                bonus: ''
            }
            row.push(emptyCell);
        }
        board.push(row);
    }

    //fill-in board according to the data of the screen
    gInitialBoxesCoords.forEach(function (boxCoord) {
        board[boxCoord.i][boxCoord.j].hasBox = true;
    });
    gTargetCoords.forEach(function (targetCoord) {
        board[targetCoord.i][targetCoord.j].type = 'TARGET';
    });

    gWallCoords.forEach(function (wallCoord) {
        board[wallCoord.i][wallCoord.j].type = 'WALL';
    });

    gNoneCoords.forEach(function (noneCoord) {
        board[noneCoord.i][noneCoord.j].type = 'NONE';
    });

    gGlueCoords.forEach(function (glueCoord) {
        board[glueCoord.i][glueCoord.j].obstacle = 'glue';
    });

    gWaterCoords.forEach(function (waterCoord) {
        board[waterCoord.i][waterCoord.j].obstacle = 'water';
    });

    board[gPlayerPos.i][gPlayerPos.j].hasPlayer = true;
    return board;
}

function renderBoard(board, elSelectorTbl, elSelectorStepsCount) {
    var strHtml = '';
    board.forEach(function (row, i) {
        strHtml += '<tr>';
        row.forEach(function (cell, j) {

            var className = '';
            var srcStr;
            if (cell.hasPlayer) srcStr = ' "img/player.png" alt="player" ';
            else switch (cell.type) {
                case ('WALL'):
                    srcStr = ' "img/wall.png" alt="wall" ';
                    break;
                case ('TARGET'):
                    if (cell.hasBox) srcStr = ' "img/boxOnTarget.png" alt="boxOnTarget" ';
                    else srcStr = ' "img/target.png" alt="target" ';
                    break;
                case ('FLOOR'):
                    if (cell.hasBox) srcStr = ' "img/box.png" alt="box" ';
                    else srcStr = ' "img/floor.png" alt="floor" ';
                    break;
                case ('NONE'):
                    srcStr = ' "img/none.png" alt="none" ';
                    break;
            }

            if (cell.obstacle != '') className += (' ' + cell.obstacle);
            if (cell.bonus != '') className += (' ' + cell.bonus);

            strHtml += '<td onclick="cellClicked(' + i + ',' + j + ')" ' +
                'class="  ' + className + ' " ' +
                '>' +
                '<img src=' + srcStr +
                '"></td>';
        });
        strHtml += '</tr>';
    });
    var elMat = document.querySelector(elSelectorTbl);
    elMat.innerHTML = strHtml;
    var elStepsCount = document.querySelector(elSelectorStepsCount);
    elStepsCount.innerText = gStepsCount;
}


function onKeyPressed(key) {
    switch (key.code) {
        case ('ArrowDown'):
            cellClicked(gPlayerPos.i + 1, gPlayerPos.j);
            break;
        case ('ArrowUp'):
            cellClicked(gPlayerPos.i - 1, gPlayerPos.j);
            break;
        case ('ArrowLeft'):
            cellClicked(gPlayerPos.i, gPlayerPos.j - 1);
            break;
        case ('ArrowRight'):
            cellClicked(gPlayerPos.i, gPlayerPos.j + 1);
            break;
    }
}

function cellClicked(cellI, cellJ) {
    if (gGamePaused) return;
    var possibleDestCoords = getPossibleDestCoords(gBoard, gPlayerPos);

    //check if clicked is in poss arr
    var playerDest = possibleDestCoords.find(function (coord) {
        return coord.i === cellI && coord.j === cellJ;
    });

    // if not valid destination, return
    if (!playerDest) return;

    //valid dest: make move of player and box
    makeMove(gBoard, playerDest);

    //check if bonus clock was hit
    if (gBoard[playerDest.i][playerDest.j].bonus === 'clock') {
        gStepsNotCounted += 10;
        gBoard[playerDest.i][playerDest.j].bonus = '';
    }

    //check victory
    if (gBoxesOnTarget === gTargetCoords.length) {
        //TODO: show victory popup, reset game
        showVictoryPopup();
        console.log('Victory!');
    }

    //check glue
    if (gBoard[cellI][cellJ].obstacle === 'glue') {
        gGamePaused = true;
        setTimeout(function () {
            gGamePaused = false;
            gStepsCount += 5;
        }, 5000);
    }
    renderBoard(gBoard, '.game-board', '.steps-counter > span');
    printBoardToConsole(gBoard);
}

//this function returns an array of possible moves {i,j} according to current player pos
function getPossibleDestCoords(board, playerPos) {
    var possibleDestCoords = [
        { i: (playerPos.i - 1), j: (playerPos.j) },
        { i: (playerPos.i + 1), j: (playerPos.j) },
        { i: (playerPos.i), j: (playerPos.j - 1) },
        { i: (playerPos.i), j: (playerPos.j + 1) }
    ];
    possibleDestCoords = possibleDestCoords.filter(function (coord) {
        return isValidPlayerMove(board, coord);
    });
    return possibleDestCoords;
}

function isValidPlayerMove(board, destCell) {
    //if non-valid index
    if (!(board[destCell.i] && board[destCell.i][destCell.j])) return false;
    //if this is WALL
    if (board[destCell.i][destCell.j].type === 'WALL') return false;
    //if box, check if it can be pushed:
    if (board[destCell.i][destCell.j].hasBox) {
        //calc the destination cell of the box:
        var boxDest = getBoxDestCell(gPlayerPos, destCell);
        //check if this is a valid destination for a box:
        var canBoxMove = isValidBoxMove(board, boxDest);
        return canBoxMove;
    }
    return true;
}

//this function check if "destCell" is legal for a box
function isValidBoxMove(board, destCell) {
    console.log('check box');
    //if non-valid index
    if (!(board[destCell.i] && board[destCell.i][destCell.j])) return false;
    //if this is WALL
    if (board[destCell.i][destCell.j].type === 'WALL') return false;
    //if there is another box:
    if (board[destCell.i][destCell.j].hasBox) return false;
    return true;
}

function makeMove(board, playerDestCell) {
    var waterFlag = false;
    //if needed - move box 
    if (board[playerDestCell.i][playerDestCell.j].hasBox) {
        var boxDestCell = getBoxDestCell(gPlayerPos, playerDestCell);
        moveObj(board, 'Box', playerDestCell, boxDestCell);
        if (board[boxDestCell.i][boxDestCell.j].obstacle === 'water') waterFlag = true;
    }
    //move player and update steps count
    moveObj(board, 'Player', gPlayerPos, playerDestCell);
    gPlayerPos = playerDestCell;

    //if bonus clock, don't increase gStepsCount
    if (gStepsNotCounted > 0) gStepsNotCounted--;
    else gStepsCount++;

    if (waterFlag) {
        playerDestCell = boxDestCell;
        boxDestCell = getBoxDestCell(gPlayerPos, playerDestCell);
        waterFlag = isValidBoxMove(board, boxDestCell);
        //a loop until a non-valid cell is reached
        while (waterFlag) {
            moveObj(board, 'Box', playerDestCell, boxDestCell);
            moveObj(board, 'Player', gPlayerPos, playerDestCell);

            //if bonus clock, don't increase gStepsCount
            if (gStepsNotCounted > 0) gStepsNotCounted--;
            else gStepsCount++;

            //update pointers for next iteration:
            gPlayerPos = playerDestCell;
            playerDestCell = boxDestCell;
            boxDestCell = getBoxDestCell(gPlayerPos, playerDestCell);
            waterFlag = isValidBoxMove(board, boxDestCell);
        }
    }
}

//this function deternimes the destination cell of the box, in case it is pushed
function getBoxDestCell(playerCell, boxCell) {
    var deltaI = boxCell.i - playerCell.i;
    var deltaJ = boxCell.j - playerCell.j;
    var boxDestCell = { i: (boxCell.i + deltaI), j: (boxCell.j + deltaJ) };
    return boxDestCell;
}

//this function updates the model with moves of Box or Player ('obj') and set the counter gBoxesOnTarget
function moveObj(board, objName, sourceCell, destCell) {
    var propName = 'has' + objName;
    board[destCell.i][destCell.j][propName] = true;
    board[sourceCell.i][sourceCell.j][propName] = false;
    if (objName === 'Box' && board[destCell.i][destCell.j].type === 'TARGET') gBoxesOnTarget++;
    if (objName === 'Box' && board[sourceCell.i][sourceCell.j].type === 'TARGET') gBoxesOnTarget--;
}

function showVictoryPopup() {
    var elPopup = document.querySelector('.popup');
    var elScore = elPopup.querySelector('h4 > span');
    elScore.innerText = 100 - gStepsCount;
    elPopup.style.opacity = 1;
    elPopup.style.visibility = 'visible';
}

function hideVictoryPopup() {
    var elPopup = document.querySelector('.popup');
    elPopup.style.opacity = 0;
    elPopup.style.visibility = 'hidden';
}

function addBonusClock() {
    //pick random avaiable cell and check it is available
    var clockI = getRandomIntInclusive(0, gBoard.length - 1);
    var clockJ = getRandomIntInclusive(0, gBoard[0].length - 1);
    //   var clockCell = { i: clockI, j: clockJ };
    while (gBoard[clockI][clockJ].type === 'WALL' || gBoard[clockI][clockJ].type === 'NONE') {
        clockI = getRandomIntInclusive(0, gBoard.length - 1);
        clockJ = getRandomIntInclusive(0, gBoard[0].length - 1);
    }
    gBoard[clockI][clockJ].bonus = 'clock';
    renderBoard(gBoard, '.game-board', '.steps-counter > span');
    setTimeout(function () {
        gBoard[clockI][clockJ].bonus = '';
        renderBoard(gBoard, '.game-board', '.steps-counter > span');
    }, 5000);
}

function printBoardToConsole(board) {
    board.forEach(function (row) {
        var rowStr = '';
        row.forEach(function (cell) {
            if (cell.hasPlayer) rowStr += ' O ';
            else
                switch (cell.type) {
                    case 'FLOOR':
                        if (cell.hasBox) rowStr += ' ◼️';
                        else rowStr += '';
                        break;
                    case 'NONE':
                        rowStr += ' X ';
                        break;
                    case 'WALL':
                        rowStr += '|||';
                        break;
                    case 'TARGET':
                        if (cell.hasBox) rowStr += ' ◼️';
                        else rowStr += ' * ';
                        break;
                }
            rowStr += '\t';
        });
        console.log(rowStr);
    });
}




////////////TESTS///////////
//for initial state:
// var gPlayerPos = { i: 2, j: 2 };
// console.log('can move to 2,1? expected true', checkPlayerMoveTo(gBoard, 2, 1));
// console.log('can move to 3,2? expected false', checkPlayerMoveTo(gBoard, 3, 2));
// console.log('can move to 2,3? expected true', checkPlayerMoveTo(gBoard, 2, 3));


//debug: sequence of some steps 
    // printBoardToConsole(gBoard);
    // cellClicked(2, 3);
    // printBoardToConsole(gBoard);
    // cellClicked(2, 4);
    // printBoardToConsole(gBoard);
    // cellClicked(3, 4);
    // printBoardToConsole(gBoard);
    // cellClicked(2, 5);
    // printBoardToConsole(gBoard);
    // cellClicked(1, 4);
    // printBoardToConsole(gBoard);
    // cellClicked(1, 5);
    // printBoardToConsole(gBoard);
    // cellClicked(2, 5);
    // printBoardToConsole(gBoard);
    // cellClicked(3, 5);
    // printBoardToConsole(gBoard);
    // cellClicked(3, 4);
    // printBoardToConsole(gBoard);
    // cellClicked(4, 4);
    // printBoardToConsole(gBoard);
    // cellClicked(5, 4);
    // printBoardToConsole(gBoard);

    // //debug:  sequence to win
    // gBoard[2][1].hasBox = true;
    // gBoard[3][5].hasBox = true;
    // gBoard[4][1].hasBox = true;
    // gBoard[5][4].hasBox = true;
    // gBoard[6][6].hasBox = true;
    // gBoard[7][4].hasBox = true;
    // gBoard[6][2].hasBox = true;
    // gBoard[6][3].hasBox = false;
    // gBoard[6][1].hasBox = false;
    // gBoard[2][2].hasPlayer = false;
    // gBoard[6][1].hasPlayer = true;
    // gPlayerPos = { i: 6, j: 1 };
    // printBoardToConsole(gBoard);
    // gBoxesOnTarget = 6;
    // cellClicked(6, 2);
    // printBoardToConsole(gBoard);