import { assert, assertEquals } from "@std/assert";
import { getRandom, genChars } from "./main.ts";

Deno.test("getRandom() will return all integers", () => {
  const expected = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

  const actual = new Set();

  for (let i = 0; i < 1000; i++) {
    actual.add(getRandom(10));
  }
  assertEquals(actual, expected);
});

Deno.test("getRandom() will exclude integers", () => {
  const expected = new Set([2, 3, 4, 5, 6, 7, 8]);

  const actual = new Set();

  for (let i = 0; i < 1000; i++) {
    actual.add(getRandom(10, { exclusions: [1, 9, 0] }));
  }
  assertEquals(actual, expected);
});

Deno.test("getRandom() will return all chars", () => {
  const expected = new Set("hello".split(""));

  const actual = new Set();

  for (let i = 0; i < 1000; i++) {
    actual.add(getRandom("hello"));
  }
  assertEquals(actual, expected);
});

Deno.test("getRandom() will exclude chars", () => {
  const expected = new Set(["e", "l"]);

  const actual = new Set();

  for (let i = 0; i < 1000; i++) {
    actual.add(getRandom("hello", { exclusions: ["h", "o"] }));
  }
  assertEquals(actual, expected);
});

Deno.test("genChars password", () => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const symbols = "!@#$%^&*";
  const numbers = "0123456789";

  const pass = genChars(10, [
    { charSet: lowercase, min: 1 },
    { charSet: uppercase, min: 1 },
    { charSet: symbols, min: 1 },
    { charSet: numbers, min: 1 },
  ]);

  assertEquals(pass.length, 10);

  const passSet = new Set(pass);

  const lowerSet = new Set(lowercase);

  assert(passSet.intersection(lowerSet).size > 1);

  const upperSet = new Set(uppercase);

  assert(passSet.intersection(upperSet).size > 1);

  const symbolSet = new Set(symbols);

  assert(passSet.intersection(symbolSet).size > 1);

  const numberSet = new Set(numbers);

  assert(passSet.intersection(numberSet).size > 1);
});

Deno.test("genChars different mins", () => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const symbols = "!@#$%^&*";
  const numbers = "0123456789";

  const pass = genChars(10, [
    { charSet: lowercase, min: 1 },
    { charSet: uppercase, min: 2 },
    { charSet: symbols, min: 3 },
    { charSet: numbers, min: 4 },
  ]);

  assertEquals(pass.length, 10);

  const passSet = new Set(pass);

  const lowerSet = new Set(lowercase);

  assert(passSet.union(lowerSet).size > 1);

  const upperSet = new Set(uppercase);

  assert(passSet.union(upperSet).size > 2);

  const symbolSet = new Set(symbols);

  assert(passSet.union(symbolSet).size > 3);

  const numberSet = new Set(numbers);

  assert(passSet.union(numberSet).size > 4);
});

Deno.test("genChars maxes", () => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const symbols = "!@#$%^&*";
  const numbers = "0123456789";
  const pass = genChars(20, [
    { charSet: lowercase, min: 1 },
    { charSet: uppercase, min: 2, max: 2 },
    { charSet: symbols, min: 3, max: 3 },
    { charSet: numbers, min: 4, max: 4 },
  ]);

  assertEquals(pass.length, 20);

  const passSet = new Set(pass);

  const lowerSet = new Set(lowercase);

  assert(passSet.intersection(lowerSet).size >= 1);

  const upperSet = new Set(uppercase);

  console.log(upperSet, passSet.intersection(upperSet));

  assert(passSet.intersection(upperSet).size === 2);

  const symbolSet = new Set(symbols);

  console.log(symbolSet, passSet.intersection(symbolSet));

  assert(passSet.intersection(symbolSet).size === 3);

  const numberSet = new Set(numbers);

  console.log(numberSet, passSet.intersection(numberSet));

  assert(passSet.intersection(numberSet).size === 4);
});
