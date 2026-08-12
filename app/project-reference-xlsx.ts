import { strToU8, zipSync } from "fflate";

export type ExcelProjectField =
  | "name"
  | "scope"
  | "projectType"
  | "developer"
  | "client"
  | "location"
  | "value"
  | "commencementDate"
  | "completionDate"
  | "status"
  | "progress";

export type ExcelProject = {
  name: string;
  scope: string;
  projectType?: string;
  developer?: string;
  client: string;
  location: string;
  value: number;
  commencementDate?: string;
  completionDate?: string;
  status: string;
  progress?: string;
};

const LABELS: Record<ExcelProjectField, string> = {
  name: "Project Name",
  scope: "Scope",
  projectType: "Building Type",
  developer: "Developer",
  client: "Client / Main Contractor",
  location: "Location",
  value: "Contract Value RM",
  commencementDate: "Commencement Date",
  completionDate: "Completion Date",
  status: "Status",
  progress: "Progress",
};

const WIDTHS: Record<ExcelProjectField, number> = {
  name: 55,
  scope: 27,
  projectType: 25,
  developer: 24,
  client: 28,
  location: 15,
  value: 19,
  commencementDate: 19,
  completionDate: 19,
  status: 14,
  progress: 12,
};

function xml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function columnName(index: number) {
  let value = index + 1;
  let result = "";
  while (value > 0) {
    value -= 1;
    result = String.fromCharCode(65 + (value % 26)) + result;
    value = Math.floor(value / 26);
  }
  return result;
}

function projectValue(project: ExcelProject, field: ExcelProjectField) {
  if (field === "projectType") return project.projectType ?? "";
  if (field === "developer") return project.developer ?? "";
  if (field === "commencementDate") return project.commencementDate ?? "";
  if (field === "completionDate") return project.completionDate ?? "";
  if (field === "progress") return project.progress ?? "";
  return project[field];
}

function cell(reference: string, value: unknown, style: number, numeric = false) {
  if (numeric) return `<c r="${reference}" s="${style}"><v>${Number(value) || 0}</v></c>`;
  return `<c r="${reference}" s="${style}" t="inlineStr"><is><t xml:space="preserve">${xml(value)}</t></is></c>`;
}

export function createProjectReferenceWorkbook(
  projects: ExcelProject[],
  requestedFields: ExcelProjectField[],
) {
  const fields = requestedFields.length
    ? requestedFields
    : (Object.keys(LABELS) as ExcelProjectField[]);
  const lastColumn = columnName(fields.length - 1);
  const rows = [
    `<row r="1" ht="30" customHeight="1">${fields
      .map((field, index) => cell(`${columnName(index)}1`, LABELS[field], 1))
      .join("")}</row>`,
    ...projects.map((project, rowIndex) => {
      const row = rowIndex + 2;
      const style = rowIndex % 2 === 0 ? 2 : 3;
      const cells = fields
        .map((field, index) =>
          cell(
            `${columnName(index)}${row}`,
            projectValue(project, field),
            field === "value" ? style + 2 : style,
            field === "value",
          ),
        )
        .join("");
      return `<row r="${row}" ht="54" customHeight="1">${cells}</row>`;
    }),
  ].join("");
  const columns = fields
    .map(
      (field, index) =>
        `<col min="${index + 1}" max="${index + 1}" width="${WIDTHS[field]}" customWidth="1"/>`,
    )
    .join("");
  const tableColumns = fields
    .map(
      (field, index) =>
        `<tableColumn id="${index + 1}" name="${xml(LABELS[field])}"/>`,
    )
    .join("");
  const lastRow = Math.max(1, projects.length + 1);

  const files: Record<string, Uint8Array> = {
    "[Content_Types].xml": strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/xl/tables/table1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml"/></Types>`),
    "_rels/.rels": strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`),
    "xl/workbook.xml": strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Contractor Projects" sheetId="1" r:id="rId1"/></sheets></workbook>`),
    "xl/_rels/workbook.xml.rels": strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`),
    "xl/styles.xml": strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="10"/><name val="Arial"/><color rgb="FF24364B"/></font><font><b/><sz val="10"/><name val="Arial"/><color rgb="FFFFFFFF"/></font></fonts><fills count="4"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFC00000"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF3F7F9"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="2"><border/><border><left style="thin"><color rgb="FFD9E2E7"/></left><right style="thin"><color rgb="FFD9E2E7"/></right><top style="thin"><color rgb="FFD9E2E7"/></top><bottom style="thin"><color rgb="FFD9E2E7"/></bottom></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="6"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf><xf numFmtId="0" fontId="0" fillId="3" borderId="1" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf><xf numFmtId="164" fontId="0" fillId="3" borderId="1" xfId="0" applyNumberFormat="1" applyAlignment="1"><alignment horizontal="right" vertical="top"/></xf><xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyAlignment="1"><alignment horizontal="right" vertical="top"/></xf></cellXfs><numFmts count="1"><numFmt numFmtId="164" formatCode="RM #,##0.00"/></numFmts><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`),
    "xl/worksheets/sheet1.xml": strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheetViews><sheetView workbookViewId="0" showGridLines="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><sheetFormatPr defaultRowHeight="15"/><cols>${columns}</cols><sheetData>${rows}</sheetData><autoFilter ref="A1:${lastColumn}${lastRow}"/><pageMargins left="0.25" right="0.25" top="0.5" bottom="0.5" header="0.2" footer="0.2"/><pageSetup orientation="landscape" fitToWidth="1" fitToHeight="0"/><tableParts count="1"><tablePart r:id="rId1"/></tableParts></worksheet>`),
    "xl/worksheets/_rels/sheet1.xml.rels": strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/table" Target="../tables/table1.xml"/></Relationships>`),
    "xl/tables/table1.xml": strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><table xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" id="1" name="ContractorProjects" displayName="ContractorProjects" ref="A1:${lastColumn}${lastRow}" totalsRowShown="0"><autoFilter ref="A1:${lastColumn}${lastRow}"/><tableColumns count="${fields.length}">${tableColumns}</tableColumns><tableStyleInfo name="TableStyleMedium2" showFirstColumn="0" showLastColumn="0" showRowStripes="1" showColumnStripes="0"/></table>`),
  };
  return zipSync(files, { level: 6 });
}
