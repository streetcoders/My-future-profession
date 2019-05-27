let counter = 0,
    mess = "",
    stages = [];
$(".content").on("click", ":button", function remove() {
    counter--;
    counter--;
    setInfo();
    $(this).parent().remove();
});
$(".content").on("change", ":text", function() {
    if ($(this).parent().is(":last-child")) {
        $(".content").append('  <div>' +
            '                       <input type="text" id="name">' +
            '                       <input type="button" value="DELETE">' +
            '                   </div>');
        setInfo();
    }
});

function setInfo() {
    if (counter < 4) {
        mess = "Це досить легко";
    } else if (counter < 8) {
        mess = "Це змусить його постаратися";
    } else if (counter > 10) {
        mess = "Це буде справжім викликом для нього";
    }
    $(".info").text("Ви створили " + ++counter + " посад, щоб дійти до кінця, абітурієнту потрібно буде набрати " + counter * 5 + " очок.");
    $(".mess").text(mess);
}


function createLevel() {
    try {
        let level = "mfp_constructor_level_4";
        stages = [];
        for (let i = 1; i < $(".content > div").length; i++) {
            let child = $(".content > div:nth-child(" + i + ") > input");
            if (!child.val().empty) {
                stages.push(child.val());
            }
        }
        if (stages.length === 0) {
            alert("Створіть хоча б одну посаду");
            return;
        }
        let description = {
            stages: stages
        };
        localStorage.setItem(level, JSON.stringify(description));
        localStorage.setItem("mfp_status", "callback");
        // alert(localStorage.getItem(level));
        window.open('GeneralConstructor?code='+$("#code").val(), '_parent');
    } catch (e) {
        alert(e);
    }
}
