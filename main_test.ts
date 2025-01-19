import { assert, assertEquals, assertThrows } from "@std/assert";
import { genChars, getRandom } from "./main.ts";

Deno.test("getRandom() will return all integers", () => {
  const expected = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

  const actual = new Set();

  for (let i = 0; i < 1000; i++) {
    actual.add(getRandom(10));
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

  assert(passSet.intersection(lowerSet).size >= 1);

  const upperSet = new Set(uppercase);

  assert(passSet.intersection(upperSet).size >= 1);

  const symbolSet = new Set(symbols);

  assert(passSet.intersection(symbolSet).size >= 1);

  const numberSet = new Set(numbers);

  assert(passSet.intersection(numberSet).size >= 1);
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

  const lowerExp = new RegExp(`[${lowercase}]`, "g");

  assert(pass.match(lowerExp)?.length || 0 > 1);

  const upperExp = new RegExp(`[${uppercase}]`, "g");

  assert(pass.match(upperExp)?.length || 0 > 2);

  const symbolExp = new RegExp(`[\!\@\#\$\%\^\&\*]`, "g");

  assert(pass.match(symbolExp)?.length || 0 > 3);

  const numberExp = new RegExp(`[${numbers}]`, "g");

  assert(pass.match(numberExp)?.length || 0 > 4);
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

  const lowerExp = new RegExp(`[${lowercase}]`, "g");

  assert(pass.match(lowerExp)?.length || 0 > 1);

  const upperExp = new RegExp(`[${uppercase}]`, "g");

  assert(pass.match(upperExp)?.length === 2);

  const symbolExp = new RegExp(`[\!\@\#\$\%\^\&\*]`, "g");

  assert(pass.match(symbolExp)?.length === 3);

  const numberExp = new RegExp(`[${numbers}]`, "g");

  assert(pass.match(numberExp)?.length === 4);
});

Deno.test("genChars will throw error for too low maxes", () => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const symbols = "!@#$%^&*";
  const numbers = "0123456789";

  assertThrows(
    () =>
      genChars(5, [
        { charSet: lowercase, min: 1, max: 1 },
        { charSet: uppercase, min: 1, max: 1 },
        { charSet: symbols, min: 1, max: 1 },
        { charSet: numbers, min: 1, max: 1 },
      ]),
    RangeError,
    "Argument length is 5, but requirements only allow a max length of 4",
  );
});

Deno.test("genChars will throw error for too high mins", () => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const symbols = "!@#$%^&*";
  const numbers = "0123456789";

  assertThrows(
    () =>
      genChars(5, [
        { charSet: lowercase, min: 5 },
        { charSet: uppercase, min: 5 },
        { charSet: symbols, min: 5 },
        { charSet: numbers, min: 5 },
      ]),
    RangeError,
    "Argument length is 5, but requirements prescribe a min length of 20",
  );
});

Deno.test("genChars will throw error for a min < 0", () => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const symbols = "!@#$%^&*";
  const numbers = "0123456789";

  assertThrows(
    () =>
      genChars(10, [
        { charSet: lowercase, min: 1 },
        { charSet: uppercase, min: 1 },
        { charSet: symbols, min: -1 },
        { charSet: numbers, min: 1 },
      ]),
    RangeError,
    "min for [2] (!@#$%^&*) must be greater than 0, but received -1",
  );
});

Deno.test("genChars will throw error for a max < 0", () => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const symbols = "!@#$%^&*";
  const numbers = "0123456789";

  assertThrows(
    () =>
      genChars(10, [
        { charSet: lowercase, min: 1 },
        { charSet: uppercase, min: 1 },
        { charSet: symbols, min: 1 },
        { charSet: numbers, min: 1, max: -2 },
      ]),
    RangeError,
    "max for [3] (0123456789) must be greater than 0, but received -2",
  );
});

Deno.test("genChars will throw error when min > max", () => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const symbols = "!@#$%^&*";
  const numbers = "0123456789";

  assertThrows(
    () =>
      genChars(10, [
        { charSet: lowercase, min: 1 },
        { charSet: uppercase, min: 3, max: 1 },
        { charSet: symbols, min: 1 },
        { charSet: numbers, min: 1, max: 3 },
      ]),
    RangeError,
    "min (3) is greater than max (1) for [1] (ABCDEFGHIJKLMNOPQRSTUVWXYZ)",
  );
});
