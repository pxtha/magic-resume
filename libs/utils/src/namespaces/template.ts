export const templatesList = [
  "cmc1",
  // "azurill",
  // "bronzor",
  // "chikorita",
  // "ditto",
  // "gengar",
  // "glalie",
  // "kakuna",
  // "leafish",
  // "nosepass",
  // "onyx",
  // "pikachu",
  "rhyhorn",
] as const;

export type Template = (typeof templatesList)[number];
