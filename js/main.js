'use strict';
console.log('my portfolio');

var gGameCards;
var gUtilCards;
var gActiveCategory;

function init() {
    gGameCards = getGameCards();
    gUtilCards = getUtilCards();
    gActiveCategory='.games';

    renderCards(gGameCards);
    closeNav();
}

function renderCards(cards) {
    closeNav();
    var htmlStr = '';
    cards.forEach(function (card) {
        var imgHtml = '<img src=" ' + card.imgSrc + '" alt=" ' + card.imgTitle + '">';
        var h3Html = '<h3>' + card.name + '</h3>';
        var pHtml = '<p>' + card.descLine1 + '<br>' + card.descLine2 + '</p>';

        htmlStr += '<div class="col-xs-10 col-sm-6 col-md-4 col-lg-3 col-centered col-min"> <div class="thumbnail card"' +
            'onclick="toggleCardGrow(this)"">' + imgHtml +
            '<div class="caption">' + h3Html + pHtml +
            '<p><a href=" ' + card.url + ' " class="btn btn-default" role="button">Start</a></div></div></div>'
    });

    var elCards = document.querySelector('.cards');
    elCards.innerHTML = htmlStr;
    elCards.classList.add('shown');
    
}

function getGameCards() {
    var cards = [];
    cards.push(createCard('Touch The Numbers', 'img/numbers.png', 'touch the numbers', 'Implementing setInterval', 'and CSS animations', 'projects/touchTheNumbers/index.html'));
    cards.push(createCard('Simon', 'img/simon.png', 'simon', 'Some cool Javascript', 'and CSS', 'projects/simon/index.html'));
    cards.push(createCard('Mine Sweeper', 'img/bomb.png', 'mine-sweeper game', 'Implementing some basic', 'Javascript power', 'projects/mineSweeper/index.html'));
    cards.push(createCard('Pacman', 'img/pacman.png', 'pacman game', 'Implementing pure CSS animations', 'and keyboard control', 'projects/pacman/index.html'));
    cards.push(createCard('Sokoban', 'img/sokoban.png', 'Sokoban game', 'Implementing keyboard control', 'and Javascript power', 'projects/sokoban/index.html'));

    return cards;
}

function getUtilCards() {
    var cards = [];
    cards.push(createCard('MyBookshop', 'img/books.png', 'my bookshop', 'Implementing LocalStorage and', 'framework-free CSS', 'projects/booksAreUs/index.html'));
    cards.push(createCard('To-Do organizer', 'img/todos.png', 'to-do organizer', 'Implementing LocalStorage', 'and CSS pseudo-elements', 'projects/todos/index.html'));
    cards.push(createCard('Blog Template', 'img/blog.png', 'Blog template', 'Responsive web design', 'Implementing media queries', 'projects/blogin/index.html'));
    cards.push(createCard('MemeGen', 'img/meme.png', 'Meme Generator', 'Mobile First design', 'Using jQuery and bootstrap', 'projects/memeGenerator/index.html'));
    cards.push(createCard('Simple Calendar', 'img/calendar.png', 'simple calendar game', 'Implementing a simple', 'responsive design', 'projects/simpleCalendar/index.html'));

    return cards;
}

function createCard(name, imgSrc, imgAlt, descLine1, descLine2, url) {
    var card = {
        name: name,
        imgSrc: imgSrc,
        imgAlt: imgAlt,
        descLine1: descLine1,
        descLine2: descLine2,
        url: url
    }
    return card;
}

function categoryClicked(selector,toRender){
    var elCurrCategory = document.querySelector('.selection-container').querySelector(gActiveCategory);
    var elNewCategory = document.querySelector('.selection-container').querySelector(selector);
    elCurrCategory.classList.remove('active');
    elNewCategory.classList.add('active');
    gActiveCategory = selector;
    var elCards = document.querySelector('.cards');
    elCards.classList.remove('shown');
    setTimeout(function() {
        renderCards(toRender);        
    }, 300);
}

//relevant only for mobile:
function toggleCardGrow(elCard) {
    var mq = window.matchMedia("(max-width: 480px)");
    if (mq.matches) {
        if (elCard.classList.contains('grow')) elCard.classList.remove('grow');
        else elCard.classList.add('grow');
    }
}