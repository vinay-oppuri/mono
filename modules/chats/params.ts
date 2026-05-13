import {
    createLoader,
    parseAsInteger as parseAsIntegerServer,
    parseAsString as parseAsStringServer
} from "nuqs/server"
import {
    parseAsInteger,
    parseAsString,
    useQueryStates
} from "nuqs"

import { DEFAULT_PAGE } from "@/constants"

export const chatsSearchParams = {
    search: parseAsStringServer.withDefault("").withOptions({ clearOnDefault: true }),
    page: parseAsIntegerServer.withDefault(DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
    agentId: parseAsStringServer.withDefault("").withOptions({ clearOnDefault: true })
}

export const loadSearchParams = createLoader(chatsSearchParams)

export const useChatsFilters = () => {
    return useQueryStates({
        search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
        page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
        agentId: parseAsString.withDefault("").withOptions({ clearOnDefault: true })
    })
}
