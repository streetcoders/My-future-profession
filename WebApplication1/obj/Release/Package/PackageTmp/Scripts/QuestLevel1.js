let subjects;
let side;

let Side = Object.freeze({"good": 1, "evil": 2, "none":3});

$(document).ready(() => init());
function init() {
    $("#create").disable(true);
    let input = localStorage.getItem("mfp_quest_data_local");
    let description = JSON.parse(input);
    subjects = description.subjects.blocks;
    side = [];

    let list = $("#list");
    for (let i = 0; i < subjects.length; i++) {
        side[i] = Side.none;
        let subject = document.createElement('button');
        list.append(subject);
        subject.textContent = subjects[i];
        subject.className = "subject btn btn-grey";
        subject.id = i.toString();
        subject.onmousedown = function(e) {
            let coords = getCoords(subject);
            let shiftX = e.pageX - coords.left;
            let shiftY = e.pageY - coords.top;

            function moveAt(e) {
                subject.style.left = e.pageX - shiftX + 'px';
                subject.style.top = e.pageY - shiftY + 'px';
            }

            subject.style.position = 'absolute';
            subject.style.zIndex = "1000";
            document.body.appendChild(subject);
            moveAt(e);

            document.onmousemove = function(e) {
                moveAt(e);
            };

            subject.onmouseup = function() {
                document.onmousemove = null;
                subject.onmouseup = null;
                checkPosition(subject);
            };
        };
        subject.ondragstart = function() {
            return false;
        };
    }
    let positionInfo = list[0].getBoundingClientRect();
    list.css("min-height", positionInfo.height);
}

function getCoords(elem) {
    let top = parseInt($(elem).css("margin-top"));
    let left = parseInt($(elem).css("margin-left"));
    let box = elem.getBoundingClientRect();
    return {
        top: box.top + pageYOffset - top,
        left: box.left + pageXOffset - left
    };
}

function checkPosition(subject) {
    let positionGood = $("#good")[0].getBoundingClientRect();
    let positionBad = $("#evil")[0].getBoundingClientRect();
    let position = subject.getBoundingClientRect();
    let id = subject.id;

    if ((position.x >= positionGood.x && position.x + position.width <= positionGood.x + positionGood.width) &&
        (position.y >= positionGood.y && position.y + position.height <= positionGood.y + positionGood.height)) {
        subject.className = "subject btn btn-success";
        side[id] = Side.good;
    } else if ((position.x >= positionBad.x && position.x + position.width <= positionBad.x + positionBad.width) &&
        (position.y >= positionBad.y && position.y + position.height <= positionBad.y + positionBad.height)) {
        subject.className = "subject btn btn-danger";
        side[id] = Side.evil;
    } else {
        subject.className = "subject btn btn-grey";
        side[id] = Side.none;
    }
    analyze();
}

function analyze() {
    $("#create").disable(true);
    let good = [];
    let evil = [];
    for (let i = 0; i < subjects.length; i++) {
        switch (side[i]) {
            case Side.good:
                good.push(i);
                break;
            case Side.evil:
                evil.push(i);
                break;
            case Side.none:
                return;
        }
    }
    let result = {
        good: good,
        evil: evil
    };
    localStorage.setItem("mfp_quest_result_local", JSON.stringify(result));
    $("#create").disable(false);
}


function next() {
    nextLevel();
}
