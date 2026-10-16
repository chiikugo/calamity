import { createNote, } from "./notes/noteUtils.ts"
import StatusBar from "./components/StatusBar"
import { useState } from "react";
import "./Basepad.css"
import calamityBase from "./assets/calamity_base.png";
import calamitySpeak from "./assets/calamity_talk.png";

function Basepad() {

    const [content, setContent] = useState("");
    const [hovered, setHovered] = useState(false);


    return (
        <div className="container">
            <textarea className="textareaone" value={content} onChange={(e) => setContent(e.target.value)}
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