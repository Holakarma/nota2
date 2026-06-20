import { useParams } from "@tanstack/react-router";
import { isUuid } from "./is-uuid";
import { DEFAULT_STREAM_ROUTE_PARAM } from "@shared/model/route.config";

export const useUrlParams = () => {
    const params = useParams({ strict: false });
    const rawNoteId =
        typeof params.noteId === 'string' ? params.noteId : undefined;
    const rawStreamId =
        typeof params.streamId === 'string' ? params.streamId : undefined;

    const isDefaultStream = rawStreamId === DEFAULT_STREAM_ROUTE_PARAM

    const noteId = isUuid(rawNoteId) ? rawNoteId : undefined;
    const streamId = isDefaultStream ? DEFAULT_STREAM_ROUTE_PARAM : isUuid(rawStreamId) ? rawStreamId : undefined;

    return { noteId, streamId }
}