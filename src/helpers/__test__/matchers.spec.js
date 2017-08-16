
const matchers = require('../matchers');

describe('Matchers module', () => {
  describe('#isFunction', () => {
    describe('should return "true"', () => {
      it('when the provided value is a function', () => {
        expect(matchers.isFunction(() => {})).toBe(true);
      });
    });

    describe('should return "false"', () => {
      it('when the provided value is NOT a function', () => {
        expect(matchers.isFunction({})).toBe(false);
        expect(matchers.isFunction(null)).toBe(false);
        expect(matchers.isFunction()).toBe(false);
      });
    });
  });

  describe('#isArray', () => {
    describe('should return "true"', () => {
      it('when the provided value is an Array', () => {
        expect(matchers.isArray([])).toBe(true);
      });
    });

    describe('should return "false"', () => {
      it('when the provided value is NOT a function', () => {
        expect(matchers.isArray({})).toBe(false);
        expect(matchers.isArray(null)).toBe(false);
        expect(matchers.isArray()).toBe(false);
      });
    });
  });

  describe('#isObject', () => {
    describe('should return "true"', () => {
      it('when the provided value is an Object', () => {
        expect(matchers.isObject({})).toBe(true);
      });
    });

    describe('should return "false"', () => {
      it('when the provided value is NOT a Object', () => {
        expect(matchers.isObject(() => {})).toBe(false);
        expect(matchers.isObject()).toBe(false);
      });

      it('when the provided value is NOT null', () => {
        expect(matchers.isObject(null)).toBe(false);
      });

      it('when the provided value is NOT a Array', () => {
        expect(matchers.isObject([])).toBe(false);
      });
    });
  });

  describe('#isNull', () => {
    describe('should return "true"', () => {
      it('when the provided value is "null"', () => {
        expect(matchers.isNull(null)).toBe(true);
      });
    });

    describe('should return "false"', () => {
      it('when the provided value is NOT null', () => {
        expect(matchers.isNull({})).toBe(false);
        expect(matchers.isNull([])).toBe(false);
      });

      it('when the provided value is "undefined"', () => {
        expect(matchers.isNull()).toBe(false);
      });
    });
  });

  describe('#isDefined', () => {
    describe('should return "true"', () => {
      it('when the provided value is NOT "undefined"', () => {
        expect(matchers.isDefined({})).toBe(true);
      });
    });

    describe('should return "false"', () => {
      it('when the provided value is "undefined"', () => {
        expect(matchers.isDefined()).toBe(false);
      });
    });
  });

  describe('#isNotDefined', () => {
    describe('should return "true"', () => {
      it('when the provided value is "undefined"', () => {
        expect(matchers.isNotDefined()).toBe(true);
      });
    });

    describe('should return "false"', () => {
      it('when the provided value is NOT "undefined"', () => {
        expect(matchers.isNotDefined({})).toBe(false);
      });
    });
  });

  describe('#isNotDefined', () => {
    describe('should return "true"', () => {
      it('when the provided value is not an Object or a Function', () => {
        expect(matchers.isSimpleValue('a')).toBe(true);
        expect(matchers.isSimpleValue([])).toBe(true);
        expect(matchers.isSimpleValue(null)).toBe(true);
      });
    });

    describe('should return "false"', () => {
      it('when the provided value is an Object', () => {
        expect(matchers.isSimpleValue({})).toBe(false);
      });

      it('when the provided value is a Function', () => {
        expect(matchers.isSimpleValue(() => {})).toBe(false);
      });
    });
  });
});
