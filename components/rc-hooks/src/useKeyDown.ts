
import { useEffect, useRef } from "react";

export const useKeyDown = () => {
    const keyboardEvent = useRef<KeyboardEvent>(null)
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            keyboardEvent.current = e;
        }

        const onKeyUp = (e: KeyboardEvent) => {
            keyboardEvent.current = e;
        }

        window.addEventListener("keyup", onKeyUp);
        window.addEventListener("keydown", onKeyDown);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
        }
    }, [])
    return [keyboardEvent]
}
