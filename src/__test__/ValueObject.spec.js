
/* globals jest */

const ValueObject = require('../ValueObject');

describe('ValueObject', () => {
  describe('when provided a property', () => {
    describe('and the property is a simple value', () => {
      it('should set the property with the provided value', () => {
        let valueObject = new ValueObject({
          aProperty: 'VALUE'
        });

        expect(valueObject.aProperty())
          .toEqual('VALUE');
      });
    });

    describe('and the property is a "descriptor" object', () => {
      describe('and the property descriptor has NOT a "value" attribute', () => {
        it('should throw a TypeError', () => {
          expect(() => {
            new ValueObject({
              aProperty: { a: 'a' }
            });
          })
            .toThrow(TypeError);
        });
      });

      describe('and the property descriptor has a "value" attribute', () => {
        describe('and the property descriptor has NOT a validator property', () => {
          it('should not validate the property value', () => {
            let valueObject = new ValueObject({
              aProperty: { value: 'VALUE' }
            });

            expect(valueObject.aProperty())
              .toEqual('VALUE');
          });
        });

        describe('and the property descriptor has a validator property', () => {
          let valueObject;
          let aPropertyValidator;

          beforeEach(() => {
            aPropertyValidator = jest.fn();

            aPropertyValidator
              .mockReturnValue(true);
          });

          describe('and the validator property is a function', () => {
            it('should call the validator when setting the property value', () => {
              valueObject = new ValueObject({
                aProperty: {
                  value: 'VALUE',
                  validator: aPropertyValidator
                }
              });

              expect(aPropertyValidator)
                .toHaveBeenCalledWith('VALUE');
            });

            describe('and the validator function returns "true"', () => {
              it('should set the value', () => {
                valueObject = new ValueObject({
                  aProperty: {
                    value: 'VALUE',
                    validator: aPropertyValidator
                  }
                });

                expect(valueObject.aProperty())
                  .toBe('VALUE');
              });
            });

            describe('and the validator function does NOT return "true"', () => {
              beforeEach(() => {
                aPropertyValidator
                  .mockReturnValue(false);
              });

              it('should throw a TypeError', () => {
                expect(() => {
                  new ValueObject({
                    aProperty: {
                      value: 'VALUE',
                      validator: aPropertyValidator
                    }
                  });
                })
                  .toThrow(TypeError);
              });
            });
          });

          describe('and the validator property is NOT a function', () => {
            it('should throw a TypeError', () => {
              expect(() => {
                new ValueObject({
                  aProperty: {
                    value: 'VALUE',
                    validator: {}
                  }
                });
              })
                .toThrow(TypeError);
            });
          });
        });
      });
    });
  });

  describe('when handled', () => {
    it('should be immutable', () => {
      let valueObject = new ValueObject({
        aProperty: 'VALUE',
        anotherProperty: { value: { a: 12 }}
      });

      valueObject.property = 'ANOTHER_VALUE';
      valueObject.anotherProperty().a = 13;
      valueObject.aNewProperty = 'NEW';

      expect(valueObject.aProperty())
        .toEqual('VALUE');

      expect(valueObject.anotherProperty())
        .toEqual({ a: 12 });

      expect(valueObject.aNewProperty)
        .toBeUndefined();
    });
  });

  describe('when provided a map of properties descriptors', () => {
    it('should expose the properties with their names', () => {
      let valueObject = new ValueObject({
        aProperty: 'VALUE',
        anotherProperty: 'ANOTHER_VALUE',
        ['a-third-property']: 'A Third value'
      });

      expect(valueObject.aProperty())
        .toEqual('VALUE');

      expect(valueObject.anotherProperty())
        .toEqual('ANOTHER_VALUE');

      expect(valueObject['a-third-property']())
        .toEqual('A Third value');
    });
  });

  describe('when requested to serialize itself', () => {
    it('should serialize all its properties', () => {
      let valueObject = new ValueObject({
        aProperty: 'VALUE',
        anotherProperty: {
          value: { a: '12' }
        },
        ['a-third-property']: {
          value: 37,
          validator: () => {
            return true;
          }
        }
      });

      let aSerializedObject = valueObject
        .serialize();

      expect(aSerializedObject)
        .toBe(JSON.stringify({
          aProperty: 'VALUE',
          anotherProperty: { a: '12' },
          ['a-third-property']: 37
        }));
    });
  });

});
