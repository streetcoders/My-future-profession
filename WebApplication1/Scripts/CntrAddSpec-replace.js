
$(".dysc").on("click", "i", function remov(){
	console.log($(this));
	$(this).parent().remove();
});
$(".dysc").on("focus", ":text", function(){
	if($(this).parent().is(":last-child")){
		$(".dysc").append('<div><input type="text" id="Subjects_0_" name="Subjects[0]" class="form-control"><i class="material-icons">restore_from_trash</i></div>');		
	}
})

$(".professions-spec").on("click", "i", function remov(){
	console.log($(this));
	$(this).parent().remove();
});
$(".professions-spec").on("focus", ":text", function(){
	if($(this).parent().is(":last-child")){
		$(".professions-spec").append('<div><input type="text" id="Subjects_0_" name="Subjects[0]" class="form-control"><i class="material-icons">restore_from_trash</i></div>');		
	}
})