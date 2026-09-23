import { ToolDefinition } from '../types';

export const CLIENT_FOUNDATION_TOOLS: ToolDefinition[] = [
  // 1. JSON Formatter & Validator
  {
    id: 'tool-json-formatter',
    slug: 'json-formatter',
    name: 'JSON Formatter & Validator',
    shortDescription: 'Beautify, validate, minify, and inspect JSON payloads entirely in your browser.',
    description:
      'A fast, client-side JSON formatter and validator. Clean messy JSON, validate syntax with exact error positions, and minify payloads for production use. Zero data leaves your browser.',
    category: 'developer',
    icon: 'Braces',
    keywords: ['json', 'formatter', 'beautifier', 'validator', 'minify', 'prettify', 'parser'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free Online JSON Formatter & Validator — Fast & 100% Private',
      description:
        'Format, beautify, and validate JSON online. 100% client-side execution ensures your data is never uploaded or logged.',
      keywords: ['json formatter', 'json beautifier', 'json validator', 'online json format', 'private json tools'],
    },
    features: [
      'Prettify with customizable 2-space or 4-space indentation',
      'Minify JSON for compact network payloads',
      'Precise error highlighting with syntax messages',
      'Copy to clipboard with one click',
      '100% client-side: Zero data is transmitted to any server',
    ],
    faqs: [
      {
        question: 'Is my JSON data uploaded to a server?',
        answer: 'No. This tool runs 100% inside your browser using JavaScript. No network requests are made with your data.',
      },
      {
        question: 'Can this tool validate large JSON files?',
        answer: 'Yes, it handles large JSON files up to several megabytes smoothly within your browser memory.',
      },
    ],
  },

  // 2. Base64 Encoder & Decoder
  {
    id: 'tool-base64-converter',
    slug: 'base64-converter',
    name: 'Base64 Encoder & Decoder',
    shortDescription: 'Encode plain text to Base64 or decode Base64 strings to UTF-8 text in real time.',
    description:
      'Instantly convert plain text into Base64 format or decode Base64 strings back to readable UTF-8 text. Includes standard and RFC 4648 URL-safe formatting options.',
    category: 'developer',
    icon: 'Binary',
    keywords: ['base64', 'encoder', 'decoder', 'url safe base64', 'utf8', 'binary'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free Base64 Encoder & Decoder — 100% Private In-Browser Tool',
      description:
        'Encode and decode Base64 strings in real time. Works offline in your browser with zero data storage.',
      keywords: ['base64 encode', 'base64 decode', 'base64 converter', 'url safe base64'],
    },
    features: [
      'Bidirectional encoding and decoding',
      'Supports standard Base64 and RFC 4648 URL-safe Base64',
      'Instant live translation as you type',
      'Clean invalid character detection',
      'Zero server upload: Runs strictly in your browser',
    ],
    faqs: [
      {
        question: 'Is Base64 encryption?',
        answer: 'No. Base64 is an encoding scheme, not encryption. It is used to safely represent binary data in ASCII text format.',
      },
    ],
  },

  // 3. Word & Text Counter
  {
    id: 'tool-word-counter',
    slug: 'word-counter',
    name: 'Word & Text Counter',
    shortDescription: 'Real-time word, character, sentence, paragraph, and reading time statistics.',
    description:
      'Detailed real-time text analysis tool. Count words, characters (with and without spaces), sentences, paragraphs, and calculate estimated reading and speaking times.',
    category: 'text-content',
    icon: 'FileText',
    keywords: ['word counter', 'character counter', 'reading time', 'text statistics', 'sentence counter'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free Online Word & Character Counter — Real-Time Text Statistics',
      description:
        'Analyze your text with instant counts for words, characters, sentences, paragraphs, and reading time. Fully private and browser-based.',
      keywords: ['word count', 'character count', 'reading time calculator', 'text analyzer'],
    },
    features: [
      'Live counts updated instantaneously as you type',
      'Characters with and without whitespace',
      'Average reading and speaking time estimations',
      'Sentence and paragraph counters',
      'Quick case transformation helpers',
    ],
  },

  // 4. UUID Generator
  {
    id: 'tool-uuid-generator',
    slug: 'uuid-generator',
    name: 'UUID / GUID Generator',
    shortDescription: 'Generate cryptographically secure RFC 4122 Version 4 UUIDs in bulk.',
    description:
      'Generate cryptographically secure v4 UUIDs directly in your browser using the native Web Crypto API. Support for bulk generation, uppercase format, and hyphen stripping.',
    category: 'developer',
    icon: 'KeyRound',
    keywords: ['uuid', 'guid', 'v4 uuid', 'random generator', 'crypto uuid', 'unique id'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free Online UUID / GUID v4 Generator — Bulk & Cryptographically Secure',
      description:
        'Generate secure RFC 4122 v4 UUIDs individually or in bulk. 100% browser-based with zero network transmission.',
      keywords: ['uuid generator', 'guid generator', 'v4 uuid online', 'bulk uuid generator'],
    },
    features: [
      'Cryptographically secure generation via Web Crypto API',
      'Bulk generation up to 100 UUIDs per click',
      'Uppercase and lowercase hex options',
      'Optional hyphen removal for compact alphanumeric IDs',
      'Single-item and bulk copy-to-clipboard functionality',
    ],
    faqs: [
      {
        question: 'Are these UUIDs cryptographically secure?',
        answer: 'Yes. They are generated using the browser native crypto.randomUUID() / crypto.getRandomValues API, conforming strictly to RFC 4122 v4.',
      },
    ],
  },

  // 5. URL Encoder / Decoder
  {
    id: 'tool-url-encoder-decoder',
    slug: 'url-encoder-decoder',
    name: 'URL Encoder & Decoder',
    shortDescription: 'Encode and decode URI components and query strings compliant with RFC 3986.',
    description:
      'Convert query strings, special characters, and parameters into percent-encoded URI strings or decode encoded URLs back to readable text in real time.',
    category: 'developer',
    icon: 'Link',
    keywords: ['url encode', 'url decode', 'uri component', 'percent encoding', 'query encoder'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free Online URL Encoder & Decoder — RFC 3986 Compliant',
      description:
        'Encode and decode query strings and full URLs in real time. Private, browser-side tool with zero server requests.',
      keywords: ['url encoder', 'url decoder', 'percent encoding', 'uri component encoder'],
    },
    features: [
      'Component mode (encodeURIComponent) for query parameter values',
      'Full URL mode (encodeURI) preserving protocol and slashes',
      'Instant live bidirectional conversion',
      'Malformed URI sequence error detection',
      'Zero server upload: Runs strictly in your browser',
    ],
  },

  // 6. Hash Generator
  {
    id: 'tool-hash-generator',
    slug: 'hash-generator',
    name: 'Cryptographic Hash Generator',
    shortDescription: 'Generate SHA-256, SHA-384, and SHA-512 hashes using native Web Crypto.',
    description:
      'Compute cryptographic message digests (SHA-256, SHA-384, SHA-512) directly inside your browser. No strings are ever transmitted over the network.',
    category: 'developer',
    icon: 'Hash',
    keywords: ['hash generator', 'sha256', 'sha384', 'sha512', 'checksum', 'crypto hash'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free Online SHA-256 / SHA-512 Hash Generator — 100% Private',
      description:
        'Generate SHA-256, SHA-384, and SHA-512 hashes locally with Web Crypto API. Fast, free, and zero data retention.',
      keywords: ['sha256 generator', 'sha512 online', 'crypto hash generator', 'private hash tool'],
    },
    features: [
      'High-performance Web Crypto API (SubtleCrypto) calculation',
      'Simultaneous generation across SHA-256, SHA-384, and SHA-512',
      'Uppercase and lowercase hexadecimal format toggle',
      'One-click copy for individual hash digests',
      '100% private: Never touches server memory',
    ],
  },

  // 7. Percentage Calculator
  {
    id: 'tool-percentage-calculator',
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    shortDescription: 'Calculate percentage values, percentage increase/decrease, and differences.',
    description:
      'Versatile percentage calculation suite. Solve what is X% of Y, find what percentage X is of Y, calculate percentage increases or decreases, and determine percentage differences.',
    category: 'math-calculators',
    icon: 'Percent',
    keywords: ['percentage calculator', 'calculate percent', 'percentage increase', 'percent decrease', 'percent difference'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free Online Percentage Calculator — Quick Math Utility',
      description:
        'Fast and simple percentage calculator for increases, decreases, fractions, and percentage differences.',
      keywords: ['percentage calculator', 'percent increase calculator', 'percent change', 'math tools'],
    },
    features: [
      'What is X% of Y calculation',
      'X is what percent of Y calculation',
      'Percentage change (increase / decrease) calculation',
      'Percentage difference between two quantities',
      'Live calculation as you type with one-click copy',
    ],
  },

  // 8. Average Calculator
  {
    id: 'tool-average-calculator',
    slug: 'average-calculator',
    name: 'Average & Statistics Calculator',
    shortDescription: 'Calculate mean, median, sum, count, min, max, and range from numbers.',
    description:
      'Enter numbers separated by commas, spaces, or lines to instantly calculate average (mean), median, total sum, minimum, maximum, count, and mathematical range.',
    category: 'math-calculators',
    icon: 'Calculator',
    keywords: ['average calculator', 'mean calculator', 'median', 'statistics calculator', 'sum calculator'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Free Online Average & Median Calculator — Instant Statistics',
      description:
        'Calculate mean, median, sum, min, max, and range from any list of numbers. Fast, private, and flexible formatting.',
      keywords: ['average calculator', 'mean median calculator', 'calculate average', 'math statistics'],
    },
    features: [
      'Computes Mean (Arithmetic Average) and Median',
      'Calculates Sum, Count, Minimum, Maximum, and Range',
      'Accepts commas, newlines, tabs, and spaces as separators',
      'Supports negative values and floating-point decimals',
      'Flags non-numeric tokens without interrupting calculations',
    ],
  },

  // 9. Ratio Calculator
  {
    id: 'tool-ratio-calculator',
    slug: 'ratio-calculator',
    name: 'Ratio & Proportion Calculator',
    shortDescription: 'Simplify ratios using GCD and solve proportions (A : B = C : D).',
    description:
      'Simplify ratios to their lowest terms using the greatest common divisor (GCD) and solve equivalent proportions (A:B = C:D) by finding missing values.',
    category: 'math-calculators',
    icon: 'Scale',
    keywords: ['ratio calculator', 'simplify ratio', 'proportion calculator', 'solve ratio', 'equivalent ratio'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Free Online Ratio & Proportion Calculator',
      description:
        'Simplify ratios and solve proportion equations (A:B = C:D) instantly with step-by-step results.',
      keywords: ['ratio calculator', 'simplify ratio', 'solve proportion', 'aspect ratio calculator'],
    },
    features: [
      'Simplify ratios A:B to irreducible lowest terms',
      'Computes Greatest Common Divisor (GCD) and decimal ratio',
      'Solves proportion A:B = C:D for any missing term',
      'Handles integers and floating-point decimals',
    ],
  },

  // 10. Discount Calculator
  {
    id: 'tool-discount-calculator',
    slug: 'discount-calculator',
    name: 'Discount & Sale Calculator',
    shortDescription: 'Calculate discounted price, total savings, and post-discount sales tax.',
    description:
      'Easily calculate sale prices and dollar savings with percentage discounts. Includes optional sales tax addition and quick preset discount buttons.',
    category: 'finance',
    icon: 'Tag',
    keywords: ['discount calculator', 'sale calculator', 'percent off', 'shopping calculator', 'savings calculator'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Free Online Discount & Sale Calculator — Savings & Tax',
      description:
        'Calculate sale prices, percentage discounts, and final totals with tax. Quick presets for instant shopping math.',
      keywords: ['discount calculator', 'percent off calculator', 'sale price calculator'],
    },
    features: [
      'Calculates final discounted price and exact dollar savings',
      'Optional sales tax calculation applied after discount',
      'Quick discount presets (10%, 20%, 25%, 50%, etc.)',
      'Clear breakdown of pre-tax and total amounts',
    ],
  },

  // 11. Case Converter
  {
    id: 'tool-case-converter',
    slug: 'case-converter',
    name: 'Text Case Converter',
    shortDescription: 'Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case, and more.',
    description:
      'Transform text instantly into 9 standard capitalization formats: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, and CONSTANT_CASE.',
    category: 'text-content',
    icon: 'Type',
    keywords: ['case converter', 'uppercase', 'lowercase', 'title case', 'camelcase', 'snake case', 'kebab case'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Free Online Case Converter — UPPERCASE, camelCase, snake_case',
      description:
        'Convert text to uppercase, lowercase, title case, camelCase, snake_case, and kebab-case. Fast and 100% private.',
      keywords: ['case converter', 'camelcase converter', 'title case online', 'snake case converter'],
    },
    features: [
      'Supports 9 standard programming and typography cases',
      'Preserves Unicode and multilingual characters',
      'Live character and word counts',
      'One-click copy of transformed text',
    ],
  },

  // 12. Duplicate Line Remover
  {
    id: 'tool-duplicate-line-remover',
    slug: 'duplicate-line-remover',
    name: 'Duplicate Line Remover',
    shortDescription: 'Remove duplicate lines from text lists while preserving original order.',
    description:
      'Clean text lists, log outputs, and data files by eliminating duplicate lines. Features case-sensitivity options, whitespace trimming, and removed count statistics.',
    category: 'text-content',
    icon: 'ListFilter',
    keywords: ['duplicate line remover', 'remove duplicates', 'dedupe lines', 'unique lines', 'clean text'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Free Duplicate Line Remover — Fast & Private Text Deduplicator',
      description:
        'Remove duplicate lines from text files and lists. Preserves initial order with optional case sensitivity and trimming.',
      keywords: ['duplicate line remover', 'remove duplicate lines', 'deduplicate list online'],
    },
    features: [
      'Preserves initial line occurrence ordering',
      'Case-sensitive or case-insensitive matching toggle',
      'Optional whitespace trimming before comparison',
      'Removes empty lines automatically if enabled',
      'Live comparison metrics: original, unique, and removed count',
    ],
  },

  // 13. Text Diff Comparison
  {
    id: 'tool-text-diff',
    slug: 'text-diff',
    name: 'Text Diff & Comparison Tool',
    shortDescription: 'Compare two text snippets and highlight line-by-line additions and deletions.',
    description:
      'Fast, client-side text diff utility. Compare original and modified text side-by-side with color-coded additions, deletions, and unchanged line highlights.',
    category: 'text-content',
    icon: 'GitCompare',
    keywords: ['text diff', 'compare text', 'diff tool', 'code diff', 'difference checker'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free Online Text Diff Tool — Compare Text & Code Privately',
      description:
        'Compare two text documents or code snippets. Clean line-by-line diff highlights additions and deletions locally in browser.',
      keywords: ['text diff', 'compare text online', 'diff checker', 'code comparison'],
    },
    features: [
      'Line-by-line Longest Common Subsequence (LCS) algorithm',
      'Color-coded diff viewer (+ additions in green, - deletions in red)',
      'Accurate line numbering for both documents',
      'Summary metrics (+X additions, -Y deletions, Z unchanged)',
      'One-click copy of unified diff report',
    ],
  },
];
