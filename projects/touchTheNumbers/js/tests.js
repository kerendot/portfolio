function printBoardToConsole(board) {
    board.forEach(function (row) {
        var rowStr = '';
        row.forEach(function (cell) {
            rowStr += cell.value + '\t';
        });
        console.log(rowStr);
    });
}

function createTestBoard(size) {
    var board = [];
    var value = 1;
    for (var i = 0; i < size; i++) {
        var row = [];
        for (var j = 0; j < size; j++) {
            cell = { value: value++, isMarked: false };
            row.push(cell);
        }
        board.push(row);
    }
    return board;
}
