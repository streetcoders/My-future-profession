function handleFileSelect(evt) {
	var file = evt.target.files[0]; 
	var reader = new FileReader();
	
	if (!file.type.match('image.*')) {
		return;
	}
      
	reader.onload = (function(theFile) {
		return function(e) {
			$(".photo > img").attr("src",e.target.result);
		};
	})(file);

	reader.readAsDataURL(file);
}
$(document).ready(function () {
	$(".photo > div").on("click",function(){
	  $("#uploadedFile").click();
	});
  	document.getElementById('uploadedFile').addEventListener('change', handleFileSelect, false);
});

function setLiza(){
	alert("win");
}



