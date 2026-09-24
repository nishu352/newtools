import { test } from 'node:test';
import assert from 'node:assert';
import {
  parseDelimitedText,
  stringifyDelimitedText,
  createXlsx,
  parseXlsx,
  rowsToJson,
  jsonToRows,
  transposeRows,
  removeDuplicateRows,
  filterRows,
  sortRows,
  calculateColumnStats,
  rowsToHtmlTable,
} from '../spreadsheet/spreadsheet-engine';

test('Spreadsheet Engine - parseDelimitedText and stringifyDelimitedText', () => {
  const csv = 'Name,Age,City\r\nAlice,30,"New York, NY"\r\nBob,25,London';
  const rows = parseDelimitedText(csv, ',');
  assert.strictEqual(rows.length, 3);
  assert.strictEqual(rows[1][2], 'New York, NY');

  const back = stringifyDelimitedText(rows, ',');
  assert.ok(back.includes('"New York, NY"'));
});

test('Spreadsheet Engine - createXlsx and parseXlsx roundtrip', async () => {
  const sampleRows = [
    ['Product', 'Price', 'Stock'],
    ['Keyboard', '49.99', '120'],
    ['Mouse', '29.99', '250'],
  ];

  const xlsxBuffer = await createXlsx(sampleRows, 'Inventory');
  assert.ok(xlsxBuffer.length > 0);

  const parsed = await parseXlsx(xlsxBuffer);
  assert.ok(parsed.sheetNames.includes('Inventory'));
  const sheetRows = parsed.sheets['Inventory'];
  assert.strictEqual(sheetRows.length, 3);
  assert.strictEqual(sheetRows[0][0], 'Product');
  assert.strictEqual(sheetRows[1][1], '49.99');
});

test('Spreadsheet Engine - rowsToJson and jsonToRows', () => {
  const rows = [
    ['ID', 'Name'],
    ['1', 'Alice'],
    ['2', 'Bob'],
  ];
  const jsonStr = rowsToJson(rows, true);
  const parsed = JSON.parse(jsonStr);
  assert.strictEqual(parsed.length, 2);
  assert.strictEqual(parsed[0].Name, 'Alice');

  const backToRows = jsonToRows(jsonStr);
  assert.strictEqual(backToRows.length, 3);
  assert.strictEqual(backToRows[1][1], 'Alice');
});

test('Spreadsheet Engine - transposeRows', () => {
  const rows = [
    ['A', 'B'],
    ['1', '2'],
  ];
  const transposed = transposeRows(rows);
  assert.deepStrictEqual(transposed, [
    ['A', '1'],
    ['B', '2'],
  ]);
});

test('Spreadsheet Engine - removeDuplicateRows', () => {
  const rows = [
    ['ID', 'Name'],
    ['1', 'Alice'],
    ['2', 'Bob'],
    ['1', 'Alice'],
  ];
  const unique = removeDuplicateRows(rows);
  assert.strictEqual(unique.length, 3);
});

test('Spreadsheet Engine - filterRows and sortRows', () => {
  const rows = [
    ['Name', 'Score'],
    ['Charlie', '70'],
    ['Alice', '95'],
    ['Bob', '85'],
  ];

  const filtered = filterRows(rows, 0, 'Alice');
  assert.strictEqual(filtered.length, 2);

  const sorted = sortRows(rows, 1, true); // numeric ascending
  assert.strictEqual(sorted[1][0], 'Charlie');
  assert.strictEqual(sorted[3][0], 'Alice');
});

test('Spreadsheet Engine - calculateColumnStats', () => {
  const rows = [
    ['Item', 'Price'],
    ['A', '10'],
    ['B', '20'],
    ['C', '30'],
  ];
  const stats = calculateColumnStats(rows);
  assert.strictEqual(stats.length, 1);
  assert.strictEqual(stats[0].sum, 60);
  assert.strictEqual(stats[0].average, 20);
  assert.strictEqual(stats[0].min, 10);
  assert.strictEqual(stats[0].max, 30);
  assert.strictEqual(stats[0].median, 20);
});

test('Spreadsheet Engine - rowsToHtmlTable', () => {
  const rows = [
    ['Header1', 'Header2'],
    ['Cell1', 'Cell2'],
  ];
  const html = rowsToHtmlTable(rows);
  assert.ok(html.includes('<th>Header1</th>'));
  assert.ok(html.includes('<td>Cell1</td>'));
});
