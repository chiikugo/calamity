import { useEffect, useRef } from 'react';


export function useHotkey(onTrigger: () => void) {
    const callbackRef = useRef(onTrigger);
    callbackRef.current = onTrigger;

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {

            // handling keydown event and assigning keys
            if (event.metaKey && event.key.toLowerCase() === "s") {
                callbackRef.current();
                event.preventDefault();
                console.log("cmd + s, pressed!")
            }

        }
        //"keydown" is for pressing keys, other options are "scroll"
        window.addEventListener("keydown", handleKeyDown);


        return () => window.removeEventListener("keydown", handleKeyDown)


    }, [])

}

