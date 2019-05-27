let title = ["Перший крок найважчий",
    "Кар’єрний ріст",
    "Лабіринт",
    "Працевлаштування"];
let count = title.length;

jQuery.fn.extend({
    disable: function (state) {
        return this.each(function () {
            this.disabled = state;
        });
    }
});

function nextLevel() {
    let level = parseInt(localStorage.getItem("mfp_quest_level"));
    let result = localStorage.getItem("mfp_quest_result_local");
    localStorage.setItem("mfp_quest_result_level_" + level, result);
    localStorage.setItem("mfp_quest_result_local", "null");

    level++;
    localStorage.setItem("mfp_quest_level", level.toString());
    let data = localStorage.getItem("mfp_quest_level_" + level);
    localStorage.setItem("mfp_quest_data_local", data);

    if (level <= count)
        window.open('../Home/QuestLevel' + level , '_parent');
    else
        window.open('../Home/FinalPage', '_parent');
}

function openLevel(input, level = 0) {
    let description = JSON.parse(input);
    if (description.version !== 1.0) {
        alert("Unsupported version");
        return;
    }
    let data = description.data;
    for (let i = 1; i <= count; i++) {
        let level = "mfp_quest_level_" + i;
        localStorage.setItem(level, data[i - 1]);
        localStorage.setItem("mfp_quest_result_level_" + i, "null");
    }
    localStorage.setItem("mfp_quest_level", level.toString());
    localStorage.setItem("mfp_quest_data_local", "null");
    localStorage.setItem("mfp_quest_result_local", "null");

    let logo = JSON.parse(localStorage.getItem("mfp_quest_level_2")).logo;
    localStorage.setItem("mfp_quest_logo", logo);

    nextLevel();
}

