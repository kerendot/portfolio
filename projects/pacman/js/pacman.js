var gPacman; 
var PACMAN  = '&#9786;';

var gPacmanAnimation = {
  right:'<div class="pacman-top top-right"></div><div class="pacman-bottom bottom-right"></div>',
  left: '<div class="pacman-top top-left"></div><div class="pacman-bottom bottom-left"></div>',
  down: '<div class="pacman-left right-down"></div><div class="pacman-right right-up"></div>',
  up:'<div class="pacman-left left-down"></div><div class="pacman-right left-up"></div>'
}

function createPacman(board) {
  gPacman = {
    location: {
      i: 3,
      j: 5
    },
    isSuper: false,
    direction:'right'
  }; 
  
  board[gPacman.location.i][gPacman.location.j] = PACMAN;
}

function movePacman(eventKeyboard) {
  // console.log('eventKeyboard:', eventKeyboard);
  
  if (gState.isGameDone) return;
  
  var nextLocation = {
    i: gPacman.location.i, 
    j: gPacman.location.j
  };
  
  switch (eventKeyboard.code) {
    
    case 'ArrowUp': 
      //console.log('Arrow Up!');
      nextLocation.i--;
      gPacman.direction = 'up';
      break;
    case 'ArrowDown': 
      //console.log('Arrow Down!');
      nextLocation.i++;
      gPacman.direction = 'down';
      break;
    case 'ArrowLeft': 
      //console.log('Arrow Left!');
      nextLocation.j--;
      gPacman.direction = 'left';
      break; 
    case 'ArrowRight': 
      //console.log('Arrow Right!');
      nextLocation.j++;
      gPacman.direction = 'right';
      break;           
    
  }
  
  var nextCell = gBoard[nextLocation.i][nextLocation.j];
  // console.log('Heading: row:', newLocation.i , ' col: ', newLocation.j );
  // console.log('Whats there:', gBoard[newLocation.i][newLocation.j]);
  
  // hitting a wall, not moving anywhere
  if (nextCell === WALL) return;

  // hitting FOOD
  if (nextCell === FOOD) {
    updateScore(1);
  } 
  
  var isGameOver = checkEngage(nextCell, GHOST);
  if (isGameOver) return;
  
  // update the model to reflect movement
  gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;
  //removeClassFromCell(gPacman.location, 'pacman');
  removePacmanFromCell(gPacman.location);
  
  // render updated model to the DOM
  renderCell(gPacman.location, EMPTY);
  
  // Update the pacman MODEL to new location  
  gPacman.location = nextLocation;
  gBoard[gPacman.location.i][gPacman.location.j] = PACMAN;
  
  // render updated model to the DOM
  renderCell(gPacman.location, PACMAN);
  
}

