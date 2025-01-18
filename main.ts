export function getRandom<T extends number | string>(
  input: T,
  options: { exclusions?: (string | number | undefined)[] } = {}
): T extends number ? number : string {
  let output: undefined | number | string;
  const [randomVal] = crypto.getRandomValues(new Uint32Array(1));
  if (typeof input === "number") {
    output = Math.floor((randomVal / (0xffffffff + 1)) * input);
  } else {
    output = input[Math.floor((randomVal / (0xffffffff + 1)) * input.length)];
  }

  if (options.exclusions && options.exclusions.indexOf(output) !== -1) {
    return getRandom(input, options);
  } else {
    return output as T extends number ? number : string;
  }
}

interface Requirement {
  charSet: string;
  min: number;
  max?: number;
}

interface FilledRequirement extends Requirement {
  used: number;
}

export function genChars(length: number, requirements: Requirement[]) {
  const filledReqs = requirements as FilledRequirement[];

  let maxLength = 0;
  let minLength = 0;
  const result: string[] = [];
  for (let i = 0; i < filledReqs.length; i++) {
    const { max, min, charSet } = filledReqs[i];

    if (min < 0) {
      throw new RangeError(
        `min for [${i}] (${charSet}) must be greater than 0, but received ${min}`
      );
    }

    if (max && max < 0) {
      throw new RangeError(
        `max for [${i}] (${charSet}) must be greater than 0, but received ${max}`
      );
    }

    if (max && min > max) {
      throw new RangeError(
        `min (${min}) is greater than max (${max}) for [${i}] (${charSet})`
      );
    }

    filledReqs[i].used = 0;

    maxLength = max ? maxLength + max : 255;
    minLength += min;

    for (let j = 0; j < min; j++) {
      result.push(getRandom(charSet));
      filledReqs[i].used++;
    }
  }

  if (maxLength < length) {
    throw new RangeError(
      `Argument length is ${length}, but requirements only allow a max length of ${maxLength}`
    );
  }

  if (minLength > length) {
    throw new RangeError(
      `Argument length is ${length}, but requirements prescribe a min length of ${minLength}`
    );
  }

  while (result.length < length) {
    const idx = getRandom(filledReqs.length);
    const { max, used, charSet } = filledReqs[idx];
    if (max && max >= used) {
      filledReqs.splice(idx, 1);
      continue;
    }
    filledReqs[idx].used++;
    result.push(getRandom(charSet));
  }

  // Fisher-Yates
  let currentIndex = result.length;

  while (currentIndex != 0) {
    const [randomVal] = crypto.getRandomValues(new Uint32Array(1));

    const randomIndex = Math.floor(
      (randomVal / (0xffffffff + 1)) * currentIndex
    );
    currentIndex--;

    [result[currentIndex], result[randomIndex]] = [
      result[randomIndex],
      result[currentIndex],
    ];
  }

  return result.join("");
}

// if (import.meta.main) {
//   for (let i = 0; i < 5; i++) {
//     const lowercase = "abcdefghijklmnopqrstuvwxyz";
//     const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//     const symbols = "!@#$%^&*";
//     const numbers = "0123456789";
//     const password = genChars(8, [
//       { charSet: lowercase, min: 1 },
//       { charSet: uppercase, min: 1 },
//       { charSet: symbols, min: 1 },
//       { charSet: numbers, min: 1 },
//     ]);

//     console.log(`%c${password}`, "font-weight: bold; color: limegreen;");
//   }
// }
