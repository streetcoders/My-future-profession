var subj = 0,
    prof = 0;
$(".dysc").on("click", "i", function remov() {
    console.log($(this));
    $(this).parent().remove();
});
$(".dysc").on("focus", ":text", function () {
    if ($(this).parent().is(":last-child")) {
        subj++;
        $(".dysc").append("<div class='form - group'><input type='text' id='Subjects_" + subj + "_' name='Subjects[" + subj + "]' class='form-control'><i class='material-icons'>restore_from_trash</i></div>");
    }
})
$("#Link").on("blur",validateYouTubeUrl);
$(".professions-spec").on("click", "i", function remov() {
    console.log($(this));
    $(this).parent().remove();
});
$(".professions-spec").on("focus", ":text", function () {
    if ($(this).parent().is(":last-child")) {
        prof++;
        $(".professions-spec").append("<div><input type='text' id='Jobs_0_' name='Jobs[" + prof + "]' class='form-control'><i class='material-icons'>restore_from_trash</i></div>");
    }
})

function validateYouTubeUrl() {    
    var url = $('#Link').val();
    if (url != undefined || url != '') {        
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match && match[2].length == 11) {           
            $('#videoObject').attr('src', 'https://www.youtube.com/embed/' + match[2] + '?autoplay=1&enablejsapi=1');
        } else {
            alert('not valid');
        }
    }else{
        $("#youtubeLink").val("Пиздец");
    }
}
