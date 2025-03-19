import Dexie, { type EntityTable } from "dexie";

interface RequestEntity {
    id: string
    url: string
    method: string
    headers: unknown
    data: unknown
    createAt: Date
}

interface ResponseEntity {
    id: string
    status: number
    statusText: string
    headers: unknown
    data: unknown
    time: number
    createAt: Date
}

const db = new Dexie('@crab/rc-request') as Dexie & {
    request: EntityTable<RequestEntity, "id">,
    response: EntityTable<ResponseEntity, "id">
};

db.version(1).stores({
    request: "id, url, method, headers, data, createAt",
    response: "id, status, statusText, headers, data, time, createAt",
});


export const addRequestEntity = async (request: RequestEntity) => {
    await db.request.add(request);
}

export const addResponseEntity = async (response: ResponseEntity) => {
    await db.response.add(response);
}


