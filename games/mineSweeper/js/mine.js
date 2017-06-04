'use strict';
console.log('mine sweeper');

//TODO:
// enhance visibility -> red X for wrong marks (currenly only background color - yellow)

var gBoard;
var gLevel = {
    SIZE: 4,
    MINES: 2
};
var gState = {
    isGameOn: false,
    isVictory: false,
    shownCount: 0,
    markedCount: 0,
    passedSecs: 0
}
var gBombs = [];
var gTblSelectorStr = '.gameBoard';
var ginterval;

function startGame() {
    // reset gState:
    gState.isGameOn = true;
    gState.isVictory = false;
    gState.shownCount = 0;
    gState.markedCount = 0;
    gState.passedSecs = 0;

    //////////////////switch comment on these rows to test:///////////////////////
    // gBoard = buildTestBoard();
    gBoard = buildBoard(gLevel);
    /////////////////////////////////////////////////////////////////////////////
    renderBoard(gBoard, gTblSelectorStr);

    //disable context menu from RMB:
    document.addEventListener('contextmenu', function (ev) {
        ev.preventDefault();
        return false;
    }, false);
}

function changeLevel(level) {
    switch (level) {
        case 'beginner':
            gLevel.SIZE = 4;
            gLevel.MINES = 2;
            break;
        case 'medium':
            gLevel.SIZE = 6;
            gLevel.MINES = 5;
            break;
        case 'expert':
            gLevel.SIZE = 8;
            gLevel.MINES = 15;
            break;
    }
    startGame();
}

//create the model
function buildBoard(level) {
    var size = level.SIZE;
    var bombsCount = level.MINES;
    var board = [];
    //create empty board:
    for (var i = 0; i < size; i++) {
        var row = [];
        for (var j = 0; j < size; j++) {
            row.push({
                val: '', //can be empty, number, or '*' (stands for bomb)
                // negsCount: 0, //not sure if this is needed - to use only if value is not enough
                isShown: false,
                isMarkedBomb: false,
                isExplodedBomb: false,
                isWonglyMarked: false
            });
        }
        board.push(row);
    }
    gBombs = fillBombs(board, bombsCount);
    fillNegsCount(board);
    printBoardToConsole(board);
    return board;
}

function fillBombs(board, bombsCount) {
    var bombCoords = [];
    var idxI;
    var idxJ;
    while (bombsCount) {
        idxI = getRandomIntInclusive(0, board.length - 1);
        idxJ = getRandomIntInclusive(0, board.length - 1);
        if (board[idxI][idxJ].val === '') {
            board[idxI][idxJ].val = '*';
            bombCoords.push({ i: idxI, j: idxJ });
            bombsCount--;
        }
    }
    console.log(bombCoords);
    return bombCoords;
}

function fillNegsCount(board) {
    board.forEach(function (row, i) {
        row.forEach(function (cell, j) {
            if (cell.val !== '*') cell.val = calcNegsCount(board, i, j);
        });
    });
}

//this function returns a string with number of bomb-negs, '' if zero
function calcNegsCount(board, cellI, cellJ) {
    var negs = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            //if non-valid index (in case the cell is in the frame), continue
            if (!(board[i] && board[i][j])) continue;
            //if this is the cell itself, continue;
            if (cellI === i && cellJ === j) continue;
            //index is valid: check and count
            if (board[i][j].val === '*') negs++;
        }
    }
    if (negs === 0) return '';
    return negs + '';
}

//render the model to the DOM
function renderBoard(board, elSelector) {
    var strHtml = '';
    board.forEach(function (row, i) {
        strHtml += '<tr>';
        row.forEach(function (cell, j) {
            var className = 'plain-cell';
            var cellText = cell.val;
            if (cell.isShown) {
                if (cell.isExplodedBomb) className += ' exploded-bomb';
                if (cell.val === '*') {
                    className += ' bomb';
                    cellText = '💣';
                }
                //if the val is a number, add the relevant class 
                else if (cell.val !== '') className += ' negs' + cell.val;
            }
            else {
                //if this is end game (loss) and need to show wrong marks
                if (!gState.isGameOn && cell.isMarkedBomb && cell.val != '*') {
                    className += ' wrong-mark';
                    // cellText = '💣';
                }
                //all other cases, marks or none
                else {
                    cellText = (cell.isMarkedBomb) ? '🚩' : '';
                    className += ' cover';
                }
            }
            strHtml += '<td onclick="cellClicked(' + i + ',' + j + ')" ' +
                'oncontextmenu="cellRightClicked(' + i + ',' + j + ')" ' +
                'class="    ' + className + '">' + cellText + '</td>';
        });
        strHtml += '</tr>';
    });
    var elMat = document.querySelector(elSelector);
    elMat.innerHTML = strHtml;
    var elCountBombs = document.querySelector('.counter-bombs');
    elCountBombs.innerText = gLevel.MINES - gState.markedCount;
}

