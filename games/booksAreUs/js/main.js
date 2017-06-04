'use strict';
console.log('BooksAreUs');

var gElBooksTbl;
var gState = { lastUsedId: 1, workInProgress: false };
var gBooks;
var STORAGE_KEY_BOOKS = 'books';
var STORAGE_KEY_LASTUSED_ID = 'booksLastUsedId';

function init() {

    gBooks = loadFromStorage(STORAGE_KEY_BOOKS);
    gState.lastUsedId = loadFromStorage(STORAGE_KEY_LASTUSED_ID);
    if (!gBooks) gBooks = getBooks();

    var tblSection = document.querySelector('.booksTbl');
    gElBooksTbl = tblSection.querySelector('table');
    renderBooks(gBooks);
}

function getBooks() {


    var books = [
        createBookObj(1, 'To Kill a Mockingbird', 100, 'https://2982-presscdn-29-70-pagely.netdna-ssl.com/wp-content/uploads/2015/07/To-Kill-a-Mockingbird-Cover-1-186x300.jpg'),
        createBookObj(2, 'Catcher in the Rhye', 150, 'http://blog.americanwritersmuseum.org/wp-content/uploads/2016/01/Catcher-in-the-Rye.jpg'),
        createBookObj(3, 'Little Women', 50, 'http://blogs.slj.com/afuse8production/files/2012/05/LittleWomen4.jpg')
    ]
    gState.lastUsedId = 3;
    return books;
}

function renderBooks(books) {
    clearTable();
    books.forEach(function (book) {
        renderRow(gElBooksTbl, book);
    });
}

function clearTable() {
    var tableRows = gElBooksTbl.getElementsByTagName('tr');
    var rowCount = tableRows.length;
    for (var i = rowCount - 1; i > 0; i--) {
        deleteElRow(gElBooksTbl, i);
    }
}

/////////// functions for new book creation /////////////////

function newBookClicked() {
    if (gState.workInProgress) return;
    gState.workInProgress = true;
    showNewBookPopup();
}

function showNewBookPopup() {
    var elPopup = document.querySelector('.popup.new-book');
    elPopup.classList.remove('hide');
    var elPopupBg = document.querySelector('.popup-bg');
    elPopupBg.classList.remove('hide');
    //set focus to price input
    var elInputTitle = elPopup.querySelector('#inputTitle');
    elInputTitle.focus();
}

function createNewBookClicked() {
    var elPopup = document.querySelector('.popup.new-book');
    var elInputData = elPopup.querySelectorAll('input');
    var title = elInputData[0].value;
    var price = elInputData[1].value;
    var imgUrl = elInputData[2].value;
    addBook(gBooks, title, price, imgUrl);
    gState.workInProgress = false;
    closeInputPopup('.popup.new-book');
}

function cancelNewBookClicked() {
    closeInputPopup('.popup.new-book');
}

/////////// functions for table action buttons /////////////////

/// update button ///

function updateBookClicked(id) {
    if (gState.workInProgress) return;
    gState.workInProgress = true;
    showUpdateBookPopup(id);
}

function showUpdateBookPopup(id) {
    var elPopup = document.querySelector('.popup.update-book');
    elPopup.classList.remove('hide');
    var elPopupBg = document.querySelector('.popup-bg');
    elPopupBg.classList.remove('hide');

    var elBookId = elPopup.querySelector('bookId');
    elBookId.innerText = id;
    var elCurrPrice = elPopup.querySelector('currPrice');
    var bookIdx = getBookIdxById(id);
    elCurrPrice.innerText = gBooks[bookIdx].price;

    //set focus to price input
    var elInputPrice = elPopup.querySelector('#inputNewPrice');
    elInputPrice.focus();
}

function confirmUpdateBookClicked() {
    var elPopup = document.querySelector('.popup.update-book');
    var elBookId = elPopup.querySelector('bookId');
    var id = elBookId.innerText;
    var elInputData = elPopup.querySelector('input');
    var newPrice = elInputData.value;

    updateBook(id, newPrice);

    gState.workInProgress = false;
    closeInputPopup('.popup.update-book');
}

function updateBook(id, newPrice) {
    //update model
    var bookIdx = getBookIdxById(id);
    gBooks[bookIdx].price = newPrice;
    saveDataToStorage();
   
    //render table section
    var elRows = gElBooksTbl.rows;
    var elBook = elRows[bookIdx + 1]; //adding 1 to idx because of table's header in DOM
    var elCellPrice = elBook.cells[2];
    elCellPrice.innerText = newPrice;
    //render book details section
    renderBookDetails(id);
}

function cancelUpdateBookClicked() {
    closeInputPopup('.popup.update-book');
}

function closeInputPopup(selector) {
    var elPopup = document.querySelector(selector);
    var elInputData = elPopup.querySelectorAll('input');

    //reset the input data
    elInputData.forEach(function (elInput) {
        elInput.value = '';
    });

    elPopup.classList.add('hide');
    var elPopupBg = document.querySelector('.popup-bg');
    elPopupBg.classList.add('hide');
    gState.workInProgress = false;
}

/// read button ///

function readBookClicked(id) {
    if (gState.workInProgress) return;
    var elSection = document.querySelector('.book-details');
    var elId = elSection.querySelector('.details-id');
    //if read is clicked for an already shown book, hide the section
    if (id === +elId.innerText && !elSection.classList.contains('hide')) {
        elSection.classList.add ('hide');
        return;
    }
    elSection.classList.remove('hide');
    renderBookDetails(id);
}

