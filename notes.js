let notes = JSON.parse(localStorage.getItem("notes")) || [];

function openModal() {
    document.getElementById("notizModal").style.display = "block";
    updateNotesList();
}

function closeModal() {
    document.getElementById("notizModal").style.display = "none";
}

function saveNote() {
    let noteText = document.getElementById("notizfeld").value.trim();
    if (noteText) {
        notes.push(noteText);
        localStorage.setItem("notes", JSON.stringify(notes));
        document.getElementById("notizfeld").value = "";
        updateNotesList();
    }
}

function deleteNote(index) {
    notes.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    updateNotesList();
}

function editNote(index) {
    let noteItem = document.getElementById(`note-${index}`);
    let newText = noteItem.value.trim();
    if (newText) {
        notes[index] = newText;
        localStorage.setItem("notes", JSON.stringify(notes));
        updateNotesList();
    }
}

function updateNotesList() {
    let notesList = document.getElementById("notesList");
    notesList.innerHTML = "";
    notes.forEach((note, index) => {
        let noteItem = document.createElement("div");
        noteItem.className = "note-item";
        noteItem.innerHTML = `
            <input id="note-${index}" type="text" value="${note}" onblur="editNote(${index})">
            <button class="edit-btn" onclick="editNote(${index})">💾</button>
            <button class="delete-note" onclick="deleteNote(${index})">🗑️</button>
        `;
        notesList.appendChild(noteItem);
    });
}