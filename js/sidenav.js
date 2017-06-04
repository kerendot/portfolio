// open side-nav,  on medium and large also push content 
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    var mq = window.matchMedia("(max-width: 480px)");
    if (!mq.matches) {
        document.querySelector("main").style.marginLeft = "250px";
    }
}

//  close side-nav,  on medium and large also move content back
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    var mq = window.matchMedia("(max-width: 480px)");
    if (!mq.matches) {
        document.querySelector("main").style.marginLeft = "0";
    }
}