
function toggleSearchBar(){
        $('.search-bar').toggle();
}


function filter() { 
    var searchKey = $('#search').val();
    var filtered = gImgs.filter(function (img) {
        // return img.keywords.indexOf(searchKey);
        for (var i = 0; i < img.keywords.length; i++) {
                if (img.keywords[i] === searchKey) {
                    return true;
            }
        }
    });
    console.log(filtered);
    
    renderImgs(filtered, ('.gallery-cont'));
}

