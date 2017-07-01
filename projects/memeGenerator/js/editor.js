'use strict';

$('.btn-back').click(function () {
        //reset state and input fields:
        gState = getEmptyState();
         $('.line-cont input').val('');

         //toggle back the display:
        $('.main-cont').toggle();
        $('.meme-cont').toggle();
})

function renderCanvas(state, map) {
    var canvas = document.querySelector('.canvas');
    var context = canvas.getContext('2d');

    //render the image:
    var image = new Image();
    var selectedImgsrc = map[state.selectedImgId].url;
    image.src = selectedImgsrc;

    canvas.height = image.height;
    canvas.width = image.width;
    context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);

    //render the text lines
    var txts = state.txts;
    txts.forEach(function (txt, idx) {

        context.textAlign = txt.align;
        context.fillStyle = txt.color;
        context.font = txt.fontSize + ' ' + txt.fontFamily;
        // context.font = 'bold ' + txt.fontSize + ' ' + txt.fontFamily;

        var txtHeight;
        if (idx === 0) txtHeight = 30;
        if (idx === 1) txtHeight = canvas.height - 10;
        context.fillText(txt.text, canvas.width / 2, txtHeight);

        if (txt.hasBorder) {
            context.strokeStyle = 'black';
            context.lineWidth = 3;
            context.strokeText(txt.text, canvas.width / 2, txtHeight);
            context.fillStyle = txt.color;
            context.fillText(txt.text, canvas.width / 2, txtHeight);
        }
    });

}

function generateMeme() {
    var canvas = document.querySelector('.canvas');
    window.open(canvas.toDataURL("image/png"));
}
//this function updates a single parameter in txt and render canvas
function updateTxt(state, map, txt, property, value) {
    txt[property] = value;
    renderCanvas(state, map);
}

//this function returns the idx which is the substr after "-" in the element's id
//e.g. "btn-font-inc-12" will return 12
function getIdxFromId(elementId) {
    var parts = elementId.split('-');
    var idx = +parts.pop(); //convert to number
    return idx;
}

$('.line-cont input').keyup(function () {
    var txtIdx = getIdxFromId(this.id);
    var txtToUpdate = gState.txts[txtIdx];
    updateTxt(gState, gMapImg, txtToUpdate, 'text', this.value);
})

$('.btn-border').click(function () {
    var txtIdx = getIdxFromId(this.id);
    var txtToUpdate = gState.txts[txtIdx];
    updateTxt(gState, gMapImg, txtToUpdate, 'hasBorder', !txtToUpdate.hasBorder);
})

$('.btn-font-inc').click(function () {
    var txtIdx = getIdxFromId(this.id);
    var currFontSize = gState.txts[txtIdx].fontSize;
    var newFontSize = getNewFontSize(currFontSize, 2, true);
    updateTxt(gState, gMapImg, gState.txts[txtIdx], 'fontSize', newFontSize);
})

$('.btn-font-dec').click(function () {
    var txtIdx = getIdxFromId(this.id);
    var currFontSize = gState.txts[txtIdx].fontSize;
    var newFontSize = getNewFontSize(currFontSize, 2, false);
    updateTxt(gState, gMapImg, gState.txts[txtIdx], 'fontSize', newFontSize);
})

//this function returns the new font size str (including "px")
function getNewFontSize(currFontSize, delta, isInc) {
    //remove "px" and convert to num:
    var currFontSizeNum = +currFontSize.substring(0, currFontSize.length - 2);
    var newFontSizeNum = (isInc) ? currFontSizeNum + delta : currFontSizeNum - delta;
    return newFontSizeNum + 'px';
}




