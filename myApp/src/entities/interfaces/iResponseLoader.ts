export interface iResponseLoader<T>{
    fromResponse(json: string): T;
}