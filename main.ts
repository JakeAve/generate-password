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
  let result = "";
  for (let i = 0; i < filledReqs.length; i++) {
    console.log({ i, len: filledReqs.length });
    const { max, min, charSet } = filledReqs[i];
    filledReqs[i].used = 0;

    maxLength = max ? maxLength + max : 255;
    minLength += min;

    for (let j = 0; j < min; j++) {
      result += getRandom(charSet);
      filledReqs[i].used++;
      console.log("omw", filledReqs[i], result);
    }
  }

  if (maxLength < length) {
    throw new Error(
      `charLength is ${length}, but requirements only allow a max charLength of ${maxLength}`
    );
  }

  if (minLength > length) {
    throw new Error(
      `charLength is ${length}, but requirements prescribe a minimum of ${minLength}`
    );
  }

  while (result.length < length) {
    const idx = getRandom(filledReqs.length);
    const { max, used, charSet } = filledReqs[idx];
    if (max && max >= used) {
      console.log(max, used);
      filledReqs.splice(idx, 1);
      continue;
    }
    console.log({ result });
    filledReqs[idx].used++;
    result += getRandom(charSet);
  }

  const pswd = result.split("").sort(() => {
    const [val] = crypto.getRandomValues(new Uint8Array(1));
    if (val > 127) return 1;
    else return -1;
  });

  return pswd.join("");
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
// if (import.meta.main) {
//   console.log("Add 2 + 3 =", add(2, 3));
// }