function renderBookDetails(id) {
    var bookIdx = getBookIdxById(id);
    var book = gBooks[bookIdx];

    var elSection = document.querySelector('.book-details');

    var elTitle = elSection.querySelector('.details-title');
    var elImg = elSection.querySelector('img');
    var elId = elSection.querySelector('.details-id');
    var elPrice = elSection.querySelector('.details-price');
    var elRate = elSection.querySelector('.details-rate');

    elTitle.innerText = book.title;
    elId.innerText = id;
    elPrice.innerText = book.price;
    elRate.innerText = book.rate;
    elImg.src = book.imgUrl;
}

function closeBookDetailsClicked() {
    if (gState.workInProgress) return;
    var elSection = document.querySelector('.book-details');
    elSection.classList.add('hide');
}

/// delete button ///

function deleteBookClicked(id) {
    if (gState.workInProgress) return;
    var bookIdx = getBookIdxById(id);
    gBooks.splice(bookIdx, 1);
    saveDataToStorage();
    
    //in DOM, the row is +1 because of table's header  
    deleteElRow(gElBooksTbl, bookIdx + 1);
}

function deleteElRow(elTable, rowIdx) {
    elTable.deleteRow(rowIdx);
}

//general functions

function addBook(books, title, price, imgUrl) {
    var id = ++gState.lastUsedId;
    var book = createBookObj(id, title, price, imgUrl);
    books.push(book);
    saveDataToStorage();
    renderRow(gElBooksTbl, book);
}

function createBookObj(id, title, price, imgUrl) {
    return {
        id: id,
        title: title,
        price: price,
        //if no url was sent, use a default pic
        imgUrl: (imgUrl) ? imgUrl : 'https://upload.wikimedia.org/wikipedia/commons/6/61/Book-icon-orange.png',
        rate: 0
    }
}


function renderRow(elTable, book) {
    var row = elTable.insertRow();
    var cell0 = row.insertCell(0);
    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var cell3 = row.insertCell(3);
    var cell4 = row.insertCell(4);
    var cell5 = row.insertCell(5);
    cell0.innerText = book.id;
    cell1.innerText = book.title;
    cell2.innerText = book.price;

    cell3.innerHTML = '<button class="btn btn-success" onclick="readBookClicked(' + book.id + ')">READ</button>';
    cell4.innerHTML = '<button class="btn btn-warning" onclick="updateBookClicked(' + book.id + ')">UPDATE</button>';
    cell5.innerHTML = '<button class="btn btn-danger" onclick="deleteBookClicked(' + book.id + ')">DELETE</button>';

    cell3.style.textAlign = "center";
    cell4.style.textAlign = "center";
    cell5.style.textAlign = "center";
}

//this function returns the idx of a book in gBooks , according to its id
function getBookIdxById(id) {
    var idx;
    idx = gBooks.findIndex(function (book) {
        return book.id === +id; //make sure id is a number
    });
    return idx;
}

function thumbClicked(elThumb, isUp) {
    var elBookDetails = document.querySelector('.book-details');
    var elBookId = elBookDetails.querySelector('.details-id');
    var bookIdx = getBookIdxById(elBookId.innerText);
    var book = gBooks[bookIdx];

    changeRate(book, isUp);

    //render the rate
    var elRate = elBookDetails.querySelector('.details-rate');
    elRate.innerText = book.rate;
}

function changeRate(book, isUp) {
    if (isUp) book.rate++;
    else book.rate = Math.max(0, book.rate - 1);
    saveDataToStorage();
}

function sortByClicked(prop) {
    if (gState.workInProgress) return;
    sortBooks(gBooks, prop);
    saveDataToStorage();
    renderBooks(gBooks);
}

//this function will sort "books" according to the specified prop
function sortBooks(books, prop) {
    var sortedBooks;

    //   if array is sorted descending, sort ascending
    if (isSortedDes(books, prop)) {
        //sort asc 
        books.sort(function (a, b) {
            if (a[prop] < b[prop])
                return -1;
            if (a[prop] > b[prop])
                return 1;
            return 0;
        });

    }

    else {
        //sort desc
        books.sort(function (a, b) {
            if (a[prop] > b[prop])
                return -1;
            if (a[prop] < b[prop])
                return 1;
            return 0;
        });
    }
}

function isSortedDes(books, prop) {
    for (var i = 0; i < books.length - 1; i++) {
        if (books[i][prop] < books[i + 1][prop]) {
            return false;
        }
    }
    return true;
}

function saveDataToStorage(){
    saveToStorage(STORAGE_KEY_BOOKS, gBooks);
    saveToStorage(STORAGE_KEY_LASTUSED_ID, gState.lastUsedId);  
}

/////////////not in use////////////

// function closeShownInputPopup() {
//     var elPopups = document.querySelectorAll('.popup');
//     var shownPopups = elPopups.forEach(function (elPopup) {
//         if (!elPopup.classList.contains('hide')) {
//             var elInputData = elPopup.querySelectorAll('input');

//             //reset the input data
//             elInputData.forEach(function (elInput) {
//                 elInput.value = '';
//             });
//             elPopup.classList.add('hide');
//         }
//     });

//     var elPopupBg = document.querySelector('.popup-bg');
//     elPopupBg.classList.add('hide');
//     gState.workInProgress = false;
// }

// //this function returns the idx of a book in gBooks , according to its id (using Binary Search)
// function getBookIdxById(id) {
//     var minIndex = 0;
//     var maxIndex = gBooks.length - 1;
//     var currentIndex;
//     var currentBook;

//     while (minIndex <= maxIndex) {
//         currentIndex = (minIndex + maxIndex) / 2 | 0;
//         currentBook = gBooks[currentIndex];

//         if (currentBook.id < id) {
//             minIndex = currentIndex + 1;
//         }
//         else if (currentBook.id  > id ) {
//             maxIndex = currentIndex - 1;
//         }
//         else {
//             return currentIndex;
//         }
//     }
//     return -1;
// }