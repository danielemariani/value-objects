
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

      expect(valueObject.aProperty())
        .toEqual('VALUE');

      expect(valueObject.anotherProperty())
        .toEqual({ a: 12 });
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

  describe('when required to change some of the values', () => {
    it('should return a new value object with the updated value', () => {
      let originalValueObject = new ValueObject({
        aProperty: 'VALUE'
      });

      let anotherValueObject = originalValueObject
        .withValues({ aProperty: 'NEW_VALUE' });

      expect(anotherValueObject)
        .toBeInstanceOf(ValueObject);

      expect(anotherValueObject)
        .not.toBe(originalValueObject);

      expect(anotherValueObject.equals(originalValueObject))
        .toBe(false);
    });
  });

  describe('when extended', () => {
    class Email extends ValueObject {
    }

    it('should create instances of the subclass', () => {
      let email = new Email();

      expect(email).toBeInstanceOf(Email);
      expect(email).toBeInstanceOf(ValueObject);
    });

    describe('when required to create a new sublcass instance with values', () => {
      it('should create a new instance of the subclass with the updated value', () => {
        let email = new Email();
        let newEmail = email.withValues({ address: 'asd@gmail.com' });

        expect(newEmail).toBeInstanceOf(Email);
        expect(newEmail).toBeInstanceOf(ValueObject);
      });
    });

    describe('and the subclass overrides the constructor', () => {
      class Address extends ValueObject {

        constructor(aAddress) {
          super({ address: aAddress });
        }

        withValues(aAddress) {
          return new Address(aAddress);
        }
      }

      it('should create instances of the subclass', () => {
        let address = new Address('a address');

        expect(address).toBeInstanceOf(Address);
        expect(address).toBeInstanceOf(ValueObject);
      });

      describe('when required to create a new sublcass instance with values', () => {
        it('should create a new instance of the subclass with the updated value', () => {
          let address = new Address('a address');
          let newAddress = address.withValues('asd@gmail.com');

          expect(newAddress).toBeInstanceOf(Address);
          expect(newAddress).toBeInstanceOf(ValueObject);
        });
      });
    });
  });
});
