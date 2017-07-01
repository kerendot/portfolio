'use strict';

function renderCloud(keywords) {
    var cloud = document.querySelector('.cloud-cont');
    Object.keys(keywords).forEach(function(keyword){
        cloud.innerHTML+= '<div class="tag" ><span onclick="renderImgFromCloud(this)" style="font-size:'+keywords[keyword]*15+'px;padding-left:10px">\
        ' +keyword+ '</span></div>';
    });
}


function renderImgFromCloud(x){
    var keyword= x.innerHTML.trim();
console.log(keyword);
    var filtered = gImgs.filter(function (img) {
        for (var i = 0; i < img.keywords.length; i++) {
                if (img.keywords[i] === keyword) {
                    return true;
            }
        }
    });
    renderImgs(filtered, ('.gallery-cont'));
}




