import { DEFAULT_STREAM_ROUTE_PARAM } from "@shared/model/route.config"

export const isDefaultStream = (streamName?: string) => {
    return streamName === DEFAULT_STREAM_ROUTE_PARAM
}