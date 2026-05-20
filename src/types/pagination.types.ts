import { ApiMetadata } from "./api-response.types";

export interface PaginatedResponse<T> {
    data: T[];
    meta: ApiMetadata;
}