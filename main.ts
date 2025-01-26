/**
 * A requirement genChars() must fulfill
 *
 * @property {string} charSet - A string of characters
 * @property {number|undefined} [min = 1] - The minimum instances one of the characters from the charSet may appear
 * @property {number|undefined} [max = undefined] - The maximum instances one of the characters from the charSet may appear
 */
export interface Requirement {
  charSet: string;
  min?: number;
  max?: number;
}

interface FilledRequirement extends Requirement {
  used: number;
}

/**
 * Generates a random string of characters with requirements defined based on character sets
 *
 * @param length The length of the desired character string
 * @param requirements An array of Requirement objects that determine a character set, as well as the maximum and minimum instances from that set
 * @returns A random character string
 * @example
 * genChars(8, [{charSet: 'abcd'}]) // 'bccbadda'
 * genChars(4, [{charSet: '01'}]) // '1101'
 * genChars(2, [{charSet: 'abc'}, {charSet: '123'}]) // '1b'
 * genChars(10, [{charSet: 'abc', max: 2}, {charSet: '123'}]) // '2123a212c3'
 * genChars(10, [{charSet: 'abc', min: 3}, {charSet: '123'}]) // '23b2c13aca'
 * genChars(10, [{ charSet: "abc", min: 2, max: 6 }, { charSet: "123" }]) // 'cbbb2ab312'
 * genChars(8, [{ charSet: "abc", min: 0 }, { charSet: "123", min: 8 }]) // '11333232'
 */
