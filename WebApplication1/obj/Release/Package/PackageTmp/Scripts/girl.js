var writechecker = false;

function writeMsg(text, style){
	
	if (!writechecker) {
		writechecker = true;
		spawnGirl("/Content/Images/girl_"+style+".png");
		setTimeout(function (){
			consoleWritting($(".girl_text p"),text)
		},1500);
	}
}

function spawnGirl(path){
	$("body").append(	
		"<div id='girl_block'>"+
			"<div class='girl_text'><p>"+
			"</p></div>"+
			"<div class='girl_next' onclick='next();'>Продовжити ></div>"+
			"<div class='girl_photo'>"+
			"<img src='"+path+"' alt='girl' />"+
			"</div>"+
		"</div"
		);
}

function consoleWritting(el, text) {
    var cnt = 0;
	    temp = "",
	    temp2 = "";
    var add = setInterval(function () {
        temp = el.text();
        temp2 = "";
        for (var i = 0; i < temp.length - 1; i++) {
            temp2 += temp[i];
        }
        el.text(temp2);
        el.append(text[cnt] + "_");
        cnt++;
        if (cnt == text.length) { 
        	clearInterval(add);
        	$(".girl_next").css("opacity","1");
        }
    }, 30);
}
function next(){
	$("#girl_block").css({
		"right": "0",
		"bottom": "0",
		"animation": "1s forwards 0s alternate girlhidden",
	});
	setTimeout(function(){
		document.getElementById('girl_block').remove();
		writechecker=false;
	},2000);
}