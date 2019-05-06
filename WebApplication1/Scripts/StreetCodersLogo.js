$(document).ready(function () {
    writeText($(".index-text-logo"), "StreetCoders");
});

function writeText(el, text) {
    var cnt = 0;
    temp = "",
        temp2 = "";
    var add = setInterval(function () {
        temp = el.text();
        temp2 = "";
        for (var i = 0; i < temp.length - 1; i++) {
            temp2 += temp[i];
        }
        el.text(temp2);
        el.append(text[cnt] + "_");
        cnt++;
        if (cnt == text.length) { clearInterval(add); }
    }, 100);
}