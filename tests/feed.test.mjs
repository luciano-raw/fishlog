import test from "node:test";
import assert from "node:assert/strict";
import { hasCoordinates, mapPointHref } from "../src/lib/mapLinks.ts";
import { mergeFriendActivity } from "../src/lib/activityFeed.ts";

test("map links identify all three record types and preserve the Friends origin", () => {
  for (const type of ["catch", "spot", "hazard", "shop"]) {
    const url = new URL(mapPointHref(type, "id with / symbols", true), "https://fishlog.test");
    assert.equal(url.pathname, "/map");
    assert.equal(url.searchParams.get(`${type}Id`), "id with / symbols");
    assert.equal(url.searchParams.get("from"), "friends");
  }
  assert.equal(mapPointHref("catch", "abc"), "/map?catchId=abc");
});

test("zero coordinates are valid; missing, non-finite and out-of-range coordinates are rejected", () => {
  assert.equal(hasCoordinates({ locationLat: 0, locationLng: 0 }), true);
  for (const [lat, lng] of [[null, 1], [1, null], [NaN, 1], [1, Infinity], [91, 1], [1, -181]]) {
    assert.equal(hasCoordinates({ locationLat: lat, locationLng: lng }), false);
  }
});

test("friend activity merges all record types chronologically and preserves details", () => {
  const base = { locationLat: -33, locationLng: -70, user: { username: "Joaquín" } };
  const activities = mergeFriendActivity(
    [{ ...base, id: "catch", createdAt: new Date("2026-10-20T14:00:00Z"), species: "Salmón", weight: 2, length: null, imageUrl: "photo.jpg" }],
    [{ ...base, id: "spot", createdAt: new Date("2026-10-20T16:00:00Z"), name: "La poza", speciesSeen: "Trucha", imageUrl: null }],
    [{ ...base, id: "hazard", createdAt: new Date("2026-10-20T15:00:00Z"), name: "Rocas", note: "Precaución" }],
  );
  assert.deepEqual(activities.map(a => a.type), ["spot", "hazard", "catch"]);
  assert.equal(activities[0].detail, "Especies observadas: Trucha");
  assert.equal(activities[1].detail, "Precaución");
  assert.equal(activities[2].detail, "2 kg");
  assert.equal(activities[2].imageUrl, "photo.jpg");
  assert.equal(activities[2].username, "Joaquín");
});

test("empty activity and captures without location or measurements are supported", () => {
  assert.deepEqual(mergeFriendActivity([], [], []), []);
  const [activity] = mergeFriendActivity([{ id: "c", createdAt: new Date(), user: { username: null }, species: "Trucha", weight: null, length: null, imageUrl: null, locationLat: null, locationLng: null }], [], []);
  assert.equal(activity.detail, null);
  assert.equal(hasCoordinates(activity), false);
});

test("point activity retains both full photos and chosen thumbnails, including optional hazard photos", () => {
  const base = { createdAt: new Date(), locationLat: 0, locationLng: 0, user: { username: "Test" }, imageUrl: "full.jpg", thumbnailUrl: "preview.jpg" };
  const activities = mergeFriendActivity([], [{ ...base, id: "spot", name: "Poza", speciesSeen: null }], [{ ...base, id: "hazard", name: "Rocas", note: null }]);
  for (const activity of activities) {
    assert.equal(activity.imageUrl, "full.jpg");
    assert.equal(activity.thumbnailUrl, "preview.jpg");
  }
});
