let N = 10;
let M = 15;
let field = [];

function init() {
    $("#JSON").empty();
    let place = $("#field");
    place.empty();

    function cell(x, y) {
        return "<div class='cell' onclick='change(this," + x + ", " + y + ")'></div>";
    }

    place.append("<table>");
    for (let i = 0; i < N; i++) {
        field[i] = [];
        place.append("<tr>");
        for (let j = 0; j < M; j++) {
            field[i][j] = 0;
            place.append("<td>" + cell(i, j) + "</td>");
        }
        place.append("</tr>");
    }
    place.append("</table>");

    place.append("<div id='yellowgreen_standard_hidden' style='display:none;'></div>");
    $('#yellowgreen_standard_hidden').css("background-color", "yellowgreen");
}
$(document).ready(init());

function change(cell, x, y) {
    if ($(cell).css("background-color") === ($("#yellowgreen_standard_hidden")).css("background-color")) {
        $(cell).css("background", "grey");
        field[x][y] = 1;
    } else {
        $(cell).css("background", "yellowgreen");
        field[x][y] = 0;
    }
}

function setSize() {
    let sizes = $("#select").val();
    let index = sizes.indexOf("x");
    N = parseInt(sizes.substr(0, index));
    M = parseInt(sizes.substr(index + 1));
    init();
}

function hasWay() {
    let visited = [];
    for (let i = 0; i < N; i++) {
        visited[i] = [];
        for (let j = 0; j < M; j++)
            visited[i][j] = false;
    }
    let head = 0, tail = 0;
    let ax = [], ay = [];
    ax[0] = N - 1;
    ay[0] = 0;
    visited[ax[0]][ay[0]] = true;
    while (head <= tail) {
        let x = ax[head];
        let y = ay[head];

        function push(x, y) {
            if (field[x][y] === 0 && !visited[x][y]) {
                tail++;
                ax[tail] = x;
                ay[tail] = y;
                visited[x][y] = true;
            }
        }

        if (x > 0) push(x - 1, y);
        if (x < N - 1) push(x + 1, y);
        if (y > 0) push(x, y - 1);
        if (y < M - 1) push(x, y + 1);
        head++;
    }

    return visited[0][M - 1];
}

function showError(message) {
    alert(message);
}

function createLevel() {
    if (field[N - 1][0] === 1) {
        showError("Початкова клітинка зайнята!");
        return;
    }
    if (field[0][M - 1] === 1) {
        showError("Кінцева клітинка зайнята!");
        return;
    }
    if (hasWay() !== true) {
        showError("Не існує шляху від початку до кінця!");
        return;
    }

    try {
        let level = "mfp_constructor_level_3";
        let description = {
            N: N,
            M: M,
            field: field
        };
        localStorage.setItem(level, JSON.stringify(description));
        localStorage.setItem("mfp_status", "callback");
        // alert(localStorage.getItem(level));
        window.open('GeneralConstructor?code='+$("#code").val(), '_parent');
    } catch (e) {
        alert(e);
    }
}
