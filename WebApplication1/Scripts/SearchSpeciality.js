// First string. мммм, запах нового скрипта)
var list     = [],
    all_divs = [],
    s1           ,
    s2           ,
    s3           ;

$(document).ready(function(){
	for(var i = 2; i <= $(".block-w-item").length+1; i++){
		list.push({
			code: $(".block-w-item:nth-child(" + i + ")").children(".code-circle").text(),
			name: $(".block-w-item:nth-child(" + i + ")").children(".name-speciality").text(),
		});	
	}
	all_divs = $(".block-w-item");
});

$(".search").on("input", function () {
	$(".block-w-item").detach();
	for(var i = 0; i < all_divs.length; i ++){
		s1 = $(this).val();
		s2 = list[i].name;
		s3 = list[i].code;
		if( (s2.toLowerCase().indexOf(s1.toLowerCase())+1) || (s3.toLowerCase().indexOf(s1.toLowerCase())+1)){
			$(all_divs[i]).appendTo(".all-item");
		}
	}
	if($(this).val().length == 0){
		all_divs.appendTo(".all-item");
	}
})
