
const adapt = require('../adaptProvidedProperties');

describe('Function adaptProvidedProperties', () => {
  describe('when provided a map of properties', () => {
    it('should return a list of adapted properties descriptors', () => {
      let aMapOfProperties = { a: 12, b: 'B' };
      let adaptedProperties = adapt(aMapOfProperties);

      expect(adaptedProperties)
        .toEqual([
          { name: 'a', value: 12, validator: expect.any(Function) },
          { name: 'b', value: 'B', validator: expect.any(Function) }
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
          let aMapOfProperties = { aProperty: 'VALUE' };
          let adaptedProperties = adapt(aMapOfProperties);

          expect(adaptedProperties)
            .toEqual([
              expect.objectContaining({ value: 'VALUE' })
            ]);
        });
      });

      describe('and the property is an object', () => {
        describe('and the object has a "value" attribute', () => {
          it('should use the "value" attribute as the property value', () => {
            let aMapOfProperties = { aProperty: { value: 'VALUE' } };
            let adaptedProperties = adapt(aMapOfProperties);

            expect(adaptedProperties)
              .toEqual([
                expect.objectContaining({ value: 'VALUE' })
              ]);
          });
        });

        describe('and the object has NOT a "value" attribute', () => {
          it('should throw a TypeError', () => {
            let aMapOfProperties = { aProperty: {} };

            expect(() => {
              adapt(aMapOfProperties);
            })
              .toThrow(TypeError);
          });
        });

        describe('and the property has a "validator" attribute', () => {
          describe('and the "validator" attribute is a function', () => {
            it('should use the provided function as the property validator', () => {
              let aMapOfProperties = { aProperty: { value: 'VALUE', validator: () => {} } };
              let adaptedProperties = adapt(aMapOfProperties);

              expect(adaptedProperties)
                .toEqual([
                  expect.objectContaining({
                    validator: aMapOfProperties.aProperty.validator
                  })
                ]);
            });
          });

          describe('and the "validator" attribute is NOT a function', () => {
            it('should throw a TypeError', () => {
              let aMapOfProperties = { aProperty: { value: 'VALUE', validator: {} } };

              expect(() => {
                adapt(aMapOfProperties);
              })
                .toThrow(TypeError);
            });
          });
        });

        describe('and the property has NOT a "validator" attribute', () => {
          it('should use a "always true" validator as the property validator', () => {
            let aMapOfProperties = { aProperty: { value: 'VALUE' } };
            let adaptedProperties = adapt(aMapOfProperties);

            expect(adaptedProperties)
              .toEqual([
                expect.objectContaining({
                  validator: expect.any(Function)
                })
              ]);

            expect(adaptedProperties[0].validator())
              .toBe(true);
          });
        });
      });
    });
  });
});
