
/* globals jest */

const ValueObject = require('../ValueObject');

describe('ValueObject', () => {
  describe('when handled', () => {
    it('should be immutable', () => {
      let valueObject = new ValueObject({
        aProperty: 'VALUE',
        anotherProperty: { a: 12 }
      });

      valueObject.property = 'ANOTHER_VALUE';
      valueObject.anotherProperty().a = 13;
      valueObject.newProperty = 'NEW';

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

  describe('when NOT provided a map of properties', () => {
    it('should default to a empty map of properties', () => {
      let valueObject = new ValueObject();
      expect(valueObject.valueOf()).toEqual({});
    });
  });

  describe('when requested to serialize itself', () => {
    it('should serialize all its properties', () => {
      let valueObject = new ValueObject({
        aProperty: 'VALUE',
        anotherProperty: { a: '12' },
        ['a-third-property']: 37
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

    describe('when holds properties with a toJSON method', () => {
      it('should use their toJSON method to serialize them', () => {
        let value = new ValueObject({
          a: 'A',
        });

        let anotherValue = new ValueObject({
          b: 'B',
          c: value
        });

        expect(anotherValue.serialize())
          .toEqual(JSON.stringify({
            b: 'B',
            c: { a: 'A' }
          }));
      });
    });
  });

  describe('when passed to JSON.stringify() method', () => {
    it('should serialize as expected', () => {
      let valueObject = new ValueObject({
        aProperty: 'VALUE',
        anotherProperty: { a: '12' }
      });

      expect(JSON.stringify(valueObject))
        .toBe(valueObject.serialize());
    });
  });

  describe('when asked its valueOf()', () => {
    it('should return the object value', () => {
      let valueObject = new ValueObject({
        aProperty: 'VALUE',
        anotherProperty: { a: '12' }
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
    it('should return a new value object with the updated values', () => {
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
});
