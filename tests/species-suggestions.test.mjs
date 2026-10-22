import test from "node:test";
import assert from "node:assert/strict";
import { encyclopediaData } from "../src/lib/encyclopediaData.ts";
import { suggestSpecies } from "../src/lib/speciesSuggestions.ts";

test("species suggestions use the encyclopedia's exact names and tolerate accents and case", () => {
  const [rainbow] = suggestSpecies(encyclopediaData, "  ARCOIRIS  ");
  assert.equal(rainbow.id, "trucha_arcoiris");
  assert.equal(rainbow.name, "Trucha arcoíris");
  assert.ok(suggestSpecies(encyclopediaData, "salmon").every(option => encyclopediaData.includes(option)));
  assert.equal(suggestSpecies(encyclopediaData, "coho")[0].name, "Salmón coho / plateado");
});

test("partial, scientific and multiword queries work without forcing unknown names", () => {
  assert.ok(suggestSpecies(encyclopediaData, "truc").some(option => option.id === "trucha_arcoiris"));
  assert.equal(suggestSpecies(encyclopediaData, "mykiss")[0].id, "trucha_arcoiris");
  assert.equal(suggestSpecies(encyclopediaData, "arco trucha")[0].id, "trucha_arcoiris");
  assert.deepEqual(suggestSpecies(encyclopediaData, "mi especie nueva"), []);
  assert.deepEqual(suggestSpecies(encyclopediaData, "   "), []);
});

test("exact and prefix names rank first and the list stays short", () => {
  const options = [
    { id: "1", name: "Perca trucha", scientificName: "A" },
    { id: "2", name: "Trucha arcoíris", scientificName: "B" },
    { id: "3", name: "Trucha", scientificName: "C" },
  ];
  assert.deepEqual(suggestSpecies(options, "trucha").map(option => option.id), ["3", "2", "1"]);
  assert.equal(suggestSpecies(options, "trucha", 2).length, 2);
});
