import { Provider } from "../provider/index.type";
import { memoryStorage } from "./memory.storage";
import { storage } from ".";

declare const window: Window | any;

export function sessionStorage<T>(): Provider<T> {
  const storageInst = window?.sessionStorage;
  return storageInst ? storage(storageInst) : memoryStorage();
}
