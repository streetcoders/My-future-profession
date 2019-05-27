let map;
let logo = "";
let markers = [];

function setLogo() {
    let url = $("#logo").val();
    let imageExtension = /[\/.](gif|jpg|jpeg|tiff|png)$/i;
    if (url !== "" && imageExtension.test(url)) {
        doesImageExist(url,
            function () {
                logo = url;
                resetMap();
            },
            function () {
                alert("Error: image doesnt exist!");
                $("#logo").val("");
                logo = "";
                resetMap();
            });
    } else {
        logo = "";
        resetMap();
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

    map.addListener('click', function(e) {
        addPoint(e.latLng);
    });
}

function pushMarker(coords, title) {
    let icon = logo;
    if (logo !== "") {
        let image = new Image();
        image.src = logo;
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
    markers.push(marker);

    google.maps.event.addListener(marker, 'click', function () {
        markers.remove(marker);
        marker.setMap(null);
    });
}

function addPoint(coords) {
    pushMarker(coords, "Point #" + markers.length);
}

function resetMap() {
    let _markers = markers;
    markers = [];
    _markers.forEach((marker => {
        pushMarker(marker.position, marker.title);
        marker.setMap(null);
    }));
}


let quest;

$(document).ready(() => init());
function init() {
    initMap();
    quest = new Quest();
}

function addQuestion(name) {
    let question = $("#" + name).val();
    $("#block-creator").val("");
    quest.addQuestion(question);
    showBlock();
}

function changeQuestion(name) {
    let question = $("#" + name).val();
    let idBlock = getIdBlock(name);
    quest.changeQuestion(question, idBlock);
}

function removeQuestion(name) {
    let idBlock = getIdBlock(name);
    quest.removeQuestion(idBlock);
    updateBlocks(idBlock);
    $("#block-" + quest.length).remove();
}

function addAnswer(name) {
    let idBlock = getIdBlock(name);
    let answer = $("#" + name).val();
    $("#block-" + idBlock + "-answer-creator").val("");
    quest.answer(answer, idBlock);
    showAnswer(idBlock);
}

function changeAnswer(name) {
    let idBlock = getIdBlock(name);
    let idAnswer = getIdAnswer(name);
    let answer = $("#" + name).val();
    quest.answer(answer, idBlock, idAnswer);
}

function removeAnswer(name) {
    let idBlock = getIdBlock(name);
    let idAnswer = getIdAnswer(name);
    quest.removeAnswer(idBlock, idAnswer);
    updateBlocks(idBlock);
}

function changeMode(name) {
    let idBlock = getIdBlock(name);
    let selected = $("#" + name).prop("checked");
    let mode = selected ? Mode.plural : Mode.single;
    quest.changeMode(mode, idBlock);
    updateBlocks(idBlock);
}

function selectAnswer(name) {
    let idBlock = getIdBlock(name);
    let idAnswer = getIdAnswer(name);
    let selected = $("#" + name).prop("checked");
    quest.select(selected, idBlock, idAnswer);
}

function showBlock(idBlock = quest.length - 1) {
    let block = quest.get(idBlock);
    let checked = (block.mode === Mode.single) ? "" : "checked";
    $(  "<div class='block' id='block-" + idBlock + "'>" +
        "   <div class='block-head' id='block-" + idBlock + "-head'>" +
        "       <input type='text' class='question' id='block-" + idBlock + "-question' onchange='changeQuestion(this.id)' value='" + block.question + "'>" +
        "       <input type='checkbox' class='mode' id='block-" + idBlock + "-mode' onchange='changeMode(this.id)'" + checked + "> Багато відповідей" +
        "       <button class='block-remove btn btn-danger btn-sm' id='block-" + idBlock + "-remove' onclick='removeQuestion(this.id)'>видалити</button>" +
        "   </div>" +
        "   <input type='text' class='answer-creator' id='block-" + idBlock + "-answer-creator' onchange='addAnswer(this.id)' placeholder='Варіант відповіді...'>" +
        "</div>").insertBefore("#block-creator");
    for (let idAnswer = 0; idAnswer < block.answers.length; idAnswer++) {
        showAnswer(idBlock, idAnswer);
    }
}

function showAnswer(idBlock, idAnswer) {
    let block = quest.get(idBlock);
    if (idAnswer == null) idAnswer = block.answers.length - 1;
    let type = (block.mode === Mode.single) ? "radio" : "checkbox";
    let checked = (block.selected.includes(idAnswer)) ? "checked" : "";
    let prefix = "block-" + idBlock + "-answer-" + idAnswer;
    $(  "<div class='answer' id='" + prefix + "'>" +
        "   <input type='" + type + "' class='answer-select' id='" + prefix + "-select' name='block-" + idBlock + "' onchange='selectAnswer(this.id)'" + checked + ">" +
        "   <input type='text' class='answer-answer' id='" + prefix + "-answer' onchange='changeAnswer(this.id)' value='" + block.answers[idAnswer] + "'>" +
        "   <button class='answer-remove btn btn-danger btn-sm' id=id='" + prefix + "-remove' onclick='removeAnswer(this.id)'>видалити</button>" +
        "</div>").insertBefore("#block-" + idBlock + "-answer-creator");
}

function updateBlocks(from, to = quest.length) {
    for (let i = from; i < to; i++) {
        $("#block-" + i).remove();
        showBlock(i);
    }
}

function getIdBlock(name) {
    name = name + "-";
    let indexes = indexesOf(name, "-");
    return name.substring(indexes[0] + 1, indexes[1]);
}

function getIdAnswer(name) {
    name = name + "-";
    let indexes = indexesOf(name, "-");
    return name.substring(indexes[2] + 1, indexes[3]);
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
        let level = "mfp_constructor_level_2";
        let company = $("#company").val();
        let about = $("#about").val();
        let coords = [];
        markers.forEach((marker => coords.push(marker.position)));
        let description = {
            company: company,
            about: about,
            logo: logo,
            coords: coords,
            quest: quest.getAll()
        };
        localStorage.setItem(level, JSON.stringify(description));
        localStorage.setItem("mfp_status", "callback");
        // alert(localStorage.getItem(level));
        window.open('GeneralConstructor?code=' + $("#code").val(), '_parent');
    } catch (e) {
        alert(e);
    }
}
