'use strict';

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