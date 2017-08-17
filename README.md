# Value Objects [![npm](https://img.shields.io/npm/v/value-objects.svg)]() [![Build Status](https://travis-ci.org/danielemariani/value-objects.svg?branch=master)](https://travis-ci.org/danielemariani/value-objects) [![Coverage Status](https://coveralls.io/repos/github/danielemariani/value-objects/badge.svg?branch=master)](https://coveralls.io/github/danielemariani/value-objects?branch=master)

A js library to work with immutable value objects

*... WIP ...*

## Guide

### Install
```sh
npm install value-objects
```
### Usage
```js
const ValueObject = require('value-objects').ValueObject;

// Values getters
let valueObject = new ValueObject({ a: 'A', b: 'B' });

valueObject.a(); // --> 'A'
valueObject.b(); // --> 'B'
valueObject.c(); // --> Error, getter does not exist

// Immutability
let valueObject = new ValueObject({ a: { c: 10 }});
valueObject.a().c = 12; // Silent fail, throws in strict mode
valueObject.a(); // --> { c: 10 }

// Change some values, return a new instance
let valueObject = new ValueObject({ a: 'A', b: 'B' });
let newValueObject = valueObject.withValues({ a: 'NEW' })

newValueObject.a(); --> // 'NEW'
newValueObject.b(); --> // 'B'

// Compare by value
let valueObject = new ValueObject({ a: 'A', b: 'B' });
let equalValue = new ValueObject({ a: 'A', b: 'B' });
let differentValue = new ValueObject({ a: 'A', b: 'OTHER' });

console.log(valueObject.equals(equalValue)); // --> true - Equality by value
console.log(valueObject.equals(differentValue)); // --> false - Different values

// Serialize
let valueObject = new ValueObject({ a: 'A', b: 'B' });

console.log(valueObject.serialize()); // --> JSON "{ \"a\": \"A\", \"b\": \"B\" }"
console.log(JSON.stringify(valueObject)) // --> same JSON "{ \"a\": \"A\", \"b\": \"B\" }"

// ==== EXTEND ====
class Email extends ValueObject {

 static validators() {
  return {
   address(address) {
    return /^\w+@\w+\..{2,3}(.{2,3})?$/.test(address);
   }
  };
 }
 
 constructor({ address }) {
  super({ address });
 }
 
}

let email = new Email({ address: 'example@gmail.com' });
let email = new Email({ address: 'not an email' }); // --> Throws validation error
```
 
