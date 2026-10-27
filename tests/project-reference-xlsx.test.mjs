import assert from "node:assert/strict";
import test from "node:test";
import { strFromU8, unzipSync } from "fflate";

import { createProjectReferenceWorkbook } from "../app/project-reference-xlsx.ts";

test("creates a formatted counted-project workbook with report column proportions", () => {
  const workbook = createProjectReferenceWorkbook(
    [
      {
        name: "Example residential project",
        scope: "Main building works",
        projectType: "Residential",
        client: "Example Client Sdn Bhd",
        location: "Johor",
        value: 12_345_678.9,
        completionDate: "19 May 2026",
        status: "Completed",
      },
    ],
    [
      "name",
      "scope",
      "projectType",
      "client",
      "location",
      "value",
      "completionDate",
    ],
    {
      columnWidths: {
        name: 75,
        scope: 18,
        projectType: 12,
        client: 12,
        location: 9,
        value: 13.5,
        completionDate: 10.5,
      },
    },
  );
  const files = unzipSync(workbook);
  const sheet = strFromU8(files["xl/worksheets/sheet1.xml"]);
  const styles = strFromU8(files["xl/styles.xml"]);

  for (const width of [75, 18, 12, 12, 9, 13.5, 10.5]) {
    assert.match(sheet, new RegExp(`width="${width}"`));
  }
  assert.match(sheet, /orientation="landscape" fitToWidth="1"/);
  assert.match(sheet, /ySplit="1"/);
  assert.match(sheet, /Example residential project/);
  assert.match(styles, /formatCode="RM #,##0\.00"/);
});
