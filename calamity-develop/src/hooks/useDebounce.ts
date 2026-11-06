
import { useState, useEffect } from "react";


export function useDebounce<T>(value: T, delayMs: number): T {

    const [dvalue, setDvalue] = useState(value);


    useEffect(() => {
        const timerId = setTimeout(() => setDvalue(value), delayMs);


        return () =>
            clearTimeout(timerId);

    }, [value, delayMs]);



    return dvalue;



}



