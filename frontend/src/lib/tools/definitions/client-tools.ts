import { ToolDefinition } from '../types';

export const CLIENT_FOUNDATION_TOOLS: ToolDefinition[] = [
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
      'Precise error highlighting with line and column numbers',
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
  {
    id: 'tool-base64-converter',
    slug: 'base64-converter',
    name: 'Base64 Encoder & Decoder',
    shortDescription: 'Encode plain text to Base64 or decode Base64 strings to UTF-8 text in real time.',
    description:
      'Instantly convert plain text into Base64 format or decode Base64 strings back to readable UTF-8 text. Includes standard and URL-safe formatting options.',
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
      'Case transformation helpers (UPPERCASE, lowercase, Title Case)',
    ],
  },
];
