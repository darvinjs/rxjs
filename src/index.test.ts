import { isKeyExpired } from ".";

describe('Compare and check expiry with current time', () => {
    const date = new Date();
    const yesterdayDate = date.setDate(date.getDate() - 1);
    const upcomingDate = date.setDate(date.getDate() + 2);
    it(`Expiration Date to compare is ${new Date(yesterdayDate)}`, () => {
      expect(isKeyExpired(date.setDate(yesterdayDate))).toEqual(true);
    });
    it(`Expiration Date to compare is ${new Date(upcomingDate)}`, () => {
        expect(isKeyExpired(date.setDate(upcomingDate))).toEqual(false);
    });
});
  