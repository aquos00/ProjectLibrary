const main = document.getElementById("grid");
const button = document.getElementById("button");
let num = 0;

document.addEventListener("DOMContentLoaded", loadNotes); // Ensure notes are loaded when the DOM is fully loaded

function addNote() {
    let newArea = document.createElement("textarea");
    newArea.setAttribute("id", num);
    newArea.setAttribute("placeholder", "Empty Note");
    newArea.classList.add("card");
    newArea.setAttribute("oncontextmenu", "deleteNote(this)");
    newArea.setAttribute("onfocusout", "saveNotes();");
    main.insertBefore(newArea, button);
    num++;
    saveNotes();
}
function addOldNote(id, text) {
    let newArea = document.createElement("textarea");
    newArea.setAttribute("id", id);
    newArea.setAttribute("placeholder", "Empty Note");
    newArea.classList.add("card");
    newArea.setAttribute("oncontextmenu", "deleteNote(this)");
    newArea.setAttribute("onfocusout", "saveNotes();");
    newArea.value = text || "";
    main.insertBefore(newArea, button);
}
function deleteNote(card) {
    event.preventDefault();
    console.log(card.value);
    if (card.value != "") {
        confirm("Are you sure you want to delete this Note?") ? card.parentNode.removeChild(card) : "";
    }
    else {
        card.parentNode.removeChild(card);
    }
    saveNotes();
}
function saveNotes() {
    let notes = [];
    document.querySelectorAll(".card:not(.button)").forEach(note => {
        notes.push({ id: note.id, text: note.value });
    });
    localStorage.setItem("notes", JSON.stringify(notes));
}
function loadNotes() {
    let savedNotes = JSON.parse(localStorage.getItem("notes"));
    if (savedNotes && savedNotes.length !== 0) {
        num = 0;
        savedNotes.forEach(note => {
            addOldNote(num, note.text);
            num++;
        });
    }
    else {
        addNote();
    }
}