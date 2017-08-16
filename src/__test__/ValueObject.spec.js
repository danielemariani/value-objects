
/* globals jest */

const ValueObject = require('../ValueObject');

describe('ValueObject', () => {
  describe('when provided a property', () => {
    describe('and the property as a validator function', () => {
      let aPropertyValidator;

      beforeEach(() => {
        aPropertyValidator = jest.fn();

        aPropertyValidator
          .mockReturnValue(true);
      });

      it('should call the validator when setting the property value', () => {
        let valueObject = new ValueObject({
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
          let valueObject = new ValueObject({
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

  describe('when passed to JSON.stringify() method', () => {
    it('should serialize as expected', () => {
      let valueObject = new ValueObject({
        aProperty: 'VALUE',
        anotherProperty: { value: { a: '12' } }
      });

      expect(JSON.stringify(valueObject))
        .toBe(valueObject.serialize());
    });
  });

  describe('when evaluationg the valueOf() of the ValueObject', () => {
    it('should return the object value', () => {
      let valueObject = new ValueObject({
        aProperty: 'VALUE',
        anotherProperty: { value: { a: '12' }, validator: () => { return true; } }
      });

      expect(valueObject.valueOf())
        .toEqual({
          aProperty: 'VALUE',
          anotherProperty: { a: '12' }
        });
    });
  });

  describe('when required to compare to another object', () => {
    it('should delegate the comparison to the "compare" use case', () => {
      let valueObject = new ValueObject({
        aProperty: 'VALUE'
      });

      let aNotEqualObject = new ValueObject({
        aProperty: 'ANOTHER_VALUE'
      });

      let aEqualObject = new ValueObject({
        aProperty: 'VALUE'
      });

      expect(valueObject.equals(aNotEqualObject))
        .toBe(false);

      expect(valueObject.equals(aEqualObject))
        .toBe(true);
    });
  });
});
