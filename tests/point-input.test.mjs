import test from "node:test";
import assert from "node:assert/strict";
import { parsePointInput, pointText, pointPhotoFile } from "../src/lib/pointInput.ts";

const form = (lat = "0", lng = "0", name = "  Poza  ") => {
  const data = new FormData(); data.set("name", name); data.set("lat", lat); data.set("lng", lng); return data;
};
test("point coordinates accept zero and reject missing, partial or out-of-range numbers", () => {
  assert.deepEqual(parsePointInput(form()), { name: "Poza", lat: 0, lng: 0 });
  for (const [lat, lng] of [["", "1"], ["3foo", "1"], ["Infinity", "0"], ["91", "0"], ["0", "-181"]]) assert.throws(() => parsePointInput(form(lat, lng)));
  assert.throws(() => parsePointInput(form("1", "2", "  ")));
  assert.equal(pointText("  Trucha  "), "Trucha");
  assert.throws(() => pointText("x".repeat(1001)));
});
test("photos are optional; oversized and unsupported uploads are rejected before storage", () => {
  assert.equal(pointPhotoFile(null, 750000), null);
  assert.equal(pointPhotoFile(new File([], ""), 750000), null);
  const photo = new File(["photo"], "photo.jpg", { type: "image/jpeg" });
  assert.equal(pointPhotoFile(photo, 750000), photo);
  assert.throws(() => pointPhotoFile(new File(["image"], "photo.svg", { type: "image/svg+xml" }), 750000));
  assert.throws(() => pointPhotoFile(new File([new Uint8Array(750001)], "large.jpg", { type: "image/jpeg" }), 750000));
});
