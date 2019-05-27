//'use strict';

const delay = 1000;

let quest;
let block;
let active;
let chosen;
let points;
let Mode = Object.freeze({"single": 1, "plural": 2});

let logo;
let map;

$(document).ready(() => init());
function init() {
    try {
        $("#create").disable(true);
        let input = localStorage.getItem("mfp_quest_data_local");
        let description = JSON.parse(input);
        $("#company").text(description.company);
        $("#about").text(description.about);
        logo = description.logo;
        localStorage.setItem("mfp_quest_logo", logo);
        initMap();
        let coords = description.coords;
        for (let i = 0; i < coords.length; i++)
            pushMarker(coords[i], "Point #" + i);
        if (description.quest.version !== 1.0) throw new Error("Unsupported version");
        quest = description.quest.blocks;
        active = 0;
        points = 0;
        validate();
        ask();
    } catch (e) {
        alert(e);
    }
}

function initMap() {
    let x = 49.0;
    let y = 31.5;
    let center = {lat: x, lng: y};

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: center,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    let marker = new google.maps.Marker({
        position: center,
        map : map,
        title:"Hello World!"
    });
}

async function pushMarker(coords, title) {
    let icon = logo;
    if (logo !== "") {
        let image = new Image();
        image.src = logo;
        await sleep(1); //TODO КОСТЫЛЬ!!!!! Unknown reason
        let width = 50;
        let height = image.height / image.width * width;
        icon = {
            url: logo, // url
            scaledSize: new google.maps.Size(width, height),
            // origin: new google.maps.Point(0,0),
            // anchor: new google.maps.Point(0, 0)
        }
    }
    let marker = new google.maps.Marker({
        position: coords,
        map: map,
        title: title,
        icon: icon
    });
}

function validate() {
    if (quest.length < 1) throw new Error("No blocks founded");
    quest.forEach((block, index) => {
        if (block.answers.length === 0) throw new Error("Block " + index + " has no answers!");
        if (block.mode === Mode.single && block.selected.length !== 1) throw new Error("Block " + index + " must have single selected answers");
    })
}

function ask() {
    block = quest[active];
    chosen = [];
    let div = $("#quest");
    div.empty();
    div.append("<div class='title'>Question " + (active + 1) + "/" + quest.length + "</div>");
    div.append("<div class='question'>" + block.question + "</div>");
    for (let i = 0; i < block.answers.length; i++) {
        div.append("<button onclick='choose(" + i + ")' class='btn btn-primary answer' id='answer-" + i + "'>" + block.answers[i] + "</button>");
    }
    if (block.mode === Mode.plural) {
        div.append("<button onclick='analyze()' class='btn btn-success answer' id='answered'>OK</button>");
    }
}

async function choose(num) {
    switch (block.mode) {
        case Mode.single: {
            chosen = [num];
            analyze();
        } break;
        case Mode.plural: {
            let index = chosen.indexOf(num);
            if (index === -1) {
                $("#answer-" + num).button('toggle');
                chosen.push(num);
            } else {
                $("#answer-" + num).button('toggle');
                chosen.splice(index, 1);
            }
        } break;
    }
    await sleep(1001);
    window.scrollTo(0,document.body.scrollHeight);
}

async function analyze() {
    chosen.sort();
    let equals = true;
    for (let i = 0; i < chosen.length; i++) {
        let val = chosen[i];
        let button = $("#answer-" + val);
        if (block.selected.includes(val)) {
            button.addClass("glowing-green");
        } else {
            button.addClass("glowing-red");
            equals = false;
        }
    }
    for (let i = 0; i < block.selected.length; i++) {
        let val = block.selected[i];
        let button = $("#answer-" + val);
        if (!chosen.includes(val)) {
            if (block.mode === Mode.single) button.addClass("glowing-green");
            else button.addClass("glowing-yellow");
            equals = false;
        }
    }
    points += equals;
    await sleep(delay);
    active++;
    active < quest.length ? ask() : result();
}

function result() {
    let score = 100 * points / quest.length;
    let div = $("#quest");
    div.empty();
    div.append("<div class='result'>Вітаємо, ви успішно пройшли тестування на " + score + "%</div>");
    localStorage.setItem("mfp_quest_result_local", score.toString());
    $("#create").disable(false);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.onerror = function uncheckedError(message, url, line) {
    alert("structure.js: Error occurred: " + message + " : " + url + " : " + line);
    return false;
};


function next() {
    nextLevel();
}
