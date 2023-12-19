import { Observable } from "rxjs";

export interface Payload<T> {
  value: Observable<T>;
  expiry: number | undefined;
  lastUpdated: number;
}
