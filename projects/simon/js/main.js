var gNotes = [{ color: 'blue', sound: 'F' }, { color: 'red', sound: 'G' }, { color: 'green', sound: 'A' }, { color: 'yellow', sound: 'B' }]

var gState;

function getInitialState() {
    return {
        seqIdxs: [],
        isUserTurn: false,
        isPlaying: false,
        isGameOn: false,
        currUserNoteIdx: 0
    }
}

function init() {    
    gState = getInitialState();
    renderPiano();
    tellUser('Start Game');
}

function startGame(elDisplay){
    if (elDisplay.innerText !== 'Start Game') return;
    gState.isGameOn = true;
    doComputerTurn();    
}

function renderPiano() {
    var strHtmls = gNotes.map(function (note, i) {

        var strOnClick = ' onclick="noteClicked(this, ' + i + ')" ';
        var strHtml = '<div ' + strOnClick + ' class="pad ' + note.color + '"></div>'
        return strHtml;
    });

    var elPiano = document.querySelector('.simon-panel');
    var strHtml = strHtmls.join('') + ' <div class="display" id="display" onclick="startGame(this)"></div>'
    elPiano.innerHTML = strHtml;
}

function doComputerTurn() {
    gState.isUserTurn = false;
    gState.currUserNoteIdx = 0;
    tellUser('My\n Turn');
    renderLevel(gState.seqIdxs.length+1);
    addNote();
    playNotesSeq();
}

function addNote() {
    var seqIdx = getRandomInt(0, gNotes.length);
    gState.seqIdxs.push(seqIdx);
}

function playNotesSeq() {
    var elNotes = document.querySelectorAll('.pad');
    gState.seqIdxs.forEach(function handleNote(seqIdx, i) {
        setTimeout(function () {
            playNote(elNotes[seqIdx], seqIdx);
        }, 1000 * (i + 1));
    });

    // After all notes were played:
    setTimeout(function () {
        tellUser('Your Turn');
        gState.isUserTurn = true;
    }, 1000 * (gState.seqIdxs.length + 1));

}

// Called from DOM
function noteClicked(elNote, idxUserClicked) {
    if (!gState.isGameOn ||!gState.isUserTurn || gState.isPlaying ) return;
    gState.isPlaying = true;
    playNote(elNote, idxUserClicked);
    var noteIdxCorrect = gState.seqIdxs[gState.currUserNoteIdx];

    if (idxUserClicked === noteIdxCorrect) {
        // If user done playing the curr seq
        if (gState.currUserNoteIdx === gState.seqIdxs.length - 1) {
            setTimeout(function () {
                doComputerTurn();
            }, 500);
        } else {
            gState.currUserNoteIdx++;
        }
    } else {
        Synth.play(3, 'A', 4, 0.5);
        tellUser('Game Over!');
        gState.isGameOn = false;
        setTimeout(function () {
            init();
        }, 2000);
    }
}

function playNote(elNote, idx) {
    elNote.classList.add('active');
    Synth.play(1, gNotes[idx].sound, 4, 0.5);
    setTimeout(function () {
        gState.isPlaying = false;
        elNote.classList.remove('active');
    }, 500)
}

function tellUser(msg) {
    var elMsg = document.querySelector('.display');
    elMsg.innerText = msg;
}

function renderLevel(level){
    var elLevel = document.querySelector('.level').querySelector('span');
    elLevel.innerText = level;
}