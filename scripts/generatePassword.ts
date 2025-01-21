import { genChars, Requirement } from "../main.ts";
import { parseArgs } from "@std/cli";

const args = parseArgs(Deno.args, {
  collect: ["set", "s", "min", "m", "max", "x"],
});

if (args.h || args.help) {
  console.log(
    "%cletters | numbers | level1 | level2 | level3",
    "font-weight: bold;",
    "- Preset options that can be expanded on. If no sets are added default will be level1.",
  );

  console.log(
    "%c--length -l",
    "font-weight: bold;",
    "- (Default 12) The length of the resulting string",
  );

  console.log(
    "%c--set -s.  ",
    "font-weight: bold;",
    "- Add sets of characters (example: --set abcd)",
  );

  console.log(
    "%c--min -m.  ",
    "font-weight: bold;",
    "- (Default: 1) The minimum characters chosen from the the corresponding set",
  );

  console.log(
    "%c--max -x.  ",
    "font-weight: bold;",
    "- The maximum characters chosen from the the corresponding set",
  );

  console.log("");

  console.log(
    "%cExample 1:",
    "font-weight: bold;",
    "-s 1234 -s abcd -m 2 -m 4 -l 6 could yield 3dd2ca",
  );

  console.log(
    "%cExample 2:",
    "font-weight: bold;",
    "numbers -s 9 will guarantee each result has a 9 (min 1 is default)",
  );

  Deno.exit();
}

const length = (args.l || args.length || 12) as number;

const sets = (args.s || args.set || []) as string[];

const mins = (args.m || args.min || []) as number[];

const maxs = (args.x || args.max || []) as number[];

let reqs: Requirement[] = [];

for (const [idx, s] of sets.entries()) {
  const min = mins[idx] || 1;

  const req: Requirement = {
    charSet: String(s),
    min,
    max: maxs[idx],
  };

  reqs.push(req);
}

const [variant] = args._;

if (variant === "level1") {
  reqs.push(
    { charSet: "abcdefghijklmnopqrstuvwxyz", min: 1 },
    { charSet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", min: 1 },
    { charSet: "!@#$%^&*()", min: 1 },
    { charSet: "0123456789", min: 1 },
  );
}

if (variant === "letters") {
  reqs.push(
    { charSet: "abcdefghijklmnopqrstuvwxyz", min: 1 },
    { charSet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", min: 1 },
  );
}

if (variant === "numbers") {
  reqs.push({ charSet: "0123456789", min: 1 });
}

if (variant === "level2") {
  reqs.push(
    { charSet: "abcdefghijklmnopqrstuvwxyz", min: 1 },
    { charSet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", min: 1 },
    { charSet: "`~!@#$%^&*()-=_+[]{}|;':\",./<>? ", min: 1 },
    { charSet: "0123456789", min: 1 },
  );
}

if (variant === "level3") {
  reqs.push(
    { charSet: "abcdefghijklmnopqrstuvwxyz", min: 1 },
    { charSet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", min: 1 },
    { charSet: "`~!@#$%^&*()-=_+[]{}|;':\",./<>? ", min: 1 },
    { charSet: "0123456789", min: 1 },
    { charSet: "¡¢£¤¥¦§¨©ª«¬­­®¯°±²³´µ¶·¸¹º»¼½¾¿", min: 1 },
    {
      charSet:
        "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ",
      min: 1,
    },
    {
      charSet:
        "ĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽžſƀƁƂƃƄƅƆƇƈƉƊƋƌƍƎƏƐƑƒƓƔƕƖƗƘƙƚƛƜƝƞƟƠơƢƣƤƥƦƧƨƩƪƫƬƭƮƯưƱƲƳƴƵƶƷƸƹƺƻƼƽƾƿǀǁǂǃǄǅǆǇǈǉǊǋǌǍǎǏǐǑǒǓǔǕǖǗǘǙǚǛǜǝǞǟǠǡǢǣǤǥǦǧǨǩǪǫǬǭǮǯǰǱǲǳǴǵǶǷǸǹǺǻǼǽǾǿ",
      min: 1,
    },
    {
      charSet:
        "ȀȁȂȃȄȅȆȇȈȉȊȋȌȍȎȏȐȑȒȓȔȕȖȗȘșȚțȜȝȞȟȠȡȢȣȤȥȦȧȨȩȪȫȬȭȮȯȰȱȲȳȴȵȶȷȸȹȺȻȼȽȾȿɀɁɂɃɄɅɆɇɈɉɊɋɌɍɎɏɐɑɒɓɔɕɖɗɘəɚɛɜɝɞɟɠɡɢɣɤɥɦɧɨɩɪɫɬɭɮɯɰɱɲɳɴɵɶɷɸɹɺɻɼɽɾɿʀʁʂʃʄʅʆʇʈʉʊʋʌʍʎʏʐʑʒʓʔʕʖʗʘʙʚʛʜʝʞʟʠʡʢʣʤʥʦʧʨʩʪʫʬʭʮʯʰʱʲʳʴʵʶʷʸʹʺʻʼʽʾʿˀˁ˂˃˄˅ˆˇˈˉˊˋˌˍˎˏːˑ˒˓˔˕˖˗˘˙˚˛˜˝˞˟ˠˡˢˣˤ˥˦˧˨˩˪˫ˬ˭ˮ˯˰˱˲˳˴˵˶˷˸˹˺˻˼˽˾˿",
      min: 1,
    },
  );
}

if (!reqs.length) {
  reqs = [
    { charSet: "abcdefghijklmnopqrstuvwxyz", min: 1 },
    { charSet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", min: 1 },
    { charSet: "!@#$%^&*()", min: 1 },
    { charSet: "0123456789", min: 1 },
  ];
}

for (let i = 0; i < 5; i++) {
  const password = genChars(length, reqs);

  console.log(`%c${password}`, "font-weight: bold; color: green;");
}
