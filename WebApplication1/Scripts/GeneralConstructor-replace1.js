let title = ["Перший крок найважчий",
    "Кар’єрний ріст",
    "Лабіринт",
    "Працевлаштування"];
let count = title.length;

$(document).ready(() => init());
function init() {
    let status = localStorage.getItem("mfp_status");
    if (status !== "callback")
        for (let i = 1; i <= count; i++)
            localStorage.setItem("mfp_constructor_level_" + i, "null");
    localStorage.setItem("mfp_status", "creating");
    show();
}

function show() {
    let div = $("#constructor");
    div.empty();
    for (let i = 1; i <= count; i++)
        div.append(getLevel(i));

    let btn = $("#create");
    btn.disable(false);
    for (let i = 1; i <= count; i++)
        if (localStorage.getItem("mfp_constructor_level_" + i) === "null") {
            btn.disable(true);
            break;
        }
}

function getLevel(num) {
    let key = "mfp_constructor_level_" + num;
    let level = localStorage.getItem(key);
    let checked = level === "null" ? "" : "checked";
    return "<div class='funkyradio-success'>" +
        "       <input type='radio' name='radio" + num + "' id='level" + num + "' " + checked + "/>" +
        "       <label for='level" + num + "' onclick='createLevel(" + num + ")'>" + title[num - 1] + "</label>" +
        "   </div>";
}

function createLevel(num) {

   // window.location.href = "Level"+num+"?code=" + $("#code").val();
   window.open('Level' + num+"?code="+155, '_parent');
    show();
}

function create() {
    let data = [];
    for (let i = 1; i <= count; i++) {
        let level = "mfp_constructor_level_" + i;
        data.push(localStorage.getItem(level));
        localStorage.removeItem(level);
    }
    let description = {
        version: 1.0,
        data: data
    };
    let result = JSON.stringify(description);
   // alert(result);
    window.location.href = "CreateQuest?code="+$("#code").val()+"&result=" + result;
    init();
}

window.onerror = function uncheckedError(message, url, line) {
    alert("script.js: Error occurred: " + message + " : " + url + " : " + line);
    return false;
};
