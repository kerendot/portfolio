'use strict';
console.log('meme generator');

// global vars:
var gImgs = getImgs();
var gMapImg = getMapImg(gImgs); //map by id
var gState = getEmptyState();
var gFilteredImgs;
var gKeywords= getKeywords(gImgs); //so we can renderCloud() on init();

function init() {
    renderImgs(gImgs, '.gallery-cont');
    renderCloud(gKeywords);
    
    $('.img').click(function () {
        gState.selectedImgId = this.id;
        $('.main-cont').toggle();
        $('.meme-cont').toggle();
        renderCanvas(gState, gMapImg);
    })

    

    
}


function getEmptyState() {
    var state = {
        selectedImgId: undefined,
        txts: []
    }
    state.txts.push(getTxtObj());
    state.txts.push(getTxtObj());
    return state;
}

function getTxtObj() {
    return {
        text: '',
        align: 'center',
        color: 'white',
        fontSize: '30px',
        fontFamily: 'Arial',
        hasBorder: false
    }
}

function getImgs() {
    var imgs = [];
    imgs.push(createImgObj(1, 'assets/img/1.jpg', 'Bad Luck Brian', ['lame', 'looser', 'bad-luck']));
    imgs.push(createImgObj(2, 'assets/img/2.jpg', 'Matrix Morpheus', ['prophecy','lame']));
    imgs.push(createImgObj(3, 'assets/img/3.jpg', 'Sad Ned', ['sad', 'disappointment']));
    imgs.push(createImgObj(4, 'assets/img/4.jpg', 'Success Baby', ['success']));
    imgs.push(createImgObj(5, 'assets/img/5.jpg', 'Star Trek WTF', ['wtf']));
    imgs.push(createImgObj(6, 'assets/img/6.jpg', 'Willy Wonka', ['please', 'tell-me-more']));
    imgs.push(createImgObj(7, 'assets/img/7.jpg', 'Dr. Evil', ['yeah-right', 'cynic']));
    imgs.push(createImgObj(8, 'assets/img/8.jpg', 'Nicholas Cage', ['you-don\'t say', 'no-shit']));
    return imgs;
}

function getMapImg(imgs) {
    var mapImg = {};
    imgs.forEach(function (img) {
        mapImg[img.id] = img;
    })
    return mapImg;
}

function createImgObj(id, url, title, keywords) {
    return {
        id: id,
        url: url,
        title: title,
        keywords: keywords
    }
}

function renderImgs(imgs, selector) {
    //clear current rendring:
    $('.img-cont').remove();

    var $elGallery = $(selector);
    imgs.forEach(function (img) {
        var $elImgCont = $('<div />', { class: 'img-cont' });
        var $elImg = $('<img />', {
            class: 'img',
            id: img.id,
            src: img.url
        }
        )
        $elImgCont.append($elImg);
        $elGallery.append($elImgCont[0]);
    });
}


function getKeywords(imgs) {
    var keywordsCount = {};
    imgs.forEach(function (img) {
        img.keywords.forEach(function (keyword) {
            if (keywordsCount[keyword]) {
                keywordsCount[keyword]++;
            } else {
                keywordsCount[keyword] = 1;
            }
        })
    });
    return keywordsCount;
}

// function renderState(state) {
//     var $elSelctedImg = $('.selected-img');
//     var selectedSrc = gMapImg[state.selectedImgId].url;
//     $elSelctedImg.attr("src",selectedSrc);
// }