let startTime;

let scale = 3;
let mid = scale >> 1;
let N = 0;
let M = 0;
let playerX = 0;
let playerY = 0;
let map = [];
let isGame = false;

$(document).ready(() => init());
function init() {
    startTime = Date.now();
    mid = scale >> 1;

    let input = localStorage.getItem("mfp_quest_data_local");
    let JSONinfo = JSON.parse(input);
    N = JSONinfo.N;
    M = JSONinfo.M;
    let JSONfield = JSONinfo.field;

    let field = [];
    for (let i = 0; i < (N + 2); i++) {
        field[i] = [];
        for (let j = 0; j < (M + 2); j++) {
            field[i][j] = [];
            for (let innerI = 0; innerI < scale; innerI++) {
                field[i][j][innerI] = [];
                for (let innerJ = 0; innerJ < scale; innerJ++) {
                    field[i][j][innerI][innerJ] = 0;
                }
            }
        }
    }

    for (let i = 1; i < N + 1; i++) {
        field[i][0] = cell(1, 1, JSONfield[i - 1][0], 1, 0);
        field[i][M + 1] = cell(1, 1, 0, 1, JSONfield[i - 1][M - 1]);
    }
    for (let j = 1; j < M + 1; j++) {
        field[0][j] = cell(1, 0, 1, JSONfield[0][j - 1], 1);
        field[N + 1][j] = cell(1, JSONfield[N - 1][j - 1], 1, 0, 1);
    }
    field[0][0] = cell(1, 0, 1, 1, 0);
    field[0][M + 1] = cell(1, 0, 0, 1, 1);
    field[N + 1][0] = cell(1, 1, 1, 0, 0);
    field[N + 1][M + 1] = cell(1, 1, 0, 0, 1);
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < M; j++) {
            let up = 0;
            let right = 0;
            let down = 0;
            let left = 0;
            if (JSONfield[i][j] === 1) {
                if (i === 0) up = 1;
                else up = JSONfield[i - 1][j];
                if (j === M - 1) right = 1;
                else right = JSONfield[i][j + 1];
                if (i === N - 1) down = 1;
                else down = JSONfield[i + 1][j];
                if (j === 0) left = 1;
                else left = JSONfield[i][j - 1];
            }
            field[i + 1][j + 1] = cell(JSONfield[i][j], up, right, down, left);
        }
    }

    let place = $("#map");
    place.empty();
    map = [];
    for (let i = 0; i < (N + 2) * scale; i++) {
        map[i] = [];
        for (let j = 0; j < (M + 2) * scale; j++) {
            map[i][j] = 0;
        }
    }
    for (let i = 0; i < (N + 2); i++) {
        for (let j = 0; j < (M + 2); j++) {
            for (let innerI = 0; innerI < scale; innerI++) {
                for (let innerJ = 0; innerJ < scale; innerJ++) {
                    map[i * scale + innerI][j * scale + innerJ] = field[i][j][innerI][innerJ];
                }
            }
        }
    }
    place.append("<table>");
    for (let i = 0; i < (N + 2) * scale; i++) {
        place.append("<tr>");
        for (let j = 0; j < (M + 2) * scale; j++) {
            let color = (map[i][j] === 0) ? "green" : "grey";
            place.append("<td><div class='cell " + color + "'</div></td>");
        }
        place.append("</tr>");
    }
    place.append("</table>");

    let logo = localStorage.getItem("mfp_quest_logo");
    let end = (M + 1) * scale + mid - 1 + (mid + 1) * (M + 2) * scale;
    let img = document.createElement('img');
    img.src = logo;
    img.width = 50;
    img.height = 50;
    $(".cell:eq(" + end + ")").append(img);
    $(".cell:eq(" + end + ")").removeClass("green");
    $(".cell:eq(" + end + ")").addClass("company");

    playerX = mid + 1;
    playerY = (N + 1) * scale + mid - 1;
    isGame = true;
    moveTo(playerX, playerY);
}

function cell(cell, up, right, down, left) {
    let result = [];
    for (let innerI = 0; innerI < scale; innerI++) {
        result[innerI] = [];
        for (let innerJ = 0; innerJ < scale; innerJ++)
            result[innerI][innerJ] = 0;
    }

    if (cell === 1) result[mid][mid] = 1;
    if (up === 1)
        for (let i = 0; i < mid; i++) result[i][mid] = 1;
    if (right === 1)
        for (let i = mid + 1; i < scale; i++) result[mid][i] = 1;
    if (down === 1)
        for (let i = mid + 1; i < scale; i++) result[i][mid] = 1;
    if (left === 1)
        for (let i = 0; i < mid; i++) result[mid][i] = 1;

    return result;
}


document.onkeydown = keyPress;
function keyPress(e) {
    e = e || window.event;
    if (!isGame) return;
    if (e.keyCode === 38)
        moveTo(playerX, playerY - 1);
    else if (e.keyCode === 40)
        moveTo(playerX, playerY + 1);
    else if (e.keyCode === 37)
        moveTo(playerX - 1, playerY);
    else if (e.keyCode === 39)
        moveTo(playerX + 1, playerY);
}

function moveTo(x, y) {
    if (map[y][x] !== 0) return;
    let position = playerX + playerY * (M + 2) * scale;
    $(".cell:eq(" + position + ")").removeClass("player");
    playerX = x;
    playerY = y;
    position = playerX + playerY * (M + 2) * scale;
    $(".cell:eq(" + position + ")").addClass("player");

    if (playerX === (M + 1) * scale + mid - 1 && playerY === mid + 1) {
        isGame = false;
        next();
    }
}

window.onerror = function uncheckedError(message, url, line) {
    alert("Error occurred: " + message + " : " + url + " : " + line);
    return false;
};


function next() {
    let time = Date.now() - startTime;
    if (isGame) time = -1;
    localStorage.setItem("mfp_quest_result_local", time.toString());
    nextLevel();
}
