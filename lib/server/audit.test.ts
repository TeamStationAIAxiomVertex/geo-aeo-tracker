import { test } from "node:test";
import assert from "node:assert/strict";
import { collectSchemaTypes } from "./audit";

test("schema: top-level @type is read", () => {
  const html = `<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization"}</script>`;
  assert.deepEqual(collectSchemaTypes(html), ["Organization"]);
});

test("schema: types inside @graph are read (the homepage shape)", () => {
  const html = `<script id="route-static-schema" type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"Organization"},{"@type":"WebSite"},{"@type":"FAQPage","mainEntity":[{"@type":"Question"}]}]}</script>`;
  const types = collectSchemaTypes(html);
  assert.ok(types.includes("Organization"));
  assert.ok(types.includes("FAQPage"));
  assert.ok(types.includes("Question"));
});

test("schema: array of @type values is read", () => {
  const html = `<script type="application/ld+json">{"@type":["Article","NewsArticle"]}</script>`;
  assert.deepEqual(collectSchemaTypes(html), ["Article", "NewsArticle"]);
});

test("schema: invalid JSON yields no types and does not throw", () => {
  const html = `<script type="application/ld+json">{not json</script>`;
  assert.deepEqual(collectSchemaTypes(html), []);
});

test("schema: no JSON-LD yields no types", () => {
  assert.deepEqual(collectSchemaTypes("<html><body>hi</body></html>"), []);
});
