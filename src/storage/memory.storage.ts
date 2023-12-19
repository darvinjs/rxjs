import { Payload } from "../index.type";
import { Provider } from "../provider/index.type";

const cache = new Map<string, Payload<unknown>>();

export function memoryStorage<T>(): Provider<T> {
  return {
    get(key: string) {
      return cache.get(key) as Payload<T> | undefined;
    },
    set(key: string, value: Payload<T>) {
      cache.set(key, value);
    },
    unset(key: string) {
      cache.delete(key);
    },
  };
}
