'use strict';

// About Exceptions Handling with try-catch-finally
// function foo() {
//     console.log('foo start');
//    if (false || 1) throw new Error('Not good!')
//     console.log('foo end');
// }

// function goo() {
//     try {
//         foo();
//     } catch (err) {
//         console.log('goo cought foo error', err);
//         momo.popo = 9;
//     } finally {
//         console.log('Finally!');
//     }
//     console.log('goo continues');
// }

// goo();


function saveToStorage(key, any) {
    try {
        localStorage.setItem(key, JSON.stringify(any));
    } catch (err) {
        console.error('Problem saving to storage', err);
    }
}

function loadFromStorage(key) {
    var any = null;
    try {
        any = JSON.parse(localStorage.getItem(key));
    } catch (err) {
        console.warn('Removing Corrupted data from storage', err);
        localStorage.removeItem(key);
    }
    return any;
}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function moveItemBackward(arr, idx){
    if (idx === 0) return;
    var tempItem = arr[idx-1];
    arr[idx-1] = arr[idx];
    arr[idx] = tempItem;
}

function moveItemForward(arr, idx){
    if (idx === arr.length-1) return;
    var tempItem = arr[idx+1];
    arr[idx+1] = arr[idx];
    arr[idx] = tempItem;
}
