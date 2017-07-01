'use strict';


// TODOS
// When all foods are collected - game done
// cherry - intervalCherry (sets a timeout to reemove the cherry)
// Bonus: next level


var WALL = '#';
var FOOD = '.';
var EMPTY = ' ';

var gBoard;


var gState = {
  score: 0,
  isGameDone: false
};




function init() {

  gBoard = buildBoard();

  renderBoard(gBoard, '.boardContainer');

  console.table(gBoard);
}



function buildBoard() {
  var SIZE = 15;
  var board = [];
  for (var i = 0; i < SIZE; i++) {
    board.push([]);
    for (var j = 0; j < SIZE; j++) {

      board[i][j] = FOOD;


      if (i === 0 || i === SIZE - 1 ||
        j === 0 || j === SIZE - 1 ||
        (j == 3 && i > 4 && i < SIZE - 2)) {

        board[i][j] = WALL;

      }
    }
  }
  createPacman(board);
  createGhosts(board);

  return board;
}




function checkEngage(cell, opponent) {
  var isGameOver = false;
  if (cell === opponent) {
    if (gPacman.isSuper) {
      console.log('Ghost is dead');
    } else {
      clearInterval(gIntervalGhosts);
      gState.isGameDone = true;
      // alert('Game Over!');
      isGameOver = true;
    }
  }
  return isGameOver;
}




// this function updates both the model and the dom for the score
function updateScore(value) {
  gState.score += value;
  document.querySelector('header > h3 > span').innerText = gState.score;
}

function renderCell(location, value) {
  var cellSelector = '.cell' + location.i + '-' + location.j;
  var elCell = document.querySelector(cellSelector);
  var className;

  switch (value) {
    case (WALL):
      className = 'wall';
      elCell.innerHTML = value;
      elCell.classList.add(className);
      break;
    case (PACMAN):
      elCell.innerHTML = gPacmanAnimation[gPacman.direction];
      break;
    case (GHOST):
      className = 'blinky';
      elCell.innerHTML = '<div class="blinky"></div>';
      // elCell.querySelector('div').classList.add(className);
      break;
    default:
      elCell.innerHTML = value;
      break;

  }

}

function removeClassFromCell(location, clsToRemove) {
  var cellSelector = '.cell' + location.i + '-' + location.j;
  var elCell = document.querySelector(cellSelector);
  elCell.classList.remove(clsToRemove);
}

function removePacmanFromCell(location) {
  var cellSelector = '.cell' + location.i + '-' + location.j;
  var elCell = document.querySelector(cellSelector);
  elCell.innerHTML = '';
}

function renderBoard(board, selector) {

  var elContainer = document.querySelector(selector);

  var strHTML = '<table border="1"><tbody>';
  board.forEach(function (row, i) {
    strHTML += '<tr>';

    row.forEach(function (cell, j) {

      var className = 'cell cell' + i + '-' + j;

      switch (cell) {
        case (WALL):
          className += ' wall';
          strHTML += '<td class="' + className + '"> ' + cell + ' </td>';
          break;
        case (PACMAN):
          // className += ' pacman';
          var pacAnimationStrHtml = gPacmanAnimation[gPacman.direction];
          strHTML += '<td class=" ' + className + ' ">' + pacAnimationStrHtml + '</td>';
          break;
        case (GHOST):
          // className += ' blinky';
          // strHTML += '<td class="' + className + '"> ' + cell + ' </td>';
          strHTML += '<td class="' + className + '"><div class="blinky"></div> </td>';
          break;
        default:
          strHTML += '<td class="' + className + '"> ' + cell + ' </td>';
          break;
      }


    });

    strHTML += '</tr>'

  })
  strHTML += '</tbody></table>';

  elContainer.innerHTML = strHTML;
}
