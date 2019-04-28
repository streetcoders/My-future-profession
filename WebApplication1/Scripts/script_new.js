var checkerAnim = false;
    checkerProfile = false;
    width = screen.width;
    profile_t = 0;
function animatingMove(which,x,y){
    which.style.top = x;
    which.style.left = y;
}
$(document).ready(function(){
    $(".menu").click(function(){
        $(".keep").toggleClass("hide-by-disp");
        $(".contacts").toggleClass("hide-by-disp");
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
    $(".keep").hover(function(){
        $(".keep").toggleClass("width");
        if (!checkerProfile) {
           profile_t = setTimeout(function(){
            $(".profile").removeClass("hide-by-disp");
            $(".profile-small").addClass("hide-by-disp");
        },200); 
       }else{
       		clearTimeout(profile_t);
            $(".profile").addClass("hide-by-disp");
            $(".profile-small").removeClass("hide-by-disp");
       }
        
        checkerProfile = !checkerProfile;
    });
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


