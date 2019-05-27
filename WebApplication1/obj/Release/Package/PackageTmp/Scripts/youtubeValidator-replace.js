$(document).ready(function(){
	var url = $(".video-container > iframe").attr("src");
	validateYouTubeUrl(url);
});

function validateYouTubeUrl(url) {
    if (url != undefined || url != '') {        
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match && match[2].length == 11) {
            url = url.replace("watch?v=", "embed/");
            $(".video-container > iframe").attr("src",url);
            $(".video-container").css("display","block");
        }
    }
}