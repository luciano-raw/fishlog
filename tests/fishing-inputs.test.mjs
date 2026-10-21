import test from "node:test";
import assert from "node:assert/strict";
import { LURE_TYPES, lureLabel, parseLureType } from "../src/lib/lures.ts";
import { parseShopInput } from "../src/lib/shopInput.ts";

test("lure selection is optional and accepts only supported categories", () => {
  assert.equal(parseLureType(null), null);
  assert.equal(parseLureType(""), null);
  for (const option of LURE_TYPES) {
    assert.equal(parseLureType(option.value), option.value);
    assert.equal(lureLabel(option.value), option.label);
  }
  assert.throws(() => parseLureType("custom-untrusted-value"));
  assert.equal(lureLabel(null), null);
});

function shopForm() {
  const form = new FormData();
  form.set("name", "Tienda de prueba");
  form.set("lat", "-33.4");
  form.set("lng", "-70.6");
  return form;
}

test("shop input rejects missing or invalid coordinates and unsafe links", () => {
  for (const [key, value] of [["lat", ""], ["lat", "91"], ["lng", "-181"], ["lat", "NaN"], ["website", "javascript:alert(1)"], ["website", "https://user:password@example.com"], ["name", ""]]) {
    const form = shopForm();
    form.set(key, value);
    assert.throws(() => parseShopInput(form));
  }
});

test("shop input preserves zero coordinates, validates optional fields and ignores forged permissions", () => {
  const form = shopForm();
  form.set("lat", "0"); form.set("lng", "0");
  form.set("website", "https://example.com");
  form.set("role", "ADMIN"); form.set("createdById", "someone-else");
  const data = parseShopInput(form);
  assert.equal(data.locationLat, 0);
  assert.equal(data.locationLng, 0);
  assert.equal(data.description, null);
  assert.equal(data.website, "https://example.com");
  assert.equal("role" in data, false);
  assert.equal("createdById" in data, false);
});
