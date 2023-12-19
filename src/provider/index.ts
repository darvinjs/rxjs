import { localStorage } from "../storage/local.storage";
import { memoryStorage } from "../storage/memory.storage";
import { sessionStorage } from "../storage/session.storage";
import { ProviderType } from "./index.enum";

export function providerFactory<T = unknown>() {
  const memory = memoryStorage<T>();
  return {
    ofType(type: ProviderType) {
      switch (type) {
        case ProviderType.MEMORY:
          return memory;

        case ProviderType.PERSISTENT:
          return localStorage<T>();

        case ProviderType.SESSION:
          return sessionStorage<T>();

        default:
          return memory;
      }
    },
  };
}
