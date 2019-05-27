let ind         = 0;

let tail        = [],
    apples      = [],
	wall        = [],
	gApples     = [];
let FPS         = 10,
	dir,
	hp          = 1,
	score       = 0,
	iterator    = true,
	fieldHeith  = 15,
	fieldWidth  = 25,
	gAppleFreq  = $("#gAfreq").val(),
	tailClass   = "tail",
	animation   = "animation",
	combination = "",
	cheated     = false,
	c1          = 192;

let tt = false,
	rr = false,
	bb = false, 
	ll = false,
	c = 0;

let stages = ["Front End Trainee Dev", 
			  "Front End Junior Dev",
			  "Front End Middle Dev", 
			  "Front End Senior Dev", 
			  "Back End Trainee Dev",
			  "Back End Junior Dew",
			  "Back End Middle Dew",
			  "Back End Senior Dew",
			  "FULLSTACK DEVELOPER!!!"
],
	stage  = 0;
tail.push({
	x: ".x5",
	y: ".y5"
});
tail.push({
	x: ".x5",
	y: ".y6"
});

tail.push({
	x: ".x5",
	y: ".y7"
});
$(".game>div>div").addClass(animation);		

$("#an").change(function(){
	if(this.checked){
	$(".game>div>div").addClass(animation);		
	} else {
	$(".game>div>div").removeClass(animation);
	}
});
$("#ga").change(function(){
	if(this.checked){
	$("#gAfreq").prop("disabled", false);		
	} else {
	$("#gAfreq").prop("disabled", true);
	}
});
$("#gAfreq").change(function(){
	$("#freq").text(gAppleFreq);
})
$("#repeat").on("click", function(){location.reload()});
function spawnGAple(frequncy) {
	let y, x, b = false, a = false;
	if ((Math.random() * 100) < frequncy) {
		while (true) {
			b = false;
			a = false;
			y = ".y" + Math.round(Math.random() * (fieldHeith - 1) + 1);//y
			x = ".x" + Math.round(Math.random() * (fieldWidth - 1) + 1);//y
			for (let i = 0; i < tail.length; i++) {
				if (tail[i].x == x && tail[i].y == y) {
					b = true;
				}
			}
			for (let i = 0; i < wall.length; i++) {
				if (wall[i].x == x && wall[i].y == y) {
					a = true;
				}
			}
			for (let i = 0; i < apples.length; i++) {
				if (apples[i].x == x && apples[i].y == y) {
					a = true;
				}
			}
			if (!b && !a) break;
		}

		console.log("Golg apple spawned in " + x + " " + y);
		gApples.push({
			x: x,
			y: y
		});
	}
}
function addBorRads() {

	for (let i = 1; i < tail.length - 1; i++) {
		tt = false;
		rr = false;
		bb = false;
		ll = false;
		c = 0;
		if ($(numToCoords(coordsToNum(tail[i].y) - 1, "y") + " > " + tail[i].x).hasClass(tailClass)) {
			tt = true;
			c++;
		}
		if ($(numToCoords(coordsToNum(tail[i].y) * 1 + 1, "y") + " > " + tail[i].x).hasClass(tailClass)) {
			bb = true;
			c++;
		}
		if ($(tail[i].y + " > " + numToCoords(coordsToNum(tail[i].x) - 1, "x")).hasClass(tailClass)) {
			ll = true;
			c++;
		}
		if ($(tail[i].y + " > " + numToCoords(coordsToNum(tail[i].x) * 1 + 1, "x")).hasClass(tailClass)) {
			rr = true;
			c++;
		}
		if (c == 2) {
			if (rr && bb) {
				$(tail[i].y + " > " + tail[i].x).addClass("rad-left-top");
			}
			if (ll && bb) {
				$(tail[i].y + " > " + tail[i].x).addClass("rad-right-top");
			}
			if (rr && tt) {
				$(tail[i].y + " > " + tail[i].x).addClass("rad-left-bot");
			}
			if (ll && tt) {
				$(tail[i].y + " > " + tail[i].x).addClass("rad-right-bot");
			}
		}
	}
	switch (dir) {
		case 1://left
			$(tail[0].y + " > " + tail[0].x).addClass("rad-left");
			break;
		case 2://up
			$(tail[0].y + " > " + tail[0].x).addClass("rad-top");
			break;
		case 3:
			$(tail[0].y + " > " + tail[0].x).addClass("rad-right");
			break;
		case 4://down
			$(tail[0].y + " > " + tail[0].x).addClass("rad-bot");
			break;
	}
}
function drawField(hight, width) {
	for (let i = 1; i <= hight; i++) {
		$(".game").append("<div class = \"y" + i + "\"></div>");
		for (let j = 1; j <= width; j++) {
			$(".y" + i).append("<div class = \"x" + j + "\"></div>");
		}
	}
}
drawField(fieldHeith, fieldWidth);
function drawSnake(arr1, arr2, arr3, arr4) {
	if (hp > 1) {
		tailClass = "megaTail";
	} else {
		tailClass = "tail";
	}
	for (let i = 0; i < arr1.length; i++) {
		$(arr1[i].y + ">" + arr1[i].x).addClass(tailClass);
	}
	for (let i = 0; i < arr2.length; i++) {
		$(arr2[i].y + ">" + arr2[i].x).html('<img src="/Images/apple.png" alt="A">');
	}
	for (let i = 0; i < arr3.length; i++) {
		$(arr3[i].y + ">" + arr3[i].x).html('<img src="/Images/brick.png" alt="B">');
	}
	for (let i = 0; i < arr4.length; i++) {
		$(arr4[i].y + ">" + arr4[i].x).html('<img src="/Images/gapple.png" alt="gA">');
	}
}
function clearBoard() {
	for (let i = 1; i <= fieldHeith; i++) {
		for (let j = 1; j <= fieldWidth; j++) {
			$(".y" + i + ">.x" + j).removeClass(tailClass);
			$(".y" + i + ">.x" + j).removeClass("apple");
			$(".y" + i + ">.x" + j).removeClass("wall");
			$(".y" + i + ">.x" + j).removeClass("gApple");
			$(".y" + i + ">.x" + j).removeClass("rad-bot");
			$(".y" + i + ">.x" + j).removeClass("rad-top");
			$(".y" + i + ">.x" + j).removeClass("rad-left");
			$(".y" + i + ">.x" + j).removeClass("rad-right");
			$(".y" + i + ">.x" + j).removeClass("rad-right-top");
			$(".y" + i + ">.x" + j).removeClass("rad-right-bot");
			$(".y" + i + ">.x" + j).removeClass("rad-left-top");
			$(".y" + i + ">.x" + j).removeClass("rad-left-bot");
			$(".y" + i + ">.x" + j).html("");
		}
	}
}
function addX(t){
	let temp = "";
	for(let i = 2; i < t.x.length; i ++){
			temp+=t.x[i];
	}
		temp++;
	t.x = ".x" + temp;
	return(t.x);
}
function minX(t){
	let temp = "";
	for(let i = 2; i < t.x.length; i ++){
			temp+=t.x[i];
	}
		temp--;
	t.x = ".x" + temp;
	return t.x;
}
function addY(t){
	let temp = "";
	for(let i = 2; i < t.y.length; i ++){
			temp+=t.y[i];
	}
		temp++;
	t.y = ".y" + temp;
	return t.y;
}
function minY(t){
	let temp = "";
	for(let i = 2; i < t.y.length; i++){
			temp+=t.y[i];
	}
		temp--;
	t.y = ".y" + temp;
	return t.y;
}
function finishGame(){//НЕ ЗНАЮ, ЧТО ТУТ СДЕЛАТЬ
	clearInterval(timer);
	$(".final>p").text("Цього разу тобі вдалося стати " + stages[stage - 1] + "!")
	$(".final").removeClass("hidden");
	//location.reload();
}
function info(){
	$("#score").text("SCORE: " + score);
	$("#hp").text("HP: " + hp);
}
function spawnApple() {
	let y, x, b = false, a = false;
	while (true) {
		b = false;
		a = false;
		y = ".y" + Math.round(Math.random() * (fieldHeith - 1) + 1);//y
		x = ".x" + Math.round(Math.random() * (fieldWidth - 1) + 1);//y
		for (let i = 0; i < tail.length; i++) {
			if (tail[i].x == x && tail[i].y == y) {
				b = true;
			}
		}
		for (let i = 0; i < wall.length; i++) {
			if (wall[i].x == x && wall[i].y == y) {
				a = true;
			}
		}
		if (!b && !a) break;
	}

	console.log("Apple spawned in " + x + " " + y);
	apples.push({
		x: x,
		y: y
	});
}
$(document).keydown(function(e) {
	if (iterator) {
		iterator = false;
		combination = e.which;
		switch (e.which) {
			case 37:
				if (dir != 3)
					dir = 1;//left
				break;
			case 38:
				if (dir != 4)
					dir = 2;//up
				break;
			case 39:
				if (dir != 1)
					dir = 3;//right
				break;
			case 40:
				if (dir != 2) {
					dir = 4;//down

				}
				break;
		}
	}
});
function spawnWall() {
	let y, x, b = false, a = false;
	while (true) {
		b = false;
		a = false;
		y = ".y" + Math.round(Math.random() * (fieldHeith - 1) + 1);//y
		x = ".x" + Math.round(Math.random() * (fieldWidth - 1) + 1);//y
		for (let i = 0; i < tail.length; i++) {
			if (tail[i].x == x && tail[i].y == y) {
				b = true;
			}
		}
		for (let i = 0; i < apples.length; i++) {
			if (apples[i].x == x && apples[i].y == y) {
				a = true;
			}
		}
		if (!b && !a) break;
	}

	console.log("Wall spawned in " + x + " " + y);
	wall.push({
		x: x,
		y: y
	});
}
spawnApple();
let timer = setInterval(function() {

	gAppleFreq = $("#gAfreq").val();
	if (c1 === combination) {
		smth();
		combination = 0;
	} else {
		combination = 0;
	}

	switch (dir) {
		case 1://left
			for (let i = tail.length - 1; i >= 1; i--) {
				tail[i].x = tail[i - 1].x;
				tail[i].y = tail[i - 1].y;
			}
			minX(tail[0]);
			$(tail[0].y + " > " + tail[0].x).addClass("rad-left");
			break;
		case 2://up
			for (let i = tail.length - 1; i >= 1; i--) {
				tail[i].x = tail[i - 1].x;
				tail[i].y = tail[i - 1].y;
			}
			minY(tail[0]);
			$(tail[0].y + " > " + tail[0].x).addClass("rad-top");
			break;
		case 3:
			for (let i = tail.length - 1; i >= 1; i--) {
				tail[i].x = tail[i - 1].x;
				tail[i].y = tail[i - 1].y;
			}
			addX(tail[0]);
			$(tail[0].y + " > " + tail[0].x).addClass("rad-right");
			break;
		case 4://down
			for (let i = tail.length - 1; i >= 1; i--) {
				tail[i].x = tail[i - 1].x;
				tail[i].y = tail[i - 1].y;
			}
			addY(tail[0]);
			$(tail[0].y + " > " + tail[0].x).addClass("rad-bot");
			break;
	}
	if (tail[0].x == ".x" + (fieldWidth * 1 + 1)) {
		dir = 3;
		tail[0].x = ".x1";
	}
	if (tail[0].x == ".x0") {
		dir = 1;
		tail[0].x = ".x" + fieldWidth;
	}
	if (tail[0].y == ".y" + (fieldHeith * 1 + 1)) {
		dir = 4;
		tail[0].y = ".y1";
	}
	if (tail[0].y == ".y0") {
		dir = 2;
		tail[0].y = ".y" + fieldHeith;
	}
	if (tail[0].x == apples[0].x && tail[0].y == apples[0].y) {//APPLE CAUGHT
		apples.pop();
		tail.push({
			x: tail[1].x,
			y: tail[1].y
		});
		console.log(tail[tail.length - 1].x + " " + tail[tail.length - 1].y);
		console.log("apple caght!!!");

		spawnApple();

		if ($("#hm").prop("checked")) {
			spawnWall();
		}
		if ($("#hm").prop("checked") && $("#ga").prop("checked")) {
			spawnGAple(gAppleFreq);
		}
		score++;
	}
	for (let i = 0; i < gApples.length; i++) {
		if (tail[0].x == gApples[i].x && tail[0].y == gApples[i].y) {//GOLDEN APPLE COLLISSION!!!!
			hp++;
			gApples.splice(i, 1);
			console.log("GOLDEN!!!")
		}
	}
	for (let i = 1; i < tail.length; i++) {
		if (tail[0].x == tail[i].x && tail[0].y == tail[i].y) {//TAIL COLLISSION!!!!
			finishGame();
		}
	}
	for (let i = 0; i < wall.length; i++) {
		if (tail[0].x == wall[i].x && tail[0].y == wall[i].y) {//TAIL COLLISSION!!!!
			if (--hp == 0) {
				finishGame();
			} else {
				wall.splice(i, 1);
			}
		}
	}
	iterator = true;
	clearBoard();
	if (cheated) {
		console.log("cheat");
		let color = "#";
		let s = "0123456789abcdef";
		ind = 0;
		for (let i = 0; i < 6; i++) {
			ind = 0 + Math.random() * (s.length - 0);
			ind = Math.floor(ind);
			color += s[ind];
		}

		$(".game div").css("background-color", color);
	} else {
		$(".game div").css("background-color", "white");
	}

	if (score >= stage * 5) {
		if (stage < stages.length) {
			$("#stage").text(stages[stage++]);
			if (stage === stages.length)
				$("#create").disable(false);
		}
	}
	drawSnake(tail, apples, wall, gApples);
	if (score % 5 == 4) {

		$(apples[0].y + ">" + apples[0].x).html('<img src="/Images/scroll.png" alt="S">');
	}
	addBorRads();
	info();
}, 1000/FPS);
function smth() {
	if (cheated) {
		cheated = false;
	} else {
		cheated = true;
	}
}

function numToCoords (num, xy) {
	return "." + xy + num;
}
function coordsToNum(coord) {
	let temp = "";
	for (let i = 2; i < coord.length; i++) {
		temp += coord[i];
	}
	return temp;
}


let startTime;

$(document).ready(() => init());
function init() {
	startTime = Date.now();
	let input = localStorage.getItem("mfp_quest_data_local");
	let description = JSON.parse(input);
	stages = description.stages;
	$("#create").disable(true);
}

function next() {
	let time = Date.now() - startTime;
	localStorage.setItem("mfp_quest_result_local", time.toString());
	nextLevel();
}
