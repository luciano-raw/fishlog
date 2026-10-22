import test from "node:test";
import assert from "node:assert/strict";
import { parsePlaces, placeSearchUrl } from "../src/lib/placeSearch.ts";

test("place search encodes user text, limits results and allows searching beyond Chile", () => {
  const url = placeSearchUrl("  Río   Bueno & puente  ", true);
  assert.equal(url.searchParams.get("q"), "Río Bueno & puente");
  assert.equal(url.searchParams.get("countrycode"), "CL");
  assert.equal(url.searchParams.get("lang"), "default");
  assert.equal(url.searchParams.get("limit"), "6");
  assert.equal(placeSearchUrl("Valdivia", false).searchParams.has("countrycode"), false);
});

test("place coordinates and Photon extents convert correctly without losing zero", () => {
  const feature = { geometry: { type: "Point", coordinates: [0, 0] }, properties: { name: "Río", city: "Pueblo", state: "Región", country: "Chile", extent: [-1, 2, 3, -4] } };
  const [place] = parsePlaces({ features: [feature, feature] });
  assert.deepEqual(place.bounds, [-4, -1, 2, 3]);
  assert.equal(place.lat, 0);
  assert.equal(place.lng, 0);
  assert.equal(place.detail, "Pueblo, Región, Chile");
  assert.equal(parsePlaces({ features: [feature, feature] }).length, 1);
});

test("invalid results are ignored, empty responses work and malformed providers fail", () => {
  assert.deepEqual(parsePlaces({ features: [] }), []);
  assert.throws(() => parsePlaces({ error: "unavailable" }));
  assert.deepEqual(parsePlaces({ features: [null, { geometry: { type: "Point", coordinates: [200, 99] }, properties: { name: "Bad" } }, { geometry: { type: "Point", coordinates: ["0", 0] }, properties: { name: "Bad" } }] }), []);
});
