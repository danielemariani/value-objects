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

// Compare by values
let valueObject = new ValueObject({ a: 'A', b: 'B' });
let equalValue = new ValueObject({ a: 'A', b: 'B' });
let differentValue = new ValueObject({ a: 'A', b: 'B' });

console.log(valueObject.equals(equalValue)); // --> true - Equality by values
console.log(valueObject.equals(differentValue)); // --> false - Different values

// Serialize
console.log(valueObject.serialize()); // --> JSON "{ \"a\": \"A\", \"b\": \"B\" }"
console.log(JSON.stringify(valueObject)) // --> same JSON "{ \"a\": \"A\", \"b\": \"B\" }"

let anotherValueObject = valueObject.withValues({ a: 'NEW' });
```
 
