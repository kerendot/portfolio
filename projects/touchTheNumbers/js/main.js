'use strict';
console.log('Touch the numbers');


//enhancements to implement: 
//allow use to choose colors and save in local storage
//have a setting area floated from left, allow to change theme(color)
//animate countdown to start game
//remember users prefs: level, color

var gBoard;
var gGameData;
var gLevel;
var gGameInterval;

const LVL_EASY = 4;
const LVL_HARD = 5;
const LVL_EXTRM = 6;

function init() {
    gLevel = LVL_EASY;
    resetGame();
}

function getLevel() {
    var level = $('input[name="radioLvl"]:checked').val();
    return level;
}

function resetGame() {
    gGameData = { markedCells: 0, isGameOn: false };

    //in case "start" was clicked in the middle of a running game
    if (gGameInterval !== undefined) {
        clearInterval(gGameInterval);
        gGameInterval = undefined;
    }

    //reset "get ready" animation
    var elGetReady = document.querySelector('.get-ready');
    elGetReady.style.display = '';
    var elTbl = document.querySelector('.boardTbl');
    elTbl.style.opacity = 0;

    gLevel = getLevel();
    gBoard = createBoard(gLevel);

    ////////change commenting to toggle testing////////////
    // gLevel = 2;
    // gBoard = createTestBoard(gLevel);
    // renderBoard(gBoard);
    ////////////////////////////////////////////
}

function createBoard(size) {
    var board = [];
    var valuesToUse = getValuesBetween(1, size * size);
    for (var i = 0; i < size; i++) {
        var row = [];
        for (var j = 0; j < size; j++) {
            row.push(createCellObj(valuesToUse));
        }
        board.push(row);
    }
    return board;
}

function createCellObj(availabelValues) {
    var idx = getRandomIntInclusive(0, availabelValues.length - 1);
    var value = availabelValues[idx];
    var cell = {
        value: value,
        isMarked: false
    }
    availabelValues.splice(idx, 1);
    return cell;
}

function startGame() {
    resetGame();
    renderNextNumber();    
    animateGetReady();

    // delay game start to allow the get-ready animation
    setTimeout(function () {
        gGameData.isGameOn = true;
        var startTime = Date.now();
        gGameInterval = setInterval(function () {
            var elapsedTime = Date.now() - startTime;
            document.getElementById("timer").innerText = (elapsedTime / 1000).toFixed(3);
        }, 100);
    }, 3000);
}

function animateGetReady() {
    var elGetReady = document.querySelector('.get-ready');
    var elTbl = document.querySelector('.boardTbl');

    var currCount = 3;
    for (var i = 0; i < 3; i++) {
        setTimeout(function () {
            elGetReady.innerText = currCount--;
        }, 1000 * i);
    }

    setTimeout(function () {
        elGetReady.style.display = 'none';
        elTbl.style.opacity = 1;
        renderBoard(gBoard, 'animated rubberBand');
    }, 3000);
}

function renderBoard(board, classToAnimate) {
    var strHtml = '';
    board.forEach(function (row, i) {
        strHtml += '<tr>';
        row.forEach(function (cell, j) {
            var className = classToAnimate;
            var cellText = cell.value;
            if (cell.isMarked) {
                className += 'marked ';
            }
            strHtml += `<td id="cell-${i}-${j}" onclick="cellClicked(${i},${j})" class="${className}">${cellText}</td>`;
        });
        strHtml += '</tr>';
    });
    var elBoard = document.querySelector('.boardTbl');
    elBoard.innerHTML = strHtml;
}

function cellClicked(idxI, idxJ) {
    if (!gGameData.isGameOn) return;

    var cell = gBoard[idxI][idxJ];

    if (cell.isMarked) return;
    if (!isValidCell(cell)) {
        handleWrongCell(idxI, idxJ);
        return;
    }

    gGameData.markedCells++;
    var isVictory = checkVictory();

    //for punctuality, timer is stopped ASAP
    if (isVictory) clearInterval(gGameInterval);

    handleValidCell(idxI, idxJ);

    if (isVictory) {
        handleVictory();
    }
}

function isValidCell(cell) {
    return (cell.value === gGameData.markedCells + 1);
}

function handleWrongCell(idxI, idxJ) {
    var elCell = document.querySelector('#cell-' + idxI + '-' + idxJ + '');
    animateCell(elCell, 'shake');
}

function handleValidCell(idxI, idxJ) {
    gBoard[idxI][idxJ].isMarked = true;
    var elCell = document.querySelector('#cell-' + idxI + '-' + idxJ + '');
    animateCell(elCell, 'rotateIn');
    elCell.classList.add('marked');

    renderNextNumber();
}

function renderNextNumber() {
    var elNextNum = document.querySelector('.next-number');
    var elNextNumSpan = elNextNum.querySelector('span');
    if (!checkVictory()) elNextNumSpan.innerText = gGameData.markedCells + 1;
}

function animateCell(elCell, animationName) {
    elCell.style.animationDuration = "0.2s";
    elCell.classList.add('animated');
    elCell.classList.add(animationName);
}

function checkVictory() {
    return (gGameData.markedCells === gLevel * gLevel);
}

function handleVictory() {
    gGameData.isGameOn = false;
    var elapsedTime = document.getElementById("timer").innerText;
    var elModalTime = document.querySelector('#victoryModalTime');
    var elModalTimeSpan = elModalTime.querySelector('span');
    elModalTimeSpan.innerText = elapsedTime;
    $("#victoryModal").modal("show");
}