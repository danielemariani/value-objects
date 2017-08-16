
const compare = require('../compareValueObjects');
const ValueObject = require('../../ValueObject');

describe('CompareValueObjects usecase', () => {
  describe('when comparing two value objects', () => {
    describe('when one of the objects is not a ValueObject', () => {
      it('the comparison should fail', () => {
        let aValueObject = new ValueObject({
          aProperty: 'VALUE'
        });

        let anotherObject = { aProperty: 'VALUE' };

        expect(compare(aValueObject, anotherObject))
          .toBe(false);
      });
    });

    describe('when both objects are ValueObjects', () => {
      describe('and have the same value', () => {
        it('the comparison should pass', () => {
          let valueObject = new ValueObject({
            aProperty: 'VALUE'
          });

          let anotherValueObject = new ValueObject({
            aProperty: 'VALUE'
          });

          expect(compare(valueObject, anotherValueObject))
            .toBe(true);
        });
      });

      describe('and have NOT the same value', () => {
        it('the comparison should fail', () => {
          let valueObject = new ValueObject({
            aProperty: 'VALUE'
          });

          let anotherValueObject = new ValueObject({
            aProperty: 'ANOTHER_VALUE'
          });

          expect(compare(valueObject, anotherValueObject))
            .toBe(false);
        });
      });
    });
  });
});
