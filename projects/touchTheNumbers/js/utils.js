function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getValuesBetween(start, finish) {
    var nums=[];
    for (var i = start; i <= finish; i++) {
        nums.push(i);        
    }
    return nums;
}
