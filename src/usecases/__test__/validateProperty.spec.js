
const valueObject = require('../../ValueObject');
const validateProperty = require('../validateProperty');

class Email extends valueObject {
  static validators() {
    return {
      address(aAddress) {
        return typeof aAddress === 'string';
      }
    };
  }
}

describe('validateProperty use case', () => {
  describe('when provided a ValueObject subclass instance with validators', () => {
    describe('and a validator is provided for the property', () => {
      it('should validate the property before assigning it', () => {
        let email = new Email({ address: 'mail@gmail.com' });

        expect(email.address())
          .toBe('mail@gmail.com');

        expect(() => {
          new Email({ address: 12 });
        })
          .toThrow(TypeError);
      });
    });

    describe('and a validator is NOT provided for the property', () => {
      it('should NOT validate the property before assigning it', () => {
        let email = new Email({ boh: 12 });

        expect(email.boh())
          .toBe(12);
      });
    });
  });
});
