
const ValueObject = require('../ValueObject');

describe('ValueObject', () => {
  describe('when extended', () => {
    class Email extends ValueObject {

      static validators() {
        return {
          address(aValue) {
            return typeof aValue === 'string';
          }
        };
      }
    }

    it('should create instances of the subclass', () => {
      let email = new Email({ address: 'mail@gmail.com' });

      expect(email).toBeInstanceOf(Email);
      expect(email).toBeInstanceOf(ValueObject);
    });

    describe('and the new Class has defined validators', () => {
      it('should apply the validator for the relative attributes', () => {
        expect(() => {
          new Email({ address: 12 });
        })
          .toThrow(TypeError);
      });
    });

    describe('when required to create a new sublcass instance with values', () => {
      it('should create a new instance of the subclass with the updated value', () => {
        let email = new Email({ address: 'mail@gmail.com' });
        let newEmail = email.withValues({ address: 'asd@gmail.com' });

        expect(newEmail).toBeInstanceOf(Email);
        expect(newEmail).toBeInstanceOf(ValueObject);
      });
    });

    describe('and the subclass overrides the constructor', () => {
      class Address extends ValueObject {

        static validators() {
          return {
            address: (aValue) => {
              return aValue !== 'INVALID';
            }
          };
        }

        constructor({ address }) {
          super({ address });
        }
      }

      it('should create instances of the subclass', () => {
        let address = new Address({ address: 'A address' });

        expect(address).toBeInstanceOf(Address);
        expect(address).toBeInstanceOf(ValueObject);
      });

      describe('when required to create a new sublcass instance with values', () => {
        it('should create a new instance of the subclass with the updated value', () => {
          let address = new Address({ address: 'A address' });
          let newAddress = address.withValues({ address: 'Another address' });

          expect(newAddress).toBeInstanceOf(Address);
          expect(newAddress).toBeInstanceOf(ValueObject);
          expect((newAddress).address()).toBe('Another address');
        });

        it('should apply the original validation before updating the class', () => {
          let address = new Address({ address: 'A address' });

          expect(() => {
            let newAddress = address
              .withValues({ address: 'INVALID' });
          })
            .toThrow(TypeError);

        });
      });
    });
  });
});
