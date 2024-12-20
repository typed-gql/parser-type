export type ParseTypeSystem<S extends string> =
  ExpectTypeSystemDefinitionOrExtensionList<S> extends [
    infer A,
    infer B extends string
  ]
    ? TrimStart<B> extends ""
      ? A
      : never
    : never;

type Ignored = " " | "\t" | "\n" | ",";

type TrimStart<S extends string> = S extends `${Ignored}${infer I}`
  ? TrimStart<I>
  : S extends `#${string}\n${infer I}`
  ? TrimStart<I>
  : S;

type ExpectString<S extends string> = TrimStart<S> extends `"""${infer I}`
  ? ExpectStringBlockInternal<I, "">
  : TrimStart<S> extends `"${infer I}`
  ? ExpectStringInternal<I, "">
  : never;

type ExpectStringBlockInternal<
  S extends string,
  R extends string
> = S extends `${infer A}"""${infer B}`
  ? A extends `${infer C}\\`
    ? ExpectStringBlockInternal<B, `${R}${C}"""`>
    : [PostProcessBlockString<`${R}${A}`>, B]
  : never;

type PostProcessBlockString<S extends string> =
  /* // TODO: https://spec.graphql.org/October2021/#BlockStringValue() */ S;

type ExpectStringInternal<
  S extends string,
  R extends string
> = S extends `${infer A}"${infer B}`
  ? A extends `${string}\\`
    ? ExpectStringInternal<B, `${R}${A}\\"`>
    : A extends `${string}\n${string}`
    ? never
    : [Unescape<`${R}${A}`>, B]
  : never;

type Unescape<S extends string> = UnescapeInternal<S, "">;

type UnescapeMap = {
  '"': '"';
  "\\": "\\";
  "/": "/";
  b: "\b";
  f: "\f";
  n: "\n";
  r: "\r";
  t: "\t";
};

type UnescapeInternal<
  S extends string,
  R extends string
> = S extends `${infer A}\\${infer B}`
  ? B extends `${infer C extends keyof UnescapeMap}${infer D}`
    ? UnescapeInternal<D, `${R}${A}${UnescapeMap[C]}`>
    : B extends `u${infer C}`
    ? UnescapeInternal<C, `${R}${A}\\u`>
    : never
  : `${R}${S}`;

type NameStart = Letter | "_";
type NameContinue = Letter | Digit | "_";
type Letter =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z"
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z";
type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

type ExpectName<S extends string> =
  TrimStart<S> extends `${infer A extends NameStart}${infer B}`
    ? ExpectNameInternal<B, A>
    : never;

type ExpectNameInternal<
  S extends string,
  R extends string
> = S extends `${infer A extends NameContinue}${infer B}`
  ? ExpectNameInternal<B, `${R}${A}`>
  : [R, S];
