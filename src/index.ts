import { Observable, of, shareReplay } from "rxjs";
import { Payload } from "./index.type";
import { providerFactory } from "./provider";
import { ProviderType } from "./provider/index.enum";

export function isKeyExpired(expirationDate: number) {
  const currentTimestamp = new Date().getTime();
  return currentTimestamp >= expirationDate;
}

function getExpiryTime(
  entry: Payload<unknown> | undefined,
  lastUpdated: number
) {
  return entry && entry.expiry ? lastUpdated + entry.expiry : undefined;
}

export function invalidate(
  provider: ProviderType,
  key: string
) {
  try {
    const factory = providerFactory();
    const cache = factory.ofType(provider);
    if (!cache) {
      return null;
    }
    return cache?.unset(key);
  } catch (err) {
    throw new Error(`error while invalidating ${key} store: ${err}}`);
  }
}

export function update<Value>(
  provider: ProviderType,
  key: string,
  value: Value
) {
  try {
    const factory = providerFactory();
    const cache = factory.ofType(provider);
    const entry = cache.get(key);
    const lastUpdated = +new Date();
    const expiry = getExpiryTime(entry, lastUpdated);
    const newEntry = {
      value: of(value),
      lastUpdated,
      expiry,
    };
    return cache.set(key, newEntry);
  } catch (err) {
    throw new Error(`error while updating ${key} store: ${err}}`);
  }
}

export function init<T = unknown>(
  observable$: Observable<T>,
  key: string,
  providerType = ProviderType.MEMORY,
  maxAge?: number | undefined
): Observable<T> {
  try {
    const factory = providerFactory<T>();
    const cache = factory.ofType(providerType);
    const cached = cache.get(key);
    if (
      !cached ||
      cached === undefined ||
      (cached && cached.expiry !== undefined && isKeyExpired(cached.expiry))
    ) {
      const value = observable$.pipe(
        shareReplay({ bufferSize: 1, refCount: true })
      );
      const expiryTime = +new Date();
      const expiry = maxAge ? expiryTime + maxAge : undefined;
      cache.set(key, {
        value,
        expiry,
        lastUpdated: expiryTime,
      });
      return value as Observable<T>;
    }
    return cached?.value as Observable<T>;
  } catch (err) {
    throw new Error(`error while initializing ${key} store: ${err}}`);
  }
}

export function get<T>(
  providerType: ProviderType,
  key: string
): Observable<T> {
  try {
    const factory = providerFactory();
    const cache = factory.ofType(providerType);
    const cached = cache.get(key);
    if (cached) {
      if (cached.expiry !== undefined && isKeyExpired(cached.expiry)) {
        invalidate(providerType, key);
      } else {
        return cached?.value as Observable<T>;
      }
    }
    return of({}) as Observable<T>;
  } catch (err) {
    throw new Error(`error while fetching data for ${key} store: ${err}}`);
  }
}