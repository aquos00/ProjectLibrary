function getWeekDay() {
    switch (new Date().getDay()) {
        case 1: return "Montag";
        case 2: return "Dienstag";
        case 3: return "Mittwoch";
        case 4: return "Donnerstag";
        case 5: return "Freitag";
        default: return "";
    }
}
function clicked() {
    var datum = (new Date().toISOString().slice(0, 10).split('-').reverse().join('.'));
    var output = document.getElementById("output");
    var text = document.getElementById("text");
    var data = document.getElementById("data");
    var i = 0;
    Array.from(text.value).forEach(char => {
        console.log(char);
        if (char == ".") {
            i++;
        }
    });
    var textValue = text.value;
    var outputText = ("#### " + getWeekDay() + " / " + datum + "<br><br>" + textValue.replaceAll(".", ".<br>"));
    output.innerHTML = (outputText);
    data.innerHTML = "Anzahl Sätze: " + i+ " | "+ "Anzahl Zeichen: "+ textValue.length;
}