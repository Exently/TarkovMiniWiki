let notes = JSON.parse(localStorage.getItem("notes")) || [];
let editingIndex = null;

notes = notes.map(note => {
    if (typeof note === "string") {
        return { title: "Old Note", content: note };
    }
    return note;
});
localStorage.setItem("notes", JSON.stringify(notes));

function saveNote() {
    let title = document.getElementById("noteTitle").value.trim();
    let content = document.getElementById("notizfeld").value.trim();
    
    if (!title && !content) return;

    if (editingIndex !== null) {
        notes[editingIndex] = { title, content };
        editingIndex = null;
    } else {
        notes.push({ title, content });
    }

    localStorage.setItem("notes", JSON.stringify(notes));
    document.getElementById("noteTitle").value = "";
    document.getElementById("notizfeld").value = "";
    const status = document.createElement("div");
    status.textContent = "Note saved ✅";
    status.style.color = "#0f9";
    status.style.marginTop = "10px";
    document.querySelector(".modal-content").appendChild(status);
    setTimeout(() => status.remove(), 1500);
    updateNotesList();
    document.querySelector(".save-btn").textContent = editingIndex !== null ? "💾 Update Note" : "➕ Save Note";
}

function deleteNote(index) {
    notes.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    updateNotesList();
}

function editNote(index) {
    const note = notes[index];
    document.getElementById("noteTitle").value = note.title;
    document.getElementById("notizfeld").value = note.content;
    editingIndex = index;
    document.querySelector(".save-btn").textContent = editingIndex !== null ? "💾 Update Note" : "➕ Save Note";
    document.getElementById("cancel-btn").style.display = "inline-block";
}

function cancelEdit() {
    editingIndex = null;
    document.getElementById("noteTitle").value = "";
    document.getElementById("notizfeld").value = "";
    document.querySelector(".save-btn").textContent = "➕ Save Note";
    document.getElementById("cancel-btn").style.display = "none";
}

function updateNotesList() {
    let notesList = document.getElementById("notesList");
    notesList.innerHTML = "";

    notes.forEach((note, index) => {
        let noteItem = document.createElement("div");
        noteItem.className = "note-item";
        noteItem.innerHTML = `
            <div style="flex-grow: 1;">
                <strong style="color: #0f9;">${note.title || "(Untitled)"}</strong><br>
                <span style="font-size: 0.85em; color: #aaa;">${note.content.slice(0, 50)}${note.content.length > 50 ? "..." : ""}</span>
            </div>
            <div>
                <button class="edit-btn" onclick="editNote(${index})">✏️</button>
                <button class="delete-note" onclick="deleteNote(${index})">🗑️</button>
            </div>
        `;
        notesList.appendChild(noteItem);
    });
}

function openModal() {
    const modal = document.getElementById("notizModal");
    const content = modal.querySelector(".modal-content");
    updateNotesList();

    modal.style.display = "block";
    setTimeout(() => modal.classList.add("visible"), 10);

    // Force reflow to reset animation
    content.style.animation = "none";
    void content.offsetWidth;
    content.style.animation = "modalIn 0.4s ease-out forwards";
}

function closeModal() {
    const modal = document.getElementById("notizModal");
    const content = modal.querySelector(".modal-content");

    content.style.animation = "none";
    void content.offsetWidth; // Reflow
    content.style.animation = "modalOut 0.3s ease-in forwards";

    modal.classList.remove("visible");

    setTimeout(() => {
        modal.style.display = "none";
    }, 300); // Muss zur Dauer der modalOut-Animation passen!
}

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeModal();
    }
});