
const adapt = require('../adaptProvidedProperties');

describe('adaptProvidedProperties', () => {
  describe('when requested to adapt a map of properties', () => {
    it('should return a list of adapted properties descriptors', () => {
      let aMapOfProperties = { a: 12, b: 'B' };
      let adaptedProperties = adapt(aMapOfProperties);

      expect(adaptedProperties)
        .toEqual([
          { name: 'a', value: 12 },
          { name: 'b', value: 'B' }
        ]);
    });

    describe('when adapting each property', () => {
      it('should use the property key as the property name', () => {
        let aMapOfProperties = { aProperty: 'VALUE' };
        let adaptedProperties = adapt(aMapOfProperties);

        expect(adaptedProperties)
          .toEqual([
            expect.objectContaining({ name: 'aProperty' })
          ]);
      });

      describe('and the property is a simple value', () => {
        it('should use the provided value as the property value', () => {
          let aMapOfProperties = { aProperty: 'VALUE', anotherProperty: ['a', 'b', 'c'] };
          let adaptedProperties = adapt(aMapOfProperties);

          expect(adaptedProperties)
            .toEqual([
              expect.objectContaining({ value: 'VALUE' }),
              expect.objectContaining({ value: ['a', 'b', 'c'] })
            ]);
        });
      });

      describe('and the property is an object', () => {
        it('should use the object as the property value', () => {
          let aMapOfProperties = { aProperty: { value: 'VALUE' } };
          let adaptedProperties = adapt(aMapOfProperties);

          expect(adaptedProperties)
            .toEqual([
              expect.objectContaining({ value: { value: 'VALUE' } })
            ]);
        });
      });
    });
  });
});

