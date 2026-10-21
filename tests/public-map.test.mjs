import test from "node:test";
import assert from "node:assert/strict";
import { publicCatchFields, publicSpotFields, publicHazardFields, publicShopFields } from "../src/lib/publicMapFields.ts";

test("public map exposes display names without account details or permissions", () => {
  for (const select of [publicCatchFields, publicSpotFields, publicHazardFields]) {
    assert.deepEqual(select.user, { select: { username: true } });
    for (const field of ["userId", "email", "role", "pushSubscriptions", "friendsAdded", "friendsOf"]) assert.equal(field in select, false);
  }
  assert.equal("createdById" in publicShopFields, false);
  assert.equal("createdBy" in publicShopFields, false);
});

test("public map keeps the fields needed for all four pin types and capture details", () => {
  for (const select of [publicCatchFields, publicSpotFields, publicHazardFields, publicShopFields]) {
    for (const field of ["id", "locationLat", "locationLng"]) assert.equal(select[field], true);
  }
  for (const field of ["species", "weight", "length", "lureType", "imageUrl"]) assert.equal(publicCatchFields[field], true);
  assert.equal(publicSpotFields.speciesSeen, true);
  assert.equal(publicHazardFields.note, true);
  assert.equal(publicShopFields.website, true);
});
