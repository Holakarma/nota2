import { useState, useRef, useEffect } from "react";

export const useThrottledState = (value: string, delayMs: number) => {
    const [throttledValue, setThrottledValue] = useState(value);
    const lastUpdateAtRef = useRef(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        if (!value) {
            lastUpdateAtRef.current = Date.now();
            setThrottledValue(value);
            return;
        }

        const now = Date.now();
        const remainingMs = delayMs - (now - lastUpdateAtRef.current);

        if (remainingMs <= 0) {
            lastUpdateAtRef.current = now;
            setThrottledValue(value);
            return;
        }

        timeoutRef.current = setTimeout(() => {
            lastUpdateAtRef.current = Date.now();
            setThrottledValue(value);
            timeoutRef.current = null;
        }, remainingMs);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [delayMs, value]);

    return throttledValue;
};

