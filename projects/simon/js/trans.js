var gCurrLang = 'en';
var gTrans = {
    en : {
        NAV_LIFESTYLE : 'lifestyle',
        NAV_PHOTODIARY: 'photodiary'
    },
    he : {
        NAV_LIFESTYLE : 'איכות חיים',
        NAV_PHOTODIARY: 'גלריה'
    }
};

window.onload = translatePage;

function translatePage() {
    var els = document.querySelectorAll('[data-trans]');
    for (var i=0; i<els.length; i++) {
        var el = els[i];

        var transKey = el.getAttribute('data-trans');
        el.innerText = gTrans[gCurrLang][transKey];

    }  
}

function setLang(lang) {
    gCurrLang= lang;

    if (lang === 'he') {
        document.body.classList.add('rtl');
    } else {
        document.body.classList.remove('rtl');
    }

    translatePage();
}