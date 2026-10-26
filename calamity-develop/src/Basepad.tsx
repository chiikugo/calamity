import { createNote, } from "./notes/noteUtils.ts";
import { Note } from "./notes/types";
import StatusBar from "./components/StatusBar";
import { useState, useEffect } from "react";
import "./Basepad.css";
import calamityBase from "./assets/calamity_base.png";
import calamitySpeak from "./assets/calamity_talk.png";
import { loadNote, saveNote, getLastNoteId } from "./notes/storage.ts";

function Basepad() {

    const [content, setContent] = useState("");
    const [hovered, setHovered] = useState(false);

    const [currentNote, setCurrentNote] = useState<Note | null>(null);




    useEffect(() => {

        async function loadNoteStorage() {
            const note = await getLastNoteId();
            setCurrentNote(note);


        };

        loadNoteStorage();

    }, [])

    if (currentNote === null) {
        return <div>flapping wings...</div>
    }


    return (



        <div className="container">
            <textarea className="textareaone" autoFocus value={content} onChange={(e) => setContent(e.target.value)}
                placeholder="you can type...x" />
            <div className="status-bar">
                <StatusBar content={content} />
            </div>


            <div className="calamity">
                <img className={hovered ? "bounce" : ""} src={hovered ? calamitySpeak : calamityBase}
                    onMouseEnter={() =>
                        setHovered(true)}
                    onMouseLeave={() =>
                        setHovered(false)
                    } />
            </div>
        </div>

    )


}

export default Basepad;