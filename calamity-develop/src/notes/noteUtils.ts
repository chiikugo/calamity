
import { Note, NoteId } from './types'


export function createNote(a: string): void {

    const Note = {
        id: crypto.randomUUID(),
        content: "",
        updatedAt: Date.now()
    }

}

export function deriveTitle(content: string | null | undefined): string {

    if (!content) {
        return "";

    }

    return content.trimEnd();


}

export function wordCount(content: string): number {

    const reducedContent = content.trim();

    if (content === "") {
        return 0;
    }

    return reducedContent.split(/\s+/).length;

}

export function charCount(content: string): number {

    const reducedContent = content.trim();

    if (content === "") {
        return 0;
    }

    return reducedContent.length;
}
