import test from "node:test";
import assert from "node:assert/strict";
import { commentBody, pointType, recordId } from "../src/lib/communityInput.ts";

test("comments require real content and enforce the length limit", () => {
  assert.equal(commentBody("  El acceso cambió.  "), "El acceso cambió.");
  assert.equal(commentBody("a".repeat(1000)).length, 1000);
  for (const value of [null, 4, "", " \n ", "a".repeat(1001)]) assert.throws(() => commentBody(value));
});
test("only spots and hazards accept comments", () => {
  assert.equal(pointType("spot"), "spot");
  assert.equal(pointType("hazard"), "hazard");
  for (const type of ["catch", "shop", null, "../spot"]) assert.throws(() => pointType(type));
});
test("record IDs cannot inject paths or arbitrary query text", () => {
  assert.equal(recordId("abc_123-def"), "abc_123-def");
  for (const id of ["", "../path", "id?admin=true", "x".repeat(101), 4]) assert.throws(() => recordId(id));
});
