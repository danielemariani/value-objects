
const adapt = require('../adaptPropertiesToPlainObject');

describe('AdaptPropertiesToPlainObject', () => {
  describe('when required to adapt a list of properties descriptors', () => {
    it('should serialize all the properties in a "name: value" object', () => {
      let aListOfProperties = [
        { name: 'nameA', value: 'valueA', validator: () => {} },
        { name: 'nameB', value: { b: 'valueB' }, validator: () => {} }
      ];

      expect(adapt(aListOfProperties))
        .toEqual({
          nameA: 'valueA',
          nameB: { b: 'valueB' }
        });
    });

    describe('and the list is empty', () => {
      describe('should return a empty object', () => {
        let aListOfProperties = [];

        expect(adapt(aListOfProperties))
          .toEqual({});
      });
    });
  });
});
