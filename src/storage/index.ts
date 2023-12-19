import { of, filter, take } from "rxjs";
import { Provider } from "../provider/index.type";
import { Payload } from "../index.type";
import { WebStorage } from "./index.type";

export function storage<T>(webStorage: WebStorage): Provider<T> {
  return {
    get(key: string) {
      try {
        const payload = webStorage?.getItem(key) || null;
        if (!payload) {
            return null;
        }
        const parsed = JSON && JSON.parse(payload) || null;
        if (!parsed) {
            return null;
        }
        return {
          ...parsed,
          value: of(parsed.value),
        };
      } catch (e) {
        throw new Error(`error while getting payload ${e}`);
      }
    },
    set(key: string, payload: Payload<T>) {
      try {
        payload.value.pipe(take(1), filter(Boolean)).subscribe((value: any) => {
            webStorage?.setItem(
              key,
              JSON && JSON.stringify({
                ...payload,
                value,
              }) || "",
            );
          });
      } catch (e) {
        throw new Error(`error while seting payload ${e}`);
      }
    },
    unset(key: string) {
        webStorage?.removeItem(key);
    },
  };
}