function cellRightClicked(cellI, cellJ) {
    if (!gState.isGameOn) return;
    //remove mark:
    if (gBoard[cellI][cellJ].isMarkedBomb) {
        gBoard[cellI][cellJ].isMarkedBomb = false;
        gState.markedCount--;
    }
    //when marked, check if this is win
    else {
        gBoard[cellI][cellJ].isMarkedBomb = true;
        gState.markedCount++;
        checkGameStatus(cellI, cellJ);  
    }
     //do this in any case:
    renderBoard(gBoard, gTblSelectorStr);
}

function cellClicked(cellI, cellJ) {
    if (!gState.isGameOn || gBoard[cellI][cellJ].isShown || gBoard[cellI][cellJ].isMarkedBomb) return;
    //if first click, start clock
    if (!ginterval) startClock();
    //show the selected cell
    gBoard[cellI][cellJ].isShown = true;
    //isExplodedBomb - to detect if the bomb was exploded and the cell needs to be colored in red
    if (gBoard[cellI][cellJ].val === '*') gBoard[cellI][cellJ].isExplodedBomb = true;
    gState.shownCount++;
    //check if win/lose
    checkGameStatus(cellI, cellJ);
    //if game continous, do "expose area" if relevant
    if (gState.isGameOn && gBoard[cellI][cellJ].val === '') exposeArea(cellI, cellJ);     
    //do this in any case:
    renderBoard(gBoard, gTblSelectorStr);
}

//this function will set properties: gState.isGameOn && gState.isVictory and take care of each case
function checkGameStatus(cellI, cellJ) {

    //set gState.isGameOn && gState.isVictory:
    if (gBoard[cellI][cellJ].isExplodedBomb) {
        gState.isGameOn = false;
        gState.isVictory = false;
    }
    var maxShown = gLevel.SIZE * gLevel.SIZE - gLevel.MINES;
    if (gState.shownCount === maxShown && gState.markedCount === gLevel.MINES) {
        gState.isGameOn = false;
        gState.isVictory = true;
    }  

    //act according to the result:  
    //if game is lost
    if (!gState.isGameOn && !gState.isVictory) {
        console.log('lost!');
        showAllBombs(gBoard, gBombs);
        showGameEndPopup('You Lost');
    }
    //if game is won
    if (gState.isVictory) {
        console.log('victory!');
        showGameEndPopup('Victorious!');
    }
    //if game is done (lost/win), reset stuff
    if (!gState.isGameOn) gameOver();    
}

function gameOver() {
    clearInterval(ginterval);
    ginterval = undefined;
}

function exposeArea(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            //if non-valid index (in case the cell is in the frame), continue
            if (!(gBoard[i] && gBoard[i][j])) continue;
            //if this is the cell itself, continue;
            if (cellI === i && cellJ === j) continue;
            //index is valid: check and count
            if (gBoard[i][j].val !== '*') {
                cellClicked(i, j);
            }
        }
    }
}

function showAllBombs(board, bombCoords) {
    bombCoords.forEach(function (bombCoord) {
        board[bombCoord.i][bombCoord.j].isShown = true;
    });
}

function showGameEndPopup(popupText) {
    var elPopup     = document.querySelector('.popup');
    var elText  = elPopup.querySelector('h2');
    elText.innerText= popupText;    
 
    var elGameTime  = elPopup.querySelector('h4 > span');
    elGameTime.innerText    = gState.passedSecs;

    elPopup.style.opacity       = 1;
    elPopup.style.visibility    = 'visible';
}

function hideGameEndPopup() {
    var elPopup = document.querySelector('.popup');
    elPopup.style.opacity = 0;
    elPopup.style.visibility = 'hidden';
}

function startClock() {
    var elCounterTime = document.querySelector('.counter-time > span');
   gState.passedSecs = 0;
    ginterval = setInterval(setTime, 1000);
    function setTime() {
        ++gState.passedSecs;
        elCounterTime.innerHTML = gState.passedSecs ;
    }
}

//create a model for TESTS
function buildTestBoard() {
    var size = 4;
    var bombsCount = 2;
    var board = [];
    //create empty board:
    for (var i = 0; i < size; i++) {
        var row = [];
        for (var j = 0; j < size; j++) {
            row.push({
                val: '', //can be empty, number, or  '*' (stands for bomb)
                // negsCount: 0, //not sure if this is needed - to use only if value is not enough
                isShown: false,
                isMarkedBomb: false,
                isExplodedBomb: false
            });
        }
        board.push(row);
    }
    // fill in 2 bombs:
    board[1][1].val = '*';
    board[2][3].val = '*';
    gBombs.push({ i: 1, j: 1 });
    gBombs.push({ i: 2, j: 3 });
    fillNegsCount(board);
    printBoardToConsole(board);
    return board;
}

//function just for debug
function printBoardToConsole(board) {
    board.forEach(function (row) {
        var rowStr = '';
        row.forEach(function (cell) {
            var cellValue = (cell.val === '') ? '0' : cell.val;
            rowStr += cellValue + '\t';
        });
        console.log(rowStr);
    });
}