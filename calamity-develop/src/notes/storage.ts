import { NoteId, Note } from "./types"


export async function saveNote(note: Note, note_id: NoteId): Promise<void> {

    localStorage.setItem(note_id, JSON.stringify(note));

}


export async function loadNote(note_id: NoteId): Promise<Note | null> {

    const stored = localStorage.getItem(note_id);

    if (stored) {
        return JSON.parse(stored);
    }
    return null;


}