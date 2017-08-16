
const adapt = require('../adaptPropertiesToJSON');

describe('AdaptPropertiesToJSON', () => {
  describe('when required to adapt a list of properties descriptors', () => {
    it('should serialize all the properties in a "name: value" JSON', () => {
      let aListOfProperties = [
        { name: 'nameA', value: 'valueA', validator: () => {} },
        { name: 'nameB', value: { b: 'valueB' }, validator: () => {} }
      ];

      expect(adapt(aListOfProperties))
        .toEqual(JSON.stringify({
          nameA: 'valueA',
          nameB: { b: 'valueB' }
        }));
    });

    describe('and the list is empty', () => {
      describe('should return a JSON representing and empty object', () => {
        let aListOfProperties = [];

        expect(adapt(aListOfProperties))
          .toEqual(JSON.stringify({}));
      });
    });
  });
});
