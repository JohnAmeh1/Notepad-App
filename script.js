document.addEventListener('DOMContentLoaded', function () {
    loadNotes();

    document.getElementById('noteForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const noteId = Date.now();

        const note = {
            id: noteId,
            title: title,
            content: content
        };

        saveNoteToLocalStorage(note);
        appendNoteToDOM(note);

        // Clear the form
        document.getElementById('title').value = '';
        document.getElementById('content').value = '';
    });
});

function saveNoteToLocalStorage(note) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));
}

function loadNotes() {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.forEach(note => appendNoteToDOM(note));
}

function appendNoteToDOM(note) {
    const noteElement = document.createElement('div');
    noteElement.classList.add('bg-white', 'p-4', 'rounded', 'shadow', 'mt-4');
    noteElement.setAttribute('data-id', note.id);

    const noteTitle = document.createElement('h2');
    noteTitle.classList.add('text-xl', 'font-bold', 'mb-2');
    noteTitle.textContent = note.title;

    const noteContent = document.createElement('p');
    noteContent.classList.add('whitespace-pre-wrap');
    noteContent.textContent = note.content;

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('flex', 'justify-end', 'space-x-2', 'mt-4');

    const downloadButton = document.createElement('button');
    downloadButton.classList.add('bg-green-500', 'text-white', 'px-4', 'py-2', 'rounded');
    downloadButton.textContent = 'Download';
    downloadButton.addEventListener('click', function () {
        downloadNoteAsFile(note.title, note.content);
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('bg-red-500', 'text-white', 'px-4', 'py-2', 'rounded');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function () {
        deleteNoteFromLocalStorage(note.id);
        noteElement.remove();
    });

    buttonContainer.appendChild(downloadButton);
    buttonContainer.appendChild(deleteButton);

    noteElement.appendChild(noteTitle);
    noteElement.appendChild(noteContent);
    noteElement.appendChild(buttonContainer);

    document.getElementById('notesContainer').appendChild(noteElement);
}

function deleteNoteFromLocalStorage(noteId) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes = notes.filter(note => note.id !== noteId);
    localStorage.setItem('notes', JSON.stringify(notes));
}

function downloadNoteAsFile(title, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}
