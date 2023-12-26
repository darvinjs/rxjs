import { BehaviorSubject } from "rxjs";
import { init, isKeyExpired, update, get } from "./index";

enum stateType {
    initialState = "Initial state",
    updatedState = "updated state",
    deletedState = "deleted state",
}
const initialState = {
    list: [],
    stateType: stateType.initialState,
};

const updateState = {
    ...initialState,
    stateType: stateType.updatedState
}

const keyToStorage = "RXJS_DARVINJS_STORE";

const storageInit = init(
    new BehaviorSubject(initialState),
    keyToStorage,
);

const currentLocalDate = new Date().toLocaleDateString();

describe('Compare and check expiry with current time', () => {
    const date = new Date();
    const yesterdayDate = date.setDate(date.getDate() - 1);
    const upcomingDate = date.setDate(date.getDate() + 2);
    it(`Expiration Date to compare is ${new Date(yesterdayDate).toLocaleDateString()}`, () => {
      expect(isKeyExpired(yesterdayDate)).toEqual(true);
    });
    it(`Expiration Date to compare is ${new Date(upcomingDate).toLocaleDateString()}`, () => {
        expect(isKeyExpired(upcomingDate)).toEqual(false);
    });
});

describe('Initalize the store', () => {
    storageInit.subscribe((initialState) => {
        it(`Store Initialized with state ${JSON.stringify(initialState)} at ${currentLocalDate}`, () => {
            expect(initialState).toEqual(initialState);
        });
    });
});
  
describe('Update the store', () => {
    const storeUpdated = update(keyToStorage, updateState)
    it(`Store Updated at ${currentLocalDate}`, () => {
        expect(currentLocalDate).toEqual(new Date(storeUpdated?.lastUpdated).toLocaleDateString());
    });
    storeUpdated?.value?.subscribe((state) => {
        it(`Store Updated with state ${JSON.stringify(updateState)} at ${currentLocalDate}`, () => {
            expect(state).toEqual(updateState);
        });
    });
});

describe('Get the store', () => {
    const store = get(keyToStorage);
    store.subscribe((currentStore) => {
        it(`Get the Updated store ${JSON.stringify(updateState)} at ${currentLocalDate}`, () => {
            expect(currentStore).toEqual(updateState);
        });
    })
});