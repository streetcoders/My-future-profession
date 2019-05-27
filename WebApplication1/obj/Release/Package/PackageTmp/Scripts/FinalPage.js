$(document).ready(() => init());
function init() {
    let result = [];
    var count = 4;
    for (let i = 1; i <= count; i++) {
        result.push(localStorage.getItem("mfp_quest_result_level_" + i));
    }
    let json = JSON.stringify(result);
    alert(json);

    for (let i = 1; i <= count; i++) {
        localStorage.removeItem("mfp_quest_level_" + i);
        localStorage.removeItem("mfp_quest_result_level_" + i);
    }
    localStorage.removeItem("mfp_quest_result_level_0");
    localStorage.removeItem("mfp_quest_level");
    localStorage.removeItem("mfp_quest_data_local");
    localStorage.removeItem("mfp_quest_result_local");
    localStorage.removeItem("mfp_quest_logo");
}