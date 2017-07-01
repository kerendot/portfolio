'use strict';

function convertTimestamptoDate(timestamp) {
    var date = moment(timestamp).format('MM/DD/YYYY , hh:mm');
    return date;
}

//input date format: 'MM/DD/YYYY , hh:mm'
function convertDateToTimestamp(date) {
    var timestamp = new Date(date).getTime();
    return timestamp;
}

function convertTimestampToUTCdate(timestamp) {
    var date = (new Date(timestamp)).toUTCString();
    return date;
}

function getNowTimestamp() {
    var timestamp = new Date().getTime();
    return timestamp;
}

// //old function (not perfect)
// function convertTimestamptoDate(timestamp) {
//     var day = new Date(timestamp).getDate();
//     var month = new Date(timestamp).getMonth() + 1;
//     var year = new Date(timestamp).getFullYear();
//     var hours = new Date(timestamp).getHours();
//     var mins = new Date(timestamp).getMinutes();
//     if (mins === 0) mins = '00';
//     var original_date = month + '/' + day + '/' + year + ' , ' + hours +':' + mins;
//     //returned date format: 'MM/DD/YYYY , hh:mm'
//     return original_date;
// }


// function binarySearchIndexToInsert(arr, newElement) {
//     var minIndex = 0;
//     var maxIndex = arr.length - 1;
//     var currentIndex;
//     var currentElement;
//     // debugger;
//     while (minIndex < maxIndex) {
//         currentIndex = (minIndex + maxIndex) / 2 | 0;
//         currentElement = arr[currentIndex];

//         if (currentElement < newElement) {
//             minIndex = currentIndex + 1;
//         }
//         else if (currentElement  > newElement ) {
//             maxIndex = currentIndex - 1;
//         }
//         else {
//             return currentIndex;
//         }
//     }
//     console.log('min='+minIndex+' max='+maxIndex+' arr[min]='+arr[minIndex]+' arr[max]='+arr[maxIndex]);
//     //after loop, should be minIdx===maxIdx
//     // if (arr[minIndex]<newElement) return minIndex-1;
//     // else return minIndex;
//     return minIndex;
// }

// var arr = [1,3,7,10,13,14,16,20,25,30];
// // var idx = binarySearchIndexToInsert(arr,val);
// console.log('index of 11, expected 4',binarySearchIndexToInsert(arr,11));
// console.log('index of 5, expected 2',binarySearchIndexToInsert(arr,5));
// console.log('index of 15, expected 6',binarySearchIndexToInsert(arr,15));
// console.log('index of 9, expected 3',binarySearchIndexToInsert(arr,9));
// console.log('index of 2, expected 1',binarySearchIndexToInsert(arr,2));
// console.log('index of 0, expected 0',binarySearchIndexToInsert(arr,0));
// console.log('index of 12, expected 4',binarySearchIndexToInsert(arr,12));
// console.log('index of 17, expected 6 or 7',binarySearchIndexToInsert(arr,17));
// console.log('index of 22, expected 8',binarySearchIndexToInsert(arr,22));
// console.log('index of 27, expected 9',binarySearchIndexToInsert(arr,22));
