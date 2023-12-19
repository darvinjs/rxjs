import { Payload } from "../index.type";

export interface Provider<T> {
    get(key: string): Payload<T> | undefined;
    set(key: string, value: Payload<T>): void;
    unset(key: string): void;
}
  