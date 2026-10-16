import { createNote, } from "./notes/noteUtils.ts"
import StatusBar from "./components/StatusBar"
import { useState } from "react";

function Basepad() {

    const [content, setContent] = useState("");


    return (
        <>
            <textarea value={content} onChange={(e) => setContent(e.target.value)}
                placeholder="you can type...x" />
            <StatusBar content={content} />
        </>

    )

}

export default Basepad;