export function genChars(length: number, requirements: Requirement[]): string {
  const filledReqs = requirements as FilledRequirement[];

  let maxLength = 0;
  let minLength = 0;
  const result: string[] = [];
  for (let i = 0; i < filledReqs.length; i++) {
    const { max, min = 1, charSet } = filledReqs[i];

    if (min < 0) {
      throw new RangeError(
        `min for [${i}] (${charSet}) must be greater than 0, but received ${min}`,
      );
    }

    if (max && max < 0) {
      throw new RangeError(
        `max for [${i}] (${charSet}) must be greater than 0, but received ${max}`,
      );
    }

    if (max && min > max) {
      throw new RangeError(
        `min (${min}) is greater than max (${max}) for [${i}] (${charSet})`,
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
      `Argument length is ${length}, but requirements only allow a max length of ${maxLength}`,
    );
  }

  if (minLength > length) {
    throw new RangeError(
      `Argument length is ${length}, but requirements prescribe a min length of ${minLength}`,
    );
  }

  while (result.length < length) {
    const idx = getRandom(filledReqs.length);
    const { max, used, charSet } = filledReqs[idx];
    if (max && used >= max) {
      filledReqs.splice(idx, 1);
      continue;
    }
    filledReqs[idx].used++;
    result.push(getRandom(charSet));
  }

  // Fisher-Yates
  let currentIndex = result.length;

  while (currentIndex != 0) {
    const randomIndex = getRandom(currentIndex);
    currentIndex--;

    [result[currentIndex], result[randomIndex]] = [
      result[randomIndex],
      result[currentIndex],
    ];
  }

  return result.join("");
}

/**
 * Uses crypto.getRandomValues to derive a random number [0 - (input - 1)] or a random character from a string
 *
 * @param {number|string} input - The max number or a string character set
 * @returns {number|string} A random number or a single random character
 * @example
 * getRandom(2) // 0 | 1
 * getRandom(3) // 0 | 1 | 2
 * getRandom('abc') // 'a' | 'b' | 'c'
 */
export function getRandom<T extends number | string>(
  input: T,
): T extends number ? number : string {
  let output: undefined | number | string;
  const [randomVal] = crypto.getRandomValues(new Uint32Array(1));
  const num = randomVal / (0xffffffff + 1);
  if (typeof input === "number") {
    output = Math.floor(num * input);
  } else {
    output = input[Math.floor(num * input.length)];
  }
  return output as T extends number ? number : string;
}

const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numberStrings = "0123456789";
const simpleChars = "!@#$%^&*";
const specialChars = simpleChars + "()-=_+[]{}|;':\",./<>? ";
const diacritics1 =
  "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ";
const diacritics2 =
  "ĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽžſƀƁƂƃƄƅƆƇƈƉƊƋƌƍƎƏƐƑƒƓƔƕƖƗƘƙƚƛƜƝƞƟƠơƢƣƤƥƦƧƨƩƪƫƬƭƮƯưƱƲƳƴƵƶƷƸƹƺƻƼƽƾƿǀǁǂǃǄǅǆǇǈǉǊǋǌǍǎǏǐǑǒǓǔǕǖǗǘǙǚǛǜǝǞǟǠǡǢǣǤǥǦǧǨǩǪǫǬǭǮǯǰǱǲǳǴǵǶǷǸǹǺǻǼǽǾǿ";
const extended =
  "ȀȁȂȃȄȅȆȇȈȉȊȋȌȍȎȏȐȑȒȓȔȕȖȗȘșȚțȜȝȞȟȠȡȢȣȤȥȦȧȨȩȪȫȬȭȮȯȰȱȲȳȴȵȶȷȸȹȺȻȼȽȾȿɀɁɂɃɄɅɆɇɈɉɊɋɌɍɎɏɐɑɒɓɔɕɖɗɘəɚɛɜɝɞɟɠɡɢɣɤɥɦɧɨɩɪɫɬɭɮɯɰɱɲɳɴɵɶɷɸɹɺɻɼɽɾɿʀʁʂʃʄʅʆʇʈʉʊʋʌʍʎʏʐʑʒʓʔʕʖʗʘʙʚʛʜʝʞʟʠʡʢʣʤʥʦʧʨʩʪʫʬʭʮʯʰʱʲʳʴʵʶʷʸʹʺʻʼʽʾʿˀˁ˂˃˄˅ˆˇˈˉˊˋˌˍˎˏːˑ˒˓˔˕˖˗˘˙˚˛˜˝˞˟ˠˡˢˣˤ˥˦˧˨˩˪˫ˬ˭ˮ˯˰˱˲˳˴˵˶˷˸˹˺˻˼˽˾˿";

/**
 * Standard 26 letter lowercase and uppercase latin letters
 */
export const lettersCharSet: Requirement[] = [
  { charSet: lowercaseLetters },
  { charSet: uppercaseLetters },
];

/**
 * Digits 0-9 as strings
 */
export const numbersCharSet: Requirement[] = [{ charSet: numberStrings }];

/**
 * Upper and lowercase letters, with numbers, and symbols !@#$%^&*
 */
export const level1CharSet: Requirement[] = [
  { charSet: lowercaseLetters },
  { charSet: uppercaseLetters },
  { charSet: numberStrings },
  { charSet: simpleChars },
];

/**
 * Upper and lowercase letters, with numbers, and symbols !@#$%^&*()-=_+[]{}|;':\",./<>?
 */
export const level2CharSet: Requirement[] = [
  { charSet: lowercaseLetters },
  { charSet: uppercaseLetters },
  { charSet: numberStrings },
  { charSet: specialChars },
];

/**
 * A large character set including diacritics, special symbols and phonetic characters
 */
export const level3CharSet: Requirement[] = [
  { charSet: lowercaseLetters },
  { charSet: uppercaseLetters },
  { charSet: numberStrings },
  { charSet: specialChars },
  { charSet: diacritics1 },
  { charSet: diacritics2 },
  { charSet: extended },
];

/**
 * Calls genChars with predefined arguments. Length can be overwritten, requirements can be added.
 * Includes uppercase and lowercase letters
 *
 * @param {number} [length = 12] - Length of string. Default is 12.
 * @param {Requirement[]} additionalReqs - Additional requirements
 * @returns {string} A random character string
 * @example
 */
export function letters(
  length: number = 12,
  additionalReqs: Requirement[] = [],
): string {
  if (length === null) {
    length = 12;
  }

  return genChars(length, [...lettersCharSet, ...additionalReqs]);
}

/**
 * Calls genChars with predefined arguments. Length can be overwritten, requirements can be added.
 * Includes numbers
 *
 * @param {number} [length = 8] - Length of string. Default is 8.
 * @param {Requirement[]} additionalReqs - Additional requirements
 * @returns {string} A random character string
 */
export function numbers(
  length: number = 8,
  additionalReqs: Requirement[] = [],
): string {
  if (length === null) {
    length = 8;
  }

  const reqs = [{ charSet: "0123456789", min: 1 }];

  return genChars(length, [...reqs, ...additionalReqs]);
}

/**
 * Calls genChars with predefined arguments. Length can be overwritten, requirements can be added.
 * Includes uppercase and lowercase letters
 * Includes numbers
 * Includes special characters: !@#$%^&*
 *
 * @param {number} [length = 12] - Length of string. Default is 12.
 * @param {Requirement[]} additionalReqs - Additional requirements
 * @returns {string} A random character string
 */
export function level1(
  length: number = 12,
  additionalReqs: Requirement[] = [],
): string {
  if (length === null) {
    length = 12;
  }

  return genChars(length, [...level1CharSet, ...additionalReqs]);
}

/**
 * Calls genChars with predefined arguments. Length can be overwritten, requirements can be added.
 * Includes uppercase and lowercase letters
 * Includes numbers
 * Includes special characters: !@#$%^&*()-=_+[]{}|;':\",./<>?[SPACE]
 *
 * @param {number} [length = 12] - Length of string. Default is 12.
 * @param {Requirement[]} additionalReqs - Additional requirements
 * @returns {string} A random character string
 */
export function level2(
  length: number = 12,
  additionalReqs: Requirement[] = [],
): string {
  if (length === null) {
    length = 12;
  }

  return genChars(length, [...level2CharSet, ...additionalReqs]);
}

/**
 * Calls genChars with predefined arguments. Length can be overwritten, requirements can be added.
 * Includes everything from level2
 * Includes diacritics, more symbols and extended characters
 *
 * @param {number} [length = 16] - Length of string. Default is 16.
 * @param {Requirement[]} additionalReqs - Additional requirements
 * @returns {string} A random character string
 */
export function level3(
  length: number = 16,
  additionalReqs: Requirement[] = [],
): string {
  if (length === null) {
    length = 16;
  }

  return genChars(length, [...level3CharSet, ...additionalReqs]);
}
