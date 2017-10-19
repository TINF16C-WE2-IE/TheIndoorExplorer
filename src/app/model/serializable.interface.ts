export interface Serializable<T> {

    fromObject(json: string): T;

    toJson(): string;

}
