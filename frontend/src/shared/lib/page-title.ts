import { useEffect } from "react"

const BASE_TITLE = 'Nota';

export const usePageTitle = (title?: string) => {
    useEffect(() => {
        if (title) {
            document.title = BASE_TITLE + ' - ' + title;
        }

        return () => {
            document.title = BASE_TITLE;
        }
    }, [title])
}