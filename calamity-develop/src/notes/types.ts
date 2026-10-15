

export type NoteId = string;

export interface Note { id: NoteId; content: string; updatedAt: number; }

export type SaveStatus = "idle" | "saving" | "saved" | "error";