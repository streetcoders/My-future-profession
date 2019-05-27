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
