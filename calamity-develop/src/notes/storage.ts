import { NoteId, Note } from "./types"


export async function saveNote(note: Note): Promise<void> {

    localStorage.setItem(note.id, JSON.stringify(note));
    localStorage.setItem("lastNoteId", note.id);

}

export async function getLastNoteId(): Promise<NoteId | null> {

    const stored = localStorage.getItem("lastNoteId");
    return stored;

}

export async function loadNote(note_id: NoteId): Promise<Note | null> {

    const stored = localStorage.getItem(note_id);

    if (stored) {
        return JSON.parse(stored);
    }
    return null;


}