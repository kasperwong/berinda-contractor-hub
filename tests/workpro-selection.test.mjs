import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
const route = await readFile(new URL("../app/api/workpro-contractors/route.ts", import.meta.url), "utf8");

test("BPM directory endpoint validates origin, Firebase token, and approved profile", () => {
  assert.match(route, /https:\/\/berinda-project-management\.web\.app/);
  assert.match(route, /verifyIdToken\(idToken\)/);
  assert.match(route, /approvedWorkProProfile\(idToken, email\)/);
  assert.match(route, /stringValue\?\.toLowerCase\(\) === "approved"/);
  assert.match(route, /BPM authentication required/);
  assert.match(route, /Origin not allowed/);
});

test("BPM directory endpoint returns only the bounded checklist contractor fields", () => {
  assert.match(route, /doc\("appState\/berinda-group"\)/);
  for (const field of ["id", "name", "trade", "grade", "location", "score", "status", "preqDate"]) {
    assert.match(route, new RegExp(`${field}:`));
  }
  const projection = route.match(/\.map\(\(contractor:[\s\S]+?\n\s*\}\)\)\n\s*\.filter/)?.[0] ?? "";
  assert.ok(projection);
  assert.doesNotMatch(projection, /contactName:|mobile:|email:|projects:|recommendedMaxProjectValue:/);
  assert.match(route, /private, no-store/);
});

test("normal Contractor Hub pages remain behind their existing auth gate", () => {
  assert.match(page, /<AuthGate>/);
  assert.match(page, /<ContractorHubApp \/>/);
});

test("accepts only the WorkPro selection request and return origin", () => {
  assert.match(page, /selectFor"\) === "workpro-checklist"/);
  assert.match(page, /returnOrigin === WORKPRO_ORIGIN/);
  assert.match(page, /https:\/\/berinda-project-management\.web\.app/);
});

test("returns a bounded contractor snapshot to the opening WorkPro page", () => {
  assert.match(page, /type: "berinda\.contractor\.selected"/);
  assert.match(page, /window\.opener\.postMessage\(message, selectionRequest\.returnOrigin\)/);
  assert.match(page, /id: contractor\.id/);
  assert.match(page, /preqDate: contractor\.preqDate/);
  assert.doesNotMatch(page, /message[\s\S]{0,500}(mobileNumber|generalEmail|taxNumber)/);
});

test("supports direct contractor profiles and a visible WorkPro selection action", () => {
  assert.match(page, /\.get\(\s*"contractor"/);
  assert.match(page, /Use in WorkPro/);
  assert.match(css, /\.contractor-selection-banner/);
  assert.match(css, /\.contractor-use-button/);
});
