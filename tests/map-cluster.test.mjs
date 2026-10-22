import test from "node:test";
import assert from "node:assert/strict";
import { clusterAppearance, clusterHtml } from "../src/lib/mapCluster.ts";

test("single-type clusters use the matching pin color", () => {
  for (const [type, color] of [["catch", "#a4ff3d"], ["spot", "#3b82f6"], ["hazard", "#ef4444"], ["shop", "#fcd34d"]]) {
    const result = clusterAppearance([type, type]);
    assert.equal(result.background, color);
    assert.equal(result.total, 2);
    assert.equal(result.mixed, false);
    assert.equal(result.warning, false);
  }
});

test("mixed clusters retain every category in proportion and flag any hazard", () => {
  const result = clusterAppearance(["catch", "spot", "spot", "hazard"]);
  assert.equal(result.total, 4);
  assert.equal(result.mixed, true);
  assert.equal(result.warning, true);
  assert.equal(result.background, "conic-gradient(#a4ff3d 0.000% 25.000%, #3b82f6 25.000% 75.000%, #ef4444 75.000% 100.000%)");
  assert.match(result.label, /2 spots/);
  assert.equal(clusterAppearance(["shop", "spot"]).warning, false);
  assert.match(clusterHtml(["shop", "hazard"]), /fishlog-cluster-warning/);
  assert.doesNotMatch(clusterHtml(["catch", "spot"]), /fishlog-cluster-warning/);
});
