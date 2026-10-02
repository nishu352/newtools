import { PublicWorkspace } from './workspace-types';

export const spreadsheetWorkspaces: PublicWorkspace[] = [
  {
    id: 'ws-spreadsheet-workspace',
    slug: 'spreadsheet-workspace',
    name: 'Spreadsheet',
    category: 'excel',
    description: 'In-browser spreadsheet data viewer, clean rows, calculate statistical summaries, and transpose data tables.',
    icon: 'Table',
    defaultModeId: 'viewer',
    searchableAliases: ['view excel', 'excel cleaner', 'csv viewer', 'spreadsheet stats', 'excel table viewer'],
    capabilitySlugs: ['spreadsheet-viewer', 'spreadsheet-cleaner'],
    modes: [
      {
        id: 'viewer',
        label: 'Spreadsheet Viewer',
        description: 'Inspect rows, columns, and data tables entirely in your browser without uploading to third parties.',
        capabilitySlug: 'spreadsheet-viewer',
        aliases: ['open xlsx', 'view csv online'],
        acceptedFormats: ['.xlsx', '.csv', '.tsv'],
      },
      {
        id: 'cleaner',
        label: 'Spreadsheet Clean & Statistics',
        description: 'Compute sum, average, min, max, median, remove duplicate rows, and transpose matrices.',
        capabilitySlug: 'spreadsheet-cleaner',
        aliases: ['clean excel data', 'transpose table', 'deduplicate rows'],
        acceptedFormats: ['.xlsx', '.csv', '.tsv'],
      },
    ],
  },
  {
    id: 'ws-spreadsheet-converter',
    slug: 'spreadsheet-converter',
    name: 'Spreadsheet Converter',
    category: 'excel',
    description: 'Bidirectional spreadsheet conversion between CSV, TSV, modern Excel (XLSX) workbooks, and JSON data.',
    icon: 'FileSpreadsheet',
    defaultModeId: 'csv-to-excel',
    searchableAliases: ['csv to excel', 'excel to csv', 'excel to json', 'json to excel', 'spreadsheet converter'],
    capabilitySlugs: ['csv-to-excel', 'spreadsheet-to-json'],
    modes: [
      {
        id: 'csv-to-excel',
        label: 'CSV ↔ Excel (XLSX)',
        description: 'Bidirectional spreadsheet converter between CSV/TSV and modern Microsoft Excel workbooks.',
        capabilitySlug: 'csv-to-excel',
        aliases: ['csv to xlsx', 'excel to csv'],
        acceptedFormats: ['.csv', '.tsv', '.xlsx'],
        outputFormats: ['.xlsx', '.csv'],
      },
      {
        id: 'spreadsheet-to-json',
        label: 'Spreadsheet ↔ JSON',
        description: 'Transform spreadsheet rows into clean JSON arrays with header mapping, or generate XLSX from JSON.',
        capabilitySlug: 'spreadsheet-to-json',
        aliases: ['excel to json', 'json to xlsx', 'csv to json'],
        acceptedFormats: ['.xlsx', '.csv', '.json'],
        outputFormats: ['.json', '.xlsx'],
      },
    ],
  },
];
