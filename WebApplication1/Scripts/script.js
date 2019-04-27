var checkerAnim = false;
    checkerProfile = false;
    width = screen.width;
function animatingMove(which,x,y){
    which.style.top = x;
    which.style.left = y;
}
$(document).ready(function(){
    $(".menu").click(function(){
        $(".keep").toggleClass("hide-by-disp");
        $(".contacts").toggleClass("hide-by-disp");
    });
    $(".keep").hover(function(){
        $(".keep").toggleClass("width");
        if (width > 768) {
            if (!checkerProfile) {
               setTimeout(function(){
                $(".profile").toggleClass("hide-by-disp");
                $(".profile-small").toggleClass("hide-by-disp");
            },200); 
            }else{
                $(".profile").toggleClass("hide-by-disp");
                $(".profile-small").toggleClass("hide-by-disp");
            }
        }
        
        
        checkerProfile = !checkerProfile;
    });
    $("article").click(function(){
        if ($(".keep").hasClass("hide-by-disp") == false){
            $(".keep").toggleClass("hide-by-disp");
            $(".contacts").toggleClass("hide-by-disp");
        }
    });
    if (width <= 768) {
        $(".profile").toggleClass("hide-by-disp");
        $(".profile-small").toggleClass("hide-by-disp");
    $(".contacts").click(function(){
    if (!checkerAnim) {
        checkerAnim = !checkerAnim;
        appearance();
    }else{
        checkerAnim = !checkerAnim;
        contactsDispose();
    }});
    }else{
    $(".contacts").hover(function(){
        if (!checkerAnim) {
            checkerAnim = !checkerAnim;
            appearance();
    }else{
        checkerAnim = !checkerAnim;
        contactsDispose();
    }});
    }
});

function appearance(){
    setTimeout(function(){animatingMove(document.getElementById('first-developer'),"-70px","calc(50% - 25px)")}, 50);
    setTimeout(function(){animatingMove(document.getElementById('second-developer'),"-60px","25px")}, 150);
    setTimeout(function(){animatingMove(document.getElementById('third-developer'),"-30px","-20px")}, 350);
    setTimeout(function(){animatingMove(document.getElementById('fourth-developer'),"-60px","125px")}, 250);
    setTimeout(function(){animatingMove(document.getElementById('fifth-developer'),"-30px","170px")}, 450);
}
function contactsDispose(){
    setTimeout(function(){animatingMove(document.getElementById('first-developer'),"50px","calc(50% - 25px)")}, 50);
    setTimeout(function(){animatingMove(document.getElementById('second-developer'),"50px","calc(50% - 25px)")}, 150);
    setTimeout(function(){animatingMove(document.getElementById('third-developer'),"50px","calc(50% - 25px)")}, 350);
    setTimeout(function(){animatingMove(document.getElementById('fourth-developer'),"50px","calc(50% - 25px)")}, 250);
    setTimeout(function(){animatingMove(document.getElementById('fifth-developer'),"50px","calc(50% - 25px)")}, 450);
}

/*function test(){
    //localStorage.clear();
    localStorage.setItem('id', $("#login").val());
}
alert(JSON.parse(window.localStorage.getItem('id'))+ " STORAGE: "+localStorage.length);*/


