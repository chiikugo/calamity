import { createNote, } from "./notes/noteUtils.ts";
import { Note } from "./notes/types";
import StatusBar from "./components/StatusBar";
import { useState, useEffect } from "react";
import "./Basepad.css";
import calamityBase from "./assets/calamity_base.png";
import calamitySpeak from "./assets/calamity_talk.png";
import { loadNote, saveNote, getLastNoteId } from "./notes/storage.ts";
import { useDebounce } from "./hooks/useDebounce.ts";

function Basepad() {

    const [content, setContent] = useState("");
    const [hovered, setHovered] = useState(false);

    const [currentNote, setCurrentNote] = useState<Note | null>(null);




    useEffect(() => {

        async function loadNoteStorage() {
            const lastNote = await getLastNoteId();
            const current = lastNote ? await loadNote(lastNote) : null;
            const active = current ?? createNote();
            setCurrentNote(active);
            setContent(active.content);


        };

        loadNoteStorage();

    }, [])
    //debounced value that will save content every 1000 miliseconds/ second

    const secondSave = useDebounce(content, 1000);



    useEffect(() => {
        // Guard check: Don't save if there's no note loaded,
        // or if the debounced text hasn't changed from what's already saved.
        if (!currentNote || secondSave === currentNote.content) {
            return;
        }

        async function saveStore() {
            try {
                // 1. Construct the updated note with the latest text and timestamp
                const updatedNote: Note = {
                    ...currentNote,
                    content: secondSave,
                    updatedAt: Date.now(),
                };

                // 2. Persist the updated note to storage
                await saveNote(updatedNote);

                // 3. Keep currentNote in React state in sync with storage
                setCurrentNote(updatedNote);
            } catch (err) {
                console.error("Failed to autosave note:", err);
            }
        }

        // Call the async function inside the effect
        saveStore();
    }, [secondSave, currentNote]);

    if (currentNote === null) {
        return <div>flapping wings...</div>;
    }

    return (
        <div className="container">
            <textarea
                className="textareaone"
                autoFocus
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="you can type...x"
            />
            <div className="status-bar">
                <StatusBar content={content} />
            </div>

            <div className="calamity">
                <img
                    className={hovered ? "bounce" : ""}
                    src={hovered ? calamitySpeak : calamityBase}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                />
            </div>
        </div>
    );
}

export default Basepad;