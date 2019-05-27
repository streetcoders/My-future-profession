let title = ["Перший крок найважчий",
    "Кар’єрний ріст",
    "Лабіринт",
    "Працевлаштування"];
let count = title.length;

jQuery.fn.extend({
    disable: function(state) {
        return this.each(function() {
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
        window.open('../Level' + level + '/index.html', '_parent');
    else
        window.open('../Final/index.html', '_parent');
}
