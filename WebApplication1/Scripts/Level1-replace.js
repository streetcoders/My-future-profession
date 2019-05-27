let subjects;

$(document).ready(() => init());
function init() {
    subjects = new List();
}

function add(name) {
    let question = $("#" + name).val();
    $("#line-creator").val("");
    subjects.add(question);
    show();
}

function change(name) {
    let question = $("#" + name).val();
    let id = getId(name);
    subjects.change(question, id);
}

function remove(name) {
    let id = getId(name);
    subjects.remove(id);
    update(id);
    $("#line-" + subjects.length).remove();
}

function show(id = subjects.length - 1) {
    let line = subjects.get(id);
    $(  "<div class='line' id='line-" + id + "'>" +
        "   <input type='text' id='line-" + id + "-text' onchange='change(this.id)' value='" + line + "'>" +
        "   <button class='btn btn-danger btn-sm' id='line-" + id + "-remove' onclick='remove(this.id)'>видалити</button>" +
        "</div>").insertBefore("#line-creator");
}

function update(from, to = subjects.length) {
    for (let i = from; i < to; i++) {
        $("#line-" + i).remove();
        show(i);
    }
}

function getId(name) {
    name = name + "-";
    let indexes = indexesOf(name, "-");
    return name.substring(indexes[0] + 1, indexes[1]);
}

function indexesOf(string, char) {
    let indexes = [];
    for (let i = 0; i < string.length; i++)
        if (string[i] === char) indexes.push(i);
    return indexes;
}

window.onerror = function uncheckedError(message, url, line) {
    alert("script.js: Error occurred: " + message + " : " + url + " : " + line);
    return false;
};


function createLevel() {
    try {
        let level = "mfp_constructor_level_1";
        let description = {
            subjects: subjects.getAll()
        };
        localStorage.setItem(level, JSON.stringify(description));
        localStorage.setItem("mfp_status", "callback");
        // alert(localStorage.getItem(level));
        window.open('GeneralConstructor?code='+$("#code").val(), '_parent');

       //window.location.href = "CreateQuest?code=" + $("#code").val() ;
    } catch (e) {
        alert(e);
    }
}
