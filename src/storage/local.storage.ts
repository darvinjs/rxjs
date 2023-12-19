import { Provider } from "../provider/index.type";
import { memoryStorage } from "./memory.storage";
import { storage } from ".";

declare const window: Window | any;

export function localStorage<T>(): Provider<T> {
  const storageInst = window?.localStorage;
  return storageInst ? storage(storageInst) : memoryStorage();
}
