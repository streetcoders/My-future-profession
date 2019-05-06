
$(".content").on("click", ":button", function remov(){
	console.log($(this));
	$(this).parent().remove();
});
$(".content").on("change", ":text", function(){
	if($(this).parent().is(":last-child")){
		$(".content").append('<div><input type="text" id="Subjects_0_" name="Subjects[0]" class="form-control"> <input type="button" value="DELETE"></div>');		
	}
})